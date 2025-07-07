"""
API Gateway - Centralized Gateway & Load Balancer
Handles routing, authentication, rate limiting, and API orchestration
"""

from fastapi import FastAPI, HTTPException, Depends, status, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
import httpx
import os
import json
import time
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import redis
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import logging
from jose import JWTError, jwt
import hashlib

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="API Gateway - Secure Microservices Gateway",
    description="Centralized gateway for microservices with authentication, rate limiting, and routing",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Security
security = HTTPBearer(auto_error=False)

# Redis for caching, rate limiting, and analytics
redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST', 'localhost'),
    port=int(os.getenv('REDIS_PORT', 6379)),
    decode_responses=True
)

# Rate limiting
limiter = Limiter(key_func=get_remote_address, storage_uri="redis://localhost:6379")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-super-secret-jwt-key-change-in-production")
ALGORITHM = "HS256"

# Service Configuration
SERVICES = {
    "user": {
        "url": os.getenv("USER_SERVICE_URL", "http://localhost:8001"),
        "health_endpoint": "/health",
        "timeout": 30
    },
    "product": {
        "url": os.getenv("PRODUCT_SERVICE_URL", "http://localhost:8002"),
        "health_endpoint": "/health",
        "timeout": 30
    },
    "order": {
        "url": os.getenv("ORDER_SERVICE_URL", "http://localhost:8003"),
        "health_endpoint": "/health",
        "timeout": 30
    },
    "notification": {
        "url": os.getenv("NOTIFICATION_SERVICE_URL", "http://localhost:8004"),
        "health_endpoint": "/health",
        "timeout": 30
    }
}

# Route Configuration
ROUTES = {
    "/api/v1/auth": "user",
    "/api/v1/users": "user",
    "/api/v1/products": "product",
    "/api/v1/categories": "product",
    "/api/v1/inventory": "product",
    "/api/v1/orders": "order",
    "/api/v1/notifications": "notification",
    "/api/v1/preferences": "notification"
}

# Protected routes that require authentication
PROTECTED_ROUTES = [
    "/api/v1/orders",
    "/api/v1/users/profile",
    "/api/v1/notifications",
    "/api/v1/preferences"
]

# Admin routes that require admin role
ADMIN_ROUTES = [
    "/api/v1/admin",
    "/api/v1/users/admin",
    "/api/v1/orders/admin"
]

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure properly in production
)

# Circuit breaker state
circuit_breaker_state = {}

def get_circuit_breaker_key(service: str) -> str:
    return f"circuit_breaker:{service}"

def is_circuit_open(service: str) -> bool:
    """Check if circuit breaker is open for a service"""
    key = get_circuit_breaker_key(service)
    try:
        state = redis_client.hgetall(key)
        if not state:
            return False
        
        failure_count = int(state.get('failures', 0))
        last_failure = float(state.get('last_failure', 0))
        
        # If failure count exceeds threshold and within timeout window
        if failure_count >= 5 and (time.time() - last_failure) < 60:  # 1 minute timeout
            return True
        
        # Reset if timeout has passed
        if (time.time() - last_failure) >= 60:
            redis_client.delete(key)
        
        return False
    except Exception as e:
        logger.error(f"Circuit breaker error: {e}")
        return False

def record_success(service: str):
    """Record successful request"""
    key = get_circuit_breaker_key(service)
    redis_client.delete(key)

def record_failure(service: str):
    """Record failed request"""
    key = get_circuit_breaker_key(service)
    try:
        redis_client.hincrby(key, 'failures', 1)
        redis_client.hset(key, 'last_failure', time.time())
        redis_client.expire(key, 300)  # 5 minutes expiry
    except Exception as e:
        logger.error(f"Error recording failure: {e}")

