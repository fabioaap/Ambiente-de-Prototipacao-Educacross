#!/usr/bin/env node
/**
 * Auto-layout Extractor (Sprint 2 - D1)
 * 
 * Extrai propriedades de auto-layout do Figma e mapeia para CSS flexbox:
 * - layoutMode (HORIZONTAL → row, VERTICAL → column)
 * - itemSpacing → gap
 * - paddingTop/Right/Bottom/Left → padding-*
 * - primaryAxisAlignItems → justify-content
 * - counterAxisAlignItems → align-items
 * 
 * Uso:
 *   node scripts/extract-autolayout.cjs --manifest=<MANIFEST> --out=<JSON>
 *   Requer: FIGMA_TOKEN env var
 * 
 * Output: autolayout-spec.json com mapeamento Figma → CSS
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
 * Mapeia layoutMode do Figma para flex-direction
 */
function mapearFlexDirection(layoutMode) {
    const mapa = {
        'HORIZONTAL': 'row',
        'VERTICAL': 'column'
    };
    return mapa[layoutMode] || 'row';
}

/**
 * Mapeia primaryAxisAlignItems para justify-content
 */
function mapearJustifyContent(alignment) {
    const mapa = {
        'MIN': 'flex-start',
        'CENTER': 'center',
        'MAX': 'flex-end',
        'SPACE_BETWEEN': 'space-between'
    };
    return mapa[alignment] || 'flex-start';
}

/**
 * Mapeia counterAxisAlignItems para align-items
 */
function mapearAlignItems(alignment) {
    const mapa = {
        'MIN': 'flex-start',
        'CENTER': 'center',
        'MAX': 'flex-end'
    };
    return mapa[alignment] || 'flex-start';
}

/**
 * Extrai auto-layout de um node do Figma
 */
function extrairAutoLayout(node) {
    if (!node) return null;

    const autoLayout = {
        figma: {},
        css: {}
    };

    // Propriedades Figma (raw)
    if (node.layoutMode) {
        autoLayout.figma.layoutMode = node.layoutMode;
        autoLayout.css['flex-direction'] = mapearFlexDirection(node.layoutMode);
    }

    if (typeof node.itemSpacing === 'number') {
        autoLayout.figma.itemSpacing = node.itemSpacing;
        autoLayout.css.gap = `${node.itemSpacing}px`;
    }

    if (node.paddingTop !== undefined) {
        autoLayout.figma.paddingTop = node.paddingTop;
        autoLayout.css['padding-top'] = `${node.paddingTop}px`;
    }

    if (node.paddingRight !== undefined) {
        autoLayout.figma.paddingRight = node.paddingRight;
        autoLayout.css['padding-right'] = `${node.paddingRight}px`;
    }

    if (node.paddingBottom !== undefined) {
        autoLayout.figma.paddingBottom = node.paddingBottom;
        autoLayout.css['padding-bottom'] = `${node.paddingBottom}px`;
    }

    if (node.paddingLeft !== undefined) {
        autoLayout.figma.paddingLeft = node.paddingLeft;
        autoLayout.css['padding-left'] = `${node.paddingLeft}px`;
    }

    if (node.primaryAxisAlignItems) {
        autoLayout.figma.primaryAxisAlignItems = node.primaryAxisAlignItems;
        autoLayout.css['justify-content'] = mapearJustifyContent(node.primaryAxisAlignItems);
    }

    if (node.counterAxisAlignItems) {
        autoLayout.figma.counterAxisAlignItems = node.counterAxisAlignItems;
        autoLayout.css['align-items'] = mapearAlignItems(node.counterAxisAlignItems);
    }

    // Wrap behavior
    if (node.layoutWrap) {
        autoLayout.figma.layoutWrap = node.layoutWrap;
        autoLayout.css['flex-wrap'] = node.layoutWrap === 'WRAP' ? 'wrap' : 'nowrap';
    }

    // Size constraints
    if (node.layoutSizingHorizontal) {
        autoLayout.figma.layoutSizingHorizontal = node.layoutSizingHorizontal;
    }

    if (node.layoutSizingVertical) {
        autoLayout.figma.layoutSizingVertical = node.layoutSizingVertical;
    }

    // Children properties (for flex-grow)
    if (node.layoutGrow !== undefined) {
        autoLayout.figma.layoutGrow = node.layoutGrow;
        autoLayout.css['flex-grow'] = node.layoutGrow;
    }

    return autoLayout;
}

/**
 * Baixa nodes via Figma REST API
 */
