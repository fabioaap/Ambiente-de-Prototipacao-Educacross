#!/usr/bin/env node
/**
 * test-learning-system.cjs - Teste rápido do sistema de aprendizagem
 * 
 * Simula erros comuns para validar error-watcher + triage-issue
 * 
 * Uso: node scripts/learning/test-learning-system.cjs
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧪 Teste do Sistema de Aprendizagem Contínua\n');

// 1. Verificar estrutura
console.log('1️⃣ Verificando estrutura...');
const requiredFiles = [
    'scripts/learning/error-watcher.cjs',
    'scripts/learning/triage-issue.cjs',
    'scripts/learning/severity-rules.json',
    'docs/TECHNICAL_DEBT.json',
    'docs/TECHNICAL_DEBT.md'
];

let allExist = true;
requiredFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, '../../', file));
    console.log(`   ${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allExist = false;
});

if (!allExist) {
    console.error('\n❌ Arquivos faltando. Execute "npm run learning:setup" primeiro.');
    process.exit(1);
}

// 2. Simular erros no stderr
console.log('\n2️⃣ Simulando erros...');
const testErrors = [
    'Error: MCP Figma server not running',
    'Error: ENOENT: no such file or directory',
    'TypeError: Cannot read property of undefined',
    'Warning: SVG aspect ratio invalid'
];

const LOG_FILE = path.join(__dirname, '../../logs/error-log.jsonl');

testErrors.forEach((error, i) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        pattern: ['MCP_OFFLINE', 'PATH_CONFLICT', 'TYPE_ERROR', 'SVG_DISTORTION'][i],
        message: error,
        stack: `at test (test-learning-system.cjs:${50 + i}:10)`,
        pid: process.pid,
        env: 'test'
    };

    fs.appendFileSync(LOG_FILE, JSON.stringify(logEntry) + '\n', 'utf8');
    console.log(`   ✅ Simulado: ${logEntry.pattern}`);
});

// 3. Executar análise
console.log('\n3️⃣ Executando análise de triagem...');
try {
    const output = execSync('node scripts/learning/triage-issue.cjs --analyze', {
        cwd: path.join(__dirname, '../../'),
        encoding: 'utf8'
    });
    console.log(output);
} catch (error) {
    console.error('❌ Erro ao executar triage:', error.message);
    process.exit(1);
}

// 4. Validar TECHNICAL_DEBT.json
console.log('4️⃣ Validando TECHNICAL_DEBT.json...');
const DEBT_FILE = path.join(__dirname, '../../docs/TECHNICAL_DEBT.json');
const debt = JSON.parse(fs.readFileSync(DEBT_FILE, 'utf8'));

console.log(`   P0: ${debt.p0}`);
console.log(`   P1: ${debt.p1}`);
console.log(`   P2: ${debt.p2}`);
console.log(`   Status: ${debt.status}`);
console.log(`   Recovery Rate: ${debt.recoveryRate}%`);
console.log(`   Total Issues: ${debt.details.length}`);

// 5. Verificar alerts
console.log('\n5️⃣ Verificando alerts...');
if (debt.p0 > 0) {
    console.log('   🚨 CRITICAL: Issues P0 detectados!');
} else if (debt.p1 > 10) {
    console.log('   🚨 CRITICAL: Muitos issues P1 (>10)');
} else if (debt.p1 > 5) {
    console.log('   ⚠️  WARNING: Issues P1 acima do threshold (>5)');
} else {
    console.log('   ✅ HEALTHY: Sistema dentro dos parâmetros');
}

// 6. Testar dashboard
console.log('\n6️⃣ Dashboard disponível em:');
console.log('   🌐 http://localhost:8090 (se servidor rodando)');
console.log('   📄 docs/TECHNICAL_DEBT.md (Markdown)');
console.log('   📊 docs/TECHNICAL_DEBT.json (JSON)');

console.log('\n✅ Teste concluído com sucesso!\n');

console.log('📋 Próximos passos:');
console.log('   1. Abrir http://localhost:8090 e verificar dashboard visualmente');
console.log('   2. Executar "npm run dev" para testar error-watcher em background');
console.log('   3. Provocar erro intencional (ex: import inválido) e verificar captura');
console.log('   4. Executar "npm run learning:analyze" para ver triagem automática\n');
