"""
Notification Service - Real-time Notifications & Messaging
Handles email, SMS, push notifications, and real-time messaging
"""

from fastapi import FastAPI, HTTPException, Depends, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Text, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime, timedelta
import os
import enum
from typing import Optional, List, Dict
from pydantic import BaseModel, EmailStr, validator
import redis
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import logging
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import asyncio

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Notification Service - Messaging & Alerts",
    description="Microservice for notifications, messaging, and real-time alerts",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Redis for caching, rate limiting, and pub/sub
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
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/notification_db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Email Configuration
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_USERNAME = os.getenv("EMAIL_USERNAME", "")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "")
EMAIL_FROM = os.getenv("EMAIL_FROM", "noreply@ecommerce.com")

# Enums
class NotificationType(enum.Enum):
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"
    IN_APP = "in_app"

class NotificationStatus(enum.Enum):
    PENDING = "pending"
    SENT = "sent"
    DELIVERED = "delivered"
    FAILED = "failed"
    READ = "read"

class Priority(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

# Database Models
class NotificationTemplate(Base):
    __tablename__ = "notification_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    subject = Column(String(200))
    body = Column(Text, nullable=False)
    template_type = Column(Enum(NotificationType), nullable=False)
    variables = Column(Text)  # JSON string of template variables
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    type = Column(Enum(NotificationType), nullable=False)
    status = Column(Enum(NotificationStatus), default=NotificationStatus.PENDING)
    priority = Column(Enum(Priority), default=Priority.MEDIUM)
    subject = Column(String(200))
    message = Column(Text, nullable=False)
    recipient = Column(String(200))  # Email, phone, or device ID
    template_id = Column(Integer)
    metadata = Column(Text)  # JSON string for additional data
    scheduled_at = Column(DateTime)
    sent_at = Column(DateTime)
    delivered_at = Column(DateTime)
    read_at = Column(DateTime)
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    error_message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class NotificationPreference(Base):
    __tablename__ = "notification_preferences"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, nullable=False, index=True)
    email_notifications = Column(Boolean, default=True)
    sms_notifications = Column(Boolean, default=False)
    push_notifications = Column(Boolean, default=True)
    marketing_emails = Column(Boolean, default=False)
    order_updates = Column(Boolean, default=True)
    security_alerts = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic Models
class NotificationTemplateCreate(BaseModel):
    name: str
    subject: Optional[str] = None
    body: str
    template_type: NotificationType
    variables: Optional[str] = None

class NotificationTemplateResponse(BaseModel):
    id: int
    name: str
    subject: Optional[str]
    body: str
    template_type: NotificationType
    variables: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class NotificationCreate(BaseModel):
    user_id: int
    type: NotificationType
    message: str
    subject: Optional[str] = None
    recipient: Optional[str] = None
    priority: Priority = Priority.MEDIUM
    scheduled_at: Optional[datetime] = None
    metadata: Optional[Dict] = None

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    type: NotificationType
    status: NotificationStatus
    priority: Priority
    subject: Optional[str]
    message: str
    recipient: Optional[str]
    scheduled_at: Optional[datetime]
    sent_at: Optional[datetime]
    delivered_at: Optional[datetime]
    read_at: Optional[datetime]
    retry_count: int
    error_message: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class NotificationPreferenceCreate(BaseModel):
    user_id: int
    email_notifications: bool = True
    sms_notifications: bool = False
    push_notifications: bool = True
    marketing_emails: bool = False
    order_updates: bool = True
    security_alerts: bool = True

class NotificationPreferenceResponse(BaseModel):
    id: int
    user_id: int
    email_notifications: bool
    sms_notifications: bool
    push_notifications: bool
    marketing_emails: bool
    order_updates: bool
    security_alerts: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class BulkNotificationCreate(BaseModel):
    user_ids: List[int]
    type: NotificationType
    message: str
    subject: Optional[str] = None
    priority: Priority = Priority.MEDIUM
    scheduled_at: Optional[datetime] = None

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

# Email helper functions
def send_email(to_email: str, subject: str, body: str, is_html: bool = False) -> bool:
    """Send email notification"""
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = EMAIL_FROM
        msg['To'] = to_email
        
        if is_html:
            msg.attach(MIMEText(body, 'html'))
        else:
            msg.attach(MIMEText(body, 'plain'))
        
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            if EMAIL_USERNAME and EMAIL_PASSWORD:
                server.login(EMAIL_USERNAME, EMAIL_PASSWORD)
            server.send_message(msg)
        
        return True
    except Exception as e:
        logger.error(f"Email send error: {e}")
        return False

def send_sms(phone_number: str, message: str) -> bool:
    """Send SMS notification (mock implementation)"""
    try:
        # In a real implementation, you would integrate with SMS service like Twilio
        logger.info(f"SMS sent to {phone_number}: {message}")
        return True
    except Exception as e:
        logger.error(f"SMS send error: {e}")
        return False

