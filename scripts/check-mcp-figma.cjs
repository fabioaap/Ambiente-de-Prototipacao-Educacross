#!/usr/bin/env node

/**
 * Script para verificar status do MCP Figma e tentar recuperação automática
 * 
 * Uso:
 *   node scripts/check-mcp-figma.cjs
 *   node scripts/check-mcp-figma.cjs --auto-recover
 * 
 * Exit codes:
 *   0 - MCP Figma ativo
 *   1 - MCP Figma desabilitado (mas processo rodando)
 *   2 - MCP Figma processo não encontrado
 *   3 - Erro de recuperação
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Cores para output
const COLORS = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function logHeader(message) {
    console.log('\n' + '='.repeat(60));
    log(message, 'cyan');
    console.log('='.repeat(60) + '\n');
}

/**
 * Verifica se processo MCP Figma está rodando no Windows
 */
function checkMcpProcess() {
    logHeader('🔍 Verificando processo MCP Figma');

    try {
        const output = execSync(
            'powershell -Command "Get-Process | Where-Object { $_.ProcessName -like \'*figma*\' -or $_.MainWindowTitle -like \'*figma*\' } | Select-Object Id, ProcessName, MainWindowTitle | ConvertTo-Json"',
            { encoding: 'utf-8', stdio: 'pipe' }
        );

        if (output.trim()) {
            const processes = JSON.parse(output);
            const processList = Array.isArray(processes) ? processes : [processes];

            log('✅ Processos Figma encontrados:', 'green');
            processList.forEach(proc => {
                console.log(`   - PID: ${proc.Id} | ${proc.ProcessName} | ${proc.MainWindowTitle || '(sem janela)'}`);
            });

            return { active: true, processes: processList };
        } else {
            log('⚠️  Nenhum processo Figma encontrado', 'yellow');
            return { active: false, processes: [] };
        }
    } catch (error) {
        log('❌ Erro ao verificar processos: ' + error.message, 'red');
        return { active: false, processes: [], error: error.message };
    }
}

/**
 * Verifica se aplicativo Figma Desktop está aberto
 */
function checkFigmaApp() {
    logHeader('🎨 Verificando Figma Desktop App');

    try {
        const output = execSync(
            'powershell -Command "Get-Process | Where-Object { $_.ProcessName -eq \'Figma\' } | Select-Object Id, ProcessName, Path | ConvertTo-Json"',
            { encoding: 'utf-8', stdio: 'pipe' }
        );

        if (output.trim()) {
            const figmaProcess = JSON.parse(output);
            const processes = Array.isArray(figmaProcess) ? figmaProcess : [figmaProcess];

            log('✅ Figma Desktop ativo:', 'green');
            processes.forEach(proc => {
                console.log(`   - PID: ${proc.Id} | ${proc.Path || 'Caminho não disponível'}`);
            });

            return { active: true, processes };
        } else {
            log('⚠️  Figma Desktop não está aberto', 'yellow');
            return { active: false, processes: [] };
        }
    } catch (error) {
        log('⚠️  Figma Desktop não encontrado', 'yellow');
        return { active: false, processes: [] };
    }
}

/**
 * Verifica configuração do VS Code para MCP
 */
function checkVsCodeConfig() {
    logHeader('⚙️  Verificando configuração VS Code');

    const vscodeConfigPaths = [
        path.join(process.env.APPDATA, 'Code', 'User', 'settings.json'),
        path.join(process.env.USERPROFILE, '.vscode', 'settings.json'),
    ];

    for (const configPath of vscodeConfigPaths) {
        if (fs.existsSync(configPath)) {
            try {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

                // Procurar por configurações MCP
                const mcpKeys = Object.keys(config).filter(key =>
                    key.toLowerCase().includes('mcp') || key.toLowerCase().includes('figma')
                );

                if (mcpKeys.length > 0) {
                    log('✅ Configurações MCP/Figma encontradas:', 'green');
                    mcpKeys.forEach(key => {
                        console.log(`   - ${key}: ${JSON.stringify(config[key]).substring(0, 100)}`);
                    });

                    return { found: true, path: configPath, keys: mcpKeys };
                }
            } catch (error) {
                log(`⚠️  Erro ao ler ${configPath}: ${error.message}`, 'yellow');
            }
        }
    }

    log('⚠️  Nenhuma configuração MCP encontrada no VS Code', 'yellow');
    return { found: false };
}

/**
 * Tenta iniciar Figma Desktop se não estiver rodando
 */
