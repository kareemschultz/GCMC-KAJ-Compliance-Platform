/**
 * GK Enterprise Suite Design System
 * Consistent colors, styles, and validation patterns across the application
 */

export const DESIGN_TOKENS = {
  // Primary color scheme for validation states
  validation: {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      icon: "text-green-600",
      accent: "text-green-600"
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      icon: "text-amber-600",
      accent: "text-amber-600"
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: "text-red-600",
      accent: "text-red-600"
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      icon: "text-blue-600",
      accent: "text-blue-600"
    },
    neutral: {
      bg: "bg-gray-50",
      border: "border-gray-200",
      text: "text-gray-700",
      icon: "text-gray-600",
      accent: "text-gray-600"
    }
  },

  // Status indicators
  status: {
    excellent: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      badge: "bg-green-100 text-green-800",
      color: "#10b981"
    },
    good: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      badge: "bg-blue-100 text-blue-800",
      color: "#3b82f6"
    },
    fair: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      badge: "bg-yellow-100 text-yellow-800",
      color: "#f59e0b"
    },
    poor: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      badge: "bg-red-100 text-red-800",
      color: "#ef4444"
    }
  },

  // Step indicators and progress
  progress: {
    completed: {
      bg: "bg-primary",
      text: "text-primary-foreground",
      icon: "text-primary-foreground"
    },
    current: {
      bg: "bg-primary/20",
      border: "border-primary",
      text: "text-primary",
      icon: "text-primary"
    },
    pending: {
      bg: "bg-muted",
      border: "border-muted-foreground/20",
      text: "text-muted-foreground",
      icon: "text-muted-foreground"
    }
  },

  // Form field states
  field: {
    valid: {
      border: "border-green-500",
      ring: "focus-visible:ring-green-500",
      icon: "text-green-500"
    },
    invalid: {
      border: "border-red-500",
      ring: "focus-visible:ring-red-500",
      icon: "text-red-500"
    },
    focus: {
      border: "border-primary",
      ring: "focus-visible:ring-primary",
      icon: "text-primary"
    }
  }
} as const

// Utility functions for consistent styling
export const getValidationClasses = (state: keyof typeof DESIGN_TOKENS.validation) => {
  return DESIGN_TOKENS.validation[state]
}

export const getStatusClasses = (status: keyof typeof DESIGN_TOKENS.status) => {
  return DESIGN_TOKENS.status[status]
}

export const getProgressClasses = (state: keyof typeof DESIGN_TOKENS.progress) => {
  return DESIGN_TOKENS.progress[state]
}

export const getFieldClasses = (state: keyof typeof DESIGN_TOKENS.field) => {
  return DESIGN_TOKENS.field[state]
}

// Validation component patterns
export interface ValidationIndicatorProps {
  state: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  icon?: React.ComponentType<{ className?: string }>
  title: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
}

export interface StepValidationProps {
  steps: Array<{
    id: string
    title: string
    isValid: boolean
    message?: string
    required?: boolean
  }>
  currentStep?: string
}

export interface ProgressIndicatorProps {
  total: number
  current: number
  completedSteps?: number[]
  stepTitles?: string[]
}

// Common validation messages
export const VALIDATION_MESSAGES = {
  required: "This field is required",
  email: "Please enter a valid email address",
  phone: "Please enter a valid phone number",
  minLength: (length: number) => `Must be at least ${length} characters`,
  maxLength: (length: number) => `Must be no more than ${length} characters`,
  pattern: (example: string) => `Format should be like: ${example}`,
  dateOfBirth: "Date of birth is required",
  primaryId: "Please select an ID type and enter the ID number",
  governmentId: "At least one government registration number is required",

  // Step-specific messages
  step1: {
    individual: "First name and surname are required",
    company: "Business name is required"
  },
  step2: {
    contact: "Valid email and phone number are required"
  },
  step3: {
    individual: "Primary ID and date of birth are required",
    company: "At least TIN or business registration number is required"
  }
} as const

// Helper function to get step validation message
export const getStepValidationMessage = (step: number, clientType: 'INDIVIDUAL' | 'COMPANY') => {
  switch (step) {
    case 1:
      return clientType === 'INDIVIDUAL'
        ? VALIDATION_MESSAGES.step1.individual
        : VALIDATION_MESSAGES.step1.company
    case 2:
      return VALIDATION_MESSAGES.step2.contact
    case 3:
      return clientType === 'INDIVIDUAL'
        ? VALIDATION_MESSAGES.step3.individual
        : VALIDATION_MESSAGES.step3.company
    default:
      return ""
  }
}

// Animation classes for consistent transitions
export const ANIMATIONS = {
  fadeIn: "animate-in fade-in-0 duration-200",
  fadeOut: "animate-out fade-out-0 duration-200",
  slideIn: "animate-in slide-in-from-top-1 duration-200",
  slideOut: "animate-out slide-out-to-top-1 duration-200",
  scaleIn: "animate-in zoom-in-95 duration-200",
  scaleOut: "animate-out zoom-out-95 duration-200"
} as const

// Spacing and sizing constants
export const SPACING = {
  wizard: {
    container: "space-y-6",
    step: "space-y-4",
    field: "space-y-2",
    section: "space-y-4"
  },
  form: {
    group: "space-y-3",
    field: "space-y-1",
    actions: "space-x-2"
  }
} as const

export const SIZING = {
  wizard: {
    width: "sm:max-w-[700px]",
    height: "max-h-[600px]"
  },
  modal: {
    width: "sm:max-w-[500px]",
    height: "max-h-[400px]"
  }
} as const