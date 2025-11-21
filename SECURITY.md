# Security Documentation - GK Enterprise Suite

## Overview

The GK Enterprise Suite implements comprehensive security measures including authentication, authorization, input validation, security headers, rate limiting, and infrastructure hardening. This document outlines the security architecture and best practices.

## Security Architecture

### 🔐 Authentication System

#### NextAuth.js Implementation
- **Provider**: Custom credentials provider with database verification
- **Session Management**: JWT tokens with secure cookie storage
- **Password Security**: Bcrypt hashing with 12 rounds (industry standard)
- **Session Duration**: Configurable session expiry with automatic refresh

**Implementation Details:**
```typescript
// Authentication flow
async authorize(credentials) {
  // Input validation
  if (!credentials?.email || !credentials?.password) {
    return null
  }

  // Database lookup
  const user = await prisma.user.findUnique({
    where: { email: credentials.email }
  })

  // Bcrypt password verification
  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.passwordHash
  )

  return isPasswordValid ? { id: user.id, email: user.email, role: user.role } : null
}
```

#### Session Security Features
- **Secure Cookies**: HttpOnly, Secure, SameSite attributes
- **CSRF Protection**: Built-in CSRF token validation
- **Session Rotation**: Automatic session ID rotation on authentication
- **Concurrent Session Management**: Optional session limiting per user

### 🛡️ Authorization & Access Control

#### Role-Based Access Control (RBAC)
The system implements a 4-tier role hierarchy with granular permissions:

| Role | Access Level | Permissions |
|------|-------------|-------------|
| `SUPER_ADMIN` | Full System | All modules, user management, system configuration |
| `GCMC_STAFF` | Consultancy Modules | Immigration, Training, Legal, Property, Network |
| `KAJ_STAFF` | Financial Modules | Tax, Accounting, Payroll, Compliance, Banking |
| `CLIENT` | Portal Only | View own data, request services, document access |

#### Middleware Protection
All routes are protected by authentication middleware that:
- Validates JWT session tokens
- Enforces role-based route access
- Redirects unauthorized users appropriately
- Logs access attempts for audit trails

**Middleware Implementation:**
```typescript
// Route protection logic
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  if (!token) {
    return NextResponse.redirect('/auth/signin')
  }

  // Role-based access control
  const userRole = token.role as UserRole
  const pathname = request.nextUrl.pathname

  // GCMC staff restrictions
  if (userRole === "GCMC_STAFF") {
    const gcmcRoutes = ["/immigration", "/training", "/network", "/paralegal"]
    const hasAccess = gcmcRoutes.some(route => pathname.startsWith(route))

    if (!hasAccess && !pathname.startsWith("/dashboard")) {
      return NextResponse.redirect('/unauthorized')
    }
  }

  return NextResponse.next()
}
```

### 🔍 Input Validation & Sanitization

#### Zod Schema Validation
All API endpoints and forms use Zod schemas for strict validation:

```typescript
// Example client validation schema
const clientSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .regex(/^[a-zA-Z0-9\s\-\.]+$/, "Invalid characters"),

  email: z.string()
    .email("Invalid email format")
    .toLowerCase(),

  phone: z.string()
    .regex(/^\+592-\d{3}-\d{4}$/, "Invalid Guyana phone format"),

  tin: z.string()
    .regex(/^\d{9}$/, "TIN must be exactly 9 digits")
    .optional(),
})
```

#### Server-Side Sanitization
- **HTML Sanitization**: DOMPurify for user-generated content
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **XSS Protection**: Content Security Policy and output encoding
- **File Upload Security**: Type validation and virus scanning

### 🛡️ Security Headers

#### Content Security Policy (CSP)
Comprehensive CSP implementation preventing XSS and injection attacks:

