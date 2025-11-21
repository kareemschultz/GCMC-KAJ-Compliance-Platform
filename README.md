# GCMC & KAJ Compliance Suite

A comprehensive enterprise compliance management platform tailored for **GCMC & KAJ**, designed to streamline operations with the **Guyana Revenue Authority (GRA)**, **National Insurance Scheme (NIS)**, and **Deeds & Commercial Registries Authority (DCRA)**.

## 🚀 Project Overview

**GCMC & KAJ Compliance Suite** is a dual-interface application:
1.  **Admin Command Center**: For GCMC & KAJ staff to manage clients, filings, and documents.
2.  **Client Portal**: For external clients to view their compliance status, upload documents, and pay invoices.

## 🌟 Key Features

### 🇬🇾 Regulatory Compliance (Guyana)
*   **GRA Integration**: Full support for **VAT (Form VAT-3)**, **PAYE (Form 5)**, **Corporation Tax**, and **Property Tax**.
*   **NIS Management**: Automated **Compliance Certificate** requests and contribution schedules.
*   **DCRA Services**: Business Registration workflows with built-in fee logic ($5,000/$6,000 GYD).
*   **Compliance Calendar**: Tracks critical 2025 deadlines (e.g., May 9th Tax Extension).

### 🏢 Enterprise Management
*   **Client Onboarding Wizard**: 5-step KYC process with "Individual" vs "Company" logic.
*   **Document Generator**: Create legal templates (Affidavits, Agreements) instantly.
*   **Billing & Invoicing**: Track revenue, generate invoices, and monitor payments.
*   **Audit Logs**: Full traceability of every action for security and accountability.

### 💻 Technical Highlights
*   **Role-Based Access**: Admin, Compliance Officer, and Client roles.
*   **Dark Mode**: Fully responsive UI with system-wide theme support.
*   **Mock API Layer**: Production-ready frontend structure with simulated backend latency.
*   **Docker Ready**: Includes `Dockerfile` and CI/CD pipelines for easy deployment.

## 🛠️ Tech Stack

*   **Framework**: Next.js 15 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS v4
*   **UI Components**: shadcn/ui
*   **Charts**: Recharts
*   **Forms**: React Hook Form + Zod

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   npm or yarn

### Installation

1.  **Clone the repository**
    \`\`\`bash
    git clone https://github.com/your-org/gcmc-compliance-suite.git
    cd gcmc-compliance-suite
    \`\`\`

2.  **Install dependencies**
    \`\`\`bash
    npm install
    \`\`\`

3.  **Run the development server**
    \`\`\`bash
    npm run dev
    \`\`\`

4.  **Open the app**
    *   Admin Dashboard: `http://localhost:3000`
    *   Client Portal: `http://localhost:3000/portal`

## 🧪 E2E Verification

The following core flows have been verified:
*   ✅ **Client Onboarding**: Full wizard flow with document uploads.
*   ✅ **New Filing**: Creating VAT, NIS, and Property Tax records.
*   ✅ **Document Management**: Uploading, viewing, and generating files.
*   ✅ **User Management**: Inviting users and role assignment.
*   ✅ **Portal Access**: Client login and dashboard view.

## 📄 License

Private proprietary software for GCMC & KAJ.
