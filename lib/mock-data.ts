import type {
  Client,
  TaxReturn,
  NISSchedule,
  VisaApplication,
  Partner,
  TrainingSession,
  FinancialStatement,
  AuditCase,
  BankService,
  Property,
  ExpediteJob,
} from "@/types"

export const mockClients: Client[] = [
  {
    id: "1",
    name: "John Doe",
    type: "Individual",
    tin: "123456789",
    nisNumber: "A1234567",
    email: "john@example.com",
    phone: "555-0101",
    complianceScore: 95,
    documentsCount: 5,
    lastActivity: "2025-01-15T10:00:00Z",
    status: "Active",
    initials: "JD",
  },
  {
    id: "2",
    name: "Tech Solutions Ltd",
    type: "Company",
    tin: "987654321",
    email: "contact@techsolutions.gy",
    phone: "555-0102",
    complianceScore: 88,
    documentsCount: 12,
    lastActivity: "2025-01-14T14:30:00Z",
    status: "Active",
    initials: "TS",
  },
]

export const mockTaxReturns: TaxReturn[] = [
  {
    id: "1",
    filingType: "VAT",
    period: "2024-12",
    status: "SUBMITTED",
    amountDue: 45000,
    filingDate: "2025-01-15T10:00:00Z",
    clientId: "2",
  },
  {
    id: "2",
    filingType: "PAYE",
    period: "2024-12",
    status: "PENDING",
    amountDue: 125000,
    clientId: "2",
  },
]

export const mockNISSchedules: NISSchedule[] = [
  {
    id: "1",
    month: "December 2024",
    totalWages: 500000,
    employeeDed: 28000,
    employerCont: 42000,
    totalRemit: 70000,
    status: "FILED",
    clientId: "2",
  },
]

export const mockVisaApplications: VisaApplication[] = [
  {
    id: "1",
    applicantName: "Maria Rodriguez",
    permitType: "WORK_PERMIT",
    expiryDate: "2025-02-15T00:00:00Z", // Expiring soon (< 30 days from now)
    status: "APPROVED",
    clientId: "2",
  },
  {
    id: "2",
    applicantName: "Chen Wei",
    permitType: "BUSINESS_VISA",
    expiryDate: "2025-06-20T00:00:00Z",
    status: "UNDER_REVIEW",
    clientId: "2",
  },
]

export const mockPartners: Partner[] = [
  {
    id: "1",
    companyName: "Guyana Legal Services",
    category: "LAW_FIRM",
    contactPerson: "Sarah James",
    phone: "555-1111",
    email: "info@guyanaleal.gy",
    verified: true,
  },
  {
    id: "2",
    companyName: "Georgetown Realty",
    category: "REAL_ESTATE",
    contactPerson: "Mike Brown",
    phone: "555-2222",
    email: "sales@gtrealty.gy",
    verified: true,
  },
  {
    id: "3",
    companyName: "TechPro Systems",
    category: "IT_TECHNICIAN",
    contactPerson: "David Lee",
    phone: "555-3333",
    email: "support@techpro.gy",
    verified: false,
  },
]

export const mockTrainingSessions: TrainingSession[] = [
  {
    id: "1",
    title: "Customer Relations Workshop",
    date: "2025-02-10T09:00:00Z",
    capacity: 20,
    price: 15000,
    attendees: [],
  },
  {
    id: "2",
    title: "HR Management Essentials",
    date: "2025-02-25T13:00:00Z",
    capacity: 15,
    price: 20000,
    attendees: [],
  },
]

// Added Accounting Mock Data
export const mockFinancialStatements: FinancialStatement[] = [
  {
    id: "1",
    clientId: "2",
    type: "INCOME_STATEMENT",
    period: "2024",
    data: {
      revenue: 15000000,
      expenses: 8500000,
      netProfit: 6500000,
    },
    createdAt: "2025-01-10T10:00:00Z",
  },
]

export const mockAuditCases: AuditCase[] = [
  {
    id: "1",
    entityName: "Georgetown Farmers Co-op",
    entityType: "CO_OP",
    status: "REVIEW",
    assignedAuditor: "Jane Smith",
    dueDate: "2025-03-15T00:00:00Z",
    progress: 65,
  },
  {
    id: "2",
    entityName: "Youth Empowerment NGO",
    entityType: "NGO",
    status: "OPEN",
    assignedAuditor: "John Doe",
    dueDate: "2025-04-01T00:00:00Z",
    progress: 15,
  },
]

