export interface Client {
  id: string
  name: string
  type: "Company" | "Individual" | "Partnership" | "Sole Trader"
  tin: string
  complianceScore: number
  documentsCount: number
  lastActivity: string
  status: "Active" | "Inactive" | "Pending"
  avatar?: string
  initials: string
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
