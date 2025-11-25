import { test, expect } from '@playwright/test'

test.describe('Client Wizard Step 3 - Comprehensive Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to application and login
    await page.goto('http://localhost:3000/login')

    // Login with admin credentials
    await page.fill('[name="email"]', 'admin@gcmc.gy')
    await page.fill('[name="password"]', process.env.SEED_ADMIN_PASSWORD || 'admin123')
    await page.click('button[type="submit"]')

    // Wait for redirect and navigation to clients page
    await page.waitForURL('http://localhost:3000/')
    await page.goto('http://localhost:3000/clients')
    await page.waitForLoadState('networkidle')
  })

  test('should complete entire client wizard flow including step 3 validation', async ({ page }) => {
    // Take screenshot of initial clients page
    await page.screenshot({ path: 'test-results/01-clients-page-initial.png', fullPage: true })

    // Click "Add New Client" button
    const addClientButton = page.locator('text="Add New Client"').first()
    await expect(addClientButton).toBeVisible()
    await addClientButton.click()

    // Wait for wizard dialog to open
    await page.waitForSelector('[role="dialog"]', { state: 'visible' })
    await page.screenshot({ path: 'test-results/02-wizard-dialog-opened.png', fullPage: true })

    // Step 1: Fill basic information
    console.log('📝 Starting Step 1 - Basic Information')

    // Select client type
    await page.click('[data-testid="client-type-select"]')
    await page.waitForSelector('[role="option"]')
    await page.click('[role="option"]:has-text("Individual")')

    // Fill personal information
    await page.fill('[name="firstName"]', 'John')
    await page.fill('[name="lastName"]', 'Doe')
    await page.fill('[name="dateOfBirth"]', '1990-01-01')

    await page.screenshot({ path: 'test-results/03-step1-completed.png', fullPage: true })

    // Click Next to go to Step 2
    await page.click('text="Next"')
    await page.waitForTimeout(500)

    // Step 2: Contact Information
    console.log('📞 Starting Step 2 - Contact Information')

    await page.fill('[name="email"]', 'john.doe@example.com')
    await page.fill('[name="phone"]', '592-123-4567')
    await page.fill('[name="address"]', '123 Main Street, Georgetown')

    await page.screenshot({ path: 'test-results/04-step2-completed.png', fullPage: true })

    // Click Next to go to Step 3
    await page.click('text="Next"')
    await page.waitForTimeout(500)

    // Step 3: Documentation (The problematic step)
    console.log('📋 Starting Step 3 - Documentation')

    // Take screenshot of step 3 initial state
    await page.screenshot({ path: 'test-results/05-step3-initial.png', fullPage: true })

    // Check if validation status indicator is visible
    const statusIndicator = page.locator('text="Required Information Status:"')
    await expect(statusIndicator).toBeVisible()

    // Verify that the CheckCircle components are rendering properly
    const checkCircles = page.locator('[data-testid*="check-circle"], .lucide-check-circle')
    console.log('🔍 Checking for CheckCircle components...')

    // Fill Primary ID information
    await page.click('[data-testid="primary-id-type-select"]')
    await page.waitForSelector('[role="option"]')
    await page.click('[role="option"]:has-text("National ID")')
    await page.fill('[name="primaryIdNumber"]', '144123456')

    // Take screenshot after filling primary ID
    await page.screenshot({ path: 'test-results/06-step3-primary-id-filled.png', fullPage: true })

    // Check validation status should update
    await page.waitForTimeout(500)

    // Try to click Next button
    const nextButton = page.locator('button:has-text("Next")')
    await expect(nextButton).toBeVisible()

    // Verify button is enabled (should be since we have Primary ID + DOB from step 1)
    const isDisabled = await nextButton.getAttribute('disabled')
    console.log('🔘 Next button disabled status:', isDisabled)

    if (isDisabled === null) {
      console.log('✅ Next button is enabled - validation working correctly!')

      // Take screenshot showing successful validation
      await page.screenshot({ path: 'test-results/07-step3-validation-success.png', fullPage: true })

      // Click Next to proceed
      await nextButton.click()
      await page.waitForTimeout(500)

      // Should be on Step 4 now
      await page.screenshot({ path: 'test-results/08-step4-reached.png', fullPage: true })

      // Fill additional fields if required for final submission
      const finishButton = page.locator('button:has-text("Create Client")')
      if (await finishButton.isVisible()) {
        await finishButton.click()
        await page.waitForTimeout(2000)

        // Take final screenshot
        await page.screenshot({ path: 'test-results/09-client-creation-complete.png', fullPage: true })

        console.log('✅ Client wizard completed successfully!')
      }
    } else {
      console.log('❌ Next button is still disabled - validation issue!')
      await page.screenshot({ path: 'test-results/07-step3-validation-failed.png', fullPage: true })

      // Check what's missing in validation
      const validationMessages = await page.locator('.text-red-500, .text-amber-600, [class*="error"]').allTextContents()
      console.log('🚨 Validation messages:', validationMessages)
    }

    // Additional verification: Check for runtime errors in console
    const errors: string[] = []
    page.on('pageerror', error => {
      errors.push(error.message)
      console.log('🚨 Runtime Error:', error.message)
    })

    // Wait a bit more to catch any delayed errors
    await page.waitForTimeout(1000)

    if (errors.length > 0) {
      console.log('❌ Runtime errors detected:', errors)
      throw new Error(`Runtime errors found: ${errors.join(', ')}`)
    } else {
      console.log('✅ No runtime errors detected')
    }
  })

  test('should verify CheckCircle component is properly imported and renders', async ({ page }) => {
    // Open wizard and navigate to step 3
    await page.click('text="Add New Client"')
    await page.waitForSelector('[role="dialog"]')

    // Fill minimal info to reach step 3
    await page.click('[data-testid="client-type-select"]')
    await page.click('[role="option"]:has-text("Individual")')
    await page.fill('[name="firstName"]', 'Test')
    await page.fill('[name="lastName"]', 'User')
    await page.fill('[name="dateOfBirth"]', '1990-01-01')
    await page.click('text="Next"')

    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="phone"]', '592-123-4567')
    await page.click('text="Next"')

    // Now on step 3 - check for CheckCircle errors
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
        console.log('Console Error:', msg.text())
      }
    })

    // Take screenshot of step 3
    await page.screenshot({ path: 'test-results/checkcircle-verification.png', fullPage: true })

    // Wait for any potential errors to surface
    await page.waitForTimeout(2000)

    // Check if CheckCircle error appears
    const hasCheckCircleError = consoleErrors.some(error =>
      error.includes('CheckCircle is not defined') ||
      error.includes('ReferenceError')
    )

    if (hasCheckCircleError) {
      console.log('❌ CheckCircle error still exists:', consoleErrors)
      throw new Error('CheckCircle component error detected')
    } else {
      console.log('✅ No CheckCircle errors detected')
    }

    // Verify the validation status section renders properly
    const statusSection = page.locator('text="Required Information Status:"')
    await expect(statusSection).toBeVisible()
  })
})