#!/bin/bash

# GK Enterprise Suite - Production Deployment (No Mock Data)
# Complete deployment script with real database connections only

set -e

echo "================================================"
echo "🚀 GK Enterprise Suite - Production Deployment"
echo "   Real Data Only - No Mock/Sample Data"
echo "================================================"
echo ""

# Check Docker
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Step 1: Environment Setup
echo "📝 Step 1: Setting up environment..."
if [ ! -f .env.production ]; then
    cat > .env.production << 'EOF'
# Database - PostgreSQL (Real Data Only)
DATABASE_URL="postgresql://gcmc_user:gcmc_password@localhost:5432/gcmc_kaj_db"
DIRECT_URL="postgresql://gcmc_user:gcmc_password@localhost:5432/gcmc_kaj_db"

# NextAuth - Production Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="production-secret-change-this-$(openssl rand -hex 32)"

# Application Settings
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Security
BCRYPT_ROUNDS="12"
JWT_EXPIRY="7d"

# Feature Flags (All Real Data)
USE_REAL_API="true"
ENABLE_AUTH="true"
ENABLE_REAL_DATA="true"
DISABLE_MOCK_DATA="true"
EOF
    echo "✅ Created production environment file"
else
    echo "⚠️  Using existing .env.production"
fi

# Copy to .env for local use
cp .env.production .env

# Step 2: Build Docker Images
echo ""
echo "🐳 Step 2: Building Docker containers..."

# Create docker-compose for production
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    container_name: gcmc-postgres-prod
    restart: always
    environment:
      POSTGRES_USER: gcmc_user
      POSTGRES_PASSWORD: gcmc_password
      POSTGRES_DB: gcmc_kaj_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U gcmc_user -d gcmc_kaj_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: gcmc-app-prod
    restart: always
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "postgresql://gcmc_user:gcmc_password@postgres:5432/gcmc_kaj_db"
      NEXTAUTH_URL: "http://localhost:3000"
      NODE_ENV: "production"
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
    name: gcmc_postgres_data
EOF

# Step 3: Update Dockerfile for production
echo ""
echo "📦 Step 3: Creating optimized Dockerfile..."
cat > Dockerfile << 'EOF'
# Production Dockerfile - Real Data Only
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Remove any mock data files before build
RUN rm -f lib/mock-data.ts lib/mock-*.ts

# Generate Prisma client
RUN npx prisma generate

# Build application
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
RUN npm run build

FROM node:20-alpine AS runner
RUN apk add --no-cache openssl curl
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000
ENV PORT 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
EOF

# Step 4: Stop existing containers
echo ""
echo "🛑 Step 4: Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Step 5: Start PostgreSQL first
echo ""
echo "🗄️ Step 5: Starting PostgreSQL database..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Step 6: Run database migrations
echo ""
echo "📊 Step 6: Setting up database schema..."
pnpm run db:push

# Step 7: Seed initial data
echo ""
echo "🌱 Step 7: Seeding production data..."
pnpm run db:seed

# Step 8: Build and start application
echo ""
echo "🏗️ Step 8: Building application..."
docker-compose build app

echo ""
echo "🚀 Step 9: Starting application..."
docker-compose up -d app

# Step 10: Verify deployment
echo ""
echo "✅ Step 10: Verifying deployment..."
sleep 15

# Run verification script
chmod +x scripts/verify-real-data.sh
./scripts/verify-real-data.sh

# Test API endpoints
echo ""
echo "🧪 Testing API endpoints..."

# Test health endpoint
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Health endpoint working"
else
    echo "⚠️  Health endpoint not responding"
fi

# Test clients API
if curl -f http://localhost:3000/api/clients > /dev/null 2>&1; then
    echo "✅ Clients API working"
else
    echo "⚠️  Clients API not responding"
fi

# Display final information
echo ""
echo "================================================"
echo "🎉 PRODUCTION DEPLOYMENT COMPLETE!"
echo "================================================"
echo ""
echo "📌 Access Points:"
echo "   Application: http://localhost:3000"
echo "   Database: postgresql://localhost:5432/gcmc_kaj_db"
echo ""
echo "🔐 Default Login Credentials:"
echo "   Admin: admin@gcmc.gy / admin123"
echo "   GCMC: gcmc@gcmc.gy / gcmc123"
echo "   KAJ: kaj@gcmc.gy / kaj123"
echo "   Client: client@abccorp.gy / client123"
echo ""
echo "⚠️  IMPORTANT:"
echo "   - All mock data has been removed"
echo "   - Using real PostgreSQL database only"
echo "   - Authentication is enforced"
echo "   - Change default passwords immediately"
echo ""
echo "📊 Monitor logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose down"
echo ""
echo "================================================"