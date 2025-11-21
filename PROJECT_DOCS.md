# GCMC & KAJ Compliance Suite - Technical Documentation

## 1. Project Identity
*   **Name**: GCMC & KAJ Compliance Suite
*   **Repo**: `gcmc-kaj-compliance-suite`
*   **Description**: Enterprise compliance platform for Guyana regulatory management serving GCMC & KAJ.

## 2. Architecture Overview
The project is built using a modern web stack optimized for performance, security, and scalability.

### Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Theming**: next-themes (Dark/Light Mode)
- **UI Components**: shadcn/ui (Radix Primitives)
- **State Management**: React Server Components & Client Hooks
- **Deployment**: Docker Containerized

### Directory Structure
- `/app`: Core application routes and layouts.
  - `/clients`: Client management module.
  - `/filings`: Tax and compliance filing module.
  - `/documents`: Centralized document management.
  - `/portal`: External client portal (separate layout).
  - `/users`: Internal user/staff management.
- `/components`: Reusable UI components and feature-specific widgets.
- `/lib`: Utility functions, constants, and shared logic.
- `/types`: TypeScript definitions for data models.

## 3. Core Modules

### Client Management
- **Profiles**: Detailed views including TIN, NIS, Business Reg, and contact info.
- **Services**: Dynamic service catalog (Trainings, Immigration, Paralegal).
- **Onboarding**: Wizard-based flow for adding new clients with requirement checks.

### Compliance Engine
- **Filings**: Tracking for GRA (VAT, CIT, PAYE) and NIS contributions.
- **VAT Return**: Interactive VAT-3 form with auto-calculation logic (14% rate).
- **Alerts**: Automated notifications for expiring documents and overdue filings.
- **Tax Calendar**: Dashboard widget tracking key 2025 deadlines (VAT, PAYE, Corporate Tax).

### Document System
- **Smart Upload**: Context-aware uploads that capture metadata (Expiry Dates, ID Numbers).
- **Document Generator**: Template-based generation for legal documents (Affidavits, Agreements).
- **Print Profiles**: One-click printable summaries of client portfolios.
- **Client Reports**: Customizable PDF/Excel reports for client summaries and compliance status.

### Financial Tools
- **Exchange Rates**: Live-updated widget for major currencies (USD, EUR, GBP) to GYD.
- **Revenue Analytics**: Visual correlation between compliance scores and client revenue.
- **Billing Module**: Invoice tracking and revenue collection management.

### Knowledge & Support
- **Knowledge Base**: Centralized repository for GRA/NIS forms and regulatory guides.
- **Communications Log**: Track emails, calls, and meetings per client.

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
   \`\`\`typescript
   // Example update in lib/api.ts
   create: async (data) => {
     const res = await fetch('/api/clients', {
       method: 'POST',
       body: JSON.stringify(data)
     });
     if (!res.ok) throw new Error('Failed');
     return res.json();
   }
   \`\`\`
3. **Environment Variables**: Configure your `.env` file with database credentials.

### Troubleshooting
- **Buttons not working?** Ensure you are seeing the "Toast" notifications. If not, check that `<Toaster />` is in `app/layout.tsx`.
- **Data disappearing?** This is expected in Mock Mode. Connect a database for persistence.

## 7. E2E Verification & Testing
The following core user flows have been verified end-to-end:

### 1. Client Onboarding
- **Flow**: Dashboard -> Add Client -> Wizard (5 Steps) -> Success.
- **Verification**: Validated form logic, conditional requirements (Business vs Individual), and success toast.

### 2. Document Management
- **Flow**: Dashboard -> Upload Document -> Select Type -> Upload -> Success.
- **Verification**: Confirmed metadata capture for specific types (e.g., ID Numbers for National ID) and file handling.

### 3. Compliance Filing
- **Flow**: Dashboard -> New Filing -> Select Form (VAT/NIS) -> Fill Form -> Submit.
- **Verification**: Verified VAT calculation logic (Input/Output/Adjustments) and NIS contribution rules.

### 4. Client Portal
- **Flow**: Login -> Portal Dashboard -> View Services -> Request Service.
- **Verification**: Confirmed isolation of portal layout and functionality of client-facing actions.

### 5. User Management (Enterprise)
- **Flow**: Admin Dashboard -> Users -> Add User -> Send Invite -> Accept Invite (Simulated).
- **Verification**: Verified invite dialog, role assignment, and the "Accept Invite" landing page flow.

### 6. Client Actions
- **Flow**: Client Detail -> Edit Profile / Generate Report.
- **Verification**: Verified the "Edit Client" dialog updates profile data and "Generate Report" modal simulates report creation with date range selection.
