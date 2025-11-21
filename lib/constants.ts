export const SERVICE_CATALOG = [
  // GCMC Services
  {
    category: "GCMC",
    subcategory: "Trainings",
    items: [
      "Human Resource Management",
      "Customer Relations",
      "Co-operatives and Credit Unions",
      "Organisational Management",
    ],
  },
  {
    category: "GCMC",
    subcategory: "Consultancy on Small Business Development",
    items: ["Incorporation of Companies", "Business Registration"],
  },
  {
    category: "GCMC",
    subcategory: "Paralegal Services",
    items: [
      "Affidavits",
      "Agreement of Sales and Purchases",
      "Wills",
      "Settlement Agreement",
      "Separation Agreement",
      "Investment & Partnership Agreement",
    ],
  },
  {
    category: "GCMC",
    subcategory: "Immigration",
    items: ["Work Permits", "Citizenship", "Business Visa"],
  },
  {
    category: "GCMC",
    subcategory: "Business Proposals",
    items: ["Land Occupation", "Investment", "Start Ups"],
  },
  {
    category: "GCMC",
    subcategory: "Networking",
    items: ["Real Estate Agencies", "IT Technician", "Law Firms"],
  },
  // KAJ Financial Services
  {
    category: "KAJ",
    subcategory: "GRA License to Practice",
    items: [
      "Income Tax Returns",
      "PAYE Returns",
      "Corporation Tax Returns",
      "Property Tax Returns",
      "Capital Gains Tax",
      "Tender Compliance",
      "Work Permit Compliance",
      "Land Transfer Compliance",
      "Liability Compliance (Firearm, etc.)",
      "Pension Compliance",
      "Certificate of Assessments",
      "Excise Tax Returns",
    ],
  },
  {
    category: "KAJ",
    subcategory: "Financial Statements",
    items: [
      "Bank Account Statements",
      "Commissioner of Police – Firearm Statement",
      "Loan Application Statements",
      "Investment Statements",
      "Cash Flow Projection",
    ],
  },
  {
    category: "KAJ",
    subcategory: "Audit",
    items: ["Audit of NGO & Co-operative Societies"],
  },
  {
    category: "KAJ",
    subcategory: "National Insurance Scheme (NIS)",
    items: ["Registrations", "Schedules of Contributions", "Compliances", "Pension Queries"],
  },
]

export const COMMON_REQUIREMENTS = [
  { id: "id_card", name: "Valid ID (National ID / Passport / License)", type: "Identification", required: true },
  { id: "tin_cert", name: "TIN Certificate", type: "Identification", required: true },
  { id: "proof_address", name: "Proof of Address (Utility Bill)", type: "Address", required: true },
  { id: "passport_photo", name: "Passport Size Photo", type: "Photo", required: true },
]

