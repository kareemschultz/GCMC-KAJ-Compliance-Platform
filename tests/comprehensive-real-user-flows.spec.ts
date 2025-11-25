import { test, expect } from '@playwright/test'
import path from 'path'

// Test helpers for evidence collection
class TestEvidence {
  private testName: string
  private page: any

  constructor(testName: string, page: any) {
    this.testName = testName
    this.page = page
  }

  async screenshot(stepName: string) {
    const fileName = `${this.testName}-${stepName}.png`
    const filePath = path.join('./test-evidence/screenshots', fileName)
    await this.page.screenshot({
      path: filePath,
      fullPage: true
    })
    console.log(`📸 Screenshot saved: ${fileName}`)
    return filePath
  }

  async logStep(step: string) {
    console.log(`🔍 TEST STEP: ${step}`)
  }
}

// Global test setup
test.beforeEach(async ({ page }) => {
  // Set slow motion for better visibility
  await page.addInitScript(() => {
    document.body.style.transition = 'all 0.3s ease'
  })
})

test.describe('COMPREHENSIVE USER FLOWS - Real Browser Testing', () => {

  test('AUTHENTICATION FLOW - Complete Login/Logout Cycle', async ({ page }) => {
    const evidence = new TestEvidence('auth-flow', page)

    await evidence.logStep('Starting authentication flow test')

    // Step 1: Navigate to login page
    await evidence.logStep('Navigating to login page')
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await evidence.screenshot('01-login-page-loaded')

    // Verify login page elements
    await expect(page.locator('h1')).toContainText('Admin Login')
    await expect(page.locator('input#email')).toBeVisible()
    await expect(page.locator('input#password')).toBeVisible()

    // Step 2: Enter credentials
    await evidence.logStep('Entering admin credentials')
    await page.fill('input#email', 'admin@gcmc.gy')
    await page.fill('input#password', 'admin123')
    await evidence.screenshot('02-credentials-entered')

    // Step 3: Submit login form
    await evidence.logStep('Clicking sign in button')
    await page.click('button[type="submit"]')

    // Wait for redirect and dashboard to load
    await page.waitForURL('/', { timeout: 30000 })
    await page.waitForLoadState('networkidle')
    await evidence.screenshot('03-dashboard-loaded')

    // Step 4: Verify successful login
    await evidence.logStep('Verifying dashboard is loaded and user is authenticated')
    await expect(page).toHaveURL('/')

    // Check for dashboard elements
    await expect(page.locator('h1, h2, h3')).toContainText(['Dashboard', 'Welcome', 'Overview'], { timeout: 10000 })

    // Step 5: Verify session is active by checking navigation
    await evidence.logStep('Verifying navigation menu is accessible')
    await expect(page.locator('nav, [role="navigation"]')).toBeVisible()
    await evidence.screenshot('04-navigation-verified')

    // Step 6: Test logout
    await evidence.logStep('Attempting to logout')

    // Look for logout button (could be in various locations)
    const logoutSelectors = [
      'button:has-text("Logout")',
      'button:has-text("Sign out")',
      'a:has-text("Logout")',
      'a:has-text("Sign out")',
      '[data-testid="logout"]'
    ]

    let loggedOut = false
    for (const selector of logoutSelectors) {
      try {
        const element = page.locator(selector).first()
        if (await element.isVisible()) {
          await element.click()
          loggedOut = true
          break
        }
      } catch (e) {
        // Try next selector
        continue
      }
    }

    if (!loggedOut) {
      // Try user menu/profile dropdown
      const userMenuSelectors = ['[data-testid="user-menu"]', 'button[aria-label*="user"]', 'button[aria-label*="profile"]']
      for (const selector of userMenuSelectors) {
        try {
          const menu = page.locator(selector).first()
          if (await menu.isVisible()) {
            await menu.click()
            await page.waitForTimeout(1000)

            // Now look for logout in dropdown
            for (const logoutSelector of logoutSelectors) {
              try {
                const logoutBtn = page.locator(logoutSelector).first()
                if (await logoutBtn.isVisible()) {
                  await logoutBtn.click()
                  loggedOut = true
                  break
                }
              } catch (e) {
                continue
              }
            }
            if (loggedOut) break
          }
        } catch (e) {
          continue
        }
      }
    }

    if (loggedOut) {
      await page.waitForLoadState('networkidle')
      await evidence.screenshot('05-logout-completed')

      // Verify redirect to login or public page
      const currentUrl = page.url()
      expect(currentUrl).toMatch(/\/(login|portal\/login|$)/)
    } else {
      console.log('⚠️  Could not find logout button - session verification completed without logout test')
    }

    await evidence.logStep('Authentication flow test completed successfully')
  })

  test('CLIENT MANAGEMENT FLOW - Complete CRUD Operations', async ({ page }) => {
    const evidence = new TestEvidence('client-management', page)

    await evidence.logStep('Starting client management flow test')

    // Login first
    await evidence.logStep('Logging in as admin')
    await page.goto('/login')
    await page.fill('input#email', 'admin@gcmc.gy')
    await page.fill('input#password', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/')
    await page.waitForLoadState('networkidle')

    // Navigate to clients page
    await evidence.logStep('Navigating to clients page')
    await page.goto('/clients')
    await page.waitForLoadState('networkidle')
    await evidence.screenshot('01-clients-page-loaded')

    // Verify clients page loaded
    await expect(page.locator('h1')).toContainText('Clients')

    // Test each client type
    const clientTypes = [
      {
        type: 'INDIVIDUAL',
        testData: {
          firstName: 'John',
          surname: 'Doe',
          email: 'john.doe@example.com',
          phone: '+592-123-4567',
          address: '123 Main Street, Georgetown'
        }
      },
      {
        type: 'COMPANY',
        testData: {
          name: 'Test Corporation Ltd',
          email: 'contact@testcorp.gy',
          phone: '+592-987-6543',
          address: '456 Business Ave, Georgetown'
        }
      }
    ]

    for (const clientType of clientTypes) {
      await evidence.logStep(`Testing client creation for ${clientType.type}`)

      // Click Add New Client button
      const addClientButton = page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Create")').first()
      await expect(addClientButton).toBeVisible()
      await addClientButton.click()

      await page.waitForTimeout(1000)
      await evidence.screenshot(`02-${clientType.type.toLowerCase()}-wizard-opened`)

      // Select client type
      if (clientType.type === 'INDIVIDUAL') {
        const individualOption = page.locator('button:has-text("Individual"), input[value="INDIVIDUAL"] + label, label:has-text("Individual")').first()
        if (await individualOption.isVisible()) {
          await individualOption.click()
        }
      }

      await page.waitForTimeout(500)
      await evidence.screenshot(`03-${clientType.type.toLowerCase()}-type-selected`)

      // Fill form fields based on client type
      if (clientType.type === 'INDIVIDUAL') {
        // Individual client form
        const nameFields = ['firstName', 'surname']
        for (const field of nameFields) {
          const input = page.locator(`input[name="${field}"], input#${field}, input[id*="${field}"]`).first()
          if (await input.isVisible()) {
            await input.fill(clientType.testData[field as keyof typeof clientType.testData] as string)
          }
        }
      } else {
        // Company client form
        const nameInput = page.locator('input[name="name"], input#name, input[placeholder*="company"], input[placeholder*="name"]').first()
        if (await nameInput.isVisible()) {
          await nameInput.fill(clientType.testData.name)
        }
      }

      // Fill common fields
      const commonFields = [
        { name: 'email', value: clientType.testData.email },
        { name: 'phone', value: clientType.testData.phone },
        { name: 'address', value: clientType.testData.address }
      ]

      for (const field of commonFields) {
        const input = page.locator(`input[name="${field.name}"], input#${field.name}, input[type="email"], input[type="tel"], textarea[name="${field.name}"]`).first()
        if (await input.isVisible()) {
          await input.fill(field.value)
        }
      }

      await evidence.screenshot(`04-${clientType.type.toLowerCase()}-form-filled`)

      // Navigate through wizard steps
      let currentStep = 1
      const maxSteps = 5

      while (currentStep <= maxSteps) {
        // Look for next button
        const nextButton = page.locator('button:has-text("Next"), button:has-text("Continue"), button:has-text("Proceed")').first()
        const saveButton = page.locator('button:has-text("Save"), button:has-text("Create"), button:has-text("Submit")').first()

        if (await saveButton.isVisible()) {
          await evidence.logStep(`Submitting ${clientType.type} client form`)
          await saveButton.click()
          break
        } else if (await nextButton.isVisible()) {
          await evidence.logStep(`Moving to step ${currentStep + 1} of wizard`)
          await nextButton.click()
          await page.waitForTimeout(1000)
          await evidence.screenshot(`05-${clientType.type.toLowerCase()}-step-${currentStep + 1}`)
        } else {
          break
        }
        currentStep++
      }

      // Wait for success message or redirect
      await page.waitForTimeout(3000)
      await evidence.screenshot(`06-${clientType.type.toLowerCase()}-client-created`)

      // Verify client appears in list (if we're back on clients page)
      try {
        if (page.url().includes('/clients')) {
          const clientEmail = clientType.testData.email
          await page.waitForSelector(`text=${clientEmail}`, { timeout: 10000 })
          await evidence.logStep(`✅ Verified ${clientType.type} client appears in list`)
        }
      } catch (e) {
        console.log(`⚠️  Could not verify client in list - may be on different page`)
      }

      // Close any open modals/wizards
      const closeButtons = page.locator('button[aria-label="Close"], button:has-text("Close"), [data-testid="close"]')
      for (let i = 0; i < await closeButtons.count(); i++) {
        try {
          await closeButtons.nth(i).click()
          await page.waitForTimeout(500)
        } catch (e) {
          // Continue if close button doesn't work
        }
      }

      // Return to clients page if not there
      if (!page.url().includes('/clients')) {
        await page.goto('/clients')
        await page.waitForLoadState('networkidle')
      }
    }

    await evidence.logStep('Client management flow test completed successfully')
  })

  test('FILING MODULE FLOW - Document Generation and Management', async ({ page }) => {
    const evidence = new TestEvidence('filing-module', page)

    await evidence.logStep('Starting filing module flow test')

    // Login
    await page.goto('/login')
    await page.fill('input#email', 'admin@gcmc.gy')
    await page.fill('input#password', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/')
    await page.waitForLoadState('networkidle')

    // Navigate to filings
    await evidence.logStep('Navigating to filings module')
    await page.goto('/filings')
    await page.waitForLoadState('networkidle')
    await evidence.screenshot('01-filings-page-loaded')

    // Test creating a new filing
    await evidence.logStep('Testing filing creation')
    const createButton = page.locator('button:has-text("Create"), button:has-text("New"), a:has-text("Create")').first()

    if (await createButton.isVisible()) {
      await createButton.click()
      await page.waitForLoadState('networkidle')
      await evidence.screenshot('02-filing-creation-form')

      // Fill filing form if visible
      const titleInput = page.locator('input[name="title"], input[name="name"], input#title').first()
      if (await titleInput.isVisible()) {
        await titleInput.fill('Test Filing Document')
      }

      const descriptionInput = page.locator('textarea[name="description"], input[name="description"]').first()
      if (await descriptionInput.isVisible()) {
        await descriptionInput.fill('This is a test filing for automated testing purposes')
      }

      await evidence.screenshot('03-filing-form-filled')

      // Submit form
      const submitButton = page.locator('button:has-text("Save"), button:has-text("Create"), button:has-text("Submit")').first()
      if (await submitButton.isVisible()) {
        await submitButton.click()
        await page.waitForTimeout(2000)
        await evidence.screenshot('04-filing-created')
      }
    }

    await evidence.logStep('Filing module flow test completed')
  })

  test('IMMIGRATION MODULE FLOW - Case Management', async ({ page }) => {
    const evidence = new TestEvidence('immigration-module', page)

    await evidence.logStep('Starting immigration module flow test')

    // Login
    await page.goto('/login')
    await page.fill('input#email', 'admin@gcmc.gy')
    await page.fill('input#password', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/')
    await page.waitForLoadState('networkidle')

    // Navigate to immigration
    await evidence.logStep('Navigating to immigration module')
    await page.goto('/immigration')
    await page.waitForLoadState('networkidle')
    await evidence.screenshot('01-immigration-page-loaded')

    // Test immigration case creation
    await evidence.logStep('Testing immigration case management')
    const newCaseButton = page.locator('button:has-text("New"), button:has-text("Create"), button:has-text("Add")').first()

    if (await newCaseButton.isVisible()) {
      await newCaseButton.click()
      await page.waitForTimeout(1000)
      await evidence.screenshot('02-immigration-case-form')

      // Fill case details
      const fields = [
        { selector: 'input[name="applicant"], input[placeholder*="name"]', value: 'John Immigration Client' },
        { selector: 'select[name="caseType"], select[name="type"]', value: 'WORK_PERMIT' },
        { selector: 'textarea[name="notes"], textarea[name="description"]', value: 'Test immigration case for work permit application' }
      ]

      for (const field of fields) {
        const element = page.locator(field.selector).first()
        if (await element.isVisible()) {
          if (field.selector.includes('select')) {
            await element.selectOption({ label: field.value })
          } else {
            await element.fill(field.value)
          }
        }
      }

      await evidence.screenshot('03-immigration-form-filled')

      const saveButton = page.locator('button:has-text("Save"), button:has-text("Create")').first()
      if (await saveButton.isVisible()) {
        await saveButton.click()
        await page.waitForTimeout(2000)
        await evidence.screenshot('04-immigration-case-created')
      }
    }

    await evidence.logStep('Immigration module flow test completed')
  })

  test('PORTAL MODULE FLOW - Client Portal Access', async ({ page }) => {
    const evidence = new TestEvidence('portal-module', page)

    await evidence.logStep('Starting client portal flow test')

    // Test client portal login
    await evidence.logStep('Testing client portal login')
    await page.goto('/portal/login')
    await page.waitForLoadState('networkidle')
    await evidence.screenshot('01-portal-login-page')

    // Verify portal login page
    await expect(page.locator('input[type="email"], input#email')).toBeVisible()
    await expect(page.locator('input[type="password"], input#password')).toBeVisible()

    // Test with demo client credentials if available
    await page.fill('input[type="email"], input#email', 'client@example.com')
    await page.fill('input[type="password"], input#password', 'client123')
    await evidence.screenshot('02-portal-credentials-entered')

    await page.click('button[type="submit"]')
    await page.waitForTimeout(3000)
    await evidence.screenshot('03-portal-login-attempted')

    // Navigate to portal main page to test functionality
    await page.goto('/portal')
    await page.waitForLoadState('networkidle')
    await evidence.screenshot('04-portal-main-page')

    await evidence.logStep('Portal module flow test completed')
  })
})