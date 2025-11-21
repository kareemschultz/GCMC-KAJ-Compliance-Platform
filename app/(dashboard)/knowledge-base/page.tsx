import type { Metadata } from "next"
import { ResourceList } from "@/components/knowledge-base/resource-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ExternalLink, Shield, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Knowledge Base | GCMC Platform",
  description: "Internal resources and compliance guides",
}

export default function KnowledgeBasePage() {
  return (
    <div className="flex flex-col space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Knowledge Base</h2>
          <p className="text-muted-foreground">Central repository for forms, guides, and compliance resources</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              GRA Guides
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Official tax guides and policy notes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full" asChild>
              <a href="https://www.gra.gov.gy" target="_blank" rel="noopener noreferrer">
                Visit GRA Website <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Policy
            </CardTitle>
            <CardDescription>Data protection & access control</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-transparent">
              View Security Docs
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Compliance
            </CardTitle>
            <CardDescription>AML & Financial Regulations</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-transparent">
              View Compliance
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Internal SOPs</CardTitle>
            <CardDescription>Firm standard procedures</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-transparent">
              View SOPs
            </Button>
          </CardContent>
        </Card>
      </div>

      <ResourceList />
    </div>
  )
}
