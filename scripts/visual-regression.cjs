#!/usr/bin/env node
/**
 * Visual Regression Validator (Sprint 4 - G1)
 * 
 * Compara screenshots Playwright com baselines usando pixelmatch
 * para detectar diffs visuais pixel-by-pixel.
 * 
 * Workflow:
 *   1. Capturar baseline: --mode=baseline
 *   2. Comparar com baseline: --mode=compare (default)
 *   3. Atualizar baseline: --mode=update
 * 
 * Uso:
 *   # Primeira execução (criar baseline)
 *   node scripts/visual-regression.cjs --manifest=<MANIFEST> --mode=baseline
 * 
 *   # Validar contra baseline
 *   node scripts/visual-regression.cjs --manifest=<MANIFEST>
 * 
 *   # Atualizar baseline após mudanças esperadas
 *   node scripts/visual-regression.cjs --manifest=<MANIFEST> --mode=update
 * 
 * Output:
 *   - Baselines: validation-artifacts/screenshots/baseline/*.png
 *   - Atual: validation-artifacts/screenshots/current/*.png
 *   - Diff: validation-artifacts/screenshots/diff/*.png
 *   - Report: validation-artifacts/screenshots/visual-regression-report.json
 */

const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const pixelmatch = require('pixelmatch').default;
const { PNG } = require('pngjs');

function lerJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function salvarJSON(p, d) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(d, null, 2)); }

/**
 * Compara duas imagens PNG usando pixelmatch
 */
function compararImagens(baselinePath, currentPath, diffPath, threshold = 0.1) {
    const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
    const current = PNG.sync.read(fs.readFileSync(currentPath));

    const { width, height } = baseline;
    const diff = new PNG({ width, height });

    const numDiffPixels = pixelmatch(
        baseline.data,
        current.data,
        diff.data,
        width,
        height,
        { threshold }
    );

    // Salvar diff image
    fs.mkdirSync(path.dirname(diffPath), { recursive: true });
    fs.writeFileSync(diffPath, PNG.sync.write(diff));

    const totalPixels = width * height;
    const percentDiff = (numDiffPixels / totalPixels) * 100;

    return {
        numDiffPixels,
        totalPixels,
        percentDiff: percentDiff.toFixed(4),
        passed: percentDiff <= 0.1 // Threshold: 0.1% diff aceitável
    };
}

/**
 * Captura screenshot de uma página
 */
async function capturarScreenshot(page, outputPath) {
    await page.screenshot({ path: outputPath, fullPage: false });
}

/**
 * Valida visual regression para uma página
 */
