import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Authentication Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('should display login page correctly', async ({ page }) => {
    await page.goto('/login');
    await helpers.waitForPageLoad();

    // Take screenshot of login page
    await helpers.takeScreenshot('login-page-initial');

    // Check page title and branding
    await expect(page.locator('text=GCMC & KAJ Platform')).toBeVisible();
    await expect(page.locator('text=Admin Login')).toBeVisible();
    await expect(page.locator('text=Enter your credentials to access the dashboard')).toBeVisible();

    // Check form fields are present
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Check links
    await expect(page.locator('text=Forgot password?')).toBeVisible();
    await expect(page.locator('text=Go to Client Portal Login')).toBeVisible();
  });

  test('should reject invalid login credentials', async ({ page }) => {
    await page.goto('/login');
    await helpers.waitForPageLoad();

    // Try invalid email
    await helpers.fillAndVerify('input[type="email"]', 'invalid@example.com');
    await helpers.fillAndVerify('input[type="password"]', 'wrongpassword');

    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=Invalid email or password')).toBeVisible();

    // Take screenshot of error state
    await helpers.takeScreenshot('login-invalid-credentials');
  });

  test('should successfully login as SUPER_ADMIN', async ({ page }) => {
    await page.goto('/login');
    await helpers.waitForPageLoad();

    // Enter valid admin credentials
    await helpers.fillAndVerify('input[type="email"]', 'admin@gcmc.gy');
    await helpers.fillAndVerify('input[type="password"]', process.env.SEED_ADMIN_PASSWORD || 'admin123');

    // Submit form and wait for redirect
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.click('button[type="submit"]')
    ]);

    // Should redirect to dashboard
    expect(page.url()).toContain('/');

    // Should show admin interface elements
    await expect(page.locator('text=Dashboard')).toBeVisible();

    // Take screenshot of successful admin login
    await helpers.takeScreenshot('login-admin-success');
  });

  test('should successfully login as GCMC_STAFF', async ({ page }) => {
    await page.goto('/login');
    await helpers.waitForPageLoad();

    await helpers.fillAndVerify('input[type="email"]', 'gcmc@gcmc.gy');
    await helpers.fillAndVerify('input[type="password"]', process.env.SEED_GCMC_PASSWORD || 'gcmc123');

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.click('button[type="submit"]')
    ]);

    expect(page.url()).toContain('/');
    await helpers.takeScreenshot('login-gcmc-staff-success');
  });

  test('should successfully login as KAJ_STAFF', async ({ page }) => {
    await page.goto('/login');
    await helpers.waitForPageLoad();

    await helpers.fillAndVerify('input[type="email"]', 'kaj@gcmc.gy');
    await helpers.fillAndVerify('input[type="password"]', process.env.SEED_KAJ_PASSWORD || 'kaj123');

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.click('button[type="submit"]')
    ]);

    expect(page.url()).toContain('/');
    await helpers.takeScreenshot('login-kaj-staff-success');
  });

  test('should redirect CLIENT to portal', async ({ page }) => {
    await page.goto('/login');
    await helpers.waitForPageLoad();

    await helpers.fillAndVerify('input[type="email"]', 'client@testcorp.gy');
    await helpers.fillAndVerify('input[type="password"]', process.env.SEED_CLIENT_PASSWORD || 'client123');

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.click('button[type="submit"]')
    ]);

    // Should redirect to portal
    expect(page.url()).toContain('/portal');
    await helpers.takeScreenshot('login-client-portal-redirect');
  });

  test('should show loading state during login', async ({ page }) => {
    await page.goto('/login');
    await helpers.waitForPageLoad();

    await helpers.fillAndVerify('input[type="email"]', 'admin@gcmc.gy');
    await helpers.fillAndVerify('input[type="password"]', process.env.SEED_ADMIN_PASSWORD || 'admin123');

    // Click submit and immediately check for loading state
    await page.click('button[type="submit"]');

    // Should show loading spinner
    await expect(page.locator('.animate-spin')).toBeVisible();

    // Button should be disabled during loading
    await expect(page.locator('button[type="submit"]')).toBeDisabled();

    // Wait for login to complete
    await page.waitForNavigation({ waitUntil: 'networkidle' });
  });

  test('should handle session persistence', async ({ page }) => {
    // Login first
    await helpers.login('admin@gcmc.gy', process.env.SEED_ADMIN_PASSWORD || 'admin123');

    // Navigate away and back
    await page.goto('/clients');
    await helpers.waitForPageLoad();

    // Should still be logged in
    await helpers.verifyAuthenticated();

    // Refresh page
    await page.reload();
    await helpers.waitForPageLoad();

    // Should still be authenticated
    await helpers.verifyAuthenticated();

    await helpers.takeScreenshot('session-persistence-verified');
  });

  test('should protect dashboard routes when not authenticated', async ({ page }) => {
    // Try to access protected route without login
    await page.goto('/clients');

    // Should redirect to login page
    await expect(page).toHaveURL('/login');
    await helpers.verifyOnLoginPage();

    await helpers.takeScreenshot('protected-route-redirect');
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await helpers.login('admin@gcmc.gy', process.env.SEED_ADMIN_PASSWORD || 'admin123');

    // Find and click logout button
    const logoutButton = page.locator('text=Logout, text=Sign Out').first();
    await expect(logoutButton).toBeVisible();

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      logoutButton.click()
    ]);

    // Should redirect to login page
    await expect(page).toHaveURL('/login');
    await helpers.verifyOnLoginPage();

    await helpers.takeScreenshot('logout-success');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate network failure
    await page.route('**/api/auth/**', route => route.abort());

    await page.goto('/login');
    await helpers.waitForPageLoad();

    await helpers.fillAndVerify('input[type="email"]', 'admin@gcmc.gy');
    await helpers.fillAndVerify('input[type="password"]', process.env.SEED_ADMIN_PASSWORD || 'admin123');

    await page.click('button[type="submit"]');

    // Should show error message for network failure
    await expect(page.locator('text=An unexpected error occurred')).toBeVisible();

    await helpers.takeScreenshot('network-error-handling');
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/login');
    await helpers.waitForPageLoad();

    // Enter invalid email format
    await helpers.fillAndVerify('input[type="email"]', 'invalid-email');
    await helpers.fillAndVerify('input[type="password"]', process.env.SEED_CLIENT_PASSWORD || 'password123');

    await page.click('button[type="submit"]');

    // Should show HTML5 validation error
    const emailInput = page.locator('input[type="email"]');
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();

    await helpers.takeScreenshot('email-validation-error');
  });

  test('should require both email and password', async ({ page }) => {
    await page.goto('/login');
    await helpers.waitForPageLoad();

    // Try to submit with empty fields
    await page.click('button[type="submit"]');

    // Should show required field validation
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    expect(await emailInput.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
    expect(await passwordInput.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);

    await helpers.takeScreenshot('required-fields-validation');
  });
});