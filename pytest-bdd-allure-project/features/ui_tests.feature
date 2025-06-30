# pytest-bdd-allure-project/features/ui_tests.feature
@ui
Feature: Playwright Dev Page UI Tests
  As a user
  I want to interact with the Playwright developer page
  So that I can verify its basic UI functionalities

  @TM:1938
  Scenario: Verify page title
    Given I am on the Playwright dev page
    Then the page title should contain "Playwright"

  Scenario: Get Started link navigation
    Given I am on the Playwright dev page
    When I click the "Get started" link
    Then the URL should contain "/docs/intro"

  Scenario: Search functionality
    Given I am on the Playwright dev page
    When I click the search button on the main page
    And I type "locators" into the search input
    Then I should see search results containing "Locator"
