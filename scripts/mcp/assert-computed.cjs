#!/usr/bin/env node
/** Assertions de estilos computados com Playwright (Chromium/Edge) */
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

function lerJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function salvarJSON(p, d) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(d, null, 2)); }

function normalizarPx(v) { if (v == null) return null; const n = parseFloat(String(v)); return isNaN(n) ? null : n; }
function hexFromRgbStr(str) {
    if (!str) return null;
    const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
    if (!m) return str;
    const [_, r, g, b, a] = m;
    const toHex = (x) => Number(x).toString(16).padStart(2, '0');
    if (!a || Number(a) >= 1) return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    return `rgba(${r}, ${g}, ${b}, ${Number(a).toFixed(2)})`;
}

/**
 * Compara cores com tolerância RGB por canal
 * @param {string} esperado - Cor esperada (hex, rgb, rgba)
 * @param {string} obtido - Cor obtida (hex, rgb, rgba)
 * @param {number} toleranciaRgb - Tolerância por canal RGB (padrão: 2)
 * @param {number} toleranciaAlpha - Tolerância alpha (padrão: 0.01)
 * @returns {boolean} true se cores são equivalentes dentro da tolerância
 */
function compararCoresComTolerancia(esperado, obtido, toleranciaRgb = 2, toleranciaAlpha = 0.01) {
    // Converte hex para RGB
    const hexToRgb = (hex) => {
        hex = hex.replace('#', '');
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return { r, g, b, a: 1 };
    };

    // Parse qualquer formato de cor
    const parseColor = (str) => {
        if (!str || typeof str !== 'string') return null;
        str = str.trim();

        if (str.startsWith('#')) {
            return hexToRgb(str);
        }

        const m = /rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\s*\)/.exec(str);
        if (!m) return null;

        const [_, r, g, b, a] = m;
        return { r: +r, g: +g, b: +b, a: a === undefined ? 1 : +a };
    };

    const e = parseColor(esperado);
    const o = parseColor(obtido);

    // Fallback para comparação de string se parsing falhar
    if (!e || !o) {
        return esperado?.toLowerCase() === obtido?.toLowerCase();
    }

    // Compara cada canal com tolerância
    const rDiff = Math.abs(e.r - o.r);
    const gDiff = Math.abs(e.g - o.g);
    const bDiff = Math.abs(e.b - o.b);
    const aDiff = Math.abs(e.a - o.a);

    return rDiff <= toleranciaRgb &&
        gDiff <= toleranciaRgb &&
        bDiff <= toleranciaRgb &&
        aDiff <= toleranciaAlpha;
}

const PROPRIEDADES = [
    // Cores e backgrounds
    'background-color', 'color',

    // Tipografia
    'font-family', 'font-size', 'font-weight', 'line-height',
    'text-align', 'text-decoration', 'text-transform',

    // Layout e posicionamento
    'display', 'flex-direction', 'justify-content', 'align-items', 'flex-wrap',
    'position', 'top', 'left', 'right', 'bottom', 'z-index',

    // Dimensões
    'height', 'width', 'min-height', 'min-width', 'max-height', 'max-width',

    // Espaçamento
    'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'gap', 'row-gap', 'column-gap',

    // Bordas
    'border-radius',
    'border-top-color', 'border-top-width', 'border-top-style',
    'border-right-color', 'border-right-width', 'border-right-style',
    'border-bottom-color', 'border-bottom-width', 'border-bottom-style',
    'border-left-color', 'border-left-width', 'border-left-style',

    // Efeitos visuais
    'box-shadow', 'opacity', 'transform', 'filter',

    // Overflow e interação
    'overflow-x', 'overflow-y', 'cursor'
];

