// Screenshot dokumentasi: landing, login, dashboard, kuis, vocab,
// simulasi, admin — desktop + mobile ke docs/screenshots/*.png.
// Dipakai README + video demo + og-image.png (1200x630, dari landing).
// Prasyarat: puppeteer-core, Chromium di cache
// (~/.cache/ms-playwright/chromium-1234), dan server preview di PORT
// (default 4173, `npm run build && npm run preview`).
// JANGAN `npx playwright install chromium` di VM ini (menghapus cache
// browser tooling video-demo).
import { mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import net from 'node:net';

// Forwarder egress (127.0.0.1:18081) WAJIB untuk font Google dari
// headless Chrome di VM ini: koneksi langsung browser -> egress proxy
// ditolak 403, dan tanpa proxy font display tidak termuat. Probe TCP
// dulu; kalau forwarder mati, lanjut tanpa proxy (font fallback).
const FORWARDER = 'http://127.0.0.1:18081';
const forwarderAlive = await new Promise((resolve) => {
  const s = net.connect(18081, '127.0.0.1');
  s.once('connect', () => { s.destroy(); resolve(true); });
  s.once('error', () => resolve(false));
  setTimeout(() => { s.destroy(); resolve(false); }, 2000);
});
if (!forwarderAlive) console.warn('PERINGATAN: forwarder 127.0.0.1:18081 mati — font Google mungkin fallback.');

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'docs', 'screenshots');
const PORT = process.env.PORT || '4173';
const BASE = `http://127.0.0.1:${PORT}`;

const require = createRequire(import.meta.url);
let puppeteer;
try {
  puppeteer = require('puppeteer-core');
} catch {
  try {
    puppeteer = require('/home/hatch/workspace/absensirapat-audit/diag/node_modules/puppeteer-core');
  } catch {
    console.error('puppeteer-core tidak ditemukan. Pasang dulu: npm i -D puppeteer-core.');
    process.exit(1);
  }
}

mkdirSync(OUT, { recursive: true });

const exe =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  join(process.env.HOME, '.cache/ms-playwright/chromium-1234/chrome-linux/chrome');
const browser = await puppeteer.launch({
  executablePath: exe,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage',
    ...(forwarderAlive ? [`--proxy-server=${FORWARDER}`] : [])],
});

// COPET adalah SPA satu halaman: tiap view dicapai lewat klik, bukan URL.
// Helper klik: cari tombol berdasarkan teks, klik, tunggu teks target.
async function clickByText(page, text, waitForText, timeout = 15000) {
  await page.evaluate((t) => {
    const els = [...document.querySelectorAll('button, a')];
    const el = els.find((e) => e.textContent.trim().toLowerCase().includes(t.toLowerCase()));
    if (!el) throw new Error(`tombol "${t}" tidak ketemu`);
    el.click();
  }, text);
  if (waitForText) {
    await page.waitForFunction(
      (t) => document.body.innerText.toLowerCase().includes(t.toLowerCase()),
      { timeout }, waitForText,
    );
  }
  await new Promise((r) => setTimeout(r, 1200));
}

async function shot(page, name, width, height) {
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: join(OUT, name) });
  console.log(`shot ${name}`);
}

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(`${BASE}/`, { waitUntil: 'networkidle0', timeout: 90000 });
await page.waitForFunction(
  () => document.body.innerText.includes('Kenali pesannya'),
  { timeout: 60000 },
);
await new Promise((r) => setTimeout(r, 2000));

// 1. Landing desktop + mobile + og-image (1200x630 dari landing).
await shot(page, 'landing-desktop.png', 1440, 900);
await shot(page, 'landing-mobile.png', 390, 844);
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await new Promise((r) => setTimeout(r, 1200));
await page.screenshot({ path: join(ROOT, 'public', 'og-image.png') });
console.log('shot public/og-image.png (1200x630)');

// 2. Login (dari landing: "Mulai penyidikan").
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await clickByText(page, 'Mulai penyidikan', 'Detektif COPET');
await shot(page, 'login-desktop.png', 1440, 900);

// 3. Dashboard: isi nama, masuk sebagai detektif.
await page.evaluate(() => {
  const input = document.querySelector('#agent-name');
  if (!input) throw new Error('input #agent-name tidak ketemu');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(input, 'Nabil');
  input.dispatchEvent(new Event('input', { bubbles: true }));
});
await clickByText(page, 'MASUK SEBAGAI DETEKTIF', 'Selamat datang, Detektif');
await shot(page, 'dashboard-desktop.png', 1440, 900);
await shot(page, 'dashboard-mobile.png', 390, 844);

// 4. Vocab Drill.
await clickByText(page, 'Vocab Drill', 'Vocab Database');
await shot(page, 'vocab-desktop.png', 1440, 900);
// Balik kartu: klik kartu, tunggu contoh kalimat.
await page.evaluate(() => {
  const card = document.querySelector('[role="button"][aria-label^="Kartu"]');
  if (!card) throw new Error('kartu vocab tidak ketemu');
  card.click();
});
await new Promise((r) => setTimeout(r, 1000));
await shot(page, 'vocab-flipped-desktop.png', 1440, 900);
await clickByText(page, 'MENU UTAMA', 'Selamat datang, Detektif');

// 5. Spot the Scam (soal pertama; jawab benar = opsi B).
await clickByText(page, 'Scam Quiz', 'Spot the Scam');
await shot(page, 'quiz-desktop.png', 1440, 900);
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button')];
  const b = btns.find((e) => e.textContent.includes('Ignore and block the number'));
  if (!b) throw new Error('opsi jawaban benar tidak ketemu');
  b.click();
});
await page.waitForFunction(
  () => document.body.innerText.includes('Analisis benar'),
  { timeout: 15000 },
);
await shot(page, 'quiz-answered-desktop.png', 1440, 900);
await clickByText(page, 'KASUS BERIKUTNYA', 'LEVEL:');
// Soal kedua adalah kanal telepon (q2) — cukup screenshot, lalu batalkan.
await shot(page, 'quiz-q2-desktop.png', 1440, 900);
await clickByText(page, 'BATALKAN MISI', 'Selamat datang, Detektif');

// 6. Live Simulation (simpul awal).
await clickByText(page, 'Live Simulation', 'Live Simulation');
await shot(page, 'sim-desktop.png', 1440, 900);
// Pilih jawaban aman pertama ("Saya tidak memesan paket…") → feedback.
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button')];
  const b = btns.find((e) => e.textContent.includes('blocking this number'));
  if (!b) throw new Error('pilihan aman simulasi tidak ketemu');
  b.click();
});
await new Promise((r) => setTimeout(r, 2500));
await shot(page, 'sim-feedback-desktop.png', 1440, 900);
await clickByText(page, 'Lanjut skenario', 'Simulation complete');
await shot(page, 'sim-complete-desktop.png', 1440, 900);
await clickByText(page, 'KEMBALI KE DASHBOARD', 'Selamat datang, Detektif');

// 7. Admin: keluar sesi, masuk sebagai guru.
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button')];
  const b = btns.find((e) => e.textContent.trim().startsWith('KELUAR SESI'));
  if (!b) throw new Error('tombol KELUAR SESI tidak ketemu');
  b.click();
});
await page.waitForFunction(
  () => document.body.innerText.includes('Detektif COPET'),
  { timeout: 15000 },
);
await clickByText(page, 'MASUK SEBAGAI GURU', 'PANEL EVALUATOR');
await shot(page, 'admin-desktop.png', 1440, 900);

await browser.close();
console.log('screenshots OK');
