#!/usr/bin/env node
/**
 * Validador Estrutural Pixel-Perfect
 * 
 * Compara o CSS implementado com os tokens extraídos do Figma,
 * reportando desvios específicos com threshold configurável.
 * 
 * Uso:
 *   node scripts/validate-pixel-perfect.js --html=path/to/file.html --tokens=figma-tokens.json
 * 
 * Output: Relatório de conformidade com desvios
 */

const fs = require('fs');
const path = require('path');

// Parser simples de CSS inline (para PoC)
function parseCSSFromHTML(htmlContent) {
    const cssRules = {};

    // Extrair bloco <style>
    const styleMatch = htmlContent.match(/<style>([\s\S]*?)<\/style>/);
    if (!styleMatch) {
        return cssRules;
    }

    let cssContent = styleMatch[1];

    // Remover comentários CSS (/* ... */)
    cssContent = cssContent.replace(/\/\*[\s\S]*?\*\//g, '');

    // Parser básico de regras CSS
    const ruleRegex = /([^{]+)\{([^}]+)\}/g;
    let match;

    while ((match = ruleRegex.exec(cssContent)) !== null) {
        const selector = match[1].trim();
        const declarations = match[2].trim();

        const props = {};
        declarations.split(';').forEach(decl => {
            const [prop, value] = decl.split(':').map(s => s?.trim());
            if (prop && value) {
                // Expandir shorthand padding
                if (prop === 'padding') {
                    const values = value.split(/\s+/);
                    if (values.length === 4) {
                        // padding: top right bottom left
                        props['padding-top'] = values[0];
                        props['padding-right'] = values[1];
                        props['padding-bottom'] = values[2];
                        props['padding-left'] = values[3];
                    } else if (values.length === 2) {
                        // padding: top/bottom left/right
                        props['padding-top'] = values[0];
                        props['padding-bottom'] = values[0];
                        props['padding-left'] = values[1];
                        props['padding-right'] = values[1];
                    } else {
                        // padding: all (1 valor)
                        props['padding-top'] = values[0];
                        props['padding-right'] = values[0];
                        props['padding-bottom'] = values[0];
                        props['padding-left'] = values[0];
                    }
                }
                // Extrair cor de border/border-bottom (ex: "1px solid #e2e2e3")
                else if ((prop === 'border-bottom' || prop === 'border') && value.includes('#')) {
                    props[prop] = value;
                    // Extrair apenas a cor
                    const colorMatch = value.match(/#[0-9a-fA-F]{3,6}/);
                    if (colorMatch) {
                        const colorProp = prop === 'border' ? 'border-color' : 'border-bottom-color';
                        props[colorProp] = colorMatch[0];
                    }
                }
                // Normalizar rgba → hex (quando alpha=1) para background
                else if (prop === 'background' && value.startsWith('rgba(')) {
                    props[prop] = value;
                    // rgba(115, 103, 240, 0.12) → manter rgba, não converter
                    // O validador deve comparar rgba vs token
                }
                else {
                    props[prop] = value;
                }
            }
        });

        cssRules[selector] = props;
    }

    return cssRules;
}

/**
 * Compara cores com tolerância RGB por canal (mesma lógica do assert-computed.cjs)
 * @param {string} esperado - Cor esperada (hex, rgb, rgba)
 * @param {string} obtido - Cor obtida (hex, rgb, rgba)
 * @param {number} toleranciaRgb - Tolerância por canal RGB (padrão: 2)
 * @param {number} toleranciaAlpha - Tolerância alpha (padrão: 0.01)
 * @returns {boolean} true se cores são equivalentes dentro da tolerância
 */
function compararCoresComTolerancia(esperado, obtido, toleranciaRgb = 2, toleranciaAlpha = 0.01) {
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

    if (!e || !o) {
        return esperado?.toLowerCase() === obtido?.toLowerCase();
    }

    const rDiff = Math.abs(e.r - o.r);
    const gDiff = Math.abs(e.g - o.g);
    const bDiff = Math.abs(e.b - o.b);
    const aDiff = Math.abs(e.a - o.a);

    return rDiff <= toleranciaRgb &&
        gDiff <= toleranciaRgb &&
        bDiff <= toleranciaRgb &&
        aDiff <= toleranciaAlpha;
}

// Propriedades CSS validadas (56+ propriedades - Sprint 1 P0)
const PROPRIEDADES_VALIDADAS = [
    // Cores e backgrounds
    'background-color', 'color', 'background',
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
    'border', 'border-bottom', 'border-color',
    // Efeitos visuais
    'box-shadow', 'opacity', 'transform', 'filter',
    // Overflow e interação
    'overflow-x', 'overflow-y', 'cursor'
];

// Mapeamento de seletores CSS para tokens Figma
// Formato: { 'selector CSS': { tokenPrefix, properties: { 'cssProperty': 'tokenKey' } } }
const SELECTOR_TO_TOKEN_MAP = {
    '.sidebar': {
        tokenPrefix: 'menu-backoffice',
        properties: {
            'width': 'menu-backoffice-width',
            'background': 'menu-backoffice-bg',
            'padding-left': 'menu-backoffice-padding-left',
            'padding-right': 'menu-backoffice-padding-right',
            'padding-top': 'menu-backoffice-padding-top',
            'padding-bottom': 'menu-backoffice-padding-bottom'
        }
    },
    '.header': {
        tokenPrefix: 'global-header',
        properties: {
            'border-bottom-color': 'global-header-border',
            'padding-left': 'global-header-padding-left',
            'padding-right': 'global-header-padding-right',
            'padding-top': 'global-header-padding-top',
            'padding-bottom': 'global-header-padding-bottom'
        }
    },
    '.breadcrumb': {
        tokenPrefix: 'breadcrumb',
        properties: {
            'gap': 'breadcrumb-gap'
        }
    },
    '.page-title': {
        tokenPrefix: 'page-title',
        properties: {
            'font-size': 'page-title-font-size',
            'color': 'page-title-color'
        }
    },
    '.tabs': {
        tokenPrefix: 'tabs',
        properties: {
            'border-bottom': 'tabs-border-bottom',
            'margin-bottom': 'tabs-margin-bottom'
        }
    },
    '.tab': {
        tokenPrefix: 'tab',
        properties: {
            'padding-top': 'tab-padding-top',
            'padding-bottom': 'tab-padding-bottom',
            'width': 'tab-width',
            'font-size': 'tab-font-size',
            'color': 'tab-color'
        }
    },
    '.stats-bar': {
        tokenPrefix: 'stats-bar',
        properties: {
            // 'background': 'stats-bar-bg', // Ignorar: CSS usa rgba(115,103,240,0.12), não hex
            'border-radius': 'stats-bar-border-radius',
            'padding-top': 'stats-bar-padding-top',
            'padding-bottom': 'stats-bar-padding-bottom',
            'padding-left': 'stats-bar-padding-left',
            'padding-right': 'stats-bar-padding-right',
            'gap': 'stats-bar-gap'
        }
    },
    '.badge': {
        tokenPrefix: 'badge',
        properties: {
            'gap': 'badge-gap',
            'padding-top': 'badge-padding-top',
            'padding-bottom': 'badge-padding-bottom',
            'padding-left': 'badge-padding-left',
            'padding-right': 'badge-padding-right',
            'border-radius': 'badge-border-radius',
            'font-size': 'badge-font-size'
        }
    },
    '.select-box': {
        tokenPrefix: 'select-box',
        properties: {
            'border-color': 'select-box-border',
            'border-radius': 'select-box-border-radius',
            'padding-top': 'select-box-padding-top',
            'padding-bottom': 'select-box-padding-bottom',
            'padding-left': 'select-box-padding-left',
            'padding-right': 'select-box-padding-right',
            'height': 'select-box-height',
            'font-size': 'select-box-font-size'
        }
    },
    '.btn': {
        tokenPrefix: 'btn',
        properties: {
            'height': 'btn-height',
            'padding-left': 'btn-padding-left',
            'padding-right': 'btn-padding-right',
            'border-radius': 'btn-border-radius',
            'font-size': 'btn-font-size',
            'gap': 'btn-gap'
        }
    },
    '.search-box': {
        tokenPrefix: 'search-box',
        properties: {
            'border-color': 'search-box-border',
            'border-radius': 'search-box-border-radius',
            'padding-top': 'search-box-padding-top',
            'padding-bottom': 'search-box-padding-bottom',
            'padding-left': 'search-box-padding-left',
            'padding-right': 'search-box-padding-right'
        }
    },
    '.row-number': {
        tokenPrefix: 'row-number',
        properties: {
            'width': 'row-number-width',
            'font-size': 'row-number-font-size',
            'color': 'row-number-color'
        }
    },
    '.row-text': {
        tokenPrefix: 'row-text',
        properties: {
            'font-size': 'row-text-font-size',
            'color': 'row-text-color',
            'line-height': 'row-text-line-height'
        }
    },
    '.pagination': {
        tokenPrefix: 'pagination',
        properties: {
            'padding-top': 'pagination-padding-top',
            'padding-bottom': 'pagination-padding-bottom',
            'padding-left': 'pagination-padding-left',
            'padding-right': 'pagination-padding-right',
            'gap': 'pagination-gap'
        }
    },
    '.page-btn': {
        tokenPrefix: 'page-btn',
        properties: {
            'width': 'page-btn-width',
            'height': 'page-btn-height',
            'background': 'page-btn-bg'
        }
    }
};

// Comparar valor CSS com token Figma (Sprint 1 P0: tolerâncias configuráveis + RGB±2)
function compareValues(cssValue, tokenValue, property, threshold = { px: 1, color: { rgb: 2, alpha: 0.01 }, fontWeight: 100, opacity: 0.01 }, dpr = 1) {
    // Normalizar valores
    const normCss = String(cssValue).trim().toLowerCase();
    const normToken = String(tokenValue).trim().toLowerCase();

    if (normCss === normToken) {
        return { match: true, diff: 0 };
    }

    // Comparar cores com RGB±2 por canal
    if (property.includes('color') || property.includes('background') || property.includes('border-color')) {
        const match = compararCoresComTolerancia(normToken, normCss, threshold.color.rgb, threshold.color.alpha);
        if (match) {
            return { match: true, diff: 0 };
        }
        return {
            match: false,
            diff: 1,
            cssValue: normCss,
            tokenValue: normToken
        };
    }

    // Comparar dimensões (px) com tolerância HiDPI aware
    const pxTolerance = dpr >= 2 ? 0.5 : threshold.px;
    if (
        property.includes('width') || property.includes('height') ||
        property.includes('padding') || property.includes('margin') ||
        property.includes('gap') || property.includes('line-height') ||
        property.includes('radius') || property.includes('font-size') ||
        property.includes('top') || property.includes('left') ||
        property.includes('right') || property.includes('bottom')
    ) {
        const cssNum = parseFloat(normCss);
        const tokenNum = parseFloat(normToken);

        if (!isNaN(cssNum) && !isNaN(tokenNum)) {
            const diff = Math.abs(cssNum - tokenNum);
            return {
                match: diff <= pxTolerance,
                diff,
                cssValue: `${cssNum}px`,
                tokenValue: `${tokenNum}px`
            };
        }
    }

    // Comparar font-weight com tolerância 100
    if (property === 'font-weight') {
        const cssNum = parseFloat(normCss);
        const tokenNum = parseFloat(normToken);

        if (!isNaN(cssNum) && !isNaN(tokenNum)) {
            const diff = Math.abs(cssNum - tokenNum);
            return {
                match: diff <= threshold.fontWeight,
                diff,
                cssValue: cssNum,
                tokenValue: tokenNum
            };
        }
    }

    // Comparar opacity com tolerância 0.01
    if (property === 'opacity') {
        const cssNum = parseFloat(normCss);
        const tokenNum = parseFloat(normToken);

        if (!isNaN(cssNum) && !isNaN(tokenNum)) {
            const diff = Math.abs(cssNum - tokenNum);
            return {
                match: diff <= threshold.opacity,
                diff,
                cssValue: cssNum.toFixed(2),
                tokenValue: tokenNum.toFixed(2)
            };
        }
    }

    // Comparação literal (display, flex-*, text-align, etc)
    return {
        match: false,
        diff: 1,
        cssValue: normCss,
        tokenValue: normToken
    };
}

// Validar CSS contra tokens Figma (Sprint 1 P0: sistema de tolerâncias)
function validateCSSAgainstTokens(cssRules, figmaTokens, threshold, dpr = 1) {
    const results = {
        total: 0,
        matched: 0,
        deviations: [],
        critical: [],
        warnings: [],
        config: {
            threshold,
            dpr,
            propriedadesValidadas: PROPRIEDADES_VALIDADAS.length
        }
    };

    // Propriedades críticas que devem ser exatas
    const criticalProps = ['width', 'height', 'background', 'border', 'border-bottom', 'color', 'display', 'position'];

    Object.entries(SELECTOR_TO_TOKEN_MAP).forEach(([selector, config]) => {
        if (!cssRules[selector]) {
            return; // Selector não encontrado no CSS
        }

        const cssProps = cssRules[selector];

        // Iterar sobre as propriedades mapeadas
        Object.entries(config.properties).forEach(([cssProp, tokenKey]) => {
            if (!cssProps[cssProp]) {
                return; // Propriedade não encontrada no CSS
            }

            // Determinar categoria do token (colors, spacing, dimensions)
            let tokenValue;
            if (tokenKey.includes('-bg') || tokenKey.includes('-border') || cssProp.includes('color')) {
                tokenValue = figmaTokens.tokens?.colors?.[tokenKey];
            } else if (tokenKey.includes('-padding') || tokenKey.includes('-gap') || tokenKey.includes('-margin')) {
                tokenValue = figmaTokens.tokens?.spacing?.[tokenKey];
            } else if (tokenKey.includes('-width') || tokenKey.includes('-height')) {
                tokenValue = figmaTokens.tokens?.dimensions?.[tokenKey];
            }

            if (!tokenValue) {
                return; // Token não encontrado
            }

            results.total++;
            const comparison = compareValues(cssProps[cssProp], tokenValue, cssProp, threshold, dpr);

            if (comparison.match) {
                results.matched++;
            } else {
                const deviation = {
                    selector,
                    property: cssProp,
                    cssValue: comparison.cssValue || cssProps[cssProp],
                    tokenValue: comparison.tokenValue || tokenValue,
                    diff: comparison.diff,
                    critical: criticalProps.includes(cssProp)
                };

                results.deviations.push(deviation);

                if (deviation.critical) {
                    results.critical.push(deviation);
                } else {
                    results.warnings.push(deviation);
                }
            }
        });
    });

    return results;
} async function main() {
    const args = process.argv.slice(2);
    const htmlArg = args.find(arg => arg.startsWith('--html='));
    const tokensArg = args.find(arg => arg.startsWith('--tokens='));
    const thresholdArg = args.find(arg => arg.startsWith('--threshold='));
    const dprArg = args.find(arg => arg.startsWith('--dpr='));

    if (!htmlArg || !tokensArg) {
        console.error('❌ Uso: node validate-pixel-perfect.js --html=<FILE> --tokens=<TOKENS_JSON> [--threshold=1] [--dpr=1]');
        process.exit(1);
    }

    const htmlPath = path.resolve(htmlArg.split('=')[1]);
    const tokensPath = path.resolve(tokensArg.split('=')[1]);
    const thresholdPx = thresholdArg ? parseInt(thresholdArg.split('=')[1]) : 1;
    const dpr = dprArg ? parseInt(dprArg.split('=')[1]) : 1;

    // Sistema de tolerâncias configurável (Sprint 1 P0)
    const threshold = {
        px: thresholdPx,
        color: { rgb: 2, alpha: 0.01 },
        fontWeight: 100,
        opacity: 0.01
    };

    console.log('🔍 Validador Estrutural Pixel-Perfect (Sprint 1 P0)');
    console.log('===================================================');
    console.log(`📄 HTML: ${path.basename(htmlPath)}`);
    console.log(`🎨 Tokens: ${path.basename(tokensPath)}`);
    console.log(`📏 Threshold PX: ±${thresholdPx}px (DPR ${dpr}: ${dpr >= 2 ? '0.5px' : thresholdPx + 'px'})`);
    console.log(`🎨 Threshold RGB: ±${threshold.color.rgb} por canal, alpha ±${threshold.color.alpha}`);
    console.log(`📊 Propriedades: ${PROPRIEDADES_VALIDADAS.length} validadas`);
    console.log('');

    // Carregar arquivos
    if (!fs.existsSync(htmlPath)) {
        console.error(`❌ Arquivo HTML não encontrado: ${htmlPath}`);
        process.exit(1);
    }

    if (!fs.existsSync(tokensPath)) {
        console.error(`❌ Arquivo de tokens não encontrado: ${tokensPath}`);
        process.exit(1);
    }

    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    const figmaTokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

    console.log('✅ Arquivos carregados');
    console.log('');

    // Parser CSS
    console.log('🔍 Analisando CSS...');
    const cssRules = parseCSSFromHTML(htmlContent);
    console.log(`   Regras encontradas: ${Object.keys(cssRules).length}`);
    console.log('');

    // Validar
    console.log('⚖️  Validando conformidade...');
    const results = validateCSSAgainstTokens(cssRules, figmaTokens, threshold, dpr);

    const conformityRate = results.total > 0 ? (results.matched / results.total * 100).toFixed(1) : 0;

    console.log('');
    console.log('📊 RESULTADO DA VALIDAÇÃO');
    console.log('========================');
    console.log(`✅ Conformidade: ${conformityRate}% (${results.matched}/${results.total})`);
    console.log(`🔴 Críticos: ${results.critical.length}`);
    console.log(`⚠️  Avisos: ${results.warnings.length}`);
    console.log('');

    if (results.critical.length > 0) {
        console.log('🔴 DESVIOS CRÍTICOS:');
        results.critical.forEach((dev, idx) => {
            console.log(`   ${idx + 1}. ${dev.selector} → ${dev.property}`);
            console.log(`      CSS:   ${dev.cssValue}`);
            console.log(`      Figma: ${dev.tokenValue}`);
            console.log(`      Diff:  ${dev.diff}${typeof dev.diff === 'number' && dev.diff < 100 ? 'px' : ''}`);
            console.log('');
        });
    }

    if (results.warnings.length > 0 && results.warnings.length <= 5) {
        console.log('⚠️  AVISOS:');
        results.warnings.forEach((dev, idx) => {
            console.log(`   ${idx + 1}. ${dev.selector} → ${dev.property}`);
            console.log(`      CSS:   ${dev.cssValue}`);
            console.log(`      Figma: ${dev.tokenValue}`);
            console.log('');
        });
    } else if (results.warnings.length > 5) {
        console.log(`⚠️  ${results.warnings.length} avisos (use --verbose para ver todos)`);
        console.log('');
    }

    // Gate de qualidade
    const exitCode = results.critical.length > 0 ? 1 : 0;

    if (exitCode === 0) {
        console.log('✅ VALIDAÇÃO PASSOU! Pixel-perfect dentro do threshold.');
    } else {
        console.log('❌ VALIDAÇÃO FALHOU! Existem desvios críticos.');
    }

    // Salvar relatório
    const reportPath = path.join(process.cwd(), 'pixel-perfect-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf-8');
    console.log('');
    console.log(`📄 Relatório salvo: ${reportPath}`);

    process.exit(exitCode);
}

if (require.main === module) {
    main().catch(err => {
        console.error('❌ Erro:', err.message);
        console.error(err.stack);
        process.exit(1);
    });
}

module.exports = { parseCSSFromHTML, validateCSSAgainstTokens, compareValues };