export const mockBankServices: BankService[] = [
  {
    id: "1",
    clientName: "John Doe",
    service: "ACCOUNT_OPENING",
    bankName: "Republic Bank",
    status: "IN_PROGRESS",
    submittedDate: "2025-01-20T10:00:00Z",
    lastUpdate: "2025-01-22T14:00:00Z",
  },
  {
    id: "2",
    clientName: "Tech Solutions Ltd",
    service: "LOAN_APP",
    bankName: "GBTI",
    status: "PENDING",
    submittedDate: "2025-01-25T09:00:00Z",
    lastUpdate: "2025-01-25T09:00:00Z",
  },
]

export const mockProperties: Property[] = [
  {
    id: "prop_001",
    address: "Lot 239 Pike Street, Kitty, Georgetown",
    type: "Commercial",
    ownerId: "client_55",
    status: "Occupied",
    managementFeePercentage: 10,
    tenant: {
      id: "ten_102",
      name: "Karetech Solutions",
      contactEmail: "info@karetechsolutions.com",
      contactPhone: "(592)-626-2383",
    },
    leaseDetails: {
      startDate: "2024-01-01",
      endDate: "2025-12-31",
      monthlyRentGyd: 150000,
      paymentDueDay: 5,
      securityDepositGyd: 300000,
      leaseDocUrl: "/documents/leases/lease_239_pike.pdf",
    },
    financials: {
      nextRentDue: "2025-12-05",
      managementFeeGyd: 15000,
      totalRevenueYtdGyd: 1650000,
      arrearsGyd: 0,
    },
  },
  {
    id: "prop_002",
    address: "180 Charlotte Street, Lacytown, Georgetown",
    type: "Residential",
    ownerId: "client_89",
    status: "Vacant",
    managementFeePercentage: 8,
    tenant: null,
    leaseDetails: null,
    financials: {
      nextRentDue: null,
      managementFeeGyd: 0,
      totalRevenueYtdGyd: 0,
      arrearsGyd: 0,
    },
  },
  {
    id: "prop_003",
    address: "45 Main Street, New Amsterdam, Berbice",
    type: "Commercial",
    ownerId: "client_12",
    status: "Occupied",
    managementFeePercentage: 10,
    tenant: {
      id: "ten_105",
      name: "Berbice Logistics Inc.",
      contactEmail: "accounts@berbicelogistics.gy",
      contactPhone: "(592)-333-1234",
    },
    leaseDetails: {
      startDate: "2023-06-01",
      endDate: "2025-06-01",
      monthlyRentGyd: 200000,
      paymentDueDay: 1,
      securityDepositGyd: 400000,
      leaseDocUrl: "/documents/leases/lease_45_main.pdf",
    },
    financials: {
      nextRentDue: "2025-06-01",
      managementFeeGyd: 20000,
      totalRevenueYtdGyd: 1000000,
      arrearsGyd: 200000,
    },
  },
]

export const mockExpediteJobs: ExpediteJob[] = [
  {
    id: "exp_001",
    clientId: "1",
    clientName: "John Doe",
    documentType: "Business Registration",
    agencyName: "Deeds Registry",
    referenceNumber: "DR-2025-0234",
    assignedRunner: "Mike Johnson",
    expectedCompletion: "2025-02-15",
    status: "AT_AGENCY",
    statusHistory: [
      {
        status: "PICKED_UP",
        timestamp: "2025-01-20T09:00:00Z",
        notes: "Documents collected from client",
      },
      {
        status: "AT_AGENCY",
        timestamp: "2025-01-20T10:30:00Z",
        notes: "Dropped at Deeds Registry front desk",
      },
    ],
  },
  {
    id: "exp_002",
    clientId: "2",
    clientName: "Tech Solutions Ltd",
    documentType: "Tax Clearance Certificate",
    agencyName: "GRA",
    referenceNumber: "GRA-TCC-8823",
    assignedRunner: "Sarah Williams",
    expectedCompletion: "2025-02-10",
    status: "PROCESSING",
    statusHistory: [
      {
        status: "PICKED_UP",
        timestamp: "2025-01-18T11:00:00Z",
      },
      {
        status: "AT_AGENCY",
        timestamp: "2025-01-18T14:00:00Z",
      },
      {
        status: "PROCESSING",
        timestamp: "2025-01-22T09:00:00Z",
        notes: "Under review by GRA officer",
      },
    ],
  },
]
