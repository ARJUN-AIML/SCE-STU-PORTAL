import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  // App redirects to login if unauthenticated
  await expect(page).toHaveTitle(/SCE Student Portal|Login/i);
});

test('login page renders correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Login to SCE Student Portal')).toBeVisible();
  await expect(page.getByPlaceholder('student@saranathan.ac.in')).toBeVisible();
});
