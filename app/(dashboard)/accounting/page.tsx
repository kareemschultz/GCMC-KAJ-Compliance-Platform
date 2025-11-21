"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, FileText, TrendingUp, Building2, Briefcase } from "lucide-react"
import { api } from "@/lib/api"
import type { FinancialStatement, AuditCase, BankService } from "@/types"
import { FinancialStatementsList } from "@/components/accounting/financial-statements-list"
import { AuditWorkflowList } from "@/components/accounting/audit-workflow-list"
import { BankServicesList } from "@/components/accounting/bank-services-list"
import { CashFlowChart } from "@/components/accounting/cash-flow-chart"

export default function AccountingPage() {
  const [statements, setStatements] = useState<FinancialStatement[]>([])
  const [auditCases, setAuditCases] = useState<AuditCase[]>([])
  const [bankServices, setBankServices] = useState<BankService[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statementsData, auditData, bankData] = await Promise.all([
          api.accounting.getFinancialStatements(),
          api.accounting.getAuditCases(),
          api.accounting.getBankServices(),
        ])
        setStatements(statementsData)
        setAuditCases(auditData)
        setBankServices(bankData)
      } catch (error) {
        console.error("Failed to load accounting data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Accounting & Reports</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Statement
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="statements">Financial Statements</TabsTrigger>
          <TabsTrigger value="audit">Audit Workflow</TabsTrigger>
          <TabsTrigger value="banking">Banking & Loans</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue (YTD)</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$15.2M</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Audits</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{auditCases.filter((c) => c.status !== "CLOSED").length}</div>
                <p className="text-xs text-muted-foreground">
                  {auditCases.filter((c) => c.status === "REVIEW").length} in review
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Loan Apps</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bankServices.filter((s) => s.service === "LOAN_APP" && s.status === "PENDING").length}
                </div>
                <p className="text-xs text-muted-foreground">Across 3 banks</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit Margin</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42.5%</div>
                <p className="text-xs text-muted-foreground">+4% from last quarter</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Cash Flow Projection</CardTitle>
                <CardDescription>Projected cash flow for the next 6 months</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <CashFlowChart />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest accounting updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Mock activity feed */}
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Audit Report Generated</p>
                      <p className="text-sm text-muted-foreground">Georgetown Farmers Co-op</p>
                    </div>
                    <div className="ml-auto font-medium">Just now</div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Loan Application Submitted</p>
                      <p className="text-sm text-muted-foreground">Tech Solutions Ltd (GBTI)</p>
                    </div>
                    <div className="ml-auto font-medium">2h ago</div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">P&L Statement Finalized</p>
                      <p className="text-sm text-muted-foreground">John Doe (2024)</p>
                    </div>
                    <div className="ml-auto font-medium">5h ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="statements" className="space-y-4">
          <FinancialStatementsList data={statements} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <AuditWorkflowList data={auditCases} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="banking" className="space-y-4">
          <BankServicesList data={bankServices} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
