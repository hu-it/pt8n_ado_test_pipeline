# pytest-bdd-allure-project/features/api_tests.feature
@api
Feature: SWAPI (Star Wars API) Tests
  As a developer
  I want to interact with the SWAPI API
  So that I can verify its endpoints and data

  Scenario: Get a list of people
    When I request the list of people from SWAPI
    Then the SWAPI response status should be 200
    And the SWAPI response should contain a list of people

  Scenario: Get details for a specific person (Luke Skywalker)
    When I request details for person ID 1 from SWAPI
    Then the SWAPI response status should be 200
    And the person's name should be "Luke Skywalker"

  Scenario: Get details for a non-existent person
    When I request details for a non-existent person ID 999999 from SWAPI
    Then the SWAPI response status should be 404
    And the SWAPI response detail should be "Not found"

  Scenario: Search for people by name
    When I search for people with name "Leia" in SWAPI
    Then the SWAPI response status should be 200
    And the SWAPI search results should contain people named "Leia"
