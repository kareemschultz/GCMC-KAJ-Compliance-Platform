"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus, Search, FileText, UserCog } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for employees
const initialEmployees = [
  {
    id: "EMP001",
    name: "Sarah James",
    role: "Senior Accountant",
    nisNumber: "A-1234567",
    tin: "100-234-567",
    salary: 250000,
    status: "Active",
    department: "Finance",
    joinDate: "2023-01-15",
  },
  {
    id: "EMP002",
    name: "Michael Chen",
    role: "IT Specialist",
    nisNumber: "B-9876543",
    tin: "100-876-543",
    salary: 180000,
    status: "Active",
    department: "IT",
    joinDate: "2023-03-10",
  },
  {
    id: "EMP003",
    name: "Jessica Forde",
    role: "HR Manager",
    nisNumber: "C-4567890",
    tin: "100-456-789",
    salary: 300000,
    status: "On Leave",
    department: "Human Resources",
    joinDate: "2022-11-01",
  },
  {
    id: "EMP004",
    name: "David Singh",
    role: "Marketing Lead",
    nisNumber: "D-2345678",
    tin: "100-345-678",
    salary: 220000,
    status: "Active",
    department: "Marketing",
    joinDate: "2023-06-20",
  },
  {
    id: "EMP005",
    name: "Amanda Persaud",
    role: "Admin Assistant",
    nisNumber: "E-3456789",
    tin: "100-567-890",
    salary: 120000,
    status: "Terminated",
    department: "Administration",
    joinDate: "2023-02-01",
  },
]

export function EmployeeRegistry() {
  const [searchTerm, setSearchTerm] = useState("")
  const [employees, setEmployees] = useState(initialEmployees)

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.nisNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base">Employee List</CardTitle>
          <CardDescription>Total: {filteredEmployees.length} employees</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role & Dept</TableHead>
                <TableHead>NIS Number</TableHead>
                <TableHead>TIN</TableHead>
                <TableHead>Salary (GYD)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    <div>{employee.name}</div>
                    <div className="text-xs text-muted-foreground">Joined: {employee.joinDate}</div>
                  </TableCell>
                  <TableCell>
                    <div>{employee.role}</div>
                    <div className="text-xs text-muted-foreground">{employee.department}</div>
                  </TableCell>
                  <TableCell>{employee.nisNumber}</TableCell>
                  <TableCell>{employee.tin}</TableCell>
                  <TableCell>{employee.salary.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        employee.status === "Active"
                          ? "default"
                          : employee.status === "On Leave"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <UserCog className="mr-2 h-4 w-4" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          View Payslips
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
