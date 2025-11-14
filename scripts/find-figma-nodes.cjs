#!/usr/bin/env node
/**
 * Figma Node Finder (Sprint 2 - C4)
 * 
 * Busca recursivamente nodes no Figma por nome (Badge/Primary, Badge/Pink, etc.)
 * e auto-atualiza manifest.json com nodeIds descobertos.
 * 
 * Uso:
 *   node scripts/find-figma-nodes.cjs --manifest=<MANIFEST> --search="Badge/" --update
 *   Requer: FIGMA_TOKEN env var
 * 
 * Exemplos:
 *   # Buscar todos badges
 *   node scripts/find-figma-nodes.cjs --manifest=validation/mcp-figma.manifest.json --search="Badge/"
 * 
 *   # Buscar e auto-atualizar manifest
 *   node scripts/find-figma-nodes.cjs --manifest=validation/mcp-figma.manifest.json --search="Badge/" --update
 * 
 * Output: Lista de nodeIds encontrados + manifest atualizado (se --update)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

function lerJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function salvarJSON(p, d) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(d, null, 2)); }

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

/**
 * Busca recursivamente nodes por nome (regex ou substring)
 */
function buscarNodesRecursivo(node, searchPattern, resultados = []) {
    if (!node) return resultados;

    // Check nome do node atual
    const regex = typeof searchPattern === 'string' ? new RegExp(searchPattern, 'i') : searchPattern;

    if (node.name && regex.test(node.name)) {
        resultados.push({
            id: node.id,
            name: node.name,
            type: node.type,
            path: node.path || node.name
        });
    }

    // Recursão em children
    if (Array.isArray(node.children)) {
        for (const child of node.children) {
            buscarNodesRecursivo(child, searchPattern, resultados);
        }
    }

    return resultados;
}

/**
 * Baixa file completo via Figma REST API
 */
async function baixarFileFigma({ fileId, token }) {
    const url = `https://api.figma.com/v1/files/${fileId}`;
    const headers = { 'X-Figma-Token': token };

    console.log(`📡 Fetching Figma file: ${fileId}...`);

    const json = await req(url, headers);
    return json.document;
}

/**
 * Busca nodes no Figma e opcionalmente atualiza manifest
 */
async function buscarEAtualizarManifest({ manifestPath, searchPattern, update = false, tokenEnv = 'FIGMA_TOKEN' }) {
    const manifest = lerJSON(manifestPath);
    const pagina = manifest.pages[0];
    const fileId = pagina?.figma?.fileId || process.env.FIGMA_FILE_ID;
    const token = process.env[tokenEnv];

    if (!fileId) {
        throw new Error('❌ fileId ausente no manifesto (pagina.figma.fileId)');
    }

    if (!token) {
        throw new Error('❌ FIGMA_TOKEN não encontrado. Defina env var: export FIGMA_TOKEN=figd_xxx');
    }

    console.log('🔍 Buscando nodes no Figma...');
    console.log(`   File: ${fileId}`);
    console.log(`   Pattern: ${searchPattern}`);
    console.log('');

    const documento = await baixarFileFigma({ fileId, token });
    const resultados = buscarNodesRecursivo(documento, searchPattern);

    console.log('📊 RESULTADOS DA BUSCA');
    console.log('=====================');
    console.log(`✓ Encontrados: ${resultados.length} nodes`);
    console.log('');

    if (resultados.length === 0) {
        console.log('⚠️  Nenhum node encontrado com o pattern fornecido.');
        return { resultados, manifestAtualizado: false };
    }

    // Mostrar resultados
    resultados.forEach((node, i) => {
        console.log(`${i + 1}. ${node.name}`);
        console.log(`   ID: ${node.id}`);
        console.log(`   Type: ${node.type}`);
        console.log('');
    });

    // Atualizar manifest se --update
    if (update) {
        console.log('📝 Atualizando manifest...');

        const nodeIdsAtuais = pagina.figma.nodeIds || {};
        let adicionados = 0;

        for (const node of resultados) {
            // Gerar chave semântica (ex: Badge/Primary → badge-primary)
            const chave = node.name
                .toLowerCase()
                .replace(/\//g, '-')
                .replace(/\s+/g, '-')
                .replace(/[^\w-]/g, '');

            // Adicionar se ainda não existe
            if (!nodeIdsAtuais[chave]) {
                nodeIdsAtuais[chave] = node.id;
                adicionados++;
                console.log(`   + ${chave}: ${node.id}`);
            }
        }

        if (adicionados > 0) {
            pagina.figma.nodeIds = nodeIdsAtuais;
            salvarJSON(manifestPath, manifest);
            console.log('');
            console.log(`✅ Manifest atualizado: +${adicionados} nodeIds`);
            console.log(`📄 Salvo em: ${manifestPath}`);
        } else {
            console.log('');
            console.log('⏭️  Nenhum nodeId novo (todos já existiam no manifest).');
        }

        return { resultados, manifestAtualizado: adicionados > 0, adicionados };
    } else {
        console.log('💡 Use --update para auto-atualizar o manifest com esses nodeIds.');
        return { resultados, manifestAtualizado: false };
    }
}

async function main() {
    const args = process.argv.slice(2);
    const manifestArg = args.find(arg => arg.startsWith('--manifest='));
    const searchArg = args.find(arg => arg.startsWith('--search='));
    const updateFlag = args.includes('--update');
    const tokenArg = args.find(arg => arg.startsWith('--token-env='));

    if (!manifestArg || !searchArg) {
        console.error('❌ Uso: node find-figma-nodes.cjs --manifest=<MANIFEST> --search=<PATTERN> [--update] [--token-env=FIGMA_TOKEN]');
        console.error('');
        console.error('Exemplos:');
        console.error('  node find-figma-nodes.cjs --manifest=validation/mcp-figma.manifest.json --search="Badge/"');
        console.error('  node find-figma-nodes.cjs --manifest=validation/mcp-figma.manifest.json --search="Badge/" --update');
        process.exit(1);
    }

    const manifestPath = path.resolve(manifestArg.split('=')[1]);
    const searchPattern = searchArg.split('=')[1].replace(/^["']|["']$/g, ''); // Remove quotes
    const tokenEnv = tokenArg ? tokenArg.split('=')[1] : 'FIGMA_TOKEN';

    const resultado = await buscarEAtualizarManifest({
        manifestPath,
        searchPattern,
        update: updateFlag,
        tokenEnv
    });

    const exitCode = resultado.resultados.length > 0 ? 0 : 1;
    process.exit(exitCode);
}

if (require.main === module) {
    main().catch(err => {
        console.error('❌ Erro:', err.message);
        console.error(err.stack);
        process.exit(1);
    });
}

module.exports = { buscarNodesRecursivo, buscarEAtualizarManifest };
