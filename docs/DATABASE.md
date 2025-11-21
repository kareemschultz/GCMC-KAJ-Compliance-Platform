# Database Schema Documentation

## Overview

The GCMC-KAJ Compliance Platform uses PostgreSQL as the primary database with Prisma ORM for type-safe database access. The schema is designed to support both KAJ Financial Services and GCMC Management Consultancy operations.

## Database Setup

### Prerequisites
- PostgreSQL 14 or higher
- Node.js 18 or higher

### Quick Start

1. Configure database URL in `.env`:
\`\`\`bash
DATABASE_URL="postgresql://user:password@localhost:5432/gcmc_kaj"
\`\`\`

2. Push schema to database:
\`\`\`bash
npm run db:push
\`\`\`

3. Seed with sample data:
\`\`\`bash
npm run db:seed
\`\`\`

4. Open Prisma Studio to view data:
\`\`\`bash
npm run db:studio
\`\`\`

## Schema Overview

\`\`\`mermaid
erDiagram
    Client ||--o{ User : has
    Client ||--o{ TaxReturn : files
    Client ||--o{ NISSchedule : submits
    Client ||--o{ VisaApplication : applies
    Client ||--o{ LegalDocument : generates
    Client ||--o{ Employee : employs
    Client ||--o{ Property : owns
    Client ||--o{ ExpediteJob : requests
    Client ||--o{ FinancialStatement : has
    Client ||--o{ AuditCase : undergoes
    Client ||--o{ BankService : uses
    TrainingSession ||--o{ TrainingAttendee : has
\`\`\`

## Core Models

### User

Authentication and authorization model.

**Fields:**
- `id`: UUID, Primary Key
- `email`: String, Unique, Required
- `fullName`: String, Required
- `role`: Enum (`SUPER_ADMIN`, `GCMC_STAFF`, `KAJ_STAFF`, `CLIENT`)
- `clientId`: UUID, Foreign Key to Client (optional for staff)
- `createdAt`: DateTime

**Business Rules:**
- SUPER_ADMIN: Full access to all modules
- GCMC_STAFF: Access to Immigration, Legal, Training, Property
- KAJ_STAFF: Access to Tax, Payroll, NIS, Accounting
- CLIENT: Limited portal access to own data

**Indexes:**
- `email` (unique)
- `role`

---

### Client

Core entity representing companies or individuals using the platform.

**Fields:**
- `id`: UUID, Primary Key
- `name`: String, Required
- `type`: String (`INDIVIDUAL` | `COMPANY`)
- `tinNumber`: String, Optional (GRA Tax ID)
- `nisNumber`: String, Optional (NIS Number)
- `email`: String, Required
- `phone`: String, Required
- `address`: String, Required
- `createdAt`: DateTime

**Validation:**
- `tinNumber`: Must be 10 digits
- `nisNumber`: Must match pattern N12345678

**Relations:**
- One-to-Many: TaxReturns, NISSchedules, Employees, Properties, etc.

**Indexes:**
- `email`
- `tinNumber`
- `nisNumber`

---

## KAJ Module Models

### TaxReturn

Tracks tax filings for GRA compliance.

**Fields:**
- `id`: UUID
- `filingType`: String (`VAT` | `PAYE` | `INCOME_TAX` | `CORP_TAX`)
- `period`: String (e.g., "2025-01")
- `status`: String (`PENDING` | `SUBMITTED` | `APPROVED`)
- `amountDue`: Decimal
- `filingDate`: DateTime, Optional
- `clientId`: UUID, Foreign Key

**Business Logic:**
- VAT: 14% on taxable supplies (Guyana standard rate)
- PAYE: 28% on taxable income (Guyana standard rate)
- Due dates calculated based on filing type

**Queries:**
\`\`\`prisma
// Get pending filings for a client
prisma.taxReturn.findMany({
  where: { clientId: "uuid", status: "PENDING" }
})

// Get all VAT returns for Q1 2025
prisma.taxReturn.findMany({
  where: {
    filingType: "VAT",
    period: { startsWith: "2025-0" }
  }
})
\`\`\`

---

### NISSchedule

National Insurance Scheme monthly submissions.

**Fields:**
- `id`: UUID
- `month`: String (e.g., "January 2025")
- `totalWages`: Decimal
- `employeeDed`: Decimal (5.6% of wages, capped)
- `employerCont`: Decimal (8.4% of wages, capped)
- `totalRemit`: Decimal (14% total)
- `status`: String (`DRAFT` | `FILED`)
- `clientId`: UUID

**Calculation Rules:**
- Maximum insurable wage: GYD 320,000/month
- Employee contribution: 5.6%
- Employer contribution: 8.4%
- Total: 14.0%

**Example Calculation:**
\`\`\`typescript
// Wage: GYD 400,000 (exceeds cap)
const cappedWage = Math.min(400000, 320000) // 320,000
const employeeDed = cappedWage * 0.056 // 17,920
const employerCont = cappedWage * 0.084 // 26,880
const totalRemit = employeeDed + employerCont // 44,800
\`\`\`

---

## GCMC Module Models

### VisaApplication

Immigration permit tracking.

**Fields:**
- `id`: UUID
- `applicantName`: String
- `permitType`: String (`WORK_PERMIT` | `CITIZENSHIP` | `BUSINESS_VISA`)
- `expiryDate`: DateTime
- `status`: String
- `clientId`: UUID

**Workflow States:**
1. APPLICATION_SUBMITTED
2. UNDER_REVIEW
3. APPROVED / DENIED
4. ISSUED

**Alerts:**
- Warning if expiry within 60 days
- Critical if expiry within 30 days

---

### Employee

Staff registry for payroll and NIS tracking.

**Fields:**
- `id`: UUID
- `firstName`, `lastName`: String
- `nisNumber`: String, Unique
- `tinNumber`: String, Optional
- `position`, `department`: String
- `salary`: Decimal
- `hireDate`: DateTime
- `status`: String (`ACTIVE` | `INACTIVE` | `TERMINATED`)
- `clientId`: UUID

**Payroll Calculation:**
\`\`\`typescript
// Gross to Net calculation
const grossSalary = 150000
const nisDeduction = Math.min(grossSalary, 320000) * 0.056
const statutoryFree = 65000 * 12 / 12 // Monthly allowance
const taxableIncome = grossSalary - nisDeduction - statutoryFree
const paye = taxableIncome > 0 ? taxableIncome * 0.28 : 0
const netSalary = grossSalary - nisDeduction - paye
\`\`\`

---

### Property

Rental property management.

**Fields:**
- `id`: UUID
- `address`: String
- `type`: String (`Commercial` | `Residential`)
- `ownerId`: UUID (Client)
- `status`: String (`Occupied` | `Vacant`)
- `managementFeePercentage`: Decimal
- Tenant fields: name, email, phone
- Lease fields: start/end dates, monthly rent, security deposit
- Financial fields: YTD revenue, arrears
- `createdAt`: DateTime

**Automatic Calculations:**
\`\`\`sql
-- Management fee calculation
managementFee = monthlyRentGyd * (managementFeePercentage / 100)

-- Lease expiry alert
CASE 
  WHEN leaseEndDate < CURRENT_DATE + INTERVAL '30 days' THEN 'EXPIRING_SOON'
  WHEN arrearsGyd > 0 THEN 'ARREARS'
  ELSE 'CURRENT'
END
\`\`\`

---

### ExpediteJob

Document expediting service tracker.

**Fields:**
- `id`: UUID
- `clientName`: String
- `documentType`: String
- `agencyName`: String
- `referenceNumber`: String
- `assignedRunner`: String
- `expectedCompletion`: DateTime
- `status`: String
- `statusHistoryJson`: JSON (timeline of status changes)

**Status Flow:**
1. PICKED_UP
2. AT_AGENCY
3. PROCESSING
4. READY_FOR_COLLECTION
5. OUT_FOR_DELIVERY
6. COMPLETED

**Status History Structure:**
\`\`\`json
[
  {
    "status": "PICKED_UP",
    "timestamp": "2025-01-15T09:00:00Z",
    "notes": "Collected from client office"
  },
  {
    "status": "AT_AGENCY",
    "timestamp": "2025-01-15T10:30:00Z",
    "notes": "Delivered to Ministry"
  }
]
\`\`\`

---

## Shared Models

### FinancialStatement

Accounting reports (Income Statement, Cash Flow).

**Fields:**
- `id`: UUID
- `type`: String (`INCOME_STATEMENT` | `CASH_FLOW` | `BALANCE_SHEET`)
- `period`: String
- `data`: JSON (flexible structure for different report types)
- `clientId`: UUID

---

### AuditCase

NGO and Co-op audit tracking.

**Fields:**
- `id`: UUID
- `entityName`: String
- `entityType`: String (`NGO` | `CO_OP`)
- `status`: String (`OPEN` | `REVIEW` | `CLOSED`)
- `assignedAuditor`: String
- `dueDate`: DateTime
- `progress`: Int (0-100)

---

### BankService

Account opening and loan application tracking.

**Fields:**
- `id`: UUID
- `clientName`: String
- `service`: String (`ACCOUNT_OPENING` | `LOAN_APP`)
- `bankName`: String
- `status`: String
- `submittedDate`, `lastUpdate`: DateTime

---

## Indexes and Performance

### Recommended Indexes

\`\`\`prisma
@@index([clientId])           // Most models with client relation
@@index([status])             // Status filtering
@@index([createdAt])          // Date range queries
@@index([email])              // Client lookup
@@index([nisNumber])          // Employee lookup
@@index([tinNumber])          // Tax lookup
\`\`\`

### Query Optimization

Use `include` for related data:
\`\`\`typescript
const client = await prisma.client.findUnique({
  where: { id: clientId },
  include: {
    taxReturns: { where: { status: 'PENDING' } },
    employees: { where: { status: 'ACTIVE' } },
    properties: true
  }
})
\`\`\`

Use `select` to reduce payload:
\`\`\`typescript
const clients = await prisma.client.findMany({
  select: { id: true, name: true, email: true }
})
\`\`\`

---

## Migrations

### Creating Migrations

\`\`\`bash
# Create migration after schema changes
npx prisma migrate dev --name add_new_field

# Apply migrations in production
npx prisma migrate deploy
\`\`\`

### Migration Best Practices

1. Always test migrations in development first
2. Backup database before production migrations
3. Use descriptive migration names
4. Review generated SQL before applying

---

## Backup and Recovery

### Automated Backups

\`\`\`bash
# Backup command (add to cron)
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup_20250121.sql
\`\`\`

### Point-in-Time Recovery

Configure PostgreSQL for WAL archiving for production environments.

---

## Security Considerations

1. **Row Level Security (RLS)**: Implement for multi-tenant isolation
2. **Encrypted Fields**: Consider encrypting sensitive data (TIN, NIS)
3. **Audit Logging**: Track all data modifications
4. **Access Control**: Use database roles for different user types

---

## Common Queries

### Get client dashboard data
\`\`\`typescript
const dashboardData = await prisma.client.findUnique({
  where: { id: clientId },
  include: {
    taxReturns: { take: 5, orderBy: { createdAt: 'desc' } },
    employees: { where: { status: 'ACTIVE' } },
    properties: { where: { status: 'Occupied' } }
  }
})
\`\`\`

### Get pending filings across all clients
\`\`\`typescript
const pendingFilings = await prisma.taxReturn.findMany({
  where: { status: 'PENDING' },
  include: { client: { select: { name: true, email: true } } },
  orderBy: { period: 'asc' }
})
\`\`\`

### Calculate total NIS liability for month
\`\`\`typescript
const nisTotal = await prisma.nISSchedule.aggregate({
  where: { month: 'January 2025', status: 'FILED' },
  _sum: { totalRemit: true }
})
\`\`\`

---

## Troubleshooting

### Connection Issues
\`\`\`bash
# Test database connection
npx prisma db pull

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
\`\`\`

### Schema Drift
\`\`\`bash
# Compare schema with database
npx prisma db pull
npx prisma format
