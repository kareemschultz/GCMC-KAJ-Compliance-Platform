export interface DropdownOption {
  value: string
  label: string
  description?: string
  color?: string
  icon?: string
  metadata?: Record<string, any>
}

export interface RoleOption extends DropdownOption {
  permissions: string[]
  level: number
}

export interface DepartmentOption extends DropdownOption {
  manager: string
  color: string
}

export const DROPDOWN_DATA = {
  // Enhanced client types with descriptions
  clientTypes: [
    {
      value: "COMPANY",
      label: "Company",
      description: "Incorporated business entity (Ltd, Inc, Corp)",
      icon: "Building2"
    },
    {
      value: "INDIVIDUAL",
      label: "Individual",
      description: "Personal client or sole proprietor",
      icon: "User"
    },
    {
      value: "PARTNERSHIP",
      label: "Partnership",
      description: "Business partnership or joint venture",
      icon: "Users"
    },
    {
      value: "SOLE_TRADER",
      label: "Sole Trader",
      description: "Unincorporated business owner",
      icon: "UserCheck"
    },
    {
      value: "NGO",
      label: "NGO/Non-Profit",
      description: "Non-governmental or charitable organization",
      icon: "Heart"
    },
  ] as DropdownOption[],

  // Enhanced departments with management info
  departments: [
    {
      value: "finance",
      label: "Finance & Accounting",
      description: "Financial services and accounting",
      manager: "john@gcmc.gy",
      color: "green"
    },
    {
      value: "compliance",
      label: "Compliance & Legal",
      description: "Regulatory compliance and legal affairs",
      manager: "legal@gcmc.gy",
      color: "blue"
    },
    {
      value: "hr",
      label: "Human Resources",
      description: "Employee management and recruitment",
      manager: "sarah@gcmc.gy",
      color: "purple"
    },
    {
      value: "it",
      label: "IT & Technology",
      description: "Information technology and systems",
      manager: "tech@gcmc.gy",
      color: "indigo"
    },
    {
      value: "operations",
      label: "Operations",
      description: "Business operations and client services",
      manager: "ops@gcmc.gy",
      color: "orange"
    },
    {
      value: "advisory",
      label: "Advisory Services",
      description: "Business advisory and consulting",
      manager: "advisory@gcmc.gy",
      color: "teal"
    },
  ] as DepartmentOption[],

  // Enhanced compliance statuses
  complianceStatuses: [
    {
      value: "excellent",
      label: "Excellent",
      description: "90-100% compliance rate",
      color: "green",
      metadata: { range: "90-100%", level: 4 }
    },
    {
      value: "good",
      label: "Good",
      description: "70-89% compliance rate",
      color: "blue",
      metadata: { range: "70-89%", level: 3 }
    },
    {
      value: "fair",
      label: "Fair",
      description: "50-69% compliance rate",
      color: "yellow",
      metadata: { range: "50-69%", level: 2 }
    },
    {
      value: "poor",
      label: "Poor",
      description: "Below 50% compliance rate",
      color: "red",
      metadata: { range: "Below 50%", level: 1 }
    },
  ] as DropdownOption[],

  // Enhanced user roles with permissions
  userRoles: [
    {
      value: "Admin",
      label: "System Administrator",
      description: "Full system access and management",
      permissions: ["all"],
      level: 5,
      color: "red"
    },
    {
      value: "Manager",
      label: "Department Manager",
      description: "Department oversight and staff management",
      permissions: ["manage_staff", "approve_requests", "view_reports"],
      level: 4,
      color: "purple"
    },
    {
      value: "Senior Compliance Officer",
      label: "Senior Compliance Officer",
      description: "Advanced compliance and filing management",
      permissions: ["compliance", "filings", "clients", "approve_filings"],
      level: 4,
      color: "blue"
    },
    {
      value: "Compliance Officer",
      label: "Compliance Officer",
      description: "Compliance and filing management",
      permissions: ["compliance", "filings", "clients"],
      level: 3,
      color: "blue"
    },
    {
      value: "Senior Accountant",
      label: "Senior Accountant",
      description: "Advanced financial services and oversight",
      permissions: ["accounting", "filings", "clients", "approve_accounts"],
      level: 4,
      color: "green"
    },
    {
      value: "Accountant",
      label: "Accountant",
      description: "Financial services and accounting",
      permissions: ["accounting", "filings", "clients"],
      level: 3,
      color: "green"
    },
    {
      value: "Staff",
      label: "Staff Member",
      description: "Basic client management and document handling",
      permissions: ["clients", "documents"],
      level: 2,
      color: "gray"
    },
    {
      value: "Client",
      label: "Client User",
      description: "Client portal access only",
      permissions: ["view_own_data"],
      level: 1,
      color: "orange"
    },
  ] as RoleOption[],

  // Guyana-specific regions and areas
  regions: [
    { value: "region-1", label: "Region 1 (Barima-Waini)", description: "Mabaruma, Port Kaituma" },
    { value: "region-2", label: "Region 2 (Pomeroon-Supenaam)", description: "Anna Regina, Charity" },
    { value: "region-3", label: "Region 3 (Essequibo Islands-West Demerara)", description: "Parika, Vreed-en-Hoop" },
    { value: "region-4", label: "Region 4 (Demerara-Mahaica)", description: "Georgetown, Diamond, Timehri" },
    { value: "region-5", label: "Region 5 (Mahaica-Berbice)", description: "Fort Wellington, Rosignol" },
    { value: "region-6", label: "Region 6 (East Berbice-Corentyne)", description: "New Amsterdam, Rose Hall" },
    { value: "region-7", label: "Region 7 (Cuyuni-Mazaruni)", description: "Bartica, Mahdia" },
    { value: "region-8", label: "Region 8 (Potaro-Siparuni)", description: "Mahdia, Kanashen" },
    { value: "region-9", label: "Region 9 (Upper Takutu-Upper Essequibo)", description: "Lethem, Annai" },
    { value: "region-10", label: "Region 10 (Upper Demerara-Berbice)", description: "Linden, Kwakwani" },
  ] as DropdownOption[],

  // ID document types with validation patterns
  idTypes: [
    {
      value: "National ID",
      label: "National ID Card",
      description: "Guyanese National ID Card",
      metadata: {
        pattern: /^\d{9}$/,
        example: "144123456",
        validation: "9-digit number"
      }
    },
    {
      value: "Birth Certificate",
      label: "Birth Certificate",
      description: "Official birth certificate",
      metadata: {
        pattern: /^[A-Z]{2}\d{6,8}$/,
        example: "BC123456",
        validation: "2 letters followed by 6-8 digits"
      }
    },
    {
      value: "Driver's License",
      label: "Driver's License",
      description: "Valid driver's license",
      metadata: {
        pattern: /^DL\d{6}$/,
        example: "DL123456",
        validation: "DL followed by 6 digits"
      }
    },
    {
      value: "Passport",
      label: "Passport",
      description: "Guyanese or foreign passport",
      metadata: {
        pattern: /^[A-Z]\d{7}$/,
        example: "R0712345",
        validation: "1 letter followed by 7 digits"
      }
    },
    {
      value: "Voter ID",
      label: "Voter Registration ID",
      description: "Voter registration card",
      metadata: {
        pattern: /^V\d{6}$/,
        example: "V123456",
        validation: "V followed by 6 digits"
      }
    },
    {
      value: "Other",
      label: "Other Government ID",
      description: "Other government-issued identification"
    },
  ] as DropdownOption[],

  // Tax periods and frequencies
  taxPeriods: [
    { value: "monthly", label: "Monthly", description: "Monthly filing requirement" },
    { value: "quarterly", label: "Quarterly", description: "Quarterly filing (Q1, Q2, Q3, Q4)" },
    { value: "annually", label: "Annually", description: "Annual filing requirement" },
    { value: "biannual", label: "Bi-Annual", description: "Twice yearly filing" },
  ] as DropdownOption[],

  // Service categories for better organization
  serviceCategories: [
    {
      value: "tax-compliance",
      label: "Tax Compliance",
      description: "Tax filing and compliance services",
      color: "blue"
    },
    {
      value: "legal-compliance",
      label: "Legal Compliance",
      description: "Legal and regulatory compliance",
      color: "purple"
    },
    {
      value: "business-services",
      label: "Business Services",
      description: "Business registration and incorporation",
      color: "green"
    },
    {
      value: "government-liaison",
      label: "Government Liaison",
      description: "Government relations and liaison services",
      color: "orange"
    },
    {
      value: "advisory",
      label: "Advisory Services",
      description: "Business advisory and consulting",
      color: "teal"
    },
  ] as DropdownOption[],

  // Priority levels
  priorities: [
    { value: "urgent", label: "Urgent", description: "Requires immediate attention", color: "red" },
    { value: "high", label: "High", description: "High priority task", color: "orange" },
    { value: "medium", label: "Medium", description: "Standard priority", color: "yellow" },
    { value: "low", label: "Low", description: "Low priority task", color: "green" },
  ] as DropdownOption[],

  // File/document types
  documentTypes: [
    { value: "identity", label: "Identity Document", description: "ID cards, passports, etc." },
    { value: "financial", label: "Financial Statement", description: "Bank statements, financial reports" },
    { value: "legal", label: "Legal Document", description: "Contracts, agreements, certificates" },
    { value: "tax", label: "Tax Document", description: "Tax returns, receipts, invoices" },
    { value: "regulatory", label: "Regulatory Filing", description: "Government forms and filings" },
    { value: "other", label: "Other", description: "Miscellaneous documents" },
  ] as DropdownOption[],
} as const

