import { test, expect, type Browser } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Arquivo renomeado para .e2e.ts para não ser capturado pelo Vitest (apenas Playwright).
// Gera testes de screenshot a partir do manifesto pixel-perfect.

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

manifest.pages.forEach(pageCfg => {
    pageCfg.dprs.forEach(dpr => {
        test(`${pageCfg.id} @ dpr=${dpr}`, async ({ browser }: { browser: Browser }) => {
            const context = await browser.newContext({
                viewport: pageCfg.viewport,
                deviceScaleFactor: dpr,
            });
            const page = await context.newPage();

            const targetUrl = pageCfg.path ? encodeURI('/' + pageCfg.path) : (pageCfg.url ?? '');
            await page.goto(targetUrl, { waitUntil: pageCfg.waitUntil ?? 'networkidle' });

            await page.waitForFunction(() => (document as any).fonts?.status === 'loaded', null, { timeout: 10000 }).catch(() => { });

            const maskElements = [] as any[];
            if (pageCfg.masks?.length) {
                for (const sel of pageCfg.masks) {
                    const el = page.locator(sel);
                    if (await el.count()) maskElements.push(el);
                }
            }

            await expect(page).toHaveScreenshot(`${pageCfg.id}-dpr${dpr}.png`, {
                maxDiffPixelRatio: pageCfg.thresholds?.maxDiffPixelRatio ?? 0.005,
                maxDiffPixels: pageCfg.thresholds?.maxDiffPixels,
                mask: maskElements as any,
            });

            await context.close();
        });
    });
});
