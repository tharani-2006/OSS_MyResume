"""
Product Service - Product Catalog & Inventory Management
Handles product listings, categories, inventory, and search
"""

from fastapi import FastAPI, HTTPException, Depends, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Text, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from datetime import datetime
import os
from typing import Optional, List
from pydantic import BaseModel, validator
import redis
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import logging
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Product Service - Catalog & Inventory",
    description="Microservice for product management, catalog, and inventory",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Redis for caching and rate limiting
redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST', 'localhost'),
    port=int(os.getenv('REDIS_PORT', 6379)),
    decode_responses=True
)

# Rate limiting
limiter = Limiter(key_func=get_remote_address, storage_uri="redis://localhost:6379")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/product_db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    parent_id = Column(Integer, ForeignKey("categories.id"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text)
    sku = Column(String(50), unique=True, nullable=False, index=True)
    price = Column(Float, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    brand = Column(String(100))
    tags = Column(Text)  # JSON string for search tags
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    category = relationship("Category", back_populates="products")
    inventory = relationship("Inventory", back_populates="product", uselist=False)

class Inventory(Base):
    __tablename__ = "inventory"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), unique=True)
    quantity = Column(Integer, default=0)
    reserved_quantity = Column(Integer, default=0)
    min_stock_level = Column(Integer, default=10)
    max_stock_level = Column(Integer, default=1000)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    product = relationship("Product", back_populates="inventory")

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic Models
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    parent_id: Optional[int] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    sku: str
    price: float
    category_id: int
    brand: Optional[str] = None
    tags: Optional[str] = None

    @validator('price')
    def validate_price(cls, v):
        if v <= 0:
            raise ValueError('Price must be positive')
        return v

class ProductCreate(ProductBase):
    initial_quantity: Optional[int] = 0

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[int] = None
    brand: Optional[str] = None
    tags: Optional[str] = None

class ProductResponse(ProductBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    inventory: Optional['InventoryResponse'] = None
    
    class Config:
        from_attributes = True

class InventoryBase(BaseModel):
    quantity: int
    min_stock_level: Optional[int] = 10
    max_stock_level: Optional[int] = 1000

class InventoryUpdate(BaseModel):
    quantity: Optional[int] = None
    min_stock_level: Optional[int] = None
    max_stock_level: Optional[int] = None

class InventoryResponse(InventoryBase):
    id: int
    product_id: int
    reserved_quantity: int
    last_updated: datetime
    
    class Config:
        from_attributes = True

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cache helper functions
def get_cache_key(prefix: str, *args) -> str:
    return f"{prefix}:{':'.join(map(str, args))}"

def cache_product(product_id: int, product_data: dict):
    try:
        cache_key = get_cache_key("product", product_id)
        redis_client.setex(cache_key, 300, json.dumps(product_data, default=str))
    except Exception as e:
        logger.error(f"Cache error: {e}")

def get_cached_product(product_id: int):
    try:
        cache_key = get_cache_key("product", product_id)
        cached = redis_client.get(cache_key)
        return json.loads(cached) if cached else None
    except Exception as e:
        logger.error(f"Cache error: {e}")
        return None

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "product-service", "timestamp": datetime.utcnow()}

# Category endpoints
@app.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
async def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    try:
        db_category = Category(**category.dict())
        db.add(db_category)
        db.commit()
        db.refresh(db_category)
        logger.info(f"Category created: {db_category.id}")
        return db_category
    except Exception as e:
        logger.error(f"Error creating category: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/categories", response_model=List[CategoryResponse])
@limiter.limit("50/minute")
async def get_categories(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    active_only: bool = Query(True),
    db: Session = Depends(get_db)
):
    query = db.query(Category)
    if active_only:
        query = query.filter(Category.is_active == True)
    
    categories = query.offset(skip).limit(limit).all()
    return categories

