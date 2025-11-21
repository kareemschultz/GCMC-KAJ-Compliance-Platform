import type {
  Client,
  Document,
  ServiceRequest,
  TaxReturn,
  NISSchedule,
  VisaApplication,
  Partner,
  TrainingSession,
  FinancialStatement,
  AuditCase,
  BankService,
} from "@/types"
import {
  mockClients,
  mockTaxReturns,
  mockNISSchedules,
  mockVisaApplications,
  mockPartners,
  mockTrainingSessions,
  mockFinancialStatements,
  mockAuditCases,
  mockBankServices,
} from "@/lib/mock-data"

// Mock API delay to simulate real network requests
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const api = {
  clients: {
    list: async (): Promise<Client[]> => {
      await delay(800)
      return mockClients
    },
    create: async (data: any): Promise<Client> => {
      await delay(1000)
      console.log("[API] Created client:", data)
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        status: "Active",
        complianceScore: 100,
        lastActivity: new Date().toISOString(),
        initials: data.name.substring(0, 2).toUpperCase(),
      }
    },
    update: async (id: string, data: any) => {
      await delay(800)
      console.log(`[API] Updated client ${id}:`, data)
      return { id, ...data }
    },
  },
  documents: {
    upload: async (file: File, metadata: any): Promise<Document> => {
      await delay(1500)
      console.log("[API] Uploaded document:", file.name, metadata)
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: metadata.type,
        status: "Valid",
        uploadDate: new Date().toISOString(),
        expiryDate: metadata.expiryDate,
        referenceNumber: metadata.referenceNumber,
        issuingAgency: metadata.issuingAgency,
        clientName: "Mock Client", // In real app, fetch from client ID
        clientId: metadata.clientId,
        size: "1.2 MB", // Mock size
        uploadedBy: "Current User",
      }
    },
  },
  services: {
    request: async (data: any): Promise<ServiceRequest> => {
      await delay(1000)
      console.log("[API] Requested service:", data)
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        status: "Pending",
        requestDate: new Date().toISOString(),
      }
    },
  },
  filings: {
    create: async (data: any) => {
      await delay(1200)
      console.log("[API] Created filing:", data)
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        status: "Pending",
        submissionDate: new Date().toISOString(),
      }
    },
    list: async () => {
      await delay(800)
      return [
        {
          id: "1",
          clientName: "ABC Corporation Ltd",
          type: "VAT Return",
          agency: "GRA",
          period: "Q4 2024",
          dueDate: "Jan 21, 2025",
          amount: 45000,
          status: "Pending",
        },
      ]
    },
  },
  taxReturns: {
    list: async (): Promise<TaxReturn[]> => {
      await delay(800)
      return mockTaxReturns
    },
  },
  nisSchedules: {
    list: async (): Promise<NISSchedule[]> => {
      await delay(800)
      return mockNISSchedules
    },
    create: async (data: any): Promise<NISSchedule> => {
      await delay(1000)
      console.log("[API] Created NIS Schedule:", data)
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        status: "DRAFT",
      }
    },
  },
  immigration: {
    list: async (): Promise<VisaApplication[]> => {
      await delay(800)
      return mockVisaApplications
    },
    create: async (data: any): Promise<VisaApplication> => {
      await delay(1000)
      console.log("[API] Created Visa Application:", data)
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        status: "APPLICATION_SUBMITTED",
      }
    },
  },
  partners: {
    list: async (): Promise<Partner[]> => {
      await delay(600)
      return mockPartners
    },
    create: async (data: any): Promise<Partner> => {
      await delay(800)
      console.log("[API] Created Partner:", data)
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
      }
    },
  },
  training: {
    list: async (): Promise<TrainingSession[]> => {
      await delay(600)
      return mockTrainingSessions
    },
    create: async (data: any): Promise<TrainingSession> => {
      await delay(800)
      console.log("[API] Created Training Session:", data)
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        attendees: [],
      }
    },
  },
  users: {
    list: async () => {
      await delay(600)
      return [
        {
          id: 1,
          name: "John Doe",
          email: "john@gcmc.gy",
          role: "Admin",
          status: "Active",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@gcmc.gy",
          role: "Compliance Officer",
          status: "Active",
        },
      ]
    },
    create: async (data: any) => {
      await delay(1000)
      console.log("[API] Created user:", data)
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        status: "Active",
      }
    },
    update: async (id: number | string, data: any) => {
      await delay(800)
      console.log(`[API] Updated user ${id}:`, data)
      return { id, ...data }
    },
    delete: async (id: number | string) => {
      await delay(800)
      console.log(`[API] Deleted user ${id}`)
      return true
    },
  },
  // Added Accounting API endpoints
  accounting: {
    getFinancialStatements: async (): Promise<FinancialStatement[]> => {
      await delay(800)
      return mockFinancialStatements
    },
    createFinancialStatement: async (data: any): Promise<FinancialStatement> => {
      await delay(1000)
      console.log("[API] Created Financial Statement:", data)
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        createdAt: new Date().toISOString(),
      }
    },
    getAuditCases: async (): Promise<AuditCase[]> => {
      await delay(800)
      return mockAuditCases
    },
    updateAuditCase: async (id: string, data: any): Promise<AuditCase> => {
      await delay(800)
      console.log(`[API] Updated Audit Case ${id}:`, data)
      return {
        ...mockAuditCases.find((c) => c.id === id)!,
        ...data,
      }
    },
    getBankServices: async (): Promise<BankService[]> => {
      await delay(800)
      return mockBankServices
    },
    createBankService: async (data: any): Promise<BankService> => {
      await delay(1000)
      console.log("[API] Created Bank Service:", data)
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        status: "PENDING",
        submittedDate: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
      }
    },
  },
}
