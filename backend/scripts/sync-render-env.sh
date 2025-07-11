#!/bin/bash

# Sync environment variables to Render
# Usage: ./scripts/sync-render-env.sh [service-name]

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if render CLI is installed
if ! command -v render &> /dev/null; then
    echo -e "${RED}Error: Render CLI is not installed${NC}"
    echo "Install it with: brew tap render-oss/render && brew install render"
    exit 1
fi

# Get service name from argument or prompt
SERVICE_NAME=$1
if [ -z "$SERVICE_NAME" ]; then
    echo -e "${YELLOW}Enter your Render service name:${NC}"
    read SERVICE_NAME
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please create a .env file with your environment variables"
    exit 1
fi

echo -e "${GREEN}Syncing environment variables to Render service: $SERVICE_NAME${NC}"

# Read .env file and sync each variable
while IFS='=' read -r key value; do
    # Skip empty lines and comments
    if [[ -z "$key" || "$key" =~ ^[[:space:]]*# ]]; then
        continue
    fi
    
    # Remove quotes from value if present
    value="${value%\"}"
    value="${value#\"}"
    value="${value%\'}"
    value="${value#\'}"
    
    # Set the environment variable in Render
    echo -e "${YELLOW}Setting $key${NC}"
    render env set "$key=$value" --service "$SERVICE_NAME"
done < .env

# Add NODE_ENV=production if not already set
if ! grep -q "^NODE_ENV=" .env; then
    echo -e "${YELLOW}Setting NODE_ENV=production${NC}"
    render env set "NODE_ENV=production" --service "$SERVICE_NAME"
fi

echo -e "${GREEN}✅ Environment variables synced successfully!${NC}"
echo -e "${YELLOW}Your service will redeploy automatically with the new variables.${NC}"