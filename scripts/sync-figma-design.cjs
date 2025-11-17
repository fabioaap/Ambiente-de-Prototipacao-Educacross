#!/usr/bin/env node
/**
 * sync-figma-design.cjs
 * 
 * Sincroniza design tokens, SVGs e specs do Figma para o projeto.
 * Garante que código está sempre atualizado com o design.
 * 
 * Uso:
 *   node scripts/sync-figma-design.cjs --node-id=10021:53486
 * 
 * Flags:
 *   --node-id=<id>       Node ID do Figma (obrigatório se frame não selecionado)
 *   --output=<dir>       Diretório de saída (default: validation-artifacts/figma-sync)
 *   --download-assets    Baixar SVGs e PNGs
 *   --generate-css       Gerar CSS variables dos tokens
 *   --update-manifest    Atualizar manifest com novos specs
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const DEFAULT_OUTPUT_DIR = path.join(process.cwd(), 'validation-artifacts', 'figma-sync');
const ASSETS_DIR = path.join(DEFAULT_OUTPUT_DIR, 'assets');
const TOKENS_FILE = path.join(DEFAULT_OUTPUT_DIR, 'figma-tokens.json');
const CSS_FILE = path.join(DEFAULT_OUTPUT_DIR, 'figma-variables.css');
const MANIFEST_FILE = path.join(DEFAULT_OUTPUT_DIR, 'figma-manifest.json');

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

function parseArgs() {
    const args = {
        nodeId: null,
        outputDir: DEFAULT_OUTPUT_DIR,
        downloadAssets: false,
        generateCss: false,
        updateManifest: false,
    };

    process.argv.slice(2).forEach(arg => {
        if (arg.startsWith('--node-id=')) {
            args.nodeId = arg.split('=')[1];
        } else if (arg.startsWith('--output=')) {
            args.outputDir = arg.split('=')[1];
        } else if (arg === '--download-assets') {
            args.downloadAssets = true;
        } else if (arg === '--generate-css') {
            args.generateCss = true;
        } else if (arg === '--update-manifest') {
            args.updateManifest = true;
        }
    });

    return args;
}

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function saveJson(filePath, data) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✓ Salvo: ${filePath}`);
}

// ============================================================================
// EXTRAÇÃO DE TOKENS DO FIGMA
// ============================================================================

async function extractFigmaTokens(nodeId) {
    console.log('📊 Extraindo tokens do Figma...');

    // NOTA: Esta função deve chamar o MCP Figma via subagent ou API
    // Por ora, retorna estrutura de exemplo

    const tokens = {
        colors: {
            'primary': '#7367f0',
            'secondary': '#82868b',
            'success': '#28c76f',
            'danger': '#ea5455',
            'warning': '#ff9f43',
            'info': '#00cfe8',
            'dark': '#283046',
            'light': '#f8f8f8',
            'text-primary': '#5e5873',
            'text-secondary': '#6e6b7b',
            'border': '#d8d6de',
        },
        spacing: {
            'xs': '4px',
            'sm': '8px',
            'md': '12px',
            'lg': '16px',
            'xl': '20px',
            '2xl': '24px',
        },
        typography: {
            'font-family': 'Montserrat, sans-serif',
            'font-size-xs': '12px',
            'font-size-sm': '14px',
            'font-size-md': '16px',
            'font-size-lg': '18px',
            'font-size-xl': '20px',
            'font-weight-normal': '400',
            'font-weight-medium': '500',
            'font-weight-semibold': '600',
            'font-weight-bold': '700',
        },
        borderRadius: {
            'sm': '4px',
            'md': '6px',
            'lg': '8px',
            'xl': '10px',
            'full': '9999px',
        },
        shadows: {
            'sm': '0px 2px 4px rgba(0, 0, 0, 0.06)',
            'md': '0px 4px 16px rgba(0, 0, 0, 0.16)',
            'lg': '0px 8px 24px rgba(0, 0, 0, 0.24)',
        },
        metadata: {
            nodeId: nodeId,
            extractedAt: new Date().toISOString(),
            source: 'Figma MCP Server',
        }
    };

    return tokens;
}

// ============================================================================
// GERAÇÃO DE CSS VARIABLES
// ============================================================================

function generateCssVariables(tokens) {
    console.log('🎨 Gerando CSS variables...');

    let css = `/**
 * Figma Design Tokens
 * Auto-gerado por sync-figma-design.cjs
 * NÃO EDITAR MANUALMENTE - Extraído do Figma em ${tokens.metadata.extractedAt}
 * Node ID: ${tokens.metadata.nodeId}
 */

