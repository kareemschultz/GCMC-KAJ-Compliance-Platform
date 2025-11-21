"use client"

import * as React from "react"
import { CheckCircle, AlertCircle, XCircle, Info, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { getValidationClasses, type ValidationIndicatorProps } from "@/lib/design-system"
import { Button } from "@/components/ui/button"

const iconMap = {
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
  info: Info,
  neutral: HelpCircle,
}

export function ValidationIndicator({
  state,
  icon: CustomIcon,
  title,
  message,
  action,
  className
}: ValidationIndicatorProps & { className?: string }) {
  const classes = getValidationClasses(state)
  const Icon = CustomIcon || iconMap[state]

  return (
    <div className={cn(
      "rounded-md border p-3",
      classes.bg,
      classes.border,
      className
    )}>
      <div className="flex items-start gap-2">
        <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", classes.icon)} />
        <div className="flex-1 min-w-0">
          <h5 className={cn("font-medium text-sm", classes.text)}>
            {title}
          </h5>
          <p className={cn("text-sm mt-1", classes.text)}>
            {message}
          </p>
          {action && (
            <Button
              variant="ghost"
              size="sm"
              className={cn("mt-2 h-auto p-0 font-medium", classes.accent)}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export function StepValidationIndicator({
  steps,
  currentStep,
  className
}: {
  steps: Array<{
    id: string
    title: string
    isValid: boolean
    message?: string
    required?: boolean
  }>
  currentStep?: string
  className?: string
}) {
  return (
    <div className={cn("rounded-md border p-3 bg-gray-50", className)}>
      <h5 className="font-medium mb-2 text-sm text-gray-700">Step Validation Status:</h5>
      <div className="space-y-2">
        {steps.map((step) => {
          const isCurrentStep = currentStep === step.id
          const state = step.isValid ? 'success' : step.required ? 'warning' : 'neutral'
          const Icon = step.isValid ? CheckCircle : AlertCircle

          return (
            <div key={step.id} className="flex items-center gap-2">
              <Icon className={cn(
                "h-3 w-3",
                step.isValid ? "text-green-600" : step.required ? "text-amber-600" : "text-gray-400"
              )} />
              <span className={cn(
                "text-xs",
                step.isValid ? "text-green-700" : step.required ? "text-amber-700" : "text-gray-600",
                isCurrentStep && "font-medium"
              )}>
                {step.title}
                {step.isValid ? " ✓" : step.required ? " ⚠" : " —"}
                {step.message && ` (${step.message})`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function RequirementsList({
  requirements,
  className
}: {
  requirements: Array<{
    id: string
    title: string
    completed: boolean
    required: boolean
    description?: string
  }>
  className?: string
}) {
  const completedCount = requirements.filter(req => req.completed).length
  const requiredCount = requirements.filter(req => req.required).length
  const completedRequired = requirements.filter(req => req.required && req.completed).length

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h5 className="font-medium text-sm text-gray-700">Requirements Checklist</h5>
        <span className="text-xs text-gray-500">
          {completedRequired}/{requiredCount} required completed
        </span>
      </div>

      <div className="space-y-2">
        {requirements.map((req) => {
          const Icon = req.completed ? CheckCircle : AlertCircle

          return (
            <div key={req.id} className="flex items-start gap-2">
              <Icon className={cn(
                "h-3 w-3 mt-0.5 shrink-0",
                req.completed ? "text-green-600" : req.required ? "text-amber-600" : "text-gray-400"
              )} />
              <div className="flex-1 min-w-0">
                <span className={cn(
                  "text-xs font-medium",
                  req.completed ? "text-green-700" : req.required ? "text-amber-700" : "text-gray-600"
                )}>
                  {req.title}
                  {req.required && !req.completed && (
                    <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                      Required
                    </span>
                  )}
                </span>
                {req.description && (
                  <p className="text-xs text-gray-500 mt-0.5">{req.description}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Progress bar component
export function ProgressIndicator({
  total,
  current,
  completedSteps = [],
  stepTitles = [],
  className
}: {
  total: number
  current: number
  completedSteps?: number[]
  stepTitles?: string[]
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">
          Progress
        </span>
        <span className="text-xs text-gray-500">
          Step {current} of {total}
        </span>
      </div>

      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => {
          const stepNumber = i + 1
          const isCompleted = completedSteps.includes(stepNumber)
          const isCurrent = stepNumber === current
          const isPast = stepNumber < current

          return (
            <div
              key={i}
              className={cn(
                "h-2 flex-1 rounded-full transition-colors",
                isCompleted || isPast ? "bg-primary" :
                isCurrent ? "bg-primary/50" : "bg-muted"
              )}
              title={stepTitles[i] || `Step ${stepNumber}`}
            />
          )
        })}
      </div>
    </div>
  )
}