# Changelog

Semua perubahan penting dicatat di sini. Format mengikuti
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/) dan
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-19 — Proper rebuild (repo #38 program P1)

### Added
- Restructure: app pindah dari subfolder `COPET2-main/` ke root repo
  (sebelumnya tidak bisa jalan dari root).
- CI GitHub Actions: build (typecheck + lint + gate P0 + vite build),
  advisory-sweep OSV, Playwright e2e, smoke.
- Docs lengkap: PRD, DESIGN, ARCHITECTURE, API, testing, deploy,
  diagrams (HTML+SVG), README standar repo top.
- Screenshot asli semua view (`docs/screenshots/`) + video demo
  (`docs/demo/demo.mp4`, 12 adegan).
- Link preview: meta Open Graph + Twitter Card di `index.html` +
  `public/og-image.png` 1200x630 dari screenshot asli landing.
- Fitur yang sebelumnya mati dihidupkan: mockup email dipakai untuk
  soal q3; tombol "Tandai dikuasai" di Vocab Drill (dulu
  `masteredCount` tidak pernah bertambah dari vocab).
- E2E Playwright 16/16 (desktop + mobile): landing → login → dashboard
  → vocab → kuis → simulasi → admin.

### Changed
- Desain total: "halaman depan koran berkas perkara" — Fraunces +
  IBM Plex Mono, 6 warna bernama, stempel PENIPUAN, nomor perkara
  (referensi: template Tipline, Framer). Menggantikan tema "Sleek Tech"
  lama (Inter, gradient, glassmorphism).
- Data pindah dari Firebase (placeholder, tidak pernah live) ke
  localStorage; dependensi `firebase` dihapus.
- Transisi antar-mode: layar loading 2 detik → fade 150 ms.
- Tailwind v3 config dihapus; token pindah ke `@theme` Tailwind v4
  + `@custom-variant dark` (toggle tema gelap lama tidak berpengaruh).
- `lang="en"` → `lang="id"`.
- Favicon: logo "N" ungu bawaan template → perisai hijau + centang.

### Fixed
- `typescript ~6.0.2` di package.json lama tidak pernah ada (diganti
  `~5.9.3`).
- Angka palsu dihapus: akurasi "87%", streak "3 HARI", statistik
  "235 juta pengguna / Rp 476 miliar / peringkat ke-2 di dunia" tanpa
  sumber — diganti hitungan nyata dari data sesi dan angka asli repo
  (15 istilah, 4 skenario, 7 simpul, 3 modul).
- `Date.now()` di render sertifikat → lazy initializer `useState`.
- Kelas Tailwind tak valid dihapus (`text-slate-350`,
  `dark:text-indigo-450`, `border-gray-750`).
- `lucide-react` tidak mengekspor `Github` — ikon diganti SVG inline.
- `EmailMockup` (dead code) dan `dbService` (tidak pernah diimpor)
  dibereskan.

### Removed
- Subfolder `COPET2-main/` (dipindah ke root).
- `src/config/firebase.ts` (semua placeholder), `src/services/dbService.ts`.
- `public/icons.svg`, `public/whatsapp.svg` (tidak dipakai di mana pun).
- `tailwind.config.js` gaya v3 (diabaikan Tailwind v4).

## [0.1.0] - 2026-10 — Versi awal (COPET2-main)

Versi kompetisi LIDM 2026: LEXiCO dengan Vocab Drill (15 istilah),
Spot the Scam (4 skenario), Live Simulation (7 simpul), dashboard,
panel evaluator, sertifikat. App tinggal di subfolder `COPET2-main/`,
tidak bisa jalan dari root, tanpa CI/docs/deploy. Changelog lama di
versi ini berisi klaim yang tidak benar (mis. "Initial Next.js project
setup" — app ini Vite, bukan Next.js); klaim-klaim itu tidak diteruskan
ke versi 1.0.0.
