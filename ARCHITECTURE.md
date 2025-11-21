# System Architecture

## Overview
The GK Enterprise Suite is a **production-ready** enterprise application built on Next.js 16 with full-stack architecture. It features authenticated sessions, role-based access control, PostgreSQL database with Prisma ORM, comprehensive API routes, and enterprise-grade security hardening.

## High-Level Architecture

\`\`\`mermaid
graph TD
    User[User / Staff / Client] -->|HTTPS/TLS| App[Next.js 16 App Server]

    subgraph "Authentication Layer"
        App -->|JWT Session| Auth[NextAuth.js Provider]
        Auth -->|Bcrypt Hash| AuthDB[User Authentication]
    end

    subgraph "Application Layer"
        App -->|Middleware| Protect[Route Protection]
        Protect -->|RBAC| Layout[Root Layout]
        Layout -->|Context| Brand[Brand Context Provider]
        Layout -->|Context| Client[Client Context Provider]
        Brand -->|Route| Page[Page Component]
        Page -->|API Call| Components[UI Components]
    end

    subgraph "API Layer"
        Components -->|REST| Routes[API Routes /api/*]
        Routes -->|Validate| Zod[Zod Validation]
        Routes -->|Rate Limit| Security[Security Middleware]
        Security -->|Query| Prisma[Prisma ORM]
    end

    subgraph "Database Layer"
        Prisma -->|SQL| DB[(PostgreSQL Database)]
        DB --> Tables[Clients, Users, Filings,<br/>Properties, Cases, etc.]
    end

    subgraph "Security & Infrastructure"
        App -->|Headers| CSP[CSP, HSTS, XSS Protection]
        App -->|Monitor| Health[Health Checks]
        App -->|Container| Docker[Docker Multi-stage]
    end

    subgraph "Production Services"
        Routes -->|Active| HealthAPI[Health Monitoring]
        App -->|Ready| Deploy[Docker Deployment]
        App -->|Testing| E2E[65 E2E Tests - Playwright]
    end

    subgraph "Future Integrations"
        Routes -.->|Planned| Storage[Blob Storage S3/R2]
        Routes -.->|Planned| Email[Email Service Resend]
        Routes -.->|Planned| GRA[GRA API Integration]
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

### Data Flow: Payroll Calculation

1.  **Authentication**: User session validated via NextAuth.js middleware
2.  **Input**: Gross Salary and Allowances entered in PayrollCalculator component
3.  **Validation**: Zod schema validates salary ranges and employee data
4.  **Calculation Logic**:
    *   NIS Employee = Gross × 5.6% (Subject to NIS ceiling limits)
    *   NIS Employer = Gross × 8.4%
    *   Taxable Income = Gross - NIS Employee - Other Deductions
    *   PAYE = Taxable Income × 28% (Guyana standard rate)
    *   Net Salary = Gross - NIS Employee - PAYE - Other Deductions
5.  **API Call**: `POST /api/payroll` stores payslip record with client association
6.  **Response**: Generated payslip data with calculation breakdown
7.  **Storage**: Prisma ORM persists to PostgreSQL with audit trail

### Data Flow: Immigration Case

1.  **Authentication**: User role verified (SUPER_ADMIN or GCMC_STAFF access required)
2.  **Case Creation**: "New Case" dialog with form validation
3.  **Client Selection**: Dropdown populated from authenticated user's accessible clients
4.  **Case Type**: Selection between Work Permit, Business Visa, or Citizenship application
5.  **Initial State**: Case created with status "TO_DO" in Prisma database
6.  **API Persistence**: `POST /api/immigration/cases` with Zod validation
7.  **Kanban Update**: Drag-and-drop triggers optimistic UI update
8.  **Status Sync**: `PUT /api/immigration/cases/[id]` updates case status
9.  **Real-time Feedback**: Success/error toasts with automatic refresh

### Data Flow: Property Management

1.  **Access Control**: SUPER_ADMIN or GCMC_STAFF role verification
2.  **Property Creation**: "Add Property" dialog with comprehensive form validation
3.  **Input Validation**: Zod schemas validate address, rental amounts, and dates
4.  **Client Association**: Property linked to existing client via foreign key relation
5.  **Automated Calculations**:
    *   Management Fee = `monthlyRent × (managementFeePercentage / 100)`
    *   Arrears tracking with automatic calculation
    *   Days until lease expiry with alert thresholds
6.  **API Persistence**: `POST /api/properties` stores record in PostgreSQL
7.  **Business Logic Alerts**:
    *   Amber highlight: Lease expires within 30 days
    *   Red highlight: Outstanding arrears > $0
8.  **Real-time Updates**: Optimistic UI updates with fallback error handling

### Data Flow: Expediting Service

1.  **Authorization**: SUPER_ADMIN or GCMC_STAFF access verification
2.  **Job Initiation**: User creates expedite job via validated form
3.  **Client Association**: Job linked to existing client with document requirements
4.  **Agency Selection**: Government agency selection (GRA, Deeds Registry, Immigration, etc.)
5.  **Runner Assignment**: Job allocated to specific runner with accountability tracking
6.  **Status Workflow**: Automated timeline tracking through defined stages:
    *   `RECEIVED` → `PICKED_UP` → `AT_AGENCY` → `PROCESSING` → `READY` → `DELIVERED`
7.  **API Updates**: `PUT /api/expediting/jobs/[id]/status` with timestamp logging
8.  **Client Portal**: Real-time status visibility with visual timeline
9.  **Reference Management**: Agency reference numbers stored for cross-verification
10. **Audit Trail**: Complete history maintained in JSON status log

## Component Hierarchy

```
├── RootLayout (Authentication & Session Management)
│   ├── NextAuthProvider (JWT Session Handling)
│   ├── ThemeProvider (next-themes Dark/Light Mode)
│   ├── BrandProvider (KAJ/GCMC Context Switching)
│   ├── ClientProvider (Multi-client Operations)
│   └── Middleware Protection (Route-level RBAC)
│       ├── AppSidebar (Role-based Navigation)
│       │   ├── AdminNav (SUPER_ADMIN)
│       │   ├── GCMCNav (GCMC_STAFF)
│       │   ├── KAJNav (KAJ_STAFF)
│       │   └── ClientNav (CLIENT - Portal Only)
│       ├── Header (Session Info & Client Switcher)
│       └── MainContent
│           ├── DashboardPages (/dashboard)
│           │   ├── StatsCards (API-driven Metrics)
│           │   ├── RecentActivity (Real-time Updates)
│           │   └── QuickActions (Role-based Shortcuts)
│           ├── ModulePages (/clients, /filings, etc.)
│           │   ├── DataTables (Sortable, Filterable)
│           │   ├── KanbanBoards (Drag-drop State Management)
│           │   ├── FormDialogs (Zod Validation)
│           │   └── ActionButtons (CRUD Operations)
│           └── ClientPortal (/portal/*)
│               ├── PortalLayout (Separate from Admin)
│               ├── ClientDashboard
│               ├── DocumentViewer
│               └── ServiceRequestForms
```

### Authentication Flow
1. **Route Access**: Middleware checks authentication status
2. **Role Validation**: User role matched against route permissions
3. **Redirect Logic**: Unauthorized users redirected to appropriate pages
4. **Session Management**: JWT tokens refreshed automatically
5. **Component Rendering**: Role-specific UI elements displayed

## Security Architecture

### Authentication & Authorization
*   **NextAuth.js Integration**: JWT-based session management with secure cookies
*   **Password Security**: Bcrypt hashing with 12 rounds for password storage
*   **Role-Based Access Control**: Middleware-enforced access control with 4 user roles:
    - `SUPER_ADMIN`: Full system access
    - `GCMC_STAFF`: Immigration, Training, Legal, Property modules
    - `KAJ_STAFF`: Tax, Accounting, Payroll, Compliance modules
    - `CLIENT`: Portal access only
*   **Route Protection**: Middleware blocks unauthorized access with automatic redirects

### Application Security
*   **Input Validation**: Zod schema validation on all API endpoints and forms
*   **Rate Limiting**: API endpoint protection with configurable limits
*   **Security Headers**:
    - Content Security Policy (CSP)
    - HTTP Strict Transport Security (HSTS)
    - X-Frame-Options, X-Content-Type-Options
    - XSS Protection headers
*   **Input Sanitization**: Server-side sanitization preventing XSS and injection attacks
*   **Environment Security**: Secrets management with `.env` files (excluded from version control)

### Infrastructure Security
*   **Docker Security**: Multi-stage builds with non-root user containers
*   **Database Security**: PostgreSQL with connection pooling and prepared statements
*   **Network Security**: HTTPS enforcement and secure cookie configuration

## Database Architecture

### Core Models
The application uses **PostgreSQL** with **Prisma ORM** providing type-safe database access:

#### Authentication & Users
*   **User**: Authentication with role-based access control
    - Fields: `email`, `passwordHash`, `role`, `lastLogin`, `isActive`
    - Relations: Links to audit trails and session management

#### Core Business Entities
*   **Client**: Central entity linking all business operations
    - Fields: `name`, `email`, `phone`, `tin`, `nis`, `businessReg`
    - Relations: One-to-many with filings, properties, cases, employees

*   **Filing**: Tax and compliance submissions
    - Fields: `type`, `dueDate`, `status`, `amount`, `agency`
    - Relations: Belongs to client, tracks submission history

#### Specialized Modules
*   **Property**: Rental property management
    - Fields: `address`, `monthlyRent`, `tenantName`, `leaseExpiry`
    - Business Logic: Automatic arrears calculation and lease expiry alerts

*   **AuditCase**: NGO/Co-op audit workflow
    - Fields: `entityName`, `auditType`, `status`, `timeline`
    - Relations: Client-linked with audit milestone tracking

*   **ImmigrationCase**: Visa and permit processing
    - Fields: `caseType`, `status`, `applicantName`, `expiryDate`
    - Workflow: Kanban-style status management

*   **Employee**: Payroll and NIS management
    - Fields: `fullName`, `nis`, `tin`, `salary`, `allowances`
    - Calculations: Automated PAYE and NIS deductions

### Database Features
*   **Type Safety**: Auto-generated TypeScript types from Prisma schema
*   **Relations**: Proper foreign key constraints and cascade operations
*   **Migrations**: Version-controlled schema changes with `prisma migrate`
*   **Seeding**: Automated test data generation with `prisma db seed`
*   **Studio**: Visual database browser with `prisma studio`

See `prisma/schema.prisma` for complete schema definitions and relationships.

## API Architecture

### RESTful API Design
All API routes follow REST conventions with proper HTTP methods and status codes:

#### Authentication Endpoints
*   `POST /api/auth/signin` - User login with credential validation
*   `POST /api/auth/signout` - Secure session termination
*   `GET /api/auth/session` - Current user session retrieval

#### Core Resource Endpoints
*   **Clients**: `GET|POST|PUT|DELETE /api/clients/*`
    - Full CRUD operations with role-based access control
    - Validation: Zod schemas for email, TIN, and business registration
    - Response: Paginated results with metadata

*   **Users**: `GET|POST|PUT|DELETE /api/users/*` (Admin only)
    - User management with password hashing
    - Role assignment and permission management

*   **Filings**: `GET|POST|PUT /api/filings/*`
    - Tax filing management with due date tracking
    - Status workflow: Draft → Submitted → Approved/Rejected

*   **Health Check**: `GET /api/health`
    - System health monitoring with database connectivity
    - Returns: Service status, version, and timestamp

### API Security
*   **Authentication**: NextAuth.js JWT validation on protected routes
*   **Authorization**: Role-based endpoint access control
*   **Rate Limiting**: Configurable request limits per endpoint
*   **Input Validation**: Zod schema validation on all inputs
*   **Error Handling**: Consistent error responses with proper status codes
