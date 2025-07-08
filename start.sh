#!/bin/bash

# Quick Start Script for Portfolio with AI Chatbot
# This script helps you start both the portfolio website and AI chatbot service

echo "🚀 Starting Portfolio with AI Chatbot Integration"
echo "================================================"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for Node.js
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check for npm
if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Get the current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORTFOLIO_DIR="$SCRIPT_DIR"
AI_PROJECT_DIR="$SCRIPT_DIR/AiProject"

echo "📁 Portfolio directory: $PORTFOLIO_DIR"
echo "📁 AI Project directory: $AI_PROJECT_DIR"

# Function to start portfolio
start_portfolio() {
    echo "🌐 Starting Portfolio Website..."
    cd "$PORTFOLIO_DIR"
    
    # Check if node_modules exists, if not install dependencies
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing portfolio dependencies..."
        npm install
    fi
    
    echo "🚀 Starting portfolio on http://localhost:3000"
    npm run dev
}

# Function to start AI service
start_ai_service() {
    echo "🤖 Starting AI Chatbot Service..."
    cd "$AI_PROJECT_DIR"
    
    # Check if node_modules exists, if not install dependencies
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing AI service dependencies..."
        npm install
    fi
    
    echo "🚀 Starting AI service on http://localhost:3001"
    npm run dev
}

# Function to start both services
start_both() {
    echo "🎯 Starting both Portfolio and AI Service..."
    echo "   Portfolio: http://localhost:3000"
    echo "   AI Service: http://localhost:3001"
    echo ""
    echo "⚠️  Note: You'll need two terminal windows for this."
    echo "   Terminal 1: Portfolio Website"
    echo "   Terminal 2: AI Chatbot Service"
    echo ""
    
    # Start AI service in background
    cd "$AI_PROJECT_DIR"
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing AI service dependencies..."
        npm install
    fi
    echo "🤖 Starting AI service in background..."
    npm run dev &
    AI_PID=$!
    
    # Wait a moment for AI service to start
    sleep 3
    
    # Start portfolio
    cd "$PORTFOLIO_DIR"
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing portfolio dependencies..."
        npm install
    fi
    echo "🌐 Starting portfolio..."
    npm run dev
    
    # Clean up when script exits
    trap "kill $AI_PID 2>/dev/null" EXIT
}

# Main menu
echo ""
echo "Choose an option:"
echo "1) Start Portfolio Only (http://localhost:3000)"
echo "2) Start AI Service Only (http://localhost:3001)"
echo "3) Start Both Services"
echo "4) Exit"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        start_portfolio
        ;;
    2)
        start_ai_service
        ;;
    3)
        start_both
        ;;
    4)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac
