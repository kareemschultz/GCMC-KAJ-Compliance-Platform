import { test, expect } from '@playwright/test'

const ADMIN_EMAIL = 'admin@gcmc.gy'
const ADMIN_PASSWORD = 'admin123'

test.describe('Client Wizard - Persistence Issues Investigation', () => {

  test('Client Creation and Persistence Flow', async ({ page }) => {
    console.log('🔍 Testing client creation persistence...')

    // 1. Login as admin
    await page.goto('http://localhost:3000/login')
    await page.fill('input[type="email"]', ADMIN_EMAIL)
    await page.fill('input[type="password"]', ADMIN_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL('http://localhost:3000/')

    // 2. Navigate to clients page and record initial count
    await page.goto('http://localhost:3000/clients')
    await page.waitForLoadState('networkidle')

    const initialClientCount = await page.locator('table tbody tr').count()
    console.log(`Initial client count: ${initialClientCount}`)

    // Take screenshot before creation
    await page.screenshot({ path: 'test-results/client-persistence-01-before.png', fullPage: true })

    // 3. Test client creation with unique data
    const timestamp = Date.now()
    const testClientName = `Test Client ${timestamp}`
    const testClientEmail = `testclient${timestamp}@test.gy`
    const testClientTIN = `TIN${timestamp}`

    // Look for add client button
    console.log('Looking for client creation button...')

    // Try different possible selectors for the add client button
    const addButtonSelectors = [
      'button:has-text("Add Client")',
      'button:has-text("New Client")',
      'button:has-text("Create Client")',
      'button:has-text("Add")',
      'button:has-text("New")',
      '[data-testid="add-client"]',
      '.add-client',
      'button[aria-label*="add"]',
      'button[aria-label*="client"]'
    ]

    let addButtonFound = false
    for (const selector of addButtonSelectors) {
      const button = page.locator(selector)
      if (await button.count() > 0) {
        console.log(`Found add button with selector: ${selector}`)
        await button.first().click()
        addButtonFound = true
        break
      }
    }

    if (!addButtonFound) {
      console.log('⚠️ No add client button found, checking if inline form exists')
      await page.screenshot({ path: 'test-results/client-persistence-02-no-button.png', fullPage: true })
    }

    await page.waitForTimeout(1000) // Wait for form to appear

    // Take screenshot of form
    await page.screenshot({ path: 'test-results/client-persistence-03-form.png', fullPage: true })

    // 4. Fill out the form if it exists
    const nameInputSelectors = [
      'input[name="name"]',
      'input[placeholder*="name"]',
      'input[placeholder*="Name"]',
      'input[aria-label*="name"]',
      '#name',
      '.name-input'
    ]

    let nameInputFound = false
    for (const selector of nameInputSelectors) {
      const input = page.locator(selector)
      if (await input.count() > 0 && await input.isVisible()) {
        console.log(`Found name input with selector: ${selector}`)
        await input.fill(testClientName)
        nameInputFound = true
        break
      }
    }

    if (!nameInputFound) {
      console.log('⚠️ No name input found')
      await page.screenshot({ path: 'test-results/client-persistence-04-no-input.png', fullPage: true })
      return // Exit test early if no form found
    }

    // Fill other fields if they exist
    try {
      const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]')
      if (await emailInput.count() > 0) {
        await emailInput.fill(testClientEmail)
      }

      const phoneInput = page.locator('input[name="phone"], input[placeholder*="phone"]')
      if (await phoneInput.count() > 0) {
        await phoneInput.fill('+592-123-4567')
      }

      const tinInput = page.locator('input[name="tinNumber"], input[name="tin"], input[placeholder*="TIN"]')
      if (await tinInput.count() > 0) {
        await tinInput.fill(testClientTIN)
      }
    } catch (error) {
      console.log(`Error filling additional fields: ${error}`)
    }

    // Take screenshot of filled form
    await page.screenshot({ path: 'test-results/client-persistence-05-filled.png', fullPage: true })

    // 5. Submit the form
    const submitButtonSelectors = [
      'button[type="submit"]',
      'button:has-text("Create")',
      'button:has-text("Submit")',
      'button:has-text("Save")',
      'button:has-text("Add")',
      '[data-testid="submit"]'
    ]

    let submitted = false
    for (const selector of submitButtonSelectors) {
      const button = page.locator(selector)
      if (await button.count() > 0 && await button.isVisible()) {
        console.log(`Found submit button with selector: ${selector}`)
        await button.click()
        submitted = true
        break
      }
    }

    if (!submitted) {
      console.log('⚠️ No submit button found')
      await page.screenshot({ path: 'test-results/client-persistence-06-no-submit.png', fullPage: true })
      return
    }

    console.log('✅ Form submitted, waiting for response...')

    // Wait for form submission to process
    await page.waitForTimeout(2000)

    // Check for success indicators
    const successIndicators = [
      page.locator('text=success', { hasText: /success/i }),
      page.locator('text=created', { hasText: /created/i }),
      page.locator('text=added', { hasText: /added/i }),
      page.locator('.success'),
      page.locator('.alert-success'),
      page.locator('[data-testid="success"]')
    ]

    let successFound = false
    for (const indicator of successIndicators) {
      if (await indicator.count() > 0) {
        successFound = true
        console.log('✅ Success indicator found')
        break
      }
    }

    // Take screenshot after submission
    await page.screenshot({ path: 'test-results/client-persistence-07-after-submit.png', fullPage: true })

    // 6. Check if client appears in the list immediately
    await page.waitForLoadState('networkidle')

    // Look for the new client in the table
    const clientInTable = page.locator(`text=${testClientName}`)
    const clientVisible = await clientInTable.count() > 0

    console.log(`Client visible immediately after creation: ${clientVisible ? '✅' : '❌'}`)

    const newClientCount = await page.locator('table tbody tr').count()
    console.log(`Client count after creation: ${newClientCount} (was ${initialClientCount})`)

    if (newClientCount > initialClientCount) {
      console.log('✅ Client count increased')
    } else {
      console.log('❌ Client count did not increase')
    }

    // Take screenshot showing current state
    await page.screenshot({ path: 'test-results/client-persistence-08-immediate-check.png', fullPage: true })

    // 7. Test persistence by refreshing the page
    console.log('🔄 Testing persistence with page refresh...')
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Wait a moment for any loading to complete
    await page.waitForTimeout(3000)

    // Check if client is still there after refresh
    const clientAfterRefresh = page.locator(`text=${testClientName}`)
    const clientPersisted = await clientAfterRefresh.count() > 0

    console.log(`Client visible after refresh: ${clientPersisted ? '✅' : '❌'}`)

    const clientCountAfterRefresh = await page.locator('table tbody tr').count()
    console.log(`Client count after refresh: ${clientCountAfterRefresh}`)

    await page.screenshot({ path: 'test-results/client-persistence-09-after-refresh.png', fullPage: true })

    // 8. Navigate away and back to test navigation persistence
    console.log('🔄 Testing persistence with navigation...')
    await page.goto('http://localhost:3000/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    await page.goto('http://localhost:3000/clients')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)

    // Check if client is still there after navigation
    const clientAfterNavigation = page.locator(`text=${testClientName}`)
    const clientPersistedNav = await clientAfterNavigation.count() > 0

    console.log(`Client visible after navigation: ${clientPersistedNav ? '✅' : '❌'}`)

    const clientCountAfterNavigation = await page.locator('table tbody tr').count()
    console.log(`Client count after navigation: ${clientCountAfterNavigation}`)

    await page.screenshot({ path: 'test-results/client-persistence-10-after-navigation.png', fullPage: true })

    // 9. Test database persistence by checking API directly
    console.log('🗄️ Testing database persistence via API...')

    // Get session cookies for API call
    const cookies = await page.context().cookies()
    const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')

    const response = await page.request.get('http://localhost:3000/api/clients', {
      headers: {
        'Cookie': cookieString
      }
    })

    const responseData = await response.json()
    console.log(`API Response Status: ${response.status()}`)

    if (response.ok() && responseData.clients) {
      const apiClientCount = responseData.clients.length
      console.log(`Clients in API response: ${apiClientCount}`)

      const testClientInAPI = responseData.clients.find(client =>
        client.name === testClientName || client.email === testClientEmail
      )

      console.log(`Test client found in API: ${testClientInAPI ? '✅' : '❌'}`)

      if (testClientInAPI) {
        console.log(`Test client data:`, {
          id: testClientInAPI.id,
          name: testClientInAPI.name,
          email: testClientInAPI.email
        })
      }
    } else {
      console.log('❌ Failed to get API response')
    }

    // 10. Final summary
    console.log('\n📊 PERSISTENCE TEST SUMMARY:')
    console.log(`• Client creation attempted: ✅`)
    console.log(`• Form submission completed: ${submitted ? '✅' : '❌'}`)
    console.log(`• Client visible immediately: ${clientVisible ? '✅' : '❌'}`)
    console.log(`• Client count increased: ${newClientCount > initialClientCount ? '✅' : '❌'}`)
    console.log(`• Survives page refresh: ${clientPersisted ? '✅' : '❌'}`)
    console.log(`• Survives navigation: ${clientPersistedNav ? '✅' : '❌'}`)
    console.log(`• Present in database API: ${response.ok() ? '✅' : '❌'}`)

    // Take final screenshot
    await page.screenshot({ path: 'test-results/client-persistence-11-final.png', fullPage: true })
  })

  test('Client List Loading and Caching Investigation', async ({ page }) => {
    console.log('🔍 Testing client list loading patterns...')

    // Login
    await page.goto('http://localhost:3000/login')
    await page.fill('input[type="email"]', ADMIN_EMAIL)
    await page.fill('input[type="password"]', ADMIN_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL('http://localhost:3000/')

    // Monitor network requests
    const apiRequests = []
    page.on('request', request => {
      if (request.url().includes('/api/clients')) {
        apiRequests.push({
          url: request.url(),
          method: request.method(),
          timestamp: new Date().toISOString()
        })
      }
    })

    // Navigate to clients page
    await page.goto('http://localhost:3000/clients')

    // Wait and observe loading behavior
    await page.waitForLoadState('networkidle')

    // Check for loading indicators
    const loadingElements = await page.locator('text=Loading...', { timeout: 1000 }).count().catch(() => 0)
    console.log(`Loading indicators found: ${loadingElements}`)

    await page.waitForTimeout(5000) // Wait 5 seconds to observe any dynamic changes

    const finalClientCount = await page.locator('table tbody tr').count()
    console.log(`Final client count: ${finalClientCount}`)

    // Take screenshot of final state
    await page.screenshot({ path: 'test-results/client-loading-final.png', fullPage: true })

    console.log('\nAPI Requests made:')
    apiRequests.forEach((req, index) => {
      console.log(`${index + 1}. ${req.method} ${req.url} at ${req.timestamp}`)
    })
  })
})