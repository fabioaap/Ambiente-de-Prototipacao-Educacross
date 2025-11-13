import { test, expect, type Browser } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const manifestPath = path.resolve(process.cwd(), 'pixel-perfect.manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as {
    pages: Array<{
        id: string;
        name: string;
        path?: string;
        url?: string;
        viewport: { width: number; height: number };
        dprs: number[];
        thresholds?: { maxDiffPixelRatio?: number; maxDiffPixels?: number };
        waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
        masks?: string[];
    }>;
};

for (const pageCfg of manifest.pages) {
    for (const dpr of pageCfg.dprs) {
        test(`${pageCfg.id} @ dpr=${dpr}`, async ({ browser }: { browser: Browser }) => {
            const context = await browser.newContext({
                viewport: pageCfg.viewport,
                deviceScaleFactor: dpr,
            });
            const page = await context.newPage();

            // Montar URL com base no path (preferido) para evitar problemas com espaços/acentos
            const targetUrl = pageCfg.path
                ? encodeURI('/' + pageCfg.path)
                : (pageCfg.url ?? '');
            // Navegar e estabilizar
            await page.goto(targetUrl, { waitUntil: pageCfg.waitUntil ?? 'networkidle' });

            // Esperar fontes (Montserrat / Material Icons) carregarem
            await page.waitForFunction(() => (document as any).fonts?.status === 'loaded', null, {
                timeout: 10000,
            }).catch(() => { });

            // Aplicar máscaras (áreas dinâmicas), se configuradas
            const maskElements = [] as any[];
            if (pageCfg.masks?.length) {
                for (const sel of pageCfg.masks) {
                    const el = page.locator(sel);
                    if (await el.count()) maskElements.push(el);
                }
            }

            // Screenshot com threshold vindo do manifesto
            await expect(page).toHaveScreenshot(`${pageCfg.id}-dpr${dpr}.png`, {
                maxDiffPixelRatio: pageCfg.thresholds?.maxDiffPixelRatio ?? 0.005,
                maxDiffPixels: pageCfg.thresholds?.maxDiffPixels,
                mask: maskElements as any,
            });

            await context.close();
        });
    }
}
