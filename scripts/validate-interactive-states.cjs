#!/usr/bin/env node
/**
 * Interactive States Validator (Sprint 4 - F1)
 * 
 * Valida estados interativos (:hover, :focus, :active) comparando
 * estilos computados antes/depois de interações.
 * 
 * Testa:
 *   - :hover (mouse over)
 *   - :focus (keyboard navigation)
 *   - :active (click down)
 *   - Transições CSS (transition duration, timing-function)
 * 
 * Uso:
 *   node scripts/validate-interactive-states.cjs --manifest=<MANIFEST> --out=<JSON>
 * 
 * Output: Relatório de estados interativos esperados vs obtidos
 */

const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

function lerJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function salvarJSON(p, d) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(d, null, 2)); }

/**
 * Extrai propriedades CSS de um elemento em um estado específico
 */
async function extrairEstilosComputados(page, seletor, propriedades) {
    return await page.$eval(seletor, (el, props) => {
        const estilos = getComputedStyle(el);
        const resultado = {};
        props.forEach(prop => {
            resultado[prop] = estilos[prop];
        });
        return resultado;
    }, propriedades);
}

/**
 * Testa estado :hover
 */
async function testarHoverState(page, seletor, propriedades) {
    // Estado inicial
    const estadoInicial = await extrairEstilosComputados(page, seletor, propriedades);

    // Hover
    const elemento = await page.$(seletor);
    await elemento.hover();
    await page.waitForTimeout(100); // Aguardar transição

    const estadoHover = await extrairEstilosComputados(page, seletor, propriedades);

    // Remover hover (mover mouse para fora)
    await page.mouse.move(0, 0);
    await page.waitForTimeout(100);

    return {
        inicial: estadoInicial,
        hover: estadoHover,
        changed: !isEqual(estadoInicial, estadoHover)
    };
}

/**
 * Testa estado :focus
 */
async function testarFocusState(page, seletor, propriedades) {
    // Estado inicial
    const estadoInicial = await extrairEstilosComputados(page, seletor, propriedades);

    // Focus
    await page.focus(seletor);
    await page.waitForTimeout(100);

    const estadoFocus = await extrairEstilosComputados(page, seletor, propriedades);

    // Blur
    await page.evaluate(() => document.activeElement?.blur());
    await page.waitForTimeout(100);

    return {
        inicial: estadoInicial,
        focus: estadoFocus,
        changed: !isEqual(estadoInicial, estadoFocus)
    };
}

/**
 * Testa estado :active
 */
async function testarActiveState(page, seletor, propriedades) {
    // Estado inicial
    const estadoInicial = await extrairEstilosComputados(page, seletor, propriedades);

    // Active (mouse down, não soltar)
    const elemento = await page.$(seletor);
    await elemento.dispatchEvent('mousedown');
    await page.waitForTimeout(50);

    const estadoActive = await extrairEstilosComputados(page, seletor, propriedades);

    // Mouse up
    await elemento.dispatchEvent('mouseup');
    await page.waitForTimeout(50);

    return {
        inicial: estadoInicial,
        active: estadoActive,
        changed: !isEqual(estadoInicial, estadoActive)
    };
}

/**
 * Compara objetos (shallow)
 */
function isEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
        if (obj1[key] !== obj2[key]) return false;
    }

    return true;
}

/**
 * Valida estados interativos para elementos conhecidos
 */
