#!/bin/bash

# Deploy script for Safe Tracibility System Frontend
# Purpose: avoid stale/missing Next.js chunks after deployment.

set -euo pipefail

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
BRANCH="staging"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Starting Deployment Process${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "\n${YELLOW}[1/8] Navigating to project directory...${NC}"
cd "$PROJECT_DIR"
echo -e "${GREEN}Current directory: $(pwd)${NC}"

echo -e "\n${YELLOW}[2/8] Pulling latest code from Git (${BRANCH})...${NC}"
git pull origin "$BRANCH"
echo -e "${GREEN}Git pull successful${NC}"

echo -e "\n${YELLOW}[3/8] Installing dependencies (frozen lockfile)...${NC}"
"$PNPM" install --frozen-lockfile
echo -e "${GREEN}Dependencies installed${NC}"

echo -e "\n${YELLOW}[4/8] Clearing previous .next build output...${NC}"
rm -rf .next
echo -e "${GREEN}.next directory removed${NC}"

echo -e "\n${YELLOW}[5/8] Building the project...${NC}"
"$PNPM" build
echo -e "${GREEN}Build successful${NC}"

echo -e "\n${YELLOW}[6/8] Verifying build artifacts...${NC}"
if [ ! -f ".next/BUILD_ID" ]; then
  echo -e "${RED}BUILD_ID not found after build${NC}"
  exit 1
fi

BUILD_ID=$(cat .next/BUILD_ID)
if [ ! -f ".next/static/${BUILD_ID}/_buildManifest.js" ]; then
  echo -e "${RED}Missing .next/static/${BUILD_ID}/_buildManifest.js${NC}"
  exit 1
fi
echo -e "${GREEN}Build ID: ${BUILD_ID}${NC}"

echo -e "\n${YELLOW}[7/8] Recreating PM2 process with explicit cwd...${NC}"
# Important: delete/recreate prevents PM2 from reusing an old cwd/script config.
if "$PM2" describe "$APP_NAME" > /dev/null 2>&1; then
  "$PM2" delete "$APP_NAME"
fi
"$PM2" start "$PNPM" --name "$APP_NAME" --cwd "$PROJECT_DIR" -- start
echo -e "${GREEN}PM2 process started with current project directory${NC}"

echo -e "\n${YELLOW}[8/8] Saving PM2 configuration...${NC}"
"$PM2" save
echo -e "${GREEN}PM2 configuration saved${NC}"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Current PM2 Status:${NC}"
echo -e "${GREEN}========================================${NC}"
"$PM2" list

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Completed Successfully${NC}"
echo -e "${GREEN}========================================${NC}"
