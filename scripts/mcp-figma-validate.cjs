#!/usr/bin/env node
/** Orquestrador MCP→Figma→Spec→Assert (liga servidor estático se necessário) */
const path = require('path');
const fs = require('fs');
const http = require('http');
const url = require('url');
const { gerarSpec } = require('./mcp/figma-client.cjs');
const { spawnSync } = require('child_process');

function run(cmd, args, opts = {}) {
    const r = spawnSync(cmd, args, { stdio: 'inherit', shell: false, ...opts });
    if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} falhou com código ${r.status}`);
}

function checarServidor(baseURL) {
    return new Promise((resolve) => {
        const { hostname, port, pathname } = new url.URL(baseURL);
        const req = http.request({ host: hostname, port: Number(port) || 80, path: pathname || '/', method: 'GET' }, (res) => {
            resolve(res.statusCode >= 200 && res.statusCode < 500);
        });
        req.on('error', () => resolve(false));
        req.end();
    });
}

function mimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const map = {
        '.html': 'text/html; charset=utf-8',
        '.htm': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.mjs': 'application/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.ico': 'image/x-icon',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf'
    };
    return map[ext] || 'application/octet-stream';
}

function criarServidorEstatico(raiz, porta) {
    const server = http.createServer((req, res) => {
        try {
            const reqUrl = decodeURIComponent(req.url || '/');
            const filePath = path.join(raiz, reqUrl.replace(/^\//, '')) || '';
            let alvo = filePath;
            if (!path.extname(alvo)) {
                // Se for diretório, tentar index.html
                const dir = fs.existsSync(alvo) && fs.statSync(alvo).isDirectory();
                if (dir) alvo = path.join(alvo, 'index.html');
            }
            if (!fs.existsSync(alvo)) {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('404 Not Found');
                return;
            }
            const data = fs.readFileSync(alvo);
            res.writeHead(200, { 'Content-Type': mimeType(alvo) });
            res.end(data);
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('500 Internal Server Error');
        }
    });
    return new Promise((resolve, reject) => {
        server.listen(porta, () => resolve(server));
        server.on('error', reject);
    });
}

(async () => {
    const manifestPath = path.resolve('validation/mcp-figma.manifest.json');
    const specOut = path.resolve('validation/figma.spec.generated.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    // 0) Garantir servidor estático disponível em baseURL (ex.: http://localhost:8080)
    let server;
    try {
        const ok = await checarServidor(manifest.baseURL);
        if (!ok) {
            const porta = Number(new url.URL(manifest.baseURL).port) || 8080;
            console.log(`[mcp-figma-validate] Servidor não detectado em ${manifest.baseURL}. Subindo estático na porta ${porta}...`);
            server = await criarServidorEstatico(process.cwd(), porta);
        }
    } catch (e) {
        console.warn('[mcp-figma-validate] Falha ao checar/subir servidor estático:', e.message);
    }

    try {
        // 1) Gerar spec (MCP/REST)
        await gerarSpec({ arquivoManifesto: manifestPath, saidaSpec: specOut });

        // 2) Rodar assertions computed em Chromium DPR 1 e 2
        run('node', ['scripts/mcp/assert-computed.cjs', `--manifest=${manifestPath}`, `--spec=${specOut}`, '--browser=chromium', '--dpr=1']);
        run('node', ['scripts/mcp/assert-computed.cjs', `--manifest=${manifestPath}`, `--spec=${specOut}`, '--browser=chromium', '--dpr=2']);

        // 3) (Opcional) Edge, se instalado
        try {
            run('node', ['scripts/mcp/assert-computed.cjs', `--manifest=${manifestPath}`, `--spec=${specOut}`, '--browser=msedge', '--dpr=1']);
            run('node', ['scripts/mcp/assert-computed.cjs', `--manifest=${manifestPath}`, `--spec=${specOut}`, '--browser=msedge', '--dpr=2']);
        } catch (e) {
            console.warn('[mcp-figma-validate] Edge indisponível, prosseguindo sem ele.');
        }
    } finally {
        if (server) {
            await new Promise((r) => server.close(() => r()));
            console.log('[mcp-figma-validate] Servidor estático encerrado.');
        }
    }

    console.log('\n[mcp-figma-validate] Validações concluídas. Relatórios em validation-artifacts/mcp/*.json');
})();
