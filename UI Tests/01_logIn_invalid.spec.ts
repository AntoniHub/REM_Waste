import { test, expect } from '@playwright/test';

test('failed login - displays error message', async ({ page }) => {
  await page.goto('https://antonio-rodriguez-farias.netlify.app/');

  // Fill in fields with incorrect credentials
  await page.getByPlaceholder('Username').fill('user_incorrect');
  await page.getByPlaceholder('Password').fill('wrong_password');

  // Click on the Access button
  await page.getByRole('button', { name: 'Access' }).click();

  // Verify that the specific error message is displayed
  const errorMessage = page.locator('p.text-danger.mt-2');
  await expect(errorMessage).toHaveText('Invalid credentials');

  // Check that we are still on the same page (no redirection)
  await expect(page).toHaveURL('https://antonio-rodriguez-farias.netlify.app/');
});

