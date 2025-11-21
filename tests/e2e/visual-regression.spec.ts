import { test, expect } from '../fixtures/auth.fixture';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Visual Regression Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ adminPage }) => {
    helpers = new TestHelpers(adminPage);
  });

  test('should match login page design', async ({ page }) => {
    await page.goto('/login');
    await helpers.waitForPageLoad();

    await expect(page).toHaveScreenshot('login-page-baseline.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('should match dashboard layout', async ({ adminPage }) => {
    await adminPage.goto('/');
    await helpers.waitForPageLoad();

    await expect(adminPage).toHaveScreenshot('dashboard-baseline.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('should match clients page layout', async ({ adminPage }) => {
    await adminPage.goto('/clients');
    await helpers.waitForPageLoad();

    await expect(adminPage).toHaveScreenshot('clients-page-baseline.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('should match filings page layout', async ({ adminPage }) => {
    await adminPage.goto('/filings');
    await helpers.waitForPageLoad();

    await expect(adminPage).toHaveScreenshot('filings-page-baseline.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('should match responsive mobile views', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const testPages = ['/login', '/', '/clients', '/filings'];

    for (const testPage of testPages) {
      await page.goto(testPage);
      await helpers.waitForPageLoad();

      const pageName = testPage.replace('/', '') || 'home';
      await expect(page).toHaveScreenshot(`mobile-${pageName}-baseline.png`, {
        fullPage: true,
        animations: 'disabled'
      });
    }
  });

  test('should match tablet views', async ({ page }) => {
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto('/');
    await helpers.waitForPageLoad();

    await expect(page).toHaveScreenshot('tablet-dashboard-baseline.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });
});