# Product endpoints
@app.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("20/minute")
async def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    try:
        # Check if SKU already exists
        existing_product = db.query(Product).filter(Product.sku == product.sku).first()
        if existing_product:
            raise HTTPException(status_code=400, detail="SKU already exists")
        
        # Create product
        product_data = product.dict()
        initial_quantity = product_data.pop('initial_quantity', 0)
        
        db_product = Product(**product_data)
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        
        # Create inventory record
        db_inventory = Inventory(
            product_id=db_product.id,
            quantity=initial_quantity
        )
        db.add(db_inventory)
        db.commit()
        db.refresh(db_inventory)
        
        # Cache the product
        product_dict = {
            "id": db_product.id,
            "name": db_product.name,
            "sku": db_product.sku,
            "price": db_product.price,
            "quantity": db_inventory.quantity
        }
        cache_product(db_product.id, product_dict)
        
        logger.info(f"Product created: {db_product.id}")
        return db_product
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating product: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/products", response_model=List[ProductResponse])
@limiter.limit("100/minute")
async def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    category_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    active_only: bool = Query(True),
    db: Session = Depends(get_db)
):
    query = db.query(Product)
    
    if active_only:
        query = query.filter(Product.is_active == True)
    
    if category_id:
        query = query.filter(Product.category_id == category_id)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            Product.name.ilike(search_term) |
            Product.description.ilike(search_term) |
            Product.brand.ilike(search_term) |
            Product.tags.ilike(search_term)
        )
    
    products = query.offset(skip).limit(limit).all()
    return products

@app.get("/products/{product_id}", response_model=ProductResponse)
@limiter.limit("200/minute")
async def get_product(product_id: int, db: Session = Depends(get_db)):
    # Try cache first
    cached_product = get_cached_product(product_id)
    if cached_product:
        return cached_product
    
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Cache the product
    product_dict = {
        "id": product.id,
        "name": product.name,
        "sku": product.sku,
        "price": product.price,
        "description": product.description,
        "brand": product.brand,
        "category_id": product.category_id,
        "is_active": product.is_active,
        "created_at": product.created_at,
        "updated_at": product.updated_at
    }
    cache_product(product_id, product_dict)
    
    return product

@app.put("/products/{product_id}", response_model=ProductResponse)
@limiter.limit("20/minute")
async def update_product(product_id: int, product_update: ProductUpdate, db: Session = Depends(get_db)):
    try:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        update_data = product_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(product, key, value)
        
        product.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(product)
        
        # Invalidate cache
        cache_key = get_cache_key("product", product_id)
        redis_client.delete(cache_key)
        
        logger.info(f"Product updated: {product_id}")
        return product
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating product: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Inventory endpoints
@app.get("/products/{product_id}/inventory", response_model=InventoryResponse)
@limiter.limit("100/minute")
async def get_inventory(product_id: int, db: Session = Depends(get_db)):
    inventory = db.query(Inventory).filter(Inventory.product_id == product_id).first()
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventory not found")
    return inventory

@app.put("/products/{product_id}/inventory", response_model=InventoryResponse)
@limiter.limit("20/minute")
async def update_inventory(product_id: int, inventory_update: InventoryUpdate, db: Session = Depends(get_db)):
    try:
        inventory = db.query(Inventory).filter(Inventory.product_id == product_id).first()
        if not inventory:
            raise HTTPException(status_code=404, detail="Inventory not found")
        
        update_data = inventory_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(inventory, key, value)
        
        inventory.last_updated = datetime.utcnow()
        db.commit()
        db.refresh(inventory)
        
        # Invalidate product cache
        cache_key = get_cache_key("product", product_id)
        redis_client.delete(cache_key)
        
        logger.info(f"Inventory updated for product: {product_id}")
        return inventory
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating inventory: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/products/{product_id}/inventory/reserve")
@limiter.limit("50/minute")
async def reserve_inventory(product_id: int, quantity: int, db: Session = Depends(get_db)):
    try:
        inventory = db.query(Inventory).filter(Inventory.product_id == product_id).first()
        if not inventory:
            raise HTTPException(status_code=404, detail="Inventory not found")
        
        available_quantity = inventory.quantity - inventory.reserved_quantity
        if available_quantity < quantity:
            raise HTTPException(status_code=400, detail="Insufficient inventory")
        
        inventory.reserved_quantity += quantity
        db.commit()
        
        logger.info(f"Reserved {quantity} units for product {product_id}")
        return {"message": "Inventory reserved", "reserved_quantity": quantity}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error reserving inventory: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/products/{product_id}/inventory/release")
@limiter.limit("50/minute")
async def release_inventory(product_id: int, quantity: int, db: Session = Depends(get_db)):
    try:
        inventory = db.query(Inventory).filter(Inventory.product_id == product_id).first()
        if not inventory:
            raise HTTPException(status_code=404, detail="Inventory not found")
        
        if inventory.reserved_quantity < quantity:
            raise HTTPException(status_code=400, detail="Cannot release more than reserved")
        
        inventory.reserved_quantity -= quantity
        db.commit()
        
        logger.info(f"Released {quantity} units for product {product_id}")
        return {"message": "Inventory released", "released_quantity": quantity}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error releasing inventory: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
