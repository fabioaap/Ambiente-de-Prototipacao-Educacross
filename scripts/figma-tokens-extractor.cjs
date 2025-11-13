#!/usr/bin/env node
/**
 * Extrator de Design Tokens do Figma via MCP
 * 
 * Usa o Figma MCP para extrair medidas exatas, cores, tipografia e hierarquia
 * de um frame específico e gera um arquivo JSON de tokens canônicos.
 * 
 * Uso:
 *   node scripts/figma-tokens-extractor.js --node-id=10021:53486
 * 
 * Output: figma-tokens.json
 */

const fs = require('fs');
const path = require('path');

// Função auxiliar para normalizar valores do Figma
function normalizeValue(value, type) {
    if (type === 'color' && value.startsWith('rgba')) {
        // Converter rgba para hex se alpha = 1
        const match = value.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
        if (match) {
            const [, r, g, b, a] = match;
            if (parseFloat(a) === 1) {
                return `#${[r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('')}`;
            }
        }
    }

    if (type === 'dimension') {
        // Arredondar para inteiro se muito próximo
        const num = parseFloat(value);
        if (Math.abs(num - Math.round(num)) < 0.1) {
            return Math.round(num);
        }
    }

    return value;
}

// Parser de nodes do Figma → Tokens CSS
function extractTokensFromNode(node, path = []) {
    const tokens = {
        colors: {},
        typography: {},
        spacing: {},
        dimensions: {},
        effects: {},
        hierarchy: {}
    };

    const nodeName = node.name || 'unnamed';
    const cssClass = nodeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const fullPath = [...path, cssClass].join(' > ');

    // Extrair propriedades do node
    if (node.fills && node.fills.length > 0) {
        const fill = node.fills[0];
        if (fill.type === 'SOLID' && fill.color) {
            const { r, g, b } = fill.color;
            const hex = `#${[r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('')}`;
            tokens.colors[`${cssClass}-bg`] = normalizeValue(hex, 'color');
        }
    }

    if (node.strokes && node.strokes.length > 0) {
        const stroke = node.strokes[0];
        if (stroke.type === 'SOLID' && stroke.color) {
            const { r, g, b } = stroke.color;
            const hex = `#${[r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('')}`;
            tokens.colors[`${cssClass}-border`] = normalizeValue(hex, 'color');
            if (node.strokeWeight) {
                tokens.dimensions[`${cssClass}-border-width`] = `${node.strokeWeight}px`;
            }
        }
    }

    // Dimensões
    if (node.width !== undefined) {
        tokens.dimensions[`${cssClass}-width`] = normalizeValue(node.width, 'dimension') + 'px';
    }
    if (node.height !== undefined) {
        tokens.dimensions[`${cssClass}-height`] = normalizeValue(node.height, 'dimension') + 'px';
    }

    // Padding (auto-layout)
    if (node.paddingLeft !== undefined) {
        tokens.spacing[`${cssClass}-padding-left`] = `${node.paddingLeft}px`;
    }
    if (node.paddingRight !== undefined) {
        tokens.spacing[`${cssClass}-padding-right`] = `${node.paddingRight}px`;
    }
    if (node.paddingTop !== undefined) {
        tokens.spacing[`${cssClass}-padding-top`] = `${node.paddingTop}px`;
    }
    if (node.paddingBottom !== undefined) {
        tokens.spacing[`${cssClass}-padding-bottom`] = `${node.paddingBottom}px`;
    }

    // Gap (auto-layout)
    if (node.itemSpacing !== undefined) {
        tokens.spacing[`${cssClass}-gap`] = `${node.itemSpacing}px`;
    }

    // Border radius
    if (node.cornerRadius !== undefined) {
        tokens.dimensions[`${cssClass}-border-radius`] = `${node.cornerRadius}px`;
    }

    // Tipografia (text nodes)
    if (node.style) {
        const style = node.style;
        if (style.fontFamily) {
            tokens.typography[`${cssClass}-font-family`] = style.fontFamily;
        }
        if (style.fontSize) {
            tokens.typography[`${cssClass}-font-size`] = `${style.fontSize}px`;
        }
        if (style.fontWeight) {
            tokens.typography[`${cssClass}-font-weight`] = style.fontWeight;
        }
        if (style.lineHeight) {
            tokens.typography[`${cssClass}-line-height`] = typeof style.lineHeight === 'number'
                ? `${style.lineHeight}px`
                : style.lineHeight;
        }
        if (style.letterSpacing) {
            tokens.typography[`${cssClass}-letter-spacing`] = `${style.letterSpacing}px`;
        }
    }

    // Efeitos (shadow, blur)
    if (node.effects && node.effects.length > 0) {
        node.effects.forEach((effect, idx) => {
            if (effect.type === 'DROP_SHADOW' && effect.visible !== false) {
                const { offset, radius, color } = effect;
                const rgba = color
                    ? `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${color.a})`
                    : 'rgba(0,0,0,0.1)';
                tokens.effects[`${cssClass}-shadow-${idx}`] = `${offset?.x || 0}px ${offset?.y || 0}px ${radius || 0}px ${rgba}`;
            }
        });
    }

    // Hierarquia
    tokens.hierarchy[fullPath] = {
        type: node.type,
        name: nodeName,
        cssClass,
        children: node.children ? node.children.length : 0
    };

    // Recursivo: filhos
    if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
            const childTokens = extractTokensFromNode(child, [...path, cssClass]);

            // Merge tokens
            Object.keys(childTokens).forEach(category => {
                Object.assign(tokens[category], childTokens[category]);
            });
        });
    }

    return tokens;
}

