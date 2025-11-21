# GK Enterprise Suite - Technical Documentation

## 1. Project Identity
*   **Name**: GK Enterprise Suite
*   **Repo**: `gk-enterprise-suite`
*   **Description**: Enterprise compliance and management platform for Guyana regulatory management serving GCMC & KAJ.

## 2. Architecture Overview
The project is built using a modern web stack optimized for performance, security, and scalability.

### Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Theming**: next-themes (Dark/Light Mode)
- **UI Components**: shadcn/ui (Radix Primitives)
- **State Management**: React Context (Client & Brand)
- **Deployment**: Docker Containerized

### Directory Structure
- `/app`: Core application routes and layouts.
  - `/clients`: Client management module.
  - `/filings`: Tax and compliance filing module.
  - `/accounting`: **(New)** Financial statements & audit workflows.
  - `/nis`: **(New)** Payroll & NIS management.
  - `/documents`: Centralized document management.
  - `/portal`: External client portal (separate layout).
  - `/book`: Public appointment booking page.
  - `/users`: Internal user/staff management.
  - `/training`: Training & Workshop management.
  - `/immigration`: Visa & Work Permit pipeline.
  - `/network`: Partner directory & networking hub.
  - `/paralegal`: Legal document generation & management.
  - `/settings`: System configuration.
- `/components`: Reusable UI components and feature-specific widgets.
- `/lib`: Utility functions, constants, and shared logic.
- `/types`: TypeScript definitions for data models.

## 3. Core Modules

### Client Management & Context
- **Client Context**: Global switcher allows users to perform actions on behalf of a specific client.
- **Profiles**: Detailed views including TIN, NIS, Business Reg, and contact info.
- **Onboarding**: Wizard-based flow for adding new clients (Company vs Individual).

### Financial Engine (KAJ Focus)
- **Accounting & Reports**:
    - **Financial Statements**: P&L and Cash Flow generation.
    - **Audit Workflow**: Track NGO/Co-op audits from initiation to completion.
    - **Banking**: Manage bank account openings and loan applications.
- **NIS & Payroll**:
    - **Payroll Calculator**: Auto-calculate PAYE, NIS (5.6% / 8.4%), and Net Salary.
    - **Employee Registry**: Manage workforce details for payroll processing.
    - **NIS Schedules**: Generate monthly contribution schedules.
- **Tax Filings**: Tracking for GRA (VAT, CIT, PAYE).
- **VAT Return**: Interactive VAT-3 form with auto-calculation logic (14% rate).

### Consultancy Hub (GCMC Focus)
- **Training Module**:
    - **Calendar**: Visual schedule of upcoming workshops.
    - **Registration**: Manage participant lists and enrollments.
- **Immigration Pipeline**:
    - **Kanban Board**: Drag-and-drop interface for tracking case status.
    - **Case Management**: Detailed tracking of Work Permits, Visas, and Citizenship.
- **Networking Hub**:
    - **Partner Directory**: Database of trusted contacts (Real Estate, Legal, IT).
- **Paralegal Services**:
    - **Document Generator**: Create Affidavits, Business Agreements, and Deeds of Gift.

### Client Portal
- **Self-Service**: Clients can log in to view their profile, documents, and filing status.
- **Service Requests**: Clients can request new services (e.g., "Renew Visa") directly.

### Document System
- **Smart Upload**: Context-aware uploads that capture metadata.
- **Print Profiles**: One-click printable summaries of client portfolios.

## 4. Deployment & DevOps
The project is containerized using Docker for consistent deployment across environments.

- **Docker**: Multi-stage build process for optimized image size.
- **CI/CD**: GitHub Actions workflow for automated testing and building.
- **Environment**: Configurable via environment variables (see `.env.example`).

## 5. Future Roadmap
- **Backend Integration**: Connect to a real database (PostgreSQL/Supabase).
- **Auth Integration**: Implement NextAuth.js or Clerk for secure authentication.
- **Email Service**: Integrate SendGrid/Resend for automated email notifications.

## 6. API & Backend Configuration

### Current State: Mock Mode
The application currently runs in **Mock Mode**. This means:
- No real backend server is required to run the UI.
- Data persistence is simulated (changes will reset on refresh).
- API calls are handled by `lib/api.ts` which simulates network latency.

### Connecting a Real Backend
To connect a real backend:
1. **Create API Routes**: Implement Next.js Route Handlers in `app/api/` or connect to an external Express/Python server.
2. **Update `lib/api.ts`**: Replace the mock functions with real `fetch()` calls.
3. **Environment Variables**: Configure your `.env` file with database credentials.

## 7. E2E Verification & Testing
The following core user flows have been verified end-to-end:

### 1. Client Onboarding
- **Flow**: Dashboard -> Add Client -> Wizard (5 Steps) -> Success.
- **Verification**: Validated form logic, conditional requirements (Business vs Individual), and success toast.

### 2. Payroll Processing
- **Flow**: Dashboard -> NIS & Payroll -> Calculator -> Enter Salary -> Calculate.
- **Verification**: Verified correct deduction of NIS (5.6%) and PAYE logic.

### 3. Accounting Workflows
- **Flow**: Dashboard -> Accounting -> Financial Statements -> Download P&L.
- **Verification**: Verified data visualization and download triggers.

### 4. Immigration Workflow
- **Flow**: Dashboard -> Immigration -> New Case -> Move Card -> Verify Status.
- **Verification**: Confirmed Kanban drag-and-drop updates case status.

### 5. Client Portal
- **Flow**: Login -> Portal Dashboard -> View Services -> Request Service.
- **Verification**: Confirmed isolation of portal layout and functionality of client-facing actions.
