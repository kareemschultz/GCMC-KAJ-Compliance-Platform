"use client"

import { useState } from "react"
import { FileText, Download, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AddResourceModal } from "@/components/knowledge-base/add-resource-modal"

const INITIAL_RESOURCES = [
  {
    category: "GRA (Revenue Authority)",
    items: [
      { name: "Form 5 - PAYE Return", type: "PDF", size: "1.2 MB", updated: "2025-01-15" },
      { name: "Form 2 - Income Tax Return", type: "PDF", size: "2.4 MB", updated: "2025-01-10" },
      { name: "VAT Return Form (VAT-3)", type: "PDF", size: "850 KB", updated: "2024-12-01" },
      { name: "TIN Application (Individual)", type: "PDF", size: "1.1 MB", updated: "2024-11-20" },
      { name: "2025 GRA Tax Rate Schedule", type: "PDF", size: "1.8 MB", updated: "2025-01-05" },
    ],
  },
  {
    category: "NIS (National Insurance)",
    items: [
      { name: "Form C100F72 - Employer Compliance", type: "PDF", size: "1.5 MB", updated: "2024-10-05" },
      { name: "Form C100F72A - Self-Employed Compliance", type: "PDF", size: "1.4 MB", updated: "2024-10-05" },
      { name: "Contribution Schedule Template", type: "XLSX", size: "45 KB", updated: "2024-09-15" },
    ],
  },
  {
    category: "DCRA (Commercial Registry)",
    items: [
      { name: "Business Name Registration Form", type: "PDF", size: "2.1 MB", updated: "2024-08-20" },
      { name: "Notice of Change of Address", type: "PDF", size: "900 KB", updated: "2024-06-12" },
      { name: "Annual Return Form", type: "PDF", size: "1.8 MB", updated: "2024-05-30" },
    ],
  },
  {
    category: "System Documentation",
    items: [
      { name: "Data Protection & Encryption Policy", type: "PDF", size: "3.2 MB", updated: "2025-02-01" },
      { name: "Role-Based Access Control Guide", type: "PDF", size: "1.5 MB", updated: "2025-01-20" },
      { name: "Audit Trail & Activity Logging SOP", type: "PDF", size: "2.1 MB", updated: "2025-01-25" },
      { name: "GDPR & Data Privacy Controls", type: "PDF", size: "2.8 MB", updated: "2025-02-10" },
    ],
  },
  {
    category: "Compliance Manuals",
    items: [
      { name: "BOG Financial Compliance Manual", type: "PDF", size: "5.4 MB", updated: "2024-12-15" },
      { name: "Anti-Money Laundering (AML) Guidelines", type: "PDF", size: "4.1 MB", updated: "2024-11-30" },
    ],
  },
]

export function ResourceList() {
  const [resources, setResources] = useState(INITIAL_RESOURCES)
  const [searchQuery, setSearchQuery] = useState("")

  const handleAddResource = ({ category, item }: { category: string; item: any }) => {
    setResources((prev) => {
      const categoryExists = prev.find((r) => r.category === category)
      if (categoryExists) {
        return prev.map((r) => (r.category === category ? { ...r, items: [item, ...r.items] } : r))
      } else {
        return [...prev, { category, items: [item] }]
      }
    })
  }

  const filteredResources = resources
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())),
    }))
    .filter((section) => section.items.length > 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <AddResourceModal onAdd={handleAddResource} />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {filteredResources.map((section) => (
          <Card key={section.category} className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">{section.category}</CardTitle>
              <CardDescription>Official forms and templates</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {section.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="grid gap-0.5">
                      <p className="text-sm font-medium leading-none">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.updated} • {item.size}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
