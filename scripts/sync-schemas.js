#!/usr/bin/env node

/**
 * Schema Sync Verification Script
 * Ensures TypeScript and Python schemas remain in sync
 * 
 * This script verifies that:
 * 1. SourceType enum values match exactly
 * 2. ProcessingStatus enum values match exactly
 * 3. Both files exist and are readable
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function extractEnumValues(content, enumName) {
  // Match TypeScript enum pattern
  const tsPattern = new RegExp(
    `export enum ${enumName}\\s*{([^}]+)}`,
    's'
  );
  
  // Match Python enum pattern - handle single-line docstring, stop at double newline (handles \r\n)
  const pyPattern = new RegExp(
    `class ${enumName}\\(str, Enum\\):\\s*"""[^"]*"""([\\s\\S]*?)(?:\\r?\\n){2,}`,
    's'
  );
  
  let match = content.match(tsPattern);
  let enumBody;
  
  if (match) {
    // TypeScript enum
    enumBody = match[1];
  } else {
    // Try Python enum
    match = content.match(pyPattern);
    if (match) {
      enumBody = match[1];
    } else {
      return null;
    }
  }
  
  // Extract enum values (handles both TS and Python formats)
  const values = [];
  // Match lines like: YOUTUBE_VIDEO = 'YOUTUBE_VIDEO' or YOUTUBE_VIDEO = "YOUTUBE_VIDEO"
  const valuePattern = /^\s*(\w+)\s*=\s*["'](\w+)["']/gm;
  let valueMatch;
  
  while ((valueMatch = valuePattern.exec(enumBody)) !== null) {
    // Only include if key matches value (enum pattern)
    if (valueMatch[1] === valueMatch[2]) {
      values.push(valueMatch[2]);
    }
  }
  
  return values.sort();
}

function verifySchemaSync() {
  log('\n🔍 Schema Sync Verification Starting...', 'cyan');
  log('━'.repeat(50), 'cyan');
  
  const tsPath = path.join(__dirname, '../packages/types/src/learning.ts');
  const pyPath = path.join(__dirname, '../packages/types/python/schemas.py');
  
  // Check if files exist
  if (!fs.existsSync(tsPath)) {
    log(`\n❌ TypeScript schema not found: ${tsPath}`, 'red');
    process.exit(1);
  }
  
  if (!fs.existsSync(pyPath)) {
    log(`\n❌ Python schema not found: ${pyPath}`, 'red');
    process.exit(1);
  }
  
  log('✓ Schema files found', 'green');
  
  // Read file contents
  const tsContent = fs.readFileSync(tsPath, 'utf8');
  const pyContent = fs.readFileSync(pyPath, 'utf8');
  
  let hasErrors = false;
  
  // Verify SourceType enum
  log('\n📋 Verifying SourceType enum...', 'blue');
  const tsSourceTypes = extractEnumValues(tsContent, 'SourceType');
  const pySourceTypes = extractEnumValues(pyContent, 'SourceType');
  
  if (!tsSourceTypes || !pySourceTypes) {
    log('❌ Could not extract SourceType enum values', 'red');
    hasErrors = true;
  } else {
    log(`  TypeScript: [${tsSourceTypes.join(', ')}]`, 'yellow');
    log(`  Python:     [${pySourceTypes.join(', ')}]`, 'yellow');
    
    const tsSet = new Set(tsSourceTypes);
    const pySet = new Set(pySourceTypes);
    
    if (tsSourceTypes.length !== pySourceTypes.length || 
        ![...tsSet].every(v => pySet.has(v))) {
      log('❌ SourceType enums do not match!', 'red');
      hasErrors = true;
    } else {
      log('✓ SourceType enums match perfectly', 'green');
    }
  }
  
  // Verify ProcessingStatus enum
  log('\n📋 Verifying ProcessingStatus enum...', 'blue');
  const tsStatuses = extractEnumValues(tsContent, 'ProcessingStatus');
  const pyStatuses = extractEnumValues(pyContent, 'ProcessingStatus');
  
  if (!tsStatuses || !pyStatuses) {
    log('❌ Could not extract ProcessingStatus enum values', 'red');
    hasErrors = true;
  } else {
    log(`  TypeScript: [${tsStatuses.join(', ')}]`, 'yellow');
    log(`  Python:     [${pyStatuses.join(', ')}]`, 'yellow');
    
    const tsSet = new Set(tsStatuses);
    const pySet = new Set(pyStatuses);
    
    if (tsStatuses.length !== pyStatuses.length || 
        ![...tsSet].every(v => pySet.has(v))) {
      log('❌ ProcessingStatus enums do not match!', 'red');
      hasErrors = true;
    } else {
      log('✓ ProcessingStatus enums match perfectly', 'green');
    }
  }
  
  // Final result
  log('\n' + '━'.repeat(50), 'cyan');
  
  if (hasErrors) {
    log('❌ Schema sync verification FAILED', 'red');
    log('Please ensure TypeScript and Python schemas are in sync.', 'yellow');
    process.exit(1);
  } else {
    log('✅ Schema sync verification PASSED', 'green');
    log('TypeScript and Python schemas are in perfect sync!', 'green');
    process.exit(0);
  }
}

// Run verification
verifySchemaSync();
