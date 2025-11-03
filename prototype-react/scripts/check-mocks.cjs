const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'mocks', 'missions.ts');
let content = '';
try {
  content = fs.readFileSync(filePath, 'utf8');
} catch (err) {
  console.error(`\n❌ Erro: não foi possível ler ${filePath}: ${err.message}`);
  process.exit(1);
}

// Procura por ocorrências de progress: <number>
const re = /progress\s*:\s*(\d+)/g;
let match;
const nonZero = [];
while ((match = re.exec(content)) !== null) {
  const val = Number(match[1]);
  if (val !== 0) nonZero.push(val);
}

if (nonZero.length > 0) {
  console.error('\n❌ Erro: Encontrados valores de progresso diferentes de zero em src/mocks/missions.ts');
  console.error('Valores encontrados:', nonZero.join(', '));
  console.error('Edite apenas src/mocks/missions.ts para zerar os progressos antes de build.');
  process.exit(1);
}