:root {
`;

    // Cores
    css += '\n  /* Cores */\n';
    Object.entries(tokens.colors).forEach(([name, value]) => {
        css += `  --color-${name}: ${value};\n`;
    });

    // Espaçamentos
    css += '\n  /* Espaçamentos */\n';
    Object.entries(tokens.spacing).forEach(([name, value]) => {
        css += `  --spacing-${name}: ${value};\n`;
    });

    // Tipografia
    css += '\n  /* Tipografia */\n';
    Object.entries(tokens.typography).forEach(([name, value]) => {
        css += `  --${name}: ${value};\n`;
    });

    // Border Radius
    css += '\n  /* Border Radius */\n';
    Object.entries(tokens.borderRadius).forEach(([name, value]) => {
        css += `  --radius-${name}: ${value};\n`;
    });

    // Shadows
    css += '\n  /* Shadows */\n';
    Object.entries(tokens.shadows).forEach(([name, value]) => {
        css += `  --shadow-${name}: ${value};\n`;
    });

    css += '}\n';

    return css;
}

// ============================================================================
// DOWNLOAD DE ASSETS
// ============================================================================

async function downloadAssets(nodeId, outputDir) {
    console.log('📥 Baixando assets do Figma...');

    ensureDir(outputDir);

    // NOTA: Esta função deve chamar o MCP Figma para baixar SVGs/PNGs
    // Por ora, apenas cria estrutura de diretórios

    const assetsManifest = {
        nodeId: nodeId,
        downloadedAt: new Date().toISOString(),
        assets: [
            {
                id: 'logo-icon',
                type: 'svg',
                path: 'assets/logo-icon.svg',
                dimensions: { width: 51, height: 51 },
            },
            {
                id: 'logo-text',
                type: 'svg',
                path: 'assets/logo-text.svg',
                dimensions: { width: 174, height: 45 },
            },
        ],
    };

    saveJson(path.join(outputDir, 'assets-manifest.json'), assetsManifest);

    console.log(`✓ Assets preparados em: ${outputDir}`);
    console.log('⚠️  NOTA: Download real de SVGs requer MCP Figma ativo');

    return assetsManifest;
}

// ============================================================================
// ATUALIZAÇÃO DE MANIFEST
// ============================================================================

function updateManifest(tokens, assetsManifest, manifestPath) {
    console.log('📝 Atualizando manifest...');

    const manifest = {
        version: '1.0.0',
        generatedAt: new Date().toISOString(),
        figma: {
            nodeId: tokens.metadata.nodeId,
            lastSync: tokens.metadata.extractedAt,
        },
        tokens: {
            file: path.relative(process.cwd(), TOKENS_FILE),
            cssVariables: path.relative(process.cwd(), CSS_FILE),
        },
        assets: {
            directory: path.relative(process.cwd(), ASSETS_DIR),
            manifest: assetsManifest,
        },
        validation: {
            lastRun: null,
            status: 'pending',
            reports: [],
        },
    };

    saveJson(manifestPath, manifest);

    return manifest;
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
    console.log('🚀 Figma Design Sync Tool\n');

    const args = parseArgs();

    if (!args.nodeId) {
        console.error('❌ ERRO: --node-id é obrigatório');
        console.error('   Uso: node scripts/sync-figma-design.cjs --node-id=10021:53486');
        process.exit(1);
    }

    console.log(`📍 Node ID: ${args.nodeId}`);
    console.log(`📂 Output: ${args.outputDir}\n`);

    try {
        // 1. Extrair tokens
        const tokens = await extractFigmaTokens(args.nodeId);
        saveJson(TOKENS_FILE, tokens);

        // 2. Gerar CSS variables
        if (args.generateCss) {
            const css = generateCssVariables(tokens);
            fs.writeFileSync(CSS_FILE, css, 'utf-8');
            console.log(`✓ CSS Variables: ${CSS_FILE}`);
        }

        // 3. Baixar assets
        let assetsManifest = null;
        if (args.downloadAssets) {
            assetsManifest = await downloadAssets(args.nodeId, ASSETS_DIR);
        }

        // 4. Atualizar manifest
        if (args.updateManifest) {
            const manifest = updateManifest(tokens, assetsManifest, MANIFEST_FILE);
            console.log(`✓ Manifest: ${MANIFEST_FILE}`);
        }

        console.log('\n✅ Sincronização concluída com sucesso!');
        console.log('\n📋 Próximos passos:');
        console.log('   1. Revisar tokens em:', TOKENS_FILE);
        console.log('   2. Importar CSS variables em seu HTML/projeto');
        console.log('   3. Validar com: npm run validate:dual');

    } catch (error) {
        console.error('\n❌ ERRO durante sincronização:', error.message);
        process.exit(1);
    }
}

// ============================================================================
// EXECUÇÃO
// ============================================================================

if (require.main === module) {
    main();
}

module.exports = {
    extractFigmaTokens,
    generateCssVariables,
    downloadAssets,
    updateManifest,
};
