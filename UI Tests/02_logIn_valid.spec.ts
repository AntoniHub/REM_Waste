import { test, expect } from '@playwright/test';

test('successful login - redirects to dashboard and displays header', async ({ page }) => {
  await page.goto('https://antonio-rodriguez-farias.netlify.app/');

  // Fill in fields with valid credentials
  // ** It should be done through environment variables
  await page.getByPlaceholder('Username').fill('antonioQA');
  await page.getByPlaceholder('Password').fill('securePass123');

  // Click the Access button
  await page.getByRole('button', { name: 'Access' }).click();

  // Wait for the URL to change to the dashboard
  await expect(page).toHaveURL('https://antonio-rodriguez-farias.netlify.app/dashboard');

  // Verify that the expected header is displayed on the dashboard
  const header = page.locator('h1.text-4xl.font-bold.text-white');
  await expect(header).toHaveText('QA Hub | Antonio Rodriguez Farias');
});
