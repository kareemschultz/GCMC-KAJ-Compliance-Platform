import { test, expect } from '../fixtures/auth.fixture';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Filings & Compliance Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ adminPage }) => {
    helpers = new TestHelpers(adminPage);
  });

  test('should display filings page correctly', async ({ adminPage }) => {
    await adminPage.goto('/filings');
    await helpers.waitForPageLoad();

    // Take screenshot of filings page
    await helpers.takeScreenshot('filings-page');

    // Check page title and header
    await expect(adminPage.locator('text=Filings & Compliance')).toBeVisible();
    await expect(adminPage.locator('text=Manage tax returns and regulatory filings')).toBeVisible();

    // Check action buttons
    await expect(adminPage.locator('text=NIS Compliance')).toBeVisible();
    await expect(adminPage.locator('text=New VAT Return')).toBeVisible();

    // Check view toggles
    await expect(adminPage.locator('text=List View')).toBeVisible();
    await expect(adminPage.locator('text=Calendar View')).toBeVisible();
  });

  test('should show filings statistics', async ({ adminPage }) => {
    await adminPage.goto('/filings');
    await helpers.waitForPageLoad();

    // Look for statistics cards
    const statsCards = adminPage.locator('.stats-card, [data-testid="filing-stats"]');

    if (await statsCards.count() > 0) {
      await expect(statsCards.first()).toBeVisible();
      await helpers.takeScreenshot('filings-statistics');
    }
  });

  test('should switch between list and calendar views', async ({ adminPage }) => {
    await adminPage.goto('/filings');
    await helpers.waitForPageLoad();

    // Default should be list view
    await expect(adminPage.locator('[data-state="active"]')).toContainText('List View');
    await helpers.takeScreenshot('filings-list-view');

    // Switch to calendar view
    await adminPage.click('text=Calendar View');
    await helpers.waitForPageLoad();

    await expect(adminPage.locator('[data-state="active"]')).toContainText('Calendar View');
    await helpers.takeScreenshot('filings-calendar-view');

    // Switch back to list view
    await adminPage.click('text=List View');
    await helpers.waitForPageLoad();

    await expect(adminPage.locator('[data-state="active"]')).toContainText('List View');
  });

  test('should display filings list with data', async ({ adminPage }) => {
    await adminPage.goto('/filings');
    await helpers.waitForPageLoad();

    // Should show filings table or list
    const filingsList = adminPage.locator('table, .filings-list, [data-testid="filings-table"]');
    await expect(filingsList).toBeVisible();

    // Look for filing entries
    const filingRows = adminPage.locator('tr, .filing-row, .filing-card');

    if (await filingRows.count() > 1) { // More than header row
      await helpers.takeScreenshot('filings-list-with-data');

      // Check for filing details
      await expect(adminPage.locator('text=VAT Return, text=PAYE, text=NIS')).toBeVisible();
      await expect(adminPage.locator('text=GRA, text=NIS, text=DCRA')).toBeVisible();
    }
  });

  test('should filter filings by agency', async ({ adminPage }) => {
    await adminPage.goto('/filings');
    await helpers.waitForPageLoad();

    // Look for filter controls
    const agencyFilter = adminPage.locator('select[name="agency"], [data-testid="agency-filter"]');

    if (await agencyFilter.isVisible()) {
      // Filter by GRA
      await agencyFilter.selectOption('GRA');
      await helpers.waitForPageLoad();
      await helpers.takeScreenshot('filings-filtered-by-gra');

      // Filter by NIS
      await agencyFilter.selectOption('NIS');
      await helpers.waitForPageLoad();
      await helpers.takeScreenshot('filings-filtered-by-nis');

      // Reset filter
      await agencyFilter.selectOption('');
      await helpers.waitForPageLoad();
    }
  });

  test('should filter filings by status', async ({ adminPage }) => {
    await adminPage.goto('/filings');
    await helpers.waitForPageLoad();

    const statusFilter = adminPage.locator('select[name="status"], [data-testid="status-filter"]');

    if (await statusFilter.isVisible()) {
      // Filter by Pending
      await statusFilter.selectOption('Pending');
      await helpers.waitForPageLoad();
      await helpers.takeScreenshot('filings-filtered-by-pending');

      // Filter by Submitted
      await statusFilter.selectOption('Submitted');
      await helpers.waitForPageLoad();
      await helpers.takeScreenshot('filings-filtered-by-submitted');

      // Filter by Overdue
      await statusFilter.selectOption('Overdue');
      await helpers.waitForPageLoad();
      await helpers.takeScreenshot('filings-filtered-by-overdue');
    }
  });

  test('should navigate to VAT return page', async ({ adminPage }) => {
    await adminPage.goto('/filings');
    await helpers.waitForPageLoad();

    // Click New VAT Return button
    await adminPage.click('text=New VAT Return');
    await helpers.waitForPageLoad();

    // Should navigate to VAT return page
    expect(adminPage.url()).toContain('/vat');
    await helpers.takeScreenshot('vat-return-page');
  });

  test('should navigate to NIS compliance page', async ({ adminPage }) => {
    await adminPage.goto('/filings');
    await helpers.waitForPageLoad();

    // Click NIS Compliance button
    await adminPage.click('text=NIS Compliance');
    await helpers.waitForPageLoad();

    // Should navigate to NIS compliance page
    expect(adminPage.url()).toContain('/nis');
    await helpers.takeScreenshot('nis-compliance-page');
  });

  test('should access new filing dropdown', async ({ adminPage }) => {
    await adminPage.goto('/filings');
    await helpers.waitForPageLoad();

    // Look for new filing dropdown
    const newFilingDropdown = adminPage.locator('[data-testid="new-filing-dropdown"], .dropdown-trigger');

    if (await newFilingDropdown.isVisible()) {
      await newFilingDropdown.click();

      // Should show filing options
      await expect(adminPage.locator('text=VAT Return, text=PAYE Filing, text=Corporate Tax')).toBeVisible();
      await helpers.takeScreenshot('new-filing-dropdown-open');

      // Close dropdown
      await adminPage.keyboard.press('Escape');
    }
  });

  test('should show filing details when clicked', async ({ adminPage }) => {
    await adminPage.goto('/filings');
    await helpers.waitForPageLoad();

    // Look for first filing row
    const firstFiling = adminPage.locator('tr:not(:first-child), .filing-row, .filing-card').first();

    if (await firstFiling.isVisible()) {
      await firstFiling.click();
      await helpers.waitForPageLoad();

      // Should show filing details
      await expect(adminPage.locator('text=Filing Details, text=Tax Return Details')).toBeVisible();
      await helpers.takeScreenshot('filing-details-view');
    }
  });

  test('should show due date warnings', async ({ adminPage }) => {
    await adminPage.goto('/filings');
    await helpers.waitForPageLoad();

    // Look for overdue or warning indicators
    const warningIndicators = adminPage.locator('.text-destructive, .text-red-500, .overdue, [data-status="overdue"]');

    if (await warningIndicators.count() > 0) {
      await expect(warningIndicators.first()).toBeVisible();
      await helpers.takeScreenshot('filing-overdue-warnings');
    }
  });

  test('should handle mobile responsive view', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/filings');
    await helpers.waitForPageLoad();

    // Check mobile layout
    await helpers.takeScreenshot('filings-mobile-view');

    // Check if navigation adapts to mobile
    const mobileNav = page.locator('.mobile-nav, [data-testid="mobile-menu"]');
    if (await mobileNav.isVisible()) {
      await mobileNav.click();
      await helpers.takeScreenshot('filings-mobile-menu');
    }
  });

  test('should search filings', async ({ adminPage }) => {
    await adminPage.goto('/filings');
    await helpers.waitForPageLoad();

    const searchInput = adminPage.locator('input[type="search"], input[placeholder*="search"], [data-testid="filings-search"]');

    if (await searchInput.isVisible()) {
      await searchInput.fill('VAT');
      await adminPage.keyboard.press('Enter');
      await helpers.waitForPageLoad();

      await helpers.takeScreenshot('filings-search-results');

      // Clear search
      await searchInput.clear();
      await adminPage.keyboard.press('Enter');
      await helpers.waitForPageLoad();
    }
  });

  test('should export filings data', async ({ adminPage }) => {
    await adminPage.goto('/filings');
    await helpers.waitForPageLoad();

    const exportButton = adminPage.locator('text=Export, text=Download, [data-testid="export-filings"]');

    if (await exportButton.isVisible()) {
      await exportButton.click();

      // Should show export options or trigger download
      await helpers.takeScreenshot('filings-export-initiated');
    }
  });
});

test.describe('VAT Return Workflow Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ kajPage }) => {
    helpers = new TestHelpers(kajPage);
  });

  test('should access VAT return form', async ({ kajPage }) => {
    await kajPage.goto('/filings/vat-return');
    await helpers.waitForPageLoad();

    // Should show VAT return form
    await expect(kajPage.locator('text=VAT Return, text=VAT-3 Form')).toBeVisible();
    await helpers.takeScreenshot('vat-return-form');
  });

  test('should validate VAT form fields', async ({ kajPage }) => {
    await kajPage.goto('/filings/vat-return');
    await helpers.waitForPageLoad();

    // Try to submit empty form
    const submitButton = kajPage.locator('button[type="submit"], text=Submit');

    if (await submitButton.isVisible()) {
      await submitButton.click();

      // Should show validation errors
      const requiredFields = kajPage.locator('[aria-invalid="true"], .error');

      if (await requiredFields.count() > 0) {
        await helpers.takeScreenshot('vat-form-validation-errors');
      }
    }
  });
});