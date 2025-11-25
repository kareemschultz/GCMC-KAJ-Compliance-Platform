import { Page } from '@playwright/test';

export interface ManualTestResult {
  category: string;
  testName: string;
  status: 'PASS' | 'FAIL' | 'SKIP' | 'WARNING';
  description: string;
  error?: string;
  recommendations?: string[];
}

export class ManualTestRunner {
  private page: Page;
  private results: ManualTestResult[] = [];

  constructor(page: Page) {
    this.page = page;
  }

  async addResult(result: ManualTestResult) {
    this.results.push(result);
    console.log(`${result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : result.status === 'WARNING' ? '⚠️' : '⏭️'} ${result.category}: ${result.testName}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  }

  async testAuthentication(): Promise<void> {
    console.log('\n🔐 Testing Authentication...');

    // Test 1: Admin Login
    try {
      await this.page.goto('/login');
      await this.page.fill('input[type="email"]', 'admin@gcmc.gy');
      await this.page.fill('input[type="password"]', process.env.SEED_ADMIN_PASSWORD || 'admin123');
      await this.page.fill('input[type="password"]', process.env.SEED_GCMC_PASSWORD || 'gcmc123');
      await this.page.fill('input[type="password"]', process.env.SEED_KAJ_PASSWORD || 'kaj123');
      await this.page.fill('input[type="password"]', process.env.SEED_CLIENT_PASSWORD || 'client123');
      await this.page.fill('input[type="password"]', 'wrongpassword');
      await this.page.fill('input[type="password"]', process.env.SEED_ADMIN_PASSWORD || 'admin123');
      await this.page.fill('input[type="password"]', process.env.SEED_ADMIN_PASSWORD || 'admin123');
      await this.page.fill('input[type="password"]', process.env.SEED_CLIENT_PASSWORD || 'client123');
      await this.page.click('button[type="submit"]');
      await this.page.waitForTimeout(3000);

      const url = this.page.url();
      if (url.includes('/login')) {
        await this.addResult({
          category: 'Authentication',
          testName: 'Admin Login',
          status: 'FAIL',
          description: 'Admin login should redirect to dashboard',
          error: 'Still on login page after attempting login'
        });
      } else {
        await this.addResult({
          category: 'Authentication',
          testName: 'Admin Login',
          status: 'PASS',
          description: 'Admin successfully logs in and redirects'
        });
      }
    } catch (error) {
      await this.addResult({
        category: 'Authentication',
        testName: 'Admin Login',
        status: 'FAIL',
        description: 'Admin login functionality',
        error: String(error)
      });
    }

    // Test 2: GCMC Staff Login
    try {
      await this.page.goto('/login');
      await this.page.fill('input[type="email"]', 'gcmc@gcmc.gy');
      await this.page.fill('input[type="password"]', 'gcmc123');
      await this.page.click('button[type="submit"]');
      await this.page.waitForTimeout(3000);

      const url = this.page.url();
      await this.addResult({
        category: 'Authentication',
        testName: 'GCMC Staff Login',
        status: url.includes('/login') ? 'FAIL' : 'PASS',
        description: 'GCMC staff login functionality',
        error: url.includes('/login') ? 'Still on login page' : undefined
      });
    } catch (error) {
      await this.addResult({
        category: 'Authentication',
        testName: 'GCMC Staff Login',
        status: 'FAIL',
        description: 'GCMC staff login functionality',
        error: String(error)
      });
    }

    // Test 3: KAJ Staff Login
    try {
      await this.page.goto('/login');
      await this.page.fill('input[type="email"]', 'kaj@gcmc.gy');
      await this.page.fill('input[type="password"]', 'kaj123');
      await this.page.click('button[type="submit"]');
      await this.page.waitForTimeout(3000);

      const url = this.page.url();
      await this.addResult({
        category: 'Authentication',
        testName: 'KAJ Staff Login',
        status: url.includes('/login') ? 'FAIL' : 'PASS',
        description: 'KAJ staff login functionality',
        error: url.includes('/login') ? 'Still on login page' : undefined
      });
    } catch (error) {
      await this.addResult({
        category: 'Authentication',
        testName: 'KAJ Staff Login',
        status: 'FAIL',
        description: 'KAJ staff login functionality',
        error: String(error)
      });
    }

    // Test 4: Client Login (should redirect to portal)
    try {
      await this.page.goto('/login');
      await this.page.fill('input[type="email"]', 'client@abccorp.gy');
      await this.page.fill('input[type="password"]', 'client123');
      await this.page.click('button[type="submit"]');
      await this.page.waitForTimeout(3000);

      const url = this.page.url();
      if (url.includes('/portal')) {
        await this.addResult({
          category: 'Authentication',
          testName: 'Client Portal Redirect',
          status: 'PASS',
          description: 'Client successfully redirects to portal'
        });
      } else {
        await this.addResult({
          category: 'Authentication',
          testName: 'Client Portal Redirect',
          status: 'FAIL',
          description: 'Client should redirect to portal after login',
          error: `Redirected to ${url} instead of portal`
        });
      }
    } catch (error) {
      await this.addResult({
        category: 'Authentication',
        testName: 'Client Portal Redirect',
        status: 'FAIL',
        description: 'Client portal redirect functionality',
        error: String(error)
      });
    }

    // Test 5: Invalid Credentials
    try {
      await this.page.goto('/login');
      await this.page.fill('input[type="email"]', 'invalid@test.com');
      await this.page.fill('input[type="password"]', 'wrongpassword');
      await this.page.click('button[type="submit"]');
      await this.page.waitForTimeout(2000);

      const errorVisible = await this.page.locator('text=Invalid, text=Error, .error, [role="alert"]').count() > 0;
      const stillOnLogin = this.page.url().includes('/login');

      if (errorVisible || stillOnLogin) {
        await this.addResult({
          category: 'Authentication',
          testName: 'Invalid Credentials Rejection',
          status: 'PASS',
          description: 'Invalid credentials are properly rejected'
        });
      } else {
        await this.addResult({
          category: 'Authentication',
          testName: 'Invalid Credentials Rejection',
          status: 'FAIL',
          description: 'Invalid credentials should be rejected',
          error: 'No error shown and user was not kept on login page'
        });
      }
    } catch (error) {
      await this.addResult({
        category: 'Authentication',
        testName: 'Invalid Credentials Rejection',
        status: 'FAIL',
        description: 'Invalid credentials rejection',
        error: String(error)
      });
    }
  }

  async testNavigation(): Promise<void> {
    console.log('\n🧭 Testing Navigation...');

    // Ensure we're logged in as admin
    await this.page.goto('/login');
    await this.page.fill('input[type="email"]', 'admin@gcmc.gy');
    await this.page.fill('input[type="password"]', 'admin123');
    await this.page.click('button[type="submit"]');
    await this.page.waitForTimeout(3000);

    const pages = [
      { path: '/', name: 'Dashboard' },
      { path: '/clients', name: 'Clients' },
      { path: '/filings', name: 'Filings' },
      { path: '/immigration', name: 'Immigration' },
      { path: '/vat', name: 'VAT' },
      { path: '/paye', name: 'PAYE' },
      { path: '/nis', name: 'NIS' },
      { path: '/calculator/nis', name: 'NIS Calculator' },
      { path: '/calculator/paye', name: 'PAYE Calculator' },
      { path: '/training', name: 'Training Hub' },
      { path: '/properties', name: 'Properties' },
      { path: '/expediting', name: 'Expediting' }
    ];

    for (const pageInfo of pages) {
      try {
        await this.page.goto(pageInfo.path);
        await this.page.waitForTimeout(2000);

        const currentUrl = this.page.url();
        if (currentUrl.includes('/login')) {
          await this.addResult({
            category: 'Navigation',
            testName: `${pageInfo.name} Page Access`,
            status: 'FAIL',
            description: `Access to ${pageInfo.name} page`,
            error: 'Redirected to login page - possible authentication issue'
          });
        } else if (currentUrl.includes(pageInfo.path) || pageInfo.path === '/') {
          await this.addResult({
            category: 'Navigation',
            testName: `${pageInfo.name} Page Access`,
            status: 'PASS',
            description: `${pageInfo.name} page loads successfully`
          });
        } else {
          await this.addResult({
            category: 'Navigation',
            testName: `${pageInfo.name} Page Access`,
            status: 'WARNING',
            description: `${pageInfo.name} page redirects`,
            error: `Expected ${pageInfo.path} but got ${currentUrl}`
          });
        }
      } catch (error) {
        await this.addResult({
          category: 'Navigation',
          testName: `${pageInfo.name} Page Access`,
          status: 'FAIL',
          description: `Access to ${pageInfo.name} page`,
          error: String(error)
        });
      }
    }
  }

  async testClientManagement(): Promise<void> {
    console.log('\n👥 Testing Client Management...');

    // Ensure we're logged in
    await this.page.goto('/login');
    await this.page.fill('input[type="email"]', 'admin@gcmc.gy');
    await this.page.fill('input[type="password"]', 'admin123');
    await this.page.click('button[type="submit"]');
    await this.page.waitForTimeout(3000);

    // Test client list page
    try {
      await this.page.goto('/clients');
      await this.page.waitForTimeout(2000);

      const hasClientElements = await this.page.locator('table, .client, [data-testid*="client"]').count() > 0;
      await this.addResult({
        category: 'Client Management',
        testName: 'Client List View',
        status: hasClientElements ? 'PASS' : 'WARNING',
        description: 'Client list page displays properly',
        error: hasClientElements ? undefined : 'No client-related elements found'
      });
    } catch (error) {
      await this.addResult({
        category: 'Client Management',
        testName: 'Client List View',
        status: 'FAIL',
        description: 'Client list page functionality',
        error: String(error)
      });
    }

    // Test client creation wizard
    try {
      await this.page.goto('/clients/new');
      await this.page.waitForTimeout(2000);

      const hasFormElements = await this.page.locator('form, input, select, button').count() > 0;
      await this.addResult({
        category: 'Client Management',
        testName: 'Client Creation Wizard',
        status: hasFormElements ? 'PASS' : 'FAIL',
        description: 'Client creation wizard loads',
        error: hasFormElements ? undefined : 'No form elements found'
      });
    } catch (error) {
      await this.addResult({
        category: 'Client Management',
        testName: 'Client Creation Wizard',
        status: 'FAIL',
        description: 'Client creation wizard',
        error: String(error)
      });
    }
  }

  async testCalculators(): Promise<void> {
    console.log('\n🧮 Testing Calculators...');

    // Test NIS Calculator
    try {
      await this.page.goto('/calculator/nis');
      await this.page.waitForTimeout(2000);

      const hasCalculatorElements = await this.page.locator('input, button, form').count() > 0;
      await this.addResult({
        category: 'Calculators',
        testName: 'NIS Calculator',
        status: hasCalculatorElements ? 'PASS' : 'FAIL',
        description: 'NIS calculator loads and displays input fields',
        error: hasCalculatorElements ? undefined : 'No calculator elements found'
      });

      // Test calculation functionality if elements exist
      if (hasCalculatorElements) {
        const salaryInput = await this.page.locator('input[name*="salary"], input[placeholder*="salary"], input[type="number"]').first();
        if (await salaryInput.count() > 0) {
          await salaryInput.fill('50000');
          const calculateButton = await this.page.locator('button:has-text("Calculate"), button[type="submit"]').first();
          if (await calculateButton.count() > 0) {
            await calculateButton.click();
            await this.page.waitForTimeout(2000);

            const hasResults = await this.page.locator('.result, [data-testid*="result"], .calculation').count() > 0;
            await this.addResult({
              category: 'Calculators',
              testName: 'NIS Calculator Functionality',
              status: hasResults ? 'PASS' : 'WARNING',
              description: 'NIS calculator performs calculations',
              error: hasResults ? undefined : 'No calculation results displayed'
            });
          }
        }
      }
    } catch (error) {
      await this.addResult({
        category: 'Calculators',
        testName: 'NIS Calculator',
        status: 'FAIL',
        description: 'NIS calculator functionality',
        error: String(error)
      });
    }

    // Test PAYE Calculator
    try {
      await this.page.goto('/calculator/paye');
      await this.page.waitForTimeout(2000);

      const hasCalculatorElements = await this.page.locator('input, button, form').count() > 0;
      await this.addResult({
        category: 'Calculators',
        testName: 'PAYE Calculator',
        status: hasCalculatorElements ? 'PASS' : 'FAIL',
        description: 'PAYE calculator loads and displays input fields',
        error: hasCalculatorElements ? undefined : 'No calculator elements found'
      });
    } catch (error) {
      await this.addResult({
        category: 'Calculators',
        testName: 'PAYE Calculator',
        status: 'FAIL',
        description: 'PAYE calculator functionality',
        error: String(error)
      });
    }
  }

  async testFilingManagement(): Promise<void> {
    console.log('\n📄 Testing Filing Management...');

    const filingPages = [
      { path: '/filings', name: 'Filing Dashboard' },
      { path: '/vat', name: 'VAT Filing' },
      { path: '/paye', name: 'PAYE Filing' },
      { path: '/nis', name: 'NIS Filing' }
    ];

    for (const filing of filingPages) {
      try {
        await this.page.goto(filing.path);
        await this.page.waitForTimeout(2000);

        const pageLoaded = !this.page.url().includes('/login');
        const hasContent = await this.page.locator('body').textContent();

        await this.addResult({
          category: 'Filing Management',
          testName: filing.name,
          status: pageLoaded && hasContent ? 'PASS' : 'FAIL',
          description: `${filing.name} page loads successfully`,
          error: pageLoaded ? undefined : 'Page redirects to login or fails to load'
        });
      } catch (error) {
        await this.addResult({
          category: 'Filing Management',
          testName: filing.name,
          status: 'FAIL',
          description: `${filing.name} page`,
          error: String(error)
        });
      }
    }
  }

  async testSpecializedModules(): Promise<void> {
    console.log('\n🚀 Testing Specialized Modules...');

    const modules = [
      { path: '/immigration', name: 'Immigration Pipeline' },
      { path: '/training', name: 'Training Hub' },
      { path: '/properties', name: 'Property Management' },
      { path: '/expediting', name: 'Expediting Services' }
    ];

    for (const module of modules) {
      try {
        await this.page.goto(module.path);
        await this.page.waitForTimeout(3000);

        const pageLoaded = !this.page.url().includes('/login');
        await this.addResult({
          category: 'Specialized Modules',
          testName: module.name,
          status: pageLoaded ? 'PASS' : 'FAIL',
          description: `${module.name} module loads successfully`,
          error: pageLoaded ? undefined : 'Page redirects to login or fails to load'
        });

        // Test specific functionality for immigration (Kanban)
        if (module.path === '/immigration' && pageLoaded) {
          const hasKanban = await this.page.locator('.kanban, .board, .column, [data-testid*="kanban"]').count() > 0;
          await this.addResult({
            category: 'Specialized Modules',
            testName: 'Immigration Kanban Board',
            status: hasKanban ? 'PASS' : 'WARNING',
            description: 'Immigration Kanban board displays',
            error: hasKanban ? undefined : 'No Kanban board elements detected'
          });
        }

      } catch (error) {
        await this.addResult({
          category: 'Specialized Modules',
          testName: module.name,
          status: 'FAIL',
          description: `${module.name} module`,
          error: String(error)
        });
      }
    }
  }

  async testClientPortal(): Promise<void> {
    console.log('\n👤 Testing Client Portal...');

    // Login as client
    try {
      await this.page.goto('/login');
      await this.page.fill('input[type="email"]', 'client@abccorp.gy');
      await this.page.fill('input[type="password"]', 'client123');
      await this.page.click('button[type="submit"]');
      await this.page.waitForTimeout(3000);

      const url = this.page.url();
      if (url.includes('/portal')) {
        await this.addResult({
          category: 'Client Portal',
          testName: 'Portal Access',
          status: 'PASS',
          description: 'Client can access portal successfully'
        });

        // Test portal sections
        const portalPages = ['/portal', '/portal/documents', '/portal/appointments', '/portal/requests'];

        for (const portalPage of portalPages) {
          try {
            await this.page.goto(portalPage);
            await this.page.waitForTimeout(2000);

            const accessible = !this.page.url().includes('/login');
            await this.addResult({
              category: 'Client Portal',
              testName: `Portal ${portalPage.split('/').pop()} Section`,
              status: accessible ? 'PASS' : 'FAIL',
              description: `Portal ${portalPage.split('/').pop()} section is accessible`,
              error: accessible ? undefined : 'Section not accessible'
            });
          } catch (error) {
            await this.addResult({
              category: 'Client Portal',
              testName: `Portal ${portalPage.split('/').pop()} Section`,
              status: 'FAIL',
              description: `Portal ${portalPage.split('/').pop()} section`,
              error: String(error)
            });
          }
        }

      } else {
        await this.addResult({
          category: 'Client Portal',
          testName: 'Portal Access',
          status: 'FAIL',
          description: 'Client portal access',
          error: 'Client login does not redirect to portal'
        });
      }
    } catch (error) {
      await this.addResult({
        category: 'Client Portal',
        testName: 'Portal Access',
        status: 'FAIL',
        description: 'Client portal access',
        error: String(error)
      });
    }
  }

  async testResponsiveDesign(): Promise<void> {
    console.log('\n📱 Testing Responsive Design...');

    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop Large' },
      { width: 1280, height: 720, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ];

    for (const viewport of viewports) {
      try {
        await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
        await this.page.goto('/dashboard');
        await this.page.waitForTimeout(2000);

        const contentVisible = await this.page.locator('body').isVisible();
        const hasScroll = await this.page.evaluate(() => document.body.scrollWidth > window.innerWidth);

        await this.addResult({
          category: 'Responsive Design',
          testName: `${viewport.name} (${viewport.width}x${viewport.height})`,
          status: contentVisible ? (hasScroll ? 'WARNING' : 'PASS') : 'FAIL',
          description: `Dashboard displays correctly on ${viewport.name}`,
          error: !contentVisible ? 'Content not visible' : hasScroll ? 'Horizontal scroll present' : undefined
        });
      } catch (error) {
        await this.addResult({
          category: 'Responsive Design',
          testName: `${viewport.name}`,
          status: 'FAIL',
          description: `Responsive design test for ${viewport.name}`,
          error: String(error)
        });
      }
    }

    // Reset to desktop viewport
    await this.page.setViewportSize({ width: 1280, height: 720 });
  }

  async runAllTests(): Promise<ManualTestResult[]> {
    console.log('🚀 Starting Comprehensive Manual Testing');
    console.log('=' .repeat(60));

    try {
      await this.testAuthentication();
      await this.testNavigation();
      await this.testClientManagement();
      await this.testCalculators();
      await this.testFilingManagement();
      await this.testSpecializedModules();
      await this.testClientPortal();
      await this.testResponsiveDesign();
    } catch (error) {
      console.error('Error during testing:', error);
    }

    return this.results;
  }

  generateReport(): string {
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const warnings = this.results.filter(r => r.status === 'WARNING').length;
    const total = this.results.length;
    const passRate = ((passed / total) * 100).toFixed(1);

    const categories = [...new Set(this.results.map(r => r.category))];

    let report = `
# GK Enterprise Suite - Comprehensive End-to-End Test Report

**Generated:** ${new Date().toLocaleString()}

## Summary
- **Total Tests:** ${total}
- **Passed:** ${passed} ✅
- **Failed:** ${failed} ❌
- **Warnings:** ${warnings} ⚠️
- **Pass Rate:** ${passRate}%

## Test Results by Category

`;

    categories.forEach(category => {
      const categoryResults = this.results.filter(r => r.category === category);
      const categoryPassed = categoryResults.filter(r => r.status === 'PASS').length;
      const categoryFailed = categoryResults.filter(r => r.status === 'FAIL').length;
      const categoryWarnings = categoryResults.filter(r => r.status === 'WARNING').length;

      report += `### ${category}\n`;
      report += `**Status:** ${categoryPassed}/${categoryResults.length} passed`;
      if (categoryFailed > 0) report += `, ${categoryFailed} failed`;
      if (categoryWarnings > 0) report += `, ${categoryWarnings} warnings`;
      report += `\n\n`;

      categoryResults.forEach(result => {
        const statusIcon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : result.status === 'WARNING' ? '⚠️' : '⏭️';
        report += `- ${statusIcon} **${result.testName}:** ${result.description}\n`;
        if (result.error) {
          report += `  *Error:* ${result.error}\n`;
        }
        if (result.recommendations) {
          report += `  *Recommendations:* ${result.recommendations.join(', ')}\n`;
        }
        report += `\n`;
      });
    });

