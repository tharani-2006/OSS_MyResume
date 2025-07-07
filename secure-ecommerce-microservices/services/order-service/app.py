"""
Order Service - Order Management & Processing
Handles order creation, tracking, payments, and fulfillment
"""

from fastapi import FastAPI, HTTPException, Depends, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Text, Float, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from datetime import datetime, timedelta
import os
import enum
from typing import Optional, List
from pydantic import BaseModel, validator
import redis
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import logging
import json
import uuid
import requests

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Order Service - Order Management",
    description="Microservice for order processing, tracking, and fulfillment",
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
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/order_db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Service URLs
PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL", "http://localhost:8002")
USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://localhost:8001")
NOTIFICATION_SERVICE_URL = os.getenv("NOTIFICATION_SERVICE_URL", "http://localhost:8004")

# Enums
class OrderStatus(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"

class PaymentStatus(enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

# Database Models
class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, nullable=False, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    total_amount = Column(Float, nullable=False)
    tax_amount = Column(Float, default=0.0)
    shipping_amount = Column(Float, default=0.0)
    discount_amount = Column(Float, default=0.0)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    payment_method = Column(String(50))
    payment_transaction_id = Column(String(100))
    shipping_address = Column(Text)
    billing_address = Column(Text)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    shipped_at = Column(DateTime)
    delivered_at = Column(DateTime)
    
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, nullable=False)
    product_name = Column(String(200), nullable=False)
    product_sku = Column(String(50), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    
    order = relationship("Order", back_populates="items")

class OrderHistory(Base):
    __tablename__ = "order_history"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    status = Column(String(50), nullable=False)
    comment = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(String(100))

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic Models
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

    @validator('quantity')
    def validate_quantity(cls, v):
        if v <= 0:
            raise ValueError('Quantity must be positive')
        return v

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_sku: str
    quantity: int
    unit_price: float
    total_price: float
    
    class Config:
        from_attributes = True

class AddressInfo(BaseModel):
    street: str
    city: str
    state: str
    postal_code: str
    country: str

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shipping_address: AddressInfo
    billing_address: Optional[AddressInfo] = None
    payment_method: str
    notes: Optional[str] = None

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    payment_status: Optional[PaymentStatus] = None
    payment_transaction_id: Optional[str] = None
    notes: Optional[str] = None

class OrderResponse(BaseModel):
    id: int
    order_number: str
    user_id: int
    status: OrderStatus
    total_amount: float
    tax_amount: float
    shipping_amount: float
    discount_amount: float
    payment_status: PaymentStatus
    payment_method: Optional[str]
    payment_transaction_id: Optional[str]
    shipping_address: Optional[str]
    billing_address: Optional[str]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    shipped_at: Optional[datetime]
    delivered_at: Optional[datetime]
    items: List[OrderItemResponse]
    
    class Config:
        from_attributes = True

class OrderHistoryResponse(BaseModel):
    id: int
    order_id: int
    status: str
    comment: Optional[str]
    created_at: datetime
    created_by: Optional[str]
    
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

# Helper functions
def generate_order_number() -> str:
    """Generate unique order number"""
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    random_suffix = str(uuid.uuid4())[:8]
    return f"ORD-{timestamp}-{random_suffix.upper()}"

def calculate_tax(amount: float) -> float:
    """Calculate tax amount (8.5% for demo)"""
    return round(amount * 0.085, 2)

def calculate_shipping(items_count: int) -> float:
    """Calculate shipping cost"""
    if items_count == 0:
        return 0.0
    elif items_count <= 3:
        return 9.99
    else:
        return 14.99

async def get_product_info(product_id: int) -> dict:
    """Get product information from product service"""
    try:
        response = requests.get(f"{PRODUCT_SERVICE_URL}/products/{product_id}", timeout=5)
        if response.status_code == 200:
            return response.json()
        return None
    except Exception as e:
        logger.error(f"Error fetching product {product_id}: {e}")
        return None

async def reserve_inventory(product_id: int, quantity: int) -> bool:
    """Reserve inventory in product service"""
    try:
        response = requests.post(
            f"{PRODUCT_SERVICE_URL}/products/{product_id}/inventory/reserve",
            json={"quantity": quantity},
            timeout=5
        )
        return response.status_code == 200
    except Exception as e:
        logger.error(f"Error reserving inventory for product {product_id}: {e}")
        return False

async def send_notification(user_id: int, message: str, notification_type: str = "order"):
    """Send notification via notification service"""
    try:
        requests.post(
            f"{NOTIFICATION_SERVICE_URL}/notifications",
            json={
                "user_id": user_id,
                "message": message,
                "type": notification_type
            },
            timeout=5
        )
    except Exception as e:
        logger.error(f"Error sending notification: {e}")

def add_order_history(db: Session, order_id: int, status: str, comment: str = None, created_by: str = None):
    """Add entry to order history"""
    history = OrderHistory(
        order_id=order_id,
        status=status,
        comment=comment,
        created_by=created_by
    )
    db.add(history)
    db.commit()

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "order-service", "timestamp": datetime.utcnow()}

# Order endpoints
@app.post("/orders", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
async def create_order(
    order: OrderCreate,
    user_id: int,  # In real app, this would come from JWT token
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    try:
        # Validate and get product information
        order_items = []
        total_amount = 0.0
        
        for item in order.items:
            product_info = await get_product_info(item.product_id)
            if not product_info:
                raise HTTPException(status_code=400, detail=f"Product {item.product_id} not found")
            
            # Check inventory and reserve
            if not await reserve_inventory(item.product_id, item.quantity):
                raise HTTPException(status_code=400, detail=f"Insufficient inventory for product {item.product_id}")
            
            item_total = product_info["price"] * item.quantity
            total_amount += item_total
            
            order_items.append({
                "product_id": item.product_id,
                "product_name": product_info["name"],
                "product_sku": product_info["sku"],
                "quantity": item.quantity,
                "unit_price": product_info["price"],
                "total_price": item_total
            })
        
        # Calculate totals
        tax_amount = calculate_tax(total_amount)
        shipping_amount = calculate_shipping(len(order.items))
        final_total = total_amount + tax_amount + shipping_amount
        
        # Create order
        order_number = generate_order_number()
        db_order = Order(
            order_number=order_number,
            user_id=user_id,
            total_amount=final_total,
            tax_amount=tax_amount,
            shipping_amount=shipping_amount,
            payment_method=order.payment_method,
            shipping_address=json.dumps(order.shipping_address.dict()),
            billing_address=json.dumps((order.billing_address or order.shipping_address).dict()),
            notes=order.notes
        )
        db.add(db_order)
        db.commit()
        db.refresh(db_order)
        
        # Create order items
        for item_data in order_items:
            db_item = OrderItem(order_id=db_order.id, **item_data)
            db.add(db_item)
        
        db.commit()
        
        # Add to order history
        add_order_history(db, db_order.id, "Order Created", "Order successfully created")
        
        # Send notification in background
        background_tasks.add_task(
            send_notification,
            user_id,
            f"Your order {order_number} has been created successfully!"
        )
        
        logger.info(f"Order created: {order_number} for user {user_id}")
        return db_order
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating order: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/orders", response_model=List[OrderResponse])
@limiter.limit("50/minute")
async def get_orders(
    user_id: int,  # In real app, this would come from JWT token
    skip: int = 0,
    limit: int = 20,
    status_filter: Optional[OrderStatus] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Order).filter(Order.user_id == user_id)
    
    if status_filter:
        query = query.filter(Order.status == status_filter)
    
    orders = query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    return orders

@app.get("/orders/{order_id}", response_model=OrderResponse)
@limiter.limit("100/minute")
async def get_order(
    order_id: int,
    user_id: int,  # In real app, this would come from JWT token
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == user_id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order

@app.put("/orders/{order_id}", response_model=OrderResponse)
@limiter.limit("20/minute")
async def update_order(
    order_id: int,
    order_update: OrderUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        old_status = order.status
        update_data = order_update.dict(exclude_unset=True)
        
        for key, value in update_data.items():
            setattr(order, key, value)
        
        # Update timestamps based on status
        if order_update.status:
            if order_update.status == OrderStatus.SHIPPED and not order.shipped_at:
                order.shipped_at = datetime.utcnow()
            elif order_update.status == OrderStatus.DELIVERED and not order.delivered_at:
                order.delivered_at = datetime.utcnow()
        
        order.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(order)
        
        # Add to order history if status changed
        if order_update.status and order_update.status != old_status:
            add_order_history(
                db, 
                order_id, 
                f"Status changed to {order_update.status.value}",
                f"Order status updated from {old_status.value} to {order_update.status.value}"
            )
            
            # Send notification
            background_tasks.add_task(
                send_notification,
                order.user_id,
                f"Your order {order.order_number} status has been updated to {order_update.status.value}"
            )
        
        logger.info(f"Order updated: {order_id}")
        return order
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating order: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/orders/{order_id}/history", response_model=List[OrderHistoryResponse])
@limiter.limit("50/minute")
async def get_order_history(order_id: int, db: Session = Depends(get_db)):
    # Verify order exists
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    history = db.query(OrderHistory).filter(
        OrderHistory.order_id == order_id
    ).order_by(OrderHistory.created_at.desc()).all()
    
    return history

@app.post("/orders/{order_id}/cancel")
@limiter.limit("10/minute")
async def cancel_order(
    order_id: int,
    reason: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        if order.status not in [OrderStatus.PENDING, OrderStatus.CONFIRMED]:
            raise HTTPException(status_code=400, detail="Order cannot be cancelled")
        
        # Release reserved inventory
        for item in order.items:
            try:
                requests.post(
                    f"{PRODUCT_SERVICE_URL}/products/{item.product_id}/inventory/release",
                    json={"quantity": item.quantity},
                    timeout=5
                )
            except Exception as e:
                logger.error(f"Error releasing inventory: {e}")
        
        order.status = OrderStatus.CANCELLED
        order.updated_at = datetime.utcnow()
        db.commit()
        
        # Add to order history
        add_order_history(db, order_id, "Order Cancelled", reason)
        
        # Send notification
        background_tasks.add_task(
            send_notification,
            order.user_id,
            f"Your order {order.order_number} has been cancelled. Reason: {reason}"
        )
        
        logger.info(f"Order cancelled: {order_id}")
        return {"message": "Order cancelled successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error cancelling order: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Admin endpoints
@app.get("/admin/orders", response_model=List[OrderResponse])
@limiter.limit("100/minute")
async def get_all_orders(
    skip: int = 0,
    limit: int = 50,
    status_filter: Optional[OrderStatus] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Order)
    
    if status_filter:
        query = query.filter(Order.status == status_filter)
    
    orders = query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    return orders

@app.get("/admin/orders/stats")
@limiter.limit("20/minute")
async def get_order_stats(db: Session = Depends(get_db)):
    try:
        total_orders = db.query(Order).count()
        pending_orders = db.query(Order).filter(Order.status == OrderStatus.PENDING).count()
        completed_orders = db.query(Order).filter(Order.status == OrderStatus.DELIVERED).count()
        cancelled_orders = db.query(Order).filter(Order.status == OrderStatus.CANCELLED).count()
        
        # Revenue stats
        total_revenue = db.query(Order).filter(
            Order.payment_status == PaymentStatus.COMPLETED
        ).with_entities(db.func.sum(Order.total_amount)).scalar() or 0
        
        # Today's orders
        today = datetime.utcnow().date()
        today_orders = db.query(Order).filter(
            db.func.date(Order.created_at) == today
        ).count()
        
        return {
            "total_orders": total_orders,
            "pending_orders": pending_orders,
            "completed_orders": completed_orders,
            "cancelled_orders": cancelled_orders,
            "total_revenue": total_revenue,
            "today_orders": today_orders
        }
    except Exception as e:
        logger.error(f"Error getting order stats: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