```javascript
// next.config.js security headers
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' data: https:;
      connect-src 'self' https://api.github.com;
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
    `.replace(/\s{2,}/g, ' ').trim()
  }
]
```

#### Additional Security Headers
- **Strict Transport Security (HSTS)**: Force HTTPS connections
- **X-Frame-Options**: Prevent clickjacking attacks
- **X-Content-Type-Options**: Prevent MIME type sniffing
- **Referrer-Policy**: Control referrer information leakage
- **Permissions-Policy**: Restrict dangerous browser APIs

### ⚡ Rate Limiting

#### API Endpoint Protection
Rate limiting implemented per endpoint type and user:

```typescript
// Rate limiting configuration
const rateLimitConfig = {
  // Authentication endpoints
  '/api/auth/signin': { requests: 5, window: 60000 }, // 5 per minute
  '/api/auth/signup': { requests: 3, window: 300000 }, // 3 per 5 minutes

  // General API endpoints
  '/api/*': { requests: 100, window: 60000 }, // 100 per minute

  // Resource creation endpoints
  'POST /api/clients': { requests: 20, window: 60000 }, // 20 per minute
  'POST /api/filings': { requests: 30, window: 60000 }, // 30 per minute
}
```

#### Rate Limiting Features
- **Per-IP Tracking**: Individual limits per client IP address
- **Sliding Window**: Accurate rate limiting with sliding time windows
- **Graceful Degradation**: Informative error responses when limits exceeded
- **Header Information**: Rate limit status included in response headers

### 🗄️ Database Security

#### PostgreSQL Security
- **Connection Encryption**: SSL/TLS encrypted connections
- **Credential Management**: Environment-based database credentials
- **Connection Pooling**: Prisma connection pooling with max connections
- **Prepared Statements**: All queries use parameterized statements

#### Data Protection
- **Password Hashing**: Bcrypt with 12 rounds (2^12 iterations)
- **Personal Data**: Encryption at rest for sensitive fields
- **Audit Logging**: Database-level audit trails for sensitive operations
- **Backup Encryption**: Encrypted database backups

### 🔒 Infrastructure Security

#### Docker Security
- **Non-Root User**: Application runs as non-privileged user
- **Minimal Base Images**: Alpine Linux for reduced attack surface
- **Secrets Management**: Docker secrets for sensitive configuration
- **Network Isolation**: Isolated Docker networks for services

```dockerfile
# Security-focused Dockerfile
FROM node:18-alpine

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Use non-root user
USER nextjs

# Health checks
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

#### Network Security
- **HTTPS Enforcement**: All production traffic over HTTPS
- **Certificate Management**: Automated Let's Encrypt certificates
- **Firewall Configuration**: Restricted port access
- **Reverse Proxy**: Nginx with security headers and rate limiting

### 🔐 Secrets Management

#### Environment Variables
- **Sensitive Data**: All secrets stored in environment variables
- **Local Development**: `.env.local` files (gitignored)
- **Production**: Docker secrets or cloud provider secret management
- **Validation**: Required environment variables validated on startup

```bash
# Required security environment variables
NEXTAUTH_SECRET=super-secure-random-string
DATABASE_URL=postgresql://user:password@host:5432/db
ENCRYPTION_KEY=32-byte-base64-encoded-key
RATE_LIMIT_SECRET=rate-limiting-secret-key
```

#### Key Rotation
- **Regular Rotation**: Scheduled secret rotation procedures
- **Zero-Downtime**: Rolling updates for secret changes
- **Audit Trail**: Secret access and rotation logging
- **Emergency Procedures**: Incident response for compromised secrets

---

## Security Best Practices

### 🛡️ Development Security

#### Code Security
- **Dependency Scanning**: Regular vulnerability scans with `npm audit`
- **SAST Tools**: Static Application Security Testing integration
- **Code Review**: Mandatory security-focused code reviews
- **Secure Coding**: OWASP secure coding guidelines compliance

#### Testing Security
- **Security Tests**: Automated security testing in CI/CD pipeline
- **Penetration Testing**: Regular professional security assessments
- **Vulnerability Management**: Rapid patching of discovered vulnerabilities
- **Red Team Exercises**: Simulated attack scenarios

### 🔒 Production Security

#### Monitoring & Alerting
- **Security Events**: Real-time monitoring of authentication failures
- **Anomaly Detection**: Unusual access pattern detection
- **Incident Response**: Automated alerting for security incidents
- **Compliance Logging**: Comprehensive audit logs for compliance

