import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NISScheduleTable } from "@/components/dashboard/nis-schedule-table"
import { NISComplianceForm } from "@/components/filings/nis-compliance-form"
import { EmployeeRegistry } from "@/components/dashboard/employee-registry"
import { PayrollCalculator } from "@/components/dashboard/payroll-calculator"
import { Tax7BCalculator } from "@/components/dashboard/tax-7b-calculator"
import { Button } from "@/components/ui/button"
import { Download, Upload } from "lucide-react"

export default function NISPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">NIS & Payroll</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Data
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="schedules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedules">Monthly Schedules</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Calculator</TabsTrigger>
          <TabsTrigger value="employees">Employee Registry</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Form</TabsTrigger>
        </TabsList>

        <TabsContent value="schedules" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$124,500</div>
                <p className="text-xs text-muted-foreground">+2.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">+2 new this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Schedules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">Due in 5 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">100%</div>
                <p className="text-xs text-muted-foreground">Last 12 months</p>
              </CardContent>
            </Card>
          </div>
          <NISScheduleTable />
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Payroll & Tax Tools</h3>
                <p className="text-sm text-muted-foreground">
                  Calculate PAYE, NIS, and estimate GRA Form 7B liability.
                </p>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Standard Payroll</h4>
                <PayrollCalculator />
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">GRA Form 7B Estimator</h4>
                <Tax7BCalculator />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <EmployeeRegistry />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NIS Compliance Certificate Application</CardTitle>
              <CardDescription>Generate and submit your compliance application form directly to NIS.</CardDescription>
            </CardHeader>
            <CardContent>
              <NISComplianceForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
