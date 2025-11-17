#!/usr/bin/env node
/**
 * triage-issue.cjs - Sistema inteligente de triagem de issues
 * 
 * Classifica erros em P0/P1/P2/P3 baseado em:
 * - Severity (crítico, alto, médio, baixo)
 * - Effort (tempo estimado para fix)
 * - Blockage (bloqueia workflow?)
 * 
 * Decisões:
 * - P0: Fix imediato (≤5min, bloqueante, crítico)
 * - P1: Workaround + defer (>5min, bloqueante, crítico)
 * - P2: Technical debt (médio/alto esforço, não-bloqueante)
 * - P3: Log only (informacional, baixo impacto)
 * 
 * Uso: node scripts/learning/triage-issue.cjs --analyze
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../../logs/error-log.jsonl');
const DEBT_FILE = path.join(__dirname, '../../docs/TECHNICAL_DEBT.json');
const SEVERITY_RULES = path.join(__dirname, 'severity-rules.json');

/**
 * Classificar issue baseado em matriz severity × effort × blockage
 */
function classifyIssue(error) {
    // Carregar regras de severidade
    let rules = {};
    try {
        rules = JSON.parse(fs.readFileSync(SEVERITY_RULES, 'utf8'));
    } catch (err) {
        console.warn('severity-rules.json não encontrado, usando defaults');
        rules = getDefaultRules();
    }

    const pattern = error.pattern || 'UNKNOWN';
    const rule = rules[pattern] || rules.UNKNOWN;

    return {
        severity: rule.severity,
        effort: rule.effortMinutes,
        blockage: rule.blockage,
        impact: rule.impact,
        workaround: rule.workaround,
        permanentFix: rule.permanentFix
    };
}

/**
 * Decidir prioridade baseado em classification
 */
function decide(classification) {
    const { severity, effort, blockage } = classification;

    // P0: Crítico + Bloqueante + Quick fix
    if (severity === 'critical' && blockage === 'blocking' && effort <= 5) {
        return { priority: 'P0', action: 'FIX_NOW' };
    }

    // P1: Crítico + Bloqueante + Demorado
    if (severity === 'critical' && blockage === 'blocking' && effort > 5) {
        return { priority: 'P1', action: 'FIX_NOW_WORKAROUND' };
    }

    // P1: Alto + Bloqueante
    if (severity === 'high' && blockage === 'blocking') {
        return { priority: 'P1', action: 'FIX_NOW_WORKAROUND' };
    }

    // P2: Médio/Alto esforço + Não-bloqueante
    if ((severity === 'medium' || severity === 'high') && blockage !== 'blocking') {
        return { priority: 'P2', action: 'TECHNICAL_DEBT' };
    }

    // P3: Baixo impacto
    return { priority: 'P3', action: 'LOG_ONLY' };
}

/**
 * Adicionar issue ao backlog (TECHNICAL_DEBT.json)
 */
function addToBacklog(error, classification, decision) {
    let debt = {};
    try {
        debt = JSON.parse(fs.readFileSync(DEBT_FILE, 'utf8'));
    } catch (err) {
        console.warn('TECHNICAL_DEBT.json não encontrado, criando novo');
        debt = {
            p0: 0,
            p1: 0,
            p2: 0,
            effortHours: 0,
            recoveryRate: 0,
            status: 'healthy',
            lastUpdate: new Date().toISOString(),
            details: []
        };
    }

    // Verificar se issue já existe (por pattern + message)
    const existingIndex = debt.details.findIndex(d =>
        d.pattern === error.pattern &&
        d.message && error.message &&
        d.message.substring(0, 100) === error.message.substring(0, 100)
    );

    if (existingIndex >= 0) {
        // Incrementar recorrências
        debt.details[existingIndex].recurrences++;
        debt.details[existingIndex].lastSeen = error.timestamp;
    } else {
        // Nova issue
        const newIssue = {
            id: `${decision.priority}-${String(debt.details.length + 1).padStart(3, '0')}`,
            priority: decision.priority,
            pattern: error.pattern,
            title: classification.impact,
            impact: classification.impact,
            workaround: classification.workaround,
            permanentFix: classification.permanentFix,
            effortHours: classification.effort / 60,
            recurrences: 1,
            firstSeen: error.timestamp,
            lastSeen: error.timestamp,
            message: error.message.substring(0, 200),
            tags: [error.pattern.toLowerCase()]
        };

        debt.details.push(newIssue);

        // Atualizar contadores
        const priorityKey = decision.priority.toLowerCase();
        debt[priorityKey] = (debt[priorityKey] || 0) + 1;
        debt.effortHours += newIssue.effortHours;
    }

    // Atualizar timestamp
    debt.lastUpdate = new Date().toISOString();

    // Atualizar status
    if (debt.p0 > 0 || debt.p1 > 10) {
        debt.status = 'critical';
    } else if (debt.p1 > 5) {
        debt.status = 'warning';
    } else {
        debt.status = 'healthy';
    }

    // Salvar
    fs.writeFileSync(DEBT_FILE, JSON.stringify(debt, null, 2), 'utf8');

    return debt;
}

/**
 * Verificar thresholds para alerts
 */
