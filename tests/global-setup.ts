import { chromium, FullConfig } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Global setup started...');

  // Initialize database if needed
  if (process.env.DATABASE_URL) {
    console.log('📊 Setting up test database...');
    const prisma = new PrismaClient();

    try {
      // Clean up any existing test data
      await prisma.user.deleteMany({ where: { email: { contains: 'test' } } });
      await prisma.client.deleteMany({ where: { name: { contains: 'Test' } } });

      // Create test users with known credentials
      const adminPassword = await bcrypt.hash('admin123', 12);
      const gcmcPassword = await bcrypt.hash('gcmc123', 12);
      const kajPassword = await bcrypt.hash('kaj123', 12);
      const clientPassword = await bcrypt.hash('client123', 12);

      // Create test client first
      const testClient = await prisma.client.create({
        data: {
          name: 'Test Corporation Ltd',
          type: 'COMPANY',
          tinNumber: 'TEST-123-456',
          nisNumber: 'NIS-TEST-789',
          email: 'test@testcorp.gy',
          phone: '+592-555-TEST',
          address: 'Test Street, Georgetown, Guyana',
        },
      });

      // Create test users
      await prisma.user.upsert({
        where: { email: 'admin@gcmc.gy' },
        update: { passwordHash: adminPassword },
        create: {
          email: 'admin@gcmc.gy',
          fullName: 'Test Admin',
          passwordHash: adminPassword,
          role: 'SUPER_ADMIN',
        },
      });

      await prisma.user.upsert({
        where: { email: 'gcmc@gcmc.gy' },
        update: { passwordHash: gcmcPassword },
        create: {
          email: 'gcmc@gcmc.gy',
          fullName: 'GCMC Test Staff',
          passwordHash: gcmcPassword,
          role: 'GCMC_STAFF',
        },
      });

      await prisma.user.upsert({
        where: { email: 'kaj@gcmc.gy' },
        update: { passwordHash: kajPassword },
        create: {
          email: 'kaj@gcmc.gy',
          fullName: 'KAJ Test Staff',
          passwordHash: kajPassword,
          role: 'KAJ_STAFF',
        },
      });

      await prisma.user.upsert({
        where: { email: 'client@testcorp.gy' },
        update: { passwordHash: clientPassword },
        create: {
          email: 'client@testcorp.gy',
          fullName: 'Test Client User',
          passwordHash: clientPassword,
          role: 'CLIENT',
          clientId: testClient.id,
        },
      });

      console.log('✅ Test database setup complete');
      await prisma.$disconnect();
    } catch (error) {
      console.error('❌ Database setup failed:', error);
      await prisma.$disconnect();
    }
  }

  // Create authenticated browser contexts for different user roles
  console.log('🔐 Setting up authenticated browser contexts...');

  const browser = await chromium.launch();

  // Admin context
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  await adminPage.goto('http://localhost:3000/login');
  await adminPage.fill('input[type="email"]', 'admin@gcmc.gy');
  await adminPage.fill('input[type="password"]', 'admin123');
  await adminPage.click('button[type="submit"]');
  await adminPage.waitForURL('http://localhost:3000/');
  await adminContext.storageState({ path: './tests/auth/admin-storage-state.json' });

  // GCMC Staff context
  const gcmcContext = await browser.newContext();
  const gcmcPage = await gcmcContext.newPage();
  await gcmcPage.goto('http://localhost:3000/login');
  await gcmcPage.fill('input[type="email"]', 'gcmc@gcmc.gy');
  await gcmcPage.fill('input[type="password"]', 'gcmc123');
  await gcmcPage.click('button[type="submit"]');
  await gcmcPage.waitForURL('http://localhost:3000/');
  await gcmcContext.storageState({ path: './tests/auth/gcmc-storage-state.json' });

  // KAJ Staff context
  const kajContext = await browser.newContext();
  const kajPage = await kajContext.newPage();
  await kajPage.goto('http://localhost:3000/login');
  await kajPage.fill('input[type="email"]', 'kaj@gcmc.gy');
  await kajPage.fill('input[type="password"]', 'kaj123');
  await kajPage.click('button[type="submit"]');
  await kajPage.waitForURL('http://localhost:3000/');
  await kajContext.storageState({ path: './tests/auth/kaj-storage-state.json' });

  // Client context
  const clientContext = await browser.newContext();
  const clientPage = await clientContext.newPage();
  await clientPage.goto('http://localhost:3000/login');
  await clientPage.fill('input[type="email"]', 'client@testcorp.gy');
  await clientPage.fill('input[type="password"]', 'client123');
  await clientPage.click('button[type="submit"]');
  await clientPage.waitForURL('http://localhost:3000/portal');
  await clientContext.storageState({ path: './tests/auth/client-storage-state.json' });

  await browser.close();

  console.log('✅ Global setup completed successfully!');
}

export default globalSetup;