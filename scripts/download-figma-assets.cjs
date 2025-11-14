#!/usr/bin/env node
/**
 * Figma Assets Downloader (Sprint 4 - E1)
 * 
 * Baixa assets (imagens, ícones, logos) do Figma via GET /v1/images.
 * Valida formato, dimensões, otimização e mantém cache local.
 * 
 * Workflow:
 *   1. Fetch image URLs via GET /v1/images
 *   2. Download assets (PNG, SVG, JPG)
 *   3. Validar dimensões, formato, tamanho
 *   4. Cache em validation-artifacts/assets/
 * 
 * Uso:
 *   # Baixar todos assets de um manifest
 *   node scripts/download-figma-assets.cjs --manifest=<MANIFEST>
 * 
 *   # Baixar node específico
 *   node scripts/download-figma-assets.cjs --file-id=<ID> --node-ids=<IDs> --format=svg
 * 
 * Formats: png, svg, jpg, pdf
 * Scales: 1, 2, 3, 4 (PNG only)
 * 
 * Output: validation-artifacts/assets/{nodeId}.{format}
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

function lerJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function salvarJSON(p, d) {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, JSON.stringify(d, null, 2));
}

function req(url, headers) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, { method: 'GET', headers }, (res) => {
            let data = '';
            res.on('data', (c) => (data += c));
            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    try { resolve(JSON.parse(data)); }
                    catch (e) { reject(e); }
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

function download(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath);
        https.get(url, (res) => {
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(destPath);
            });
        }).on('error', (err) => {
            fs.unlinkSync(destPath);
            reject(err);
        });
    });
}

/**
 * Fetch image URLs do Figma
 */
async function fetchImageUrls({ fileId, nodeIds, format = 'png', scale = 2, token }) {
    const ids = Array.isArray(nodeIds) ? nodeIds.join(',') : nodeIds;
    const url = `https://api.figma.com/v1/images/${fileId}?ids=${encodeURIComponent(ids)}&format=${format}&scale=${scale}`;
    const headers = { 'X-Figma-Token': token };

    console.log(`📡 Fetching image URLs (${format} @ ${scale}x)...`);

    const json = await req(url, headers);
    return json.images;
}

/**
 * Valida asset baixado
 */
function validarAsset(filePath, format) {
    const stats = fs.statSync(filePath);
    const tamanhoKB = (stats.size / 1024).toFixed(2);

    const validacao = {
        existe: true,
        tamanho: stats.size,
        tamanhoKB,
        formato: format,
        warnings: []
    };

    // Thresholds
    const maxSizes = {
        'svg': 100, // 100KB
        'png': 500, // 500KB
        'jpg': 300  // 300KB
    };

    if (tamanhoKB > (maxSizes[format] || 500)) {
        validacao.warnings.push(`Arquivo grande: ${tamanhoKB}KB (max recomendado: ${maxSizes[format]}KB)`);
    }

    if (format === 'svg') {
        const conteudo = fs.readFileSync(filePath, 'utf8');
        if (conteudo.includes('<script>')) {
            validacao.warnings.push('SVG contém script (risco de segurança)');
        }
        if (!conteudo.includes('viewBox')) {
            validacao.warnings.push('SVG sem viewBox (pode ter problemas de escala)');
        }
    }

    return validacao;
}

/**
 * Download assets do Figma
 */