    // Add issues and recommendations
    const issues = this.results.filter(r => r.status === 'FAIL').map(r => `${r.category} - ${r.testName}: ${r.error}`);
    const warningsList = this.results.filter(r => r.status === 'WARNING').map(r => `${r.category} - ${r.testName}: ${r.error || 'Warning condition detected'}`);

    if (issues.length > 0) {
      report += `## Issues Found\n\n`;
      issues.forEach((issue, index) => {
        report += `${index + 1}. ${issue}\n`;
      });
      report += `\n`;
    }

    if (warningsList.length > 0) {
      report += `## Warnings\n\n`;
      warningsList.forEach((warning, index) => {
        report += `${index + 1}. ${warning}\n`;
      });
      report += `\n`;
    }

    report += `## Recommendations\n\n`;

    if (failed > 0) {
      report += `1. **Priority:** Fix failing tests to ensure application stability\n`;
    }

    if (warnings > 0) {
      report += `2. **Improvement:** Address warning conditions for better user experience\n`;
    }

    report += `3. **Enhancement:** Consider implementing automated accessibility testing\n`;
    report += `4. **Performance:** Add performance testing for critical user workflows\n`;
    report += `5. **CI/CD:** Implement continuous integration for test automation\n`;
    report += `6. **Monitoring:** Add error tracking and monitoring for production\n`;

    return report;
  }
}