#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

/**
 * Script to generate empty Playwright test cases from a list with TM: tag support
 *
 * Usage:
 *   npx ts-node generate-tests.ts "1938,1939,1940"
 *   npx ts-node generate-tests.ts --file test-cases.txt
 *   npx ts-node generate-tests.ts --json test-cases.json
 *
 * JSON format example:
 * [
 *   {"id": "1938", "name": "Test login functionality"},
 *   {"id": "1939", "name": "Test API endpoint"}
 * ]
 *
 * Text file format (one per line):
 * 1938,Test login functionality
 * 1939,Test API endpoint
 */

interface TestCase {
  id: string;
  name: string;
}

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage:');
  console.error('  npx ts-node generate-tests.ts "1938,1939,1940"');
  console.error('  npx ts-node generate-tests.ts --file test-cases.txt');
  console.error('  npx ts-node generate-tests.ts --json test-cases.json');
  process.exit(1);
}

const OUTPUT_DIR = path.join(__dirname, 'tests');

/**
 * Generate a Playwright test file
 */
function generatePlaywrightTest(testCase: TestCase): { filePath: string; content: string } {
  const { id, name } = testCase;
  const testName = name || `Test case ${id}`;
  const fileName = `TM-${id}.spec.ts`;
  const filePath = path.join(OUTPUT_DIR, fileName);
  const tmTag = `@TM:${id}`;

  const template = `// ${fileName}
// Generated test case for: ${testName}
// Test Manager ID: ${id}

import { test, expect } from '@playwright/test';

test.describe('${testName}', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    // TODO: Add setup logic (e.g., navigate to URL, set up API mocks)
  });

  test('${testName} ${tmTag}', async ({ page }) => {
    // TODO: Implement test steps
    console.log('Test ${tmTag}: ${testName}');

    // Example steps (replace with actual test logic):
    // await page.goto('https://example.com');
    // await expect(page.locator('[data-testid="element"]')).toBeVisible();
    // await expect(page.getByText('Expected text')).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    // Cleanup after each test
    // TODO: Add cleanup logic
  });
});
`;

  return { filePath, content: template };
}

/**
 * Parse test cases from different input formats
 */
function parseTestCases(args: string[]): TestCase[] {
  const testCases: TestCase[] = [];

  if (args[0] === '--file') {
    // Read from text file
    const filePath = args[1];
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    lines.forEach(line => {
      const parts = line.split(',').map(p => p.trim());
      testCases.push({
        id: parts[0],
        name: parts[1] || `Test case ${parts[0]}`
      });
    });

  } else if (args[0] === '--json') {
    // Read from JSON file
    const filePath = args[1];
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    data.forEach((item: any) => {
      testCases.push({
        id: item.id,
        name: item.name || `Test case ${item.id}`
      });
    });

  } else {
    // Parse comma-separated list of IDs
    const ids = args[0].split(',').map(id => id.trim());
    ids.forEach(id => {
      testCases.push({
        id: id,
        name: `Test case ${id}`
      });
    });
  }

  return testCases;
}

/**
 * Main function
 */
function main(): void {
  console.log('Playwright Test Generator');
  console.log('==========================\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Parse test cases
  const testCases = parseTestCases(args);

  if (testCases.length === 0) {
    console.error('No test cases found to generate.');
    process.exit(1);
  }

  console.log(`Generating ${testCases.length} test file(s)...\n`);

  // Generate test files
  let successCount = 0;
  let skippedCount = 0;

  testCases.forEach(testCase => {
    const { filePath, content } = generatePlaywrightTest(testCase);

    if (fs.existsSync(filePath)) {
      console.log(`⚠️  Skipped: ${path.basename(filePath)} (already exists)`);
      skippedCount++;
    } else {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Created: ${path.basename(filePath)} - Tag: @TM:${testCase.id}`);
      successCount++;
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Created: ${successCount}`);
  console.log(`   Skipped: ${skippedCount}`);
  console.log(`   Total: ${testCases.length}`);
  console.log(`\n📁 Output directory: ${OUTPUT_DIR}`);
}

main();