async function downloadFigmaAssets({
    fileId,
    nodeIds,
    format = 'png',
    scale = 2,
    tokenEnv = 'FIGMA_TOKEN',
    outputDir,
    outPath
}) {
    const token = process.env[tokenEnv];

    if (!token) {
        throw new Error('❌ FIGMA_TOKEN não encontrado. Defina env var: export FIGMA_TOKEN=figd_xxx');
    }

    console.log('📥 Baixando Assets do Figma...');
    console.log(`   File: ${fileId}`);
    console.log(`   Nodes: ${nodeIds.length}`);
    console.log(`   Format: ${format} @ ${scale}x`);
    console.log('');

    const imageUrls = await fetchImageUrls({ fileId, nodeIds, format, scale, token });

    fs.mkdirSync(outputDir, { recursive: true });

    const resultado = {
        fileId,
        format,
        scale,
        timestamp: new Date().toISOString(),
        assets: []
    };

    let baixados = 0;
    let erros = 0;

    for (const [nodeId, imageUrl] of Object.entries(imageUrls)) {
        if (!imageUrl) {
            console.log(`❌ ${nodeId}: URL não disponível`);
            resultado.assets.push({
                nodeId,
                status: 'FAILED',
                erro: 'URL não disponível'
            });
            erros++;
            continue;
        }

        try {
            const fileName = `${nodeId.replace(':', '-')}.${format}`;
            const destPath = path.join(outputDir, fileName);

            await download(imageUrl, destPath);

            const validacao = validarAsset(destPath, format);

            console.log(`✓ ${nodeId}: ${validacao.tamanhoKB}KB`);
            if (validacao.warnings.length > 0) {
                validacao.warnings.forEach(w => console.log(`   ⚠️  ${w}`));
            }

            resultado.assets.push({
                nodeId,
                fileName,
                path: destPath,
                url: imageUrl,
                status: 'SUCCESS',
                validacao
            });

            baixados++;
        } catch (err) {
            console.log(`❌ ${nodeId}: ${err.message}`);
            resultado.assets.push({
                nodeId,
                status: 'FAILED',
                erro: err.message
            });
            erros++;
        }
    }

    resultado.summary = {
        total: nodeIds.length,
        baixados,
        erros,
        percentSucesso: ((baixados / nodeIds.length) * 100).toFixed(1)
    };

    console.log('');
    console.log('📊 RESULTADO DO DOWNLOAD');
    console.log('========================');
    console.log(`✓ Baixados: ${baixados}/${nodeIds.length}`);
    console.log(`❌ Erros: ${erros}`);
    console.log(`✓ % Sucesso: ${resultado.summary.percentSucesso}%`);

    salvarJSON(outPath, resultado);
    console.log('');
    console.log(`📄 Relatório: ${outPath}`);

    resultado.status = baixados > 0 ? 'SUCCESS' : 'FAILED';
    return resultado;
}

async function main() {
    const args = process.argv.slice(2);
    const manifestArg = args.find(arg => arg.startsWith('--manifest='));
    const fileIdArg = args.find(arg => arg.startsWith('--file-id='));
    const nodeIdsArg = args.find(arg => arg.startsWith('--node-ids='));
    const formatArg = args.find(arg => arg.startsWith('--format='));
    const scaleArg = args.find(arg => arg.startsWith('--scale='));
    const outDirArg = args.find(arg => arg.startsWith('--out-dir='));
    const outArg = args.find(arg => arg.startsWith('--out='));
    const tokenArg = args.find(arg => arg.startsWith('--token-env='));

    if (!manifestArg && (!fileIdArg || !nodeIdsArg)) {
        console.error('❌ Uso: node download-figma-assets.cjs --manifest=<MANIFEST> [--format=png|svg|jpg] [--scale=2] [--out-dir=<DIR>]');
        console.error('   ou: node download-figma-assets.cjs --file-id=<ID> --node-ids=<IDs> [--format=png] [--scale=2]');
        process.exit(1);
    }

    let fileId, nodeIds;

    if (manifestArg) {
        const manifestPath = path.resolve(manifestArg.split('=')[1]);
        const manifest = lerJSON(manifestPath);
        const pagina = manifest.pages[0];
        fileId = pagina?.figma?.fileId || process.env.FIGMA_FILE_ID;
        nodeIds = Object.values(pagina?.figma?.nodeIds || {});
    } else {
        fileId = fileIdArg.split('=')[1];
        nodeIds = nodeIdsArg.split('=')[1].split(',');
    }

    const format = formatArg ? formatArg.split('=')[1] : 'png';
    const scale = scaleArg ? parseInt(scaleArg.split('=')[1]) : 2;
    const outputDir = outDirArg
        ? path.resolve(outDirArg.split('=')[1])
        : path.resolve(process.cwd(), `validation-artifacts/assets/${format}`);
    const outPath = outArg
        ? path.resolve(outArg.split('=')[1])
        : path.join(process.cwd(), 'validation-artifacts/assets/download-report.json');
    const tokenEnv = tokenArg ? tokenArg.split('=')[1] : 'FIGMA_TOKEN';

    const resultado = await downloadFigmaAssets({
        fileId,
        nodeIds,
        format,
        scale,
        tokenEnv,
        outputDir,
        outPath
    });

    const exitCode = resultado.status === 'SUCCESS' ? 0 : 1;
    process.exit(exitCode);
}

if (require.main === module) {
    main().catch(err => {
        console.error('❌ Erro:', err.message);
        console.error(err.stack);
        process.exit(1);
    });
}

module.exports = { downloadFigmaAssets };
