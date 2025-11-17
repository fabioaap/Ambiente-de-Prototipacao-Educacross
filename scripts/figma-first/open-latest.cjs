#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const repoRoot = process.cwd();
const outDir = path.resolve(repoRoot, 'validation-artifacts/figma-first');
const latest = path.join(outDir, 'latest.html');

if (!fs.existsSync(latest)) {
    console.error('latest.html não encontrado. Rode "npm run figma:first" primeiro.');
    process.exit(2);
}

function openFile(p) {
    const platform = process.platform;
    if (platform === 'win32') {
        spawn('cmd', ['/c', 'start', '""', p], { stdio: 'ignore', shell: false });
    } else if (platform === 'darwin') {
        spawn('open', [p], { stdio: 'ignore' });
    } else {
        spawn('xdg-open', [p], { stdio: 'ignore' });
    }
}

console.log(`Abrindo relatório: ${latest}`);
openFile(latest);