def verify_jwt_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        logger.error(f"JWT verification error: {e}")
        return None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[Dict[str, Any]]:
    """Get current user from JWT token"""
    if not credentials:
        return None
    
    token = credentials.credentials
    payload = verify_jwt_token(token)
    
    if not payload:
        return None
    
    return {
        "user_id": payload.get("sub"),
        "username": payload.get("username"),
        "email": payload.get("email"),
        "role": payload.get("role", "user"),
        "exp": payload.get("exp")
    }

def require_authentication(user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """Require valid authentication"""
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def require_admin(user: Dict[str, Any] = Depends(require_authentication)) -> Dict[str, Any]:
    """Require admin role"""
    if user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return user

def get_service_for_path(path: str) -> Optional[str]:
    """Determine which service should handle the request"""
    for route_prefix, service in ROUTES.items():
        if path.startswith(route_prefix):
            return service
    return None

def is_route_protected(path: str) -> bool:
    """Check if route requires authentication"""
    return any(path.startswith(protected) for protected in PROTECTED_ROUTES)

def is_admin_route(path: str) -> bool:
    """Check if route requires admin access"""
    return any(path.startswith(admin) for admin in ADMIN_ROUTES)

def log_request(request: Request, response_time: float, status_code: int, service: str = None):
    """Log request for analytics"""
    try:
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "method": request.method,
            "path": str(request.url.path),
            "query": str(request.url.query),
            "status_code": status_code,
            "response_time": response_time,
            "service": service,
            "client_ip": request.client.host,
            "user_agent": request.headers.get("user-agent", "")
        }
        
        # Store in Redis for analytics (keep for 24 hours)
        redis_client.lpush("api_logs", json.dumps(log_data))
        redis_client.expire("api_logs", 86400)
        
        # Store daily stats
        date_key = datetime.utcnow().strftime("%Y-%m-%d")
        redis_client.hincrby(f"daily_stats:{date_key}", "total_requests", 1)
        redis_client.hincrby(f"daily_stats:{date_key}", f"status_{status_code}", 1)
        if service:
            redis_client.hincrby(f"daily_stats:{date_key}", f"service_{service}", 1)
        redis_client.expire(f"daily_stats:{date_key}", 604800)  # 7 days
        
    except Exception as e:
        logger.error(f"Error logging request: {e}")

async def forward_request(request: Request, service: str, target_path: str) -> Response:
    """Forward request to target service"""
    service_config = SERVICES.get(service)
    if not service_config:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Check circuit breaker
    if is_circuit_open(service):
        raise HTTPException(
            status_code=503, 
            detail=f"Service {service} is temporarily unavailable"
        )
    
    service_url = service_config["url"]
    timeout = service_config["timeout"]
    
    # Prepare request
    url = f"{service_url}{target_path}"
    if request.url.query:
        url += f"?{request.url.query}"
    
    headers = dict(request.headers)
    # Remove host header to avoid conflicts
    headers.pop("host", None)
    
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            # Get request body
            body = await request.body()
            
            response = await client.request(
                method=request.method,
                url=url,
                headers=headers,
                content=body
            )
            
            record_success(service)
            
            # Return response
            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=dict(response.headers),
                media_type=response.headers.get("content-type")
            )
            
    except httpx.TimeoutException:
        record_failure(service)
        logger.error(f"Timeout forwarding to {service}: {url}")
        raise HTTPException(status_code=504, detail="Gateway timeout")
    except httpx.ConnectError:
        record_failure(service)
        logger.error(f"Connection error forwarding to {service}: {url}")
        raise HTTPException(status_code=503, detail="Service unavailable")
    except Exception as e:
        record_failure(service)
        logger.error(f"Error forwarding to {service}: {e}")
        raise HTTPException(status_code=502, detail="Bad gateway")

# Health check
@app.get("/health")
async def health_check():
    """Gateway health check"""
    return {
        "status": "healthy",
        "service": "api-gateway",
        "timestamp": datetime.utcnow(),
        "version": "1.0.0"
    }

