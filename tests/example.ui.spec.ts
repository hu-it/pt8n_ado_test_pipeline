// tests/example.ui.spec.ts
import { test, expect } from '@playwright/test';

// Test suite for UI tests
test.describe('UI Tests @ui', () => {
  // Test case: Verify page title
  test('should have the correct page title', async ({ page }) => {
    // Navigate to the Playwright website
    await page.goto('https://playwright.dev/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Playwright/);
  });

  // Test case: Verify header link
  test('get started link should navigate to intro page', async ({ page }) => {
    // Navigate to the Playwright website
    await page.goto('https://playwright.dev/');

    // Click the "Get started" link.
    // Note: Playwright's auto-waiting mechanism will wait for the element to be visible and actionable.
    await page.getByRole('link', { name: 'Get started' }).click();

    // Expects the URL to contain "intro".
    await expect(page).toHaveURL(/.*intro/);
  });

  // Test case: Example of interacting with an input and checking a value
  test('should allow searching', async ({ page }) => {
    // Navigate to a site with a search bar (e.g., playwright.dev)
    await page.goto('https://playwright.dev/');

    // Click the search button (assuming it's identifiable like this)
    // You might need a more specific selector for your actual application
    const searchButton = page.getByRole('button', { name: 'Search' });
    await searchButton.click();

    // Type into the search input
    // The input might become visible after clicking the search button
    const searchInput = page.getByPlaceholder('Search docs');
    await expect(searchInput).toBeVisible(); // Ensure it's visible before typing
    await searchInput.fill('locators');

    // Wait for search results to appear (example assertion)
    // This selector will depend heavily on the actual website structure
    const firstResult = page.locator('.DocSearch-Hit a').first();
    await expect(firstResult).toBeVisible({ timeout: 10000 }); // Wait up to 10s for results
    await expect(firstResult).toHaveText(/Locator/i); // Check if the text content is as expected
  });
});
