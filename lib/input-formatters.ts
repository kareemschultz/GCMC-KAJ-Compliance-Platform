/**
 * Input formatting utilities for Guyanese-specific formats
 * Handles phone numbers, TIN, NIS, and other local ID formats
 */

export interface FormatterResult {
  formatted: string
  isValid: boolean
  error?: string
}

export interface FormatterConfig {
  format?: string
  pattern?: RegExp
  example?: string
  description?: string
}

// Guyana-specific formatting patterns
export const GUYANA_FORMATS = {
  phone: {
    pattern: /^(\+592)?[\s-]?(\d{3})[\s-]?(\d{4})$/,
    format: "+592-XXX-XXXX",
    example: "+592-123-4567",
    description: "Guyanese phone number with country code"
  },
  tin: {
    pattern: /^(\d{3})[\s-]?(\d{3})[\s-]?(\d{3})$/,
    format: "XXX-XXX-XXX",
    example: "123-456-789",
    description: "Tax Identification Number (9 digits)"
  },
  nis: {
    pattern: /^([A-Z])[\s-]?(\d{6})$/,
    format: "A-XXXXXX",
    example: "A-123456",
    description: "National Insurance Scheme number"
  },
  nationalId: {
    pattern: /^(\d{3})[\s-]?(\d{3})[\s-]?(\d{3})$/,
    format: "XXXXXXXXX",
    example: "144123456",
    description: "9-digit National ID number"
  },
  vat: {
    pattern: /^([V])[\s-]?(\d{6})$/,
    format: "V-XXXXXX",
    example: "V-123456",
    description: "VAT registration number"
  },
  businessReg: {
    pattern: /^([C])[\s-]?(\d{5,7})$/,
    format: "C-XXXXX",
    example: "C-12345",
    description: "Business registration number"
  },
  passport: {
    pattern: /^([A-Z])[\s-]?(\d{7})$/,
    format: "XXXXXXXX",
    example: "R0712345",
    description: "Passport number (1 letter + 7 digits)"
  },
  driverLicense: {
    pattern: /^(DL)[\s-]?(\d{6})$/,
    format: "DL-XXXXXX",
    example: "DL-123456",
    description: "Driver's license number"
  },
  voterPeace: {
    pattern: /^([V])[\s-]?(\d{6})$/,
    format: "V-XXXXXX",
    example: "V-123456",
    description: "Voter registration ID"
  }
} as const

/**
 * Format phone number to Guyana standard
 */
export const formatPhoneNumber = (input: string): FormatterResult => {
  if (!input) return { formatted: "", isValid: false }

  // Remove all non-numeric characters except + at the start
  const cleaned = input.replace(/[^\d+]/g, "")

  // Handle different input patterns
  let formatted = ""
  let isValid = false

  if (cleaned.startsWith("+592")) {
    const digits = cleaned.substring(4)
    if (digits.length <= 7) {
      formatted = "+592-" + digits.substring(0, 3) + (digits.length > 3 ? "-" + digits.substring(3) : "")
      isValid = digits.length === 7
    }
  } else if (cleaned.startsWith("592")) {
    const digits = cleaned.substring(3)
    if (digits.length <= 7) {
      formatted = "+592-" + digits.substring(0, 3) + (digits.length > 3 ? "-" + digits.substring(3) : "")
      isValid = digits.length === 7
    }
  } else {
    // Local number
    if (cleaned.length <= 7) {
      formatted = cleaned.substring(0, 3) + (cleaned.length > 3 ? "-" + cleaned.substring(3) : "")
      if (cleaned.length === 7) {
        formatted = "+592-" + formatted
        isValid = true
      }
    }
  }

  return {
    formatted,
    isValid,
    error: !isValid && input.length > 0 ? "Please enter a valid Guyanese phone number" : undefined
  }
}

/**
 * Format TIN (Tax Identification Number)
 */
export const formatTIN = (input: string): FormatterResult => {
  if (!input) return { formatted: "", isValid: false }

  const cleaned = input.replace(/\D/g, "")

  if (cleaned.length > 9) {
    return { formatted: input, isValid: false, error: "TIN must be 9 digits" }
  }

  let formatted = cleaned
  if (cleaned.length > 6) {
    formatted = cleaned.substring(0, 3) + "-" + cleaned.substring(3, 6) + "-" + cleaned.substring(6)
  } else if (cleaned.length > 3) {
    formatted = cleaned.substring(0, 3) + "-" + cleaned.substring(3)
  }

  return {
    formatted,
    isValid: cleaned.length === 9,
    error: cleaned.length > 0 && cleaned.length !== 9 ? "TIN must be exactly 9 digits" : undefined
  }
}

/**
 * Format NIS (National Insurance Scheme) number
 */
export const formatNIS = (input: string): FormatterResult => {
  if (!input) return { formatted: "", isValid: false }

  const cleaned = input.replace(/[^A-Za-z0-9]/g, "").toUpperCase()

  if (cleaned.length > 7) {
    return { formatted: input, isValid: false, error: "NIS must be 1 letter followed by 6 digits" }
  }

  let formatted = cleaned
  if (cleaned.length > 1) {
    formatted = cleaned.substring(0, 1) + "-" + cleaned.substring(1)
  }

  const isValid = /^[A-Z]-\d{6}$/.test(formatted)

  return {
    formatted,
    isValid,
    error: cleaned.length > 0 && !isValid ? "NIS format: A-123456" : undefined
  }
}

