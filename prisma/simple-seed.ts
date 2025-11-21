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

  // Create test client
  const client1 = await prisma.client.upsert({
    where: { id: "abc-corp-ltd" },
    update: {},
    create: {
      id: "abc-corp-ltd",
      name: "ABC Corporation Ltd",
      type: "COMPANY",
      tin: "123456789",
      nis: "987654321",
      email: "contact@abccorp.gy",
      phone: "+592-555-0100",
      address: "123 Main Street, Georgetown, Guyana",
    },
  })

  // Create client user
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

  // Create a test filing
  await prisma.filing.create({
    data: {
      clientId: client1.id,
      type: "VAT_RETURN",
      agency: "GRA",
      status: "DRAFT",
      amount: 15000.00,
      dueDate: new Date("2024-02-15"),
      period: "2024-01",
    },
  })

  console.log("Database seeded successfully!")
  console.log(`Admin: admin@gcmc.gy / admin123`)
  console.log(`GCMC Staff: gcmc@gcmc.gy / gcmc123`)
  console.log(`KAJ Staff: kaj@gcmc.gy / kaj123`)
  console.log(`Client: client@abccorp.gy / client123`)
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })