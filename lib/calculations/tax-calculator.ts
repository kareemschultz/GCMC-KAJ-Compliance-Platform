/**
 * Tax Calculation Engine for Guyana Tax System
 * Implements VAT, PAYE, NIS, and Corporate Tax calculations
 */

export class TaxCalculator {
  // VAT Rate in Guyana
  private static readonly VAT_RATE = 0.14 // 14%
  private static readonly VAT_THRESHOLD = 10000000 // GYD 10M annual turnover

  // PAYE Tax Brackets (2024 rates)
  private static readonly PAYE_BRACKETS = [
    { min: 0, max: 65000, rate: 0 },           // Tax-free threshold
    { min: 65001, max: 130000, rate: 0.28 },   // 28%
    { min: 130001, max: Infinity, rate: 0.40 }  // 40%
  ]

  // NIS Rates
  private static readonly NIS_EMPLOYEE_RATE = 0.056  // 5.6%
  private static readonly NIS_EMPLOYER_RATE = 0.086  // 8.6%
  private static readonly NIS_CEILING_MONTHLY = 280000  // GYD 280,000 monthly
  private static readonly NIS_CEILING_WEEKLY = 64615    // GYD 64,615 weekly

  // Corporate Tax Rate
  private static readonly CORPORATE_TAX_RATE = 0.25  // 25%
  private static readonly COMMERCIAL_COMPANY_RATE = 0.40  // 40% for commercial companies

  /**
   * Calculate VAT
   */
  static calculateVAT(amount: number, isInclusive: boolean = false): {
    vatAmount: number
    netAmount: number
    grossAmount: number
  } {
    if (isInclusive) {
      // VAT inclusive price
      const netAmount = amount / (1 + this.VAT_RATE)
      const vatAmount = amount - netAmount
      return {
        vatAmount: Math.round(vatAmount * 100) / 100,
        netAmount: Math.round(netAmount * 100) / 100,
        grossAmount: amount
      }
    } else {
      // VAT exclusive price
      const vatAmount = amount * this.VAT_RATE
      const grossAmount = amount + vatAmount
      return {
        vatAmount: Math.round(vatAmount * 100) / 100,
        netAmount: amount,
        grossAmount: Math.round(grossAmount * 100) / 100
      }
    }
  }

  /**
   * Calculate PAYE (Pay As You Earn) Tax
   */
  static calculatePAYE(grossSalary: number, period: 'monthly' | 'annual' = 'monthly'): {
    grossSalary: number
    taxableIncome: number
    payeTax: number
    netSalary: number
    effectiveRate: number
    breakdown: Array<{ bracket: string; amount: number }>
  } {
    // Convert to annual if monthly
    const annualSalary = period === 'monthly' ? grossSalary * 12 : grossSalary
    let remainingIncome = annualSalary
    let totalTax = 0
    const breakdown: Array<{ bracket: string; amount: number }> = []

    for (const bracket of this.PAYE_BRACKETS) {
      if (remainingIncome <= 0) break

      const taxableInBracket = Math.min(
        remainingIncome,
        bracket.max - bracket.min + 1
      )

      const taxForBracket = taxableInBracket * bracket.rate
      totalTax += taxForBracket

      if (taxForBracket > 0) {
        breakdown.push({
          bracket: `GYD ${bracket.min.toLocaleString()} - ${
            bracket.max === Infinity ? 'above' : `GYD ${bracket.max.toLocaleString()}`
          } @ ${(bracket.rate * 100)}%`,
          amount: taxForBracket
        })
      }

      remainingIncome -= taxableInBracket
    }

    // Convert back to monthly if needed
    const periodTax = period === 'monthly' ? totalTax / 12 : totalTax
    const periodSalary = period === 'monthly' ? grossSalary : annualSalary

    return {
      grossSalary: periodSalary,
      taxableIncome: periodSalary,
      payeTax: Math.round(periodTax * 100) / 100,
      netSalary: Math.round((periodSalary - periodTax) * 100) / 100,
      effectiveRate: Math.round((periodTax / periodSalary) * 10000) / 100,
      breakdown
    }
  }