/**
 * Format National ID number
 */
export const formatNationalId = (input: string): FormatterResult => {
  if (!input) return { formatted: "", isValid: false }

  const cleaned = input.replace(/\D/g, "")

  if (cleaned.length > 9) {
    return { formatted: input, isValid: false, error: "National ID must be 9 digits" }
  }

  const formatted = cleaned

  return {
    formatted,
    isValid: cleaned.length === 9,
    error: cleaned.length > 0 && cleaned.length !== 9 ? "National ID must be exactly 9 digits" : undefined
  }
}

/**
 * Format VAT number
 */
export const formatVAT = (input: string): FormatterResult => {
  if (!input) return { formatted: "", isValid: false }

  const cleaned = input.replace(/[^V0-9]/gi, "").toUpperCase()

  if (cleaned.length > 7) {
    return { formatted: input, isValid: false, error: "VAT format: V-123456" }
  }

  let formatted = cleaned
  if (cleaned.startsWith("V") && cleaned.length > 1) {
    formatted = "V-" + cleaned.substring(1)
  }

  const isValid = /^V-\d{6}$/.test(formatted)

  return {
    formatted,
    isValid,
    error: cleaned.length > 0 && !isValid ? "VAT format: V-123456" : undefined
  }
}

/**
 * Format Business Registration number
 */
export const formatBusinessReg = (input: string): FormatterResult => {
  if (!input) return { formatted: "", isValid: false }

  const cleaned = input.replace(/[^C0-9]/gi, "").toUpperCase()

  if (cleaned.length > 8) {
    return { formatted: input, isValid: false, error: "Business registration format: C-12345" }
  }

  let formatted = cleaned
  if (cleaned.startsWith("C") && cleaned.length > 1) {
    formatted = "C-" + cleaned.substring(1)
  }

  const isValid = /^C-\d{5,7}$/.test(formatted)

  return {
    formatted,
    isValid,
    error: cleaned.length > 0 && !isValid ? "Business registration format: C-12345" : undefined
  }
}

/**
 * Format passport number
 */
export const formatPassport = (input: string): FormatterResult => {
  if (!input) return { formatted: "", isValid: false }

  const cleaned = input.replace(/[^A-Za-z0-9]/g, "").toUpperCase()

  if (cleaned.length > 8) {
    return { formatted: input, isValid: false, error: "Passport format: R0712345" }
  }

  const formatted = cleaned

  const isValid = /^[A-Z]\d{7}$/.test(formatted)

  return {
    formatted,
    isValid,
    error: cleaned.length > 0 && !isValid ? "Passport format: R0712345 (1 letter + 7 digits)" : undefined
  }
}

/**
 * Format driver's license
 */
export const formatDriverLicense = (input: string): FormatterResult => {
  if (!input) return { formatted: "", isValid: false }

  const cleaned = input.replace(/[^DL0-9]/gi, "").toUpperCase()

  if (cleaned.length > 8) {
    return { formatted: input, isValid: false, error: "Driver's license format: DL-123456" }
  }

  let formatted = cleaned
  if (cleaned.startsWith("DL") && cleaned.length > 2) {
    formatted = "DL-" + cleaned.substring(2)
  }

  const isValid = /^DL-\d{6}$/.test(formatted)

  return {
    formatted,
    isValid,
    error: cleaned.length > 0 && !isValid ? "Driver's license format: DL-123456" : undefined
  }
}

/**
 * Auto-detect and format based on ID type
 */
export const autoFormatById = (idType: string, input: string): FormatterResult => {
  switch (idType) {
    case "National ID":
      return formatNationalId(input)
    case "TIN":
      return formatTIN(input)
    case "NIS":
      return formatNIS(input)
    case "VAT":
      return formatVAT(input)
    case "Business Registration":
      return formatBusinessReg(input)
    case "Passport":
      return formatPassport(input)
    case "Driver's License":
      return formatDriverLicense(input)
    case "Phone":
      return formatPhoneNumber(input)
    default:
      return { formatted: input, isValid: true }
  }
}

/**
 * Get format example for ID type
 */
export const getFormatExample = (idType: string): string => {
  const formatKey = idType.toLowerCase().replace(/[^a-z]/g, "") as keyof typeof GUYANA_FORMATS
  return GUYANA_FORMATS[formatKey]?.example || ""
}

/**
 * Get format description for ID type
 */
export const getFormatDescription = (idType: string): string => {
  const formatKey = idType.toLowerCase().replace(/[^a-z]/g, "") as keyof typeof GUYANA_FORMATS
  return GUYANA_FORMATS[formatKey]?.description || ""
}

/**
 * Validate format without formatting
 */
export const validateFormat = (idType: string, input: string): boolean => {
  const result = autoFormatById(idType, input)
  return result.isValid
}

/**
 * Currency formatting for Guyanese Dollar
 */
export const formatCurrency = (amount: number | string, includeCurrency = true): string => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  if (isNaN(num)) return ""

  const formatted = new Intl.NumberFormat("en-GY", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)

  return includeCurrency ? `GYD ${formatted}` : formatted
}

/**
 * Format percentage
 */
export const formatPercentage = (value: number | string, decimals = 1): string => {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return ""

  return `${num.toFixed(decimals)}%`
}

/**
 * React hook for real-time input formatting
 */
export const useInputFormatter = (type: string) => {
  return (input: string) => autoFormatById(type, input)
}