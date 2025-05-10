// cypress-project/cypress/e2e/example.ui.cy.js

describe('UI Tests for Playwright Dev Page', () => {
  beforeEach(() => {
    // Visit the Playwright website before each test
    cy.visit('https://playwright.dev/');
  });

  it('should have the correct page title', () => {
    // Expect a title "to include" a substring.
    cy.title().should('include', 'Playwright');
  });

  it('get started link should navigate to intro page', () => {
    // Click the "Get started" link.
    // Cypress automatically waits for elements to be actionable.
    cy.contains('a', 'Get started', { matchCase: false }).click();

    // Expects the URL to contain "intro".
    cy.url().should('include', '/docs/intro');
  });

  it('should allow searching from the main page', () => {
    // Click the search button (this selector might need adjustment based on actual site structure)
    // Using a more robust selector if available is recommended.
    cy.get('button[class*="search"]', { timeout: 10000 }).first().should('be.visible').click();

    // Type into the search input that appears
    // The placeholder might be specific, adjust if needed
    cy.get('input[placeholder*="Search"]', { timeout: 10000 }).should('be.visible').type('locators');

    // Wait for search results to appear and check the first result
    // This selector will depend heavily on the actual website structure
    cy.get('.DocSearch-Hit a', { timeout: 10000 })
      .first()
      .should('be.visible')
      .and('contain.text', 'Locator'); // Check if the text content is as expected (case-insensitive for 'contain.text')
  });
});
