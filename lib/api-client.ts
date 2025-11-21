// API client for making requests to our Next.js API routes
class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL || ""
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    }

    const config: RequestInit = {
      headers: defaultHeaders,
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Clients
  async getClients(params?: { page?: number; limit?: number; search?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.search) searchParams.append("search", params.search)

    return this.request(`/clients?${searchParams.toString()}`)
  }

  async getClient(id: string) {
    return this.request(`/clients/${id}`)
  }

  async createClient(data: any) {
    return this.request("/clients", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateClient(id: string, data: any) {
    return this.request(`/clients/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteClient(id: string) {
    return this.request(`/clients/${id}`, {
      method: "DELETE",
    })
  }

  // Filings
  async getFilings(params?: {
    page?: number;
    limit?: number;
    clientId?: string;
    status?: string;
    filingType?: string;
  }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.clientId) searchParams.append("clientId", params.clientId)
    if (params?.status) searchParams.append("status", params.status)
    if (params?.filingType) searchParams.append("filingType", params.filingType)

    return this.request(`/filings?${searchParams.toString()}`)
  }

  async createFiling(data: any) {
    return this.request("/filings", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Users
  async getUsers(params?: { page?: number; limit?: number; role?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.role) searchParams.append("role", params.role)

    return this.request(`/users?${searchParams.toString()}`)
  }

  async createUser(data: any) {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Documents
  async uploadDocument(formData: FormData) {
    return fetch(`${this.baseUrl}/api/documents`, {
      method: "POST",
      body: formData, // Don't set Content-Type for FormData
    }).then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      return res.json()
    })
  }

  async getDocuments(params?: {
    page?: number;
    limit?: number;
    clientId?: string;
    type?: string;
  }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.clientId) searchParams.append("clientId", params.clientId)
    if (params?.type) searchParams.append("type", params.type)

    return this.request(`/documents?${searchParams.toString()}`)
  }
}

export const apiClient = new ApiClient()