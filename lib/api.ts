import type { Client, Document, ServiceRequest } from "@/types"

// Mock API delay to simulate real network requests
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const api = {
  clients: {
    create: async (data: any): Promise<Client> => {
      await delay(1000)
      console.log("[API] Created client:", data)
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        status: "Active",
        complianceScore: 100,
        lastActivity: new Date().toISOString(),
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
        // ... more mock data
      ]
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
}
