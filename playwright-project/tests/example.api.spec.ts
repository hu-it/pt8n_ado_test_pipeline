// tests/example.api.spec.ts
import { test, expect, APIRequestContext } from '@playwright/test';

// Test suite for SWAPI (Star Wars API) tests
// The tag @api is used to run only API tests if needed (see package.json scripts)
test.describe('SWAPI Tests @api', () => {
  let apiContext: APIRequestContext;

  // Setup hook to create an API context before all tests in this describe block
  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      // Base URL for SWAPI
      baseURL: 'https://swapi.dev/api/',
      // IMPORTANT: Workaround for "certificate has expired" error from swapi.dev
      // This should only be used for testing non-sensitive, public APIs
      // when the server's SSL certificate has issues.
      ignoreHTTPSErrors: true,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        // SWAPI doesn't require authentication, so no Authorization header needed
      },
    });
  });

  // Teardown hook to dispose of the API context after all tests
  test.afterAll(async ({}) => {
    // Dispose all responses.
    await apiContext.dispose();
  });

  // Test case: GET request to fetch the first page of people
  test('should get a list of people (page 1)', async () => {
    const response = await apiContext.get('people/');

    // Check if the response status is 200 (OK)
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // Parse the JSON response
    const responseBody = await response.json();

    // Perform assertions on the response body
    expect(responseBody).toHaveProperty('count'); // Total number of people
    expect(responseBody.count).toBeGreaterThan(0);
    expect(responseBody).toHaveProperty('next'); // URL for the next page
    expect(responseBody).toHaveProperty('previous', null); // URL for the previous page (should be null for the first page)
    expect(responseBody).toHaveProperty('results');
    expect(Array.isArray(responseBody.results)).toBe(true);
    expect(responseBody.results.length).toBeGreaterThan(0);

    // Check properties of the first person in the list (e.g., Luke Skywalker if API data is consistent)
    if (responseBody.results.length > 0) {
      const firstPerson = responseBody.results[0];
      expect(firstPerson).toHaveProperty('name');
      expect(firstPerson).toHaveProperty('height');
      expect(firstPerson).toHaveProperty('mass');
      expect(firstPerson).toHaveProperty('hair_color');
      expect(firstPerson).toHaveProperty('skin_color');
      expect(firstPerson).toHaveProperty('eye_color');
      expect(firstPerson).toHaveProperty('birth_year');
      expect(firstPerson).toHaveProperty('gender');
      expect(firstPerson).toHaveProperty('homeworld'); // This is a URL to another resource
      expect(firstPerson).toHaveProperty('films'); // Array of URLs
      expect(Array.isArray(firstPerson.films)).toBe(true);
    }
  });

  // Test case: GET request to fetch a specific person (Luke Skywalker, ID 1)
  test('should get details for a specific person (Luke Skywalker)', async () => {
    const personId = 1; // Luke Skywalker
    const response = await apiContext.get(`people/${personId}/`);

    // Check if the response status is 200 (OK)
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // Perform assertions on the response body
    expect(responseBody).toHaveProperty('name', 'Luke Skywalker');
    expect(responseBody).toHaveProperty('height', '172');
    expect(responseBody).toHaveProperty('mass', '77');
    expect(responseBody).toHaveProperty('hair_color', 'blond');
    expect(responseBody).toHaveProperty('url', `https://swapi.dev/api/people/${personId}/`);
  });

  // Test case: GET request for a non-existent person
  test('should return 404 for a non-existent person', async () => {
    const nonExistentPersonId = 999999; // An ID that is highly unlikely to exist
    const response = await apiContext.get(`people/${nonExistentPersonId}/`);

    // Check if the response status is 404 (Not Found)
    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('detail', 'Not found');
  });

  // Test case: GET request to search for people
  test('should search for people by name', async () => {
    const searchTerm = 'Leia';
    const response = await apiContext.get(`people/?search=${searchTerm}`);

    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();

    expect(responseBody.count).toBeGreaterThan(0);
    expect(responseBody.results.length).toBeGreaterThan(0);
    // Check if all results contain the search term in their name (case-insensitive)
    responseBody.results.forEach((person: any) => {
      expect(person.name.toLowerCase()).toContain(searchTerm.toLowerCase());
    });
  });

  // Test case: GET request to fetch a specific starship (Death Star, ID 9)
  test('should get details for a specific starship (Death Star)', async () => {
    const starshipId = 9; // Death Star
    const response = await apiContext.get(`starships/${starshipId}/`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('name', 'Death Star');
    expect(responseBody).toHaveProperty('model', 'DS-1 Orbital Battle Station');
    expect(responseBody).toHaveProperty('manufacturer');
    expect(responseBody).toHaveProperty('cost_in_credits');
    expect(responseBody).toHaveProperty('length');
    expect(responseBody).toHaveProperty('url', `https://swapi.dev/api/starships/${starshipId}/`);
  });

  // Test case: Validate schema for the root endpoint
  test('should get root API endpoints and validate schema', async () => {
    const response = await apiContext.get('/'); // Root endpoint

    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();

    // Check for expected top-level keys which are URLs to other resources
    expect(responseBody).toHaveProperty('people');
    expect(responseBody).toHaveProperty('planets');
    expect(responseBody).toHaveProperty('films');
    expect(responseBody).toHaveProperty('species');
    expect(responseBody).toHaveProperty('vehicles');
    expect(responseBody).toHaveProperty('starships');

    // Validate that these properties are URLs (simple check for string starting with http)
    for (const key in responseBody) {
      expect(typeof responseBody[key]).toBe('string');
      expect(responseBody[key].startsWith('http')).toBeTruthy();
    }
  });
});
