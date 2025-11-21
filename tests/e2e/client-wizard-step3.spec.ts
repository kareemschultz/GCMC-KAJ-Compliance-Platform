import { test, expect } from '../fixtures/auth.fixture';

test.describe('Client Onboarding Wizard - Step 3 Validation Tests', () => {

  test.beforeEach(async ({ adminPage }) => {
    // Go directly to the clients page with admin authentication
    await adminPage.goto('/clients');
    await adminPage.waitForLoadState('networkidle');
  });

  test('should investigate Step 3 validation issue with National ID Card', async ({ adminPage }) => {
    const page = adminPage;
    console.log('Starting client wizard Step 3 investigation...');

    // Click "Add New Client" button (found in the screenshot)
    await page.click('button:has-text("Add New Client")');

    // Wait for wizard dialog to open
    await expect(page.locator('text=New Client Onboarding')).toBeVisible({ timeout: 10000 });

    // Take screenshot of the initial wizard
    await page.screenshot({ path: './test-results/wizard-initial.png' });

    // Step 1: Client Type and Basic Info
    console.log('Step 1: Setting up Individual client...');

    // Since we see a SearchableSelect component, let's try to find the client type dropdown
    const clientTypeDropdown = page.locator('button:has-text("Select client type")');
    if (await clientTypeDropdown.isVisible()) {
      await clientTypeDropdown.click();
      await page.locator('text=Individual').click();
    } else {
      // Alternative approach - look for any dropdown with client type
      const dropdown = page.locator('[role="combobox"]').first();
      await dropdown.click();
      await page.locator('text=Individual').click();
    }

    // Fill individual name fields
    await page.fill('#firstName', 'John');
    await page.fill('#surname', 'Doe');

    await page.screenshot({ path: './test-results/wizard-step1-filled.png' });

    // Click Next to Step 2
    await page.click('button:has-text("Next")');
    await expect(page.locator('text=Step 2 of 5')).toBeVisible();

    // Step 2: Contact Details
    console.log('Step 2: Filling contact details...');

    await page.fill('#email', 'john.doe@test.com');
    await page.fill('#phone', '592-123-4567');

    await page.screenshot({ path: './test-results/wizard-step2-filled.png' });

    // Click Next to Step 3
    await page.click('button:has-text("Next")');
    await expect(page.locator('text=Step 3 of 5')).toBeVisible();

    // Step 3: The problematic step
    console.log('Step 3: Testing identification fields...');

    await page.screenshot({ path: './test-results/wizard-step3-initial.png' });

    // Select "National ID Card" as Primary ID Type
    // This might be a SearchableSelect, so let's find the right selector
    const primaryIdDropdown = page.locator('label:has-text("Primary ID Type") + *').locator('button, [role="combobox"]').first();
    if (await primaryIdDropdown.isVisible()) {
      await primaryIdDropdown.click();
      await page.locator('text=National ID Card').click();
    }

    // Fill Primary ID Number with the requested value
    await page.fill('#primaryIdNumber', '144123456');

    // Since this is for an Individual, we need to fill Date of Birth from Step 1
    // Let's check if there's a DOB field visible
    const dobField = page.locator('#dob');
    if (await dobField.isVisible()) {
      await dobField.fill('1990-05-15');
    }

    // Ensure TIN and NIS are empty as requested
    const tinField = page.locator('#tin');
    const nisField = page.locator('#nis');

    if (await tinField.isVisible()) {
      await tinField.clear();
    }
    if (await nisField.isVisible()) {
      await nisField.clear();
    }

    await page.screenshot({ path: './test-results/wizard-step3-filled.png' });

    // Now let's debug the validation by examining all form values
    const formState = await page.evaluate(() => {
      const data: any = {};

      // Get all input values
      document.querySelectorAll('input').forEach((input: HTMLInputElement) => {
        if (input.id || input.name) {
          data[input.id || input.name] = {
            value: input.value,
            type: input.type,
            required: input.required
          };
        }
      });

      // Get select values
      document.querySelectorAll('select').forEach((select: HTMLSelectElement) => {
        if (select.id || select.name) {
          data[select.id || select.name] = {
            value: select.value,
            options: Array.from(select.options).map(opt => opt.value)
          };
        }
      });

      return data;
    });

    console.log('Current form state:', JSON.stringify(formState, null, 2));

    // Check Next button state
    const nextButton = page.locator('button:has-text("Next")');
    const buttonState = await nextButton.evaluate((btn: HTMLButtonElement) => ({
      disabled: btn.disabled,
      className: btn.className,
      textContent: btn.textContent
    }));

    console.log('Next button state:', buttonState);

    // Try clicking Next
    console.log('Attempting to click Next...');

    // Set up console listener for any validation errors
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warn') {
        console.log('Browser console:', msg.text());
      }
    });

    try {
      await nextButton.click();

      // Wait a moment for any validation to run
      await page.waitForTimeout(2000);

      // Check if we moved to Step 4 or are still on Step 3
      const step3Still = await page.locator('text=Step 3 of 5').isVisible();
      const step4Reached = await page.locator('text=Step 4 of 5').isVisible();

      if (step4Reached) {
        console.log('✅ SUCCESS: Advanced to Step 4');
        await page.screenshot({ path: './test-results/wizard-step4-success.png' });
      } else if (step3Still) {
        console.log('❌ ISSUE: Still stuck on Step 3');
        await page.screenshot({ path: './test-results/wizard-step3-stuck.png' });

        // Look for any toast messages or validation errors
        const toastMessages = await page.locator('.toast, [role="alert"], .error').allTextContents();
        if (toastMessages.length > 0) {
          console.log('Validation messages:', toastMessages);
        }

        // Debug the validation function by checking the code's logic
        const validationResult = await page.evaluate(() => {
          // Simulate the validation logic from the code
          const formData = {
            type: 'INDIVIDUAL',
            primaryIdType: 'National ID Card',  // or 'National ID' - check dropdown value
            primaryIdNumber: '144123456',
            dateOfBirth: '1990-05-15',
            tin: '',
            nis: ''
          };

          // This is the validation logic from the component (line 76-83)
          const hasPrimaryId = formData.primaryIdType && formData.primaryIdNumber.length > 3;
          const hasDateOfBirth = formData.dateOfBirth.length > 0;
          const hasOptionalGovId = formData.tin.length > 3 || formData.nis.length > 3;

          // According to the code: Primary ID + DOB is sufficient
          const shouldBeValid = hasPrimaryId && hasDateOfBirth;

          return {
            formData,
            validation: {
              hasPrimaryId,
              hasDateOfBirth,
              hasOptionalGovId,
              shouldBeValid
            }
          };
        });

        console.log('Validation analysis:', JSON.stringify(validationResult, null, 2));

        // If validation should pass but doesn't, there might be a UI issue
        if (validationResult.validation.shouldBeValid) {
          console.log('🚨 POTENTIAL BUG: Validation should pass according to code logic');
        }
      }

    } catch (error) {
      console.log('Error clicking Next:', error);
      await page.screenshot({ path: './test-results/wizard-step3-error.png' });
    }

    // Take a final screenshot
    await page.screenshot({ path: './test-results/wizard-final-state.png' });
  });

});