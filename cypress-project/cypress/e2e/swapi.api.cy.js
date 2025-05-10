// cypress-project/cypress/e2e/swapi.api.cy.js

describe('SWAPI (Star Wars API) Tests', () => {
  const SWAPI_BASE_URL = 'https://swapi.dev/api';

  it('should get a list of people (page 1)', () => {
    cy.request({
      method: 'GET',
      url: `${SWAPI_BASE_URL}/people/`,
      // SWAPI's certificate might sometimes cause issues.
      // If you encounter "certificate has expired" or similar SSL issues with cy.request,
      // you might need to configure Node to allow older SSL versions or handle it in your environment.
      // For Cypress itself, direct SSL handling like Playwright's ignoreHTTPSErrors is not a direct feature
      // for cy.request(). Often, such issues are server-side or environment-related with Node's TLS.
      // One common workaround if this is a persistent issue for a public API and you trust it:
      // Set NODE_TLS_REJECT_UNAUTHORIZED=0 as an environment variable when running Cypress (not recommended for production systems).
      // e.g., in package.json: "test": "NODE_TLS_REJECT_UNAUTHORIZED=0 cypress run ..."
      // However, the swapi.dev certificate issue seems to be resolved as of recent checks.
    }).then((response) => {
      // Check if the response status is 200 (OK)
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('count').and.to.be.a('number').and.gt(0);
      expect(response.body).to.have.property('next').and.to.be.a('string');
      expect(response.body).to.have.property('previous').and.to.be.null;
      expect(response.body).to.have.property('results').and.to.be.an('array').with.length.gt(0);

      if (response.body.results.length > 0) {
        const firstPerson = response.body.results[0];
        expect(firstPerson).to.have.property('name');
        expect(firstPerson).to.have.property('height');
        expect(firstPerson).to.have.property('mass');
      }
    });
  });

  it('should get details for a specific person (Luke Skywalker)', () => {
    const personId = 1; // Luke Skywalker
    cy.request(`${SWAPI_BASE_URL}/people/${personId}/`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('name', 'Luke Skywalker');
      expect(response.body).to.have.property('height', '172');
      expect(response.body).to.have.property('mass', '77');
      expect(response.body).to.have.property('url', `https://swapi.dev/api/people/${personId}/`);
    });
  });

  it('should return 404 for a non-existent person', () => {
    const nonExistentPersonId = 999999;
    cy.request({
      method: 'GET',
      url: `${SWAPI_BASE_URL}/people/${nonExistentPersonId}/`,
      failOnStatusCode: false, // Important: tells Cypress not to fail the test on non-2xx/3xx status codes
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('detail', 'Not found');
    });
  });

  it('should search for people by name (Leia)', () => {
    const searchTerm = 'Leia';
    cy.request(`${SWAPI_BASE_URL}/people/?search=${searchTerm}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.count).to.be.gt(0);
      expect(response.body.results.length).to.be.gt(0);
      response.body.results.forEach((person) => {
        expect(person.name.toLowerCase()).to.include(searchTerm.toLowerCase());
      });
    });
  });

  it('should get root API endpoints and validate schema', () => {
    cy.request(`${SWAPI_BASE_URL}/`).then((response) => {
      expect(response.status).to.eq(200);
      const expectedKeys = ['people', 'planets', 'films', 'species', 'vehicles', 'starships'];
      expectedKeys.forEach(key => {
        expect(response.body).to.have.property(key);
        expect(response.body[key]).to.be.a('string').and.satisfy(msg => msg.startsWith('http'));
      });
    });
  });
});
