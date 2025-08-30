@echo off
echo 🤖 Chatbot API - Localhost Testing
echo ================================
echo.

echo 📋 Prerequisites Check:
echo 1. MongoDB should be running (MongoDB Compass recommended)
echo 2. Node.js should be installed
echo.

echo 🚀 Starting chatbot API...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    echo.
)

REM Start the project
echo 🌱 Starting with automatic setup...
npm run start-localhost

pause
