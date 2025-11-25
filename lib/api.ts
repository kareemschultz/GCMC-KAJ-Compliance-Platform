/**
 * API Client Library - Real Database Connections Only
 * No mock data - all operations connect to PostgreSQL via Prisma
 */

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
  Property,
  ExpediteJob,
  Employee,
} from "@/types"

// Base API URL - dynamically detect the current host
const API_BASE_URL = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.host}`
  : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}/api${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API Error (${response.status}): ${error}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error)
    throw error
  }
}

export const api = {
  // Client Management
  clients: {
    list: async (params?: { page?: number; limit?: number; search?: string }): Promise<any> => {
      const query = params ? `?${new URLSearchParams(params as any)}` : ''
      return apiRequest(`/clients${query}`)
    },

    get: async (id: string): Promise<Client> => {
      return apiRequest(`/clients/${id}`)
    },

    create: async (data: any): Promise<Client> => {
      return apiRequest('/clients', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    update: async (id: string, data: any): Promise<Client> => {
      return apiRequest(`/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },

    delete: async (id: string): Promise<void> => {
      return apiRequest(`/clients/${id}`, {
        method: 'DELETE',
      })
    },
  },

  // Tax Returns
  taxReturns: {
    list: async (params?: { clientId?: string; status?: string }): Promise<TaxReturn[]> => {
      const query = params ? `?${new URLSearchParams(params)}` : ''
      const response = await apiRequest<any>(`/tax-returns${query}`)
      return response.taxReturns || []
    },

    get: async (id: string): Promise<TaxReturn> => {
      return apiRequest(`/tax-returns/${id}`)
    },

    create: async (data: any): Promise<TaxReturn> => {
      return apiRequest('/tax-returns', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    update: async (id: string, data: any): Promise<TaxReturn> => {
      return apiRequest(`/tax-returns/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },
  },

  // NIS Schedules
  nisSchedules: {
    list: async (params?: { clientId?: string }): Promise<NISSchedule[]> => {
      const query = params ? `?${new URLSearchParams(params)}` : ''
      const response = await apiRequest<any>(`/nis-schedules${query}`)
      return response.nisSchedules || []
    },

    get: async (id: string): Promise<NISSchedule> => {
      return apiRequest(`/nis-schedules/${id}`)
    },

    create: async (data: any): Promise<NISSchedule> => {
      return apiRequest('/nis-schedules', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    calculate: async (data: { wages: number; period: string }): Promise<any> => {
      return apiRequest('/nis-schedules/calculate', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  },

  // Visa & Immigration
  immigration: {
    list: async (params?: { clientId?: string; status?: string }): Promise<VisaApplication[]> => {
      const query = params ? `?${new URLSearchParams(params)}` : ''
      const response = await apiRequest<any>(`/immigration${query}`)
      return response.applications || []
    },

    get: async (id: string): Promise<VisaApplication> => {
      return apiRequest(`/immigration/${id}`)
    },

    create: async (data: any): Promise<VisaApplication> => {
      return apiRequest('/immigration', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    update: async (id: string, data: any): Promise<VisaApplication> => {
      return apiRequest(`/immigration/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },
  },

  // Partners
  partners: {
    list: async (params?: { category?: string }): Promise<Partner[]> => {
      const query = params ? `?${new URLSearchParams(params)}` : ''
      const response = await apiRequest<any>(`/partners${query}`)
      return response.partners || []
    },

    get: async (id: string): Promise<Partner> => {
      return apiRequest(`/partners/${id}`)
    },

    create: async (data: any): Promise<Partner> => {
      return apiRequest('/partners', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    update: async (id: string, data: any): Promise<Partner> => {
      return apiRequest(`/partners/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },
  },

  // Training Sessions
  training: {
    list: async (params?: { upcoming?: boolean }): Promise<TrainingSession[]> => {
      const query = params ? `?${new URLSearchParams(params as any)}` : ''
      const response = await apiRequest<any>(`/training${query}`)
      return response.sessions || []
    },

    get: async (id: string): Promise<TrainingSession> => {
      return apiRequest(`/training/${id}`)
    },

    create: async (data: any): Promise<TrainingSession> => {
      return apiRequest('/training', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    register: async (sessionId: string, data: any): Promise<any> => {
      return apiRequest(`/training/${sessionId}/register`, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  },

  // Financial Statements
  accounting: {
    getFinancialStatements: async (params?: { clientId?: string }): Promise<FinancialStatement[]> => {
      const query = params ? `?${new URLSearchParams(params)}` : ''
      const response = await apiRequest<any>(`/financial-statements${query}`)
      return response.statements || []
    },

    createFinancialStatement: async (data: any): Promise<FinancialStatement> => {
      return apiRequest('/financial-statements', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    getAuditCases: async (params?: { clientId?: string }): Promise<AuditCase[]> => {
      const query = params ? `?${new URLSearchParams(params)}` : ''
      const response = await apiRequest<any>(`/audit-cases${query}`)
      return response.cases || []
    },

    createAuditCase: async (data: any): Promise<AuditCase> => {
      return apiRequest('/audit-cases', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    updateAuditCase: async (id: string, data: any): Promise<AuditCase> => {
      return apiRequest(`/audit-cases/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },

    getBankServices: async (params?: { clientId?: string }): Promise<BankService[]> => {
      const query = params ? `?${new URLSearchParams(params)}` : ''
      const response = await apiRequest<any>(`/bank-services${query}`)
      return response.services || []
    },

    createBankService: async (data: any): Promise<BankService> => {
      return apiRequest('/bank-services', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  },

  // Properties
  property: {
    list: async (params?: { clientId?: string }): Promise<Property[]> => {
      const query = params ? `?${new URLSearchParams(params)}` : ''
      const response = await apiRequest<any>(`/properties${query}`)
      return response.properties || []
    },

    get: async (id: string): Promise<Property> => {
      return apiRequest(`/properties/${id}`)
    },

    create: async (data: any): Promise<Property> => {
      return apiRequest('/properties', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    update: async (id: string, data: any): Promise<Property> => {
      return apiRequest(`/properties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },
  },

  // Expediting Services
  expediting: {
    list: async (params?: { clientId?: string; status?: string }): Promise<ExpediteJob[]> => {
      const query = params ? `?${new URLSearchParams(params)}` : ''
      const response = await apiRequest<any>(`/expediting${query}`)
      return response.jobs || []
    },

    get: async (id: string): Promise<ExpediteJob> => {
      return apiRequest(`/expediting/${id}`)
    },

    create: async (data: any): Promise<ExpediteJob> => {
      return apiRequest('/expediting', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    updateStatus: async (id: string, status: string, notes?: string): Promise<ExpediteJob> => {
      return apiRequest(`/expediting/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, notes }),
      })
    },
  },

  // Employees
  employees: {
    list: async (params?: { clientId?: string }): Promise<Employee[]> => {
      const query = params ? `?${new URLSearchParams(params)}` : ''
      const response = await apiRequest<any>(`/employees${query}`)
      return response.employees || []
    },

    get: async (id: string): Promise<Employee> => {
      return apiRequest(`/employees/${id}`)
    },

    create: async (data: any): Promise<Employee> => {
      return apiRequest('/employees', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    update: async (id: string, data: any): Promise<Employee> => {
      return apiRequest(`/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },

    delete: async (id: string): Promise<void> => {
      return apiRequest(`/employees/${id}`, {
        method: 'DELETE',
      })
    },
  },

  // Documents
  documents: {
    upload: async (file: File, metadata: any): Promise<Document> => {
      const formData = new FormData()
      formData.append('file', file)
      Object.keys(metadata).forEach(key => {
        formData.append(key, metadata[key])
      })

      const response = await fetch(`${API_BASE_URL}/api/documents`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      return response.json()
    },

    list: async (params?: { clientId?: string }): Promise<Document[]> => {
      const query = params ? `?${new URLSearchParams(params)}` : ''
      const response = await apiRequest<any>(`/documents${query}`)
      return response.documents || []
    },

    delete: async (id: string): Promise<void> => {
      return apiRequest(`/documents/${id}`, {
        method: 'DELETE',
      })
    },
  },

  // Filings
  filings: {
    list: async (params?: { clientId?: string; status?: string }): Promise<any[]> => {
      const query = params ? `?${new URLSearchParams(params)}` : ''
      const response = await apiRequest<any>(`/filings${query}`)
      return response.filings || []
    },

    create: async (data: any): Promise<any> => {
      return apiRequest('/filings', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    update: async (id: string, data: any): Promise<any> => {
      return apiRequest(`/filings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },
  },

  // Users
  users: {
    list: async (): Promise<any[]> => {
      const response = await apiRequest<any>('/users')
      return response.users || []
    },

    get: async (id: string): Promise<any> => {
      return apiRequest(`/users/${id}`)
    },

    create: async (data: any): Promise<any> => {
      return apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    update: async (id: string, data: any): Promise<any> => {
      return apiRequest(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },

    delete: async (id: string): Promise<void> => {
      return apiRequest(`/users/${id}`, {
        method: 'DELETE',
      })
    },
  },

  // Services
  services: {
    request: async (data: any): Promise<ServiceRequest> => {
      return apiRequest('/services/request', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    list: async (): Promise<ServiceRequest[]> => {
      const response = await apiRequest<any>('/services')
      return response.services || []
    },
  },

  // Dashboard Stats
  dashboard: {
    getStats: async (): Promise<any> => {
      return apiRequest('/dashboard/stats')
    },

    getComplianceStatus: async (): Promise<any> => {
      return apiRequest('/dashboard/compliance')
    },

    getRecentActivity: async (): Promise<any> => {
      return apiRequest('/dashboard/activity')
    },
  },

  // Tax Calculations
  calculations: {
    calculateVAT: async (data: { amount: number; isInclusive?: boolean }): Promise<any> => {
      return apiRequest('/calculations/vat', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    calculatePAYE: async (data: { salary: number; period?: string }): Promise<any> => {
      return apiRequest('/calculations/paye', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    calculateNIS: async (data: { salary: number; period?: string }): Promise<any> => {
      return apiRequest('/calculations/nis', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    calculate7B: async (data: { amount: number; type?: string }): Promise<any> => {
      return apiRequest('/calculations/7b-tax', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  },
}