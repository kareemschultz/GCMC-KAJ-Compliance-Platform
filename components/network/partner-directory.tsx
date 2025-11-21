"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Phone, Mail, Globe, MapPin, CheckCircle2, Building, Laptop, Scale, HardHat } from "lucide-react"
import { api } from "@/lib/api"
import type { Partner } from "@/types"
import { AddPartnerDialog } from "./add-partner-dialog"

export function PartnerDirectory() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await api.partners.list()
        setPartners(data)
      } catch (error) {
        console.error("Failed to fetch partners:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [])

  const filteredPartners = partners.filter(
    (partner) =>
      partner.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "REAL_ESTATE":
        return <Building className="h-4 w-4" />
      case "IT_TECHNICIAN":
        return <Laptop className="h-4 w-4" />
      case "LAW_FIRM":
        return <Scale className="h-4 w-4" />
      case "CONSTRUCTION":
        return <HardHat className="h-4 w-4" />
      default:
        return <Building className="h-4 w-4" />
    }
  }

  const getCategoryLabel = (category: string) => {
    return category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search partners..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <AddPartnerDialog />
      </div>

      <Tabs defaultValue="ALL" className="w-full">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0 md:w-auto md:bg-muted md:p-1">
          <TabsTrigger
            value="ALL"
            className="flex-1 md:flex-none data-[state=active]:bg-muted md:data-[state=active]:bg-background"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="REAL_ESTATE"
            className="flex-1 md:flex-none data-[state=active]:bg-muted md:data-[state=active]:bg-background"
          >
            Real Estate
          </TabsTrigger>
          <TabsTrigger
            value="IT_TECHNICIAN"
            className="flex-1 md:flex-none data-[state=active]:bg-muted md:data-[state=active]:bg-background"
          >
            IT & Tech
          </TabsTrigger>
          <TabsTrigger
            value="LAW_FIRM"
            className="flex-1 md:flex-none data-[state=active]:bg-muted md:data-[state=active]:bg-background"
          >
            Legal
          </TabsTrigger>
          <TabsTrigger
            value="CONSTRUCTION"
            className="flex-1 md:flex-none data-[state=active]:bg-muted md:data-[state=active]:bg-background"
          >
            Construction
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ALL" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPartners.map((partner) => (
              <PartnerCard
                key={partner.id}
                partner={partner}
                getCategoryIcon={getCategoryIcon}
                getCategoryLabel={getCategoryLabel}
              />
            ))}
          </div>
        </TabsContent>

        {["REAL_ESTATE", "IT_TECHNICIAN", "LAW_FIRM", "CONSTRUCTION"].map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPartners
                .filter((p) => p.category === category)
                .map((partner) => (
                  <PartnerCard
                    key={partner.id}
                    partner={partner}
                    getCategoryIcon={getCategoryIcon}
                    getCategoryLabel={getCategoryLabel}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function PartnerCard({
  partner,
  getCategoryIcon,
  getCategoryLabel,
}: {
  partner: Partner
  getCategoryIcon: (c: string) => React.ReactNode
  getCategoryLabel: (c: string) => string
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {getCategoryIcon(partner.category)}
            </div>
            <div>
              <CardTitle className="text-base">{partner.companyName}</CardTitle>
              <CardDescription className="text-xs">{getCategoryLabel(partner.category)}</CardDescription>
            </div>
          </div>
          {partner.verified && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-green-500/10 text-green-600 hover:bg-green-500/20"
            >
              <CheckCircle2 className="h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{partner.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="h-4 w-4" />
          <a href={`mailto:${partner.email}`} className="hover:text-primary hover:underline">
            {partner.email}
          </a>
        </div>
        {partner.website && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="h-4 w-4" />
            <a
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary hover:underline"
            >
              Website
            </a>
          </div>
        )}
        {partner.location && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{partner.location}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full bg-transparent">
          View Profile
        </Button>
      </CardFooter>
    </Card>
  )
}
