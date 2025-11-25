"use client"

import * as React from "react"
import { ClientTable } from "@/components/clients/client-table"
import { ClientFilters } from "@/components/clients/client-filters"
import { NewClientWizard } from "@/components/clients/new-client-wizard"
import { useToast } from "@/components/ui/use-toast"

interface Client {
  id: string
  name: string
  type: string
  email: string
  phone: string
  tin: string
  status: string
  compliance: number
  documents: number
  lastActivity: string
  createdAt: string
}

export default function ClientsPage() {
  const [clients, setClients] = React.useState<Client[]>([])
  const [loading, setLoading] = React.useState(true)
  const [filteredClients, setFilteredClients] = React.useState<Client[]>([])

  // Filter states
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedType, setSelectedType] = React.useState("")
  const [selectedStatus, setSelectedStatus] = React.useState("")
  const [selectedStaff, setSelectedStaff] = React.useState<string[]>([])
  const [selectedDepartment, setSelectedDepartment] = React.useState("")
  const [selectedRegion, setSelectedRegion] = React.useState("")

  const { toast } = useToast()

  // Fetch clients from API
  const fetchClients = React.useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/clients')

      if (!response.ok) {
        throw new Error('Failed to fetch clients')
      }

      const data = await response.json()
      setClients(data.clients || [])
    } catch (error) {
      console.error('Error fetching clients:', error)
      toast({
        title: "Error",
        description: "Failed to load clients. Please try again.",
        variant: "destructive",
      })

      // Fallback to mock data if API fails
      setClients([
        {
          id: "1",
          name: "ABC Corporation Ltd",
          type: "Company",
          email: "info@abccorp.gy",
          phone: "+592-123-4567",
          tin: "123-456-789",
          status: "Active",
          compliance: 85,
          documents: 24,
          lastActivity: "2 hours ago",
          createdAt: "2024-01-15"
        },
        {
          id: "2",
          name: "John Smith",
          type: "Individual",
          email: "john.smith@example.com",
          phone: "+592-987-6543",
          tin: "987-654-321",
          status: "Active",
          compliance: 92,
          documents: 12,
          lastActivity: "1 day ago",
          createdAt: "2024-01-10"
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Filter clients based on search and filter criteria
  React.useEffect(() => {
    let filtered = [...clients]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.tin.includes(query) ||
        client.phone.includes(query)
      )
    }

    // Type filter
    if (selectedType) {
      filtered = filtered.filter(client => client.type === selectedType)
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(client => client.status === selectedStatus)
    }

    setFilteredClients(filtered)
  }, [clients, searchQuery, selectedType, selectedStatus, selectedStaff, selectedDepartment, selectedRegion])

  // Load clients on mount
  React.useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedType("")
    setSelectedStatus("")
    setSelectedStaff([])
    setSelectedDepartment("")
    setSelectedRegion("")
  }

  const handleClientCreated = (newClient: Client) => {
    console.log("handleClientCreated called with:", newClient)
    setClients(prev => [newClient, ...prev])
    toast({
      title: "Success",
      description: `Client "${newClient.name}" created successfully.`,
    })

    // Also refetch data from the server to ensure consistency
    setTimeout(() => {
      fetchClients()
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight" data-testid="clients-page-title">Clients</h1>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {filteredClients.length}
          </span>
        </div>
        <NewClientWizard onClientCreated={handleClientCreated} />
      </div>

      <div className="flex flex-col gap-4">
        <ClientFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedStaff={selectedStaff}
          onStaffChange={setSelectedStaff}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          onClearFilters={handleClearFilters}
        />
        <ClientTable
          clients={filteredClients}
          loading={loading}
          onRefresh={fetchClients}
        />
      </div>
    </div>
  )
}
