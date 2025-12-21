#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

/**
 * Script to create a zip file of the Playwright project without dependencies
 * Excludes: node_modules, test results, reports, and other artifacts
 */

const projectRoot = __dirname;
const zipFileName = 'playwright-project-resources.zip';
const zipPath = path.join(projectRoot, zipFileName);

// Files and directories to exclude
const excludePatterns = [
  'node_modules',
  'create-project-zip*',
  'generate-tests-and-zip*',
  'generate-tests.ts',
  'package-lock.json',
  'playwright-report',
  'test-results',
  '.DS_Store',
  '*.log',
  'playwright-project-resources.zip'
];

console.log('Creating zip file of Playwright project (excluding dependencies)...\n');

// Remove existing zip file if it exists
if (fs.existsSync(zipPath)) {
  console.log(`Removing existing ${zipFileName}...`);
  fs.unlinkSync(zipPath);
}

// Build the zip command with exclusions
const excludeArgs = excludePatterns
  .map(pattern => {
    if (pattern.includes('*') || pattern.includes('.')) {
      return `-x "${pattern}"`;
    }
    return `-x "${pattern}/*" -x "*/${pattern}/*"`;
  })
  .join(' ');

try {
  // Create zip file excluding specified patterns
  const zipCommand = `cd "${projectRoot}" && zip -r "${zipFileName}" . ${excludeArgs} -x "*.zip"`;

  console.log('Executing zip command...');
  execSync(zipCommand, { stdio: 'inherit' });

  const stats = fs.statSync(zipPath);
  const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log('\n✓ Zip file created successfully!');
  console.log(`  Location: ${zipPath}`);
  console.log(`  Size: ${fileSizeInMB} MB`);
  console.log('\nIncluded files:');
  console.log('  - tests/ (test files)');
  console.log('  - playwright.config.ts');
  console.log('  - package.json');
  console.log('  - tsconfig.json');
  console.log('  - generate-tests.ts');
  console.log('  - test-cases-example.txt');
  console.log('  - test-cases-example.json');
  console.log('\nExcluded:');
  console.log('  - node_modules/');
  console.log('  - package-lock.json');
  console.log('  - Test results and reports');

} catch (error: any) {
  console.error('\n✗ Error creating zip file:', error.message);
  process.exit(1);
}
