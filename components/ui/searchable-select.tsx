"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import type { DropdownOption } from "@/lib/dropdown-data"

interface SearchableSelectProps {
  options: DropdownOption[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
  multiple?: boolean
  disabled?: boolean
  clearable?: boolean
  showDescriptions?: boolean
  showColors?: boolean
  groupBy?: string
  maxSelected?: number
  searchPlaceholder?: string
}

export function SearchableSelect({
  options = [],
  value,
  onValueChange,
  placeholder = "Select option...",
  emptyMessage = "No options found.",
  className,
  multiple = false,
  disabled = false,
  clearable = true,
  showDescriptions = true,
  showColors = false,
  groupBy,
  maxSelected,
  searchPlaceholder = "Search options...",
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Normalize value to array for easier handling
  const selectedValues = React.useMemo(() => {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }, [value])

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options

    return options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [options, searchQuery])

  // Group options if groupBy is specified
  const groupedOptions = React.useMemo(() => {
    if (!groupBy) return { "": filteredOptions }

    return filteredOptions.reduce((groups, option) => {
      const group = (option as any)[groupBy] || "Other"
      if (!groups[group]) groups[group] = []
      groups[group].push(option)
      return groups
    }, {} as Record<string, DropdownOption[]>)
  }, [filteredOptions, groupBy])

  // Get selected option labels
  const getSelectedDisplay = () => {
    if (!selectedValues.length) return placeholder

    if (multiple) {
      const selectedOptions = options.filter(opt => selectedValues.includes(opt.value))

      if (selectedOptions.length === 1) {
        return selectedOptions[0].label
      } else if (selectedOptions.length <= 3) {
        return selectedOptions.map(opt => opt.label).join(", ")
      } else {
        return `${selectedOptions.length} selected`
      }
    } else {
      const selectedOption = options.find(opt => opt.value === selectedValues[0])
      return selectedOption?.label || placeholder
    }
  }

  // Handle option selection
  const handleSelect = (optionValue: string) => {
    if (disabled) return

    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : maxSelected && selectedValues.length >= maxSelected
          ? selectedValues
          : [...selectedValues, optionValue]

      onValueChange?.(newValues)
    } else {
      onValueChange?.(optionValue)
      setOpen(false)
    }
  }

  // Clear all selections
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onValueChange?.(multiple ? [] : "")
  }

  // Remove specific selection (for multiple mode)
  const handleRemoveSelection = (valueToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (multiple) {
      const newValues = selectedValues.filter(v => v !== valueToRemove)
      onValueChange?.(newValues)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
          disabled={disabled}
        >
          <div className="flex items-center gap-1 flex-1 overflow-hidden">
            {multiple && selectedValues.length > 0 ? (
              <div className="flex items-center gap-1 flex-wrap max-w-full">
                {selectedValues.slice(0, 3).map(val => {
                  const option = options.find(opt => opt.value === val)
                  return option ? (
                    <Badge
                      key={val}
                      variant="secondary"
                      className="text-xs gap-1"
                    >
                      {showColors && option.color && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                      {option.label}
                      <div
                        className="h-3 w-3 p-0 hover:bg-muted rounded-sm cursor-pointer flex items-center justify-center"
                        onClick={(e) => handleRemoveSelection(val, e)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleRemoveSelection(val, e as any)
                          }
                        }}
                      >
                        <X className="h-2 w-2" />
                      </div>
                    </Badge>
                  ) : null
                })}
                {selectedValues.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{selectedValues.length - 3} more
                  </Badge>
                )}
              </div>
            ) : (
              <span className={cn(
                "truncate",
                !selectedValues.length && "text-muted-foreground"
              )}>
                {getSelectedDisplay()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {clearable && selectedValues.length > 0 && (
              <div
                className="h-4 w-4 p-0 hover:bg-muted rounded-sm cursor-pointer flex items-center justify-center"
                onClick={handleClear}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleClear(e as any)
                  }
                }}
              >
                <X className="h-3 w-3" />
              </div>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-9"
          />
          <CommandEmpty>{emptyMessage}</CommandEmpty>

          <div className="max-h-60 overflow-auto">
            {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
              <CommandGroup key={groupName} heading={groupName || undefined}>
                {groupOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value)

                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className="flex items-center gap-2 py-2"
                    >
                      {multiple && (
                        <div className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}>
                          <Check className={cn("h-3 w-3")} />
                        </div>
                      )}

                      {!multiple && (
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                      )}

                      {showColors && option.color && (
                        <div
                          className="w-3 h-3 rounded-full border"
                          style={{ backgroundColor: option.color }}
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{option.label}</div>
                        {showDescriptions && option.description && (
                          <div className="text-xs text-muted-foreground truncate">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))}
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Simplified wrapper for single selection
export function Select({
  options,
  value,
  onValueChange,
  placeholder,
  className,
  disabled,
}: Omit<SearchableSelectProps, "multiple">) {
  return (
    <SearchableSelect
      options={options}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      multiple={false}
    />
  )
}

// Simplified wrapper for multi-selection
export function MultiSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select options...",
  className,
  disabled,
  maxSelected,
}: Omit<SearchableSelectProps, "multiple">) {
  return (
    <SearchableSelect
      options={options}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      multiple={true}
      maxSelected={maxSelected}
    />
  )
}