def send_push_notification(device_id: str, title: str, message: str) -> bool:
    """Send push notification (mock implementation)"""
    try:
        # In a real implementation, you would integrate with push service like FCM
        logger.info(f"Push notification sent to {device_id}: {title} - {message}")
        return True
    except Exception as e:
        logger.error(f"Push notification error: {e}")
        return False

async def process_notification(notification_id: int, db: Session):
    """Process and send notification"""
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        return
    
    try:
        success = False
        
        if notification.type == NotificationType.EMAIL:
            success = send_email(
                notification.recipient,
                notification.subject or "Notification",
                notification.message
            )
        elif notification.type == NotificationType.SMS:
            success = send_sms(notification.recipient, notification.message)
        elif notification.type == NotificationType.PUSH:
            success = send_push_notification(
                notification.recipient,
                notification.subject or "Notification",
                notification.message
            )
        elif notification.type == NotificationType.IN_APP:
            # Store in Redis for real-time delivery
            redis_client.lpush(f"user_notifications:{notification.user_id}", 
                             json.dumps({
                                 "id": notification.id,
                                 "message": notification.message,
                                 "subject": notification.subject,
                                 "timestamp": datetime.utcnow().isoformat()
                             }))
            success = True
        
        if success:
            notification.status = NotificationStatus.SENT
            notification.sent_at = datetime.utcnow()
        else:
            notification.status = NotificationStatus.FAILED
            notification.retry_count += 1
            if notification.retry_count < notification.max_retries:
                # Schedule retry
                notification.scheduled_at = datetime.utcnow() + timedelta(minutes=5 * notification.retry_count)
                notification.status = NotificationStatus.PENDING
        
        db.commit()
        logger.info(f"Notification {notification_id} processed: {success}")
        
    except Exception as e:
        logger.error(f"Error processing notification {notification_id}: {e}")
        notification.status = NotificationStatus.FAILED
        notification.error_message = str(e)
        db.commit()

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "notification-service", "timestamp": datetime.utcnow()}

