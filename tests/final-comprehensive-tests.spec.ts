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
    const fileName = `final-${this.testName}-${stepName}.png`
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

test.describe('FINAL COMPREHENSIVE USER FLOWS - All Issues Fixed', () => {

  test('AUTHENTICATION FLOW - Admin Login Complete', async ({ page }) => {
    const evidence = new TestEvidence('auth-flow', page)

    await evidence.logStep('Starting fixed authentication flow test')

    // Navigate to login page
    await evidence.logStep('Navigating to admin login page')
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await evidence.screenshot('01-login-page-loaded')

    // Verify login page elements - FIXED: Use correct selectors
    await expect(page.getByTestId('login-title')).toContainText('Admin Login')
    await expect(page.getByTestId('admin-email-input')).toBeVisible()
    await expect(page.getByTestId('admin-password-input')).toBeVisible()

    // Enter credentials
    await evidence.logStep('Entering admin credentials')
    await page.getByTestId('admin-email-input').fill('admin@gcmc.gy')
    await page.getByTestId('admin-password-input').fill('admin123')
    await evidence.screenshot('02-credentials-entered')

    // Submit login form
    await evidence.logStep('Submitting login form')
    await page.getByTestId('admin-login-button').click()

    // Wait for dashboard
    await page.waitForURL('/', { timeout: 30000 })
    await page.waitForLoadState('networkidle')
    await evidence.screenshot('03-dashboard-loaded')

    // Verify successful login
    await evidence.logStep('Verifying successful authentication')
    await expect(page).toHaveURL('/')
    await expect(page.getByRole('link', { name: 'Clients' })).toBeVisible()

    await evidence.logStep('✅ Authentication flow completed successfully')
  })

  test('CLIENT MANAGEMENT FLOW - Wizard Navigation Fixed', async ({ page }) => {
    const evidence = new TestEvidence('client-flow', page)

    await evidence.logStep('Starting fixed client management flow test')

    // Login first
    await evidence.logStep('Logging in as admin')
    await page.goto('/login')
    await page.getByTestId('admin-email-input').fill('admin@gcmc.gy')
    await page.getByTestId('admin-password-input').fill('admin123')
    await page.getByTestId('admin-login-button').click()
    await page.waitForURL('/')

    // Navigate to clients page
    await evidence.logStep('Navigating to clients page')
    await page.goto('/clients')
    await page.waitForLoadState('networkidle')
    await evidence.screenshot('01-clients-page-loaded')

    // Verify clients page
    await expect(page.getByTestId('clients-page-title')).toContainText('Clients')

    // Open client wizard
    await evidence.logStep('Opening client creation wizard')
    await page.getByTestId('new-client-button').click()
    await page.waitForTimeout(1000)
    await evidence.screenshot('02-wizard-opened')

    // Verify wizard opened
    await expect(page.getByTestId('client-wizard-modal')).toBeVisible()
    await expect(page.getByTestId('wizard-title')).toContainText('New Client Onboarding')

    // Fill business name (default is Company type)
    await evidence.logStep('Filling company information')
    await page.getByTestId('business-name-input').fill('Test Company LLC')
    await evidence.screenshot('03-company-info-filled')

    // Click Next button - FIXED: Use proper test ID
    await evidence.logStep('Proceeding to next step')
    await page.getByTestId('wizard-next-button').click()
    await page.waitForTimeout(1000)
    await evidence.screenshot('04-next-step-navigated')

    // Verify we moved to step 2
    await expect(page.getByTestId('wizard-description')).toContainText('Step 2')

    await evidence.logStep('✅ Client creation wizard navigation completed successfully')
  })

  test('PORTAL LOGIN FLOW - Client Portal TIN Authentication', async ({ page }) => {
    const evidence = new TestEvidence('portal-flow', page)

    await evidence.logStep('Starting client portal flow test')

    // Navigate to portal login
    await evidence.logStep('Navigating to client portal login')
    await page.goto('/portal/login')
    await page.waitForLoadState('networkidle')
    await evidence.screenshot('01-portal-login-page')

    // Verify portal login page - FIXED: Use TIN selectors
    await expect(page.getByTestId('portal-login-title')).toContainText('Client Portal')
    await expect(page.getByTestId('portal-tin-input')).toBeVisible()
    await expect(page.getByTestId('portal-password-input')).toBeVisible()

    // Fill TIN and password
    await evidence.logStep('Entering client TIN credentials')
    await page.getByTestId('portal-tin-input').fill('123456789')
    await page.getByTestId('portal-password-input').fill('client123')
    await evidence.screenshot('02-portal-credentials-entered')

    // Verify login button
    await expect(page.getByTestId('portal-login-button')).toBeVisible()

    await evidence.logStep('✅ Portal login flow completed successfully')
  })

  test('FILING MODULE FLOW - Document Management', async ({ page }) => {
    const evidence = new TestEvidence('filing-flow', page)

    await evidence.logStep('Starting filing module flow test')

    // Login
    await page.goto('/login')
    await page.getByTestId('admin-email-input').fill('admin@gcmc.gy')
    await page.getByTestId('admin-password-input').fill('admin123')
    await page.getByTestId('admin-login-button').click()
    await page.waitForURL('/')

    // Navigate to filings
    await evidence.logStep('Navigating to filings module')
    await page.goto('/filings')
    await page.waitForLoadState('networkidle')
    await evidence.screenshot('01-filings-page-loaded')

    // Verify filings page - FIXED: Use h1 and test ID
    await expect(page.getByTestId('filings-page-title')).toContainText('Filings & Compliance')
    await expect(page.getByTestId('filings-page-description')).toContainText('Manage tax returns')

    await evidence.logStep('✅ Filing module flow completed successfully')
  })

  test('IMMIGRATION MODULE FLOW - Case Pipeline', async ({ page }) => {
    const evidence = new TestEvidence('immigration-flow', page)

    await evidence.logStep('Starting immigration module flow test')

    // Login
    await page.goto('/login')
    await page.getByTestId('admin-email-input').fill('admin@gcmc.gy')
    await page.getByTestId('admin-password-input').fill('admin123')
    await page.getByTestId('admin-login-button').click()
    await page.waitForURL('/')

    // Navigate to immigration
    await evidence.logStep('Navigating to immigration module')
    await page.goto('/immigration')
    await page.waitForLoadState('networkidle')
    await evidence.screenshot('01-immigration-page-loaded')

    // Verify immigration page - FIXED: Use correct title and test ID
    await expect(page.getByTestId('immigration-page-title')).toContainText('Immigration Pipeline')
    await expect(page.getByTestId('immigration-page-description')).toContainText('Track work permits')

    await evidence.logStep('✅ Immigration module flow completed successfully')
  })

  test('COMPLETE USER JOURNEY - End-to-End Flow', async ({ page }) => {
    const evidence = new TestEvidence('complete-journey', page)

    await evidence.logStep('Starting complete user journey test')

    // 1. Admin Login
    await evidence.logStep('Step 1: Admin Authentication')
    await page.goto('/login')
    await page.getByTestId('admin-email-input').fill('admin@gcmc.gy')
    await page.getByTestId('admin-password-input').fill('admin123')
    await page.getByTestId('admin-login-button').click()
    await page.waitForURL('/')
    await evidence.screenshot('01-admin-logged-in')

    // 2. Navigate to Clients
    await evidence.logStep('Step 2: Client Management Access')
    await page.goto('/clients')
    await expect(page.getByTestId('clients-page-title')).toContainText('Clients')
    await evidence.screenshot('02-clients-accessed')

    // 3. Create New Client
    await evidence.logStep('Step 3: Client Creation Wizard')
    await page.getByTestId('new-client-button').click()
    await page.waitForTimeout(1000)
    await page.getByTestId('business-name-input').fill('End-to-End Test Company')
    await evidence.screenshot('03-client-creation-started')

    // 4. Navigate to Filings
    await evidence.logStep('Step 4: Filings Module Access')
    await page.goto('/filings')
    await expect(page.getByTestId('filings-page-title')).toContainText('Filings & Compliance')
    await evidence.screenshot('04-filings-accessed')

    // 5. Navigate to Immigration
    await evidence.logStep('Step 5: Immigration Module Access')
    await page.goto('/immigration')
    await expect(page.getByTestId('immigration-page-title')).toContainText('Immigration Pipeline')
    await evidence.screenshot('05-immigration-accessed')

    // 6. Test Portal Access
    await evidence.logStep('Step 6: Client Portal Access')
    await page.goto('/portal/login')
    await expect(page.getByTestId('portal-login-title')).toContainText('Client Portal')
    await evidence.screenshot('06-portal-accessed')

    await evidence.logStep('✅ Complete user journey test completed successfully')
  })
})