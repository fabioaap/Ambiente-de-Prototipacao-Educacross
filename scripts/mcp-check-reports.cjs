#!/usr/bin/env node
/** Gate dos relatórios MCP: falha se houver diffs ou erros */
const fs = require('fs');
const path = require('path');

const pasta = path.resolve('validation-artifacts/mcp');
if (!fs.existsSync(pasta)) {
    console.error('[mcp-gate] Pasta não encontrada:', pasta);
    process.exit(1);
}

const arquivos = fs.readdirSync(pasta).filter(f => f.startsWith('structural-') && f.endsWith('.json'));
if (!arquivos.length) {
    console.error('[mcp-gate] Nenhum relatório structural-* encontrado.');
    process.exit(1);
}

let falhas = 0;
let resumo = [];
for (const nome of arquivos) {
    const p = path.join(pasta, nome);
    const json = JSON.parse(fs.readFileSync(p, 'utf8'));
    const problemas = [];
    for (const item of json.itens || []) {
        if (item.erro) {
            problemas.push({ chave: item.chave, tipo: item.erro });
            continue;
        }
        const diffs = item.diffs || {};
        const chaves = Object.keys(diffs);
        if (chaves.length) {
            problemas.push({ chave: item.chave, diffs: chaves });
        }
    }
    if (problemas.length) {
        falhas++;
        resumo.push({ arquivo: nome, problemas });
    }
}

if (falhas) {
    console.error('[mcp-gate] Diferenças encontradas em', falhas, 'relatório(s):');
    console.error(JSON.stringify(resumo, null, 2));
    process.exit(1);
}

console.log('[mcp-gate] OK: nenhum diff/erro encontrado nos relatórios.');
