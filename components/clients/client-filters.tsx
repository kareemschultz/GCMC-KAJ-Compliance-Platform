"use client"

import * as React from "react"
import { Search, X, Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { DROPDOWN_DATA } from "@/lib/dropdown-data"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ClientFiltersProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  selectedType?: string
  onTypeChange?: (type: string) => void
  selectedStatus?: string
  onStatusChange?: (status: string) => void
  selectedStaff?: string[]
  onStaffChange?: (staff: string[]) => void
  selectedDepartment?: string
  onDepartmentChange?: (department: string) => void
  selectedRegion?: string
  onRegionChange?: (region: string) => void
  onClearFilters?: () => void
  showAdvanced?: boolean
}

export function ClientFilters({
  searchQuery = "",
  onSearchChange,
  selectedType = "",
  onTypeChange,
  selectedStatus = "",
  onStatusChange,
  selectedStaff = [],
  onStaffChange,
  selectedDepartment = "",
  onDepartmentChange,
  selectedRegion = "",
  onRegionChange,
  onClearFilters,
  showAdvanced = true,
}: ClientFiltersProps) {
  const [localSearch, setLocalSearch] = React.useState(searchQuery)
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false)

  // Debounced search
  const searchTimeoutRef = React.useRef<NodeJS.Timeout>()

  const handleSearchChange = (value: string) => {
    setLocalSearch(value)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      onSearchChange?.(value)
    }, 300)
  }

  // Mock staff data - in real implementation, this would come from API
  const staffOptions = React.useMemo(() => [
    { value: "john-doe", label: "John Doe", description: "Senior Compliance Officer", metadata: { department: "compliance" }},
    { value: "sarah-smith", label: "Sarah Smith", description: "Senior Accountant", metadata: { department: "finance" }},
    { value: "mike-brown", label: "Mike Brown", description: "Compliance Officer", metadata: { department: "compliance" }},
    { value: "jane-wilson", label: "Jane Wilson", description: "Accountant", metadata: { department: "finance" }},
    { value: "alex-johnson", label: "Alex Johnson", description: "Advisory Specialist", metadata: { department: "advisory" }},
  ], [])

  // Enhanced client type options
  const clientTypeOptions = [
    { value: "", label: "All Types", description: "Show all client types" },
    ...DROPDOWN_DATA.clientTypes
  ]

  // Enhanced status options with colors
  const statusOptions = [
    { value: "", label: "All Statuses", description: "Show all compliance statuses" },
    ...DROPDOWN_DATA.complianceStatuses
  ]

  const departmentOptions = [
    { value: "", label: "All Departments", description: "Show all departments" },
    ...DROPDOWN_DATA.departments
  ]

  const regionOptions = [
    { value: "", label: "All Regions", description: "Show all regions" },
    ...DROPDOWN_DATA.regions
  ]

  // Count active filters
  const activeFiltersCount = [
    selectedType,
    selectedStatus,
    selectedDepartment,
    selectedRegion,
    ...(selectedStaff || [])
  ].filter(Boolean).length + (searchQuery ? 1 : 0)

  const handleClearAll = () => {
    setLocalSearch("")
    onSearchChange?.("")
    onTypeChange?.("")
    onStatusChange?.("")
    onDepartmentChange?.("")
    onRegionChange?.("")
    onStaffChange?.([])
    onClearFilters?.()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-4 rounded-lg border">
        {/* Main filter row */}
        <div className="flex flex-1 items-center gap-2">
          {/* Search input */}
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients by name, email, or TIN..."
              className="pl-8"
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          {/* Client Type Filter */}
          <SearchableSelect
            options={clientTypeOptions}
            value={selectedType}
            onValueChange={(value) => onTypeChange?.(value)}
            placeholder="Client Type"
            showDescriptions={false}
            className="w-[140px]"
            clearable={true}
          />

          {/* Compliance Status Filter */}
          <SearchableSelect
            options={statusOptions}
            value={selectedStatus}
            onValueChange={(value) => onStatusChange?.(value)}
            placeholder="Status"
            showDescriptions={false}
            showColors={true}
            className="w-[130px]"
            clearable={true}
          />

          {/* Advanced Filters Toggle */}
          {showAdvanced && (
            <Popover open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="h-4 w-4 mr-1" />
                  More
                  {activeFiltersCount > 2 && (
                    <Badge variant="secondary" className="ml-2 h-4 text-xs">
                      {activeFiltersCount - 2}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium">Advanced Filters</h4>

                  {/* Department Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <SearchableSelect
                      options={departmentOptions}
                      value={selectedDepartment}
                      onValueChange={(value) => onDepartmentChange?.(value)}
                      placeholder="All Departments"
                      showDescriptions={false}
                      className="w-full"
                      clearable={true}
                    />
                  </div>

                  {/* Region Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Region</label>
                    <SearchableSelect
                      options={regionOptions}
                      value={selectedRegion}
                      onValueChange={(value) => onRegionChange?.(value)}
                      placeholder="All Regions"
                      showDescriptions={false}
                      className="w-full"
                      clearable={true}
                    />
                  </div>

                  {/* Assigned Staff Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assigned Staff</label>
                    <SearchableSelect
                      options={staffOptions}
                      value={selectedStaff}
                      onValueChange={(value) => onStaffChange?.(Array.isArray(value) ? value : [])}
                      placeholder="Any Staff Member"
                      showDescriptions={true}
                      className="w-full"
                      multiple={true}
                      maxSelected={3}
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAdvancedFilters(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Clear filters and active filters count */}
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <>
              <Badge variant="outline" className="font-normal">
                {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleClearAll}
              >
                <X className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Active filter badges */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: "{searchQuery}"
              <button
                onClick={() => {
                  setLocalSearch("")
                  onSearchChange?.("")
                }}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {selectedType && (
            <Badge variant="secondary" className="gap-1">
              Type: {clientTypeOptions.find(opt => opt.value === selectedType)?.label}
              <button
                onClick={() => onTypeChange?.("")}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {selectedStatus && (
            <Badge variant="secondary" className="gap-1">
              Status: {statusOptions.find(opt => opt.value === selectedStatus)?.label}
              <button
                onClick={() => onStatusChange?.("")}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {selectedDepartment && (
            <Badge variant="secondary" className="gap-1">
              Dept: {departmentOptions.find(opt => opt.value === selectedDepartment)?.label}
              <button
                onClick={() => onDepartmentChange?.("")}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {selectedRegion && (
            <Badge variant="secondary" className="gap-1">
              Region: {regionOptions.find(opt => opt.value === selectedRegion)?.label}
              <button
                onClick={() => onRegionChange?.("")}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {selectedStaff && selectedStaff.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              Staff: {selectedStaff.length} selected
              <button
                onClick={() => onStaffChange?.([])}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
