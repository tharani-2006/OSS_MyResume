#!/bin/bash

# Secure E-Commerce Microservices Platform - Podman Setup Script
# This script helps you quickly set up and start the microservices platform with Podman

set -e

echo "🚀 Starting Secure E-Commerce Microservices Platform Setup with Podman..."

# Check if Podman is installed
if ! command -v podman &> /dev/null; then
    echo "❌ Podman is not installed. Please install Podman first."
    echo "   Visit: https://podman.io/getting-started/installation"
    exit 1
fi

# Check if podman-compose is installed
if ! command -v podman-compose &> /dev/null; then
    echo "❌ podman-compose is not installed. Please install podman-compose first."
    echo "   Run: pip install podman-compose"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📄 Creating .env file from template..."
    cat > .env << EOF
# Database Configuration
DB_USER=ecommerce_user
DB_PASSWORD=secure_password_123

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production-podman

# Email Configuration (for notifications)
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@ecommerce.com

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379

# Service URLs (for development)
USER_SERVICE_URL=http://user-service:8001
PRODUCT_SERVICE_URL=http://product-service:8002
ORDER_SERVICE_URL=http://order-service:8003
NOTIFICATION_SERVICE_URL=http://notification-service:8004

# Log Level
LOG_LEVEL=INFO

# Security Settings
RATE_LIMIT_ENABLED=true
CIRCUIT_BREAKER_ENABLED=true

# Development Settings
DEBUG=false
ENVIRONMENT=development
EOF
    echo "⚠️  Please update the .env file with your configuration before proceeding."
    echo "   Key settings to update:"
    echo "   - JWT_SECRET_KEY: Use a strong secret key"
    echo "   - EMAIL_USERNAME/EMAIL_PASSWORD: For notification service"
    echo "   - DB_PASSWORD: Use a strong database password"
    read -p "Press Enter to continue after updating .env file..."
fi

# Start Podman socket if not running (for rootless Podman)
echo "🔌 Starting Podman socket..."
systemctl --user start podman.socket 2>/dev/null || true

# Build and start all services
echo "🏗️  Building and starting services with Podman..."
podman-compose -f podman-compose.yml up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 60

# Check service health
echo "🔍 Checking service health..."
services=("api-gateway:8000" "user-service:8001" "product-service:8002" "order-service:8003" "notification-service:8004")

for service in "${services[@]}"; do
    name=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    
    if curl -s -f "http://localhost:$port/health" > /dev/null; then
        echo "✅ $name is healthy"
    else
        echo "❌ $name is not responding (this is normal on first startup)"
        echo "   You can check logs with: podman-compose -f podman-compose.yml logs $name"
    fi
done

echo ""
echo "🎉 Setup complete! Your microservices platform is running with Podman."
echo ""
echo "📚 Access the API documentation:"
echo "   • API Gateway: http://localhost:8000/docs"
echo "   • User Service: http://localhost:8001/docs"
echo "   • Product Service: http://localhost:8002/docs"
echo "   • Order Service: http://localhost:8003/docs"
echo "   • Notification Service: http://localhost:8004/docs"
echo ""
echo "🔧 Useful Podman commands:"
echo "   • View logs: podman-compose -f podman-compose.yml logs -f"
echo "   • Stop services: podman-compose -f podman-compose.yml down"
echo "   • Restart services: podman-compose -f podman-compose.yml restart"
echo "   • View status: podman-compose -f podman-compose.yml ps"
echo "   • Check containers: podman ps"
echo ""
echo "🐛 Troubleshooting:"
echo "   • If services fail to start, check logs: podman-compose -f podman-compose.yml logs [service-name]"
echo "   • If networking issues occur, try: podman network ls"
echo "   • For permission issues, ensure Podman is running in rootless mode"
echo ""
echo "🔐 Next steps:"
echo "   1. Register a user via the API Gateway"
echo "   2. Create products and categories"
echo "   3. Place test orders"
echo "   4. Monitor system performance"
echo ""
