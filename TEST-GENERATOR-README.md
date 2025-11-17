# Test Generator & GitHub Actions Guide

This repository contains automated test generation scripts and GitHub Actions workflows for both Cypress and Playwright projects.

## Features

1. **GitHub Actions Workflow** - Automatically creates zip files of project resources and publishes them as GitHub releases
2. **Test Case Generators** - Scripts to generate empty test case files from a list of test IDs

---

## GitHub Actions Workflow

### Location
[.github/workflows/create-project-zips.yml](.github/workflows/create-project-zips.yml)

### What it does
- Creates zip files for both Cypress and Playwright projects
- Excludes unnecessary files (node_modules, test results, screenshots, etc.)
- Publishes the zip files as a GitHub Release

### How to use

#### Option 1: Manual Trigger (Workflow Dispatch)
1. Go to your GitHub repository
2. Click on **Actions** tab
3. Select **Create Project Resource Zips** workflow
4. Click **Run workflow**
5. Fill in the inputs:
   - **include_node_modules**: Choose `true` or `false` (default: `false`)
   - **release_tag**: Enter a tag name (e.g., `v1.0.0`, `resources-2024-01-15`)
6. Click **Run workflow**

#### Option 2: Automatic on Push
The workflow will also run automatically when you push changes to the `main` branch that affect files in:
- `cypress-project/**`
- `playwright-project/**`

### Finding your zip files
After the workflow completes:
1. Go to the **Releases** section of your repository
2. Find the release with your specified tag name
3. Download the zip files from the release assets:
   - `cypress-project-resources.zip`
   - `playwright-project-resources.zip`

---

## Test Case Generators

Both Cypress and Playwright projects have scripts to generate empty test case files from a list of test IDs.

### Cypress Generator

#### Location
[cypress-project/generate-tests.js](cypress-project/generate-tests.js)

#### Usage

**Method 1: Comma-separated list**
```bash
cd cypress-project
npm run generate:tests "1938,1939,1940"
```

**Method 2: From text file**
```bash
npm run generate:tests -- --file test-cases-example.txt
```

Text file format (one per line):
```
1938,Verify page title displays correctly
1939,Test user login functionality
1940,Validate search results are displayed
```

**Method 3: From JSON file**
```bash
npm run generate:tests -- --json test-cases-example.json
```

JSON format:
```json
[
  {"id": "1938", "name": "Verify page title displays correctly"},
  {"id": "1939", "name": "Test user login functionality"}
]
```

#### Generated file example
File: `cypress/e2e/TM-1938.cy.js`
```javascript
describe('Verify page title displays correctly', () => {
  it('Verify page title displays correctly', { tags: ['TM:1938'] }, () => {
    // TODO: Implement test steps
  });
});
```

### Playwright Generator

#### Location
[playwright-project/generate-tests.ts](playwright-project/generate-tests.ts)

#### Usage

**Method 1: Comma-separated list**
```bash
cd playwright-project
npm run generate:tests "1938,1939,1940"
```

**Method 2: From text file**
```bash
npm run generate:tests -- --file test-cases-example.txt
```

**Method 3: From JSON file**
```bash
npm run generate:tests -- --json test-cases-example.json
```

(Text and JSON formats are the same as Cypress)

#### Generated file example
File: `tests/TM-1938.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Verify page title displays correctly', () => {
  test('Verify page title displays correctly @TM:1938', async ({ page }) => {
    // TODO: Implement test steps
  });
});
```

---

## Example Files

Both projects include example input files you can use as templates:
- `test-cases-example.txt` - Text file format
- `test-cases-example.json` - JSON format

---

## Running Generated Tests

### Cypress
After generating tests, you can run them:

```bash
# Run all tests
npm test

# Run specific test by tag
npm test -- --env grepTags="TM:1938"

# Run in headed mode
npm run test:headed
```

### Playwright
After generating tests, you can run them:

```bash
# Run all tests
npm test

# Run specific test by grep pattern
npm test -- --grep "@TM:1938"

# View report
npm run report
```

---

## Notes

- Generated test files will **not** overwrite existing files with the same name
- Test files follow the naming convention: `TM-{id}.cy.js` (Cypress) or `TM-{id}.spec.ts` (Playwright)
- All generated tests include the `@TM:{id}` tag for easy filtering
- The scripts automatically create the test directories if they don't exist

---

## Troubleshooting

### Playwright: ts-node not found
If you get an error about ts-node, install dependencies:
```bash
cd playwright-project
npm install
```

### Permission denied when running scripts directly
Make scripts executable:
```bash
chmod +x cypress-project/generate-tests.js
chmod +x playwright-project/generate-tests.ts
```

### GitHub Actions: Permission denied
Ensure your repository has Actions enabled and has write permissions for releases:
1. Go to repository **Settings** > **Actions** > **General**
2. Under "Workflow permissions", select "Read and write permissions"
