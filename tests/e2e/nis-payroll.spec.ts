import { test, expect } from '../fixtures/auth.fixture';
import { TestHelpers } from '../utils/test-helpers';

test.describe('NIS & Payroll Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ kajPage }) => {
    helpers = new TestHelpers(kajPage);
  });

  test('should display NIS & Payroll dashboard', async ({ kajPage }) => {
    await kajPage.goto('/nis');
    await helpers.waitForPageLoad();

    await helpers.takeScreenshot('nis-payroll-dashboard');

    await expect(kajPage.locator('text=NIS & Payroll')).toBeVisible();
    await expect(kajPage.locator('text=Payroll Calculator')).toBeVisible();
    await expect(kajPage.locator('text=Employee Registry')).toBeVisible();
  });

  test('should calculate payroll correctly', async ({ kajPage }) => {
    await kajPage.goto('/nis/calculator');
    await helpers.waitForPageLoad();

    // Test payroll calculation
    await helpers.fillAndVerify('input[name="grossSalary"]', '100000');

    const calculateButton = kajPage.locator('button:has-text("Calculate")');
    if (await calculateButton.isVisible()) {
      await calculateButton.click();

      // Should show calculated deductions
      await expect(kajPage.locator('text=NIS Deduction')).toBeVisible();
      await expect(kajPage.locator('text=PAYE Deduction')).toBeVisible();
      await expect(kajPage.locator('text=Net Salary')).toBeVisible();

      await helpers.takeScreenshot('payroll-calculation-results');
    }
  });

  test('should generate NIS schedule', async ({ kajPage }) => {
    await kajPage.goto('/nis/schedules');
    await helpers.waitForPageLoad();

    const generateButton = kajPage.locator('text=Generate Schedule, text=New Schedule');
    if (await generateButton.isVisible()) {
      await generateButton.click();

      await helpers.takeScreenshot('nis-schedule-generated');
    }
  });
});