#!/bin/bash

# Secure E-Commerce Microservices Platform - Quick Start Script
# This script helps you quickly set up and start the microservices platform

set -e

echo "🚀 Starting Secure E-Commerce Microservices Platform Setup..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📄 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your configuration before proceeding."
    echo "   Key settings to update:"
    echo "   - JWT_SECRET_KEY: Use a strong secret key"
    echo "   - EMAIL_USERNAME/EMAIL_PASSWORD: For notification service"
    echo "   - DB_PASSWORD: Use a strong database password"
    read -p "Press Enter to continue after updating .env file..."
fi

# Build and start all services
echo "🏗️  Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
services=("api-gateway:8000" "user-service:8001" "product-service:8002" "order-service:8003" "notification-service:8004")

for service in "${services[@]}"; do
    name=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    
    if curl -s -f "http://localhost:$port/health" > /dev/null; then
        echo "✅ $name is healthy"
    else
        echo "❌ $name is not responding"
    fi
done

echo ""
echo "🎉 Setup complete! Your microservices platform is running."
echo ""
echo "📚 Access the API documentation:"
echo "   • API Gateway: http://localhost:8000/docs"
echo "   • User Service: http://localhost:8001/docs"
echo "   • Product Service: http://localhost:8002/docs"
echo "   • Order Service: http://localhost:8003/docs"
echo "   • Notification Service: http://localhost:8004/docs"
echo ""
echo "📊 Monitoring & Analytics:"
echo "   • Prometheus: http://localhost:9090"
echo "   • Grafana: http://localhost:3000 (admin/admin123)"
echo ""
echo "🔧 Useful commands:"
echo "   • View logs: docker-compose logs -f"
echo "   • Stop services: docker-compose down"
echo "   • Restart services: docker-compose restart"
echo "   • View status: docker-compose ps"
echo ""
echo "🔐 Next steps:"
echo "   1. Register a user via the API Gateway"
echo "   2. Create products and categories"
echo "   3. Place test orders"
echo "   4. Monitor system performance in Grafana"
echo ""
