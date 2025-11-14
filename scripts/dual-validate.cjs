#!/usr/bin/env node
/**
 * Dual Validator (Sprint 3 I1)
 * 
 * Executa ambos validadores em paralelo:
 * - MCP (Playwright): Valida estilos computados no browser (56 propriedades)
 * - Pixel-perfect (CSS parser): Valida CSS estático contra tokens (61 propriedades)
 * 
 * Uso:
 *   npm run validate:dual
 * 
 * Output: Relatório consolidado + status de ambos
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function executar(comando, args) {
    return new Promise((resolve, reject) => {
        const proc = spawn(comando, args, { shell: true, stdio: 'inherit' });
        proc.on('close', (code) => {
            if (code === 0) {
                resolve({ success: true, code });
            } else {
                resolve({ success: false, code });
            }
        });
        proc.on('error', (err) => {
            reject(err);
        });
    });
}

async function main() {
    console.log('🔄 Dual Validator (Sprint 3 I1)');
    console.log('================================\n');

    const resultados = {
        timestamp: new Date().toISOString(),
        validators: {},
        consolidado: {
            total: 0,
            passed: 0,
            failed: 0
        }
    };

    // 1. MCP Validator (Playwright - estilos computados)
    console.log('🎭 [1/2] MCP Validator (Playwright + Chromium/Edge)...\n');
    const mcpResult = await executar('npm', ['run', 'mcp:validate']);

    resultados.validators.mcp = {
        nome: 'MCP Validator',
        tipo: 'computed-styles',
        ferramentas: ['Playwright', 'Chromium', 'Edge'],
        propriedades: 56,
        dpr: [1, 2],
        success: mcpResult.success,
        exitCode: mcpResult.code
    };

    console.log('\n');

    // 2. Pixel-Perfect Validator (CSS parser estático)
    console.log('📐 [2/2] Pixel-Perfect Validator (CSS parser)...\n');
    const pixelResult = await executar('npm', ['run', 'pixel:validate']);

    resultados.validators.pixelPerfect = {
        nome: 'Pixel-Perfect Validator',
        tipo: 'static-css',
        ferramentas: ['CSS parser', 'Token matcher'],
        propriedades: 61,
        dpr: [1],
        success: pixelResult.success,
        exitCode: pixelResult.code
    };

    console.log('\n');

    // Gate CI/CD
    console.log('🚪 [3/3] CI Gate Check...\n');
    const gateResult = await executar('npm', ['run', 'mcp:gate']);

    resultados.validators.gate = {
        nome: 'MCP Gate',
        tipo: 'ci-cd-gate',
        success: gateResult.success,
        exitCode: gateResult.code
    };

    // Consolidar resultados
    resultados.consolidado.total = 3;
    resultados.consolidado.passed = [mcpResult, pixelResult, gateResult].filter(r => r.success).length;
    resultados.consolidado.failed = resultados.consolidado.total - resultados.consolidado.passed;

    // Salvar relatório consolidado
    const reportPath = path.join(process.cwd(), 'dual-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(resultados, null, 2), 'utf-8');

    console.log('\n');
    console.log('═════════════════════════════════════════════════');
    console.log('📊 RESULTADO CONSOLIDADO (Dual Validator)');
    console.log('═════════════════════════════════════════════════');
    console.log(`✅ Passou: ${resultados.consolidado.passed}/${resultados.consolidado.total}`);
    console.log(`❌ Falhou: ${resultados.consolidado.failed}/${resultados.consolidado.total}`);
    console.log('');
    console.log('Detalhes:');
    console.log(`  MCP Validator:         ${mcpResult.success ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`  Pixel-Perfect:         ${pixelResult.success ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`  MCP Gate (CI):         ${gateResult.success ? '✅ PASSED' : '❌ FAILED'}`);
    console.log('');
    console.log(`📄 Relatório: ${reportPath}`);
    console.log('═════════════════════════════════════════════════\n');

    // Exit code: falha se qualquer validator falhar
    const exitCode = resultados.consolidado.failed > 0 ? 1 : 0;

    if (exitCode === 0) {
        console.log('✅ DUAL VALIDATION PASSED! Ambos validadores OK.\n');
    } else {
        console.log('❌ DUAL VALIDATION FAILED! Verifique os logs acima.\n');
    }

    process.exit(exitCode);
}

if (require.main === module) {
    main().catch(err => {
        console.error('❌ Erro no Dual Validator:', err.message);
        console.error(err.stack);
        process.exit(1);
    });
}

module.exports = { executar };
