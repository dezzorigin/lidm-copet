import { defineConfig, devices } from '@playwright/test';

// E2E COPET terhadap server preview produksi lokal (lihat CI).
// Di CI, webServer di bawah membangun + menjalankan server sendiri.
// Chromium lokal: set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ke cache
// ~/.cache/ms-playwright/chromium-1234 — JANGAN `npx playwright install`
// di VM ini (menghapus cache browser tooling video-demo).
// Di CI (GitHub runner) browser di-install oleh workflow.
export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173,
    timeout: 300_000,
    reuseExistingServer: true,
  },
  use: {
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
      // VM dev: font Google lewat forwarder 127.0.0.1:18081
      // (PLAYWRIGHT_PROXY=http://127.0.0.1:18081). Di CI tidak di-set —
      // runner punya internet langsung.
      args: process.env.PLAYWRIGHT_PROXY
        ? [`--proxy-server=${process.env.PLAYWRIGHT_PROXY}`]
        : [],
    },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
  ],
});
