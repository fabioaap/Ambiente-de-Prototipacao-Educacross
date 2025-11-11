const { missions } = require('../src/mocks/missions');
const hasNonZero = missions.some(m => m.progress !== 0);
if (hasNonZero) {
  console.error('\n❌ Erro: Todas as missões devem começar com progresso zerado para prototipação!\nEdite apenas src/mocks/missions.ts.\n');
  process.exit(1);
}