function checkAlertThresholds(debt) {
    const alerts = [];

    if (debt.p0 > 0) {
        alerts.push({
            level: 'CRITICAL',
            message: `⚠️ ${debt.p0} issue(s) P0 requerem ação imediata!`,
            action: 'FIX_NOW'
        });
    }

    if (debt.p1 > 10) {
        alerts.push({
            level: 'CRITICAL',
            message: `⚠️ ${debt.p1} issues P1 acumulados (threshold: 10)`,
            action: 'REVIEW_BACKLOG'
        });
    }

    if (debt.p1 > 5) {
        alerts.push({
            level: 'WARNING',
            message: `⚠️ ${debt.p1} issues P1 pendentes (threshold: 5)`,
            action: 'WEEKLY_ALERT'
        });
    }

    return alerts;
}

/**
 * Analisar error-log.jsonl e triar issues
 */
function analyzeErrors() {
    if (!fs.existsSync(LOG_FILE)) {
        console.log('Nenhum erro para analisar (error-log.jsonl não encontrado)');
        return;
    }

    const lines = fs.readFileSync(LOG_FILE, 'utf8').split('\n').filter(Boolean);
    const errors = lines.map(line => {
        try {
            return JSON.parse(line);
        } catch {
            return null;
        }
    }).filter(e => e && e.pattern && e.type !== 'heartbeat');

    console.log(`\n📊 Analisando ${errors.length} erros...\n`);

    const triaged = { P0: [], P1: [], P2: [], P3: [] };

    errors.forEach(error => {
        const classification = classifyIssue(error);
        const decision = decide(classification);

        triaged[decision.priority].push({
            error,
            classification,
            decision
        });

        // Adicionar ao backlog se P0/P1/P2
        if (decision.priority !== 'P3') {
            addToBacklog(error, classification, decision);
        }
    });

    // Exibir resumo
    console.log('═══════════════════════════════════════');
    console.log('  RESUMO DE TRIAGEM');
    console.log('═══════════════════════════════════════');
    console.log(`P0 (Fix Now):          ${triaged.P0.length}`);
    console.log(`P1 (Workaround+Defer): ${triaged.P1.length}`);
    console.log(`P2 (Technical Debt):   ${triaged.P2.length}`);
    console.log(`P3 (Log Only):         ${triaged.P3.length}`);
    console.log('═══════════════════════════════════════\n');

    // Exibir P0 e P1 (ação requerida)
    if (triaged.P0.length > 0) {
        console.log('🚨 ISSUES P0 (AÇÃO IMEDIATA):');
        triaged.P0.forEach(({ error, classification }) => {
            console.log(`  - ${error.pattern}: ${classification.impact}`);
            console.log(`    Fix: ${classification.permanentFix}`);
        });
        console.log('');
    }

    if (triaged.P1.length > 0) {
        console.log('⚠️  ISSUES P1 (WORKAROUND + DEFER):');
        triaged.P1.forEach(({ error, classification }) => {
            console.log(`  - ${error.pattern}: ${classification.impact}`);
            console.log(`    Workaround: ${classification.workaround}`);
        });
        console.log('');
    }

    // Verificar alerts
    const debt = JSON.parse(fs.readFileSync(DEBT_FILE, 'utf8'));
    const alerts = checkAlertThresholds(debt);

    if (alerts.length > 0) {
        console.log('🔔 ALERTS:');
        alerts.forEach(alert => {
            console.log(`  [${alert.level}] ${alert.message}`);
        });
        console.log('');
    }

    console.log(`✅ TECHNICAL_DEBT.json atualizado`);
    console.log(`📊 Status: ${debt.status.toUpperCase()}`);
    console.log(`♻️  Auto-recovery rate: ${debt.recoveryRate}%\n`);
}

/**
 * Regras padrão de severidade
 */
function getDefaultRules() {
    return {
        MCP_OFFLINE: {
            severity: 'high',
            effortMinutes: 2,
            blockage: 'blocking',
            impact: 'MCP Figma offline, fallback para REST API lenta',
            workaround: 'Executar npm run mcp:check para auto-restart',
            permanentFix: 'Implementar auto-recovery em check-mcp-figma.cjs'
        },
        PATH_CONFLICT: {
            severity: 'medium',
            effortMinutes: 30,
            blockage: 'partial',
            impact: 'Assets salvos em diretório errado',
            workaround: 'Copiar manualmente para diretório correto',
            permanentFix: 'Consolidar diretórios duplicados'
        },
        SVG_DISTORTION: {
            severity: 'low',
            effortMinutes: 15,
            blockage: 'none',
            impact: 'Distorção visual em SVG logos',
            workaround: 'preserveAspectRatio="none" + CSS fixo',
            permanentFix: 'Usar height: auto para respeitar viewBox'
        },
        VALIDATION_FALSE_POSITIVE: {
            severity: 'high',
            effortMinutes: 60,
            blockage: 'blocking',
            impact: 'Validator compara HTML vs HTML ao invés de Figma',
            workaround: 'Validação manual via MCP',
            permanentFix: 'Refatorar dual-validate.cjs para usar MCP como source'
        },
        AUTH_FAILURE: {
            severity: 'critical',
            effortMinutes: 5,
            blockage: 'blocking',
            impact: 'Falha de autenticação bloqueia workflow',
            workaround: 'Reiniciar Figma Desktop',
            permanentFix: 'Token refresh automático'
        },
        UNKNOWN: {
            severity: 'medium',
            effortMinutes: 30,
            blockage: 'none',
            impact: 'Erro não classificado',
            workaround: 'Investigar logs',
            permanentFix: 'Adicionar pattern em severity-rules.json'
        }
    };
}

// CLI
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.includes('--analyze')) {
        analyzeErrors();
    } else {
        console.log('Uso: node triage-issue.cjs --analyze');
        process.exit(1);
    }
}

module.exports = { classifyIssue, decide, addToBacklog, checkAlertThresholds };
