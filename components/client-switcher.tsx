"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Building2, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useClient } from "@/components/client-context"
import { mockClients } from "@/lib/mock-data"

export function ClientSwitcher() {
  const { clientId, setClientId, selectedClient } = useClient()
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          {selectedClient ? (
            <div className="flex items-center gap-2 truncate">
              {selectedClient.type === "Company" ? (
                <Building2 className="h-4 w-4 shrink-0 opacity-50" />
              ) : (
                <User className="h-4 w-4 shrink-0 opacity-50" />
              )}
              <span className="truncate">{selectedClient.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 truncate">
              <Building2 className="h-4 w-4 shrink-0 opacity-50" />
              <span className="truncate">All Clients</span>
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search client..." />
          <CommandList>
            <CommandEmpty>No client found.</CommandEmpty>
            <CommandGroup heading="System">
              <CommandItem
                onSelect={() => {
                  setClientId(null)
                  setOpen(false)
                }}
              >
                <Check className={cn("mr-2 h-4 w-4", clientId === null ? "opacity-100" : "opacity-0")} />
                All Clients
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Clients">
              {mockClients.map((client) => (
                <CommandItem
                  key={client.id}
                  onSelect={() => {
                    setClientId(client.id)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", clientId === client.id ? "opacity-100" : "opacity-0")} />
                  <div className="flex items-center gap-2 truncate">
                    {client.type === "Company" ? (
                      <Building2 className="h-3 w-3 opacity-50" />
                    ) : (
                      <User className="h-3 w-3 opacity-50" />
                    )}
                    <span className="truncate">{client.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
