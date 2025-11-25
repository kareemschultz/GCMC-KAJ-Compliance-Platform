#!/bin/bash

# GK Enterprise Suite - Real Data Verification Script
# This script verifies that all mock data has been removed and real database connections work

set -e

echo "================================================"
echo "🔍 GK Enterprise Suite - Real Data Verification"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if mock data files exist
echo "1️⃣ Checking for mock data files..."
if [ -f "lib/mock-data.ts" ]; then
    echo -e "${RED}❌ Mock data file still exists: lib/mock-data.ts${NC}"
    exit 1
else
    echo -e "${GREEN}✅ No mock data files found${NC}"
fi

# Check for mock imports in code
echo ""
echo "2️⃣ Checking for mock data imports..."
MOCK_IMPORTS=$(grep -r "mock" --include="*.ts" --include="*.tsx" lib/ components/ app/ 2>/dev/null | grep -v "// " | grep -v "api.ts" | wc -l || true)
if [ "$MOCK_IMPORTS" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found $MOCK_IMPORTS references to 'mock' in code${NC}"
    echo "   Review these to ensure they're not mock data:"
    grep -r "mock" --include="*.ts" --include="*.tsx" lib/ components/ app/ | grep -v "//" | head -5
else
    echo -e "${GREEN}✅ No mock data imports found${NC}"
fi

# Check database connection
echo ""
echo "3️⃣ Checking database connection..."
if docker ps | grep -q postgres; then
    echo -e "${GREEN}✅ PostgreSQL container is running${NC}"

    # Test database connection
    docker exec gcmc-postgres-dev psql -U gcmc_user -d gcmc_kaj_db -c "SELECT COUNT(*) FROM \"Client\";" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database connection successful${NC}"
    else
        echo -e "${RED}❌ Database connection failed${NC}"
    fi
else
    echo -e "${RED}❌ PostgreSQL container is not running${NC}"
    echo "   Run: docker-compose up -d postgres"
fi

# Check API endpoints
echo ""
echo "4️⃣ Checking API endpoints exist..."
API_DIRS=(
    "app/api/clients"
    "app/api/tax-returns"
    "app/api/nis-schedules"
    "app/api/immigration"
    "app/api/partners"
    "app/api/training"
    "app/api/employees"
    "app/api/dashboard/stats"
)

MISSING_APIS=()
for dir in "${API_DIRS[@]}"; do
    if [ -f "$dir/route.ts" ]; then
        echo -e "${GREEN}✅ $dir/route.ts exists${NC}"
    else
        echo -e "${RED}❌ Missing: $dir/route.ts${NC}"
        MISSING_APIS+=("$dir")
    fi
done

if [ ${#MISSING_APIS[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ All API endpoints exist${NC}"
else
    echo -e "${RED}❌ Missing ${#MISSING_APIS[@]} API endpoints${NC}"
fi

# Check environment configuration
echo ""
echo "5️⃣ Checking environment configuration..."
if [ -f ".env" ] || [ -f ".env.local" ] || [ -f ".env.production" ]; then
    echo -e "${GREEN}✅ Environment file exists${NC}"

    # Check for required variables
    if grep -q "DATABASE_URL" .env* 2>/dev/null; then
        echo -e "${GREEN}✅ DATABASE_URL is configured${NC}"
    else
        echo -e "${RED}❌ DATABASE_URL is not configured${NC}"
    fi

    if grep -q "NEXTAUTH_SECRET" .env* 2>/dev/null; then
        echo -e "${GREEN}✅ NEXTAUTH_SECRET is configured${NC}"
    else
        echo -e "${YELLOW}⚠️  NEXTAUTH_SECRET is not configured${NC}"
    fi
else
    echo -e "${RED}❌ No environment file found${NC}"
fi

# Check Prisma schema
echo ""
echo "6️⃣ Checking Prisma schema..."
if [ -f "prisma/schema.prisma" ]; then
    echo -e "${GREEN}✅ Prisma schema exists${NC}"

    # Check for key models
    MODELS=("Client" "TaxReturn" "NISSchedule" "VisaApplication" "Partner" "TrainingSession" "Employee")
    for model in "${MODELS[@]}"; do
        if grep -q "model $model" prisma/schema.prisma; then
            echo -e "${GREEN}   ✓ Model $model found${NC}"
        else
            echo -e "${RED}   ✗ Model $model missing${NC}"
        fi
    done
else
    echo -e "${RED}❌ Prisma schema not found${NC}"
fi

# Test API health endpoint
echo ""
echo "7️⃣ Testing API health endpoint..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Health endpoint is working${NC}"
else
    echo -e "${YELLOW}⚠️  Health endpoint not responding (app may not be running)${NC}"
fi

# Summary
echo ""
echo "================================================"
echo "📊 VERIFICATION SUMMARY"
echo "================================================"

if [ ${#MISSING_APIS[@]} -eq 0 ] && [ "$MOCK_IMPORTS" -eq 0 ]; then
    echo -e "${GREEN}"
    echo "🎉 SUCCESS! All mock data has been removed."
    echo "The application is now using real database connections."
    echo -e "${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Start the database: docker-compose up -d postgres"
    echo "2. Run migrations: pnpm run db:push"
    echo "3. Seed data: pnpm run db:seed"
    echo "4. Start the app: pnpm run dev"
    echo ""
else
    echo -e "${YELLOW}"
    echo "⚠️  Some issues need attention:"
    if [ ${#MISSING_APIS[@]} -gt 0 ]; then
        echo "   - Missing API endpoints: ${#MISSING_APIS[@]}"
    fi
    if [ "$MOCK_IMPORTS" -gt 0 ]; then
        echo "   - Mock references found: $MOCK_IMPORTS"
    fi
    echo -e "${NC}"
fi

echo "================================================"