export const SERVICE_REQUIREMENTS: Record<string, { id: string; name: string; type: string; required: boolean }[]> = {
  "Business Registration": [
    { id: "proposed_names", name: "Proposed Business Names (3 Options)", type: "Form", required: true },
    { id: "nature_business", name: "Nature of Business Description", type: "Form", required: true },
    { id: "id_card", name: "Valid ID (National ID / Passport / License)", type: "Identification", required: true },
    { id: "tin_cert", name: "TIN Certificate", type: "Identification", required: true },
    { id: "fee_payment", name: "Registration Fee ($5,000/$6,000 GYD)", type: "Payment", required: true },
    { id: "beneficial_ownership", name: "Beneficial Ownership Form", type: "Form", required: true },
  ],
  "Incorporation of Companies": [
    { id: "articles", name: "Articles of Incorporation", type: "Legal", required: true },
    { id: "notice_directors", name: "Notice of Directors", type: "Legal", required: true },
    { id: "notice_secretary", name: "Notice of Secretary", type: "Legal", required: true },
    { id: "notice_address", name: "Notice of Registered Office", type: "Legal", required: true },
    { id: "declaration_compliance", name: "Declaration of Compliance", type: "Legal", required: true },
  ],
  "Work Permits": [
    { id: "passport_bio", name: "Passport Bio Page (6+ Months Validity)", type: "Identification", required: true },
    { id: "current_visa", name: "Current Visa / Entry Stamp", type: "Immigration", required: true },
    { id: "job_letter", name: "Job Letter / Contract", type: "Employment", required: true },
    { id: "cv", name: "Curriculum Vitae", type: "Employment", required: true },
    { id: "police_clearance", name: "Police Clearance", type: "Legal", required: true },
    { id: "medical_cert", name: "Medical Certificate", type: "Health", required: true },
  ],
  "Income Tax Returns": [
    { id: "form_2", name: "Form 2 (Income Tax Return)", type: "Form", required: true },
    { id: "financial_statements", name: "Financial Statements", type: "Financial", required: true },
    { id: "salary_slip", name: "Salary Slips / 7B Slip", type: "Financial", required: false },
    { id: "wear_tear", name: "Wear & Tear Schedule", type: "Financial", required: false },
  ],
  "Corporation Tax Returns": [
    { id: "corp_tax_return", name: "Corporation Tax Return Form", type: "Form", required: true },
    { id: "audited_financials", name: "Audited Financial Statements", type: "Financial", required: true },
    { id: "wear_tear", name: "Wear & Tear Schedule", type: "Financial", required: false },
    { id: "loss_schedule", name: "Loss Schedule (if applicable)", type: "Financial", required: false },
  ],
  "Property Tax Returns": [
    { id: "property_tax_form", name: "Property Tax Return Form", type: "Form", required: true },
    { id: "asset_valuation", name: "Valuation of Assets", type: "Financial", required: true },
    { id: "liabilities_list", name: "List of Liabilities", type: "Financial", required: true },
  ],
  "Capital Gains Tax": [
    { id: "cap_gains_form", name: "Capital Gains Tax Return", type: "Form", required: true },
    { id: "sale_agreement", name: "Agreement of Sale", type: "Legal", required: true },
    { id: "cost_acquisition", name: "Proof of Cost of Acquisition", type: "Financial", required: true },
    { id: "expenses_receipts", name: "Receipts for Improvement/Expenses", type: "Financial", required: false },
  ],
  "Land Transfer Compliance": [
    { id: "compliance_app", name: "Compliance Application Form", type: "Form", required: true },
    { id: "transport_copy", name: "Copy of Transport/Title/Lease", type: "Property", required: true },
    { id: "agreement_sale", name: "Agreement of Sale & Purchase", type: "Legal", required: true },
    { id: "rates_taxes", name: "Rates & Taxes Receipt (Current Year)", type: "Financial", required: true },
    { id: "valuation_report", name: "Valuation Report", type: "Property", required: false },
  ],
  "Tender Compliance": [
    { id: "compliance_app", name: "Compliance Application Form", type: "Form", required: true },
    { id: "nis_compliance", name: "Valid NIS Compliance Certificate", type: "Legal", required: true },
    { id: "vat_returns", name: "Proof of VAT Returns Filing", type: "Financial", required: true },
    { id: "tax_returns", name: "Proof of Income/Corp Tax Filing", type: "Financial", required: true },
  ],
  "Excise Tax Returns": [
    { id: "excise_return", name: "Excise Tax Return Form", type: "Form", required: true },
    { id: "import_docs", name: "Import Documentation (C72)", type: "Financial", required: true },
    { id: "production_records", name: "Production/Sales Records", type: "Financial", required: true },
  ],
  "National Insurance Scheme (NIS)": [
    { id: "nis_card", name: "NIS Card", type: "Identification", required: true },
    { id: "compliance_form", name: "Compliance App Form (C100F72/A)", type: "Form", required: true },
    { id: "contribution_records", name: "Contribution Records", type: "Financial", required: true },
    { id: "business_reg", name: "Business Registration", type: "Business", required: true },
  ],
  "Business Visa": [
    { id: "invitation_letter", name: "Letter of Invitation", type: "Immigration", required: true },
    { id: "business_reg_host", name: "Host Business Registration", type: "Business", required: true },
  ],
  Citizenship: [
    { id: "birth_cert", name: "Birth Certificate", type: "Identification", required: true },
    { id: "marriage_cert", name: "Marriage Certificate (if applicable)", type: "Legal", required: false },
    { id: "residence_proof", name: "Proof of Residence (5 Years)", type: "Immigration", required: true },
  ],
}