# Service health checks
@app.get("/health/services")
@limiter.limit("10/minute")
async def check_services_health():
    """Check health of all services"""
    health_status = {}
    
    async with httpx.AsyncClient(timeout=10) as client:
        for service_name, config in SERVICES.items():
            try:
                url = f"{config['url']}{config['health_endpoint']}"
                response = await client.get(url)
                health_status[service_name] = {
                    "status": "healthy" if response.status_code == 200 else "unhealthy",
                    "response_time": response.elapsed.total_seconds(),
                    "status_code": response.status_code
                }
            except Exception as e:
                health_status[service_name] = {
                    "status": "unreachable",
                    "error": str(e)
                }
    
    return {
        "gateway": "healthy",
        "services": health_status,
        "timestamp": datetime.utcnow()
    }

# Analytics endpoints
@app.get("/analytics/stats")
@limiter.limit("20/minute")
async def get_analytics_stats(
    days: int = 7,
    user: Dict[str, Any] = Depends(require_admin)
):
    """Get API analytics statistics"""
    try:
        stats = {}
        
        for i in range(days):
            date = (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d")
            date_stats = redis_client.hgetall(f"daily_stats:{date}")
            if date_stats:
                stats[date] = {k: int(v) for k, v in date_stats.items()}
        
        return {
            "stats": stats,
            "period_days": days,
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        logger.error(f"Error getting analytics: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/analytics/logs")
@limiter.limit("10/minute")
async def get_recent_logs(
    limit: int = 100,
    user: Dict[str, Any] = Depends(require_admin)
):
    """Get recent API logs"""
    try:
        logs = redis_client.lrange("api_logs", 0, limit - 1)
        return {
            "logs": [json.loads(log) for log in logs],
            "count": len(logs),
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        logger.error(f"Error getting logs: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Rate limiting info
@app.get("/rate-limit/info")
@limiter.limit("30/minute")
async def get_rate_limit_info(request: Request):
    """Get rate limiting information for client"""
    client_ip = get_remote_address(request)
    
    # Get rate limit stats from Redis
    try:
        # This would depend on your rate limiting implementation
        # For now, return basic info
        return {
            "client_ip": client_ip,
            "rate_limits": {
                "default": "100/minute",
                "authenticated": "200/minute",
                "admin": "500/minute"
            },
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        logger.error(f"Error getting rate limit info: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Main request handler
@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
@limiter.limit("200/minute")
async def gateway_handler(request: Request, path: str):
    """Main gateway request handler"""
    start_time = time.time()
    full_path = f"/{path}"
    
    try:
        # Determine target service
        service = get_service_for_path(full_path)
        if not service:
            raise HTTPException(status_code=404, detail="Route not found")
        
        # Check authentication requirements
        user = None
        if is_route_protected(full_path):
            credentials = await security(request)
            user = get_current_user(credentials)
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required",
                    headers={"WWW-Authenticate": "Bearer"},
                )
        
        # Check admin requirements
        if is_admin_route(full_path):
            if not user or user.get("role") != "admin":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Admin access required"
                )
        
        # Add user context to headers if authenticated
        if user:
            # Add user ID to headers for downstream services
            request.headers.__dict__["_list"].append(
                (b"x-user-id", str(user["user_id"]).encode())
            )
            request.headers.__dict__["_list"].append(
                (b"x-user-role", user["role"].encode())
            )
        
        # Forward request
        response = await forward_request(request, service, full_path)
        
        # Log successful request
        response_time = time.time() - start_time
        log_request(request, response_time, response.status_code, service)
        
        # Add gateway headers
        response.headers["X-Gateway"] = "secure-ecommerce-gateway"
        response.headers["X-Response-Time"] = str(response_time)
        
        return response
        
    except HTTPException as e:
        response_time = time.time() - start_time
        log_request(request, response_time, e.status_code)
        raise e
    except Exception as e:
        response_time = time.time() - start_time
        log_request(request, response_time, 500)
        logger.error(f"Gateway error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
