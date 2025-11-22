# GK Enterprise Suite - Production Setup Guide

This guide provides step-by-step instructions for deploying the GK Enterprise Suite to production with PostgreSQL.

## 🚀 Quick Start for Production

### 1. Environment Setup

**For PostgreSQL Production:**

Update your `.env` file:

```bash
# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/gcmc_kaj_db"

# NextAuth.js (Generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secure-secret-key-here"
NEXTAUTH_URL="https://your-domain.com"

# Application
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# Email (for notifications)
EMAIL_FROM="noreply@gcmc.gy"
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"

# Security
BCRYPT_ROUNDS="12"
JWT_EXPIRY="7d"
```

### 2. Update Prisma Schema for PostgreSQL

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Change back to proper types:
// String -> UserRole enum
// String JSON fields -> Json type

enum UserRole {
  SUPER_ADMIN
  GCMC_STAFF
  KAJ_STAFF
  CLIENT
}

model User {
  role UserRole @default(CLIENT)
  // ... other fields
}

model LegalDocument {
  contentJson Json // Change from String back to Json
  // ... other fields
}

model FinancialStatement {
  data Json // Change from String back to Json
  // ... other fields
}

model ExpediteJob {
  statusHistoryJson Json // Change from String back to Json
  // ... other fields
}
```

### 3. Docker Production Deployment

**Option A: Using Docker Compose (Recommended)**

```bash
# 1. Set up environment variables for production
cp .env.example .env.production
# Edit .env.production with your production values

# 2. Start PostgreSQL and application
docker-compose up -d

# 3. Access the application
# Web App: http://localhost:3000
# PgAdmin: http://localhost:5050 (admin@gcmc.gy / admin123)
```

**Option B: Manual PostgreSQL Setup**

```bash
# 1. Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# 2. Create database and user
sudo -u postgres createdb gcmc_kaj_db
sudo -u postgres createuser --superuser gcmc_user
sudo -u postgres psql -c "ALTER USER gcmc_user PASSWORD 'your_password';"

# 3. Update DATABASE_URL in .env
DATABASE_URL="postgresql://gcmc_user:your_password@localhost:5432/gcmc_kaj_db"

# 4. Push schema and seed database
pnpm run db:push
pnpm run db:seed

# 5. Build and start application
pnpm run build
pnpm run start
```

## 🔧 Production Optimizations

### 1. Database Configuration

**PostgreSQL Configuration (`postgresql.conf`):**

```conf
# Memory
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200

# Connection settings
max_connections = 100
```

### 2. Application Performance

**Next.js Configuration (`next.config.js`):**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbotrace: {
      logLevel: 'error'
    }
  },
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'gcmc.gy'],
    unoptimized: false
  }
}

module.exports = nextConfig
```

### 3. Security Headers

Add to your reverse proxy (nginx/Apache) or middleware:

```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;
```

## 🔐 Default Production Users

After seeding, these users will be available:

| Role | Email | Password | Access |
|------|-------|----------|---------|
| Super Admin | admin@gcmc.gy | admin123 | Full system |
| GCMC Staff | gcmc@gcmc.gy | gcmc123 | Immigration, Training, Legal |
| KAJ Staff | kaj@gcmc.gy | kaj123 | Tax, Accounting, Payroll |
| Client | client@abccorp.gy | client123 | Portal only |

**⚠️ IMPORTANT:** Change these passwords immediately in production!

## 📊 Monitoring & Health Checks

### 1. Application Health

The application includes a health check endpoint:

```bash
# Check application status
curl http://localhost:3000/api/health

# Expected response:
{"status": "ok", "database": "connected", "timestamp": "2025-01-01T00:00:00.000Z"}
```

### 2. Database Health

```bash
# Check database connectivity
pnpm run db:studio

# Or check via SQL
psql postgresql://username:password@localhost:5432/gcmc_kaj_db -c "SELECT 1;"
```

## 🚀 CI/CD Pipeline

**GitHub Actions Example (`.github/workflows/deploy.yml`):**

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm run test:e2e

      - name: Build application
        run: pnpm run build

      - name: Deploy to server
        # Your deployment script here
        run: |
          echo "Deploy to production server"
```

## 🔄 Backup Strategy

### 1. Database Backups

```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/backups/gcmc_kaj_db"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump postgresql://username:password@localhost:5432/gcmc_kaj_db > "$BACKUP_DIR/backup_$DATE.sql"

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +30 -delete
```

### 2. Application Data

```bash
# Backup uploaded files and assets
tar -czf /backups/app_data_$(date +%Y%m%d).tar.gz /app/public/uploads
```

## 📈 Scaling Considerations

### 1. Database Scaling

- **Read Replicas:** Set up PostgreSQL read replicas for reporting
- **Connection Pooling:** Use PgBouncer for connection management
- **Database Partitioning:** Partition large tables by date/client

### 2. Application Scaling

- **Horizontal Scaling:** Deploy multiple app instances behind load balancer
- **CDN:** Use CloudFlare or AWS CloudFront for static assets
- **Caching:** Implement Redis for session storage and caching

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors:**
   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql

   # Check connection
   psql $DATABASE_URL -c "SELECT version();"
   ```

2. **Build Errors:**
   ```bash
   # Clear caches
   rm -rf .next node_modules
   pnpm install
   pnpm run build
   ```

3. **Authentication Issues:**
   ```bash
   # Verify NEXTAUTH_SECRET is set
   echo $NEXTAUTH_SECRET

   # Check user exists in database
   psql $DATABASE_URL -c "SELECT email, role FROM \"User\";"
   ```

## 📞 Support

- **Documentation:** Check PROJECT_DOCS.md for business logic
- **Issues:** Create GitHub issue with reproduction steps
- **Security:** Email security@gcmc.gy for security issues

---

**Last Updated:** November 21, 2025
**Version:** 3.2.0
**Status:** Production Ready ✅