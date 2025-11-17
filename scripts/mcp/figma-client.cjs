#!/usr/bin/env node
/**
 * Cliente Figma (MCP/REST) - modo REST por padrão
 * pt-BR everywhere
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

function lerJSON(caminho) {
    try { return JSON.parse(fs.readFileSync(caminho, 'utf8')); } catch { return null; }
}

function salvarJSON(caminho, dados) {
    fs.mkdirSync(path.dirname(caminho), { recursive: true });
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
}

function req(url, headers) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, { method: 'GET', headers }, (res) => {
            let data = '';
            res.on('data', (c) => (data += c));
            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

function extrairPropriedadesBasicas(node) {
    const out = { id: node.id, name: node.name, type: node.type };
    if (node.absoluteBoundingBox) {
        out.width = Math.round(node.absoluteBoundingBox.width);
        out.height = Math.round(node.absoluteBoundingBox.height);
    }
    if (Array.isArray(node.fills) && node.fills[0] && node.fills[0].type === 'SOLID') {
        const f = node.fills[0].color; const a = node.fills[0].opacity ?? 1;
        out.fill = { r: f.r, g: f.g, b: f.b, a };
    }
    if (node.strokes && Array.isArray(node.strokes) && node.strokes[0]) {
        const s = node.strokes[0].color; const a = node.strokes[0].opacity ?? 1;
        out.stroke = { r: s.r, g: s.g, b: s.b, a, width: node.strokeWeight };
    }
    if (typeof node.cornerRadius === 'number') out.radius = node.cornerRadius;
    if (Array.isArray(node.effects)) {
        const sh = node.effects.find(e => e.type === 'DROP_SHADOW');
        if (sh) out.shadow = { x: sh.offset?.x, y: sh.offset?.y, blur: sh.radius, a: sh.color?.a };
    }
    if (node.style) {
        out.font = {
            family: node.style.fontFamily,
            size: node.style.fontSize,
            weight: node.style.fontWeight,
            lineHeightPx: node.style.lineHeightPx,
            letterSpacing: node.style.letterSpacing
        };
    }
    return out;
}

function rgbToHex({ r, g, b, a = 1 }) {
    const to255 = (v) => Math.round((v ?? 0) * 255);
    const hex = (n) => n.toString(16).padStart(2, '0');
    const R = hex(to255(r)), G = hex(to255(g)), B = hex(to255(b));
    if (a >= 1) return `#${R}${G}${B}`;
    return `rgba(${to255(r)}, ${to255(g)}, ${to255(b)}, ${a.toFixed(2)})`;
}

function normalizarSpec(figmaNodes) {
    const norm = {};
    for (const [chave, node] of Object.entries(figmaNodes)) {
        const props = extrairPropriedadesBasicas(node);
        if (props.fill) props.fillHex = rgbToHex(props.fill);
        if (props.stroke) props.strokeHex = rgbToHex(props.stroke);
        norm[chave] = props;
    }
    return norm;
}

async function baixarNodesViaREST({ fileId, nodeIds, token }) {
    const ids = Object.values(nodeIds).join(',');
    const url = `https://api.figma.com/v1/files/${fileId}/nodes?ids=${encodeURIComponent(ids)}`;
    const headers = { 'X-Figma-Token': token };
    const json = await req(url, headers);
    // Mapear por id → node
    const porId = json.nodes || {};
    // Reorganizar para chaves semânticas do manifesto (header, tabs, etc.)
    const mapeado = {};
    for (const [chave, id] of Object.entries(nodeIds)) {
        mapeado[chave] = porId[id]?.document || porId[id]?.node || porId[id];
    }
    return mapeado;
}

async function gerarSpec({ arquivoManifesto, saidaSpec, tokenEnv = 'FIGMA_TOKEN' }) {
    const manifest = lerJSON(arquivoManifesto);
    if (!manifest) throw new Error(`Manifesto não encontrado: ${arquivoManifesto}`);
    const pagina = manifest.pages[0];
    const fileId = pagina?.figma?.fileId || process.env.FIGMA_FILE_ID;
    const nodeIds = pagina?.figma?.nodeIds || {};
    const token = process.env[tokenEnv];

    if (!fileId || !Object.keys(nodeIds).length) {
        throw new Error('fileId/nodeIds ausentes no manifesto ou env');
    }
    if (!token) {
        console.warn('[figma-client] FIGMA_TOKEN ausente. Pulando fetch real e gerando spec parcial.');
        const spec = { origem: 'mock', fileId, nodeIds, geradoEm: new Date().toISOString(), props: {} };
        salvarJSON(saidaSpec, spec);
        return spec;
    }
    const nodes = await baixarNodesViaREST({ fileId, nodeIds, token });
    const props = normalizarSpec(nodes);
    const spec = { origem: 'figma-rest', fileId, nodeIds, geradoEm: new Date().toISOString(), props };
    salvarJSON(saidaSpec, spec);
    return spec;
}

module.exports = { gerarSpec };

if (require.main === module) {
    const arquivoManifesto = process.argv.find((a) => a.startsWith('--manifest='))?.split('=')[1] || path.resolve('validation/mcp-figma.manifest.json');
    const saidaSpec = process.argv.find((a) => a.startsWith('--out='))?.split('=')[1] || path.resolve('validation/figma.spec.generated.json');
    gerarSpec({ arquivoManifesto, saidaSpec }).then(() => {
        console.log('[figma-client] Spec gerado em', saidaSpec);
    }).catch((e) => { console.error(e.message); process.exit(1); });
}
