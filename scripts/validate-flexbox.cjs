#!/usr/bin/env node
/**
 * Flexbox Advanced Validator (Sprint 2 - A2)
 * 
 * Valida posições computadas de elementos filhos em containers flexbox,
 * incluindo gap, wrap behavior e alinhamento.
 * 
 * Uso:
 *   node scripts/validate-flexbox.cjs --manifest=<MANIFEST> --out=<JSON>
 * 
 * Output: Relatório de posições esperadas vs obtidas
 */

const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

function lerJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function salvarJSON(p, d) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(d, null, 2)); }

/**
 * Valida posições de children em flexbox container
 */
async function validarFlexboxChildren(page, seletor, esperado, toleranciaPx = 1) {
    const resultado = await page.$eval(seletor, (el, tol) => {
        const container = el;
        const children = Array.from(container.children);
        const containerRect = container.getBoundingClientRect();
        const containerStyles = getComputedStyle(container);

        const info = {
            container: {
                display: containerStyles.display,
                flexDirection: containerStyles.flexDirection,
                justifyContent: containerStyles.justifyContent,
                alignItems: containerStyles.alignItems,
                gap: containerStyles.gap,
                rowGap: containerStyles.rowGap,
                columnGap: containerStyles.columnGap,
                width: containerRect.width,
                height: containerRect.height,
                x: containerRect.x,
                y: containerRect.y
            },
            children: children.map((child, idx) => {
                const childRect = child.getBoundingClientRect();
                const childStyles = getComputedStyle(child);

                return {
                    index: idx,
                    tag: child.tagName.toLowerCase(),
                    className: child.className,
                    rect: {
                        x: childRect.x,
                        y: childRect.y,
                        width: childRect.width,
                        height: childRect.height,
                        top: childRect.top,
                        left: childRect.left,
                        right: childRect.right,
                        bottom: childRect.bottom
                    },
                    // Posição relativa ao container
                    relativePosition: {
                        x: childRect.x - containerRect.x,
                        y: childRect.y - containerRect.y
                    },
                    styles: {
                        display: childStyles.display,
                        flex: childStyles.flex,
                        flexGrow: childStyles.flexGrow,
                        flexShrink: childStyles.flexShrink,
                        flexBasis: childStyles.flexBasis,
                        alignSelf: childStyles.alignSelf
                    }
                };
            })
        };

        return info;
    }, toleranciaPx);

    return resultado;
}

/**
 * Calcula gaps esperados entre children baseado no flex-direction
 */
function calcularGapsEsperados(children, containerInfo) {
    const gaps = [];
    const flexDirection = containerInfo.container.flexDirection;
    const gapValue = parseFloat(containerInfo.container.gap) || 0;

    for (let i = 0; i < children.length - 1; i++) {
        const current = children[i];
        const next = children[i + 1];

        let gapAtual;
        if (flexDirection === 'row' || flexDirection === 'row-reverse') {
            // Gap horizontal: próximo.left - current.right
            gapAtual = next.rect.left - current.rect.right;
        } else {
            // Gap vertical: próximo.top - current.bottom
            gapAtual = next.rect.top - current.rect.bottom;
        }

        gaps.push({
            between: `${i} → ${i + 1}`,
            esperado: gapValue,
            obtido: gapAtual,
            diff: Math.abs(gapValue - gapAtual)
        });
    }

    return gaps;
}

/**
 * Valida alinhamento de children no cross-axis
 */
function validarAlinhamento(children, containerInfo, toleranciaPx = 1) {
    const alignItems = containerInfo.container.alignItems;
    const flexDirection = containerInfo.container.flexDirection;
    const containerHeight = containerInfo.container.height;
    const containerWidth = containerInfo.container.width;

    const erros = [];

    children.forEach((child, idx) => {
        // Validar align-items
        if (flexDirection === 'row' || flexDirection === 'row-reverse') {
            // Cross-axis é vertical
            if (alignItems === 'center') {
                const childCenterY = child.relativePosition.y + child.rect.height / 2;
                const containerCenterY = containerHeight / 2;
                const diff = Math.abs(childCenterY - containerCenterY);

                if (diff > toleranciaPx) {
                    erros.push({
                        child: idx,
                        tipo: 'align-items-center-vertical',
                        esperado: containerCenterY,
                        obtido: childCenterY,
                        diff
                    });
                }
            }
        } else {
            // Cross-axis é horizontal
            if (alignItems === 'center') {
                const childCenterX = child.relativePosition.x + child.rect.width / 2;
                const containerCenterX = containerWidth / 2;
                const diff = Math.abs(childCenterX - containerCenterX);

                if (diff > toleranciaPx) {
                    erros.push({
                        child: idx,
                        tipo: 'align-items-center-horizontal',
                        esperado: containerCenterX,
                        obtido: childCenterX,
                        diff
                    });
                }
            }
        }
    });

    return erros;
}

