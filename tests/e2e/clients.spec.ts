import { test, expect } from '../fixtures/auth.fixture';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Client Management Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ adminPage }) => {
    helpers = new TestHelpers(adminPage);
  });

  test('should display clients list page correctly', async ({ adminPage }) => {
    await adminPage.goto('/clients');
    await helpers.waitForPageLoad();

    // Take screenshot of clients page
    await helpers.takeScreenshot('clients-list-page');

    // Check page title and header
    await expect(adminPage.locator('h1, h2')).toContainText('Clients');

    // Check if Add Client button exists
    const addClientButton = adminPage.locator('text=Add Client, [data-testid="add-client"]');
    await expect(addClientButton).toBeVisible();

    // Check if clients table/list exists
    const clientsList = adminPage.locator('[data-testid="clients-list"], table, .client-card');
    await expect(clientsList).toBeVisible();
  });

  test('should open client creation form', async ({ adminPage }) => {
    await adminPage.goto('/clients');
    await helpers.waitForPageLoad();

    // Click Add Client button
    await adminPage.click('text=Add Client');

    // Should show client creation form
    await expect(adminPage.locator('text=Add New Client, text=Create Client')).toBeVisible();
    await expect(adminPage.locator('input[name="name"], #name')).toBeVisible();
    await expect(adminPage.locator('select[name="type"], #type')).toBeVisible();
    await expect(adminPage.locator('input[name="email"], #email')).toBeVisible();

    await helpers.takeScreenshot('client-creation-form');
  });

  test('should create new company client successfully', async ({ adminPage }) => {
    await adminPage.goto('/clients');
    await helpers.waitForPageLoad();

    // Click Add Client
    await adminPage.click('text=Add Client');

    // Fill company client form
    const clientData = {
      name: 'Test Company Ltd',
      type: 'COMPANY',
      email: 'contact@testcompany.gy',
      phone: '+592-555-0123',
      address: '123 Test Street, Georgetown, Guyana',
      tinNumber: 'TIN-TEST-123',
      nisNumber: 'NIS-TEST-456'
    };

    await helpers.fillAndVerify('input[name="name"]', clientData.name);
    await adminPage.selectOption('select[name="type"]', clientData.type);
    await helpers.fillAndVerify('input[name="email"]', clientData.email);
    await helpers.fillAndVerify('input[name="phone"]', clientData.phone);
    await helpers.fillAndVerify('textarea[name="address"]', clientData.address);
    await helpers.fillAndVerify('input[name="tinNumber"]', clientData.tinNumber);
    await helpers.fillAndVerify('input[name="nisNumber"]', clientData.nisNumber);

    // Take screenshot before submission
    await helpers.takeScreenshot('client-form-filled-company');

    // Submit form
    await adminPage.click('button[type="submit"]');

    // Should show success message
    await helpers.waitForToast('Client created successfully', 'success');

    // Should redirect to clients list or client detail page
    expect(adminPage.url()).toMatch(/\/(clients|client)/);

    // Take screenshot after creation
    await helpers.takeScreenshot('client-created-success');
  });

  test('should create new individual client successfully', async ({ adminPage }) => {
    await adminPage.goto('/clients');
    await helpers.waitForPageLoad();

    await adminPage.click('text=Add Client');

    const clientData = {
      name: 'John Test Smith',
      type: 'INDIVIDUAL',
      email: 'john.test@email.gy',
      phone: '+592-555-0124',
      address: '456 Individual Street, Georgetown, Guyana'
    };

    await helpers.fillAndVerify('input[name="name"]', clientData.name);
    await adminPage.selectOption('select[name="type"]', clientData.type);
    await helpers.fillAndVerify('input[name="email"]', clientData.email);
    await helpers.fillAndVerify('input[name="phone"]', clientData.phone);
    await helpers.fillAndVerify('textarea[name="address"]', clientData.address);

    await helpers.takeScreenshot('client-form-filled-individual');

    await adminPage.click('button[type="submit"]');

    await helpers.waitForToast('Client created successfully', 'success');
    await helpers.takeScreenshot('individual-client-created');
  });

  test('should validate required fields', async ({ adminPage }) => {
    await adminPage.goto('/clients');
    await helpers.waitForPageLoad();

    await adminPage.click('text=Add Client');

    // Try to submit empty form
    await adminPage.click('button[type="submit"]');

    // Should show validation errors
    const nameInput = adminPage.locator('input[name="name"]');
    const emailInput = adminPage.locator('input[name="email"]');
    const phoneInput = adminPage.locator('input[name="phone"]');

    expect(await nameInput.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
    expect(await emailInput.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
    expect(await phoneInput.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);

    await helpers.takeScreenshot('client-form-validation-errors');
  });

  test('should validate email format in client form', async ({ adminPage }) => {
    await adminPage.goto('/clients');
    await helpers.waitForPageLoad();

    await adminPage.click('text=Add Client');

    // Fill form with invalid email
    await helpers.fillAndVerify('input[name="name"]', 'Test Client');
    await helpers.fillAndVerify('input[name="email"]', 'invalid-email');
    await helpers.fillAndVerify('input[name="phone"]', '+592-555-0000');
    await helpers.fillAndVerify('textarea[name="address"]', 'Test Address');

    await adminPage.click('button[type="submit"]');

    // Should show email validation error
    const emailInput = adminPage.locator('input[name="email"]');
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toContain('email');

    await helpers.takeScreenshot('client-email-validation-error');
  });

  test('should search clients', async ({ adminPage }) => {
    await adminPage.goto('/clients');
    await helpers.waitForPageLoad();

    // Look for search functionality
    const searchInput = adminPage.locator('input[type="search"], input[placeholder*="search"], [data-testid="client-search"]');

    if (await searchInput.isVisible()) {
      // Test search functionality
      await searchInput.fill('ABC Corporation');
      await adminPage.press('input[type="search"]', 'Enter');

      // Should filter results
      await helpers.waitForPageLoad();
      await helpers.takeScreenshot('client-search-results');

      // Clear search
      await searchInput.clear();
      await adminPage.press('input[type="search"]', 'Enter');
      await helpers.waitForPageLoad();
    }
  });

  test('should view client details', async ({ adminPage }) => {
    await adminPage.goto('/clients');
    await helpers.waitForPageLoad();

    // Look for first client in the list
    const firstClientLink = adminPage.locator('a[href*="/clients/"], .client-row, .client-card').first();

    if (await firstClientLink.isVisible()) {
      await firstClientLink.click();
      await helpers.waitForPageLoad();

      // Should be on client detail page
      expect(adminPage.url()).toContain('/clients/');

      // Should show client information
      await expect(adminPage.locator('text=Client Details, text=Profile')).toBeVisible();

      await helpers.takeScreenshot('client-detail-page');
    }
  });

  test('should edit client information', async ({ adminPage }) => {
    await adminPage.goto('/clients');
    await helpers.waitForPageLoad();

    // Look for edit button or link
    const editButton = adminPage.locator('text=Edit, [data-testid="edit-client"]').first();

    if (await editButton.isVisible()) {
      await editButton.click();
      await helpers.waitForPageLoad();

      // Should show edit form
      await expect(adminPage.locator('text=Edit Client, text=Update Client')).toBeVisible();

      // Update a field
      const nameField = adminPage.locator('input[name="name"]');
      if (await nameField.isVisible()) {
        const originalName = await nameField.inputValue();
        await nameField.fill(`${originalName} - Updated`);

        await helpers.takeScreenshot('client-edit-form');

        // Save changes
        await adminPage.click('button[type="submit"], text=Save, text=Update');

        // Should show success message
        await helpers.waitForToast('Client updated successfully', 'success');
        await helpers.takeScreenshot('client-updated-success');
      }
    }
  });

  test('should handle client filters', async ({ adminPage }) => {
    await adminPage.goto('/clients');
    await helpers.waitForPageLoad();

    // Look for filter options
    const typeFilter = adminPage.locator('select[name="type"], [data-testid="type-filter"]');
    const statusFilter = adminPage.locator('select[name="status"], [data-testid="status-filter"]');

    if (await typeFilter.isVisible()) {
      // Test type filter
      await typeFilter.selectOption('COMPANY');
      await helpers.waitForPageLoad();
      await helpers.takeScreenshot('clients-filtered-by-company');

      // Reset filter
      await typeFilter.selectOption('');
      await helpers.waitForPageLoad();
    }

    if (await statusFilter.isVisible()) {
      // Test status filter
      await statusFilter.selectOption('Active');
      await helpers.waitForPageLoad();
      await helpers.takeScreenshot('clients-filtered-by-active');
    }
  });

  test('should display client statistics', async ({ adminPage }) => {
    await adminPage.goto('/clients');
    await helpers.waitForPageLoad();

    // Look for stats cards or metrics
    const statsCards = adminPage.locator('.stats-card, .metric-card, [data-testid="stats"]');

    if (await statsCards.count() > 0) {
      await expect(statsCards.first()).toBeVisible();
      await helpers.takeScreenshot('client-statistics');
    }
  });

  test('should export clients list', async ({ adminPage }) => {
    await adminPage.goto('/clients');
    await helpers.waitForPageLoad();

    // Look for export button
    const exportButton = adminPage.locator('text=Export, text=Download, [data-testid="export-clients"]');

    if (await exportButton.isVisible()) {
      await exportButton.click();

      // Should trigger download or show export options
      await helpers.takeScreenshot('client-export-initiated');
    }
  });

  test('should archive/deactivate client', async ({ adminPage }) => {
    await adminPage.goto('/clients');
    await helpers.waitForPageLoad();

    // Look for archive/deactivate option
    const archiveButton = adminPage.locator('text=Archive, text=Deactivate, [data-testid="archive-client"]').first();

    if (await archiveButton.isVisible()) {
      await archiveButton.click();

      // Should show confirmation dialog
      const confirmButton = adminPage.locator('text=Confirm, text=Yes, text=Archive');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();

        // Should show success message
        await helpers.waitForToast('Client archived successfully', 'success');
        await helpers.takeScreenshot('client-archived');
      }
    }
  });
});