```typescript
// Security event logging
const securityLogger = {
  logFailedLogin: (ip: string, email: string) => {
    console.warn(`Failed login attempt from ${ip} for ${email}`)
    // Send to SIEM or security monitoring system
  },

  logPrivilegeEscalation: (userId: string, attemptedRole: string) => {
    console.error(`Privilege escalation attempt by user ${userId}`)
    // Immediate security team notification
  },

  logSuspiciousActivity: (event: SecurityEvent) => {
    // Log to security monitoring system
  }
}
```

#### Backup Security
- **Encrypted Backups**: All backups encrypted at rest and in transit
- **Secure Storage**: Backups stored in secure, access-controlled locations
- **Recovery Testing**: Regular backup restoration testing
- **Retention Policies**: Secure backup deletion after retention period

### 🚨 Incident Response

#### Security Incident Plan
1. **Detection**: Automated monitoring and manual reporting
2. **Assessment**: Severity classification and impact analysis
3. **Containment**: Immediate threat isolation and system protection
4. **Eradication**: Root cause identification and vulnerability patching
5. **Recovery**: Secure system restoration and monitoring
6. **Lessons Learned**: Post-incident review and process improvement

#### Emergency Procedures
- **Account Lockout**: Immediate user account disabling procedures
- **Service Isolation**: Network segmentation and service quarantine
- **Data Breach Response**: Customer notification and regulatory compliance
- **Forensic Preservation**: Evidence collection and analysis procedures

---

## Compliance & Standards

### 🏛️ Regulatory Compliance

#### Data Protection
- **GDPR Compliance**: EU General Data Protection Regulation adherence
- **Data Minimization**: Collect only necessary personal information
- **Right to Deletion**: User data deletion capabilities
- **Consent Management**: Clear consent mechanisms for data processing

#### Financial Compliance
- **PCI DSS**: Payment Card Industry security standards (if applicable)
- **SOX Compliance**: Sarbanes-Oxley financial reporting controls
- **Local Regulations**: Guyana financial and data protection laws
- **Audit Requirements**: Comprehensive audit trail maintenance

### 📊 Security Metrics

#### Key Security Indicators
- **Authentication Success Rate**: >99.5% legitimate login success
- **Failed Login Attempts**: <1% of total authentication attempts
- **Vulnerability Response Time**: <24 hours for critical vulnerabilities
- **Incident Response Time**: <1 hour for security incident detection to response

#### Monitoring Dashboard
- **Security Events**: Real-time security event visualization
- **Threat Intelligence**: Integration with threat intelligence feeds
- **Compliance Status**: Continuous compliance monitoring
- **Risk Assessment**: Regular security risk evaluations

---

## Security Procedures

### 🔄 Regular Security Tasks

#### Daily Tasks
- Monitor security logs and alerts
- Review failed authentication attempts
- Check system health and security status
- Verify backup integrity and encryption

#### Weekly Tasks
- Dependency vulnerability scans
- Security patch assessment and deployment
- Access review for user accounts
- Security metric analysis and reporting

#### Monthly Tasks
- Comprehensive security assessment
- Penetration testing activities
- Security training for development team
- Incident response plan testing

#### Quarterly Tasks
- Full security audit and review
- Compliance assessment and reporting
- Security architecture review
- Third-party security assessment

### 🛠️ Security Tools Integration

#### Automated Security Tools
- **Dependency Scanning**: GitHub Security Advisories, Snyk
- **Code Analysis**: SonarQube, CodeQL
- **Infrastructure Scanning**: Docker Scout, Trivy
- **Monitoring**: Prometheus, Grafana, ELK Stack

#### Security Testing
```bash
# Security testing commands
npm audit                          # Dependency vulnerabilities
npm run test:security             # Security-focused tests
docker scan gk-enterprise-suite   # Container vulnerability scan
```

---

## Developer Security Guidelines

### 🔒 Secure Coding Practices

#### Input Handling
- **Validate All Inputs**: Never trust user input
- **Use Zod Schemas**: Consistent validation across application
- **Sanitize Output**: Prevent XSS through proper encoding
- **Parameterized Queries**: Prevent SQL injection

#### Authentication & Authorization
- **Check Authentication**: Verify user identity on every request
- **Enforce Authorization**: Check permissions before data access
- **Principle of Least Privilege**: Grant minimal necessary permissions
- **Session Management**: Proper session creation, validation, and destruction

