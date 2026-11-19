# Testing — COPET

## 1. Lapisan tes

| Lapisan | Perintah | Yang dicek |
|---|---|---|
| Typecheck | `npm run typecheck` | `tsc -b --noEmit` |
| Lint | `npm run lint` | ESLint (termasuk react-hooks + react-refresh) |
| Gate P0 | `npm run validate` | `scripts/check-static.mjs` |
| Advisory sweep | `python3 scripts/advisory-sweep.py` | OSV batch, produksi, HIGH/CRITICAL = gagal |
| E2E | `npm run e2e` | Playwright desktop + mobile (lihat §3) |
| Smoke | `npm run smoke` | build produksi: HTTP + OG + aset (lihat §4) |
| Screenshot | `npm run screenshots` | `docs/screenshots/` + `public/og-image.png` |
| Video | `npm run make-video` | `docs/demo/demo.mp4` |

Semua lapisan jalan di CI (`.github/workflows/ci.yml`, Node 24).
Hasil terakhir (19 Nov 2026): typecheck ✓, lint ✓, validate ✓,
sweep ✓ (59 paket produksi, 0 HIGH/CRITICAL), e2e **16/16**,
smoke ✓.

## 2. Gate P0 (`check-static.mjs`)

Memindai `src/`, `public/`, `scripts/`, `e2e/`, `package.json`,
`index.html` (komentar di-strip sebelum cek):

- Tanpa gradient ungu/biru, `bg-clip-text`, font Inter/Roboto,
  `rounded-2xl/3xl/4xl`, `shadow-lg/2xl`.
- Tanpa emoji mentah di kode UI.
- Tanpa statistik vanity / angka hardcode peninggalan app lama
  ("235 Juta", "476 Miliar", "peringkat ke-2", "87%", "3 HARI").
- Tanpa viewport `maximumScale: 1` (melarang zoom).
- Tanpa sisa restructure (`COPET2-main/`), tanpa `.env` ter-commit,
  tanpa secret kasar.
- Link preview: semua 9 tag `og:`/`twitter:` ada di `index.html`,
  `og:image` = URL absolut `https://lidm-copet.pages.dev/og-image.png`,
  `public/og-image.png` ada dan ≥ 10 KB.

## 3. E2E Playwright (`e2e/app.spec.ts`)

Server: `webServer` di `playwright.config.ts` menjalankan
`npm run build && npm run preview` (port 4173).

| Tes | Alur |
|---|---|
| landing: hero + barang bukti + antrean + GitHub | buka `/`, cek headline, `BARANG BUKTI Nº 01`, `PERKARA Nº COPET-2026-Q1`, tautan GitHub, angka asli repo |
| landing: tag og:/twitter: | cek 9 tag + URL absolut og:image di HTML yang disajikan |
| landing: og-image.png | GET `/og-image.png` → 200 + `content-type: image/*` |
| landing: mobile 390px | `scrollWidth <= clientWidth + 1` (tanpa overflow) |
| dashboard: akurasi kosong jujur | login → "Belum ada jawaban sesi ini" |
| vocab: filter + balik + tandai dikuasai | tab SECURITY CONCEPT → balik kartu Phishing → tandai → "1/15 dikuasai" |
| kuis: jawab benar q1 | opsi benar → "Analisis benar!" + poin → soal berikut (q2 Bank BCA) |
| kuis: soal email mockup | q1+q2 benar → q3 dirender `EmailMockup` (`Form_Interview.exe`) |
| simulasi: jawaban aman → selesai | pilih aman → feedback → "Simulation complete" |
| admin: log skor terisi | mainkan 4 soal benar semua → fase pelaporan → Mission Report 4/4 → keluar sesi → masuk Guru → log "Nabil" + "ZERO TOLERANCE" |

Catatan: tiap soal kuis punya timer 15 detik — langkah tes sengaja
cepat; bila timer habis di tengah tes, soal dianggap salah dan tes
gagal (itu perilaku yang benar, bukan flaky).

Lokal (VM dev): set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` ke cache
`~/.cache/ms-playwright/chromium-1234/chrome-linux/chrome` dan
`PLAYWRIGHT_PROXY=http://127.0.0.1:18081` (font Google lewat
forwarder). **JANGAN** `npx playwright install chromium` di VM ini —
itu menghapus cache browser tooling video-demo. Di CI, browser
di-install workflow (`npx playwright install --with-deps chromium`).

## 4. Smoke (`scripts/smoke.mjs`)

Menjalankan `vite preview` di port 8393 (`--host 127.0.0.1`) lalu:

- `/` → 200 + headline + tautan GitHub + 9 tag OG/Twitter + URL
  absolut og:image.
- `/og-image.png` → 200 + `content-type: image/*`.
- `/favicon.svg` → 200.
- Bundle JS hasil build (`/assets/index-*.js`) → 200.

Pola #29: `curl -o file` lalu `grep` file (tanpa `curl | grep -q` +
`pipefail` — SIGPIPE). Server dimatikan via PID (`srv.kill`),
bukan `pkill -f` (pelajaran #36).

## 5. Screenshot & video

- `npm run screenshots` (puppeteer-core, Chromium cache): 14
  screenshot ke `docs/screenshots/` + `public/og-image.png`
  (1200x630, dari landing). Forwarder 127.0.0.1:18081 dipakai untuk
  font Google; bila mati, font jatuh ke fallback.
- `npm run make-video` (ffmpeg zoompan, 1280x720, tiap adegan 5
  detik): `docs/demo/demo.mp4` — 12 adegan.
- **Screenshot adalah satu-satunya bukti visual** (pelajaran #33):
  e2e hijau bukan bukti render tampil.

## 6. Yang TIDAK diuji otomatis

- TTS (`speechSynthesis`): tergantung suara perangkat; diuji manual.
- Cetak sertifikat (`window.print`): diuji manual.
- Render live dari VM tidak bisa headless untuk interaksi — verifikasi
  live = HTTP + konten + OG; play-test interaktif dilakukan lokal
  dan sekali di browser Nabil bila perlu.
