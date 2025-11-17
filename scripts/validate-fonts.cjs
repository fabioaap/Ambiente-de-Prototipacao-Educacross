#!/usr/bin/env node
/**
 * Font Loading Validator (Sprint 2 - E3)
 * 
 * Valida que fontes Google (Montserrat) estão carregadas corretamente
 * usando document.fonts API via Playwright.
 * 
 * Uso:
 *   node scripts/validate-fonts.cjs --url=http://localhost:8080/path --out=report.json
 * 
 * Output: Relatório de fontes carregadas/faltando
 */

const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Fontes esperadas (Montserrat do Google Fonts)
const FONTES_ESPERADAS = [
    { family: 'Montserrat', weight: '400', style: 'normal' },
    { family: 'Montserrat', weight: '500', style: 'normal' },
    { family: 'Montserrat', weight: '600', style: 'normal' },
    { family: 'Montserrat', weight: '700', style: 'normal' }
];

async function validarFontesCarregadas({ url, browserChannel = 'chromium', outPath }) {
    console.log('🔤 Validando fontes carregadas...');
    console.log(`   URL: ${url}`);
    console.log('');

    const browser = await chromium.launch({ channel: browserChannel || undefined });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Aguardar fontes carregarem
    try {
        await page.waitForLoadState('networkidle', { timeout: 5000 });
    } catch {
        // Timeout não é crítico, continuar validação
    }

    // Aguardar document.fonts.ready
    await page.evaluate(() => document.fonts.ready);

    console.log('✅ Página carregada, validando fontes...');
    console.log('');

    // Validar fontes via document.fonts API
    const resultadoFontes = await page.evaluate((fontesEsperadas) => {
        const resultados = {
            carregadas: [],
            faltando: [],
            fallback: [],
            total: fontesEsperadas.length
        };

        fontesEsperadas.forEach(({ family, weight, style }) => {
            const fontString = `${weight} ${style} 12px "${family}"`;
            const loaded = document.fonts.check(fontString);

            const info = {
                family,
                weight,
                style,
                fontString,
                loaded
            };

            if (loaded) {
                resultados.carregadas.push(info);
            } else {
                resultados.faltando.push(info);
            }
        });

        // Detectar fallback: verificar se elementos estão usando fonte substituída
        const elementos = document.querySelectorAll('body, h1, h2, h3, p, span, div');
        const fontesUsadas = new Set();

        elementos.forEach(el => {
            const computedFont = window.getComputedStyle(el).fontFamily;
            fontesUsadas.add(computedFont);
        });

        // Verificar se há fallback (Arial, sans-serif, system fonts)
        fontesUsadas.forEach(fontFamily => {
            if (fontFamily.toLowerCase().includes('arial') ||
                fontFamily.toLowerCase().includes('sans-serif') ||
                fontFamily.toLowerCase().includes('helvetica') ||
                fontFamily.toLowerCase().includes('system')) {

                // Verificar se NÃO é parte de uma font-family stack válida com Montserrat
                if (!fontFamily.toLowerCase().includes('montserrat')) {
                    resultados.fallback.push({
                        fontFamily,
                        alerta: 'Usando fonte de fallback sem Montserrat no stack'
                    });
                }
            }
        });

        return resultados;
    }, FONTES_ESPERADAS);

    await browser.close();

    // Processar resultados
    const resultado = {
        url,
        browser: browserChannel || 'chromium',
        timestamp: new Date().toISOString(),
        fontes: resultadoFontes,
        status: resultadoFontes.faltando.length === 0 ? 'PASSED' : 'FAILED',
        warnings: resultadoFontes.fallback.length,
        summary: {
            total: resultadoFontes.total,
            carregadas: resultadoFontes.carregadas.length,
            faltando: resultadoFontes.faltando.length,
            fallback: resultadoFontes.fallback.length
        }
    };

    // Console output
    console.log('📊 RESULTADO DA VALIDAÇÃO DE FONTES');
    console.log('===================================');
    console.log(`✅ Carregadas: ${resultado.summary.carregadas}/${resultado.summary.total}`);
    console.log(`❌ Faltando: ${resultado.summary.faltando}/${resultado.summary.total}`);
    console.log(`⚠️  Fallback: ${resultado.summary.fallback}`);
    console.log('');

    if (resultadoFontes.carregadas.length > 0) {
        console.log('✅ FONTES CARREGADAS:');
        resultadoFontes.carregadas.forEach(({ family, weight, style }) => {
            console.log(`   - ${family} ${weight} (${style})`);
        });
        console.log('');
    }

    if (resultadoFontes.faltando.length > 0) {
        console.log('❌ FONTES FALTANDO:');
        resultadoFontes.faltando.forEach(({ family, weight, style, fontString }) => {
            console.log(`   - ${family} ${weight} (${style})`);
            console.log(`     Font string: ${fontString}`);
        });
        console.log('');
    }

    if (resultadoFontes.fallback.length > 0) {
        console.log('⚠️  FONTES DE FALLBACK DETECTADAS:');
        resultadoFontes.fallback.forEach(({ fontFamily, alerta }) => {
            console.log(`   - ${fontFamily}`);
            console.log(`     ${alerta}`);
        });
        console.log('');
    }

    // Status final
    if (resultado.status === 'PASSED') {
        console.log('✅ VALIDAÇÃO PASSOU! Todas as fontes carregadas corretamente.');
    } else {
        console.log('❌ VALIDAÇÃO FALHOU! Fontes faltando ou usando fallback.');
    }

    // Salvar relatório
    if (outPath) {
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, JSON.stringify(resultado, null, 2));
        console.log('');
        console.log(`📄 Relatório salvo: ${outPath}`);
    }

    return resultado;
}

async function main() {
    const args = process.argv.slice(2);
    const urlArg = args.find(arg => arg.startsWith('--url='));
    const outArg = args.find(arg => arg.startsWith('--out='));
    const browserArg = args.find(arg => arg.startsWith('--browser='));

    if (!urlArg) {
        console.error('❌ Uso: node validate-fonts.cjs --url=<URL> [--out=<JSON>] [--browser=chromium|msedge]');
        process.exit(1);
    }

    const url = urlArg.split('=')[1];
    const outPath = outArg ? path.resolve(outArg.split('=')[1]) : path.join(process.cwd(), 'font-validation-report.json');
    const browserChannel = browserArg ? browserArg.split('=')[1] : 'chromium';

    const resultado = await validarFontesCarregadas({ url, browserChannel, outPath });

    // Exit code: 0 se passou, 1 se falhou
    const exitCode = resultado.status === 'PASSED' ? 0 : 1;
    process.exit(exitCode);
}

if (require.main === module) {
    main().catch(err => {
        console.error('❌ Erro:', err.message);
        console.error(err.stack);
        process.exit(1);
    });
}

module.exports = { validarFontesCarregadas, FONTES_ESPERADAS };
