# Deployment Guide - GK Enterprise Suite

## Overview

This guide covers production deployment of the GK Enterprise Suite, including Docker containerization, environment configuration, database setup, and monitoring.

## Prerequisites

### System Requirements
- **Operating System**: Linux (Ubuntu 20.04+ recommended) or macOS
- **Node.js**: v18.0+ or Docker
- **Memory**: Minimum 4GB RAM (8GB+ recommended)
- **Storage**: Minimum 20GB available space
- **Network**: HTTPS certificate for production domains

### Required Software
- **Docker**: v20.0+ with Docker Compose v2.0+
- **PostgreSQL**: v14+ (if not using Docker)
- **Git**: For code deployment
- **Nginx**: For reverse proxy (optional but recommended)

---

## Quick Start with Docker

### 1. Clone Repository
```bash
git clone https://github.com/your-org/gk-enterprise-suite.git
cd gk-enterprise-suite
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

### 3. Deploy with Docker Compose
```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f app
```

### 4. Initialize Database
```bash
# Run database migrations
docker-compose exec app pnpm run db:push

# Seed initial data
docker-compose exec app pnpm run db:seed
```

### 5. Verify Deployment
- **Application**: http://localhost:3000
- **Database Admin**: http://localhost:5050 (pgAdmin)
- **Health Check**: http://localhost:3000/api/health

---

## Environment Configuration

### Production Environment Variables

Create `.env` file with the following configuration:

```bash
# Application
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/gk_enterprise
POSTGRES_USER=gkuser
POSTGRES_PASSWORD=secure_password_here
POSTGRES_DB=gk_enterprise

# Authentication
NEXTAUTH_SECRET=your-super-secure-secret-key-here
NEXTAUTH_URL=https://your-domain.com

# Security
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60000

# Monitoring (Optional)
SENTRY_DSN=https://your-sentry-dsn
LOG_LEVEL=info
```

### Security Best Practices for Environment

1. **Generate Secure Secrets**:
```bash
# Generate NextAuth secret
openssl rand -base64 32

# Generate PostgreSQL password
openssl rand -base64 24
```

2. **File Permissions**:
```bash
# Restrict access to environment file
chmod 600 .env
```

3. **Environment Validation**:
The application validates required environment variables on startup.

---

## Database Setup

### Option 1: Docker PostgreSQL (Recommended)

The `docker-compose.yml` includes a PostgreSQL service:

```yaml
postgres:
  image: postgres:16-alpine
  environment:
    POSTGRES_USER: ${POSTGRES_USER}
    POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    POSTGRES_DB: ${POSTGRES_DB}
  volumes:
    - postgres_data:/var/lib/postgresql/data
  ports:
    - "5432:5432"
```

### Option 2: External PostgreSQL

For external PostgreSQL (AWS RDS, Google Cloud SQL, etc.):

```bash
# Update DATABASE_URL in .env
DATABASE_URL=postgresql://username:password@db-host:5432/database_name

# Remove postgres service from docker-compose.yml
# Or comment out the postgres section
```

### Database Migration

```bash
# Apply schema changes
pnpm run db:push

# Generate Prisma client
pnpm run db:generate

# Seed initial data (includes admin users)
pnpm run db:seed

# View data in browser
pnpm run db:studio
```

### Backup Strategy

```bash
#!/bin/bash
# backup.sh - Database backup script

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/path/to/backups"
DB_NAME="gk_enterprise"

# Create backup
pg_dump -h localhost -U gkuser -d $DB_NAME > "$BACKUP_DIR/gk_enterprise_$DATE.sql"

# Compress backup
gzip "$BACKUP_DIR/gk_enterprise_$DATE.sql"

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

---

## Docker Deployment

### Production Docker Configuration

**Dockerfile**:
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV NODE_ENV production

CMD ["npm", "start"]
```

**docker-compose.yml** for production:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://gkuser:${POSTGRES_PASSWORD}@postgres:5432/gk_enterprise
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: gkuser
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: gk_enterprise
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U gkuser -d gk_enterprise"]
      interval: 10s
      timeout: 5s
      retries: 5

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

### Build and Deploy

```bash
# Build for production
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Monitor logs
docker-compose -f docker-compose.prod.yml logs -f

