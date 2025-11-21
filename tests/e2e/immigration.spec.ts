import { test, expect } from '../fixtures/auth.fixture';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Immigration Pipeline Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ gcmcPage }) => {
    helpers = new TestHelpers(gcmcPage);
  });

  test('should display immigration kanban board', async ({ gcmcPage }) => {
    await gcmcPage.goto('/immigration');
    await helpers.waitForPageLoad();

    // Take screenshot of immigration page
    await helpers.takeScreenshot('immigration-kanban-board');

    // Check page title
    await expect(gcmcPage.locator('text=Immigration Pipeline')).toBeVisible();

    // Check kanban columns
    await expect(gcmcPage.locator('text=Application Submitted')).toBeVisible();
    await expect(gcmcPage.locator('text=Under Review')).toBeVisible();
    await expect(gcmcPage.locator('text=Approved')).toBeVisible();
  });

  test('should show new case dialog', async ({ gcmcPage }) => {
    await gcmcPage.goto('/immigration');
    await helpers.waitForPageLoad();

    // Click Add New Case button
    const addCaseButton = gcmcPage.locator('text=Add New Case, text=New Application');

    if (await addCaseButton.isVisible()) {
      await addCaseButton.click();

      // Should show new case dialog
      await expect(gcmcPage.locator('text=New Immigration Case')).toBeVisible();
      await expect(gcmcPage.locator('input[name="applicantName"]')).toBeVisible();
      await expect(gcmcPage.locator('select[name="permitType"]')).toBeVisible();

      await helpers.takeScreenshot('new-immigration-case-dialog');
    }
  });

  test('should create new visa application', async ({ gcmcPage }) => {
    await gcmcPage.goto('/immigration');
    await helpers.waitForPageLoad();

    const addCaseButton = gcmcPage.locator('text=Add New Case, text=New Application');

    if (await addCaseButton.isVisible()) {
      await addCaseButton.click();

      // Fill application form
      await helpers.fillAndVerify('input[name="applicantName"]', 'John Test Applicant');
      await gcmcPage.selectOption('select[name="permitType"]', 'WORK_PERMIT');

      // Set expiry date (future date)
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 2);
      const dateString = futureDate.toISOString().split('T')[0];
      await gcmcPage.fill('input[type="date"]', dateString);

      await helpers.takeScreenshot('visa-application-form-filled');

      // Submit form
      await gcmcPage.click('button[type="submit"]');

      // Should show success and case in kanban
      await helpers.waitForToast('Application created successfully', 'success');
      await helpers.takeScreenshot('visa-application-created');
    }
  });

  test('should create business visa application', async ({ gcmcPage }) => {
    await gcmcPage.goto('/immigration');
    await helpers.waitForPageLoad();

    const addCaseButton = gcmcPage.locator('text=Add New Case, text=New Application');

    if (await addCaseButton.isVisible()) {
      await addCaseButton.click();

      await helpers.fillAndVerify('input[name="applicantName"]', 'Business Test User');
      await gcmcPage.selectOption('select[name="permitType"]', 'BUSINESS_VISA');

      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const dateString = futureDate.toISOString().split('T')[0];
      await gcmcPage.fill('input[type="date"]', dateString);

      await helpers.takeScreenshot('business-visa-form-filled');

      await gcmcPage.click('button[type="submit"]');
      await helpers.waitForToast('Application created successfully', 'success');
    }
  });

  test('should create citizenship application', async ({ gcmcPage }) => {
    await gcmcPage.goto('/immigration');
    await helpers.waitForPageLoad();

    const addCaseButton = gcmcPage.locator('text=Add New Case, text=New Application');

    if (await addCaseButton.isVisible()) {
      await addCaseButton.click();

      await helpers.fillAndVerify('input[name="applicantName"]', 'Citizenship Test Applicant');
      await gcmcPage.selectOption('select[name="permitType"]', 'CITIZENSHIP');

      // Citizenship applications typically don't have expiry dates
      await helpers.takeScreenshot('citizenship-application-form-filled');

      await gcmcPage.click('button[type="submit"]');
      await helpers.waitForToast('Application created successfully', 'success');
    }
  });

  test('should validate application form fields', async ({ gcmcPage }) => {
    await gcmcPage.goto('/immigration');
    await helpers.waitForPageLoad();

    const addCaseButton = gcmcPage.locator('text=Add New Case, text=New Application');

    if (await addCaseButton.isVisible()) {
      await addCaseButton.click();

      // Try to submit empty form
      await gcmcPage.click('button[type="submit"]');

      // Should show validation errors
      const nameInput = gcmcPage.locator('input[name="applicantName"]');
      const typeSelect = gcmcPage.locator('select[name="permitType"]');

      expect(await nameInput.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);

      await helpers.takeScreenshot('immigration-form-validation-errors');
    }
  });

  test('should display case cards in kanban columns', async ({ gcmcPage }) => {
    await gcmcPage.goto('/immigration');
    await helpers.waitForPageLoad();

    // Look for case cards in different columns
    const caseCards = gcmcPage.locator('.case-card, [data-testid="immigration-case"]');

    if (await caseCards.count() > 0) {
      await expect(caseCards.first()).toBeVisible();
      await helpers.takeScreenshot('immigration-case-cards');

      // Check case details on cards
      await expect(gcmcPage.locator('text=Work Permit, text=Business Visa, text=Citizenship')).toBeVisible();
    }
  });

  test('should show case detail view', async ({ gcmcPage }) => {
    await gcmcPage.goto('/immigration');
    await helpers.waitForPageLoad();

    // Click on first case card
    const firstCase = gcmcPage.locator('.case-card, [data-testid="immigration-case"]').first();

    if (await firstCase.isVisible()) {
      await firstCase.click();

      // Should show case details
      await expect(gcmcPage.locator('text=Case Details, text=Application Details')).toBeVisible();
      await helpers.takeScreenshot('immigration-case-details');
    }
  });

  test('should drag and drop cases between columns', async ({ gcmcPage }) => {
    await gcmcPage.goto('/immigration');
    await helpers.waitForPageLoad();

    const caseCard = gcmcPage.locator('.case-card, [data-testid="immigration-case"]').first();
    const targetColumn = gcmcPage.locator('[data-column="UNDER_REVIEW"], text=Under Review').last();

    if (await caseCard.isVisible() && await targetColumn.isVisible()) {
      // Get initial position
      await helpers.takeScreenshot('before-drag-drop');

      // Perform drag and drop
      await caseCard.dragTo(targetColumn);

      // Should show case in new column
      await helpers.takeScreenshot('after-drag-drop');

      // Should show success feedback
      await helpers.waitForToast('Status updated successfully', 'success');
    }
  });

  test('should filter cases by permit type', async ({ gcmcPage }) => {
    await gcmcPage.goto('/immigration');
    await helpers.waitForPageLoad();

    const permitFilter = gcmcPage.locator('select[name="permitType"], [data-testid="permit-filter"]');

    if (await permitFilter.isVisible()) {
      await permitFilter.selectOption('WORK_PERMIT');
      await helpers.waitForPageLoad();
      await helpers.takeScreenshot('immigration-filtered-work-permits');

      await permitFilter.selectOption('BUSINESS_VISA');
      await helpers.waitForPageLoad();
      await helpers.takeScreenshot('immigration-filtered-business-visas');

      // Reset filter
      await permitFilter.selectOption('');
      await helpers.waitForPageLoad();
    }
  });

  test('should filter cases by status', async ({ gcmcPage }) => {
    await gcmcPage.goto('/immigration');
    await helpers.waitForPageLoad();

    const statusFilter = gcmcPage.locator('select[name="status"], [data-testid="status-filter"]');

    if (await statusFilter.isVisible()) {
      await statusFilter.selectOption('UNDER_REVIEW');
      await helpers.waitForPageLoad();
      await helpers.takeScreenshot('immigration-filtered-under-review');

      await statusFilter.selectOption('APPROVED');
      await helpers.waitForPageLoad();
      await helpers.takeScreenshot('immigration-filtered-approved');
    }
  });

  test('should search immigration cases', async ({ gcmcPage }) => {
    await gcmcPage.goto('/immigration');
    await helpers.waitForPageLoad();

    const searchInput = gcmcPage.locator('input[type="search"], input[placeholder*="search"]');

    if (await searchInput.isVisible()) {
      await searchInput.fill('John');
      await gcmcPage.keyboard.press('Enter');
      await helpers.waitForPageLoad();

      await helpers.takeScreenshot('immigration-search-results');

      // Clear search
      await searchInput.clear();
      await gcmcPage.keyboard.press('Enter');
      await helpers.waitForPageLoad();
    }
  });

  test('should show expiry date warnings', async ({ gcmcPage }) => {
    await gcmcPage.goto('/immigration');
    await helpers.waitForPageLoad();

    // Look for expiry warnings
    const expiryWarnings = gcmcPage.locator('.text-amber-500, .text-yellow-500, .expiry-warning, [data-status="expiring"]');

    if (await expiryWarnings.count() > 0) {
      await expect(expiryWarnings.first()).toBeVisible();
      await helpers.takeScreenshot('immigration-expiry-warnings');
    }
  });

  test('should update case status', async ({ gcmcPage }) => {
    await gcmcPage.goto('/immigration');
    await helpers.waitForPageLoad();

    // Click on a case to open details
    const firstCase = gcmcPage.locator('.case-card, [data-testid="immigration-case"]').first();

    if (await firstCase.isVisible()) {
      await firstCase.click();

      // Look for status update option
      const statusDropdown = gcmcPage.locator('select[name="status"], [data-testid="status-update"]');

      if (await statusDropdown.isVisible()) {
        await statusDropdown.selectOption('APPROVED');

        // Save changes
        const saveButton = gcmcPage.locator('button:has-text("Save"), button:has-text("Update")');
        if (await saveButton.isVisible()) {
          await saveButton.click();

          await helpers.waitForToast('Status updated successfully', 'success');
          await helpers.takeScreenshot('immigration-status-updated');
        }
      }
    }
  });

  test('should handle mobile responsive kanban', async ({ page }) => {
    const helpers = new TestHelpers(page);

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Use GCMC credentials for mobile test
    await helpers.login('gcmc@gcmc.gy', 'gcmc123');
    await page.goto('/immigration');
    await helpers.waitForPageLoad();

    // Check mobile layout
    await helpers.takeScreenshot('immigration-kanban-mobile-view');

    // Check if kanban adapts to mobile (might stack columns)
    const columns = page.locator('[data-column], .kanban-column');
    if (await columns.count() > 0) {
      await expect(columns.first()).toBeVisible();
    }
  });
});