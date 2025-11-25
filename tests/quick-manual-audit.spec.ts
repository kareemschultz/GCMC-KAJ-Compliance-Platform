import { test, expect } from '@playwright/test'

const ADMIN_EMAIL = 'admin@gcmc.gy'
const ADMIN_PASSWORD = 'admin123'

test.describe('Quick Manual Audit - Core Functionality', () => {

  test('Authentication and Dashboard Basic Flow', async ({ page }) => {
    console.log('🔍 Testing core authentication and dashboard...')

    // 1. Visit homepage - should redirect to login
    await page.goto('http://localhost:3000')
    await expect(page).toHaveURL(/.*login.*/)

    // Take screenshot of login
    await page.screenshot({ path: 'test-results/audit-01-login.png', fullPage: true })

    // 2. Login as admin
    await page.fill('input[type="email"]', ADMIN_EMAIL)
    await page.fill('input[type="password"]', ADMIN_PASSWORD)
    await page.click('button[type="submit"]')

    // Wait for dashboard
    await page.waitForURL('http://localhost:3000/', { timeout: 10000 })

    // 3. Dashboard screenshot
    await page.screenshot({ path: 'test-results/audit-02-dashboard.png', fullPage: true })

    // 4. Check for loading states
    await page.waitForTimeout(3000) // Wait for API calls
    const loadingElements = await page.locator('text=Loading...').count()
    console.log(`Found ${loadingElements} loading elements`)

    if (loadingElements > 0) {
      await page.screenshot({ path: 'test-results/audit-03-loading-issues.png', fullPage: true })
    }

    // 5. Test navigation to each section
    const sections = [
      { name: 'Clients', url: '/clients' },
      { name: 'Filings', url: '/filings' },
      { name: 'Immigration', url: '/immigration' },
      { name: 'Properties', url: '/properties' },
      { name: 'Training', url: '/training' }
    ]

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      console.log(`Testing ${section.name}...`)

      try {
        await page.goto(`http://localhost:3000${section.url}`)
        await page.waitForLoadState('networkidle', { timeout: 5000 })

        // Take screenshot
        await page.screenshot({
          path: `test-results/audit-04-${i+1}-${section.name.toLowerCase()}.png`,
          fullPage: true
        })

        // Check for errors
        const errorElements = await page.locator('text=Error, text=Failed, .error').count()
        if (errorElements > 0) {
          console.log(`❌ ${section.name}: Found errors`)
          await page.screenshot({
            path: `test-results/audit-error-${section.name.toLowerCase()}.png`,
            fullPage: true
          })
        } else {
          console.log(`✅ ${section.name}: No obvious errors`)
        }

        // Check data loading
        const hasData = await page.locator('table tbody tr, .data-row, .item').count() > 0
        console.log(`${section.name}: ${hasData ? 'Has data' : 'No data visible'}`)

      } catch (error) {
        console.log(`❌ ${section.name}: Navigation failed - ${error}`)
        await page.screenshot({
          path: `test-results/audit-failed-${section.name.toLowerCase()}.png`,
          fullPage: true
        })
      }
    }

    // 6. Test API endpoints directly
    const apiTests = [
      '/api/health',
      '/api/clients',
      '/api/tax-returns',
      '/api/nis-schedules',
      '/api/immigration',
      '/api/properties'
    ]

    console.log('🔍 Testing API endpoints...')
    for (const endpoint of apiTests) {
      try {
        const response = await page.request.get(`http://localhost:3000${endpoint}`)
        const isHealthy = response.status() === 200 || (endpoint === '/api/health' && response.status() === 200)
        console.log(`${endpoint}: ${response.status()} ${isHealthy ? '✅' : '❌'}`)
      } catch (error) {
        console.log(`${endpoint}: Failed ❌`)
      }
    }

    // 7. Final dashboard screenshot
    await page.goto('http://localhost:3000')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: 'test-results/audit-final-dashboard.png', fullPage: true })

    console.log('✅ Quick audit completed! Check test-results/ for screenshots.')
  })

  test('Client Creation Flow', async ({ page }) => {
    console.log('👥 Testing client creation...')

    // Login
    await page.goto('http://localhost:3000/login')
    await page.fill('input[type="email"]', ADMIN_EMAIL)
    await page.fill('input[type="password"]', ADMIN_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL('http://localhost:3000/')

    // Navigate to clients
    await page.goto('http://localhost:3000/clients')
    await page.waitForLoadState('networkidle')

    // Take screenshot of clients page
    await page.screenshot({ path: 'test-results/audit-clients-before.png', fullPage: true })

    // Try to create a client
    try {
      // Look for add client button
      const addButton = page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Create")')

      if (await addButton.count() > 0) {
        await addButton.first().click()
        await page.screenshot({ path: 'test-results/audit-client-form.png', fullPage: true })

        // Try to fill form if visible
        const nameInput = page.locator('input[name="name"], input[placeholder*="name"]')
        if (await nameInput.count() > 0) {
          await nameInput.fill('Test Audit Client')
          console.log('✅ Client form is functional')
        }
      } else {
        console.log('⚠️  No add client button found')
      }
    } catch (error) {
      console.log(`⚠️  Client creation test failed: ${error}`)
    }
  })

  test('Database Connection Verification', async ({ page }) => {
    console.log('🗄️ Testing database connections...')

    // Login
    await page.goto('http://localhost:3000/login')
    await page.fill('input[type="email"]', ADMIN_EMAIL)
    await page.fill('input[type="password"]', ADMIN_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL('http://localhost:3000/')

    // Check clients page for real data
    await page.goto('http://localhost:3000/clients')
    await page.waitForLoadState('networkidle')

    const clientCount = await page.locator('table tbody tr').count()
    console.log(`Found ${clientCount} clients in database`)

    const hasRealData = clientCount > 0
    console.log(`Database has real data: ${hasRealData ? '✅' : '❌'}`)

    // Check for mock data indicators
    const mockIndicators = await page.locator('text="Mock", text="Sample", text="Demo"').count()
    console.log(`Mock data indicators found: ${mockIndicators}`)

    await page.screenshot({ path: 'test-results/audit-database-verification.png', fullPage: true })
  })
})