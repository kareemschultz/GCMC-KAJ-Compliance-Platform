# API Reference - GK Enterprise Suite

## Overview

The GK Enterprise Suite provides a comprehensive RESTful API built on Next.js 16 App Router with full authentication, authorization, and validation. All endpoints use proper HTTP methods, status codes, and include comprehensive error handling.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

The API uses **NextAuth.js** with JWT tokens for authentication. All protected endpoints require a valid session.

### Authentication Endpoints

#### POST /api/auth/signin
Login with email and password credentials.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "role": "SUPER_ADMIN",
    "name": "John Doe"
  },
  "expires": "2024-12-31T23:59:59.000Z"
}
```

**Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

#### POST /api/auth/signout
Terminate current session.

**Response (200):**
```json
{
  "message": "Successfully signed out"
}
```

#### GET /api/auth/session
Get current user session information.

**Response (200):**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "role": "SUPER_ADMIN",
    "name": "John Doe"
  },
  "expires": "2024-12-31T23:59:59.000Z"
}
```

**Response (401):**
```json
{
  "error": "Not authenticated"
}
```

---

## User Management

### GET /api/users
Retrieve all users (Admin only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role

**Response (200):**
```json
{
  "users": [
    {
      "id": "user_123",
      "email": "admin@gcmc.gy",
      "name": "Admin User",
      "role": "SUPER_ADMIN",
      "isActive": true,
      "lastLogin": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### POST /api/users
Create new user (Admin only).

**Request:**
```json
{
  "email": "newuser@example.com",
  "name": "New User",
  "password": "securePassword123",
  "role": "GCMC_STAFF"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "user_456",
    "email": "newuser@example.com",
    "name": "New User",
    "role": "GCMC_STAFF",
    "isActive": true,
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
}
```

### PUT /api/users/[id]
Update user information (Admin only).

**Request:**
```json
{
  "name": "Updated Name",
  "role": "KAJ_STAFF",
  "isActive": false
}
```

**Response (200):**
```json
{
  "user": {
    "id": "user_456",
    "email": "user@example.com",
    "name": "Updated Name",
    "role": "KAJ_STAFF",
    "isActive": false,
    "updatedAt": "2024-01-15T14:30:00.000Z"
  }
}
```

---

## Client Management

### GET /api/clients
Retrieve clients with role-based filtering.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `search` (optional): Search by name or email
- `type` (optional): "COMPANY" or "INDIVIDUAL"

**Response (200):**
```json
{
  "clients": [
    {
      "id": "client_123",
      "name": "ABC Corporation",
      "email": "contact@abc.com",
      "phone": "+592-555-0123",
      "type": "COMPANY",
      "tin": "123456789",
      "nis": "987654321",
      "businessReg": "BR123456",
      "address": "123 Main St, Georgetown",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15
  }
}
```

### POST /api/clients
Create new client.

**Request:**
```json
{
  "name": "XYZ Company",
  "email": "info@xyz.com",
  "phone": "+592-555-9999",
  "type": "COMPANY",
  "tin": "987654321",
  "businessReg": "BR789123",
  "address": "456 Business Ave, Georgetown"
}
```

**Response (201):**
```json
{
  "client": {
    "id": "client_789",
    "name": "XYZ Company",
    "email": "info@xyz.com",
    "type": "COMPANY",
    "isActive": true,
    "createdAt": "2024-01-15T16:00:00.000Z"
  }
}
```

### GET /api/clients/[id]
Retrieve specific client details.

**Response (200):**
```json
{
  "client": {
    "id": "client_123",
    "name": "ABC Corporation",
    "email": "contact@abc.com",
    "phone": "+592-555-0123",
    "type": "COMPANY",
    "tin": "123456789",
    "nis": "987654321",
    "businessReg": "BR123456",
    "address": "123 Main St, Georgetown",
    "isActive": true,
    "filings": [
      {
        "id": "filing_456",
        "type": "VAT_RETURN",
        "status": "SUBMITTED",
        "dueDate": "2024-02-15T00:00:00.000Z"
      }
    ],
    "properties": [
      {
        "id": "property_789",
        "address": "789 Rental St",
        "monthlyRent": 2500.00
      }
    ]
  }
}
```

### PUT /api/clients/[id]
Update client information.

**Request:**
```json
{
  "phone": "+592-555-1111",
  "address": "456 Updated St, Georgetown"
}
```

### DELETE /api/clients/[id]
Archive/deactivate client (sets isActive to false).

**Response (200):**
```json
{
  "message": "Client archived successfully"
}
```

---

## Filing Management

### GET /api/filings
Retrieve tax filings and compliance submissions.

**Query Parameters:**
- `clientId` (optional): Filter by client
- `agency` (optional): "GRA", "NIS", "DCRA"
- `status` (optional): "DRAFT", "SUBMITTED", "APPROVED", "REJECTED"
- `dueAfter` (optional): ISO date string
- `dueBefore` (optional): ISO date string

**Response (200):**
```json
{
  "filings": [
    {
      "id": "filing_123",
      "clientId": "client_456",
      "client": {
        "name": "ABC Corporation",
        "tin": "123456789"
      },
      "type": "VAT_RETURN",
      "agency": "GRA",
      "status": "SUBMITTED",
      "amount": 15000.00,
      "dueDate": "2024-02-15T00:00:00.000Z",
      "submittedAt": "2024-02-10T09:30:00.000Z",
      "period": "2024-01",
      "reference": "GRA2024001234"
    }
  ],
  "stats": {
    "total": 245,
    "overdue": 12,
    "dueThisWeek": 8,
    "submitted": 180
  }
}
```

### POST /api/filings
Create new filing record.

**Request:**
```json
{
  "clientId": "client_456",
  "type": "PAYE_RETURN",
  "agency": "GRA",
  "amount": 25000.00,
  "dueDate": "2024-03-15T00:00:00.000Z",
  "period": "2024-02"
}
```

**Response (201):**
```json
{
  "filing": {
    "id": "filing_789",
    "clientId": "client_456",
    "type": "PAYE_RETURN",
    "agency": "GRA",
    "status": "DRAFT",
    "amount": 25000.00,
    "dueDate": "2024-03-15T00:00:00.000Z",
    "createdAt": "2024-01-15T18:00:00.000Z"
  }
}
```

### PUT /api/filings/[id]
Update filing status and information.

**Request:**
```json
{
  "status": "SUBMITTED",
  "reference": "GRA2024001500",
  "submittedAt": "2024-01-15T18:30:00.000Z"
}
```

---

## Property Management

### GET /api/properties
Retrieve rental properties (GCMC Staff and Admin only).

**Response (200):**
```json
{
  "properties": [
    {
      "id": "property_123",
      "clientId": "client_456",
      "client": {
        "name": "John Smith",
        "phone": "+592-555-7777"
      },
      "address": "123 Rental Avenue, Georgetown",
      "propertyType": "APARTMENT",
      "monthlyRent": 3000.00,
      "managementFeePercentage": 10.0,
      "managementFee": 300.00,
      "tenantName": "Jane Doe",
      "tenantPhone": "+592-555-8888",
      "leaseStart": "2024-01-01T00:00:00.000Z",
      "leaseExpiry": "2024-12-31T00:00:00.000Z",
      "arrears": 0.00,
      "daysUntilExpiry": 350,
      "expiryStatus": "OK"
    }
  ],
  "stats": {
    "totalProperties": 45,
    "totalRentCollectable": 135000.00,
    "totalManagementFees": 13500.00,
    "expiringSoon": 3,
    "inArrears": 2
  }
}
```

### POST /api/properties
Add new rental property.

**Request:**
```json
{
  "clientId": "client_456",
  "address": "789 New Property St",
  "propertyType": "HOUSE",
  "monthlyRent": 4500.00,
  "managementFeePercentage": 12.0,
  "tenantName": "Bob Wilson",
  "tenantPhone": "+592-555-9999",
  "leaseStart": "2024-02-01T00:00:00.000Z",
  "leaseExpiry": "2025-01-31T00:00:00.000Z"
}
```

---

## Immigration Cases

### GET /api/immigration/cases
Retrieve immigration cases in Kanban format (GCMC Staff and Admin only).

**Query Parameters:**
- `status` (optional): Filter by case status
- `caseType` (optional): "WORK_PERMIT", "BUSINESS_VISA", "CITIZENSHIP"

**Response (200):**
```json
{
  "cases": [
    {
      "id": "case_123",
      "clientId": "client_456",
      "client": {
        "name": "ABC Corporation"
      },
      "caseType": "WORK_PERMIT",
      "applicantName": "John Smith",
      "nationality": "Indian",
      "status": "IN_PROGRESS",
      "applicationDate": "2024-01-01T00:00:00.000Z",
      "expiryDate": "2025-01-01T00:00:00.000Z",
      "timeline": [
        {
          "status": "SUBMITTED",
          "date": "2024-01-01T00:00:00.000Z",
          "notes": "Application submitted to immigration office"
        },
        {
          "status": "IN_PROGRESS",
          "date": "2024-01-10T00:00:00.000Z",
          "notes": "Under review"
        }
      ]
    }
  ],
  "statusCounts": {
    "TO_DO": 5,
    "IN_PROGRESS": 12,
    "REVIEW": 3,
    "COMPLETED": 25
  }
}
```

### POST /api/immigration/cases
Create new immigration case.

**Request:**
```json
{
  "clientId": "client_456",
  "caseType": "BUSINESS_VISA",
  "applicantName": "Maria Santos",
  "nationality": "Brazilian",
  "applicationDate": "2024-01-15T00:00:00.000Z",
  "notes": "Business visa for tech conference"
}
```

### PUT /api/immigration/cases/[id]
Update case status (drag-and-drop functionality).

**Request:**
```json
{
  "status": "REVIEW",
  "notes": "Documents received, under final review"
}
```

---

## Payroll & NIS

### POST /api/payroll/calculate
Calculate payroll deductions for employee.

**Request:**
```json
{
  "employeeId": "emp_123",
  "grossSalary": 150000.00,
  "allowances": 20000.00,
  "otherDeductions": 5000.00
}
```

**Response (200):**
```json
{
  "payroll": {
    "grossSalary": 150000.00,
    "allowances": 20000.00,
    "totalGross": 170000.00,
    "nisEmployee": 9520.00,
    "nisEmployer": 14280.00,
    "taxableIncome": 160480.00,
    "paye": 44934.40,
    "otherDeductions": 5000.00,
    "netSalary": 120545.60,
    "breakdown": {
      "nisRate": "5.6%",
      "payeRate": "28%",
      "nisCeiling": 170000.00
    }
  }
}
```

---

## Health Check

### GET /api/health
System health monitoring endpoint.

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T20:00:00.000Z",
  "version": "3.0.0",
  "services": {
    "database": "connected",
    "auth": "operational",
    "api": "operational"
  },
  "uptime": 86400000
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Specific field error"
  },
  "timestamp": "2024-01-15T20:00:00.000Z"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

### Common Error Codes

- `INVALID_CREDENTIALS` - Login failed
- `INSUFFICIENT_PERMISSIONS` - Role-based access denied
- `VALIDATION_ERROR` - Request data validation failed
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `DATABASE_ERROR` - Internal database error

---

## Rate Limiting

API endpoints are protected by rate limiting:

- **Authentication endpoints**: 5 requests per minute
- **GET endpoints**: 100 requests per minute
- **POST/PUT/DELETE endpoints**: 30 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 85
X-RateLimit-Reset: 1640995200
```

---

## Role-Based Access Control

| Endpoint | SUPER_ADMIN | GCMC_STAFF | KAJ_STAFF | CLIENT |
|----------|-------------|------------|-----------|---------|
| `/api/users/*` | ✅ | ❌ | ❌ | ❌ |
| `/api/clients/*` | ✅ | ✅ | ✅ | ❌ |
| `/api/filings/*` | ✅ | ❌ | ✅ | ❌ |
| `/api/immigration/*` | ✅ | ✅ | ❌ | ❌ |
| `/api/properties/*` | ✅ | ✅ | ❌ | ❌ |
| `/api/payroll/*` | ✅ | ❌ | ✅ | ❌ |
| `/api/portal/*` | ❌ | ❌ | ❌ | ✅ |

---

## API Validation

All endpoints use **Zod** schemas for request validation:

### Example Client Validation Schema
```typescript
const clientSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/^\+592-\d{3}-\d{4}$/, "Invalid phone format"),
  type: z.enum(["COMPANY", "INDIVIDUAL"]),
  tin: z.string().regex(/^\d{9}$/, "TIN must be 9 digits").optional(),
  businessReg: z.string().optional()
});
```

---

## Testing

The API includes comprehensive E2E testing with Playwright covering:
- Authentication flows
- CRUD operations for all resources
- Role-based access control
- Error handling scenarios
- Rate limiting

Run tests:
```bash
pnpm run test:e2e
```

---

## Development

### Local Development
```bash
# Start development server
pnpm run dev

# Database operations
pnpm run db:push    # Apply schema changes
pnpm run db:seed    # Populate test data
pnpm run db:studio  # Open database browser
```

### Environment Variables
Required for API functionality:
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/gk_enterprise"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```