  /**
   * Calculate NIS (National Insurance Scheme) Contributions
   */
  static calculateNIS(grossSalary: number, period: 'weekly' | 'monthly' = 'monthly'): {
    grossSalary: number
    cappedSalary: number
    employeeContribution: number
    employerContribution: number
    totalContribution: number
  } {
    // Apply ceiling
    const ceiling = period === 'weekly' ? this.NIS_CEILING_WEEKLY : this.NIS_CEILING_MONTHLY
    const cappedSalary = Math.min(grossSalary, ceiling)

    const employeeContribution = cappedSalary * this.NIS_EMPLOYEE_RATE
    const employerContribution = cappedSalary * this.NIS_EMPLOYER_RATE

    return {
      grossSalary,
      cappedSalary,
      employeeContribution: Math.round(employeeContribution * 100) / 100,
      employerContribution: Math.round(employerContribution * 100) / 100,
      totalContribution: Math.round((employeeContribution + employerContribution) * 100) / 100
    }
  }

  /**
   * Calculate 7B Tax (Withholding Tax for non-residents)
   */
  static calculate7BTax(amount: number, serviceType: '7B1' | '7B2' | '7B3' = '7B1'): {
    grossAmount: number
    withholdingRate: number
    withholdingTax: number
    netAmount: number
  } {
    // 7B1: 20% for most services
    // 7B2: 10% for certain professional services
    // 7B3: 14% for specific categories
    const rates = {
      '7B1': 0.20,
      '7B2': 0.10,
      '7B3': 0.14
    }

    const rate = rates[serviceType]
    const withholdingTax = amount * rate

    return {
      grossAmount: amount,
      withholdingRate: rate,
      withholdingTax: Math.round(withholdingTax * 100) / 100,
      netAmount: Math.round((amount - withholdingTax) * 100) / 100
    }
  }

  /**
   * Calculate Corporate Income Tax
   */
  static calculateCorporateTax(
    profitBeforeTax: number,
    isCommercialCompany: boolean = false,
    deductions: number = 0
  ): {
    profitBeforeTax: number
    deductions: number
    taxableIncome: number
    taxRate: number
    corporateTax: number
    profitAfterTax: number
  } {
    const taxableIncome = Math.max(0, profitBeforeTax - deductions)
    const taxRate = isCommercialCompany ? this.COMMERCIAL_COMPANY_RATE : this.CORPORATE_TAX_RATE
    const corporateTax = taxableIncome * taxRate

    return {
      profitBeforeTax,
      deductions,
      taxableIncome,
      taxRate,
      corporateTax: Math.round(corporateTax * 100) / 100,
      profitAfterTax: Math.round((profitBeforeTax - corporateTax) * 100) / 100
    }
  }

  /**
   * Generate complete tax calculation for an employee
   */
  static calculateEmployeeTaxes(
    grossSalary: number,
    period: 'monthly' | 'weekly' = 'monthly'
  ): {
    gross: number
    paye: number
    nisEmployee: number
    nisEmployer: number
    netTakeHome: number
    totalDeductions: number
    employerCost: number
  } {
    // Calculate PAYE (monthly basis)
    const payeCalc = this.calculatePAYE(grossSalary, period === 'weekly' ? 'monthly' : period)

    // Calculate NIS
    const nisCalc = this.calculateNIS(grossSalary, period)

    const totalDeductions = payeCalc.payeTax + nisCalc.employeeContribution
    const netTakeHome = grossSalary - totalDeductions
    const employerCost = grossSalary + nisCalc.employerContribution

    return {
      gross: grossSalary,
      paye: payeCalc.payeTax,
      nisEmployee: nisCalc.employeeContribution,
      nisEmployer: nisCalc.employerContribution,
      netTakeHome: Math.round(netTakeHome * 100) / 100,
      totalDeductions: Math.round(totalDeductions * 100) / 100,
      employerCost: Math.round(employerCost * 100) / 100
    }
  }
}

export default TaxCalculator