async function validarPaginaFlexbox({ manifestPath, browserChannel, dpr = 1, outPath }) {
    const manifest = lerJSON(manifestPath);
    const pagina = manifest.pages[0];
    const url = `${manifest.baseURL}${pagina.path}`;

    console.log('🔲 Validando Flexbox Avançado...');
    console.log(`   URL: ${url}`);
    console.log('');

    const browser = await chromium.launch({ channel: browserChannel || undefined });
    const context = await browser.newContext({ deviceScaleFactor: dpr, viewport: pagina.viewport });
    const page = await context.newPage();

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    try { await page.waitForLoadState('networkidle', { timeout: 3000 }); } catch { }
    await page.waitForTimeout(200);

    const toleranciaPx = dpr >= 2 ? 0.5 : 1;
    const resultados = {
        url,
        dpr,
        browser: browserChannel || 'chromium',
        timestamp: new Date().toISOString(),
        containers: []
    };

    // Validar containers flexbox conhecidos
    const flexboxSelectors = {
        'stats-bar': '[data-role=stats-bar]',
        'tabs': '[data-role=tabs]',
        'header': '[data-role=header]',
        'pagination': '[data-role=pagination]'
    };

    for (const [nome, seletor] of Object.entries(flexboxSelectors)) {
        const existe = await page.$(seletor);
        if (!existe) continue;

        const containerInfo = await validarFlexboxChildren(page, seletor, null, toleranciaPx);

        if (containerInfo.container.display !== 'flex') {
            console.log(`⏭️  ${nome}: não é flexbox, pulando...`);
            continue;
        }

        const gaps = calcularGapsEsperados(containerInfo.children, containerInfo);
        const alinhamentoErros = validarAlinhamento(containerInfo.children, containerInfo, toleranciaPx);

        const gapsDiffs = gaps.filter(g => g.diff > toleranciaPx);

        resultados.containers.push({
            nome,
            seletor,
            containerInfo,
            gaps,
            gapsDiffs,
            alinhamentoErros,
            status: gapsDiffs.length === 0 && alinhamentoErros.length === 0 ? 'PASSED' : 'FAILED'
        });

        console.log(`✓ ${nome}: ${containerInfo.children.length} children, ${gapsDiffs.length} gap diffs, ${alinhamentoErros.length} align diffs`);
    }

    await browser.close();

    const totalDiffs = resultados.containers.reduce((acc, c) =>
        acc + c.gapsDiffs.length + c.alinhamentoErros.length, 0
    );

    resultados.status = totalDiffs === 0 ? 'PASSED' : 'FAILED';
    resultados.summary = {
        containersValidados: resultados.containers.length,
        totalGapDiffs: resultados.containers.reduce((acc, c) => acc + c.gapsDiffs.length, 0),
        totalAlignDiffs: resultados.containers.reduce((acc, c) => acc + c.alinhamentoErros.length, 0),
        totalDiffs
    };

    console.log('');
    console.log('📊 RESULTADO FLEXBOX VALIDATION');
    console.log('===============================');
    console.log(`✓ Containers: ${resultados.summary.containersValidados}`);
    console.log(`✓ Gap diffs: ${resultados.summary.totalGapDiffs}`);
    console.log(`✓ Align diffs: ${resultados.summary.totalAlignDiffs}`);
    console.log('');

    if (resultados.status === 'PASSED') {
        console.log('✅ VALIDAÇÃO PASSOU! Flexbox positions corretas.');
    } else {
        console.log('❌ VALIDAÇÃO FALHOU! Existem diffs de posicionamento.');
    }

    salvarJSON(outPath, resultados);
    console.log('');
    console.log(`📄 Relatório: ${outPath}`);

    return resultados;
}

async function main() {
    const args = process.argv.slice(2);
    const manifestArg = args.find(arg => arg.startsWith('--manifest='));
    const outArg = args.find(arg => arg.startsWith('--out='));
    const browserArg = args.find(arg => arg.startsWith('--browser='));
    const dprArg = args.find(arg => arg.startsWith('--dpr='));

    if (!manifestArg) {
        console.error('❌ Uso: node validate-flexbox.cjs --manifest=<MANIFEST> [--out=<JSON>] [--browser=chromium|msedge] [--dpr=1|2]');
        process.exit(1);
    }

    const manifestPath = path.resolve(manifestArg.split('=')[1]);
    const outPath = outArg ? path.resolve(outArg.split('=')[1]) : path.join(process.cwd(), 'flexbox-validation-report.json');
    const browserChannel = browserArg ? browserArg.split('=')[1] : 'chromium';
    const dpr = dprArg ? parseInt(dprArg.split('=')[1]) : 1;

    const resultado = await validarPaginaFlexbox({ manifestPath, browserChannel, dpr, outPath });

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

module.exports = { validarFlexboxChildren, validarPaginaFlexbox };
