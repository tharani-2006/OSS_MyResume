# Secure E-Commerce Microservices Platform

A comprehensive, production-ready e-commerce platform built with microservices architecture, emphasizing security, scalability, and DevOps best practices.

## 🏗️ Architecture Overview

This project demonstrates a modern microservices architecture with the following components:

### Core Services
- **API Gateway** (Port 8000) - Central entry point with authentication, rate limiting, and routing
- **User Service** (Port 8001) - Authentication, authorization, and user management
- **Product Service** (Port 8002) - Product catalog, inventory, and search functionality
- **Order Service** (Port 8003) - Order processing, tracking, and fulfillment
- **Notification Service** (Port 8004) - Email, SMS, push notifications, and real-time messaging

### Infrastructure Components
- **PostgreSQL** - Primary database for each service (separate DBs for isolation)
- **Redis** - Caching, rate limiting, and real-time data
- **Docker** - Containerization for all services
- **Docker Compose** - Local development orchestration
- **Nginx** - Load balancing and reverse proxy
- **Prometheus & Grafana** - Monitoring and analytics

## 🔒 Security Features

### Authentication & Authorization
- JWT token-based authentication with refresh tokens
- Role-based access control (RBAC)
- Secure password hashing with bcrypt
- Account lockout after failed attempts
- Session management and token blacklisting

### API Security
- Rate limiting per endpoint and user (Redis-based)
- Request/response validation with Pydantic
- SQL injection prevention via SQLAlchemy ORM
- XSS protection and input sanitization
- CORS configuration
- Circuit breaker pattern for service resilience

### Infrastructure Security
- Non-root Docker containers
- Environment-based secrets management
- Network isolation between services
- Health checks and monitoring
- Trusted host middleware

## 🚀 Technology Stack

### Backend
- **FastAPI** - Modern, fast Python web framework with automatic OpenAPI docs
- **SQLAlchemy** - Python SQL toolkit and ORM with connection pooling
- **Pydantic** - Data validation using Python type hints
- **Redis** - In-memory data structure store for caching and sessions
- **PostgreSQL** - Advanced open-source relational database

### Microservices Communication
- **HTTP/REST** - Synchronous service-to-service communication
- **httpx** - Async HTTP client for inter-service calls
- **Circuit Breaker** - Fault tolerance and resilience patterns

### DevOps & Infrastructure
- **Docker & Docker Compose** - Containerization and orchestration
- **Nginx** - Web server, reverse proxy, and load balancer
- **Prometheus** - Monitoring, metrics collection, and alerting
- **Grafana** - Analytics and monitoring dashboards

### Security & Authentication
- **python-jose** - JSON Web Tokens for Python
- **passlib** - Password hashing library with bcrypt
- **slowapi** - Rate limiting for FastAPI applications

## 📋 Prerequisites

- Docker and Docker Compose
- Python 3.11+ (for local development)
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/secure-ecommerce-microservices.git
cd secure-ecommerce-microservices
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```bash
# Database Configuration
DB_USER=ecommerce_user
DB_PASSWORD=secure_password_123

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production

# Email Configuration (for notifications)
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
```

### 3. Start the Services
```bash
# Start all services in background
docker-compose up -d

# Check service status
docker-compose ps

# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f api-gateway
```

### 4. Verify Installation
Access the interactive API documentation:
- **API Gateway**: http://localhost:8000/docs
- **User Service**: http://localhost:8001/docs
- **Product Service**: http://localhost:8002/docs
- **Order Service**: http://localhost:8003/docs
- **Notification Service**: http://localhost:8004/docs

### 5. Initialize Sample Data (Optional)
```bash
# Run initialization script
docker-compose exec api-gateway python scripts/init_data.py
```

## 📚 API Documentation

### Authentication Flow
1. **Register User**: `POST /api/v1/auth/register`
2. **Login**: `POST /api/v1/auth/login`
3. **Use JWT Token**: Include in Authorization header: `Bearer <token>`
4. **Refresh Token**: `POST /api/v1/auth/refresh`

### Complete API Example Flow
```bash
# 1. Register a new user
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePassword123!",
    "full_name": "Test User"
  }'

# 2. Login to get JWT token
TOKEN=$(curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=SecurePassword123!" | jq -r '.access_token')

# 3. Create a category
curl -X POST "http://localhost:8000/api/v1/categories" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics",
    "description": "Electronic devices and accessories"
  }'

# 4. Create a product
curl -X POST "http://localhost:8000/api/v1/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Headphones",
    "description": "High-quality wireless headphones with noise cancellation",
    "sku": "WH-001",
    "price": 299.99,
    "category_id": 1,
    "brand": "TechBrand",
    "initial_quantity": 50
  }'

# 5. Create an order
curl -X POST "http://localhost:8000/api/v1/orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "product_id": 1,
        "quantity": 2
      }
    ],
    "shipping_address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "NY",
      "postal_code": "12345",
      "country": "USA"
    },
    "payment_method": "credit_card"
  }'

# 6. Get order status
curl -X GET "http://localhost:8000/api/v1/orders" \
  -H "Authorization: Bearer $TOKEN"
```

