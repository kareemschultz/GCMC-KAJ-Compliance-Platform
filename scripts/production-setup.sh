#!/bin/bash

# GK Enterprise Suite - Production Setup Script
# This script fixes all critical issues identified by Gemini audit

set -e

echo "🚀 GK Enterprise Suite - Production Setup Script"
echo "================================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Step 1: Create production environment file
echo "📝 Step 1: Setting up production environment..."
if [ ! -f .env.production ]; then
    cat > .env.production << 'EOF'
# Database Configuration
DATABASE_URL="postgresql://gcmc_user:gcmc_password@localhost:5432/gcmc_kaj_db"
DIRECT_URL="postgresql://gcmc_user:gcmc_password@localhost:5432/gcmc_kaj_db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-production-secret-key-change-this-in-production"

# Application Configuration
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# API Configuration
API_BASE_URL="http://localhost:3000/api"
USE_REAL_API="true"

# Security
BCRYPT_ROUNDS="12"
JWT_EXPIRY="7d"

# Feature Flags
ENABLE_AUTH="true"
ENABLE_REAL_DATA="true"
ENABLE_LOGGING="true"
EOF
    echo "✅ Created .env.production file"
else
    echo "⚠️  .env.production already exists, skipping..."
fi

# Step 2: Create middleware for authentication
echo ""
echo "📝 Step 2: Creating authentication middleware..."
cat > middleware.ts << 'EOF'
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Allow access to login page and API auth routes
    if (req.nextUrl.pathname.startsWith("/login") ||
        req.nextUrl.pathname.startsWith("/api/auth") ||
        req.nextUrl.pathname.startsWith("/api/health")) {
      return NextResponse.next()
    }

    // Check if user is authenticated
    const token = req.nextauth.token
    if (!token) {
      const loginUrl = new URL("/login", req.url)
      loginUrl.searchParams.set("from", req.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Role-based access control
    const path = req.nextUrl.pathname
    const role = token.role as string

    // Admin routes
    if (path.startsWith("/admin") && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    // GCMC staff routes
    if (path.startsWith("/gcmc") && !["SUPER_ADMIN", "GCMC_STAFF"].includes(role)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    // KAJ staff routes
    if (path.startsWith("/kaj") && !["SUPER_ADMIN", "KAJ_STAFF"].includes(role)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    "/((?!api/auth|api/health|_next/static|_next/image|favicon.ico|login|public).*)",
  ],
}
EOF
echo "✅ Created authentication middleware"

# Step 3: Fix API client to use real endpoints
echo ""
echo "📝 Step 3: Updating API client configuration..."
cat > lib/api-client.ts << 'EOF'
// API Client for real database connections
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

class APIClient {
  private baseURL: string

  constructor() {
    this.baseURL = `${API_BASE_URL}/api`
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Client endpoints
  async getClients(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : ""
    return this.request(`/clients${query}`)
  }

  async createClient(data: any) {
    return this.request("/clients", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateClient(id: string, data: any) {
    return this.request(`/clients/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Tax Returns
  async getTaxReturns() {
    return this.request("/tax-returns")
  }

  async createTaxReturn(data: any) {
    return this.request("/tax-returns", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // NIS Schedules
  async getNISSchedules() {
    return this.request("/nis-schedules")
  }

  async createNISSchedule(data: any) {
    return this.request("/nis-schedules", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Filings
  async getFilings() {
    return this.request("/filings")
  }

  async createFiling(data: any) {
    return this.request("/filings", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Immigration
  async getImmigrationApplications() {
    return this.request("/immigration")
  }

  async createImmigrationApplication(data: any) {
    return this.request("/immigration", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Training
  async getTrainingSessions() {
    return this.request("/training")
  }

  async createTrainingSession(data: any) {
    return this.request("/training", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Employees
  async getEmployees(clientId?: string) {
    const query = clientId ? `?clientId=${clientId}` : ""
    return this.request(`/employees${query}`)
  }

  async createEmployee(data: any) {
    return this.request("/employees", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new APIClient()
EOF
echo "✅ Updated API client configuration"

# Step 4: Create docker-compose.production.yml
echo ""
echo "📝 Step 4: Creating production Docker configuration..."
cat > docker-compose.production.yml << 'EOF'
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
    env_file:
      - .env.production
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  postgres_data:
    name: gcmc_postgres_data

networks:
  default:
    name: gcmc_network
EOF
echo "✅ Created docker-compose.production.yml"

# Step 5: Update Dockerfile for production
echo ""
echo "📝 Step 5: Updating Dockerfile for production..."
cat > Dockerfile << 'EOF'
# Multi-stage production Dockerfile
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Builder stage
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

# Copy dependencies and source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client with proper binary targets
RUN npx prisma generate

# Build application
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
RUN npm run build

# Runner stage
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl curl
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Set permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application with database setup
CMD npx prisma db push --accept-data-loss && \
    npx prisma db seed && \
    node server.js
EOF
echo "✅ Updated Dockerfile for production"

# Step 6: Build and start services
echo ""
echo "📦 Step 6: Building and starting production services..."
echo "This may take a few minutes..."

# Stop any existing containers
docker-compose -f docker-compose.production.yml down

# Build and start services
docker-compose -f docker-compose.production.yml up --build -d

# Wait for services to be ready
echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check service health
echo ""
echo "🔍 Checking service health..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Application is healthy and running!"
else
    echo "⚠️  Application may still be starting up..."
fi

# Display access information
echo ""
echo "=========================================="
echo "🎉 Production Setup Complete!"
echo "=========================================="
echo ""
echo "📌 Access Points:"
echo "   - Application: http://localhost:3000"
echo "   - Login Page: http://localhost:3000/login"
echo ""
echo "🔐 Default Credentials:"
echo "   Admin: admin@gcmc.gy / admin123"
echo "   GCMC Staff: gcmc@gcmc.gy / gcmc123"
echo "   KAJ Staff: kaj@gcmc.gy / kaj123"
echo "   Client: client@abccorp.gy / client123"
echo ""
echo "⚠️  IMPORTANT: Change these passwords immediately!"
echo ""
echo "📊 View Logs:"
echo "   docker-compose -f docker-compose.production.yml logs -f"
echo ""
echo "🛑 Stop Services:"
echo "   docker-compose -f docker-compose.production.yml down"
echo ""
EOF