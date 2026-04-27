import { test, expect } from '@playwright/test';

// Utility to generate random NIC
const generateNIC = () => Math.floor(Math.random() * 1000000000) + 'V';

test.describe('Customer Management Frontend E2E', () => {

  test('1. Dashboard renders structure correctly', async ({ page }) => {
    await page.goto('/');
    // Check Sidebar
    await expect(page.locator('.sidebar')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Customer Management' })).toBeVisible();

    // Check main title
    await expect(page.getByRole('heading', { name: 'Customers' })).toBeVisible();
  });

  test('2. Bulk Upload Modal toggles correctly', async ({ page }) => {
    await page.goto('/');
    
    // Open Modal
    const bulkBtn = page.getByRole('button', { name: /bulk upload/i });
    await bulkBtn.click();
    
    // Check modal exists
    const modalHeading = page.getByRole('heading', { name: 'Bulk Upload Customers' });
    await expect(modalHeading).toBeVisible();

    // Cancel modal
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(modalHeading).toBeHidden();
  });

  test('3. Edge Case: Empty Form Validation', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Add Customer' }).click();

    await expect(page.getByRole('heading', { name: 'Create New Customer' })).toBeVisible();

    // Click save without filling inputs
    await page.getByRole('button', { name: 'Create Customer' }).click();

    // The browser natively blocks submission of empty 'required' fields
    // Playwright captures this via pseudo-classes, but we can just check we didn't navigate away
    await expect(page.url()).toContain('/create');
  });

  test('4. Edge Case: Dynamic Fields Add/Remove', async ({ page }) => {
    await page.goto('/create');

    // Mobiles
    const addMobileBtn = page.getByRole('button', { name: 'Add Mobile' });
    await addMobileBtn.click();
    // We start with 1 mobile field, adding one makes 2
    let mobileInputs = page.getByPlaceholder('+94...');
    await expect(mobileInputs).toHaveCount(2);

    // Delete one
    await page.locator('.btn-danger').first().click();
    mobileInputs = page.getByPlaceholder('+94...');
    await expect(mobileInputs).toHaveCount(1);

    // Addresses
    const addAddressBtn = page.getByRole('button', { name: 'Add Address' });
    await addAddressBtn.click();
    // Start with 0 addresses, should now be 1
    const addressLabels = page.getByText('Address Line 1 *');
    await expect(addressLabels).toHaveCount(1);

    // Click delete on address block
    await page.locator('.btn-danger').last().click();
    await expect(addressLabels).toHaveCount(0);
  });

  test('5. Core Flow: Create Customer -> Verify Table -> View Profile', async ({ page }) => {
    const uniqueNic = generateNIC();
    const testName = 'Playwright Test User';

    await page.goto('/create');

    // Fill Basic Details
    await page.locator('input[name="name"]').fill(testName);
    await page.locator('input[name="nicNumber"]').fill(uniqueNic);
    await page.locator('input[name="dateOfBirth"]').fill('1990-01-01');

    // Add 1 Mobile
    await page.getByPlaceholder('+94...').fill('+94770001111');

    // Add 1 Address
    await page.getByRole('button', { name: 'Add Address' }).click();
    
    // Use layout-agnostic locator via its logical container grouping
    const addressInput = page.locator('.form-group').filter({ hasText: 'Address Line 1 *' }).locator('input');
    await addressInput.fill('123 AI Lane');
    
    // Select dropdowns
    // Since we don't have direct names on the selects, we grab them by filtering labels
    const countrySelect = page.locator('select').first();
    await countrySelect.selectOption({ label: 'Sri Lanka' });
    
    const citySelect = page.locator('select').nth(1);
    await citySelect.selectOption({ label: 'Colombo' });

    // Submit Form
    await page.getByRole('button', { name: 'Create Customer' }).click();

    // Ensure successful toast shows up generically without using hashed class
    // await expect(page.getByText('successfully', { exact: false }).first()).toBeVisible({ timeout: 5000 });
    
    // A better approach is to just check that we navigated back to dashboard
    await expect(page).toHaveURL('http://localhost:3000/');

    // Utilize table search to find the new user securely via NIC
    await page.getByPlaceholder('Search by name or NIC...').fill(uniqueNic);

    // Wait a brief moment for debounce
    await page.waitForTimeout(500);

    // Verify row exists
    const row = page.getByRole('row').filter({ hasText: uniqueNic });
    await expect(row).toBeVisible();

    // Click View Action (Eye Icon) on that specific row
    const viewBtn = row.locator('a[title="View"]');
    await viewBtn.click();

    // Assert we're on the view page with the payload correctly mapped
    await expect(page.getByRole('heading', { name: testName })).toBeVisible();
    await expect(page.getByText(uniqueNic)).toBeVisible();
    await expect(page.getByText('+94770001111')).toBeVisible();
    await expect(page.getByText('123 AI Lane')).toBeVisible();
    await expect(page.getByText('Colombo, Sri Lanka')).toBeVisible();
  });
});