function startFigmaApp() {
    logHeader('🚀 Tentando iniciar Figma Desktop');

    const figmaAppPaths = [
        path.join(process.env.LOCALAPPDATA, 'Figma', 'Figma.exe'),
        path.join(process.env.PROGRAMFILES, 'Figma', 'Figma.exe'),
        'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\Figma\\Figma.exe',
    ];

    for (const appPath of figmaAppPaths) {
        if (fs.existsSync(appPath)) {
            try {
                log(`📂 Encontrado: ${appPath}`, 'cyan');
                log('🔄 Iniciando Figma...', 'cyan');

                execSync(`start "" "${appPath}"`, { stdio: 'inherit' });

                log('✅ Figma iniciado com sucesso', 'green');
                log('⏳ Aguarde alguns segundos para o app carregar...', 'yellow');

                return { success: true, path: appPath };
            } catch (error) {
                log(`❌ Erro ao iniciar Figma: ${error.message}`, 'red');
                return { success: false, error: error.message };
            }
        }
    }

    log('❌ Executável do Figma não encontrado', 'red');
    log('   Instale o Figma Desktop em: https://www.figma.com/downloads/', 'yellow');

    return { success: false, error: 'Figma.exe não encontrado' };
}

/**
 * Gera relatório de status
 */
function generateReport(mcpCheck, figmaCheck, vscodeCheck) {
    logHeader('📊 RELATÓRIO DE STATUS');

    const status = {
        timestamp: new Date().toISOString(),
        mcp_process: mcpCheck.active ? 'ATIVO' : 'INATIVO',
        figma_app: figmaCheck.active ? 'ABERTO' : 'FECHADO',
        vscode_config: vscodeCheck.found ? 'ENCONTRADO' : 'NÃO ENCONTRADO',
        recommendation: '',
    };

    // Determinar recomendação
    if (!figmaCheck.active) {
        status.recommendation = 'INICIAR_FIGMA_APP';
        log('⚠️  AÇÃO NECESSÁRIA: Abrir Figma Desktop', 'yellow');
    } else if (!vscodeCheck.found) {
        status.recommendation = 'CONFIGURAR_MCP_VSCODE';
        log('⚠️  AÇÃO NECESSÁRIA: Configurar MCP no VS Code', 'yellow');
    } else if (!mcpCheck.active) {
        status.recommendation = 'RECARREGAR_VSCODE';
        log('⚠️  AÇÃO NECESSÁRIA: Recarregar VS Code (Ctrl+Shift+P → Reload Window)', 'yellow');
    } else {
        status.recommendation = 'OK';
        log('✅ Sistema MCP Figma operacional', 'green');
    }

    return status;
}

/**
 * Main execution
 */
async function main() {
    const autoRecover = process.argv.includes('--auto-recover');

    logHeader('🔧 MCP Figma Status Check & Auto-Recovery');
    log(`Modo: ${autoRecover ? 'AUTO-RECOVERY' : 'CHECK ONLY'}`, 'cyan');

    // Passo 1: Verificar processos
    const mcpCheck = checkMcpProcess();
    const figmaCheck = checkFigmaApp();
    const vscodeCheck = checkVsCodeConfig();

    // Passo 2: Tentar recuperação se habilitado
    if (autoRecover && !figmaCheck.active) {
        const startResult = startFigmaApp();

        if (startResult.success) {
            // Aguardar 5 segundos para app carregar
            log('\n⏳ Aguardando Figma carregar (5s)...', 'cyan');
            await new Promise(resolve => setTimeout(resolve, 5000));

            // Re-verificar
            const recheckFigma = checkFigmaApp();
            if (recheckFigma.active) {
                log('✅ Figma agora está ativo', 'green');
            }
        }
    }

    // Passo 3: Gerar relatório
    const report = generateReport(mcpCheck, figmaCheck, vscodeCheck);

    // Salvar relatório
    const reportPath = path.join(__dirname, '..', 'validation-artifacts', 'mcp-figma-status.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    log(`\n💾 Relatório salvo em: ${reportPath}`, 'cyan');

    // Exit code baseado no status
    if (report.recommendation === 'OK') {
        process.exit(0);
    } else if (figmaCheck.active) {
        process.exit(1); // MCP desabilitado mas Figma rodando
    } else {
        process.exit(2); // Figma não rodando
    }
}

main().catch(error => {
    log(`\n❌ ERRO CRÍTICO: ${error.message}`, 'red');
    console.error(error);
    process.exit(3);
});
