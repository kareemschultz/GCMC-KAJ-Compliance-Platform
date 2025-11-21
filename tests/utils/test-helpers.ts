import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Take a screenshot with a descriptive name
   */
  async takeScreenshot(name: string, fullPage = true) {
    await this.page.screenshot({
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage
    });
  }

  /**
   * Fill a form field and verify it was filled correctly
   */
  async fillAndVerify(selector: string, value: string) {
    await this.page.fill(selector, value);
    await expect(this.page.locator(selector)).toHaveValue(value);
  }

  /**
   * Click a button and wait for navigation
   */
  async clickAndWaitForNavigation(selector: string, url?: string) {
    const [response] = await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle' }),
      this.page.click(selector)
    ]);

    if (url) {
      expect(this.page.url()).toContain(url);
    }

    return response;
  }

  /**
   * Wait for an element to be visible and ready for interaction
   */
  async waitForElement(selector: string, options?: { timeout?: number }) {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout: options?.timeout });
    return element;
  }

  /**
   * Check if user is properly authenticated by looking for logout button
   */
  async verifyAuthenticated() {
    // Look for common authenticated elements
    const logoutButton = this.page.locator('text=Logout, text=Sign Out, [data-testid="logout"]').first();
    await expect(logoutButton).toBeVisible({ timeout: 10000 });
  }

  /**
   * Check if user is on login page
   */
  async verifyOnLoginPage() {
    await expect(this.page.locator('text=Admin Login')).toBeVisible();
    await expect(this.page.locator('input[type="email"]')).toBeVisible();
    await expect(this.page.locator('input[type="password"]')).toBeVisible();
  }

  /**
   * Login with provided credentials
   */
  async login(email: string, password: string) {
    await this.page.goto('/login');
    await this.fillAndVerify('input[type="email"]', email);
    await this.fillAndVerify('input[type="password"]', password);

    await this.clickAndWaitForNavigation('button[type="submit"]');

    // Verify successful login
    await this.waitForPageLoad();
  }

  /**
   * Create a test client
   */
  async createTestClient(clientData: {
    name: string;
    type: 'INDIVIDUAL' | 'COMPANY';
    email: string;
    phone: string;
    address: string;
    tin?: string;
    nis?: string;
  }) {
    // Navigate to clients page
    await this.page.goto('/clients');
    await this.waitForPageLoad();

    // Click add client button
    await this.page.click('text=Add Client, [data-testid="add-client"]');

    // Fill client form
    await this.fillAndVerify('input[name="name"]', clientData.name);
    await this.page.selectOption('select[name="type"]', clientData.type);
    await this.fillAndVerify('input[name="email"]', clientData.email);
    await this.fillAndVerify('input[name="phone"]', clientData.phone);
    await this.fillAndVerify('textarea[name="address"]', clientData.address);

    if (clientData.tin) {
      await this.fillAndVerify('input[name="tinNumber"]', clientData.tin);
    }

    if (clientData.nis) {
      await this.fillAndVerify('input[name="nisNumber"]', clientData.nis);
    }

    // Submit form
    await this.clickAndWaitForNavigation('button[type="submit"]');
  }

  /**
   * Navigate to a specific page and verify it loads
   */
  async navigateToPage(path: string, expectedTitle?: string) {
    await this.page.goto(path);
    await this.waitForPageLoad();

    if (expectedTitle) {
      await expect(this.page.locator('h1, h2').first()).toContainText(expectedTitle);
    }
  }

  /**
   * Check for error messages on the page
   */
  async checkForErrors() {
    const errorSelectors = [
      '.error',
      '.alert-error',
      '[role="alert"]',
      'text=Error',
      'text=Failed',
      'text=Something went wrong'
    ];

    for (const selector of errorSelectors) {
      const errorElement = this.page.locator(selector);
      if (await errorElement.isVisible()) {
        const errorText = await errorElement.textContent();
        throw new Error(`Page contains error: ${errorText}`);
      }
    }
  }

  /**
   * Wait for a toast notification and verify its content
   */
  async waitForToast(expectedText?: string, type: 'success' | 'error' | 'info' = 'success') {
    const toastSelector = '.toast, [data-testid="toast"], .notification';
    const toast = this.page.locator(toastSelector);
    await toast.waitFor({ state: 'visible', timeout: 5000 });

    if (expectedText) {
      await expect(toast).toContainText(expectedText);
    }

    return toast;
  }

  /**
   * Clear all form fields
   */
  async clearForm() {
    const inputs = await this.page.locator('input, textarea, select').all();
    for (const input of inputs) {
      await input.clear();
    }
  }
}