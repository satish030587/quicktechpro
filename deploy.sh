#!/bin/bash

# QuickTechPro Deployment Script
# Usage: ./deploy.sh [production|staging]

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME="quicktechpro"
SERVER_USER="your-server-user"
SERVER_HOST="quicktechpro.in"
SERVER_PATH="/var/www/quicktechpro.in"

echo "🚀 Starting deployment to $ENVIRONMENT environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the project root directory?"
    exit 1
fi

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    print_warning "Working directory is not clean. Uncommitted changes detected."
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled."
        exit 1
    fi
fi

# Run local tests
print_status "Running local tests..."
npm run lint
npm run build

if [ $? -ne 0 ]; then
    print_error "Local tests failed. Fix errors before deploying."
    exit 1
fi

print_success "Local tests passed!"

# Deploy to server
print_status "Deploying to server..."

ssh $SERVER_USER@$SERVER_HOST << EOF
    set -e
    
    # Navigate to project directory
    cd $SERVER_PATH
    
    # Pull latest changes
    echo "📥 Pulling latest changes from Git..."
    git pull origin main
    
    # Install dependencies
    echo "📦 Installing dependencies..."
    npm ci --only=production
    
    # Build the application
    echo "🔨 Building application..."
    npm run build
    
    # Restart the application with PM2
    echo "🔄 Restarting application..."
    pm2 reload ecosystem.config.js --env production
    pm2 save
    
    # Check if application is running
    echo "🔍 Checking application status..."
    pm2 status $PROJECT_NAME
    
    echo "✅ Deployment completed successfully!"
EOF

if [ $? -eq 0 ]; then
    print_success "Deployment to $ENVIRONMENT completed successfully!"
    print_status "Website is now live at: https://quicktechpro.in"
else
    print_error "Deployment failed!"
    exit 1
fi

# Optional: Run post-deployment checks
print_status "Running post-deployment checks..."

# Check if website is responding
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://quicktechpro.in)
if [ $HTTP_STATUS -eq 200 ]; then
    print_success "Website is responding correctly (HTTP $HTTP_STATUS)"
else
    print_warning "Website returned HTTP $HTTP_STATUS"
fi

print_success "🎉 Deployment process completed!"
echo
echo "📊 Deployment Summary:"
echo "   Environment: $ENVIRONMENT"
echo "   Server: $SERVER_HOST"
echo "   Timestamp: $(date)"
echo "   Git Commit: $(git rev-parse --short HEAD)"
echo
echo "🔗 Quick Links:"
echo "   Website: https://quicktechpro.in"
echo "   Server Logs: ssh $SERVER_USER@$SERVER_HOST 'pm2 logs $PROJECT_NAME'"
echo "   Server Status: ssh $SERVER_USER@$SERVER_HOST 'pm2 status'"
