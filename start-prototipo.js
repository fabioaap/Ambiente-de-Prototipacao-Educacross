// Script automatizado para rodar o Vite e abrir o navegador na porta correta
// Uso: node start-prototipo.js

const { spawn } = require('child_process');
const http = require('http');
const open = require('child_process').exec;
const path = require('path');

const ports = [5173, 5174];
const projectDir = path.join(__dirname, 'prototype-react');

function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.request({ method: 'HEAD', host: 'localhost', port, timeout: 1000 }, res => {
      resolve(res.statusCode === 200 || res.statusCode === 404);
    });
    req.on('error', () => resolve(false));
    req.end();
  });
}

async function findVitePort() {
  for (const port of ports) {
    if (await checkPort(port)) return port;
  }
  return null;
}

async function openBrowser(port) {
  const url = `http://localhost:${port}/`;
  console.log(`Abrindo navegador em: ${url}`);
  // Windows
  open(`start ${url}`);
}

async function main() {
  let port = await findVitePort();
  if (port) {
    console.log(`Vite já está rodando na porta ${port}.`);
    await openBrowser(port);
    return;
  }
  console.log('Vite não está rodando. Iniciando...');
  const vite = spawn('npm', ['run', 'dev'], { cwd: projectDir, shell: true });
  let detectedPort = null;
  vite.stdout.on('data', (data) => {
    const str = data.toString();
    process.stdout.write(str);
  const match = str.match(/Local:\s+http:\/\/localhost:(\d+)/);
    if (match && !detectedPort) {
      detectedPort = match[1];
      openBrowser(detectedPort);
    }
  });
  vite.stderr.on('data', (data) => {
    process.stderr.write(data.toString());
  });
  vite.on('close', (code) => {
    if (!detectedPort) {
      console.error('Vite não iniciou corretamente. Veja os logs acima.');
    }
    process.exit(code);
  });
}

main();