// Utility functions for working with dropdown data
export const getDropdownOption = (category: keyof typeof DROPDOWN_DATA, value: string): DropdownOption | undefined => {
  const options = DROPDOWN_DATA[category] as DropdownOption[]
  return options.find(option => option.value === value)
}

export const getDropdownOptions = (category: keyof typeof DROPDOWN_DATA): DropdownOption[] => {
  return DROPDOWN_DATA[category] as DropdownOption[]
}

export const getOptionsByPermission = (permission: string): RoleOption[] => {
  return DROPDOWN_DATA.userRoles.filter(role =>
    role.permissions.includes(permission) || role.permissions.includes("all")
  )
}

export const getRolesByLevel = (minLevel: number): RoleOption[] => {
  return DROPDOWN_DATA.userRoles.filter(role => role.level >= minLevel)
}

// Validation helpers
export const validateIdNumber = (type: string, number: string): boolean => {
  const idType = DROPDOWN_DATA.idTypes.find(t => t.value === type)
  if (!idType?.metadata?.pattern) return true
  return idType.metadata.pattern.test(number)
}

export const getIdValidationExample = (type: string): string => {
  const idType = DROPDOWN_DATA.idTypes.find(t => t.value === type)
  return idType?.metadata?.example || ""
}

export const getIdValidationMessage = (type: string): string => {
  const idType = DROPDOWN_DATA.idTypes.find(t => t.value === type)
  return idType?.metadata?.validation || "Please enter a valid ID number"
}