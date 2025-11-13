import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: 'tests/pixel',
    testMatch: ['**/*.e2e.ts'],
    /* Mais tempo para fontes e assets externos */
    timeout: 60_000,
    retries: 0,
    fullyParallel: false,
    reporter: [
        ['list'],
        ['html', { outputFolder: 'validation-artifacts/pixel/report', open: 'never' }],
    ],
    /* Servidor estático para os HTMLs do Back-office */
    webServer: {
        command: 'python -m http.server 8080',
        port: 8080,
        reuseExistingServer: true,
        timeout: 120_000,
    },
    use: {
        baseURL: 'http://localhost:8080',
        viewport: { width: 1440, height: 900 },
        /* DPR será controlado por contexto no teste */
        colorScheme: 'light',
        locale: 'pt-BR',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
