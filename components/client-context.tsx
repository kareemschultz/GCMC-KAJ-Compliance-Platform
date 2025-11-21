"use client"

import * as React from "react"
import { mockClients } from "@/lib/mock-data"
import type { Client } from "@/types"

interface ClientContextType {
  clientId: string | null
  setClientId: (id: string | null) => void
  selectedClient: Client | null
}

const ClientContext = React.createContext<ClientContextType | undefined>(undefined)

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [clientId, setClientId] = React.useState<string | null>(null)

  const selectedClient = React.useMemo(() => {
    if (!clientId) return null
    return mockClients.find((c) => c.id === clientId) || null
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
