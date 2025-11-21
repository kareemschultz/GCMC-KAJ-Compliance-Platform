# GCMC & KAJ Compliance Suite

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-production--ready-green.svg)
![Tech](https://img.shields.io/badge/stack-Next.js_14_|_Tailwind_|_TypeScript-black.svg)

**The Unified Enterprise Operating System for Guyana Compliance & Management.**

This platform merges the financial rigor of **KAJ** with the strategic consultancy of **GCMC** into a single, powerful dashboard. It streamlines tax filings, immigration processing, client management, and corporate training.

---

## 📚 Documentation

*   **[Project Documentation](PROJECT_DOCS.md)**: Detailed breakdown of modules, features, and business logic.
*   **[System Architecture](ARCHITECTURE.md)**: Technical diagrams, data flow, and system design.
*   **[Contributing Guidelines](CONTRIBUTING.md)**: Standards and workflow for developers.

---

## 🏢 Business Logic & Modules

The platform is designed around two core business pillars:

### 1. KAJ (Financial & Compliance)
*Focus: Regulatory adherence, Tax, and Financial Health.*

*   📊 **Tax Filings**: Automated VAT, PAYE, and CIT filing management with GRA integration logic.
*   💰 **Billing & Invoicing**: Revenue tracking and invoice generation.
*   📅 **Compliance Calendar**: Automated tracking of statutory deadlines.
*   📂 **Document Vault**: Secure storage for sensitive financial records.

### 2. GCMC (Consultancy & Management)
*Focus: Growth, Human Capital, and Legal Operations.*

*   🎓 **Training Hub**: Workshop scheduling, participant management, and certification tracking.
*   ✈️ **Immigration Pipeline**: Kanban-style management for Visas, Work Permits, and Citizenship.
*   ⚖️ **Paralegal Services**: Automated generation of legal agreements and affidavits.
*   🤝 **Partner Network**: Directory of verified strategic partners for client referrals.

---

## 🚀 Getting Started

### Prerequisites
*   **Node.js** (v18 or higher)
*   **npm** or **yarn**
*   **Git**

### Installation

1.  **Clone the repository**
    \`\`\`bash
    git clone https://github.com/your-org/gcmc-compliance-suite.git
    cd gcmc-compliance-suite
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

### 🐳 Docker Setup

To run the application in a containerized environment:

1.  **Build the image**
    \`\`\`bash
    docker build -t gcmc-suite .
    \`\`\`

2.  **Run the container**
    \`\`\`bash
    docker run -p 3000:3000 gcmc-suite
    \`\`\`

---

## 🛠️ Technical Highlights

*   **Dynamic Brand Context**: Seamlessly switches UI/UX between KAJ and GCMC modes.
*   **Mock API Layer**: Fully functional `lib/api.ts` for rapid prototyping and testing without a backend.
*   **Zod Validation**: Strict schema validation for all forms (Tax, Immigration, User Data).
*   **Responsive Design**: Mobile-first architecture using Tailwind CSS v4.

---

## 📄 License

**Copyright © 2025 GCMC & KAJ.** All rights reserved.
This software is proprietary and confidential. Unauthorized copying, transfer, or use is strictly prohibited.
