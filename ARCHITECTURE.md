# System Architecture

## Overview
The GK Enterprise Suite is designed as a modular, component-based application using the Next.js App Router. It follows a **Client-Server** architecture where the frontend (Next.js) interacts with a backend service (currently mocked via `lib/api.ts`, ready for REST/GraphQL integration).

## High-Level Architecture

\`\`\`mermaid
graph TD
    User[User / Staff] -->|HTTPS| CDN[Vercel Edge Network]
    CDN -->|Route Request| App[Next.js App Server]
    
    subgraph "Application Layer"
        App -->|Render| Layout[Root Layout]
        Layout -->|Context| Brand[Brand Context Provider]
        Layout -->|Context| Client[Client Context Provider]
        Brand -->|Route| Page[Page Component]
        Page -->|Interact| Components[UI Components]
    end
    
    subgraph "Data Layer (Mock/Real)"
        Components -->|Fetch Data| API[API Abstraction Layer (lib/api.ts)]
        API -->|Query| DB[(Database / Mock Store)]
    end
    
    subgraph "External Services"
        API -.->|Future| Auth[Auth Provider (Clerk/NextAuth)]
        API -.->|Future| Storage[Blob Storage (S3/R2)]
        API -.->|Future| Email[Email Service (Resend)]
    end
\`\`\`

## Module Interaction

The application is divided into two main business domains that share a common core and client context.

\`\`\`mermaid
graph LR
    subgraph "Core Platform"
        Clients[Client Management]
        Docs[Document System]
        Users[User Admin]
        Settings[Configuration]
        Employees[Employee Registry]
    end

    subgraph "KAJ (Financial)"
        Filings[Tax Filings]
        Accounting[Accounting & Reports]
        Payroll[NIS & Payroll]
        Tax7B[7B Tax Calculator]
        Compliance[Compliance Tracker]
    end

    subgraph "GCMC (Consultancy)"
        Training[Training Hub]
        Immigration[Immigration Pipeline]
        Network[Partner Network]
        Paralegal[Legal Docs]
        Property[Property Management]
        Expediting[Expediting Service]
        LocalContent[Local Content]
    end

    Clients --> Filings
    Clients --> Accounting
    Clients --> Payroll
    Clients --> Immigration
    Clients --> Property
    Clients --> Expediting
    
    Docs --> Filings
    Docs --> Paralegal
    Docs --> LocalContent
    
    Employees --> Payroll
    
    Users --> Settings
\`\`\`

## Data Flow: Payroll Calculation

1.  **Input**: User enters Gross Salary and Allowances in `PayrollCalculator`.
2.  **Logic**:
    *   NIS Employee = Gross * 5.6% (Capped at ceiling if applicable).
    *   NIS Employer = Gross * 8.4%.
    *   Taxable Income = Gross - Statutory Deductions.
    *   PAYE = Taxable Income * 28% (Standard Rate).
3.  **Output**: Net Salary displayed to user.
4.  **Action**: "Save to Slip" triggers API to store record.

## Data Flow: Immigration Case

1.  **Creation**: User opens "New Case" dialog.
2.  **Selection**: Selects Client and Case Type (Visa/Permit).
3.  **State**: Case created with status "To Do".
4.  **Update**: User drags card on Kanban board.
5.  **Persistence**: `onDragEnd` event triggers API update to new status.

## Data Flow: Property Management

1.  **Creation**: User opens "Add Property" dialog from Property Manager.
2.  **Input**: Enters address, property type, tenant info, lease details, and management fee percentage.
3.  **Calculation**: System auto-calculates management fee as: `monthlyRent * (managementFeePercentage / 100)`.
4.  **Validation**: Checks for lease expiry within 30 days and highlights in amber.
5.  **Persistence**: API stores property record linked to owner (client).
6.  **Alert**: If arrears > 0, row highlighted in red for immediate attention.

## Data Flow: Expediting Tracker

1.  **Job Creation**: User initiates expedite job with client, document type, and agency.
2.  **Runner Assignment**: Job assigned to specific runner for physical document handling.
3.  **Status Updates**: Timeline automatically logs each status change (PICKED_UP → AT_AGENCY → PROCESSING → COMPLETED).
4.  **Client Visibility**: Client sees real-time progress via visual timeline with timestamps.
5.  **Reference Tracking**: Agency reference numbers captured for cross-system verification.

## Component Hierarchy (Simplified)

*   `RootLayout`
    *   `ThemeProvider`
    *   `BrandProvider`
    *   `ClientProvider`
        *   `AppSidebar` (Dynamic based on Brand)
        *   `Header` (Shows Active Client)
        *   `MainContent`
            *   `Page` (e.g., `/dashboard`, `/accounting`)
                *   `StatsCards`
                *   `DataTables` / `KanbanBoards`
                *   `ActionDialogs` (Modals)

## Security Considerations

*   **Role-Based Access Control (RBAC)**: UI elements hidden based on user role (Admin vs Staff).
*   **Input Validation**: All forms use `zod` for strict schema validation before submission.
*   **Sanitization**: React automatically escapes content to prevent XSS.
*   **Environment Variables**: Sensitive keys (API tokens) stored in `.env.local` (not committed).

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

*   **Client**: Core entity linking all other records (tax returns, visas, properties, employees).
*   **Employee**: Payroll entity with NIS/TIN tracking.
*   **Property**: Rental management with tenant, lease, and financial tracking.
*   **ExpediteJob**: Document expediting with status history stored as JSON.
*   **AuditCase**: NGO/Co-op audit workflow management.
*   **BankService**: Track account opening and loan applications.

See `prisma/schema.prisma` for the complete schema definition.
