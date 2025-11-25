"use client"

import * as React from "react"
import { api } from "@/lib/api"
import type { Client } from "@/types"

interface ClientContextType {
  clientId: string | null
  setClientId: (id: string | null) => void
  selectedClient: Client | null
}

const ClientContext = React.createContext<ClientContextType | undefined>(undefined)

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [clientId, setClientId] = React.useState<string | null>(null)
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null)

  React.useEffect(() => {
    if (!clientId) {
      setSelectedClient(null)
      return
    }

    // Fetch client data from API
    api.clients.get(clientId)
      .then(client => setSelectedClient(client))
      .catch(err => {
        console.error("Failed to fetch client:", err)
        setSelectedClient(null)
      })
  }, [clientId])

  return <ClientContext.Provider value={{ clientId, setClientId, selectedClient }}>{children}</ClientContext.Provider>
}

export function useClient() {
  const context = React.useContext(ClientContext)
  if (context === undefined) {
    throw new Error("useClient must be used within a ClientProvider")
  }
  return context
}
