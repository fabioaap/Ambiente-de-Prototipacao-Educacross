#!/usr/bin/env node
/**
 * MVP Validador Figma-first (sem browser):
 * - Lê HTML alvo e extrai CSS inline
 * - Compara regras esperadas de cor/fundo para seletores chave
 * - Audita SVGs referenciados para uso de currentColor
 * - Gera relatório JSON + HTML em validation-artifacts/figma-first
 */
const fs = require('fs');
const path = require('path');

function readJson(p) {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function ensureDir(dir) {
    fs.mkdirSync(dir, { recursive: true });
}

function normalize(str, { caseInsensitive = true, whitespaceInsensitive = true } = {}) {
    if (typeof str !== 'string') return str;
    let out = str;
    if (whitespaceInsensitive) out = out.replace(/\s+/g, ' ').trim();
    if (caseInsensitive) out = out.toLowerCase();
    // Normaliza aspas para evitar divergência entre ' e " em seletores
    out = out.replace(/["']/g, '');
    return out;
}

function extractStyles(html) {
    const styles = [];
    const re = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let m;
    while ((m = re.exec(html))) styles.push(m[1]);
    return styles.join('\n');
}

function containsRule(cssText, selector, declKey, declValue, tol) {
    const nCss = normalize(cssText, tol.cssMatch);
    const nSel = normalize(selector, tol.cssMatch);
    const nKey = normalize(declKey, tol.cssMatch);
    const nVal = normalize(declValue, tol.cssMatch);
    // Heurística simples: procurar bloco contendo seletor e ambas key/value
    // Ex.: ".badge { background: rgba(...); color: #7367f0; }"
    return (
        nCss.includes(nSel) &&
        nCss.includes(`${nKey}: ${nVal}`)
    );
}

function auditCssExpectations(cssText, pageSpec, tolerances) {
    const results = [];
    const { checks } = pageSpec;
    // Badges
    if (checks.badges) {
        const expected = checks.badges.expected;
        for (const sel of Object.keys(expected)) {
            const exp = expected[sel];
            for (const [k, v] of Object.entries(exp)) {
                const ok = containsRule(cssText, sel, k, v, tolerances);
                results.push({ area: 'badges', selector: sel, prop: k, expected: v, pass: ok });
            }
        }
    }
    // Stats bar
    if (checks.statsBar) {
        const expected = checks.statsBar.expected;
        for (const sel of Object.keys(expected)) {
            const exp = expected[sel];
            for (const [k, v] of Object.entries(exp)) {
                const ok = containsRule(cssText, sel, k, v, tolerances);
                results.push({ area: 'statsBar', selector: sel, prop: k, expected: v, pass: ok });
            }
        }
    }
    return results;
}

function findSvgRefs(html, baseDir) {
    const refs = new Set();
    const re = /src\s*=\s*"([^"]+\.svg)"/gi;
    let m;
    while ((m = re.exec(html))) {
        const rel = m[1];
        const abs = path.resolve(baseDir, rel);
        if (fs.existsSync(abs)) refs.add(abs);
    }
    return Array.from(refs);
}

function auditSvgFile(svgPath, tolerances) {
    // Ignorar SVGs definidos como exceção (e.g., logos com cores próprias)
    const ignore = (tolerances.svgAudit && tolerances.svgAudit.ignore) || [];
    const normalizedPath = svgPath.replace(/\\/g, '/');
    if (ignore.some(substr => normalizedPath.includes(substr))) {
        return { file: svgPath, issues: ["ignorado por configuração"], pass: true };
    }
    const raw = fs.readFileSync(svgPath, 'utf8');
    const out = { file: svgPath, issues: [], pass: true };
    const n = normalize(raw, tolerances.cssMatch);
    // Se houver fill/stroke que não seja currentColor ou none, reportar
    const attrRe = /(fill|stroke)\s*=\s*"([^"]+)"/gi;
    let m;
    while ((m = attrRe.exec(n))) {
        const attr = m[1];
        const val = m[2];
        const allowed = ['currentcolor', 'none'];
        if (!allowed.includes(val)) {
            out.pass = false;
            out.issues.push(`${attr}="${val}" deve usar currentColor ou none`);
        }
    }
    return out;
}

