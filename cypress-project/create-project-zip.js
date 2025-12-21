#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script to create a zip file of the Cypress project without dependencies
 * Excludes: node_modules, test results, reports, screenshots, videos, and other artifacts
 */

const projectRoot = __dirname;
const zipFileName = 'cypress-project-resources.zip';
const zipPath = path.join(projectRoot, zipFileName);

// Files and directories to exclude
const excludePatterns = [
  'node_modules',
  'create-project-zip*',
  'generate-tests-and-zip*',
  'generate-tests.ts',
  'package-lock.json',
  'cypress/reports',
  'cypress/screenshots',
  'cypress/videos',
  'results',
  'test-results',
  '.DS_Store',
  '*.log',
  'cypress-project-resources.zip'
];

console.log('Creating zip file of Cypress project (excluding dependencies)...\n');

// Remove existing zip file if it exists
if (fs.existsSync(zipPath)) {
  console.log(`Removing existing ${zipFileName}...`);
  fs.unlinkSync(zipPath);
}

// Build the zip command with exclusions
// Using the -x flag to exclude patterns
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
  console.log('  - cypress/ (test files and configuration)');
  console.log('  - cypress.config.js');
  console.log('  - package.json');
  console.log('  - generate-tests.js');
  console.log('  - test-cases-example.txt');
  console.log('  - test-cases-example.json');
  console.log('\nExcluded:');
  console.log('  - node_modules/');
  console.log('  - package-lock.json');
  console.log('  - Test results and reports');
  console.log('  - Screenshots and videos');

} catch (error) {
  console.error('\n✗ Error creating zip file:', error.message);
  process.exit(1);
}
