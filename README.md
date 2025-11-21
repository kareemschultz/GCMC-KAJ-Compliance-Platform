# GK Enterprise Suite

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
![Status](https://img.shields.io/badge/status-production--ready-green.svg)
![Tech](https://img.shields.io/badge/stack-Next.js_14_|_Tailwind_|_TypeScript-black.svg)

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
*   **Git**

### Installation

1.  **Clone the repository**
    \`\`\`bash
    git clone https://github.com/your-org/gk-enterprise-suite.git
    cd gk-enterprise-suite
    \`\`\`

2.  **Install dependencies**
    \`\`\`bash
    npm install
    # or
    yarn install
    \`\`\`

3.  **Run the development server**
    \`\`\`bash
    npm run dev
    # or
    yarn dev
    \`\`\`

4.  **Access the Application**
    *   **Admin Dashboard**: Open [http://localhost:3000](http://localhost:3000)
    *   **Client Portal**: Open [http://localhost:3000/portal](http://localhost:3000/portal)
    *   **Booking Page**: Open [http://localhost:3000/book](http://localhost:3000/book)

### 🐳 Docker Setup

To run the application in a containerized environment:

1.  **Build the image**
    \`\`\`bash
    docker build -t gk-suite .
    \`\`\`

2.  **Run the container**
    \`\`\`bash
    docker run -p 3000:3000 gk-suite
    \`\`\`

---

## 🛠️ Technical Highlights

*   **Client Context System**: Global state management allows acting "on behalf of" specific clients across all modules.
*   **Dynamic Brand Context**: Seamlessly switches UI/UX between KAJ and GCMC modes.
*   **Mock API Layer**: Fully functional `lib/api.ts` for rapid prototyping and testing without a backend.
*   **PostgreSQL Database**: Prisma ORM schema covering all entities (Clients, Tax, Immigration, Properties, Employees).
*   **Zod Validation**: Strict schema validation for all forms (Tax, Immigration, User Data).
*   **Responsive Design**: Mobile-first architecture using Tailwind CSS v4 with enhanced animations and transitions.
*   **Traffic Light Compliance**: Visual system for tracking document expiry (Green/Amber/Red).

---

## 📄 License

**Copyright © 2025 GK Enterprise Suite.** All rights reserved.
This software is proprietary and confidential. Unauthorized copying, transfer, or use is strictly prohibited.
