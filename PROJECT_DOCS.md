# GK Enterprise Suite - Technical Documentation

## 1. Project Identity
*   **Name**: GK Enterprise Suite
*   **Repo**: `gk-enterprise-suite`
*   **Description**: Enterprise compliance and management platform for Guyana regulatory management serving GCMC & KAJ.

## 2. Architecture Overview
The project is built using a modern web stack optimized for performance, security, and scalability.

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Theming**: next-themes (Dark/Light Mode)
- **UI Components**: shadcn/ui (Radix Primitives)
- **State Management**: React Context (Client & Brand)
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod schemas
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
  - `/property`: **(New)** Property management.
    - `/portfolio`: Manage rental properties, tenants, and lease agreements.
    - `/financials`: Track monthly rent, management fees, and arrears.
    - `/alerts`: Automated notifications for expiring leases.
  - `/expediting`: **(New)** Expediting services.
    - `/documents`: Visual timeline of document processing through government agencies (GRA, Deeds, etc.).
    - `/status`: Real-time tracking from "Picked Up" to "Delivered".
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
- **Property Management**:
    - **Portfolio Tracker**: Manage rental properties, tenants, and lease agreements.
    - **Financials**: Track monthly rent, management fees, and arrears.
    - **Alerts**: Automated notifications for expiring leases.
- **Expediting Services**:
    - **Document Tracker**: Visual timeline of document processing through government agencies (GRA, Deeds, etc.).
    - **Status Updates**: Real-time tracking from "Picked Up" to "Delivered".

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
- **Auth Integration**: Implement NextAuth.js or Clerk for secure authentication.
- **Email Service**: Integrate SendGrid/Resend for automated email notifications.
- **File Storage**: Integrate S3/R2/Vercel Blob for document uploads.
- **Real-time Features**: WebSocket integration for live updates.
- **GRA Integration**: Direct API integration with Guyana Revenue Authority systems.

## 6. API & Backend Configuration

### Current State: Development Mode
The application currently runs in **Development Mode**. This means:
- Mock data is used for prototyping, but database schema is fully configured.
- Database connection available via Prisma ORM (`lib/prisma.ts`).
- API routes need to be implemented in `app/api/` directory.
- Run `npm run db:push` to sync Prisma schema to database.
- Run `npm run db:seed` to populate with sample data.

### Connecting a Real Backend
To connect a real backend:
1. **Setup Database**: Configure `DATABASE_URL` in `.env` file (see `.env.example`).
2. **Run Migrations**: Execute `npm run db:push` to create database tables.
3. **Seed Data**: Run `npm run db:seed` to populate initial data.
4. **Create API Routes**: Implement Next.js Route Handlers in `app/api/`.
5. **Update `lib/api.ts`**: Replace mock functions with real Prisma queries.

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

### 6. Property Management
- **Flow**: Dashboard -> Properties -> Add Property -> Enter Details -> Save.
- **Verification**: Confirmed property creation, lease tracking, and arrears highlighting.

### 7. Expediting Service
- **Flow**: Dashboard -> Expediting -> New Job -> Assign Runner -> Track Status.
- **Verification**: Verified timeline visualization and status history logging.

### 8. Local Content Registration
- **Flow**: Dashboard -> Local Content -> Upload Documents -> Submit Application.
- **Verification**: Confirmed 5-document checklist, progress tracking, and submission lock until complete.