# Scale application (if needed)
docker-compose -f docker-compose.prod.yml up -d --scale app=3
```

---

## Reverse Proxy Configuration

### Nginx Configuration

**nginx.conf**:
```nginx
events {
    worker_connections 1024;
}

http {
    upstream gk_enterprise {
        server app:3000;
        # Add more servers for load balancing
        # server app2:3000;
        # server app3:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    server {
        listen 80;
        server_name your-domain.com;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE+AESGCM:ECDHE+CHACHA20:DHE+AESGCM:DHE+CHACHA20:!aNULL:!MD5:!DSS;

        # Security Headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # Rate limiting for sensitive endpoints
        location /api/auth/ {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://gk_enterprise;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://gk_enterprise;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location / {
            proxy_pass http://gk_enterprise;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # WebSocket support (if needed in future)
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }

        # Static file caching
        location /_next/static/ {
            proxy_cache_valid 200 1y;
            proxy_pass http://gk_enterprise;
        }
    }
}
```

---

## SSL Certificate Setup

### Option 1: Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal (crontab)
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

### Option 2: Manual Certificate

```bash
# Create SSL directory
mkdir -p ssl

# Copy your certificate files
cp your-certificate.pem ssl/fullchain.pem
cp your-private-key.pem ssl/privkey.pem

# Set proper permissions
chmod 644 ssl/fullchain.pem
chmod 600 ssl/privkey.pem
```

---

## Monitoring & Health Checks

### Health Check Endpoint

The application provides a comprehensive health check:

```bash
curl -f http://localhost:3000/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T20:00:00.000Z",
  "version": "3.0.0",
  "services": {
    "database": "connected",
    "auth": "operational",
    "api": "operational"
  },
  "uptime": 86400000
}
```

### Docker Health Checks

Health checks are configured in `docker-compose.yml`:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 60s
```

### Monitoring Script

**monitor.sh**:
```bash
#!/bin/bash
# Simple monitoring script

SERVICE_URL="https://your-domain.com"
HEALTH_ENDPOINT="$SERVICE_URL/api/health"
ALERT_EMAIL="admin@your-domain.com"

# Check health endpoint
if ! curl -f "$HEALTH_ENDPOINT" > /dev/null 2>&1; then
    echo "Service is DOWN at $(date)" | mail -s "GK Enterprise Suite Alert" $ALERT_EMAIL
    exit 1
fi

# Check database connectivity
if ! docker-compose exec postgres pg_isready -U gkuser > /dev/null 2>&1; then
    echo "Database is DOWN at $(date)" | mail -s "Database Alert" $ALERT_EMAIL
    exit 1
fi

echo "All services healthy at $(date)"
```

---

## Backup & Recovery

### Automated Backup Script

**backup-system.sh**:
```bash
#!/bin/bash
set -e

# Configuration
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30
S3_BUCKET="your-backup-bucket"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
echo "Starting database backup..."
docker-compose exec -T postgres pg_dump -U gkuser gk_enterprise | gzip > "$BACKUP_DIR/db_backup_$DATE.sql.gz"

# Application files backup
echo "Starting application backup..."
tar -czf "$BACKUP_DIR/app_backup_$DATE.tar.gz" \
    --exclude=node_modules \
    --exclude=.next \
    --exclude=.git \
    /path/to/app

# Upload to S3 (optional)
if command -v aws &> /dev/null; then
    aws s3 cp "$BACKUP_DIR/db_backup_$DATE.sql.gz" "s3://$S3_BUCKET/database/"
    aws s3 cp "$BACKUP_DIR/app_backup_$DATE.tar.gz" "s3://$S3_BUCKET/application/"
fi

# Cleanup old backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed successfully!"
```

### Recovery Procedures

**Database Recovery**:
```bash
# Stop application
docker-compose stop app

# Restore database
gunzip -c backup_file.sql.gz | docker-compose exec -T postgres psql -U gkuser -d gk_enterprise

# Start application
docker-compose start app
```