function buildHtmlReport(json) {
    const rows = json.checks.map(c => `
    <tr>
      <td>${c.area}</td>
      <td><code>${c.selector || ''}</code></td>
      <td>${c.prop || ''}</td>
      <td><code>${c.expected || ''}</code></td>
      <td style="color:${c.pass ? '#28c76f' : '#ea5455'}">${c.pass ? 'OK' : 'Falhou'}</td>
    </tr>
  `).join('');
    const svgRows = json.svgAudits.map(s => `
    <tr>
      <td><code>${s.file}</code></td>
      <td style="color:${s.pass ? '#28c76f' : '#ea5455'}">${s.pass ? 'OK' : 'Falhou'}</td>
      <td>${s.issues && s.issues.length ? s.issues.join('<br>') : ''}</td>
    </tr>
  `).join('');
    return `<!doctype html>
  <html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Relatório Figma-first (MVP)</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 16px; }
      h1 { font-size: 20px; }
      table { border-collapse: collapse; width: 100%; margin: 12px 0; }
      th, td { border: 1px solid #ddd; padding: 8px; font-size: 13px; }
      th { background: #f5f5f5; text-align: left; }
      code { background: #f9f9f9; padding: 1px 4px; border-radius: 4px; }
    </style>
  </head>
  <body>
    <h1>Relatório Figma-first (MVP)</h1>
    <p><strong>Página:</strong> ${json.pagePath}</p>
    <p><strong>Resumo:</strong> ${json.summary.passed}/${json.summary.total} verificações OK</p>
    <h2>CSS</h2>
    <table>
      <thead><tr><th>Área</th><th>Seletor</th><th>Propriedade</th><th>Esperado</th><th>Status</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <h2>SVGs</h2>
    <table>
      <thead><tr><th>Arquivo</th><th>Status</th><th>Detalhes</th></tr></thead>
      <tbody>${svgRows}</tbody>
    </table>
  </body>
  </html>`;
}

function main() {
    const repoRoot = process.cwd();
    const pageCfgPath = path.resolve(repoRoot, 'validation/figma-first/pages/backoffice-banco-questoes.json');
    const tolPath = path.resolve(repoRoot, 'validation/figma-first/tolerances.json');
    const pageSpec = readJson(pageCfgPath);
    const tolerances = readJson(tolPath);
    const args = process.argv.slice(2);
    const strict = args.includes('--strict');

    const htmlAbs = path.resolve(repoRoot, pageSpec.pagePath);
    if (!fs.existsSync(htmlAbs)) {
        console.error(`Arquivo HTML não encontrado: ${htmlAbs}`);
        process.exit(2);
    }
    const html = fs.readFileSync(htmlAbs, 'utf8');
    const cssText = extractStyles(html);

    const cssChecks = auditCssExpectations(cssText, pageSpec, tolerances);
    const svgRefs = findSvgRefs(html, path.dirname(htmlAbs));
    const svgAudits = svgRefs.map(p => auditSvgFile(p, tolerances));

    const total = cssChecks.length + svgAudits.length;
    const passed = cssChecks.filter(c => c.pass).length + svgAudits.filter(s => s.pass).length;

    const outDir = path.resolve(repoRoot, 'validation-artifacts/figma-first');
    ensureDir(outDir);
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const jsonOut = {
        pagePath: pageSpec.pagePath,
        checks: cssChecks,
        svgAudits,
        summary: { total, passed, failed: total - passed, timestamp: ts }
    };
    const jsonPath = path.join(outDir, `report-${ts}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(jsonOut, null, 2));
    const htmlReport = buildHtmlReport(jsonOut);
    const htmlPath = path.join(outDir, `report-${ts}.html`);
    fs.writeFileSync(htmlPath, htmlReport, 'utf8');
    // Latest aliases
    fs.writeFileSync(path.join(outDir, 'latest.json'), JSON.stringify(jsonOut, null, 2));
    fs.writeFileSync(path.join(outDir, 'latest.html'), htmlReport, 'utf8');

    console.log(`Relatório gerado:\n- ${jsonPath}\n- ${htmlPath}`);
    if (strict && jsonOut.summary.failed > 0) {
        console.error(`Falhas detectadas: ${jsonOut.summary.failed}. Modo estrito ativo.`);
        process.exit(1);
    }
    process.exit(0);
}

main();
