#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

const script = path.join(__dirname, '../scripts/preflight.ps1');
try {
  execSync(`pwsh -NoProfile -ExecutionPolicy Bypass -File "${script}"`, { stdio: 'inherit' });
} catch (e) {
  process.exit(1);
}
