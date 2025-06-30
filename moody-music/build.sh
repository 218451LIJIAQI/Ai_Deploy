#!/bin/bash

# Moodify Frontend Build Script
# This script ensures proper permissions and builds the React application

echo "🚀 Starting Moodify Frontend Build Process..."

# Set proper permissions for node_modules
echo "📁 Setting permissions for node_modules..."
chmod -R 755 node_modules/

# Ensure react-scripts is executable
echo "🔧 Ensuring react-scripts is executable..."
chmod +x node_modules/.bin/react-scripts

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🏗️ Building React application..."
npx react-scripts build

echo "✅ Build process completed successfully!" 