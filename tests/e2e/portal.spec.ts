import { test, expect } from '../fixtures/auth.fixture';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Client Portal Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ clientPage }) => {
    helpers = new TestHelpers(clientPage);
  });

  test('should display client portal dashboard', async ({ clientPage }) => {
    await clientPage.goto('/portal');
    await helpers.waitForPageLoad();

    await helpers.takeScreenshot('client-portal-dashboard');

    // Check portal layout
    await expect(clientPage.locator('text=Client Portal, text=Dashboard')).toBeVisible();
    await expect(clientPage.locator('text=My Services, text=Documents')).toBeVisible();
  });

  test('should show client documents', async ({ clientPage }) => {
    await clientPage.goto('/portal/documents');
    await helpers.waitForPageLoad();

    await expect(clientPage.locator('text=My Documents')).toBeVisible();
    await helpers.takeScreenshot('portal-documents-page');
  });

  test('should allow service requests', async ({ clientPage }) => {
    await clientPage.goto('/portal/services');
    await helpers.waitForPageLoad();

    const requestButton = clientPage.locator('text=Request Service, text=New Request');
    if (await requestButton.isVisible()) {
      await requestButton.click();
      await helpers.takeScreenshot('portal-service-request');
    }
  });

  test('should show client profile', async ({ clientPage }) => {
    await clientPage.goto('/portal/profile');
    await helpers.waitForPageLoad();

    await expect(clientPage.locator('text=My Profile, text=Account Information')).toBeVisible();
    await helpers.takeScreenshot('portal-client-profile');
  });
});