# Notification endpoints
@app.post("/notifications", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("50/minute")
async def create_notification(
    notification: NotificationCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    try:
        # Check user preferences
        preferences = db.query(NotificationPreference).filter(
            NotificationPreference.user_id == notification.user_id
        ).first()
        
        if preferences:
            # Check if user has opted out of this type of notification
            if notification.type == NotificationType.EMAIL and not preferences.email_notifications:
                raise HTTPException(status_code=400, detail="User has disabled email notifications")
            elif notification.type == NotificationType.SMS and not preferences.sms_notifications:
                raise HTTPException(status_code=400, detail="User has disabled SMS notifications")
            elif notification.type == NotificationType.PUSH and not preferences.push_notifications:
                raise HTTPException(status_code=400, detail="User has disabled push notifications")
        
        # Create notification
        db_notification = Notification(
            user_id=notification.user_id,
            type=notification.type,
            message=notification.message,
            subject=notification.subject,
            recipient=notification.recipient,
            priority=notification.priority,
            scheduled_at=notification.scheduled_at,
            metadata=json.dumps(notification.metadata) if notification.metadata else None
        )
        
        db.add(db_notification)
        db.commit()
        db.refresh(db_notification)
        
        # Process immediately if not scheduled
        if not notification.scheduled_at:
            background_tasks.add_task(process_notification, db_notification.id, db)
        
        logger.info(f"Notification created: {db_notification.id}")
        return db_notification
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating notification: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/notifications", response_model=List[NotificationResponse])
@limiter.limit("100/minute")
async def get_notifications(
    user_id: int,
    skip: int = 0,
    limit: int = 20,
    status_filter: Optional[NotificationStatus] = None,
    type_filter: Optional[NotificationType] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Notification).filter(Notification.user_id == user_id)
    
    if status_filter:
        query = query.filter(Notification.status == status_filter)
    
    if type_filter:
        query = query.filter(Notification.type == type_filter)
    
    notifications = query.order_by(Notification.created_at.desc()).offset(skip).limit(limit).all()
    return notifications

@app.get("/notifications/{notification_id}", response_model=NotificationResponse)
@limiter.limit("200/minute")
async def get_notification(notification_id: int, db: Session = Depends(get_db)):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification

@app.post("/notifications/{notification_id}/mark-read")
@limiter.limit("100/minute")
async def mark_notification_read(notification_id: int, db: Session = Depends(get_db)):
    try:
        notification = db.query(Notification).filter(Notification.id == notification_id).first()
        if not notification:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        if notification.status == NotificationStatus.SENT:
            notification.status = NotificationStatus.READ
            notification.read_at = datetime.utcnow()
            db.commit()
        
        return {"message": "Notification marked as read"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error marking notification as read: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/notifications/bulk", status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
async def create_bulk_notifications(
    bulk_notification: BulkNotificationCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    try:
        notification_ids = []
        
        for user_id in bulk_notification.user_ids:
            db_notification = Notification(
                user_id=user_id,
                type=bulk_notification.type,
                message=bulk_notification.message,
                subject=bulk_notification.subject,
                priority=bulk_notification.priority,
                scheduled_at=bulk_notification.scheduled_at
            )
            
            db.add(db_notification)
            db.commit()
            db.refresh(db_notification)
            notification_ids.append(db_notification.id)
            
            # Process immediately if not scheduled
            if not bulk_notification.scheduled_at:
                background_tasks.add_task(process_notification, db_notification.id, db)
        
        logger.info(f"Bulk notifications created: {len(notification_ids)}")
        return {"message": f"Created {len(notification_ids)} notifications", "notification_ids": notification_ids}
        
    except Exception as e:
        logger.error(f"Error creating bulk notifications: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Real-time notifications
@app.get("/notifications/realtime/{user_id}")
@limiter.limit("200/minute")
async def get_realtime_notifications(user_id: int):
    """Get real-time in-app notifications for a user"""
    try:
        notifications = []
        # Get up to 10 latest notifications from Redis
        notification_data = redis_client.lrange(f"user_notifications:{user_id}", 0, 9)
        
        for data in notification_data:
            notifications.append(json.loads(data))
        
        return {"notifications": notifications}
    except Exception as e:
        logger.error(f"Error getting real-time notifications: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.delete("/notifications/realtime/{user_id}")
@limiter.limit("50/minute")
async def clear_realtime_notifications(user_id: int):
    """Clear real-time notifications for a user"""
    try:
        redis_client.delete(f"user_notifications:{user_id}")
        return {"message": "Real-time notifications cleared"}
    except Exception as e:
        logger.error(f"Error clearing real-time notifications: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Notification preferences
@app.post("/preferences", response_model=NotificationPreferenceResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
async def create_notification_preferences(
    preferences: NotificationPreferenceCreate,
    db: Session = Depends(get_db)
):
    try:
        # Check if preferences already exist
        existing = db.query(NotificationPreference).filter(
            NotificationPreference.user_id == preferences.user_id
        ).first()
        
        if existing:
            raise HTTPException(status_code=400, detail="Preferences already exist for this user")
        
        db_preferences = NotificationPreference(**preferences.dict())
        db.add(db_preferences)
        db.commit()
        db.refresh(db_preferences)
        
        logger.info(f"Notification preferences created for user: {preferences.user_id}")
        return db_preferences
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating notification preferences: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/preferences/{user_id}", response_model=NotificationPreferenceResponse)
@limiter.limit("100/minute")
async def get_notification_preferences(user_id: int, db: Session = Depends(get_db)):
    preferences = db.query(NotificationPreference).filter(
        NotificationPreference.user_id == user_id
    ).first()
    
    if not preferences:
        raise HTTPException(status_code=404, detail="Notification preferences not found")
    
    return preferences

@app.put("/preferences/{user_id}", response_model=NotificationPreferenceResponse)
@limiter.limit("20/minute")
async def update_notification_preferences(
    user_id: int,
    preferences_update: NotificationPreferenceCreate,
    db: Session = Depends(get_db)
):
    try:
        preferences = db.query(NotificationPreference).filter(
            NotificationPreference.user_id == user_id
        ).first()
        
        if not preferences:
            raise HTTPException(status_code=404, detail="Notification preferences not found")
        
        update_data = preferences_update.dict(exclude={"user_id"})
        for key, value in update_data.items():
            setattr(preferences, key, value)
        
        preferences.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(preferences)
        
        logger.info(f"Notification preferences updated for user: {user_id}")
        return preferences
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating notification preferences: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Stats endpoint
@app.get("/stats")
@limiter.limit("20/minute")
async def get_notification_stats(db: Session = Depends(get_db)):
    try:
        total_notifications = db.query(Notification).count()
        sent_notifications = db.query(Notification).filter(Notification.status == NotificationStatus.SENT).count()
        failed_notifications = db.query(Notification).filter(Notification.status == NotificationStatus.FAILED).count()
        pending_notifications = db.query(Notification).filter(Notification.status == NotificationStatus.PENDING).count()
        
        # Today's notifications
        today = datetime.utcnow().date()
        today_notifications = db.query(Notification).filter(
            db.func.date(Notification.created_at) == today
        ).count()
        
        return {
            "total_notifications": total_notifications,
            "sent_notifications": sent_notifications,
            "failed_notifications": failed_notifications,
            "pending_notifications": pending_notifications,
            "today_notifications": today_notifications,
            "success_rate": (sent_notifications / total_notifications * 100) if total_notifications > 0 else 0
        }
    except Exception as e:
        logger.error(f"Error getting notification stats: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)
