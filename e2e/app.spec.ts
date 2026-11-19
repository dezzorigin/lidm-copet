import { test, expect } from '@playwright/test';

// E2E COPET: landing → login → dashboard → vocab → kuis → simulasi → admin.
// Semua alur memakai state lokal (localStorage), tanpa backend.

async function loginAsDetective(page, name = 'Nabil') {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Kenali pesannya/ })).toBeVisible();
  await page.getByRole('button', { name: /Mulai penyidikan/ }).click();
  await expect(page.getByRole('heading', { name: /Detektif COPET/ })).toBeVisible();
  await page.getByLabel('Nama detektif').fill(name);
  await page.getByRole('button', { name: /MASUK SEBAGAI DETEKTIF/ }).click();
  await expect(page.getByRole('heading', { name: new RegExp(`Selamat datang, Detektif ${name}`) })).toBeVisible();
}

test.describe('landing', () => {
  test('hero + barang bukti + antrean kasus + tautan GitHub tampil', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Kenali pesannya/ })).toBeVisible();
    await expect(page.getByText('BARANG BUKTI Nº 01')).toBeVisible();
    await expect(page.getByText('Lihat_Foto_Paket.apk')).toBeVisible();
    await expect(page.getByText('Empat kasus menunggu diperiksa.')).toBeVisible();
    await expect(page.getByText('PERKARA Nº COPET-2026-Q1')).toBeVisible();
    const gh = page.getByRole('link', { name: /Kode sumber COPET di GitHub/ });
    await expect(gh).toBeVisible();
    await expect(gh).toHaveAttribute('href', 'https://github.com/dezzorigin/lidm-copet');
    // Angka isi berkas adalah angka asli repo, bukan vanity stat.
    await expect(page.getByText('Istilah di drill kosakata')).toBeVisible();
    await expect(page.getByText('Skenario kuis berwaktu')).toBeVisible();
  });

  test('tag og:/twitter: ada di HTML yang disajikan', async ({ page }) => {
    const res = await page.goto('/');
    expect(res?.status()).toBe(200);
    const html = await res?.text();
    for (const tag of ['og:title', 'og:description', 'og:type', 'og:url', 'og:image', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
      expect(html).toContain(tag);
    }
    expect(html).toContain('https://lidm-copet.pages.dev/og-image.png');
  });

  test('og-image.png 200 + image/*', async ({ request }) => {
    const res = await request.get('/og-image.png');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toMatch(/^image\//);
  });

  test('mobile 390px: tanpa overflow horizontal', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForTimeout(1500);
    const overflow = await page.evaluate(() => ({
      vw: document.documentElement.clientWidth,
      scrollW: document.documentElement.scrollWidth,
    }));
    expect(overflow.scrollW).toBeLessThanOrEqual(overflow.vw + 1);
  });
});

