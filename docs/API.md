# API Documentation

## Overview

The GCMC-KAJ Compliance Platform API is built on Next.js 16 Route Handlers and follows RESTful conventions. All API routes are located in the `app/api/` directory.

## Base URL

\`\`\`
Development: http://localhost:3000/api
Production: https://your-domain.com/api
\`\`\`

## Authentication

Currently in development. Future implementation will use session-based authentication with JWT tokens.

\`\`\`typescript
// Example authenticated request (future)
headers: {
  'Authorization': 'Bearer <token>',
  'Content-Type': 'application/json'
}
\`\`\`

## API Endpoints

### Clients

#### GET /api/clients
Get all clients with optional filtering.

**Query Parameters:**
- `type` (optional): Filter by client type (`INDIVIDUAL` | `COMPANY`)
- `search` (optional): Search by name, TIN, or NIS number

**Response:**
\`\`\`json
{
  "clients": [
    {
      "id": "uuid",
      "name": "ABC Corporation Ltd",
      "type": "COMPANY",
      "tinNumber": "1234567890",
      "nisNumber": "N12345678",
      "email": "contact@abc.com",
      "phone": "+592-123-4567",
      "address": "123 Main St, Georgetown",
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ],
  "total": 1
}
\`\`\`

#### GET /api/clients/:id
Get a specific client by ID with all related data.

**Response:**
\`\`\`json
{
  "id": "uuid",
  "name": "ABC Corporation Ltd",
  "type": "COMPANY",
  "tinNumber": "1234567890",
  "email": "contact@abc.com",
  "taxReturns": [...],
  "employees": [...],
  "properties": [...]
}
\`\`\`

#### POST /api/clients
Create a new client.

**Request Body:**
\`\`\`json
{
  "name": "New Client",
  "type": "COMPANY",
  "tinNumber": "1234567890",
  "nisNumber": "N12345678",
  "email": "client@example.com",
  "phone": "+592-123-4567",
  "address": "123 Main St"
}
\`\`\`

**Validation:**
- `name`: Required, min 2 characters
- `type`: Required, must be "INDIVIDUAL" or "COMPANY"
- `tinNumber`: Optional, must match format: 10 digits
- `nisNumber`: Optional, must match format: N followed by 8 digits
- `email`: Required, valid email format
- `phone`: Required
- `address`: Required

#### PUT /api/clients/:id
Update an existing client.

#### DELETE /api/clients/:id
Delete a client (soft delete recommended).

---

### Tax Returns

#### GET /api/filings
Get all tax filings.

**Query Parameters:**
- `clientId` (optional): Filter by client
- `filingType` (optional): Filter by type (`VAT` | `PAYE` | `INCOME_TAX` | `CORP_TAX`)
- `status` (optional): Filter by status (`PENDING` | `SUBMITTED` | `APPROVED`)
- `period` (optional): Filter by tax period

**Response:**
\`\`\`json
{
  "filings": [
    {
      "id": "uuid",
      "filingType": "VAT",
      "period": "2025-01",
      "status": "PENDING",
      "amountDue": "50000.00",
      "filingDate": null,
      "client": {
        "id": "uuid",
        "name": "ABC Corporation Ltd"
      }
    }
  ],
  "total": 1
}
\`\`\`

#### POST /api/filings
Create a new tax filing.

**Request Body:**
\`\`\`json
{
  "clientId": "uuid",
  "filingType": "VAT",
  "period": "2025-01",
  "amountDue": "50000.00"
}
\`\`\`

---

### NIS Schedules

#### GET /api/nis
Get NIS schedules.

**Query Parameters:**
- `clientId` (optional): Filter by client
- `month` (optional): Filter by month
- `status` (optional): Filter by status (`DRAFT` | `FILED`)

#### POST /api/nis
Create NIS schedule with automatic calculations.

**Request Body:**
\`\`\`json
{
  "clientId": "uuid",
  "month": "January 2025",
  "totalWages": "320000.00"
}
\`\`\`

**Auto-calculated fields:**
- `employeeDed`: totalWages × 0.056 (capped at GYD 320,000)
- `employerCont`: totalWages × 0.084 (capped at GYD 320,000)
- `totalRemit`: employeeDed + employerCont

---

### Immigration

#### GET /api/immigration
Get all visa/permit applications.

**Query Parameters:**
- `clientId` (optional)
- `permitType` (optional): `WORK_PERMIT` | `CITIZENSHIP` | `BUSINESS_VISA`
- `status` (optional)

#### POST /api/immigration
Create new visa application.

---

### Employees

#### GET /api/employees
Get all employees.

**Query Parameters:**
- `clientId` (required): Must specify client
- `status` (optional): `ACTIVE` | `INACTIVE` | `TERMINATED`

#### POST /api/employees
Create new employee with NIS/TIN validation.

**Request Body:**
\`\`\`json
{
  "clientId": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "nisNumber": "N12345678",
  "tinNumber": "1234567890",
  "position": "Accountant",
  "department": "Finance",
  "salary": "150000.00",
  "hireDate": "2025-01-01"
}
\`\`\`

---

### Properties

#### GET /api/properties
Get all properties with lease and tenant information.

**Query Parameters:**
- `ownerId` (required): Client ID who owns properties
- `status` (optional): `Occupied` | `Vacant`
- `type` (optional): `Commercial` | `Residential`

#### POST /api/properties
Create new property with automatic management fee calculation.

**Request Body:**
\`\`\`json
{
  "ownerId": "uuid",
  "address": "123 Main St, Apt 4B",
  "type": "Residential",
  "status": "Occupied",
  "managementFeePercentage": "10",
  "tenantName": "Jane Smith",
  "tenantEmail": "jane@example.com",
  "monthlyRentGyd": "80000.00",
  "leaseStartDate": "2025-01-01",
  "leaseEndDate": "2025-12-31"
}
\`\`\`

---

### Expediting

#### GET /api/expedite
Get expedite jobs with status tracking.

#### POST /api/expedite
Create new expedite job.

#### PATCH /api/expedite/:id/status
Update expedite job status with automatic timeline logging.

**Request Body:**
\`\`\`json
{
  "status": "AT_AGENCY",
  "notes": "Delivered to Ministry of Home Affairs"
}
\`\`\`

---

## Error Responses

All API endpoints follow consistent error formatting:

\`\`\`json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional context"
  }
}
\`\`\`

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict (duplicate resource)
- `500`: Internal Server Error

## Validation

All API endpoints use Zod schemas for request validation. See `lib/validators.ts` for schema definitions.

## Rate Limiting

Future implementation will include:
- 100 requests per minute per IP for authenticated users
- 20 requests per minute for unauthenticated endpoints

## Webhooks

Planned webhook events:
- `client.created`
- `filing.submitted`
- `expedite.status_changed`
- `property.lease_expiring`

## Testing

Use the provided mock data functions in `lib/api.ts` for testing without database setup.

\`\`\`typescript
import { mockClients, mockFilings } from '@/lib/api'

// Use in development
const clients = mockClients
