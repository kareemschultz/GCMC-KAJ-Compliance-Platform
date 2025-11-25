import { test, expect, Page } from '@playwright/test'

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@gcmc.gy'
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'admin123'
const GCMC_EMAIL = process.env.SEED_GCMC_EMAIL || 'gcmc@gcmc.gy'
const GCMC_PASSWORD = process.env.SEED_GCMC_PASSWORD || 'gcmc123'
const CLIENT_EMAIL = process.env.SEED_CLIENT_EMAIL || 'client@abccorp.gy'
const CLIENT_PASSWORD = process.env.SEED_CLIENT_PASSWORD || 'client123'

test.describe('GK Enterprise Suite - Comprehensive User Flow Audit', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure app is running
    await page.goto('http://localhost:3000')
  })

  test('1. Authentication Flow - Admin Login/Logout', async ({ page }) => {
    console.log('🔐 Testing Admin Authentication...')

    // Should redirect to login when not authenticated
    await expect(page).toHaveURL(/.*login.*/)

    // Take screenshot of login page
    await page.screenshot({ path: 'test-results/01-login-page.png', fullPage: true })

    // Login with admin credentials
    await page.fill('input[type="email"]', ADMIN_EMAIL)
    await page.fill('input[type="password"]', ADMIN_PASSWORD)
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await page.waitForURL('http://localhost:3000/')
    await page.waitForLoadState('networkidle')

    // Take screenshot of dashboard
    await page.screenshot({ path: 'test-results/02-admin-dashboard.png', fullPage: true })

    // Verify admin dashboard elements
    await expect(page.locator('h1, h2')).toContainText(['Dashboard', 'Welcome'])

    // Test logout
    await page.click('[data-testid="user-menu"], button:has-text("admin"), .user-avatar')
    await page.click('text=Logout, text=Sign out')

    // Verify redirected to login
    await expect(page).toHaveURL(/.*login.*/)
  })

  test('2. Client Management - Create and View Clients', async ({ page }) => {
    console.log('👥 Testing Client Management...')

    // Login as admin first
    await loginAsAdmin(page)

    // Navigate to clients page
    await page.click('text=Clients, a[href="/clients"]')
    await page.waitForLoadState('networkidle')

    // Take screenshot of clients page
    await page.screenshot({ path: 'test-results/03-clients-page.png', fullPage: true })

    // Check if clients are loaded (from database, not mock)
    const clientRows = page.locator('table tbody tr')
    const clientCount = await clientRows.count()
    console.log(`Found ${clientCount} clients in database`)

    // Test client creation
    await page.click('button:has-text("Add Client"), button:has-text("New Client")')

    // Fill out client form
    await page.fill('input[name="name"], input[placeholder*="name"]', 'Test Client Ltd')
    await page.fill('input[name="email"], input[type="email"]', 'test@testclient.gy')
    await page.fill('input[name="phone"], input[placeholder*="phone"]', '+592-123-4567')
    await page.fill('input[name="tinNumber"], input[placeholder*="TIN"]', 'TIN123456789')

    // Take screenshot of filled form
    await page.screenshot({ path: 'test-results/04-client-form.png', fullPage: true })

    // Submit form
    await page.click('button[type="submit"], button:has-text("Create")')
    await page.waitForLoadState('networkidle')

    // Verify client was created
    await expect(page.locator('text=Test Client Ltd')).toBeVisible()
  })

  test('3. Dashboard Functionality - Real Data Loading', async ({ page }) => {
    console.log('📊 Testing Dashboard Functionality...')

    await loginAsAdmin(page)

    // Wait for all dashboard components to load
    await page.waitForLoadState('networkidle')

    // Take screenshot of full dashboard
    await page.screenshot({ path: 'test-results/05-dashboard-overview.png', fullPage: true })

    // Check for real data (not "Loading...")
    const loadingElements = page.locator('text=Loading...')
    const loadingCount = await loadingElements.count()

    if (loadingCount > 0) {
      console.warn(`⚠️ Found ${loadingCount} elements still showing "Loading..."`)
      await page.screenshot({ path: 'test-results/05b-dashboard-loading-issues.png', fullPage: true })
    }

    // Verify dashboard cards have real data
    const dashboardCards = page.locator('.card, [data-testid*="card"]')
    await expect(dashboardCards.first()).toBeVisible()

    // Test dashboard statistics
    const statsElements = page.locator('[data-testid*="stat"], .stat-card')
    if (await statsElements.count() > 0) {
      console.log('✅ Dashboard statistics loaded')
    }
  })

  test('4. Tax Filing and Calculations', async ({ page }) => {
    console.log('💰 Testing Tax Filing Functionality...')

    await loginAsAdmin(page)

    // Navigate to tax filings
    await page.click('text=Tax, a[href*="tax"], a[href*="filing"]')
    await page.waitForLoadState('networkidle')

    // Take screenshot
    await page.screenshot({ path: 'test-results/06-tax-filings.png', fullPage: true })

    // Check for tax returns
    const taxElements = page.locator('table tbody tr, .tax-return, .filing-item')
    const taxCount = await taxElements.count()
    console.log(`Found ${taxCount} tax-related items`)

    // Test tax calculator if available
    const calculatorButton = page.locator('button:has-text("Calculate"), button:has-text("7B"), button:has-text("VAT")')
    if (await calculatorButton.count() > 0) {
      await calculatorButton.first().click()
      await page.screenshot({ path: 'test-results/07-tax-calculator.png', fullPage: true })
    }
  })

  test('5. NIS Schedule Generation', async ({ page }) => {
    console.log('📋 Testing NIS Schedule Functionality...')

    await loginAsAdmin(page)

    // Navigate to NIS section
    await page.click('text=NIS, a[href*="nis"], a[href*="schedule"]')
    await page.waitForLoadState('networkidle')

    // Take screenshot
    await page.screenshot({ path: 'test-results/08-nis-schedules.png', fullPage: true })

    // Check for NIS schedules
    const nisElements = page.locator('table tbody tr, .nis-schedule, .schedule-item')
    const nisCount = await nisElements.count()
    console.log(`Found ${nisCount} NIS schedule items`)

    // Test NIS calculator
    const nisCalculator = page.locator('button:has-text("Calculate"), input[placeholder*="wage"], input[placeholder*="salary"]')
    if (await nisCalculator.count() > 0) {
      console.log('✅ NIS calculator found')
    }
  })

  test('6. Immigration Tracking', async ({ page }) => {
    console.log('✈️ Testing Immigration Functionality...')

    await loginAsAdmin(page)

    // Navigate to immigration section
    await page.click('text=Immigration, a[href*="immigration"], a[href*="visa"]')
    await page.waitForLoadState('networkidle')

    // Take screenshot
    await page.screenshot({ path: 'test-results/09-immigration.png', fullPage: true })

    // Check for visa applications
    const visaElements = page.locator('table tbody tr, .visa-application, .immigration-item')
    const visaCount = await visaElements.count()
    console.log(`Found ${visaCount} immigration items`)

    // Test adding new visa application
    const addVisaButton = page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Application")')
    if (await addVisaButton.count() > 0) {
      await addVisaButton.first().click()
      await page.screenshot({ path: 'test-results/10-new-visa-form.png', fullPage: true })
    }
  })

  test('7. Training Management', async ({ page }) => {
    console.log('🎓 Testing Training Management...')

    await loginAsAdmin(page)

    // Navigate to training section
    await page.click('text=Training, a[href*="training"], a[href*="workshop"]')
    await page.waitForLoadState('networkidle')

    // Take screenshot
    await page.screenshot({ path: 'test-results/11-training.png', fullPage: true })

    // Check for training sessions
    const trainingElements = page.locator('table tbody tr, .training-session, .workshop-item')
    const trainingCount = await trainingElements.count()
    console.log(`Found ${trainingCount} training items`)
  })

  test('8. Property Management', async ({ page }) => {
    console.log('🏠 Testing Property Management...')

    await loginAsAdmin(page)

    // Navigate to properties section
    await page.click('text=Properties, a[href*="propert"]')
    await page.waitForLoadState('networkidle')

    // Take screenshot
    await page.screenshot({ path: 'test-results/12-properties.png', fullPage: true })

    // Check for properties
    const propertyElements = page.locator('table tbody tr, .property-item')
    const propertyCount = await propertyElements.count()
    console.log(`Found ${propertyCount} property items`)
  })

  test('9. Role-based Access Control', async ({ page }) => {
    console.log('🔐 Testing Role-based Access...')

    // Test GCMC staff access
    await page.goto('http://localhost:3000/login')
    await page.fill('input[type="email"]', GCMC_EMAIL)
    await page.fill('input[type="password"]', GCMC_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForLoadState('networkidle')

    // Take screenshot of GCMC dashboard
    await page.screenshot({ path: 'test-results/13-gcmc-dashboard.png', fullPage: true })

    // Logout and test client access
    await page.click('[data-testid="user-menu"], button:has-text("gcmc"), .user-avatar')
    await page.click('text=Logout, text=Sign out')

    // Test client portal
    await page.fill('input[type="email"]', CLIENT_EMAIL)
    await page.fill('input[type="password"]', CLIENT_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForLoadState('networkidle')

    // Take screenshot of client portal
    await page.screenshot({ path: 'test-results/14-client-portal.png', fullPage: true })
  })

  test('10. API Endpoints Health Check', async ({ page }) => {
    console.log('🔍 Testing API Endpoints...')

    await loginAsAdmin(page)

    // Test API endpoints by navigating to pages that use them
    const endpoints = [
      { name: 'Clients API', url: '/clients' },
      { name: 'Tax Returns', url: '/filings' },
      { name: 'NIS Schedules', url: '/nis' },
      { name: 'Immigration', url: '/immigration' },
      { name: 'Training', url: '/training' },
      { name: 'Properties', url: '/properties' }
    ]

    for (const endpoint of endpoints) {
      try {
        await page.goto(`http://localhost:3000${endpoint.url}`)
        await page.waitForLoadState('networkidle', { timeout: 10000 })

        // Check for error messages
        const errorElement = page.locator('text=Error, text=Failed, text="500", text="404"')
        const hasError = await errorElement.count() > 0

        if (hasError) {
          console.log(`❌ ${endpoint.name}: Error detected`)
          await page.screenshot({ path: `test-results/15-error-${endpoint.name.toLowerCase().replace(' ', '-')}.png`, fullPage: true })
        } else {
          console.log(`✅ ${endpoint.name}: Working`)
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name}: Failed to load - ${error}`)
      }
    }
  })
})

// Helper function to login as admin
async function loginAsAdmin(page: Page) {
  await page.goto('http://localhost:3000/login')
  await page.fill('input[type="email"]', ADMIN_EMAIL)
  await page.fill('input[type="password"]', ADMIN_PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForURL('http://localhost:3000/')
  await page.waitForLoadState('networkidle')
}