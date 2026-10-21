#!/bin/bash

# Phase 2 Testing Script
# Tests SMS service and cron job functionality

echo "=========================================="
echo "🧪 Phase 2 Testing Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    echo "Please create .env file from .env.example"
    exit 1
fi

echo -e "${GREEN}✅ .env file found${NC}"
echo ""

# Check for required environment variables
echo "📋 Checking environment variables..."

if grep -q "AFROMESSAGE_API_TOKEN=your_afromessage_api_token_here" .env; then
    echo -e "${YELLOW}⚠️  AFROMESSAGE_API_TOKEN not configured${NC}"
    echo "   SMS will run in disabled mode"
else
    echo -e "${GREEN}✅ AFROMESSAGE_API_TOKEN configured${NC}"
fi

if grep -q "CRON_SCHEDULE=" .env; then
    SCHEDULE=$(grep "CRON_SCHEDULE=" .env | cut -d '=' -f2 | tr -d '"')
    echo -e "${GREEN}✅ CRON_SCHEDULE set to: $SCHEDULE${NC}"
else
    echo -e "${YELLOW}⚠️  CRON_SCHEDULE not set (will use default)${NC}"
fi

echo ""

# Check if dependencies are installed
echo "📦 Checking dependencies..."

if [ ! -d "node_modules" ]; then
    echo -e "${RED}❌ node_modules not found${NC}"
    echo "Running npm install..."
    npm install
else
    echo -e "${GREEN}✅ Dependencies installed${NC}"
fi

# Check for node-cron
if npm list node-cron > /dev/null 2>&1; then
    echo -e "${GREEN}✅ node-cron installed${NC}"
else
    echo -e "${RED}❌ node-cron not installed${NC}"
    exit 1
fi

# Check for axios
if npm list axios > /dev/null 2>&1; then
    echo -e "${GREEN}✅ axios installed${NC}"
else
    echo -e "${RED}❌ axios not installed${NC}"
    exit 1
fi

echo ""

# Check if database is accessible
echo "🗄️  Checking database connection..."

if npx prisma db pull > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    echo "   Check your DATABASE_URL in .env"
    exit 1
fi

echo ""

# Run test script if available
echo "🧪 Running membership cron test..."
if [ -f "src/test/membership-cron.test.ts" ]; then
    npx ts-node src/test/membership-cron.test.ts
else
    echo -e "${YELLOW}⚠️  Test script not found${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✅ Phase 2 Testing Complete${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Update AFROMESSAGE_API_TOKEN in .env if not done"
echo "2. Run 'npm run dev' to start the server"
echo "3. Check console logs for cron job initialization"
echo ""
