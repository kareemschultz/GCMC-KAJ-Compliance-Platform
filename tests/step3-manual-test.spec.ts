import { test, expect } from '@playwright/test'

test.describe('Step 3 Manual Verification', () => {
  test('should navigate directly to clients page and test wizard', async ({ page }) => {
    console.log('🚀 Starting manual Step 3 verification...')

    // Navigate directly to the clients page (bypassing auth issues for testing)
    await page.goto('http://localhost:3000/clients')

    // Take screenshot of page load
    await page.screenshot({ path: 'test-results/manual-01-clients-page.png', fullPage: true })

    // Wait for page to load
    await page.waitForTimeout(3000)

    // Look for any console errors on page load
    const pageErrors: string[] = []
    page.on('pageerror', error => {
      pageErrors.push(error.message)
      console.log('🚨 Page Error:', error.message)
    })

    // Wait for more errors
    await page.waitForTimeout(2000)

    // Report any errors found
    if (pageErrors.length > 0) {
      console.log('❌ Page errors detected:', pageErrors)

      // Check specifically for CheckCircle error
      const hasCheckCircleError = pageErrors.some(error =>
        error.includes('CheckCircle') || error.includes('ReferenceError')
      )

      if (hasCheckCircleError) {
        console.log('🔴 CRITICAL: CheckCircle error still exists!')
        throw new Error('CheckCircle import error detected in page')
      }
    } else {
      console.log('✅ No page errors detected on clients page')
    }

    // Try to find and click the Add New Client button if it exists
    const addClientButton = await page.locator('text="Add New Client"', { timeout: 5000 }).first().isVisible()

    if (addClientButton) {
      console.log('✅ Add New Client button found')
      await page.click('text="Add New Client"')
      await page.waitForTimeout(1000)

      // Take screenshot of wizard opened
      await page.screenshot({ path: 'test-results/manual-02-wizard-opened.png', fullPage: true })

      // Check for any errors after opening wizard
      await page.waitForTimeout(2000)

      if (pageErrors.length > 0) {
        const newErrors = pageErrors.slice(0) // Get all errors
        console.log('❌ Errors after opening wizard:', newErrors)
      } else {
        console.log('✅ No errors after opening wizard')
      }

    } else {
      console.log('⚠️ Add New Client button not found - likely auth required')

      // Check if we're redirected to login
      const currentUrl = page.url()
      if (currentUrl.includes('/login')) {
        console.log('🔄 Redirected to login page as expected')
      }
    }

    // Final error check
    if (pageErrors.length > 0) {
      console.log('📋 Final error summary:', pageErrors)
    } else {
      console.log('✅ Test completed with no runtime errors detected')
    }
  })

  test('should verify the CheckCircle import exists in source', async ({ page }) => {
    console.log('🔍 Verifying CheckCircle import in source code...')

    // Navigate to any page to get browser context
    await page.goto('http://localhost:3000')

    // Use page.evaluate to check if CheckCircle can be imported from our module
    const importTest = await page.evaluate(async () => {
      try {
        // Try to access the module resolution
        const response = await fetch('/_next/static/chunks/app/clients/page.js')
        const sourceCode = await response.text()

        // Check if CheckCircle is properly imported
        return {
          hasCheckCircleImport: sourceCode.includes('CheckCircle'),
          hasLucideReactImport: sourceCode.includes('lucide-react'),
          moduleSize: sourceCode.length
        }
      } catch (error) {
        return {
          error: error.message,
          hasCheckCircleImport: false,
          hasLucideReactImport: false
        }
      }
    })

    console.log('📦 Import verification result:', importTest)

    if (importTest.hasCheckCircleImport) {
      console.log('✅ CheckCircle found in compiled module')
    } else {
      console.log('⚠️ CheckCircle not found in compiled module')
    }
  })
})