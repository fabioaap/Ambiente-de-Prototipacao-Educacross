#!/usr/bin/env node

/**
 * Health Check - Educacross
 * Verifica o estado geral do ambiente de desenvolvimento
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const checks = {
  passed: [],
  failed: [],
  warnings: []
};

function run(command, description) {
  try {
    execSync(command, { stdio: 'ignore' });
    checks.passed.push(`✅ ${description}`);
    return true;
  } catch (error) {
    checks.failed.push(`❌ ${description}`);
    return false;
  }
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    checks.passed.push(`✅ ${description}`);
    return true;
  } else {
    checks.failed.push(`❌ ${description}`);
    return false;
  }
}

function checkDir(dirPath, description, shouldNotExist = false) {
  const exists = fs.existsSync(dirPath);
  if (shouldNotExist) {
    if (!exists) {
      checks.passed.push(`✅ ${description}`);
      return true;
    } else {
      checks.warnings.push(`⚠️ ${description}`);
      return false;
    }
  } else {
    if (exists) {
      checks.passed.push(`✅ ${description}`);
      return true;
    } else {
      checks.failed.push(`❌ ${description}`);
      return false;
    }
  }
}

function checkSize(dirPath, maxSizeMB, description) {
  if (!fs.existsSync(dirPath)) {
    checks.passed.push(`✅ ${description} (não existe)`);
    return true;
  }
  
  try {
    const output = execSync(`du -sm "${dirPath}" | cut -f1`).toString().trim();
    const sizeMB = parseInt(output);
    
    if (sizeMB <= maxSizeMB) {
      checks.passed.push(`✅ ${description} (${sizeMB}MB)`);
      return true;
    } else {
      checks.warnings.push(`⚠️ ${description} (${sizeMB}MB > ${maxSizeMB}MB)`);
      return false;
    }
  } catch (error) {
    checks.warnings.push(`⚠️ ${description} (erro ao verificar)`);
    return false;
  }
}

console.log('\n🏥 HEALTH CHECK - Educacross\n');
console.log('================================================\n');

// 1. Verificar ferramentas essenciais
console.log('🔧 Ferramentas essenciais:');
run('node --version', 'Node.js instalado');
run('npm --version', 'npm instalado');
run('python3 --version', 'Python3 instalado');
run('git --version', 'Git instalado');

// 2. Verificar estrutura do projeto
console.log('\n📁 Estrutura do projeto:');
checkFile('package.json', 'package.json existe');
checkFile('tsconfig.json', 'tsconfig.json existe');
checkFile('.gitignore', '.gitignore existe');
checkDir('src', 'Diretório src/ existe');
checkDir('Front-office', 'Diretório Front-office/ existe');
checkDir('Back-office', 'Diretório Back-office/ existe');
checkDir('scripts', 'Diretório scripts/ existe');
checkDir('.github/workflows', 'Workflows CI/CD existem');

// 3. Verificar dependências
console.log('\n📦 Dependências:');
checkDir('node_modules', 'node_modules instalado (se não, rode npm install)', false);
if (fs.existsSync('node_modules')) {
  run('npm run check-deps', 'Dependências funcionando');
}

// 4. Verificar artifacts (não devem existir ou estar pequenos)
console.log('\n🧹 Limpeza de artifacts:');
checkDir('validation-artifacts', 'validation-artifacts/ removido ou ignorado', true);
checkSize('validation-artifacts', 5, 'validation-artifacts/ tamanho OK');
checkDir('test-results', 'test-results/ removido ou ignorado', true);
checkDir('.validation-cache', '.validation-cache/ removido ou ignorado', true);

// 5. Verificar scripts npm
console.log('\n📜 Scripts npm:');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['dev', 'build', 'test', 'typecheck', 'lint', 'clean'];
requiredScripts.forEach(script => {
  if (pkg.scripts[script]) {
    checks.passed.push(`✅ Script "${script}" existe`);
  } else {
    checks.failed.push(`❌ Script "${script}" ausente`);
  }
});

// 6. Verificar TypeScript
console.log('\n🔍 TypeScript:');
if (run('npm run typecheck', 'TypeScript check passou')) {
  // OK
} else {
  console.log('   ℹ️ Rode: npm run check-types para ver erros');
}

// 7. Verificar Git
console.log('\n🔀 Git:');
try {
  const status = execSync('git status --porcelain').toString().trim();
  if (status === '') {
    checks.passed.push('✅ Working tree limpo');
  } else {
    const lines = status.split('\n').length;
    checks.warnings.push(`⚠️ ${lines} arquivo(s) modificado(s)`);
  }
} catch (error) {
  checks.warnings.push('⚠️ Não foi possível verificar status Git');
}

// Relatório final
console.log('\n================================================');
console.log('\n📊 RESUMO:\n');

if (checks.passed.length > 0) {
  console.log('✅ PASSOU:');
  checks.passed.forEach(msg => console.log(`   ${msg}`));
}

if (checks.warnings.length > 0) {
  console.log('\n⚠️ AVISOS:');
  checks.warnings.forEach(msg => console.log(`   ${msg}`));
}

if (checks.failed.length > 0) {
  console.log('\n❌ FALHOU:');
  checks.failed.forEach(msg => console.log(`   ${msg}`));
}

const total = checks.passed.length + checks.failed.length + checks.warnings.length;
const score = ((checks.passed.length / total) * 100).toFixed(1);

console.log('\n================================================');
console.log(`\n🎯 SCORE: ${score}% (${checks.passed.length}/${total})\n`);

if (checks.failed.length > 0) {
  console.log('⚠️ Ação recomendada:');
  if (!fs.existsSync('node_modules')) {
    console.log('   1. npm install');
  }
  if (checks.failed.some(f => f.includes('TypeScript'))) {
    console.log('   2. npm run check-types');
  }
  if (checks.warnings.some(w => w.includes('artifacts'))) {
    console.log('   3. npm run clean');
  }
  console.log('   4. Consultar docs/DEVOPS-PRACTICES.md\n');
  
  process.exit(1);
}

console.log('✅ Sistema saudável! Pronto para desenvolvimento.\n');
process.exit(0);
