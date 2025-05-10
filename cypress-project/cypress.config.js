// cypress-project/cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Base URL for `cy.visit()` and `cy.request()` commands
    // baseUrl: 'http://localhost:3000', // Uncomment and set if you have a local app

    // Configure reporter and reporterOptions for JUnit
    // These settings are often overridden or specified in the CLI command
    // but can be set as defaults here.
    reporter: 'junit',
    reporterOptions: {
      mochaFile: 'results/my-test-output-[hash].xml',
      toConsole: false,
    },

    // The 'setupNodeEvents' function allows you to tap into,
    // modify, or extend the internal behavior of Cypress.
    // For basic JUnit reporting via CLI, this might not be strictly necessary
    // if mocha-junit-reporter is correctly installed and specified in CLI.
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // For example, you can register tasks or modify the config.

      // If you want to ensure reports directory exists or do other setup
      // const fs = require('fs');
      // const reportsDir = 'cypress/reports';
      // if (!fs.existsSync(reportsDir)){
      //   fs.mkdirSync(reportsDir, { recursive: true });
      // }

      return config;
    },

    // Default path for spec files
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',

    // Where Cypress will look for support files
    supportFile: 'cypress/support/e2e.js',

    // Where Cypress will look for fixture files
    fixturesFolder: 'cypress/fixtures',

    // Screenshots folder
    screenshotsFolder: 'cypress/screenshots',

    // Videos folder
    videosFolder: 'cypress/videos',

    // Downloads folder
    downloadsFolder: 'cypress/downloads',

    // Number of times to retry a failing test (for `cypress run`)
    retries: {
      runMode: 1, // Retry once on `cypress run`
      openMode: 0, // No retries on `cypress open`
    },

    // Default timeout for assertions and commands
    defaultCommandTimeout: 4000, // 4 seconds

    // Viewport size
    viewportWidth: 1280,
    viewportHeight: 720,

    // Enable video recording
    video: true,
  },
});
