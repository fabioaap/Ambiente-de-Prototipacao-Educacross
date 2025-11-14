#!/usr/bin/env node
// Servidor estático simples (UTF-8) para desenvolvimento
const http = require('http');
const fs = require('fs');
const path = require('path');

const raiz = process.cwd();
let porta = Number(process.env.PORT || 8080);

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

const server = http.createServer((req, res) => {
    try {
        const reqUrl = decodeURIComponent(req.url || '/');
        const filePath = path.join(raiz, reqUrl.replace(/^\//, '')) || '';
        let alvo = filePath;
        if (!path.extname(alvo)) {
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

function tentarOuProximaPorta(p) {
    return new Promise((resolve) => {
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') return resolve(false);
            throw err;
        });
        server.once('listening', () => resolve(true));
        server.listen(p);
    });
}

(async () => {
    let sucesso = await tentarOuProximaPorta(porta);
    while (!sucesso && porta < 8090) {
        porta += 1;
        sucesso = await tentarOuProximaPorta(porta);
    }
    if (!sucesso) {
        console.error('[serve-static] Não foi possível abrir porta entre 8080-8090');
        process.exit(1);
    }
    console.log(`[serve-static] Servindo ${raiz} em http://localhost:${porta}`);
    console.log('[serve-static] Ctrl+C para encerrar.');
})();
