import { test, expect } from '../fixtures/auth.fixture';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Dashboard Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ adminPage }) => {
    helpers = new TestHelpers(adminPage);
  });

  test('should display main dashboard', async ({ adminPage }) => {
    await adminPage.goto('/');
    await helpers.waitForPageLoad();

    await helpers.takeScreenshot('main-dashboard');

    await expect(adminPage.locator('text=Dashboard, text=Overview')).toBeVisible();
  });

  test('should show dashboard statistics', async ({ adminPage }) => {
    await adminPage.goto('/');
    await helpers.waitForPageLoad();

    const statsCards = adminPage.locator('.stats-card, .metric-card, [data-testid="stats"]');
    if (await statsCards.count() > 0) {
      await expect(statsCards.first()).toBeVisible();
      await helpers.takeScreenshot('dashboard-statistics');
    }
  });

  test('should navigate to different sections', async ({ adminPage }) => {
    await adminPage.goto('/');
    await helpers.waitForPageLoad();

    // Test navigation to clients
    const clientsLink = adminPage.locator('a[href*="/clients"], text=Clients').first();
    if (await clientsLink.isVisible()) {
      await clientsLink.click();
      await helpers.waitForPageLoad();
      expect(adminPage.url()).toContain('/clients');
    }

    // Navigate back to dashboard
    await adminPage.goto('/');
    await helpers.waitForPageLoad();

    // Test navigation to filings
    const filingsLink = adminPage.locator('a[href*="/filings"], text=Filings').first();
    if (await filingsLink.isVisible()) {
      await filingsLink.click();
      await helpers.waitForPageLoad();
      expect(adminPage.url()).toContain('/filings');
    }
  });

  test('should show recent activity', async ({ adminPage }) => {
    await adminPage.goto('/');
    await helpers.waitForPageLoad();

    const activityFeed = adminPage.locator('.activity-feed, .recent-activity, [data-testid="activity"]');
    if (await activityFeed.isVisible()) {
      await helpers.takeScreenshot('dashboard-recent-activity');
    }
  });

  test('should display quick actions', async ({ adminPage }) => {
    await adminPage.goto('/');
    await helpers.waitForPageLoad();

    const quickActions = adminPage.locator('.quick-actions, [data-testid="quick-actions"]');
    if (await quickActions.isVisible()) {
      await helpers.takeScreenshot('dashboard-quick-actions');
    }
  });
});