#### Data Protection
- **Encrypt Sensitive Data**: Use appropriate encryption for PII
- **Secure Transmission**: HTTPS for all data transmission
- **Minimize Data Exposure**: Return only necessary data in API responses
- **Audit Trails**: Log access to sensitive information

### 🚀 Security in CI/CD

#### Automated Security Checks
```yaml
# GitHub Actions security workflow
name: Security Scan
on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run npm audit
        run: npm audit --audit-level high

      - name: Run Snyk security scan
        run: npx snyk test

      - name: Docker security scan
        run: docker scan ${{ github.repository }}

      - name: SAST with CodeQL
        uses: github/codeql-action/analyze@v2
```

---

## Incident Response Procedures

### 🚨 Security Incident Classification

#### Severity Levels
- **Critical**: System compromise, data breach, or service unavailability
- **High**: Privilege escalation, authentication bypass, or sensitive data exposure
- **Medium**: Vulnerability requiring prompt attention but limited immediate impact
- **Low**: Minor security issues with minimal risk

#### Response Procedures
1. **Immediate Response** (0-1 hours)
   - Assess and classify incident severity
   - Activate incident response team
   - Begin containment procedures
   - Notify key stakeholders

2. **Short-term Response** (1-24 hours)
   - Complete threat containment
   - Begin forensic analysis
   - Implement temporary mitigations
   - Prepare stakeholder communications

3. **Long-term Response** (24+ hours)
   - Complete root cause analysis
   - Implement permanent fixes
   - Update security procedures
   - Conduct lessons learned review

### 📞 Emergency Contacts

#### Security Team
- **Security Lead**: security-lead@your-domain.com
- **Infrastructure Team**: infrastructure@your-domain.com
- **Legal/Compliance**: legal@your-domain.com
- **Executive Team**: executives@your-domain.com

#### External Contacts
- **Legal Counsel**: [Legal firm contact]
- **Cyber Insurance**: [Insurance provider contact]
- **Law Enforcement**: [Appropriate cybercrime unit]
- **Regulatory Authorities**: [Relevant regulatory bodies]

---

## Security Training & Awareness

### 🎓 Developer Security Training

#### Required Training Topics
- Secure coding practices and OWASP Top 10
- Authentication and authorization best practices
- Input validation and output encoding
- Cryptography and secure communication
- Incident response procedures

#### Training Resources
- [OWASP Developer Guide](https://owasp.org/www-project-developer-guide/)
- [Secure Code Warrior](https://www.securecodewarrior.com/)
- Internal security training materials
- Regular security workshops and lunch-and-learns

### 📚 Security Documentation

#### Internal Resources
- Security policy and procedures
- Secure coding guidelines
- Incident response playbooks
- Security architecture documentation

#### External Resources
- Industry security standards and best practices
- Threat intelligence feeds and security advisories
- Regulatory compliance requirements
- Security community resources and forums

---

## Contact Information

### Security Team
- **Email**: security@your-domain.com
- **Emergency Hotline**: [24/7 security hotline]
- **Slack**: #security-team

### Vulnerability Reporting
- **Email**: security@your-domain.com
- **Bug Bounty**: [Bug bounty platform if applicable]
- **GPG Key**: [Public GPG key for secure communications]

---

## Appendices

### A. Security Checklist

#### Pre-Deployment Security Review
- [ ] All authentication endpoints tested
- [ ] Authorization controls verified for all roles
- [ ] Input validation implemented for all forms
- [ ] Security headers properly configured
- [ ] Rate limiting configured and tested
- [ ] Database security measures implemented
- [ ] Container security best practices followed
- [ ] Network security properly configured
- [ ] Secrets management implemented
- [ ] Monitoring and alerting configured

### B. Security Configuration Examples

See deployment documentation for complete configuration examples including:
- nginx security configuration
- Docker security settings
- Environment variable templates
- SSL/TLS configuration
- Monitoring setup

### C. Compliance Mapping

Documentation mapping security controls to relevant compliance frameworks:
- ISO 27001
- NIST Cybersecurity Framework
- OWASP Application Security Verification Standard
- SOC 2 Type II
- Local regulatory requirements