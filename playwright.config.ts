// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import path from 'path';

// Define a name for the test run, used for the report.
export const TEST_RUN_NAME = 'playwright-report';

export default defineConfig({
  // Test directory: Location of your test files
  testDir: './tests',

  // Maximum time one test can run for.
  timeout: 30 * 1000, // 30 seconds

  // Maximum time expect() should wait for the condition to be met.
  expect: {
    timeout: 5000, // 5 seconds
  },

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use. See https://playwright.dev/docs/test-reporters
  reporter: [
    ['html', { outputFolder: TEST_RUN_NAME, open: 'never' }],
    ['list']
  ],

  // Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions.
  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: 'http://localhost:3000', // Change this to your app's URL

    // Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
    trace: 'on-first-retry',

    // Record video for all tests, or 'on-first-retry' or 'off'
    video: 'retain-on-failure',

    // Capture screenshot on failure
    screenshot: 'only-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Example of a mobile browser project
    /*
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    */

    // Example of a project specifically for API tests
    {
      name: 'API Tests',
      use: {
        // All requests we send go to this API endpoint.
        baseURL: 'https://reqres.in/api', // Example API endpoint
      },
      testMatch: /.*\.api\.ts/, // Only run files ending with .api.ts
    },
  ],

  // Optionally, output directory for test results, default is test-results
  // outputDir: 'test-results/',

  // Optionally, run your local dev server before starting the tests
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
