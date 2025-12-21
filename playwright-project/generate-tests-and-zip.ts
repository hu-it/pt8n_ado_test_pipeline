#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Wrapper script to generate tests and then create a zip file
 * This properly passes all arguments to the generate-tests.ts script
 */

const projectRoot = __dirname;

// Get all arguments passed to this script (excluding ts-node and script name)
const args = process.argv.slice(2);

// Build the command for generate-tests.ts
const generateTestsCmd = `npx ts-node "${path.join(projectRoot, 'generate-tests.ts')}"`;
const fullGenerateCmd = args.length > 0
  ? `${generateTestsCmd} ${args.map(arg => `"${arg}"`).join(' ')}`
  : generateTestsCmd;

console.log('Step 1: Generating tests...\n');

try {
  // Run the generate-tests script with all arguments
  execSync(fullGenerateCmd, {
    stdio: 'inherit',
    cwd: projectRoot
  });

  console.log('\nStep 2: Creating project zip file...\n');

  // Run the create-project-zip script
  execSync(`npx ts-node "${path.join(projectRoot, 'create-project-zip.ts')}"`, {
    stdio: 'inherit',
    cwd: projectRoot
  });

  console.log('\nStep 3: Cleaning up generated test files...\n');

  // Remove generated test files
  const testsDir = path.join(projectRoot, 'tests');

  if (fs.existsSync(testsDir)) {
    const allFiles = fs.readdirSync(testsDir);
    const testFiles = allFiles.filter(file => file.startsWith('TM-') && file.endsWith('.spec.ts'));

    let removedCount = 0;
    testFiles.forEach((file: string) => {
      const filePath = path.join(testsDir, file);
      fs.unlinkSync(filePath);
      console.log(`🗑️  Removed: ${file}`);
      removedCount++;
    });

    if (removedCount > 0) {
      console.log(`\n✓ Removed ${removedCount} generated test file(s)`);
    } else {
      console.log('No test files to remove');
    }
  } else {
    console.log('Tests directory not found, skipping cleanup');
  }

  console.log('\n✓ All tasks completed successfully!');

} catch (error: any) {
  console.error('\n✗ Error:', error.message);
  process.exit(1);
}
