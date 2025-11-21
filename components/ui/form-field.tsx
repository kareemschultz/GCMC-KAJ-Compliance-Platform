"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Info,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  HelpCircle,
  Copy,
  Check
} from "lucide-react"
import { autoFormatById, type FormatterResult } from "@/lib/input-formatters"
import { validateIdNumber, getIdValidationExample } from "@/lib/dropdown-data"

export interface ValidationRule {
  type: "required" | "minLength" | "maxLength" | "pattern" | "custom" | "email" | "phone" | "format"
  value?: any
  message: string
}

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  description?: string
  error?: string
  success?: string
  hint?: string
  validationRules?: ValidationRule[]
  showValidation?: boolean
  formatType?: string
  required?: boolean
  showRequiredIndicator?: boolean
  helpText?: string
  copyable?: boolean
  showPasswordToggle?: boolean
  realTimeValidation?: boolean
  validationDelay?: number
  showFormatExample?: boolean
}

export function FormField({
  label,
  description,
  error,
  success,
  hint,
  validationRules = [],
  showValidation = true,
  formatType,
  required = false,
  showRequiredIndicator = true,
  helpText,
  copyable = false,
  showPasswordToggle = false,
  realTimeValidation = true,
  validationDelay = 300,
  showFormatExample = false,
  className,
  type = "text",
  value,
  onChange,
  onBlur,
  ...props
}: FormFieldProps) {
  const [internalValue, setInternalValue] = React.useState(value || "")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  const [validationState, setValidationState] = React.useState<{
    isValid: boolean
    errors: string[]
    formatted?: string
  }>({ isValid: true, errors: [] })
  const [showHelp, setShowHelp] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const validationTimeoutRef = React.useRef<NodeJS.Timeout>()

  // Validate input value
  const validateValue = React.useCallback((val: string) => {
    const errors: string[] = []
    let isValid = true

    // Apply validation rules
    for (const rule of validationRules) {
      switch (rule.type) {
        case "required":
          if (!val.trim()) {
            errors.push(rule.message)
            isValid = false
          }
          break
        case "minLength":
          if (val.length < rule.value) {
            errors.push(rule.message)
            isValid = false
          }
          break
        case "maxLength":
          if (val.length > rule.value) {
            errors.push(rule.message)
            isValid = false
          }
          break
        case "pattern":
          if (!rule.value.test(val)) {
            errors.push(rule.message)
            isValid = false
          }
          break
        case "email":
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (val && !emailPattern.test(val)) {
            errors.push(rule.message)
            isValid = false
          }
          break
        case "format":
          if (formatType && !validateIdNumber(formatType, val)) {
            errors.push(rule.message)
            isValid = false
          }
          break
        case "custom":
          if (rule.value && !rule.value(val)) {
            errors.push(rule.message)
            isValid = false
          }
          break
      }
    }

    return { isValid, errors }
  }, [validationRules, formatType])

  // Handle real-time formatting and validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    let formattedValue = newValue

    // Apply formatting if formatType is specified
    if (formatType) {
      const formatResult: FormatterResult = autoFormatById(formatType, newValue)
      formattedValue = formatResult.formatted

      // Update validation state with format errors
      if (formatResult.error) {
        setValidationState({
          isValid: false,
          errors: [formatResult.error],
          formatted: formattedValue
        })
      }
    }

    setInternalValue(formattedValue)

    // Create synthetic event with formatted value
    const syntheticEvent = {
      ...e,
      target: { ...e.target, value: formattedValue }
    }
    onChange?.(syntheticEvent)

    // Real-time validation with debounce
    if (realTimeValidation) {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current)
      }

      validationTimeoutRef.current = setTimeout(() => {
        const validation = validateValue(formattedValue)
        setValidationState({
          ...validation,
          formatted: formattedValue
        })
      }, validationDelay)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)

    // Final validation on blur
    const validation = validateValue(internalValue)
    setValidationState({
      ...validation,
      formatted: internalValue
    })

    onBlur?.(e)
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    props.onFocus?.(e)
  }

  // Copy to clipboard
  const handleCopy = async () => {
    if (internalValue) {
      await navigator.clipboard.writeText(internalValue.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Get current validation status
  const hasError = error || (showValidation && !validationState.isValid && !isFocused)
  const hasSuccess = success || (showValidation && validationState.isValid && internalValue && !isFocused)

  // Get format example
  const formatExample = formatType ? getIdValidationExample(formatType) : ""

  React.useEffect(() => {
    setInternalValue(value || "")
  }, [value])

  return (
    <div className="space-y-2">
      {/* Label and Help */}
      <div className="flex items-center justify-between">
        <Label
          htmlFor={props.id}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            hasError && "text-red-600",
            hasSuccess && "text-green-600"
          )}
        >
          {label}
          {required && showRequiredIndicator && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </Label>

        {helpText && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setShowHelp(!showHelp)}
          >
            <HelpCircle className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Help Text */}
      {showHelp && helpText && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {helpText}
          </AlertDescription>
        </Alert>
      )}

      {/* Input Container */}
      <div className="relative">
        <Input
          {...props}
          type={showPasswordToggle && showPassword ? "text" : type}
          value={internalValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={cn(
            className,
            hasError && "border-red-500 focus-visible:ring-red-500",
            hasSuccess && "border-green-500 focus-visible:ring-green-500",
            (showPasswordToggle || copyable) && "pr-10"
          )}
        />

        {/* Action Icons */}
        {(showPasswordToggle || copyable) && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {copyable && internalValue && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            )}

            {showPasswordToggle && type === "password" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>
        )}

        {/* Validation Icon */}
        {showValidation && !isFocused && internalValue && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2">
            {hasError ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : hasSuccess ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : null}
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {/* Format Example */}
      {showFormatExample && formatExample && (
        <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
          Example: {formatExample}
        </p>
      )}

      {/* Error Messages */}
      {hasError && (
        <div className="space-y-1">
          {error && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {error}
            </p>
          )}
          {showValidation && validationState.errors.map((err, index) => (
            <p key={index} className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {err}
            </p>
          ))}
        </div>
      )}

      {/* Success Message */}
      {hasSuccess && success && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          {success}
        </p>
      )}

      {/* Hint */}
      {hint && !hasError && (
        <p className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}

      {/* Validation Rules Display (when focused) */}
      {isFocused && showValidation && validationRules.length > 0 && (
        <div className="text-xs space-y-1 bg-gray-50 p-2 rounded border">
          <p className="font-medium text-gray-700">Requirements:</p>
          {validationRules.map((rule, index) => {
            const isRuleMet = !validationState.errors.some(err => err === rule.message)
            return (
              <div key={index} className="flex items-center gap-1">
                {isRuleMet ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <div className="h-3 w-3 rounded-full border border-gray-300" />
                )}
                <span className={cn(
                  isRuleMet ? "text-green-700" : "text-gray-600"
                )}>
                  {rule.message}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}