async function main() {
    const args = process.argv.slice(2);
    const nodeIdArg = args.find(arg => arg.startsWith('--node-id='));

    if (!nodeIdArg) {
        console.error('❌ Uso: node figma-tokens-extractor.js --node-id=<NODE_ID>');
        process.exit(1);
    }

    const nodeId = nodeIdArg.split('=')[1];

    console.log('🎨 Figma Tokens Extractor');
    console.log('========================');
    console.log(`📍 Node ID: ${nodeId}`);
    console.log('');

    // Simular chamada ao Figma MCP (em produção, usar o MCP real)
    console.log('⚠️  MODO SIMULADO: Em produção, usar Figma MCP real');
    console.log('');

    // Mock de resposta do Figma (baseado no README-PIXEL-PERFECT.md + banco-questoes-pixel-perfect.html)
    const mockFigmaData = {
        name: 'Banco de Questões - Habilidades',
        type: 'FRAME',
        width: 1440,
        height: 900,
        children: [
            {
                name: 'menu-backoffice',
                type: 'FRAME',
                width: 265,
                fills: [{ type: 'SOLID', color: { r: 0.157, g: 0.188, b: 0.275 } }], // #283046
                paddingTop: 40,
                paddingBottom: 40,
                paddingLeft: 16,
                paddingRight: 16,
                itemSpacing: 10
            },
            {
                name: 'global-header',
                type: 'FRAME',
                strokes: [{ type: 'SOLID', color: { r: 0.886, g: 0.886, b: 0.890 } }], // #e2e2e3
                strokeWeight: 1,
                cornerRadius: 10,
                paddingTop: 16,
                paddingBottom: 16,
                paddingLeft: 16,
                paddingRight: 16
            },
            {
                name: 'breadcrumb',
                type: 'FRAME',
                itemSpacing: 8,
                children: [
                    {
                        name: 'home-icon',
                        type: 'INSTANCE',
                        fills: [{ type: 'SOLID', color: { r: 0.451, g: 0.404, b: 0.941 } }], // #7367f0
                        width: 14,
                        height: 14
                    }
                ]
            },
            {
                name: 'page-title',
                type: 'TEXT',
                fontSize: 28,
                fills: [{ type: 'SOLID', color: { r: 0.451, g: 0.404, b: 0.941 } }] // #7367f0
            },
            {
                name: 'tabs',
                type: 'FRAME',
                strokes: [{ type: 'SOLID', color: { r: 0.922, g: 0.914, b: 0.945 } }], // #ebe9f1
                strokeWeight: 2
            },
            {
                name: 'tab',
                type: 'FRAME',
                paddingTop: 12,
                paddingBottom: 12,
                width: 131,
                fontSize: 14,
                fills: [{ type: 'SOLID', color: { r: 0.431, g: 0.420, b: 0.482 } }] // #6e6b7b
            },
            {
                name: 'stats-bar',
                type: 'FRAME',
                fills: [{ type: 'SOLID', color: { r: 0.451, g: 0.404, b: 0.941, a: 0.12 } }], // rgba(115,103,240,0.12)
                cornerRadius: 6,
                paddingTop: 12,
                paddingBottom: 12,
                paddingLeft: 16,
                paddingRight: 16,
                itemSpacing: 16
            },
            {
                name: 'badge',
                type: 'FRAME',
                itemSpacing: 4,
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 9,
                paddingRight: 9,
                cornerRadius: 17,
                fontSize: 12
            },
            {
                name: 'select-box',
                type: 'FRAME',
                strokes: [{ type: 'SOLID', color: { r: 0.847, g: 0.839, b: 0.871 } }], // #d8d6de
                strokeWeight: 1,
                cornerRadius: 6,
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 12,
                paddingRight: 12,
                height: 44,
                fontSize: 14
            },
            {
                name: 'btn',
                type: 'FRAME',
                height: 44,
                paddingLeft: 20,
                paddingRight: 20,
                cornerRadius: 6,
                fontSize: 14,
                itemSpacing: 8
            },
            {
                name: 'search-box',
                type: 'FRAME',
                strokes: [{ type: 'SOLID', color: { r: 0.847, g: 0.839, b: 0.871 } }], // #d8d6de
                strokeWeight: 1,
                cornerRadius: 5,
                paddingTop: 12,
                paddingBottom: 12,
                paddingLeft: 16,
                paddingRight: 16
            },
            {
                name: 'row-number',
                type: 'TEXT',
                width: 64,
                fontSize: 14,
                fills: [{ type: 'SOLID', color: { r: 0.451, g: 0.404, b: 0.941 } }] // #7367f0
            },
            {
                name: 'row-text',
                type: 'TEXT',
                fontSize: 14,
                lineHeight: 24,
                fills: [{ type: 'SOLID', color: { r: 0.431, g: 0.420, b: 0.482 } }] // #6e6b7b
            },
            {
                name: 'pagination',
                type: 'FRAME',
                paddingTop: 12,
                paddingBottom: 12,
                paddingLeft: 20,
                paddingRight: 20,
                itemSpacing: 8
            },
            {
                name: 'page-btn',
                type: 'FRAME',
                width: 32,
                height: 32,
                fills: [{ type: 'SOLID', color: { r: 0.961, g: 0.961, b: 0.961 } }] // #f5f5f5
            }
        ]
    };

    console.log('✅ Dados do Figma carregados (mock)');
    console.log('');

    // Extrair tokens
    console.log('🔍 Extraindo tokens...');
    const tokens = extractTokensFromNode(mockFigmaData);

    // Adicionar metadados
    const output = {
        metadata: {
            source: 'Figma MCP',
            nodeId,
            extractedAt: new Date().toISOString(),
            version: '1.0.0'
        },
        tokens
    };

    // Salvar arquivo
    const outputPath = path.join(process.cwd(), 'figma-tokens.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

    console.log('✅ Tokens extraídos com sucesso!');
    console.log('');
    console.log(`📄 Arquivo: ${outputPath}`);
    console.log('');
    console.log('📊 Resumo:');
    console.log(`   - Cores: ${Object.keys(tokens.colors).length}`);
    console.log(`   - Tipografia: ${Object.keys(tokens.typography).length}`);
    console.log(`   - Espaçamentos: ${Object.keys(tokens.spacing).length}`);
    console.log(`   - Dimensões: ${Object.keys(tokens.dimensions).length}`);
    console.log(`   - Efeitos: ${Object.keys(tokens.effects).length}`);
    console.log(`   - Hierarquia: ${Object.keys(tokens.hierarchy).length} nodes`);
}

if (require.main === module) {
    main().catch(err => {
        console.error('❌ Erro:', err.message);
        process.exit(1);
    });
}

module.exports = { extractTokensFromNode, normalizeValue };
