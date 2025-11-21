import { test, expect } from '@playwright/test';
import { ManualTestRunner } from '../manual-verification-results';
import * as fs from 'fs';
import * as path from 'path';

test.describe('GK Enterprise Suite - Manual Comprehensive Testing', () => {
  test('Execute comprehensive manual test suite', async ({ page }) => {
    test.setTimeout(300000); // 5 minutes

    console.log('🔧 Starting Manual Comprehensive Testing of GK Enterprise Suite');
    console.log('Testing against: http://localhost:3000');

    const testRunner = new ManualTestRunner(page);

    // Run all manual tests
    const results = await testRunner.runAllTests();

    // Generate report
    const report = testRunner.generateReport();

    // Save report to file
    const reportPath = path.join(process.cwd(), 'test-results', `manual-test-report-${Date.now()}.md`);

    // Ensure directory exists
    const reportDir = path.dirname(reportPath);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    fs.writeFileSync(reportPath, report);

    // Also save as JSON for programmatic access
    const jsonReportPath = path.join(process.cwd(), 'test-results', `manual-test-results-${Date.now()}.json`);
    fs.writeFileSync(jsonReportPath, JSON.stringify(results, null, 2));

    // Print summary
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    const warnings = results.filter(r => r.status === 'WARNING').length;
    const total = results.length;

    console.log('\n' + '='.repeat(80));
    console.log('📊 MANUAL TEST REPORT SUMMARY');
    console.log('='.repeat(80));
    console.log(`📋 Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️ Warnings: ${warnings}`);
    console.log(`📈 Pass Rate: ${((passed / total) * 100).toFixed(1)}%`);
    console.log(`📄 Report: ${reportPath}`);
    console.log(`📊 JSON Data: ${jsonReportPath}`);
    console.log('='.repeat(80));

    // Print key findings
    if (failed > 0) {
      console.log('\n❌ CRITICAL ISSUES:');
      results
        .filter(r => r.status === 'FAIL')
        .slice(0, 5) // Show top 5 failures
        .forEach(result => {
          console.log(`   • ${result.category}: ${result.testName} - ${result.error}`);
        });
    }

    if (warnings > 0) {
      console.log('\n⚠️ WARNINGS:');
      results
        .filter(r => r.status === 'WARNING')
        .slice(0, 3) // Show top 3 warnings
        .forEach(result => {
          console.log(`   • ${result.category}: ${result.testName} - ${result.error || 'Warning condition'}`);
        });
    }

    // Success criteria
    expect(total).toBeGreaterThan(20); // Ensure comprehensive testing
    expect(passed).toBeGreaterThan(failed); // More passes than failures

    console.log('\n🎯 Manual comprehensive testing completed successfully!');
  });
});