function comparar(esperado, obtido, dpr = 1) {
    // Configuração de tolerâncias por tipo de propriedade
    const tolerancias = {
        px: dpr >= 2 ? 0.5 : 1,  // HiDPI aware: 0.5px para DPR>=2, 1px padrão
        color: { rgb: 2, alpha: 0.01 },  // RGB±2 por canal, alpha±0.01
        fontWeight: 100,  // Font-weight em incrementos de 100
        opacity: 0.01  // Opacidade com 2 casas decimais
    };

    const diffs = {};
    for (const [prop, val] of Object.entries(esperado)) {
        const got = obtido[prop];
        if (val == null || got == null) continue;

        // Propriedades de cor: usa comparação com tolerância RGB
        if (prop.includes('color')) {
            if (!compararCoresComTolerancia(val, got, tolerancias.color.rgb, tolerancias.color.alpha)) {
                const eHex = val.toLowerCase();
                const gHex = hexFromRgbStr(got)?.toLowerCase();
                diffs[prop] = { esperado: eHex, obtido: gHex };
            }
        }
        // Propriedades dimensionais: usa tolerância px
        else if (
            prop.includes('font-size') || prop.includes('line-height') ||
            prop.includes('height') || prop.includes('width') ||
            prop.includes('padding') || prop.includes('margin') ||
            prop.includes('gap') || prop.includes('border-radius') ||
            prop.includes('top') || prop.includes('left') || prop.includes('right') || prop.includes('bottom')
        ) {
            const e = normalizarPx(val);
            const g = normalizarPx(got);
            if (e != null && g != null && Math.abs(e - g) > tolerancias.px) {
                diffs[prop] = { esperado: e, obtido: g };
            }
        }
        // Font-weight: tolerância de 100
        else if (prop === 'font-weight') {
            const e = Number(val);
            const g = Number(got);
            if (Math.abs(e - g) > tolerancias.fontWeight) {
                diffs[prop] = { esperado: e, obtido: g };
            }
        }
        // Font-family: comparação por substring
        else if (prop === 'font-family') {
            const norm = (s) => String(s).toLowerCase().replace(/['"]/g, '');
            if (!norm(got).includes(norm(val))) {
                diffs[prop] = { esperado: val, obtido: got };
            }
        }
        // Opacity: tolerância decimal
        else if (prop === 'opacity') {
            const e = parseFloat(val);
            const g = parseFloat(got);
            if (!isNaN(e) && !isNaN(g) && Math.abs(e - g) > tolerancias.opacity) {
                diffs[prop] = { esperado: e, obtido: g };
            }
        }
        // Box-shadow: comparação por substring
        else if (prop === 'box-shadow') {
            if (!String(got).includes(String(val))) {
                diffs[prop] = { esperado: val, obtido: got };
            }
        }
        // Border-style, display, flex-*, text-align, etc: comparação exata
        else if (
            prop.endsWith('-style') || prop === 'display' || prop.startsWith('flex-') ||
            prop === 'justify-content' || prop === 'align-items' || prop === 'position' ||
            prop.startsWith('text-') || prop.startsWith('overflow-') || prop === 'cursor' ||
            prop === 'transform' || prop === 'filter' || prop === 'z-index'
        ) {
            if (String(got).trim() !== String(val).trim()) {
                diffs[prop] = { esperado: val, obtido: got };
            }
        }
    }
    return diffs;
}

async function coletarEstilos(page, seletor) {
    const estilos = await page.$eval(seletor, (el, PROPRIEDADES) => {
        const cs = getComputedStyle(el);
        const out = {};
        for (const p of PROPRIEDADES) out[p] = cs.getPropertyValue(p);
        return out;
    }, PROPRIEDADES);
    return estilos;
}

async function validarPagina({ manifestPath, specPath, browserChannel, dpr = 1, outPath }) {
    const manifest = lerJSON(manifestPath);
    const pagina = manifest.pages[0];
    const url = `${manifest.baseURL}${pagina.path}`;
    const browser = await chromium.launch({ channel: browserChannel || undefined });
    const context = await browser.newContext({ deviceScaleFactor: dpr, viewport: pagina.viewport, colorScheme: 'light' });
    const page = await context.newPage();
    await page.addStyleTag({ content: '* { animation: none !important; transition: none !important; }' });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    // aguardar rede ociosa para fontes/icones externos e CSS
    try { await page.waitForLoadState('networkidle', { timeout: 3000 }); } catch { }
    await page.waitForTimeout(200); // pequeno buffer

    const spec = lerJSON(specPath);
    const resultados = { url, dpr, browser: browserChannel || 'chromium', itens: [] };
    const esperados = montarEsperadosAPartirDaSpec(spec, pagina.selectors);

    for (const [chave, seletor] of Object.entries(pagina.selectors)) {
        const esperado = esperados[chave];
        if (!esperado) continue;
        const existe = await page.$(seletor);
        if (!existe) {
            resultados.itens.push({ chave, seletor, erro: 'elemento_nao_encontrado' });
            continue;
        }
        const obtido = await coletarEstilos(page, seletor);
        const diffs = comparar(esperado, obtido, dpr);  // Passa DPR para tolerâncias HiDPI
        resultados.itens.push({ chave, seletor, esperado, obtido, diffs });
    }

    await browser.close();
    salvarJSON(outPath, resultados);
    return resultados;
}

function montarEsperadosAPartirDaSpec(spec, selectors) {
    // Aproximação: mapeia propriedades mais importantes, caso o spec tenha as chaves presentes.
    // Se o spec for "mock", retornará vazio e não haverá comparações duras.
    const out = {};
    const props = spec?.props || {};
    for (const [chave] of Object.entries(selectors)) {
        const n = props[chave];
        if (!n) continue;
        const e = {};
        if (n.fillHex) e['background-color'] = n.fillHex;
        if (n.font?.size) e['font-size'] = n.font.size;
        if (n.font?.weight) e['font-weight'] = n.font.weight;
        if (n.radius != null) e['border-radius'] = n.radius;
        // alturas e larguras podem variar por layout responsivo; só compara se definido no spec
        if (n.width) e['width'] = n.width;
        if (n.height) e['height'] = n.height;
        out[chave] = e;
    }
    // Defaults de componentes do nosso design (ajuda quando o spec é parcial)
    out['page-title'] ||= { 'color': '#7367f0', 'font-weight': 500 };
    out['tabs'] ||= { 'border-bottom-color': '#7367f0', 'border-bottom-width': 2, 'border-bottom-style': 'solid' };
    out['stats-bar'] ||= { 'background-color': 'rgba(115, 103, 240, 0.12)', 'height': 44 };
    return out;
}

if (require.main === module) {
    const manifest = process.argv.find(a => a.startsWith('--manifest='))?.split('=')[1] || path.resolve('validation/mcp-figma.manifest.json');
    const spec = process.argv.find(a => a.startsWith('--spec='))?.split('=')[1] || path.resolve('validation/figma.spec.generated.json');
    const browser = process.argv.find(a => a.startsWith('--browser='))?.split('=')[1];
    const dpr = Number(process.argv.find(a => a.startsWith('--dpr='))?.split('=')[1] || 1);
    const out = process.argv.find(a => a.startsWith('--out='))?.split('=')[1] || path.resolve(`validation-artifacts/mcp/structural-${browser || 'chromium'}-dpr${dpr}.json`);

    validarPagina({ manifestPath: manifest, specPath: spec, browserChannel: browser, dpr, outPath: out })
        .then(r => { console.log('[assert-computed] OK', out, 'itens:', r.itens.length); })
        .catch(e => { console.error(e); process.exit(1); });
}
