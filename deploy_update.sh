#!/bin/bash

# Deploy script for Safe Tracibility System Frontend
# This script pulls latest code, builds, and restarts the application

set -e  # Exit on any error

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/www/wwwroot/safe-tracibility-system-fe"
NODE_BIN="/www/server/nodejs/v22.20.0/bin"
PNPM="$NODE_BIN/pnpm"
PM2="$NODE_BIN/pm2"
APP_NAME="safe-tracibility-system-fe"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Starting Deployment Process${NC}"
echo -e "${GREEN}========================================${NC}"

# Step 1: Navigate to project directory
echo -e "\n${YELLOW}[1/6] Navigating to project directory...${NC}"
cd $PROJECT_DIR
echo -e "${GREEN}✓ Current directory: $(pwd)${NC}"

# Step 2: Pull latest code from Git
echo -e "\n${YELLOW}[2/6] Pulling latest code from Git...${NC}"
git pull origin development
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Git pull successful${NC}"
else
    echo -e "${RED}✗ Git pull failed${NC}"
    exit 1
fi

# Step 3: Install dependencies
echo -e "\n${YELLOW}[3/6] Installing dependencies...${NC}"
$PNPM install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${RED}✗ Dependency installation failed${NC}"
    exit 1
fi

# Step 4: Build the project
echo -e "\n${YELLOW}[4/6] Building the project...${NC}"
$PNPM build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

# Step 5: Check if app is running in PM2
echo -e "\n${YELLOW}[5/6] Checking PM2 status...${NC}"
if $PM2 describe $APP_NAME > /dev/null 2>&1; then
    echo -e "${YELLOW}App is running, restarting...${NC}"
    $PM2 restart $APP_NAME
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ App restarted successfully${NC}"
    else
        echo -e "${RED}✗ App restart failed${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}App not found in PM2, starting...${NC}"
    $PM2 start $PNPM --name $APP_NAME -- start
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ App started successfully${NC}"
    else
        echo -e "${RED}✗ App start failed${NC}"
        exit 1
    fi
fi

# Step 6: Save PM2 configuration
echo -e "\n${YELLOW}[6/6] Saving PM2 configuration...${NC}"
$PM2 save
echo -e "${GREEN}✓ PM2 configuration saved${NC}"

# Display PM2 status
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Current PM2 Status:${NC}"
echo -e "${GREEN}========================================${NC}"
$PM2 list

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Completed Successfully! 🚀${NC}"
echo -e "${GREEN}========================================${NC}"
