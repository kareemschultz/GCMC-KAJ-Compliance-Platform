import { z } from "zod"

// Guyana TIN Format: XXX-XXX-XXX (9 digits with dashes)
export const tinSchema = z.string().regex(/^\d{3}-\d{3}-\d{3}$/, "TIN must be in format XXX-XXX-XXX (9 digits)")

// Guyana NIS Number Format: NIS-XXXXXX (6 digits after prefix)
export const nisSchema = z.string().regex(/^NIS-\d{6}$/, "NIS number must be in format NIS-XXXXXX (6 digits)")

// Email validation
export const emailSchema = z.string().email("Invalid email address")

// Phone number validation (Guyana format: +592-XXX-XXXX or similar)
export const phoneSchema = z
  .string()
  .regex(/^(\+592|592)[-\s]?\d{3}[-\s]?\d{4}$/, "Phone must be in format +592-XXX-XXXX or 592-XXX-XXXX")

export const TAX_RATES = {
  NIS_EMPLOYEE_RATE: 0.056, // 5.6%
  NIS_EMPLOYER_RATE: 0.084, // 8.4%
  NIS_TOTAL_RATE: 0.14, // 14% combined
  VAT_RATE: 0.14, // 14%
  INCOME_TAX_STANDARD: 0.28, // 28%
  INCOME_TAX_HIGH: 0.4, // 40% for high earners
  STATUTORY_FREE_PAY_BASE: 100000, // GYD per month
  NIS_MONTHLY_CEILING: 320000, // Insurable earnings ceiling (GYD)
} as const

// Calculate NIS employee deduction
export function calculateNISEmployee(grossWages: number): number {
  const insurableEarnings = Math.min(grossWages, TAX_RATES.NIS_MONTHLY_CEILING)
  return Math.round(insurableEarnings * TAX_RATES.NIS_EMPLOYEE_RATE * 100) / 100
}

// Calculate NIS employer contribution
export function calculateNISEmployer(grossWages: number): number {
  const insurableEarnings = Math.min(grossWages, TAX_RATES.NIS_MONTHLY_CEILING)
  return Math.round(insurableEarnings * TAX_RATES.NIS_EMPLOYER_RATE * 100) / 100
}

// Calculate total NIS remittance
export function calculateNISTotal(grossWages: number): number {
  const employee = calculateNISEmployee(grossWages)
  const employer = calculateNISEmployer(grossWages)
  return employee + employer
}

// Calculate statutory free pay (Guyana Income Tax)
export function calculateStatutoryFreePay(grossIncome: number): number {
  // The greater of $100,000 or 1/3 of gross income
  return Math.max(TAX_RATES.STATUTORY_FREE_PAY_BASE, grossIncome / 3)
}

// Calculate PAYE (Income Tax) for Guyana
export function calculatePAYE(
  grossIncome: number,
  allowances = 0,
): {
  grossTotal: number
  nisDeduction: number
  statutoryFreePay: number
  taxableIncome: number
  paye: number
  netPay: number
} {
  const grossTotal = grossIncome + allowances
  const nisDeduction = calculateNISEmployee(grossIncome)
  const statutoryFreePay = calculateStatutoryFreePay(grossTotal)
  const taxableIncome = Math.max(0, grossTotal - statutoryFreePay - nisDeduction)

  // Apply 28% tax rate (simplified; in reality 40% applies above certain threshold)
  const paye = Math.round(taxableIncome * TAX_RATES.INCOME_TAX_STANDARD * 100) / 100
  const netPay = grossTotal - nisDeduction - paye

  return {
    grossTotal,
    nisDeduction,
    statutoryFreePay,
    taxableIncome,
    paye,
    netPay,
  }
}

// Calculate VAT from sales amount
export function calculateOutputVAT(salesAmount: number): number {
  return Math.round(salesAmount * TAX_RATES.VAT_RATE * 100) / 100
}

// Calculate Input VAT from VAT-inclusive purchases
export function calculateInputVAT(purchasesInclusive: number): number {
  // Formula: (Purchases × 14) / 114
  return Math.round(((purchasesInclusive * 14) / 114) * 100) / 100
}

// Calculate net VAT payable/refundable
export function calculateNetVAT(outputVAT: number, inputVAT: number, adjustments = 0, penalties = 0): number {
  return outputVAT - inputVAT + adjustments + penalties
}

// Format currency for Guyana (GYD)
export function formatGYD(amount: number): string {
  return new Intl.NumberFormat("en-GY", {
    style: "currency",
    currency: "GYD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Validate TIN format
export function isValidTIN(tin: string): boolean {
  return tinSchema.safeParse(tin).success
}

// Validate NIS number format
export function isValidNIS(nis: string): boolean {
  return nisSchema.safeParse(nis).success
}

// Format TIN with dashes
export function formatTIN(tin: string): string {
  const cleaned = tin.replace(/\D/g, "")
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 9)}`
  }
  return tin
}

// Format NIS number
export function formatNIS(nis: string): string {
  const cleaned = nis.replace(/\D/g, "")
  if (cleaned.length === 6) {
    return `NIS-${cleaned}`
  }
  return nis
}

// Client form validation schemas
export const clientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["Company", "Individual", "Partnership", "Sole Trader"]),
  tin: tinSchema,
  nisNumber: nisSchema.optional(),
  email: emailSchema,
  phone: phoneSchema,
  address: z.string().min(5, "Address must be at least 5 characters"),
})

// NIS Schedule validation schema
export const nisScheduleSchema = z.object({
  month: z.string().min(1, "Month is required"),
  year: z.number().int().min(2020).max(2100),
  totalWages: z.number().positive("Total wages must be positive"),
  clientId: z.string().min(1, "Client ID is required"),
})

// Tax return validation schema
export const taxReturnSchema = z.object({
  filingType: z.enum(["VAT", "PAYE", "INCOME_TAX", "CORP_TAX"]),
  period: z.string().min(1, "Period is required"),
  amountDue: z.number(),
  clientId: z.string().min(1, "Client ID is required"),
})

// VAT return validation schema
export const vatReturnSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  period: z.string().min(1, "Period is required"),
  standardSales: z.number().nonnegative("Sales must be non-negative"),
  zeroRateSales: z.number().nonnegative("Sales must be non-negative"),
  exemptSales: z.number().nonnegative("Sales must be non-negative"),
  purchases: z.number().nonnegative("Purchases must be non-negative"),
  adjustments: z.number(),
  penalties: z.number().nonnegative("Penalties must be non-negative"),
})

export type ClientFormData = z.infer<typeof clientSchema>
export type NISScheduleFormData = z.infer<typeof nisScheduleSchema>
export type TaxReturnFormData = z.infer<typeof taxReturnSchema>
export type VATReturnFormData = z.infer<typeof vatReturnSchema>
