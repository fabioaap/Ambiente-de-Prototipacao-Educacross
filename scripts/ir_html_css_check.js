export function runChecks({ ir_json, html_str, css_str, expectedNodeCount }) {
    const errors = [];
    const warnings = [];
    const tips = [];
    if (!ir_json || !html_str || !css_str) {
        errors.push("Entradas ir_json, html_str e css_str sao obrigatorias");
        return finish();
    }

    // 1 Esquema do IR
    if (!ir_json.pageName) errors.push("IR sem pageName");
    if (!ir_json.nodes || !Array.isArray(ir_json.nodes)) errors.push("IR sem nodes");
    if (!ir_json.tokens) warnings.push("IR sem tokens");

    // util
    const walk = (n, acc = []) => {
        if (!n) return acc;
        if (Array.isArray(n)) { n.forEach(x => walk(x, acc)); return acc; }
        acc.push(n);
        if (n.children) walk(n.children, acc);
        return acc;
    };
    const allNodes = walk(ir_json.nodes);

    // 2 Contagem
    if (typeof expectedNodeCount === "number" && expectedNodeCount !== allNodes.length) {
        errors.push(`Contagem de nos divergente IR ${allNodes.length} esperado ${expectedNodeCount}`);
    }

    // 3 Auto layout
    let needsFlex = false;
    allNodes.forEach(n => {
        if (n.layout) {
            needsFlex = true;
            const L = n.layout;
            ["dir", "gap", "pad", "justify", "align"].forEach(k => {
                if (!(k in L)) errors.push(`No ${n.name || n.k} sem campo de layout ${k}`);
            });
            if (Array.isArray(L.pad) && L.pad.length !== 4) {
                errors.push(`Padding de ${n.name || n.k} deve ter 4 valores`);
            }
        }
    });
    if (needsFlex && !/display\s*:\s*flex/i.test(css_str)) {
        errors.push("CSS sem regra display flex apesar de haver auto layout no IR");
    }

    // 4 Grid
    const hasGridNode = allNodes.some(n => n.grid);
    if (hasGridNode && !(/display\s*:\s*grid/i.test(css_str) || /grid-template/i.test(css_str))) {
        errors.push("CSS sem grid apesar de haver grid no IR");
    }

    // 5 Texto
    const textNodes = allNodes.filter(n => typeof n.textContent === "string");
    textNodes.forEach(n => {
        const hasVar = n.styleRefs && (n.styleRefs.textVar || n.styleRefs.fillVar);
        const hasAbs = n.style && (n.style.fontSize || n.style.fontFamily);
        if (!hasVar && !hasAbs) {
            errors.push(`Texto em ${n.name || "no"} sem variavel de tipografia nem valores absolutos`);
        }
    });

    // 6 Variaveis e tokens
    const tokenVars = [];
    const pick = obj => Array.isArray(obj) ? obj : [];
    const T = ir_json.tokens || {};
    ["colors", "typography", "spacing", "radius"].forEach(group => {
        pick(T[group]).forEach(tok => {
            if (tok.var) tokenVars.push(tok.var);
        });
    });
    const rootBlock = css_str.match(/:root\s*\{([\s\S]*?)\}/i);
    if (tokenVars.length && !rootBlock) {
        errors.push("CSS sem bloco :root para variaveis");
    } else if (rootBlock) {
        const block = rootBlock[1];
        tokenVars.forEach(v => {
            const cssVar = v.startsWith("--") ? v : `--${v.replace(/[^a-z0-9_-]/gi, "").toLowerCase()}`;
            if (!new RegExp(`${cssVar}\\s*:`, "i").test(block)) {
                warnings.push(`Variavel ${cssVar} nao encontrada em :root`);
            }
        });
    }

    // 7 HTML sem estilos inline
    if (/style\s*=/.test(html_str)) errors.push("HTML contem estilos inline");

    // 8 Constraints heuristica
    const hasConstraints = allNodes.some(n => n.constraints);
    if (hasConstraints && !/(width|height)\s*:\s*(\d+px|auto|100%)/i.test(css_str)) {
        warnings.push("Constraints presentes mas nao ha indicios de regras de largura ou altura no CSS");
        tips.push("Mapear constraints para regras de largura altura e ancoragem");
    }

    // 9 Duplicidades de id
    const ids = [...html_str.matchAll(/id\s*=\s*['\"]([^'\"]+)['\"]/g)].map(m => m[1]);
    const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
    if (dup.length) errors.push(`Ids duplicados no HTML: ${[...new Set(dup)].join(", ")}`);

    return finish();

    function finish() {
        const summary = {
            totalChecks: 9,
            pass: errors.length === 0 ? 9 : Math.max(0, 9 - errors.length),
            fail: errors.length
        };
        return { summary, errors, warnings, tips };
    }
}
