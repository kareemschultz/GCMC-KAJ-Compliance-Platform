import { test, expect } from '../fixtures/auth.fixture';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Core Feature Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ adminPage }) => {
    helpers = new TestHelpers(adminPage);
  });

  test('should run compliance checks for a client', async ({ adminPage }) => {
    await adminPage.goto('/clients');
    await helpers.waitForPageLoad();

    // Find first client and navigate to their compliance tab
    await adminPage.locator('a[href*="/clients/"]').first().click();
    await helpers.waitForPageLoad();
    await adminPage.click('text=Compliance');
    await helpers.waitForPageLoad();

    await expect(adminPage.locator('text=Compliance Status')).toBeVisible();

    const checkButton = adminPage.locator('button:has-text("Run Checks")');
    if (await checkButton.count() > 0) {
      await checkButton.click();
      await helpers.waitForToast('Compliance checks completed', 'success');
    }
  });

  test('should create an audit log entry after client creation', async ({ adminPage }) => {
    // Create a new client first
    await adminPage.goto('/clients/new');
    await helpers.waitForPageLoad();
    const clientName = `Audit Log Test Client ${Date.now()}`;
    await adminPage.fill('input[name="name"]', clientName);
    await adminPage.selectOption('select[name="type"]', 'COMPANY');
    await adminPage.fill('input[name="email"]', 'audit@test.com');
    await adminPage.click('button[type="submit"]');
    await helpers.waitForToast('Client created successfully', 'success');
    
    // Now check audit logs
    await adminPage.goto('/audit-logs');
    await helpers.waitForPageLoad();

    // The log may take a moment to appear
    await adminPage.reload();
    await helpers.waitForPageLoad();

    await expect(adminPage.locator(`text=${clientName}`)).toBeVisible();
    await expect(adminPage.locator('text=CLIENT_CREATE')).toBeVisible();
  });

  test('should generate a document', async ({ adminPage }) => {
    await adminPage.goto('/documents');
    await helpers.waitForPageLoad();

    const generateButton = adminPage.locator('button:has-text("Generate Document")');
    if (await generateButton.count() > 0) {
      await generateButton.click();
      
      // Assume a modal opens
      await expect(adminPage.locator('text=Select a Template')).toBeVisible();
      // Select first template
      await adminPage.locator('[role="menuitem"]').first().click();

      // Check for preview or download
      const previewButton = adminPage.locator('button:has-text("Preview")');
      const downloadButton = adminPage.locator('button:has-text("Download")');

      expect(await previewButton.count() > 0 || await downloadButton.count() > 0).toBe(true);
    }
  });
});
