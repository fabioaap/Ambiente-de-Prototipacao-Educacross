import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import { runChecks } from "./ir_html_css_check.js";

/**
 * Resolve the HTML file to validate. Priority:
 * 1. CLI argument (path or glob pattern)
 * 2. Environment variable HTML_PATH
 * 3. Manifest file in dist/build-manifest.json

    */
async function resolveHtmlTarget() {
    const cli = process.argv[2];
    if (cli) {
        const list = await expandMaybeGlob(cli);
        if (list.length) return pickNewest(list);
        throw new Error(`Nada encontrado para ${cli}`);
    }

    if (process.env.HTML_PATH) {
        const list = await expandMaybeGlob(process.env.HTML_PATH);
        if (list.length) return pickNewest(list);
    }

    try {
        const buf = await fs.readFile(path.resolve("dist", "build-manifest.json"), "utf8");
        const man = JSON.parse(buf);
        if (man.finalHtml) {
            const list = await expandMaybeGlob(man.finalHtml);
            if (list.length) return pickNewest(list);
        }
    } catch { }

    const defaults = await fg(["dist/**/*pixel-perfect.html"], {
        absolute: true,
        ignore: ["**/node_modules/**"],
    });
    if (defaults.length) return pickNewest(defaults);
    throw new Error("Nao encontrei HTML final para validar");
}

async function expandMaybeGlob(input) {
    // Determine if input contains glob meta characters
    if (/[*?\\[\\]{}]/.test(input)) {
        return fg([input], { absolute: true, ignore: ["**/node_modules/**"] });
    }
    const abs = path.resolve(input);
    try {
        await fs.access(abs);
        return [abs];
    } catch {
        return [];
    }
}

async function pickNewest(files) {
    const stats = await Promise.all(
        files.map(async (f) => ({ f, st: await fs.stat(f) }))
    );
    stats.sort((a, b) => b.st.mtimeMs - a.st.mtimeMs);
    return stats[0].f;
}

function extractCssFromHtml(html) {
    const m = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    return m ? m[1] : "";
}

async function tryLoadIr(htmlPath) {
    const dir = path.dirname(htmlPath);
    const candidate = path.join(dir, "ir.json");
    try {
        const buf = await fs.readFile(candidate, "utf8");
        return JSON.parse(buf);
    } catch {
        return null;
    }
}

async function main() {
    const htmlPath = await resolveHtmlTarget();
    const html = await fs.readFile(htmlPath, "utf8");
    let css = extractCssFromHtml(html);
    if (!css) {
        try {
            const cssPath = path.join(path.dirname(htmlPath), "styles.css");
            css = await fs.readFile(cssPath, "utf8");
        } catch { }
    }
    const ir = await tryLoadIr(htmlPath);
    const expected = Number(process.argv[3] || 0);
    const report = runChecks({
        ir_json: ir,
        html_str: html,
        css_str: css,
        expectedNodeCount: expected || undefined,
    });
    console.log(
        JSON.stringify(
            {
                target: htmlPath,
                ...report,
            },
            null,
            2
        )
    );
}

main().catch((err) => {
    console.error(err.message);
    process.exit(1);
});
