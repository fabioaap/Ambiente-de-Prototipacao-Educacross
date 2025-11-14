#!/usr/bin/env node
/**
 * Design Tokens Sync (Sprint 4 - I2)
 * 
 * Sincroniza design tokens do Figma automaticamente usando REST API.
 * Detecta mudanças e alerta quando tokens divergem.
 * 
 * Workflow:
 *   1. Fetch variables do Figma via GET /v1/files/{fileId}/variables/local
 *   2. Comparar com tokens locais (packages/tokens/tokens.json)
 *   3. Gerar diff report
 *   4. Opcionalmente auto-update tokens locais
 * 
 * Uso:
 *   # Verificar divergências (dry-run)
 *   node scripts/sync-design-tokens.cjs --file-id=<ID>
 * 
 *   # Auto-sync (atualizar tokens.json)
 *   node scripts/sync-design-tokens.cjs --file-id=<ID> --update
 * 
 *   # Alert mode (CI/CD)
 *   node scripts/sync-design-tokens.cjs --file-id=<ID> --alert
 * 
 * Output: validation-artifacts/tokens/sync-report.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

function lerJSON(p) {
    try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
    catch { return null; }
}

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

/**
 * Converte variável do Figma para formato DTCG (Design Tokens Community Group)
 */
function converterParaDTCG(figmaVar) {
    const token = {
        $value: null,
        $type: null,
        $description: figmaVar.description || ''
    };

    // Mapear tipos do Figma para DTCG
    const tipoMap = {
        'COLOR': 'color',
        'FLOAT': 'number',
        'STRING': 'string',
        'BOOLEAN': 'boolean'
    };

    token.$type = tipoMap[figmaVar.resolvedType] || 'string';

    // Converter valor
    if (figmaVar.resolvedType === 'COLOR') {
        const { r, g, b, a } = figmaVar.valuesByMode[Object.keys(figmaVar.valuesByMode)[0]];
        const toHex = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
        token.$value = a < 1
            ? `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a.toFixed(2)})`
            : `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    } else {
        token.$value = figmaVar.valuesByMode[Object.keys(figmaVar.valuesByMode)[0]];
    }

    return token;
}

/**
 * Fetch design tokens do Figma
 */
async function fetchFigmaTokens({ fileId, token }) {
    const url = `https://api.figma.com/v1/files/${fileId}/variables/local`;
    const headers = { 'X-Figma-Token': token };

    console.log('📡 Fetching design tokens do Figma...');
    console.log(`   File: ${fileId}`);

    const json = await req(url, headers);

    const collections = json.meta?.variableCollections || {};
    const variables = json.meta?.variables || {};

    const tokens = {};

    for (const [varId, varData] of Object.entries(variables)) {
        // Usar nome como chave (ex: "color/primary" → color.primary)
        const chave = varData.name.toLowerCase().replace(/\//g, '.');
        tokens[chave] = converterParaDTCG(varData);
    }

    return tokens;
}

/**
 * Compara tokens locais vs Figma
 */
function compararTokens(tokensLocais, tokensFigma) {
    const diffs = {
        adicionados: [],
        removidos: [],
        modificados: [],
        iguais: []
    };

    const chavesLocais = Object.keys(tokensLocais);
    const chavesFigma = Object.keys(tokensFigma);

    // Tokens novos no Figma
    for (const chave of chavesFigma) {
        if (!tokensLocais[chave]) {
            diffs.adicionados.push({
                chave,
                valorFigma: tokensFigma[chave].$value
            });
        }
    }

    // Tokens removidos do Figma
    for (const chave of chavesLocais) {
        if (!tokensFigma[chave]) {
            diffs.removidos.push({
                chave,
                valorLocal: tokensLocais[chave].$value
            });
        }
    }

    // Tokens modificados
    for (const chave of chavesLocais) {
        if (tokensFigma[chave]) {
            const valorLocal = tokensLocais[chave].$value;
            const valorFigma = tokensFigma[chave].$value;

            if (valorLocal !== valorFigma) {
                diffs.modificados.push({
                    chave,
                    valorLocal,
                    valorFigma
                });
            } else {
                diffs.iguais.push(chave);
            }
        }
    }

    return diffs;
}

/**
 * Sincroniza design tokens
 */
async function syncDesignTokens({ fileId, tokensPath, update = false, alert = false, tokenEnv = 'FIGMA_TOKEN', outPath }) {
    const token = process.env[tokenEnv];

    if (!token) {
        throw new Error('❌ FIGMA_TOKEN não encontrado. Defina env var: export FIGMA_TOKEN=figd_xxx');
    }

    console.log('🎨 Sincronizando Design Tokens...');
    console.log('');

    const tokensLocais = lerJSON(tokensPath) || {};
    const tokensFigma = await fetchFigmaTokens({ fileId, token });

    console.log(`✓ Tokens locais: ${Object.keys(tokensLocais).length}`);
    console.log(`✓ Tokens Figma: ${Object.keys(tokensFigma).length}`);
    console.log('');

    const diffs = compararTokens(tokensLocais, tokensFigma);

    const resultado = {
        fileId,
        timestamp: new Date().toISOString(),
        tokensPath,
        diffs,
        summary: {
            adicionados: diffs.adicionados.length,
            removidos: diffs.removidos.length,
            modificados: diffs.modificados.length,
            iguais: diffs.iguais.length,
            total: Object.keys(tokensFigma).length
        }
    };

    console.log('📊 RESULTADO DA COMPARAÇÃO');
    console.log('==========================');
    console.log(`➕ Adicionados: ${diffs.adicionados.length}`);
    console.log(`➖ Removidos: ${diffs.removidos.length}`);
    console.log(`📝 Modificados: ${diffs.modificados.length}`);
    console.log(`✓ Iguais: ${diffs.iguais.length}`);
    console.log('');

    if (diffs.modificados.length > 0) {
        console.log('📝 TOKENS MODIFICADOS:');
        diffs.modificados.forEach(diff => {
            console.log(`   ${diff.chave}:`);
            console.log(`      Local:  ${diff.valorLocal}`);
            console.log(`      Figma:  ${diff.valorFigma}`);
        });
        console.log('');
    }

    if (diffs.adicionados.length > 0) {
        console.log('➕ TOKENS NOVOS NO FIGMA:');
        diffs.adicionados.forEach(diff => {
            console.log(`   ${diff.chave}: ${diff.valorFigma}`);
        });
        console.log('');
    }

    const temDivergencias = diffs.adicionados.length > 0 ||
        diffs.removidos.length > 0 ||
        diffs.modificados.length > 0;

    if (temDivergencias) {
        resultado.status = 'DIVERGENT';

        if (update) {
            // Auto-update tokens.json
            salvarJSON(tokensPath, tokensFigma);
            console.log('✅ TOKENS ATUALIZADOS!');
            console.log(`   Arquivo: ${tokensPath}`);
            resultado.updated = true;
        } else if (alert) {
            // Alert mode (CI/CD)
            console.log('🚨 ALERTA: Tokens divergentes!');
            console.log('   Execute com --update para sincronizar');
            resultado.status = 'ALERT';
        } else {
            console.log('⚠️ TOKENS DIVERGENTES!');
            console.log('   Execute com --update para sincronizar');
        }
    } else {
        resultado.status = 'SYNCED';
        console.log('✅ TOKENS SINCRONIZADOS! Nenhuma divergência.');
    }

    salvarJSON(outPath, resultado);
    console.log('');
    console.log(`📄 Relatório: ${outPath}`);

    return resultado;
}

async function main() {
    const args = process.argv.slice(2);
    const fileIdArg = args.find(arg => arg.startsWith('--file-id='));
    const tokensArg = args.find(arg => arg.startsWith('--tokens='));
    const updateFlag = args.includes('--update');
    const alertFlag = args.includes('--alert');
    const outArg = args.find(arg => arg.startsWith('--out='));
    const tokenArg = args.find(arg => arg.startsWith('--token-env='));

    if (!fileIdArg) {
        console.error('❌ Uso: node sync-design-tokens.cjs --file-id=<ID> [--tokens=<PATH>] [--update] [--alert] [--out=<JSON>] [--token-env=FIGMA_TOKEN]');
        console.error('');
        console.error('Flags:');
        console.error('  --update  - Auto-atualizar tokens.json');
        console.error('  --alert   - Mode CI/CD (exit code 1 se divergente)');
        process.exit(1);
    }

    const fileId = fileIdArg.split('=')[1];
    const tokensPath = tokensArg
        ? path.resolve(tokensArg.split('=')[1])
        : path.resolve(process.cwd(), 'packages/tokens/tokens.json');
    const outPath = outArg
        ? path.resolve(outArg.split('=')[1])
        : path.join(process.cwd(), 'validation-artifacts/tokens/sync-report.json');
    const tokenEnv = tokenArg ? tokenArg.split('=')[1] : 'FIGMA_TOKEN';

    const resultado = await syncDesignTokens({
        fileId,
        tokensPath,
        update: updateFlag,
        alert: alertFlag,
        tokenEnv,
        outPath
    });

    const exitCode = (alertFlag && resultado.status === 'DIVERGENT') ? 1 : 0;
    process.exit(exitCode);
}

if (require.main === module) {
    main().catch(err => {
        console.error('❌ Erro:', err.message);
        console.error(err.stack);
        process.exit(1);
    });
}

module.exports = { syncDesignTokens, fetchFigmaTokens };
