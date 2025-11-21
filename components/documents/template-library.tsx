"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye } from "lucide-react"

const TEMPLATE_CATEGORIES = [
  {
    category: "Affidavits & Declarations",
    templates: [
      { name: "Affidavit of Income", uses: 45, lastUpdated: "2025-01-10" },
      { name: "Affidavit of Support", uses: 32, lastUpdated: "2025-01-08" },
      { name: "Statutory Declaration", uses: 28, lastUpdated: "2024-12-15" },
    ],
  },
  {
    category: "Agreements & Contracts",
    templates: [
      { name: "Agreement of Sale", uses: 67, lastUpdated: "2025-01-12" },
      { name: "Employment Contract", uses: 54, lastUpdated: "2025-01-05" },
      { name: "Partnership Agreement", uses: 23, lastUpdated: "2024-12-20" },
      { name: "Lease Agreement", uses: 41, lastUpdated: "2025-01-03" },
    ],
  },
  {
    category: "Business Documents",
    templates: [
      { name: "Business Proposal", uses: 38, lastUpdated: "2025-01-11" },
      { name: "Memorandum of Understanding", uses: 19, lastUpdated: "2024-12-28" },
      { name: "Board Resolution", uses: 15, lastUpdated: "2024-12-22" },
    ],
  },
  {
    category: "Estate Planning",
    templates: [
      { name: "Will & Testament", uses: 12, lastUpdated: "2025-01-09" },
      { name: "Power of Attorney", uses: 18, lastUpdated: "2025-01-07" },
    ],
  },
]

export function TemplateLibrary() {
  return (
    <div className="space-y-6">
      {TEMPLATE_CATEGORIES.map((category) => (
        <Card key={category.category}>
          <CardHeader>
            <CardTitle className="text-lg">{category.category}</CardTitle>
            <CardDescription>{category.templates.length} templates available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {category.templates.map((template) => (
                <div
                  key={template.name}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Used {template.uses} times • Updated {template.lastUpdated}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm">Use Template</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
