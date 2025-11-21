export interface Client {
  id: string
  name: string
  type: "Company" | "Individual" | "Partnership" | "Sole Trader"
  tin: string
  nisNumber?: string // Added optional NIS number
  complianceScore: number
  documentsCount: number
  lastActivity: string
  status: "Active" | "Inactive" | "Pending"
  avatar?: string
  initials: string
  email: string // Added email
  phone: string // Added phone
}

export interface Filing {
  id: string
  clientName: string
  type: string
  agency: "GRA" | "NIS" | "DCRA" | "GO-Invest"
  period: string
  dueDate: string
  amount?: number
  status: "Draft" | "Submitted" | "Accepted" | "Rejected" | "Overdue"
}

export type ServiceCategory = "GCMC" | "KAJ"

export interface ServiceItem {
  id: string
  category: ServiceCategory
  subcategory: string
  name: string
  description?: string
}

export interface ClientService {
  id: string
  serviceId: string
  name: string
  status: "Active" | "Pending" | "Completed" | "On Hold"
  startDate: string
  endDate?: string
  notes?: string
}

export interface Document {
  id: string
  name: string
  type: string
  referenceNumber?: string
  issuingAgency?: string
  clientName: string
  clientId: string
  uploadDate: string
  expiryDate?: string
  status: "Valid" | "Expiring Soon" | "Expired"
  size: string
  uploadedBy: string
}

export interface Task {
  id: string
  title: string
  clientName?: string
  clientId?: string
  assignee: {
    name: string
    avatar?: string
    initials: string
  }
  dueDate: string
  priority: "Urgent" | "High" | "Medium" | "Low"
  status: "To Do" | "In Progress" | "Review" | "Done"
  type: "Document Collection" | "Filing Prep" | "Client Meeting" | "Follow-up" | "Review"
  checklist: {
    id: string
    text: string
    completed: boolean
  }[]
  labels: string[]
}

export interface AuditLogEntry {
  id: string
  action: string
  entityType: "Client" | "Document" | "Filing" | "User" | "System"
  entityName: string
  entityId: string
  user: {
    name: string
    email: string
    avatar?: string
  }
  timestamp: string
  details?: string
  ipAddress?: string
  status: "Success" | "Failed" | "Warning"
}

export type UserRole = "SUPER_ADMIN" | "GCMC_STAFF" | "KAJ_STAFF" | "CLIENT"

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  createdAt: string
  clientId?: string
}

export interface TaxReturn {
  id: string
  filingType: "VAT" | "PAYE" | "INCOME_TAX" | "CORP_TAX"
  period: string
  status: "PENDING" | "SUBMITTED" | "APPROVED"
  amountDue: number
  filingDate?: string
  clientId: string
}

export interface NISSchedule {
  id: string
  month: string
  totalWages: number
  employeeDed: number
  employerCont: number
  totalRemit: number
  status: "DRAFT" | "FILED"
  clientId: string
}

export interface VisaApplication {
  id: string
  applicantName: string
  permitType: "WORK_PERMIT" | "CITIZENSHIP" | "BUSINESS_VISA"
  expiryDate: string
  status: "APPLICATION_SUBMITTED" | "UNDER_REVIEW" | "APPROVED"
  clientId: string
}

export interface Partner {
  id: string
  companyName: string
  category: "REAL_ESTATE" | "IT_TECHNICIAN" | "LAW_FIRM" | "CONSTRUCTION"
  contactPerson: string
  phone: string
  email: string
  website?: string
  verified?: boolean
  location?: string
  description?: string
}

export interface Appointment {
  id: string
  serviceType: string
  startTime: string
  endTime: string
  status: "CONFIRMED" | "CANCELLED" | "PENDING"
  clientName: string
  clientEmail: string
  clientPhone?: string
  reason?: string
}

export interface TrainingSession {
  id: string
  title: string
  date: string
  capacity: number
  price: number
  attendees: any[]
}

export interface FinancialStatement {
  id: string
  clientId: string
  type: "INCOME_STATEMENT" | "CASH_FLOW"
  period: string
  data: any // JSON data for the statement
  createdAt: string
}

export interface AuditCase {
  id: string
  entityName: string
  entityType: "NGO" | "CO_OP"
  status: "OPEN" | "REVIEW" | "CLOSED"
  assignedAuditor?: string
  dueDate: string
  progress: number
}

export interface BankService {
  id: string
  clientName: string
  service: "ACCOUNT_OPENING" | "LOAN_APP"
  bankName: string
  status: "PENDING" | "APPROVED" | "REJECTED" | "IN_PROGRESS"
  submittedDate: string
  lastUpdate: string
}

export interface Property {
  id: string
  address: string
  type: "Commercial" | "Residential"
  ownerId: string
  status: "Occupied" | "Vacant"
  managementFeePercentage: number
  tenant: {
    id: string
    name: string
    contactEmail: string
    contactPhone: string
  } | null
  leaseDetails: {
    startDate: string
    endDate: string
    monthlyRentGyd: number
    paymentDueDay: number
    securityDepositGyd: number
    leaseDocUrl: string
  } | null
  financials: {
    nextRentDue: string | null
    managementFeeGyd: number
    totalRevenueYtdGyd: number
    arrearsGyd: number
  }
}

export interface ExpediteJob {
  id: string
  clientId: string
  clientName: string
  documentType: string
  agencyName: string
  referenceNumber: string
  assignedRunner: string
  expectedCompletion: string
  status: "PICKED_UP" | "AT_AGENCY" | "PROCESSING" | "READY_FOR_COLLECTION" | "OUT_FOR_DELIVERY" | "COMPLETED"
  statusHistory: {
    status: string
    timestamp: string
    notes?: string
  }[]
}
