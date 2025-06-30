// cypress-project/cypress/support/e2e.js

// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// https://on.cypress.io/support-file

// Import commands.js using ES2015 syntax:
import './commands';
require('cypress-grep/src/support')();

// Alternatively, you can use CommonJS syntax:
// require('./commands')

// You can also import custom commands from other files
// import './custom_commands';

// Example: A global before each hook
// beforeEach(() => {
//   cy.log('I run before every single test in every spec file');
// });

// By default, Cypress will automatically include this file before every spec file.
