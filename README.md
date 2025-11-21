# GK Enterprise Suite

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
![Status](https://img.shields.io/badge/status-in--development-yellow.svg)
![Tech](https://img.shields.io/badge/stack-Next.js_16_|_Tailwind_v4_|_TypeScript-black.svg)

**The Unified Enterprise Operating System for Guyana Compliance & Management.**

This platform merges the financial rigor of **KAJ** with the strategic consultancy of **GCMC** into a single, powerful dashboard. It streamlines tax filings, accounting, payroll, immigration processing, client management, and corporate training.

---

## 📚 Documentation

*   **[Project Documentation](PROJECT_DOCS.md)**: Detailed breakdown of modules, features, and business logic.
*   **[System Architecture](ARCHITECTURE.md)**: Technical diagrams, data flow, and system design.
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
*   **npm** or **yarn**
*   **PostgreSQL** (v14 or higher) or use Docker Compose
*   **Git**

### Installation

1.  **Clone the repository**
    \`\`\`bash
    git clone https://github.com/your-org/GCMC-KAJ-Compliance-Platform.git
    cd GCMC-KAJ-Compliance-Platform
    \`\`\`

2.  **Install dependencies**
    \`\`\`bash
    npm install
    # or
    yarn install
    \`\`\`

3.  **Setup Database**
    
    Copy the example environment file and configure your database:
    \`\`\`bash
    cp .env.example .env
    # Edit .env and add your DATABASE_URL
    \`\`\`
    
    Push the schema and seed data:
    \`\`\`bash
    npm run db:push
    npm run db:seed
    \`\`\`

4.  **Run the development server**
    \`\`\`bash
    npm run dev
    # or
    yarn dev
    \`\`\`

5.  **Access the Application**
    *   **Admin Dashboard**: Open [http://localhost:3000](http://localhost:3000)
    *   **Client Portal**: Open [http://localhost:3000/portal](http://localhost:3000/portal)
    *   **Booking Page**: Open [http://localhost:3000/book](http://localhost:3000/book)

### 🐳 Docker Setup

To run the application with database in containers:

1.  **Start all services**
    \`\`\`bash
    docker-compose up -d
    \`\`\`

2.  **Access the application**
    Open [http://localhost:3000](http://localhost:3000)

3.  **Stop services**
    \`\`\`bash
    docker-compose down
    \`\`\`

---

## 🛠️ Technical Highlights

*   **Client Context System**: Global state management allows acting "on behalf of" specific clients across all modules.
*   **Dynamic Brand Context**: Seamlessly switches UI/UX between KAJ and GCMC modes.
*   **Mock API Layer**: Fully functional `lib/api.ts` for rapid prototyping and testing without a backend.
*   **Prisma ORM**: Type-safe database access with auto-generated TypeScript types.
*   **Zod Validation**: Comprehensive form validation with Guyana-specific calculators (NIS, PAYE, VAT).
*   **Production Ready**: Docker configuration, TypeScript strict mode, ESLint, and proper error handling.
*   **Responsive Design**: Mobile-first architecture using Tailwind CSS v4 with enhanced animations and transitions.
*   **Traffic Light Compliance**: Visual system for tracking document expiry (Green/Amber/Red).

---

## 🔐 Environment Variables

Required environment variables (see `.env.example` for complete list):

*   `DATABASE_URL`: PostgreSQL connection string
*   `NODE_ENV`: Environment mode (development/production)
*   `NEXTAUTH_SECRET`: Secret for authentication (when implemented)
*   `NEXTAUTH_URL`: Application URL for callbacks

## 📦 Scripts

*   `npm run dev`: Start development server
*   `npm run build`: Build for production
*   `npm run start`: Start production server
*   `npm run lint`: Run ESLint
*   `npm run type-check`: Check TypeScript types
*   `npm run db:push`: Sync Prisma schema to database
*   `npm run db:seed`: Populate database with sample data
*   `npm run db:studio`: Open Prisma Studio to view data

---

## 📄 License

**Copyright © 2025 GK Enterprise Suite.** All rights reserved.
This software is proprietary and confidential. Unauthorized copying, transfer, or use is strictly prohibited.
