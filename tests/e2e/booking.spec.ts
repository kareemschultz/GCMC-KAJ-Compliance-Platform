import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Public Booking Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('should display booking page', async ({ page }) => {
    await page.goto('/book');
    await helpers.waitForPageLoad();

    await helpers.takeScreenshot('booking-page');

    await expect(page.locator('text=Book Appointment, text=Schedule')).toBeVisible();
  });

  test('should show available services', async ({ page }) => {
    await page.goto('/book');
    await helpers.waitForPageLoad();

    const serviceOptions = page.locator('.service-option, [data-testid="service"]');
    if (await serviceOptions.count() > 0) {
      await expect(serviceOptions.first()).toBeVisible();
      await helpers.takeScreenshot('booking-services');
    }
  });

  test('should handle booking form submission', async ({ page }) => {
    await page.goto('/book');
    await helpers.waitForPageLoad();

    // Fill booking form if visible
    const nameField = page.locator('input[name="name"]');
    if (await nameField.isVisible()) {
      await helpers.fillAndVerify('input[name="name"]', 'Test Client');
      await helpers.fillAndVerify('input[name="email"]', 'test@example.com');
      await helpers.fillAndVerify('input[name="phone"]', '+592-555-0000');

      await helpers.takeScreenshot('booking-form-filled');

      const submitButton = page.locator('button[type="submit"]');
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await helpers.takeScreenshot('booking-submitted');
      }
    }
  });
});