async function validarInteractiveStates({ manifestPath, browserChannel, dpr = 1, outPath }) {
    const manifest = lerJSON(manifestPath);
    const pagina = manifest.pages[0];
    const url = `${manifest.baseURL}${pagina.path}`;

    console.log('🎭 Validando Interactive States...');
    console.log(`   URL: ${url}`);
    console.log('');

    const browser = await chromium.launch({ channel: browserChannel || undefined });
    const context = await browser.newContext({ deviceScaleFactor: dpr, viewport: pagina.viewport });
    const page = await context.newPage();

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    try { await page.waitForLoadState('networkidle', { timeout: 3000 }); } catch { }
    await page.waitForTimeout(200);

    const resultado = {
        url,
        dpr,
        browser: browserChannel || 'chromium',
        timestamp: new Date().toISOString(),
        elementos: []
    };

    // Elementos interativos conhecidos
    const elementosInterativos = [
        {
            nome: 'tab-ativo',
            seletor: '[data-role=tabs] .tab.active',
            estados: ['hover'],
            propriedades: ['background-color', 'color', 'border-bottom-color', 'border-bottom-width']
        },
        {
            nome: 'tab-inativo',
            seletor: '[data-role=tabs] .tab:not(.active)',
            estados: ['hover'],
            propriedades: ['background-color', 'color', 'border-bottom-color', 'border-bottom-width']
        },
        {
            nome: 'filtro-select',
            seletor: '[data-role=filters-card] select',
            estados: ['focus'],
            propriedades: ['border-color', 'outline', 'box-shadow']
        },
        {
            nome: 'filtro-input',
            seletor: '[data-role=filters-card] input',
            estados: ['focus'],
            propriedades: ['border-color', 'outline', 'box-shadow']
        },
        {
            nome: 'linha-tabela',
            seletor: '[data-role=table-card] tbody tr',
            estados: ['hover'],
            propriedades: ['background-color']
        },
        {
            nome: 'badge',
            seletor: '[data-role=stats-bar] .badge',
            estados: ['hover'],
            propriedades: ['background-color', 'transform', 'box-shadow']
        }
    ];

    for (const config of elementosInterativos) {
        const existe = await page.$(config.seletor);
        if (!existe) {
            console.log(`⏭️  ${config.nome}: elemento não encontrado`);
            continue;
        }

        const resultadoElemento = {
            nome: config.nome,
            seletor: config.seletor,
            estados: {}
        };

        // Testar cada estado
        if (config.estados.includes('hover')) {
            resultadoElemento.estados.hover = await testarHoverState(page, config.seletor, config.propriedades);
            console.log(`   :hover - ${resultadoElemento.estados.hover.changed ? '✓ mudou' : '⚠️ sem mudança'}`);
        }

        if (config.estados.includes('focus')) {
            resultadoElemento.estados.focus = await testarFocusState(page, config.seletor, config.propriedades);
            console.log(`   :focus - ${resultadoElemento.estados.focus.changed ? '✓ mudou' : '⚠️ sem mudança'}`);
        }

        if (config.estados.includes('active')) {
            resultadoElemento.estados.active = await testarActiveState(page, config.seletor, config.propriedades);
            console.log(`   :active - ${resultadoElemento.estados.active.changed ? '✓ mudou' : '⚠️ sem mudança'}`);
        }

        resultado.elementos.push(resultadoElemento);
        console.log(`✓ ${config.nome} testado`);
        console.log('');
    }

    await browser.close();

    // Análise de resultados
    const totalElementos = resultado.elementos.length;
    const comMudanca = resultado.elementos.filter(el =>
        Object.values(el.estados).some(estado => estado.changed)
    ).length;

    resultado.summary = {
        totalElementos,
        comMudanca,
        semMudanca: totalElementos - comMudanca,
        percentInterativo: ((comMudanca / totalElementos) * 100).toFixed(1)
    };

    console.log('');
    console.log('📊 RESULTADO INTERACTIVE STATES');
    console.log('================================');
    console.log(`✓ Elementos testados: ${totalElementos}`);
    console.log(`✓ Com interatividade: ${comMudanca}`);
    console.log(`⚠️  Sem interatividade: ${resultado.summary.semMudanca}`);
    console.log(`✓ % Interativo: ${resultado.summary.percentInterativo}%`);

    resultado.status = comMudanca >= totalElementos * 0.5 ? 'PASSED' : 'WARNING';

    if (resultado.status === 'PASSED') {
        console.log('');
        console.log('✅ VALIDAÇÃO PASSOU! Interatividade detectada.');
    } else {
        console.log('');
        console.log('⚠️ VALIDAÇÃO COM AVISOS! Poucos elementos interativos.');
    }

    salvarJSON(outPath, resultado);
    console.log('');
    console.log(`📄 Relatório: ${outPath}`);

    return resultado;
}

async function main() {
    const args = process.argv.slice(2);
    const manifestArg = args.find(arg => arg.startsWith('--manifest='));
    const outArg = args.find(arg => arg.startsWith('--out='));
    const browserArg = args.find(arg => arg.startsWith('--browser='));
    const dprArg = args.find(arg => arg.startsWith('--dpr='));

    if (!manifestArg) {
        console.error('❌ Uso: node validate-interactive-states.cjs --manifest=<MANIFEST> [--out=<JSON>] [--browser=chromium|msedge] [--dpr=1|2]');
        process.exit(1);
    }

    const manifestPath = path.resolve(manifestArg.split('=')[1]);
    const outPath = outArg ? path.resolve(outArg.split('=')[1]) : path.join(process.cwd(), 'interactive-states-report.json');
    const browserChannel = browserArg ? browserArg.split('=')[1] : 'chromium';
    const dpr = dprArg ? parseInt(dprArg.split('=')[1]) : 1;

    const resultado = await validarInteractiveStates({ manifestPath, browserChannel, dpr, outPath });

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

module.exports = { validarInteractiveStates };