**Full System Recovery**:
```bash
# Restore application files
tar -xzf app_backup_YYYYMMDD_HHMMSS.tar.gz -C /path/to/restore

# Restore database (as above)

# Rebuild and start
docker-compose build
docker-compose up -d
```

---

## Performance Optimization

### Docker Optimization

**Multi-stage Build Optimization**:
```dockerfile
# Use specific versions for reproducible builds
FROM node:18.17.1-alpine AS deps

# Enable BuildKit for faster builds
# DOCKER_BUILDKIT=1 docker build .

# Optimize layer caching
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm@8.6.12
```

### Database Optimization

**PostgreSQL Configuration**:
```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_filings_client_id ON filings(client_id);
CREATE INDEX idx_filings_due_date ON filings(due_date);
CREATE INDEX idx_users_email ON users(email);

-- Enable query performance insights
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET track_activity_query_size = 2048;
```

### Application Performance

**Next.js Optimizations**:
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
  experimental: {
    optimizeCss: true,
  }
}
```

---

## Security Hardening

### Container Security

```bash
# Run as non-root user
USER nextjs

# Remove unnecessary packages
RUN apk del .build-deps

# Use read-only filesystem
docker run --read-only --tmpfs /tmp gk-enterprise-suite
```

### Network Security

**Firewall Configuration**:
```bash
# Allow only necessary ports
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

**Docker Network Isolation**:
```yaml
# docker-compose.yml
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true
```

---

## Troubleshooting

### Common Issues

1. **Database Connection Failed**:
```bash
# Check database status
docker-compose logs postgres

# Verify connection string
docker-compose exec app env | grep DATABASE_URL
```

2. **Application Won't Start**:
```bash
# Check application logs
docker-compose logs app

# Verify environment variables
docker-compose exec app printenv
```

3. **Memory Issues**:
```bash
# Check container memory usage
docker stats

# Increase memory limits
# Add to docker-compose.yml:
deploy:
  resources:
    limits:
      memory: 2G
```

### Log Analysis

**Centralized Logging**:
```yaml
# Add to docker-compose.yml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

**Log Rotation**:
```bash
# Configure logrotate
cat > /etc/logrotate.d/docker << EOF
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}
EOF
```

---

## Scaling

### Horizontal Scaling

**Load Balancer Configuration**:
```yaml
# docker-compose.scale.yml
services:
  app:
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
```

### Database Scaling

**Read Replicas**:
```yaml
postgres-replica:
  image: postgres:16-alpine
  environment:
    POSTGRES_USER: replica_user
    POSTGRES_PASSWORD: replica_password
    PGUSER: postgres
  command: postgres -c config_file=/etc/postgresql/postgresql.conf
```

---

## Maintenance

### Regular Maintenance Tasks

**Weekly Maintenance Script**:
```bash
#!/bin/bash
# weekly-maintenance.sh

# Update system packages
sudo apt update && sudo apt upgrade -y

# Cleanup Docker
docker system prune -f

# Restart services
docker-compose restart

# Run health checks
./monitor.sh

# Generate backup
./backup-system.sh
```

### Update Procedure

```bash
# 1. Backup current system
./backup-system.sh

# 2. Pull latest code
git pull origin main

# 3. Update dependencies
docker-compose pull

# 4. Rebuild application
docker-compose build

# 5. Update database schema
docker-compose exec app pnpm run db:push

# 6. Restart services
docker-compose up -d

# 7. Verify deployment
curl -f https://your-domain.com/api/health
```

---

## Support

### Getting Help

- **Documentation**: Check this guide and other documentation files
- **Logs**: Always include relevant logs when reporting issues
- **Health Check**: Run `/api/health` endpoint for system status
- **Community**: Join our discussion forums or chat

### Reporting Issues

When reporting deployment issues, include:
1. Operating system and version
2. Docker and Docker Compose versions
3. Environment configuration (sanitized)
4. Full error logs
5. Steps to reproduce

For production support, contact: support@your-domain.com