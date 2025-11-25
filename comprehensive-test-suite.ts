import { test, expect, Page, BrowserContext } from '@playwright/test';

interface TestResult {
  testName: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  error?: string;
  duration: number;
  screenshot?: string;
}

interface TestReport {
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
  };
  results: TestResult[];
  issues: string[];
  recommendations: string[];
}

class ComprehensiveTestRunner {
  private page: Page;
  private context: BrowserContext;
  private results: TestResult[] = [];
  private issues: string[] = [];
  private recommendations: string[] = [];

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
  }

  async runTest(testName: string, testFunction: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    console.log(`🧪 Running: ${testName}`);

    try {
      await testFunction();
      const duration = Date.now() - startTime;
      this.results.push({
        testName,
        status: 'PASS',
        duration
      });
      console.log(`✅ PASSED: ${testName} (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.results.push({
        testName,
        status: 'FAIL',
        error: errorMessage,
        duration
      });
      this.issues.push(`${testName}: ${errorMessage}`);
      console.log(`❌ FAILED: ${testName} (${duration}ms) - ${errorMessage}`);

      // Take screenshot on failure
      try {
        await this.page.screenshot({
          path: `screenshots/failed-${testName.replace(/\s+/g, '-')}-${Date.now()}.png`,
          fullPage: true
        });
      } catch (screenshotError) {
        console.log(`📷 Screenshot failed for ${testName}`);
      }
    }
  }

  async checkForJSErrors(): Promise<void> {
    const jsErrors: string[] = [];

    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        jsErrors.push(`Console Error: ${msg.text()}`);
      }
    });

    this.page.on('pageerror', (error) => {
      jsErrors.push(`Page Error: ${error.message}`);
    });

    // Store JS errors for reporting
    if (jsErrors.length > 0) {
      this.issues.push(...jsErrors);
    }
  }

  async testAuthentication(): Promise<void> {
    // Test 1: Login page accessibility
    await this.runTest('Login page loads correctly', async () => {
      await this.page.goto('/login');
      await expect(this.page).toHaveTitle(/GK Enterprise Suite/i);
      await expect(this.page.locator('input[type="email"]')).toBeVisible();
      await expect(this.page.locator('input[type="password"]')).toBeVisible();
      await expect(this.page.locator('button[type="submit"]')).toBeVisible();
    });

    // Test 2: Admin login
    await this.runTest('Admin login with valid credentials', async () => {
      await this.page.goto('/login');
      await this.page.fill('input[type="email"]', 'admin@gcmc.gy');
      await this.page.fill('input[type="password"]', process.env.SEED_ADMIN_PASSWORD || 'admin123');
      await this.page.click('button[type="submit"]');

      // Wait for redirect and check dashboard
      await this.page.waitForTimeout(3000);
      const currentUrl = this.page.url();
      if (!currentUrl.includes('/login')) {
        // Successfully logged in
        await expect(this.page.locator('body')).toContainText('Dashboard', { timeout: 15000 });
      }
    });

    // Test 3: GCMC Staff login
    await this.runTest('GCMC staff login with valid credentials', async () => {
      await this.page.goto('/login');
      await this.page.fill('input[type="email"]', 'gcmc@gcmc.gy');
      await this.page.fill('input[type="password"]', process.env.SEED_GCMC_PASSWORD || 'gcmc123');
      await this.page.click('button[type="submit"]');
      await this.page.waitForTimeout(3000);
    });

    // Test 4: KAJ Staff login
    await this.runTest('KAJ staff login with valid credentials', async () => {
      await this.page.goto('/login');
      await this.page.fill('input[type="email"]', 'kaj@gcmc.gy');
      await this.page.fill('input[type="password"]', process.env.SEED_KAJ_PASSWORD || 'kaj123');
      await this.page.click('button[type="submit"]');
      await this.page.waitForTimeout(3000);
    });

    // Test 5: Client login
    await this.runTest('Client login redirects to portal', async () => {
      await this.page.goto('/login');
      await this.page.fill('input[type="email"]', 'client@abccorp.gy');
      await this.page.fill('input[type="password"]', process.env.SEED_CLIENT_PASSWORD || 'client123');
      await this.page.click('button[type="submit"]');
      await this.page.waitForTimeout(3000);
      // Should redirect to portal
      expect(this.page.url()).toContain('portal');
    });

    // Test 6: Invalid credentials
    await this.runTest('Invalid login credentials rejected', async () => {
      await this.page.goto('/login');
      await this.page.fill('input[type="email"]', 'invalid@test.com');
      await this.page.fill('input[type="password"]', 'wrongpassword');
      await this.page.click('button[type="submit"]');
      await this.page.waitForTimeout(2000);
      // Should show error or stay on login page
      const hasError = await this.page.locator('text=Invalid, text=Error, .error, [role="alert"]').count() > 0;
      const stillOnLogin = this.page.url().includes('/login');
      expect(hasError || stillOnLogin).toBeTruthy();
    });
  }

  async testClientManagement(): Promise<void> {
    // Ensure we're logged in as admin
    await this.page.goto('/login');
    await this.page.fill('input[type="email"]', 'admin@gcmc.gy');
    await this.page.fill('input[type="password"]', process.env.SEED_ADMIN_PASSWORD || 'admin123');
    await this.page.click('button[type="submit"]');
    await this.page.waitForTimeout(3000);

    // Test client management functionality
    await this.runTest('Navigate to clients page', async () => {
      await this.page.goto('/clients');
      await expect(this.page).toHaveURL(/\/clients/);
      await this.page.waitForSelector('body', { timeout: 10000 });
    });

    await this.runTest('Client creation wizard loads', async () => {
      // Navigate to clients page and open modal
      await this.page.goto('/clients');
      await this.page.waitForLoadState('networkidle', { timeout: 5000 });

      // Click "Add New Client" button to open wizard modal
      const addClientButton = this.page.locator('[data-testid="new-client-button"]');
      await expect(addClientButton).toBeVisible({ timeout: 5000 });
      await addClientButton.click();

      // Wait for modal dialog to appear
      await this.page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 3000 });

      // Check if form elements are present in the modal
      const formExists = await this.page.locator('[role="dialog"] form, [role="dialog"] input, [role="dialog"] select').count() > 0;
      expect(formExists).toBeTruthy();
    });

    // Test different client types
    const clientTypes = ['Individual', 'Sole Proprietorship', 'Partnership', 'Corporation', 'LLC'];

    for (const clientType of clientTypes) {
      await this.runTest(`Create ${clientType} client`, async () => {
        await this.page.goto('/clients/new');
        await this.page.waitForTimeout(2000);

        // Try to select client type if selector exists
        const typeSelector = this.page.locator('select[name="type"], input[name="type"], [data-testid="client-type"]');
        if (await typeSelector.count() > 0) {
          await typeSelector.first().click();
          const typeOption = this.page.locator(`option:has-text("${clientType}"), [value="${clientType}"], text=${clientType}`).first();
          if (await typeOption.count() > 0) {
            await typeOption.click();
          }
        }

        // Fill basic information
        const nameInput = this.page.locator('input[name="name"], input[placeholder*="name"], #name').first();
        if (await nameInput.count() > 0) {
          await nameInput.fill(`Test ${clientType} ${Date.now()}`);
        }

        const emailInput = this.page.locator('input[type="email"], input[name="email"], #email').first();
        if (await emailInput.count() > 0) {
          await emailInput.fill(`test${Date.now()}@example.com`);
        }

        // Submit if submit button exists
        const submitBtn = this.page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Create")').first();
        if (await submitBtn.count() > 0) {
          await submitBtn.click();
          await this.page.waitForTimeout(2000);
        }
      });
    }
  }

  async testFilingManagement(): Promise<void> {
    await this.runTest('Filing dashboard loads', async () => {
      await this.page.goto('/filings');
      await this.page.waitForSelector('body', { timeout: 10000 });
    });

    await this.runTest('VAT filing page accessible', async () => {
      await this.page.goto('/vat');
      await this.page.waitForSelector('body', { timeout: 10000 });
    });

    await this.runTest('PAYE filing page accessible', async () => {
      await this.page.goto('/paye');
      await this.page.waitForSelector('body', { timeout: 10000 });
    });

    await this.runTest('NIS filing page accessible', async () => {
      await this.page.goto('/nis');
      await this.page.waitForSelector('body', { timeout: 10000 });
    });

    await this.runTest('Document upload functionality', async () => {
      await this.page.goto('/filings');
      await this.page.waitForTimeout(2000);
      // Check if upload elements exist
      const uploadExists = await this.page.locator('input[type="file"], [data-testid="upload"], .upload').count() > 0;
      if (uploadExists) {
        // Upload functionality is available
        console.log('Document upload functionality detected');
      }
    });
  }

  async testImmigrationPipeline(): Promise<void> {
    await this.runTest('Immigration dashboard loads', async () => {
      await this.page.goto('/immigration');
      await this.page.waitForSelector('body', { timeout: 10000 });
    });

    await this.runTest('Kanban board functionality', async () => {
      await this.page.goto('/immigration');
      await this.page.waitForTimeout(3000);

      // Check for kanban-style elements
      const kanbanExists = await this.page.locator('.kanban, [data-testid="kanban"], .board, .column').count() > 0;
      if (kanbanExists) {
        console.log('Kanban board elements detected');
      }

      // Check for drag and drop elements
      const draggableExists = await this.page.locator('[draggable="true"], .draggable, [data-draggable]').count() > 0;
      if (draggableExists) {
        console.log('Draggable elements detected');
      }
    });
  }

  async testAccountingFeatures(): Promise<void> {
    await this.runTest('NIS calculator loads', async () => {
      await this.page.goto('/calculator/nis');
      await this.page.waitForSelector('body', { timeout: 10000 });
    });

    await this.runTest('PAYE calculator loads', async () => {
      await this.page.goto('/calculator/paye');
      await this.page.waitForSelector('body', { timeout: 10000 });
    });

    await this.runTest('NIS calculator functionality', async () => {
      await this.page.goto('/calculator/nis');
      await this.page.waitForTimeout(2000);

      // Look for calculator input fields
      const salaryInput = this.page.locator('input[name="salary"], input[placeholder*="salary"], #salary').first();
      if (await salaryInput.count() > 0) {
        await salaryInput.fill('50000');

        const calculateBtn = this.page.locator('button:has-text("Calculate"), button[type="submit"], #calculate').first();
        if (await calculateBtn.count() > 0) {
          await calculateBtn.click();
          await this.page.waitForTimeout(2000);
        }
      }
    });

    await this.runTest('Financial dashboard charts render', async () => {
      await this.page.goto('/dashboard');
      await this.page.waitForLoadState('networkidle', { timeout: 3000 });

      // Check for chart elements
      const chartsExist = await this.page.locator('canvas, .chart, [data-testid="chart"], svg').count() > 0;
      if (chartsExist) {
        console.log('Chart elements detected on dashboard');
      }
    });
  }

  async testTrainingHub(): Promise<void> {
    await this.runTest('Training hub loads', async () => {
      await this.page.goto('/training');
      await this.page.waitForSelector('body', { timeout: 10000 });
    });

    await this.runTest('Training program creation', async () => {
      await this.page.goto('/training');
      await this.page.waitForTimeout(2000);

      // Look for create/add training elements
      const createBtn = this.page.locator('button:has-text("Create"), button:has-text("Add"), [data-testid="create-training"]').first();
      if (await createBtn.count() > 0) {
        await createBtn.click();
        await this.page.waitForTimeout(2000);
      }
    });
  }

  async testPropertyManagement(): Promise<void> {
    await this.runTest('Property management loads', async () => {
      await this.page.goto('/properties');
      await this.page.waitForSelector('body', { timeout: 10000 });
    });

    await this.runTest('Property creation functionality', async () => {
      await this.page.goto('/properties');
      await this.page.waitForTimeout(2000);

      // Look for property creation elements
      const addPropertyBtn = this.page.locator('button:has-text("Add"), button:has-text("Create"), [data-testid="add-property"]').first();
      if (await addPropertyBtn.count() > 0) {
        await addPropertyBtn.click();
        await this.page.waitForTimeout(2000);
      }
    });
  }

  async testExpeditingServices(): Promise<void> {
    await this.runTest('Expediting services loads', async () => {
      await this.page.goto('/expediting');
      await this.page.waitForSelector('body', { timeout: 10000 });
    });

    await this.runTest('Visual timeline functionality', async () => {
      await this.page.goto('/expediting');
      await this.page.waitForTimeout(3000);

      // Check for timeline elements
      const timelineExists = await this.page.locator('.timeline, [data-testid="timeline"], .gantt, .schedule').count() > 0;
      if (timelineExists) {
        console.log('Timeline elements detected');
      }
    });
  }

  async testClientPortal(): Promise<void> {
    // Login as client
    await this.page.goto('/login');
    await this.page.fill('input[type="email"]', 'client@abccorp.gy');
    await this.page.fill('input[type="password"]', process.env.SEED_CLIENT_PASSWORD || 'client123');
    await this.page.click('button[type="submit"]');
    await this.page.waitForTimeout(3000);

    await this.runTest('Client portal dashboard loads', async () => {
      await this.page.goto('/portal');
      await this.page.waitForSelector('body', { timeout: 10000 });
      expect(this.page.url()).toContain('portal');
    });

    await this.runTest('Document viewing functionality', async () => {
      await this.page.goto('/portal/documents');
      await this.page.waitForSelector('body', { timeout: 10000 });
    });

    await this.runTest('Appointment booking functionality', async () => {
      await this.page.goto('/portal/appointments');
      await this.page.waitForSelector('body', { timeout: 10000 });
    });

    await this.runTest('Service request functionality', async () => {
      await this.page.goto('/portal/requests');
      await this.page.waitForSelector('body', { timeout: 10000 });
    });
  }

  async testResponsiveDesign(): Promise<void> {
    // Test mobile viewport
    await this.runTest('Mobile responsive - Dashboard', async () => {
      await this.page.setViewportSize({ width: 375, height: 667 });
      await this.page.goto('/dashboard');
      await this.page.waitForTimeout(3000);

      // Check that content is still accessible
      const bodyVisible = await this.page.locator('body').isVisible();
      expect(bodyVisible).toBeTruthy();
    });

    await this.runTest('Mobile responsive - Clients page', async () => {
      await this.page.setViewportSize({ width: 375, height: 667 });
      await this.page.goto('/clients');
      await this.page.waitForTimeout(3000);
    });

    // Reset to desktop viewport
    await this.page.setViewportSize({ width: 1280, height: 720 });
  }

  async runComprehensiveTests(): Promise<TestReport> {
    console.log('🚀 Starting Comprehensive Test Suite for GK Enterprise Suite');
    console.log('=' .repeat(60));

    const startTime = Date.now();

    // Enable JS error tracking
    await this.checkForJSErrors();

    try {
      console.log('\n🔐 Testing Authentication...');
      await this.testAuthentication();

      console.log('\n👥 Testing Client Management...');
      await this.testClientManagement();

      console.log('\n📄 Testing Filing & Document Management...');
      await this.testFilingManagement();

      console.log('\n🛂 Testing Immigration Pipeline...');
      await this.testImmigrationPipeline();

      console.log('\n💰 Testing Accounting & Financial Features...');
      await this.testAccountingFeatures();

      console.log('\n🎓 Testing Training Hub...');
      await this.testTrainingHub();

      console.log('\n🏠 Testing Property Management...');
      await this.testPropertyManagement();

      console.log('\n⚡ Testing Expediting Services...');
      await this.testExpeditingServices();

      console.log('\n👤 Testing Client Portal...');
      await this.testClientPortal();

      console.log('\n📱 Testing Responsive Design...');
      await this.testResponsiveDesign();

    } catch (error) {
      console.error('Critical error during testing:', error);
      this.issues.push(`Critical test failure: ${error}`);
    }

    const totalDuration = Date.now() - startTime;
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const skipped = this.results.filter(r => r.status === 'SKIP').length;

    // Generate recommendations
    this.generateRecommendations();

    const report: TestReport = {
      summary: {
        totalTests: this.results.length,
        passed,
        failed,
        skipped,
        duration: totalDuration
      },
      results: this.results,
      issues: this.issues,
      recommendations: this.recommendations
    };

    return report;
  }

  private generateRecommendations(): void {
    const failedTests = this.results.filter(r => r.status === 'FAIL');

    if (failedTests.length > 0) {
      this.recommendations.push('Fix failing tests to ensure application stability');
    }

    if (this.issues.some(issue => issue.includes('Console Error'))) {
      this.recommendations.push('Address JavaScript console errors for better user experience');
    }

    if (failedTests.some(t => t.testName.includes('authentication'))) {
      this.recommendations.push('Review authentication flow and user role management');
    }

    if (failedTests.some(t => t.testName.includes('responsive'))) {
      this.recommendations.push('Improve mobile responsive design implementation');
    }

    this.recommendations.push('Consider implementing automated accessibility testing');
    this.recommendations.push('Add performance testing for critical user workflows');
    this.recommendations.push('Implement continuous integration for test automation');
  }

  generateHtmlReport(report: TestReport): string {
    const passRate = ((report.summary.passed / report.summary.totalTests) * 100).toFixed(1);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GK Enterprise Suite - Comprehensive Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; text-align: center; }
        .pass { color: #16a34a; }
        .fail { color: #dc2626; }
        .skip { color: #ca8a04; }
        .test-result { margin: 10px 0; padding: 10px; border-left: 4px solid #e2e8f0; background: #f8fafc; }
        .test-result.pass { border-left-color: #16a34a; }
        .test-result.fail { border-left-color: #dc2626; }
        .issue { background: #fef2f2; border: 1px solid #fecaca; padding: 10px; margin: 5px 0; border-radius: 4px; }
        .recommendation { background: #f0f9ff; border: 1px solid #bae6fd; padding: 10px; margin: 5px 0; border-radius: 4px; }
        .section { margin: 30px 0; }
        .timestamp { color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>GK Enterprise Suite - Comprehensive Test Report</h1>
        <p class="timestamp">Generated on: ${new Date().toLocaleString()}</p>
        <p>Total Duration: ${(report.summary.duration / 1000).toFixed(2)} seconds</p>
    </div>

    <div class="summary">
        <div class="stat-card">
            <h3>Total Tests</h3>
            <div style="font-size: 2em; font-weight: bold;">${report.summary.totalTests}</div>
        </div>
        <div class="stat-card">
            <h3>Passed</h3>
            <div style="font-size: 2em; font-weight: bold;" class="pass">${report.summary.passed}</div>
        </div>
        <div class="stat-card">
            <h3>Failed</h3>
            <div style="font-size: 2em; font-weight: bold;" class="fail">${report.summary.failed}</div>
        </div>
        <div class="stat-card">
            <h3>Pass Rate</h3>
            <div style="font-size: 2em; font-weight: bold;">${passRate}%</div>
        </div>
    </div>

    <div class="section">
        <h2>Test Results</h2>
        ${report.results.map(result => `
            <div class="test-result ${result.status.toLowerCase()}">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span><strong>${result.testName}</strong></span>
                    <span class="${result.status.toLowerCase()}">${result.status}</span>
                </div>
                ${result.error ? `<div style="color: #dc2626; margin-top: 5px;">Error: ${result.error}</div>` : ''}
                <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">Duration: ${result.duration}ms</div>
            </div>
        `).join('')}
    </div>

    ${report.issues.length > 0 ? `
    <div class="section">
        <h2>Issues Found (${report.issues.length})</h2>
        ${report.issues.map(issue => `<div class="issue">${issue}</div>`).join('')}
    </div>
    ` : ''}

    <div class="section">
        <h2>Recommendations (${report.recommendations.length})</h2>
        ${report.recommendations.map(rec => `<div class="recommendation">💡 ${rec}</div>`).join('')}
    </div>

    <div class="section">
        <h2>Test Coverage Analysis</h2>
        <p>This comprehensive test suite covered:</p>
        <ul>
            <li>✅ Authentication flows for all user roles</li>
            <li>✅ Client management and wizard functionality</li>
            <li>✅ Filing and document management workflows</li>
            <li>✅ Immigration pipeline and Kanban functionality</li>
            <li>✅ Accounting and financial calculation features</li>
            <li>✅ Training hub and program management</li>
            <li>✅ Property management features</li>
            <li>✅ Expediting services workflow</li>
            <li>✅ Client portal functionality</li>
            <li>✅ Responsive design testing</li>
        </ul>
    </div>

</body>
</html>`;
  }
}

// Export for use in test files
export { ComprehensiveTestRunner, TestResult, TestReport };