async function baixarNodesViaREST({ fileId, nodeIds, token }) {
    const ids = Object.values(nodeIds).join(',');
    const url = `https://api.figma.com/v1/files/${fileId}/nodes?ids=${encodeURIComponent(ids)}`;
    const headers = { 'X-Figma-Token': token };

    console.log(`📡 Fetching Figma nodes: ${Object.keys(nodeIds).length} nodes...`);

    const json = await req(url, headers);
    const porId = json.nodes || {};

    // Reorganizar para chaves semânticas (header, tabs, etc.)
    const mapeado = {};
    for (const [chave, id] of Object.entries(nodeIds)) {
        const nodeData = porId[id];
        if (!nodeData) {
            console.warn(`⚠️  Node não encontrado: ${chave} (${id})`);
            continue;
        }
        mapeado[chave] = nodeData.document || nodeData.node || nodeData;
    }

    return mapeado;
}

/**
 * Processa manifest e extrai auto-layout de todos nodes
 */
async function extrairAutoLayoutDeManifest({ manifestPath, tokenEnv = 'FIGMA_TOKEN', outPath }) {
    const manifest = lerJSON(manifestPath);
    const pagina = manifest.pages[0];
    const fileId = pagina?.figma?.fileId || process.env.FIGMA_FILE_ID;
    const nodeIds = pagina?.figma?.nodeIds || {};
    const token = process.env[tokenEnv];

    if (!fileId || !Object.keys(nodeIds).length) {
        throw new Error('❌ fileId ou nodeIds ausentes no manifesto');
    }

    if (!token) {
        throw new Error('❌ FIGMA_TOKEN não encontrado. Defina env var: export FIGMA_TOKEN=figd_xxx');
    }

    console.log('🎨 Extraindo Auto-layout do Figma...');
    console.log(`   File: ${fileId}`);
    console.log(`   Nodes: ${Object.keys(nodeIds).length}`);
    console.log('');

    const nodes = await baixarNodesViaREST({ fileId, nodeIds, token });

    const resultado = {
        fileId,
        timestamp: new Date().toISOString(),
        nodes: {}
    };

    let comAutoLayout = 0;
    let semAutoLayout = 0;

    for (const [chave, node] of Object.entries(nodes)) {
        const autoLayout = extrairAutoLayout(node);

        if (autoLayout && Object.keys(autoLayout.figma).length > 0) {
            resultado.nodes[chave] = {
                id: node.id,
                name: node.name,
                type: node.type,
                autoLayout
            };
            comAutoLayout++;

            console.log(`✓ ${chave}:`);
            console.log(`  - layoutMode: ${autoLayout.figma.layoutMode} → flex-direction: ${autoLayout.css['flex-direction']}`);
            console.log(`  - itemSpacing: ${autoLayout.figma.itemSpacing}px → gap: ${autoLayout.css.gap}`);

            if (autoLayout.figma.primaryAxisAlignItems) {
                console.log(`  - primaryAxis: ${autoLayout.figma.primaryAxisAlignItems} → justify-content: ${autoLayout.css['justify-content']}`);
            }

            if (autoLayout.figma.counterAxisAlignItems) {
                console.log(`  - counterAxis: ${autoLayout.figma.counterAxisAlignItems} → align-items: ${autoLayout.css['align-items']}`);
            }
        } else {
            resultado.nodes[chave] = {
                id: node.id,
                name: node.name,
                type: node.type,
                autoLayout: null,
                observacao: 'Node sem auto-layout'
            };
            semAutoLayout++;
            console.log(`⏭️  ${chave}: sem auto-layout`);
        }
    }

    console.log('');
    console.log('📊 RESULTADO EXTRAÇÃO');
    console.log('====================');
    console.log(`✓ Com auto-layout: ${comAutoLayout}`);
    console.log(`⏭️  Sem auto-layout: ${semAutoLayout}`);
    console.log(`✓ Total processado: ${comAutoLayout + semAutoLayout}`);

    salvarJSON(outPath, resultado);
    console.log('');
    console.log(`📄 Spec salva em: ${outPath}`);

    return resultado;
}

async function main() {
    const args = process.argv.slice(2);
    const manifestArg = args.find(arg => arg.startsWith('--manifest='));
    const outArg = args.find(arg => arg.startsWith('--out='));
    const tokenArg = args.find(arg => arg.startsWith('--token-env='));

    if (!manifestArg) {
        console.error('❌ Uso: node extract-autolayout.cjs --manifest=<MANIFEST> [--out=<JSON>] [--token-env=FIGMA_TOKEN]');
        process.exit(1);
    }

    const manifestPath = path.resolve(manifestArg.split('=')[1]);
    const outPath = outArg ? path.resolve(outArg.split('=')[1]) : path.join(process.cwd(), 'autolayout-spec.json');
    const tokenEnv = tokenArg ? tokenArg.split('=')[1] : 'FIGMA_TOKEN';

    await extrairAutoLayoutDeManifest({ manifestPath, tokenEnv, outPath });
}

if (require.main === module) {
    main().catch(err => {
        console.error('❌ Erro:', err.message);
        console.error(err.stack);
        process.exit(1);
    });
}

module.exports = { extrairAutoLayout, extrairAutoLayoutDeManifest };
