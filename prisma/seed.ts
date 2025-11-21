import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Hash passwords
  const adminPassword = await bcrypt.hash("admin123", 12)
  const gcmcPassword = await bcrypt.hash("gcmc123", 12)
  const kajPassword = await bcrypt.hash("kaj123", 12)
  const clientPassword = await bcrypt.hash("client123", 12)

  // Create a test user (Super Admin)
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@gcmc.gy" },
    update: {},
    create: {
      email: "admin@gcmc.gy",
      name: "System Administrator",
      passwordHash: adminPassword,
      role: "SUPER_ADMIN",
    },
  })

  // Create GCMC staff user
  const gcmcUser = await prisma.user.upsert({
    where: { email: "gcmc@gcmc.gy" },
    update: {},
    create: {
      email: "gcmc@gcmc.gy",
      name: "GCMC Staff Member",
      passwordHash: gcmcPassword,
      role: "GCMC_STAFF",
    },
  })

  // Create KAJ staff user
  const kajUser = await prisma.user.upsert({
    where: { email: "kaj@gcmc.gy" },
    update: {},
    create: {
      email: "kaj@gcmc.gy",
      name: "KAJ Staff Member",
      passwordHash: kajPassword,
      role: "KAJ_STAFF",
    },
  })

  // Create test clients
  const client1 = await prisma.client.upsert({
    where: { id: "abc-corp-ltd" },
    update: {},
    create: {
      id: "abc-corp-ltd",
      name: "ABC Corporation Ltd",
      type: "COMPANY",
      tin: "123-456-789",
      nis: "NIS-987654",
      email: "contact@abccorp.gy",
      phone: "+592-555-0100",
      address: "123 Main Street, Georgetown, Guyana",
    },
  })

  const client2 = await prisma.client.upsert({
    where: { id: "guyana-tech" },
    update: {},
    create: {
      id: "guyana-tech",
      name: "Guyana Tech Solutions",
      type: "COMPANY",
      tin: "456-789-123",
      nis: "NIS-123456",
      email: "info@guyanatech.gy",
      phone: "+592-555-0200",
      address: "456 Tech Park, Georgetown, Guyana",
    },
  })

  // Create client user linked to client1
  const clientUser = await prisma.user.upsert({
    where: { email: "client@abccorp.gy" },
    update: {},
    create: {
      email: "client@abccorp.gy",
      name: "ABC Corp Client User",
      passwordHash: clientPassword,
      role: "CLIENT",
    },
  })

  // Create test employees for client1
  await prisma.employee.create({
    data: {
      fullName: "Michael Johnson",
      nis: "NIS-111222",
      tin: "TIN-111222",
      position: "Operations Manager",
      salary: 180000,
      hiredDate: new Date("2023-01-15"),
      clientId: client1.id,
    },
  })

  await prisma.employee.create({
    data: {
      fullName: "Sarah Williams",
      nis: "NIS-222333",
      tin: "TIN-222333",
      position: "Accountant",
      salary: 150000,
      hiredDate: new Date("2023-03-20"),
      clientId: client1.id,
    },
  })

  // Create a test tax return
  await prisma.taxReturn.create({
    data: {
      filingType: "VAT",
      period: "2025-Q1",
      status: "PENDING",
      amountDue: 45000,
      clientId: client1.id,
    },
  })

  // Create a test NIS schedule
  await prisma.nISSchedule.create({
    data: {
      month: "January 2025",
      totalWages: 330000,
      employeeDed: 18480, // 5.6% of total wages
      employerCont: 27720, // 8.4% of total wages
      totalRemit: 46200, // 14% of total wages
      status: "DRAFT",
      clientId: client1.id,
    },
  })

  // Create a test visa application
  await prisma.visaApplication.create({
    data: {
      applicantName: "John Smith",
      permitType: "WORK_PERMIT",
      expiryDate: new Date("2026-12-31"),
      status: "UNDER_REVIEW",
      clientId: client2.id,
    },
  })

  // Create test partners
  await prisma.partner.createMany({
    data: [
      {
        companyName: "Elite Real Estate",
        category: "REAL_ESTATE",
        contactPerson: "David Martinez",
        phone: "+592-555-0300",
        email: "david@elitere.gy",
        website: "https://elitere.gy",
      },
      {
        companyName: "Tech Fix Solutions",
        category: "IT_TECHNICIAN",
        contactPerson: "Jennifer Lee",
        phone: "+592-555-0400",
        email: "jen@techfix.gy",
      },
    ],
  })

  console.log("Database seeded successfully!")
  console.log(`Created admin user: ${adminUser.email}`)
  console.log(`Created clients: ${client1.name}, ${client2.name}`)
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
