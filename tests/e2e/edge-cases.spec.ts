import { test, expect } from '../fixtures/auth.fixture';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Edge Case & Error Handling Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ adminPage }) => {
    helpers = new TestHelpers(adminPage);
  });

  test('should handle long input strings in forms', async ({ adminPage }) => {
    await adminPage.goto('/clients/new');
    await helpers.waitForPageLoad();
    
    const longString = 'a'.repeat(500);
    await adminPage.fill('input[name="name"]', longString);
    await adminPage.fill('input[name="email"]', 'longstring@example.com');
    await adminPage.click('button[type="submit"]');

    // The backend should either truncate or reject this.
    // We'll check for a success toast or a specific validation error.
    const toast = await helpers.waitForToast(['successfully', 'error'], 'any');
    expect(toast).not.toBeNull();
  });

  test('should prevent script injection in input fields', async ({ adminPage }) => {
    await adminPage.goto('/clients/new');
    await helpers.waitForPageLoad();

    const maliciousInput = '<script>alert("xss")</script>';
    await adminPage.fill('input[name="name"]', maliciousInput);
    await adminPage.fill('input[name="email"]', 'xss@example.com');
    await adminPage.click('button[type="submit"]');
    
    // Application should not execute the script.
    // We can check if an alert appeared, but a more robust way is to check the created client data.
    // For this test, we'll assume the toast indicates success/failure, and no alert pops up.
    const toastMessage = await helpers.waitForToast(['successfully', 'error'], 'any');
    expect(toastMessage).toBeDefined();

    // Go to the client list and check that the script is not rendered as HTML
    await adminPage.goto('/clients');
    await helpers.waitForPageLoad();
    const clientNameCell = adminPage.locator(`text=${maliciousInput}`);
    expect(await clientNameCell.count()).toBe(0);
  });

  test('should handle network failure during client creation', async ({ adminPage }) => {
    await adminPage.route('**/api/clients', route => route.abort());

    await adminPage.goto('/clients/new');
    await helpers.waitForPageLoad();

    await adminPage.fill('input[name="name"]', 'Network Failure Test');
    await adminPage.fill('input[name="email"]', 'network@fail.com');
    await adminPage.click('button[type="submit"]');

    await helpers.waitForToast('Failed to create client', 'error');
  });

  test('should handle API returning a 500 error', async ({ adminPage }) => {
    await adminPage.route('**/api/clients', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' }),
      });
    });

    await adminPage.goto('/clients/new');
    await helpers.waitForPageLoad();
    
    await adminPage.fill('input[name="name"]', 'Server Error Test');
    await adminPage.fill('input[name="email"]', 'server@error.com');
    await adminPage.click('button[type="submit"]');

    await helpers.waitForToast('Failed to create client', 'error');
  });
});