test.describe('dashboard + vocab', () => {
  test('login → dashboard menampilkan akurasi kosong yang jujur', async ({ page }) => {
    await loginAsDetective(page);
    await expect(page.getByText('Belum ada jawaban sesi ini')).toBeVisible();
    await expect(page.getByText('Misi harian agen')).toBeVisible();
  });

  test('vocab: filter kategori + balik kartu + tandai dikuasai', async ({ page }) => {
    await loginAsDetective(page);
    await page.getByRole('button', { name: /Vocab Drill/ }).click();
    await expect(page.getByRole('heading', { name: /Vocab Database/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Phishing', exact: true })).toBeVisible();
    await page.getByRole('tab', { name: 'SECURITY CONCEPT' }).click();
    await expect(page.getByRole('heading', { name: 'Credentials', exact: true })).toBeVisible();
    await page.getByRole('tab', { name: 'SEMUA' }).click();
    await page.getByRole('button', { name: /Kartu Phishing/ }).click();
    await expect(page.getByText(/Scam drill \(English context\)/)).toBeVisible();
    await page.getByRole('button', { name: /Tandai dikuasai/ }).click();
    await expect(page.getByRole('button', { name: /Sudah dikuasai/ })).toBeVisible();
    // Penghitung "n/15 dikuasai" disembunyikan di bawah breakpoint sm
    // (hidden sm:inline) — asersi isi teks, bukan visibilitas.
    await expect(page.getByText(/1\/15 dikuasai/)).toHaveText(/1\/15 dikuasai/);
  });
});

test.describe('kuis', () => {
  test('jawab benar soal SMS → penjelasan + poin, lalu soal berikut', async ({ page }) => {
    await loginAsDetective(page);
    await page.getByRole('button', { name: /Scam Quiz/ }).click();
    await expect(page.getByRole('heading', { name: /Spot the Scam/ })).toBeVisible();
    await expect(page.getByText(/Congratulations! Your number has won/)).toBeVisible();
    await page.getByRole('button', { name: /Ignore and block the number/ }).click();
    await expect(page.getByText('Analisis benar!')).toBeVisible();
    await expect(page.getByText(/PTS \(bonus kecepatan\)/)).toBeVisible();
    await page.getByRole('button', { name: /KASUS BERIKUTNYA/ }).click();
    await expect(page.getByText(/Bank BCA/)).toBeVisible();
  });

  test('soal email dirender sebagai mockup email', async ({ page }) => {
    await loginAsDetective(page);
    await page.getByRole('button', { name: /Scam Quiz/ }).click();
    // q1 benar (Easy → Medium), q2 benar (Medium → Hard = q3 email).
    await page.getByRole('button', { name: /Ignore and block the number/ }).click();
    await page.getByRole('button', { name: /KASUS BERIKUTNYA/ }).click();
    await page.getByRole('button', { name: /Hang up and immediately contact HaloBCA/ }).click();
    await page.getByRole('button', { name: /KASUS BERIKUTNYA/ }).click();
    await expect(page.getByText('BARANG BUKTI · KANAL: EMAIL')).toBeVisible();
    await expect(page.getByText('Undangan Interview — Formulir Terlampir')).toBeVisible();
    await expect(page.getByText('Lampiran: Form_Interview.exe')).toBeVisible();
  });
});

test.describe('simulasi + admin', () => {
  test('simulasi: jawaban aman → feedback → selesai', async ({ page }) => {
    await loginAsDetective(page);
    await page.getByRole('button', { name: /Live Simulation/ }).click();
    await expect(page.getByRole('heading', { name: /Live Simulation/ })).toBeVisible();
    await expect(page.getByText(/I am a J&T Express courier/)).toBeVisible();
    await page.getByRole('button', { name: /I did not order any package/ }).click();
    await expect(page.getByText(/Good ending|Good Ending/)).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: /Lanjut skenario/ }).click();
    await expect(page.getByRole('heading', { name: /Simulation complete/ })).toBeVisible();
  });

  test('admin: log skor terisi setelah kuis selesai', async ({ page }) => {
    await loginAsDetective(page);
    await page.getByRole('button', { name: /Scam Quiz/ }).click();
    // Mainkan 4 soal dengan jawaban benar semua (urutan adaptif:
    // q1 Easy → q2 Medium → q3 Hard → q4 Expert).
    await page.getByRole('button', { name: /Ignore and block the number/ }).click();
    await page.getByRole('button', { name: /KASUS BERIKUTNYA/ }).click();
    await page.getByRole('button', { name: /Hang up and immediately contact HaloBCA/ }).click();
    await page.getByRole('button', { name: /KASUS BERIKUTNYA/ }).click();
    await page.getByRole('button', { name: /Be suspicious because a PDF file/ }).click();
    await page.getByRole('button', { name: /KASUS BERIKUTNYA/ }).click();
    await page.getByRole('button', { name: /Call them on their old or new number/ }).click();
    await page.getByRole('button', { name: /PROSES EVALUASI & ADUAN/ }).click();
    // Fase pelaporan: ambil screenshot → pilih kanal benar → lihat laporan.
    await page.getByRole('button', { name: /AMBIL SCREENSHOT BUKTI/ }).click();
    await page.getByRole('button', { name: /Portal Otoritas AduanNomor.id/ }).click();
    await page.getByRole('button', { name: /LIHAT MISSION REPORT/ }).click();
    await expect(page.getByRole('heading', { name: /Hasil evaluasi radar sibermu/ })).toBeVisible();
    await expect(page.getByText('4/4')).toBeVisible();
    await page.getByRole('button', { name: /KEMBALI KE DASHBOARD/ }).click();
    // Keluar sesi → masuk sebagai guru → log tampil.
    await page.getByRole('button', { name: /KELUAR SESI/ }).click();
    await page.getByRole('button', { name: /MASUK SEBAGAI GURU/ }).click();
    await expect(page.getByRole('heading', { name: /PANEL EVALUATOR/ })).toBeVisible();
    await expect(page.getByText('Nabil')).toBeVisible();
    await expect(page.getByText('ZERO TOLERANCE')).toBeVisible();
  });
});