async function validarVisualRegression({
    manifestPath,
    mode = 'compare', // 'baseline', 'compare', 'update'
    browserChannel,
    dpr = 1,
    outPath
}) {
    const manifest = lerJSON(manifestPath);
    const pagina = manifest.pages[0];
    const url = `${manifest.baseURL}${pagina.path}`;

    const baseDir = path.resolve(process.cwd(), 'validation-artifacts/screenshots');
    const baselineDir = path.join(baseDir, 'baseline');
    const currentDir = path.join(baseDir, 'current');
    const diffDir = path.join(baseDir, 'diff');

    fs.mkdirSync(baselineDir, { recursive: true });
    fs.mkdirSync(currentDir, { recursive: true });
    fs.mkdirSync(diffDir, { recursive: true });

    console.log('📸 Visual Regression Testing...');
    console.log(`   URL: ${url}`);
    console.log(`   Mode: ${mode}`);
    console.log(`   DPR: ${dpr}`);
    console.log('');

    const browser = await chromium.launch({ channel: browserChannel || undefined });
    const context = await browser.newContext({
        deviceScaleFactor: dpr,
        viewport: pagina.viewport
    });
    const page = await context.newPage();

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    try { await page.waitForLoadState('networkidle', { timeout: 3000 }); } catch { }
    await page.waitForTimeout(500); // Aguardar animações

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const screenshotName = `page-${dpr}x-${timestamp}.png`;
    const currentPath = path.join(currentDir, screenshotName);

    await capturarScreenshot(page, currentPath);
    console.log(`✓ Screenshot capturado: ${screenshotName}`);

    await browser.close();

    const resultado = {
        url,
        dpr,
        mode,
        timestamp: new Date().toISOString(),
        screenshot: {
            current: currentPath,
            baseline: null,
            diff: null
        },
        comparison: null
    };

    if (mode === 'baseline' || mode === 'update') {
        // Criar ou atualizar baseline
        const baselinePath = path.join(baselineDir, `page-${dpr}x-baseline.png`);
        fs.copyFileSync(currentPath, baselinePath);

        console.log('');
        console.log(`✅ Baseline ${mode === 'update' ? 'atualizado' : 'criado'}: ${baselinePath}`);

        resultado.screenshot.baseline = baselinePath;
        resultado.status = 'BASELINE_CREATED';
    } else if (mode === 'compare') {
        // Comparar com baseline
        const baselinePath = path.join(baselineDir, `page-${dpr}x-baseline.png`);

        if (!fs.existsSync(baselinePath)) {
            console.error('');
            console.error('❌ Baseline não encontrado!');
            console.error('   Execute primeiro: --mode=baseline');
            resultado.status = 'BASELINE_MISSING';
            resultado.error = 'Baseline não encontrado';
        } else {
            const diffPath = path.join(diffDir, `page-${dpr}x-diff-${timestamp}.png`);

            const comparison = compararImagens(baselinePath, currentPath, diffPath);

            resultado.screenshot.baseline = baselinePath;
            resultado.screenshot.diff = diffPath;
            resultado.comparison = comparison;

            console.log('');
            console.log('📊 RESULTADO DA COMPARAÇÃO');
            console.log('==========================');
            console.log(`   Pixels diferentes: ${comparison.numDiffPixels}`);
            console.log(`   Total de pixels: ${comparison.totalPixels}`);
            console.log(`   Diff %: ${comparison.percentDiff}%`);
            console.log('');

            if (comparison.passed) {
                console.log('✅ VISUAL REGRESSION PASSOU! (diff < 0.1%)');
                resultado.status = 'PASSED';
            } else {
                console.log('❌ VISUAL REGRESSION FALHOU! (diff > 0.1%)');
                console.log('');
                console.log(`   Diff image: ${diffPath}`);
                console.log('');
                console.log('💡 Se as mudanças são esperadas, execute: --mode=update');
                resultado.status = 'FAILED';
            }
        }
    }

    salvarJSON(outPath, resultado);
    console.log('');
    console.log(`📄 Relatório salvo: ${outPath}`);

    return resultado;
}

async function main() {
    const args = process.argv.slice(2);
    const manifestArg = args.find(arg => arg.startsWith('--manifest='));
    const modeArg = args.find(arg => arg.startsWith('--mode='));
    const outArg = args.find(arg => arg.startsWith('--out='));
    const browserArg = args.find(arg => arg.startsWith('--browser='));
    const dprArg = args.find(arg => arg.startsWith('--dpr='));

    if (!manifestArg) {
        console.error('❌ Uso: node visual-regression.cjs --manifest=<MANIFEST> [--mode=baseline|compare|update] [--out=<JSON>] [--browser=chromium|msedge] [--dpr=1|2]');
        console.error('');
        console.error('Modes:');
        console.error('  baseline  - Criar baseline inicial');
        console.error('  compare   - Comparar com baseline (default)');
        console.error('  update    - Atualizar baseline após mudanças esperadas');
        process.exit(1);
    }

    const manifestPath = path.resolve(manifestArg.split('=')[1]);
    const mode = modeArg ? modeArg.split('=')[1] : 'compare';
    const outPath = outArg ? path.resolve(outArg.split('=')[1]) : path.join(process.cwd(), 'visual-regression-report.json');
    const browserChannel = browserArg ? browserArg.split('=')[1] : 'chromium';
    const dpr = dprArg ? parseInt(dprArg.split('=')[1]) : 1;

    if (!['baseline', 'compare', 'update'].includes(mode)) {
        console.error('❌ Mode inválido. Use: baseline, compare ou update');
        process.exit(1);
    }

    const resultado = await validarVisualRegression({
        manifestPath,
        mode,
        browserChannel,
        dpr,
        outPath
    });

    const exitCode = resultado.status === 'PASSED' || resultado.status === 'BASELINE_CREATED' ? 0 : 1;
    process.exit(exitCode);
}

if (require.main === module) {
    main().catch(err => {
        console.error('❌ Erro:', err.message);
        console.error(err.stack);
        process.exit(1);
    });
}

module.exports = { validarVisualRegression, compararImagens };
