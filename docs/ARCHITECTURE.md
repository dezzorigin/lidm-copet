# Arsitektur — COPET

## 1. Gambaran

SPA statis (Vite + React 19 + TypeScript + Tailwind v4). Tanpa backend,
tanpa runtime server, tanpa API eksternal. Semua state di memori React
+ persistensi di `localStorage` peramban.

```
Pengguna
  └─ Browser
       ├─ dist/ (HTML + JS + CSS statis, dari Cloudflare Pages)
       ├─ Google Fonts (Fraunces + IBM Plex Mono, dengan fallback)
       └─ localStorage (skor, istilah dikuasai, hari aktif, log)
```

## 2. Struktur folder

```
lidm-copet/
├── index.html                  # template: lang id, meta, font, OG/Twitter
├── public/
│   ├── favicon.svg             # perisai hijau + centang
│   └── og-image.png            # screenshot asli landing 1200x630
├── src/
│   ├── main.tsx                # entry: ThemeProvider + App
│   ├── App.tsx                 # router kondisional (fade 150 ms)
│   ├── index.css               # token @theme Tailwind v4, @custom-variant dark,
│   │                           # .rule-double, .stamp, reduced-motion, print
│   ├── vite-env.d.ts
│   ├── components/
│   │   ├── layout/Layout.tsx   # masthead (logo, GitHub, tema, chip PTS)
│   │   ├── ui/
│   │   │   ├── WhatsAppMockup.tsx
│   │   │   ├── EmailMockup.tsx
│   │   │   ├── FeedbackDrawer.tsx
│   │   │   └── CertificateModal.tsx
│   │   └── views/
│   │       ├── LandingPageView.tsx
│   │       ├── LoginView.tsx
│   │       ├── DashboardView.tsx
│   │       ├── VocabView.tsx
│   │       ├── SpotTheScamView.tsx
│   │       ├── SimulationView.tsx
│   │       └── AdminView.tsx
│   ├── contexts/ThemeContext.tsx   # tema terang/gelap (class di <html>)
│   ├── data/
│   │   ├── vocabulary.ts       # 15 istilah
│   │   ├── quizData.ts         # 4 skenario (field channel: sms/call/email/chat)
│   │   └── simulationData.ts   # 7 simpul bercabang
│   └── hooks/useGameEngine.tsx # state global + localStorage
├── scripts/
│   ├── check-static.mjs        # gate P0 + OG
│   ├── advisory-sweep.py       # OSV batch (produksi)
│   ├── screenshot.mjs          # puppeteer → docs/screenshots/ + og-image
│   ├── make-video.mjs          # ffmpeg zoompan → docs/demo/demo.mp4
│   └── smoke.mjs               # cek build produksi
├── e2e/app.spec.ts             # Playwright (desktop + mobile)
├── .github/workflows/ci.yml    # build, advisory-sweep, e2e, smoke
└── docs/                       # PRD, DESIGN, ARCHITECTURE, API, testing,
                                # deploy, diagrams.html, screenshots/, demo/
```

## 3. Alur state

`App.tsx` memegang `currentView` ('landing' | 'login' | 'dashboard' |
'vocab' | 'quiz' | 'sim' | 'admin') dan merender view yang sesuai
dengan fade 150 ms. `useGameEngine` menyediakan:

- identitas: `playerName`, `role` ('detective' | 'teacher')
- skor: `userPoints`, `addPoints`, `deductPoints`
- progres: `masteredTerms` (Set), `markMastered`, `unlockAdvancedLevel`
- jawaban: `answersCorrect`, `answersWrong`, `recordAnswer`
- misi: `quizCorrectToday`, `simCompletedToday`, klaim +15 PTS
- streak: `streakCount` dari `activeDays` (tanggal ISO)
- log: `scoreLogs`, `saveScoreLog`

Persistensi: 5 kunci localStorage (lihat [API.md](API.md)).
Tidak ada Context global selain tema — engine di-pass sebagai props
dari `App.tsx` ke tiap view (pola lama yang dipertahankan).

## 4. Keputusan restructure (dicatat untuk PR)

| Konflik root vs `COPET2-main/` | Keputusan |
|---|---|
| `.gitignore` root (`.env`, `.next`) vs subfolder (logs, node_modules, dist, editor) | Digabung ke satu `.gitignore` baru |
| README root (template 678ch) vs `COPET2-main/README.md` (template Vite + changelog dev panjang) | Keduanya diganti README baru; isi changelog dev dilipat ke `docs/PRD.md` §9 + `CHANGELOG.md` |
| `design.md` (tema "Sleek Tech": Inter, gradient, glassmorphism) | Diganti `docs/DESIGN.md` (koran berkas perkara) |
| `prd_planner.md` | Diganti `docs/PRD.md` (isi dilipat, dikoreksi §9) |
| `tailwind.config.js` gaya v3 | Dihapus — Tailwind v4 mengabaikannya |
| `package-lock.json` lama | Regenerate via `npm install` (254 paket) |

## 5. Keputusan teknis penting

- **Firebase dihapus.** `src/config/firebase.ts` isinya placeholder
  semua (`apiKey: "API_KEY_KAMU"`); `dbService.ts` tidak pernah
  diimpor siapa pun. Data pindah ke localStorage; dependensi
  `firebase` dihapus dari `package.json`.
- **Tailwind v4.** Token warna/font di `@theme` (`src/index.css`);
  dark mode via `@custom-variant dark` (toggle lama tidak berpengaruh
  karena config v3 diabaikan v4).
- **Tanpa router library.** Navigasi kondisional di `App.tsx` —
  cukup untuk 7 view, tanpa dependensi tambahan.
- **TTS Web Speech API** (`speechSynthesis`) untuk pengucapan istilah
  — tanpa kunci, tanpa file audio.
- **Print sertifikat** via `@media print` yang menyembunyikan semua
  kecuali `#certificate-sheet`.

## 6. Batas yang diketahui

- Data localStorage tidak sinkron antar-perangkat; Panel Evaluator
  hanya melihat sesi di perangkat yang sama.
- Font Google butuh internet; tanpa internet jatuh ke fallback serif/
  monospace sistem (masih terbaca).
- TTS tergantung suara `en-US` yang terpasang di perangkat.
