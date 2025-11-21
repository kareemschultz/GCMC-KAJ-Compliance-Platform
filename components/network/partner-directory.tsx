"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, MapPin, Phone, Mail, ExternalLink } from "lucide-react"

const PARTNERS = [
  {
    id: 1,
    name: "Guyana Real Estate Services",
    category: "Real Estate",
    contact: "James Wilson",
    email: "james@guyana-re.com",
    phone: "+592 600-1234",
    location: "Georgetown",
    description: "Specializing in commercial office space and expat housing.",
    verified: true,
  },
  {
    id: 2,
    name: "TechSolutions GY",
    category: "IT Services",
    contact: "Sarah Persaud",
    email: "support@techgy.com",
    phone: "+592 622-5678",
    location: "Remote / On-site",
    description: "Network setup, cybersecurity audits, and hardware procurement.",
    verified: true,
  },
  {
    id: 3,
    name: "Persaud & Associates",
    category: "Legal",
    contact: "Anil Persaud",
    email: "anil@persaudlaw.gy",
    phone: "+592 225-9876",
    location: "Georgetown",
    description: "Corporate law, litigation, and property disputes.",
    verified: true,
  },
  {
    id: 4,
    name: "BuildRight Construction",
    category: "Construction",
    contact: "Mike Johnson",
    email: "mike@buildright.gy",
    phone: "+592 611-4321",
    location: "East Coast Demerara",
    description: "Commercial renovation and office fit-outs.",
    verified: false,
  },
]

export function PartnerDirectory() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  const filteredPartners = PARTNERS.filter((partner) => {
    const matchesSearch =
      partner.name.toLowerCase().includes(search.toLowerCase()) ||
      partner.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === "All" || partner.category === category
    return matchesSearch && matchesCategory
  })

  const categories = ["All", ...Array.from(new Set(PARTNERS.map((p) => p.category)))]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search partners..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(cat)}
              className="whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPartners.map((partner) => (
          <Card key={partner.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
              <Avatar className="h-12 w-12 rounded-lg border">
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold">
                  {partner.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <CardTitle className="text-base leading-none">{partner.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px] font-normal">
                    {partner.category}
                  </Badge>
                  {partner.verified && (
                    <Badge variant="outline" className="border-green-200 text-[10px] text-green-700 bg-green-50">
                      Verified Partner
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-sm text-muted-foreground line-clamp-2">{partner.description}</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{partner.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${partner.email}`} className="hover:underline">
                    {partner.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{partner.phone}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button className="w-full" size="sm">
                  Contact
                </Button>
                <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
