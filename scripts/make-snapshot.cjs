const fs = require('fs');
const path = require('path');

function pad(n) { return n.toString().padStart(2, '0'); }

function timestamp() {
    const d = new Date();
    return (
        d.getFullYear().toString() +
        pad(d.getMonth() + 1) +
        pad(d.getDate()) + '_' +
        pad(d.getHours()) +
        pad(d.getMinutes()) +
        pad(d.getSeconds())
    );
}

// Permite escolher a página do snapshot
// Opções:
//  - --page=modular (padrão) => habilidades-topicos.html
//  - --page=pixel => banco-questoes-pixel-perfect.html
//  - --page=<nome>.html => usa o HTML informado
const args = process.argv.slice(2);
const pageArg = args.find(a => a.startsWith('--page='));
const pageVal = pageArg ? pageArg.split('=')[1] : (process.env.SNAPSHOT_PAGE || 'modular');

let pageFile;
if (pageVal === 'pixel') {
    pageFile = 'banco-questoes-pixel-perfect.html';
} else if (pageVal === 'modular') {
    pageFile = 'habilidades-topicos.html';
} else if (pageVal.endsWith('.html')) {
    pageFile = pageVal;
} else {
    pageFile = 'habilidades-topicos.html';
}

const src = path.join('Back-office', 'Gerador de Questões por IA – BackOffice', pageFile);
const outDir = path.join('validation-artifacts', 'snapshots');

if (!fs.existsSync(src)) {
    console.error('Arquivo de origem não encontrado:', src);
    process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
const raw = fs.readFileSync(src, 'utf8');

// Injeta comentário + base href absoluto para servir via http.server na raiz do repo
const marker = '<head>';
const stamp = timestamp();
const inject = `${marker}\n    <!-- Snapshot gerado em ${stamp} -->\n    <base href="/Back-office/Gerador de Questões por IA – BackOffice/">`;
const withBase = raw.replace(marker, inject);

const baseName = path.basename(pageFile, '.html');
const outFile = path.join(outDir, `snapshot_${stamp}_${baseName}.html`);
fs.writeFileSync(outFile, withBase, 'utf8');

console.log('Snapshot criado:', outFile);