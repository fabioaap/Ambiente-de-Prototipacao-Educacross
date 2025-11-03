#!/usr/bin/env node

/**
 * Script de verificação de ambiente para garantir que tudo está funcionando
 * Executado automaticamente antes do build e disponível para usuários não-técnicos
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando ambiente do projeto...\n');

const checks = [
  {
    name: 'Dependências instaladas',
    command: 'npm list --depth=0',
    success: '✅ Dependências OK'
  },
  {
    name: 'TypeScript compila sem erros',
    command: 'npx tsc --noEmit',
    success: '✅ TypeScript OK'
  },
  {
    name: 'Testes passam',
    command: 'npm run test -- --run',
    success: '✅ Testes OK'
  },
  {
    name: 'Build de produção funciona',
    command: 'npm run build',
    success: '✅ Build OK'
  }
];

let allPassed = true;

for (const check of checks) {
  try {
    console.log(`⏳ ${check.name}...`);
    execSync(check.command, { stdio: 'pipe' });
    console.log(`${check.success}\n`);
  } catch (error) {
    console.error(`❌ ${check.name}:`);
    console.error(error.stdout?.toString() || error.message);
    console.error('');
    allPassed = false;
  }
}

if (allPassed) {
  console.log('🎉 Ambiente verificado com sucesso! Tudo está funcionando.');
  console.log('\n💡 Para rodar o projeto:');
  console.log('   npm run dev        # Desenvolvimento');
  console.log('   npm run build      # Build de produção');
  console.log('   npm run test       # Executar testes');
  console.log('   npm run storybook  # Storybook');
  process.exit(0);
} else {
  console.error('💥 Ambiente com problemas! Verifique os erros acima.');
  console.error('\n🔧 Soluções comuns:');
  console.error('   npm install        # Instalar dependências');
  console.error('   npm run check-env  # Verificar novamente');
  process.exit(1);
}