## 🏢 Business Logic & Features

### User Management Service
- User registration with email verification
- Secure authentication with JWT tokens
- Profile management and updates
- Role-based access control (user, admin)
- Password reset and account recovery
- Account lockout and security monitoring

### Product Catalog Service
- Product CRUD operations with validation
- Category management and hierarchies
- Real-time inventory tracking
- Advanced search and filtering
- Stock level monitoring and alerts
- Product image and metadata management

### Order Processing Service
- Shopping cart and checkout functionality
- Order creation with inventory reservation
- Multi-step order status tracking
- Payment processing integration hooks
- Order history and analytics
- Automated order fulfillment workflows

### Notification System Service
- Multi-channel notifications (email, SMS, push, in-app)
- Real-time notification delivery
- User preference management
- Template-based messaging
- Notification history and analytics
- Background processing for scalability

### API Gateway Features
- Centralized authentication and authorization
- Request routing and load balancing
- Rate limiting and throttling
- Circuit breaker for service resilience
- Request/response logging and analytics
- API versioning and backward compatibility

## 🔍 Monitoring & Analytics

### Health Monitoring
```bash
# Individual service health checks
curl http://localhost:8001/health  # User Service
curl http://localhost:8002/health  # Product Service
curl http://localhost:8003/health  # Order Service
curl http://localhost:8004/health  # Notification Service

# Overall system health via API Gateway
curl http://localhost:8000/health/services
```

### Analytics Dashboard
- **Request Metrics**: Response times, throughput, error rates
- **Business Metrics**: User registrations, orders, revenue
- **System Metrics**: CPU, memory, database performance
- **Security Metrics**: Failed logins, rate limit violations

### Prometheus & Grafana
- **Prometheus**: http://localhost:9090 (metrics collection)
- **Grafana**: http://localhost:3000 (dashboards - admin/admin123)

## 🧪 Testing

### Unit Tests
```bash
# Test individual services
cd services/user-service
python -m pytest tests/ -v

cd ../product-service
python -m pytest tests/ -v
```

### Integration Tests
```bash
# Run full integration test suite
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Test specific flows
python tests/integration/test_order_flow.py
```

### Load Testing
```bash
# Install and run load tests
pip install locust
locust -f tests/load_test.py --host=http://localhost:8000
```

### Security Testing
```bash
# Run security scans
docker run --rm -it -v $(pwd):/app securityscanner/bandit -r /app/services/
```

## 🚀 Deployment Options

### Local Development
```bash
# Start with hot reload
docker-compose -f docker-compose.dev.yml up -d
```

### Production Deployment
```bash
# Production configuration
docker-compose -f docker-compose.prod.yml up -d

# With SSL and load balancing
docker-compose -f docker-compose.prod.yml -f docker-compose.ssl.yml up -d
```

### Cloud Deployment Examples

#### AWS ECS/Fargate
```bash
# Build and push images
docker build -t your-registry/api-gateway services/api-gateway/
docker push your-registry/api-gateway

# Deploy with ECS task definitions
aws ecs create-service --cluster production --task-definition api-gateway
```

#### Kubernetes
```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/namespace.yml
kubectl apply -f k8s/configmaps/
kubectl apply -f k8s/deployments/
kubectl apply -f k8s/services/
```

#### Docker Swarm
```bash
# Initialize swarm and deploy stack
docker swarm init
docker stack deploy -c docker-compose.prod.yml ecommerce
```

## 🔧 Configuration

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET_KEY` | Secret key for JWT tokens | `change-me` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `REDIS_HOST` | Redis server hostname | `localhost` |
| `EMAIL_USERNAME` | SMTP username for notifications | None |
| `LOG_LEVEL` | Application log level | `INFO` |

### Service Configuration
Each service can be configured via environment variables or config files:
- Database connections
- Rate limiting thresholds
- Security settings
- Feature flags

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with tests
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines
- Follow PEP 8 style guidelines
- Add comprehensive tests for new features
- Update documentation for API changes
- Ensure security best practices

## 📈 Performance & Scalability

### Horizontal Scaling
- Load balancer distributes requests across service instances
- Database read replicas for improved read performance
- Redis clustering for cache scalability

### Optimization Features
- Connection pooling for database efficiency
- Redis caching for frequently accessed data
- Async processing for I/O operations
- Circuit breakers for fault tolerance

## 🔐 Security Considerations

### Production Security Checklist
- [ ] Change default passwords and secrets
- [ ] Enable SSL/TLS encryption
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerting
- [ ] Regular security updates
- [ ] Backup and disaster recovery

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Venna Venkata Siva Reddy**
- Backend/Cybersecurity Engineer
- Specializing in secure microservices architecture
- Portfolio: [https://yourportfolio.com]
- LinkedIn: [https://linkedin.com/in/yourprofile]
- GitHub: [https://github.com/yourusername]

## 🙏 Acknowledgments

- FastAPI community for the excellent framework
- Docker for revolutionizing containerization
- PostgreSQL and Redis communities
- Security-focused open source libraries
- Microservices architecture patterns and best practices
