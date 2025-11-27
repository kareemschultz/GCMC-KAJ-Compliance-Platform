# GK Enterprise Suite

![Version](https://img.shields.io/badge/version-3.3.1-blue.svg)
![Status](https://img.shields.io/badge/status-production--ready-brightgreen.svg)
![Docker](https://img.shields.io/badge/docker-ready-2496ED.svg)
![Tech](https://img.shields.io/badge/stack-Next.js_16_|_Tailwind_v4_|_TypeScript-black.svg)
![Tests](https://img.shields.io/badge/tests-36_E2E_tests_(100%25_pass)-brightgreen.svg)
![Security](https://img.shields.io/badge/security-production--hardened-blue.svg)

**The Production-Ready Unified Enterprise Operating System for Guyana Compliance & Management.**

This platform merges the financial rigor of **KAJ** with the strategic consultancy of **GCMC** into a single, powerful dashboard. It streamlines tax filings, accounting, payroll, immigration processing, client management, and corporate training with enterprise-grade security and comprehensive testing.

## 🚀 Latest Production Ready Release (v3.3.1)

**✅ DOCKER DEPLOYMENT READY - FULLY CONTAINERIZED**

Complete Docker containerization with production-grade infrastructure:

- **🐳 Docker Deployment**: Full containerization with PostgreSQL, PgAdmin, and application
- **🔧 Prisma Alpine Linux Fix**: Resolved SSL compatibility and binary targets for production containers
- **🔐 Authentication System**: NextAuth.js properly configured for Docker localhost access
- **🗄️ Database Infrastructure**: PostgreSQL 14-alpine running in Docker with persistent data
- **📊 Health Monitoring**: Production health checks with `/api/health` endpoint
- **🛡️ Production Security**: Enhanced cookie handling and secure authentication flow

> **Status**: Application is fully containerized and production-ready with Docker Compose orchestration. Running on http://localhost:3000

---

## 📚 Documentation

*   **[Production Setup Guide](PRODUCTION_SETUP.md)**: **🚀 Complete production deployment guide** with PostgreSQL, Docker, and CI/CD setup.
*   **[Project Documentation](PROJECT_DOCS.md)**: Detailed breakdown of modules, features, and business logic.
*   **[System Architecture](ARCHITECTURE.md)**: Technical diagrams, data flow, and system design.
*   **[API Reference](API.md)**: Complete API documentation with endpoints and examples.
*   **[UI/UX Enhancements](IMPROVEMENTS_DOCUMENTATION.md)**: Comprehensive guide to recent validation and UI improvements.
*   **[Testing Guide](TESTING.md)**: Comprehensive E2E testing with Playwright (65 tests).
*   **[Deployment Guide](DEPLOYMENT.md)**: Production deployment instructions and best practices.
*   **[Security Documentation](SECURITY.md)**: Security architecture and best practices.
*   **[Contributing Guidelines](CONTRIBUTING.md)**: Standards and workflow for developers.

---

## 🏢 Business Logic & Modules

The platform is designed around two core business pillars, unified by a global **Client Context System**:

### 1. KAJ (Financial & Compliance)
*Focus: Regulatory adherence, Tax, Accounting, and Financial Health.*

*   📊 **Accounting & Reports**: Financial statements (P&L, Cash Flow), Audit workflows, and Banking services.
*   💸 **NIS & Payroll**: Automated payroll calculations, NIS schedule generation, employee registry, and 7B Tax Calculator.
*   📝 **Tax Filings**: Automated VAT, PAYE, and CIT filing management with GRA integration logic.
*   📅 **Compliance Calendar**: Automated tracking of statutory deadlines with Traffic Light system.

### 2. GCMC (Consultancy & Management)
*Focus: Growth, Human Capital, and Legal Operations.*

*   🎓 **Training Hub**: Workshop scheduling, participant management, and certification tracking.
*   ✈️ **Immigration Pipeline**: Kanban-style management for Visas, Work Permits, and Citizenship.
*   ⚖️ **Paralegal Services**: Automated generation of legal agreements and affidavits.
*   🤝 **Partner Network**: Directory of verified strategic partners for client referrals.
*   🏢 **Property Management**: Track rental properties, tenant details, lease schedules, and management fees.
*   📋 **Expediting Service**: Visual timeline tracker for documents moving through government agencies.
*   🔍 **Local Content Registration**: Ministry of Natural Resources compliance checklist with 5 mandatory documents.

---

## 🚀 Getting Started

### Prerequisites
*   **Node.js** (v18 or higher)
*   **pnpm** (recommended package manager)
*   **PostgreSQL** (v14 or higher) or use Docker Compose
*   **Git**
*   **Docker** (optional, for containerized deployment)

### Installation

1.  **Clone the repository**
    \`\`\`bash
    git clone https://github.com/kareemschultz/GCMC-KAJ-Compliance-Platform.git
    cd GCMC-KAJ-Compliance-Platform
    \`\`\`

2.  **Install dependencies**
    \`\`\`bash
    pnpm install
    \`\`\`

3.  **Setup Environment Variables**

    Copy the example environment file and configure your database:
    ```bash
    cp .env.example .env
    ```

    **Important**: Update the `.env` file with proper values:
    - Generate a secure `NEXTAUTH_SECRET`: `openssl rand -base64 32`
    - Change `NODE_ENV=development` for development mode
    - The default database configuration should work with the Docker setup

4.  **Setup Database**

    **Option A: Using Docker (Recommended)**
    ```bash
    # Start PostgreSQL database using Docker
    pnpm run db:up
    ```

    **Option B: Using Local PostgreSQL**
    - Install PostgreSQL locally
    - Update DATABASE_URL in .env with your local connection string

    **Initialize Database Schema and Data:**
    ```bash
    # Push schema to database
    pnpm run db:push

    # Seed with sample data
    pnpm run db:seed
    ```

    **Note**: If you encounter port conflicts (5432 already in use):
    ```bash
    # Check what's using port 5432
    lsof -i :5432

    # Stop conflicting PostgreSQL containers
    docker stop <container_name>
    ```

5.  **Run the development server**
    ```bash
    pnpm run dev
    ```

6.  **Access the Application**
    *   **Admin Dashboard**: [http://localhost:3000](http://localhost:3000)
    *   **Client Portal**: [http://localhost:3000/portal](http://localhost:3000/portal)
    *   **Booking Page**: [http://localhost:3000/book](http://localhost:3000/book)

### 🔐 Default Login Credentials

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Super Admin | admin@gcmc.gy | admin123 | Full system access |
| GCMC Staff | gcmc@gcmc.gy | gcmc123 | Immigration, Training, Legal |
| KAJ Staff | kaj@gcmc.gy | kaj123 | Tax, Accounting, Payroll |
| Client | client@abccorp.gy | client123 | Portal access only |

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### 1. Port Conflicts
- **Port 3000 in use**: Kill the process using `lsof -i :3000` then `kill -9 <PID>`
- **Port 5432 in use**: Stop conflicting PostgreSQL with `docker stop <container_name>`

#### 2. Prisma Issues
- **Cannot find module '.prisma/client'**: Run `pnpm run db:generate`
- **Database connection failed**: Ensure PostgreSQL is running and DATABASE_URL is correct

#### 3. Environment Configuration
- **NextAuth configuration error**: Ensure NEXTAUTH_SECRET is set in .env
- **Server configuration error**: Check that all required environment variables are set

#### 4. Database Issues
- **Migration failed**: Try `pnpm run db:push` to sync schema
- **Seed failed**: Ensure database is empty or reset with `pnpm run db:reset`

#### 5. Development Server Issues
- **Build errors**: Try deleting `.next` folder and restart: `rm -rf .next && pnpm run dev`
- **Module not found**: Run `pnpm install` to ensure all dependencies are installed

### 🐳 Docker Setup (Recommended for Production)

**Quick Start with Docker Compose:**

1.  **Prerequisites**
    - Docker Desktop installed and running
    - Git for cloning the repository

2.  **Deploy with Docker Compose**
    ```bash
    # Clone the repository
    git clone https://github.com/kareemschultz/GCMC-KAJ-Compliance-Platform.git
    cd GCMC-KAJ-Compliance-Platform

    # Copy production environment template
    cp .env.production.example .env.production
    # Edit .env.production with your production values if needed

    # Start all services (PostgreSQL + Application + PgAdmin)
    docker-compose up -d
    ```

3.  **Access the Application**
    - **Main Application**: [http://localhost:3000](http://localhost:3000)
    - **Database Admin (PgAdmin)**: [http://localhost:5050](http://localhost:5050)
    - **Health Check**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

4.  **Verify Deployment**
    ```bash
    # Check container status
    docker ps

    # View application logs
    docker logs gcmc-compliance-suite

    # Test health endpoint
    curl http://localhost:3000/api/health
    ```

5.  **Stop Services**
    ```bash
    docker-compose down
    ```

#### **What Gets Deployed**
- **gcmc-compliance-suite**: Main application container (Next.js 16 + TypeScript)
- **gcmc-postgres**: PostgreSQL 14-alpine database with persistent data
- **gcmc-pgadmin**: Database administration interface

---

## 🛠️ Technical Highlights

### 🔐 **Production-Grade Security**
*   **NextAuth.js Authentication**: Role-based access control with JWT sessions
*   **Security Headers**: CSP, XSS protection, HSTS, and secure configurations
*   **Input Sanitization**: Comprehensive protection against XSS and injection attacks
*   **Rate Limiting**: API endpoint protection with configurable limits
*   **Password Hashing**: Bcrypt with 12 rounds for secure password storage

### 🗄️ **Database & API Architecture**
*   **Prisma ORM**: Type-safe database access with auto-generated TypeScript types
*   **PostgreSQL**: Robust relational database with proper indexing and relations
*   **RESTful APIs**: Complete API endpoints with validation and error handling
*   **Real-time Updates**: Optimistic updates with fallback to mock data during development

### 🎨 **Frontend Excellence**
*   **Next.js 16 App Router**: Latest routing patterns with Server Components
*   **Tailwind CSS v4**: Modern styling with enhanced animations and responsive design
*   **TypeScript Strict Mode**: Complete type safety across the application
*   **Component Library**: shadcn/ui components with consistent design system
*   **Enhanced UI/UX**: Flexible validation system, searchable dropdowns, and Guyana-specific input formatting

### 🧪 **Comprehensive Testing** ✅ **VERIFIED PRODUCTION-READY**
*   **36 Core E2E Tests**: Complete workflow validation with Playwright (**100% Pass Rate**)
*   **Real Database Integration**: All tests use PostgreSQL, no mock data
*   **Multi-Browser Testing**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
*   **Authentication Testing**: All user roles (Admin, GCMC, KAJ, Client) verified
*   **Business Logic Testing**: Tax calculations, client management, filing systems
*   **Performance Testing**: Sub-20ms API response times verified
*   **Latest Test Results**: [View Comprehensive Report](test-results/comprehensive-test-report-1764092555689.html)

### 🚀 **DevOps & Deployment**
*   **Docker Containerization**: Multi-stage builds with health checks
*   **Environment Configurations**: Separate dev/staging/production setups
*   **CI/CD Ready**: GitHub Actions integration with automated testing
*   **Database Migrations**: Automated schema management with Prisma

### 💼 **Business Logic Features**
*   **Client Context System**: Global state management for multi-client operations
*   **Dynamic Brand Context**: Seamless switching between KAJ and GCMC modes
*   **Compliance Tracking**: Traffic Light system for document expiry monitoring
*   **Guyana-Specific Calculators**: NIS, PAYE, VAT calculation engines

---

## 🔐 Environment Variables

Required environment variables (see `.env.example` for complete list):

*   `DATABASE_URL`: PostgreSQL connection string
*   `NODE_ENV`: Environment mode (development/production)
*   `NEXTAUTH_SECRET`: Secret for authentication (when implemented)
*   `NEXTAUTH_URL`: Application URL for callbacks

## 📦 Scripts

### Development
*   `pnpm run dev`: Start development server
*   `pnpm run build`: Build for production
*   `pnpm run start`: Start production server
*   `pnpm run lint`: Run ESLint

### Database
*   `pnpm run db:generate`: Generate Prisma client
*   `pnpm run db:push`: Sync Prisma schema to database
*   `pnpm run db:seed`: Populate database with sample data
*   `pnpm run db:studio`: Open Prisma Studio to view data

### Testing
*   `pnpm run test:e2e`: Run all E2E tests
*   `pnpm run test:e2e:ui`: Interactive test runner
*   `pnpm run test:e2e:headed`: Run tests with visible browser
*   `pnpm run test:e2e:debug`: Debug tests
*   `pnpm run test:e2e:report`: View test report
*   `pnpm run test:setup`: Setup testing environment

---

## 📄 License

**Copyright © 2025 GK Enterprise Suite.** All rights reserved.
This software is proprietary and confidential. Unauthorized copying, transfer, or use is strictly prohibited.
