#!/usr/bin/env node
/**
 * error-watcher.cjs - Sistema de captura de erros em background
 * 
 * Captura erros via stderr hook e registra em error-log.jsonl
 * Zero impacto na latência, 100% invisível para designers/PMs
 * 
 * Uso: node scripts/learning/error-watcher.cjs
 * Auto-start via package.json predev/prestorybook hooks
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../../logs/error-log.jsonl');
const ERROR_PATTERNS = [
    { name: 'MCP_OFFLINE', regex: /MCP.*not.*running|Figma.*offline/i },
    { name: 'PATH_CONFLICT', regex: /ENOENT.*no such file|Cannot find.*path/i },
    { name: 'SVG_DISTORTION', regex: /aspect.*ratio|viewBox.*invalid/i },
    { name: 'VALIDATION_FALSE_POSITIVE', regex: /validator.*failed|mismatch.*expected/i },
    { name: 'AUTH_FAILURE', regex: /authentication.*failed|401|403/i },
    { name: 'NETWORK_ERROR', regex: /ECONNREFUSED|ETIMEDOUT|fetch.*failed/i },
    { name: 'TYPE_ERROR', regex: /TypeError|undefined.*not.*function/i }
];

// Garantir que diretório de logs existe
const logsDir = path.dirname(LOG_FILE);
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Hook no stderr (não-bloqueante)
const originalStderrWrite = process.stderr.write.bind(process.stderr);
process.stderr.write = (chunk, encoding, callback) => {
    const message = chunk.toString();

    // Detectar padrões de erro
    const matchedPattern = ERROR_PATTERNS.find(p => p.regex.test(message));

    if (matchedPattern) {
        // Logging assíncrono (zero latência)
        setImmediate(() => {
            const logEntry = {
                timestamp: new Date().toISOString(),
                pattern: matchedPattern.name,
                message: message.trim().substring(0, 500), // Limitar tamanho
                stack: new Error().stack.split('\n').slice(2, 5).join('\n'), // Context
                pid: process.pid,
                env: process.env.NODE_ENV || 'development'
            };

            try {
                fs.appendFileSync(LOG_FILE, JSON.stringify(logEntry) + '\n', 'utf8');
            } catch (err) {
                // Silenciar erros de log (não interromper workflow)
            }
        });
    }

    // Passar para stderr original
    return originalStderrWrite(chunk, encoding, callback);
};

// Hook no process.on('uncaughtException')
process.on('uncaughtException', (error) => {
    const matchedPattern = ERROR_PATTERNS.find(p => p.regex.test(error.message));

    if (matchedPattern) {
        setImmediate(() => {
            const logEntry = {
                timestamp: new Date().toISOString(),
                pattern: matchedPattern.name,
                message: error.message,
                stack: error.stack,
                type: 'uncaughtException',
                pid: process.pid,
                env: process.env.NODE_ENV || 'development'
            };

            try {
                fs.appendFileSync(LOG_FILE, JSON.stringify(logEntry) + '\n', 'utf8');
            } catch (err) {
                // Silenciar
            }
        });
    }

    // Re-throw (não silenciar exceptions críticas)
    throw error;
});

// Heartbeat silencioso (verificar a cada 30 min que está rodando)
setInterval(() => {
    const heartbeat = {
        timestamp: new Date().toISOString(),
        type: 'heartbeat',
        pid: process.pid,
        uptime: process.uptime()
    };

    try {
        fs.appendFileSync(LOG_FILE, JSON.stringify(heartbeat) + '\n', 'utf8');
    } catch (err) {
        // Silenciar
    }
}, 30 * 60 * 1000);

console.log(`[error-watcher] Rodando em background (PID: ${process.pid})`);
console.log(`[error-watcher] Logs: ${LOG_FILE}`);

// Manter processo vivo
process.stdin.resume();
