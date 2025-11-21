"use client"

import * as React from "react"

type Brand = "GCMC" | "KAJ"

interface BrandContextType {
  brand: Brand
  setBrand: (brand: Brand) => void
}

const BrandContext = React.createContext<BrandContextType | undefined>(undefined)

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrand] = React.useState<Brand>("KAJ")

  return <BrandContext.Provider value={{ brand, setBrand }}>{children}</BrandContext.Provider>
}

export function useBrand() {
  const context = React.useContext(BrandContext)
  if (context === undefined) {
    throw new Error("useBrand must be used within a BrandProvider")
  }
  return context
}
