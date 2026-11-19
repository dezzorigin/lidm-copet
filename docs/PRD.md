# PRD Lengkap — COPET (LEXiCO)

Versi ringkas: [../PRD.md](../PRD.md). Dokumen ini melipat isi
`prd_planner.md` dan changelog pengembang versi lama (COPET2-main),
dengan koreksi kejujuran di §9.

## 1. Gambaran produk

**LEXiCO (Literacy & English Critical Observation)** — platform
micro-teaching gamified untuk LIDM 2026. Siswa SMA ke atas belajar
mengenali penipuan berbahasa Inggris lewat tiga modul interaktif:
Vocab Drill, Spot the Scam, Live Simulation. Metode pengembangan
**ADDIE** (Analysis, Design, Development, Implementation, Evaluation).

## 2. Aturan arsitektur (dari `prd_planner.md`, dipertahankan)

1. **Separation of concerns:** komponen UI tidak boleh berisi data
   skenario hardcode. Semua teks, kosakata, dan soal tinggal di
   `src/data/` (`vocabulary.ts`, `quizData.ts`, `simulationData.ts`).
2. **Komponen modular:** komponen kecil yang bisa dipakai ulang
   (`WhatsAppMockup`, `EmailMockup`, `FeedbackDrawer`,
   `CertificateModal`).

## 3. Modul & data

### 3.1 Vocab Drill — 15 istilah

| Kategori | Istilah |
|---|---|
| Scam Tactic (5) | Phishing, Spoofing, Malware, Social Engineering, Pig Butchering |
| Language Clue (5) | Urgent Action Required, Verify Your Account, Congratulations! / Winner, Exclusive Opportunity, Unauthorized Access |
| Security Concept (5) | Credentials, Two-Factor Authentication (2FA), Legitimate, One-Time Password (OTP), Encryption |

Tiap istilah: definisi Inggris + terjemahan Indonesia + contoh kalimat
+ sorot kata kunci. Flashcard bisa dibalik (klik), ada TTS
(`speechSynthesis`, `en-US`), filter per kategori, tombol
"Tandai dikuasai" — istilah yang dikuasai membuka level lanjutan kuis
(Advanced Level Lock).

**Teori:** 8 Strategi Linguistik Penipuan (Pradesi & Marlianingsih,
2025) — urgency cues (*Urgent action required*, *Immediately*,
*Locked in 24 hours*), authority cues (*Verify your account*,
*Official department*), emotional manipulation & vague promises
(*Congratulations*, *Guaranteed return*). Strategi ini dipakai sebagai
kategori sorot kata kunci dan kategori diagnostik kuis.

### 3.2 Spot the Scam — 4 skenario

| ID | Kanal | Level awal | Kasus | Taktik |
|---|---|---|---|---|
| q1 | SMS | Easy | Hadiah Rp100 juta dari Shopee, tautan `shopee-hadiah-resmi.com` | Greed |
| q2 | Telepon | Medium | Bank BCA minta OTP | Authority |
| q3 | Email | Hard | HRD kirim `Form_Interview.exe` berkedok PDF | Urgency |
| q4 | Chat | Expert | Teman pinjam uang dari nomor baru | Emotion |

- **Kesulitan adaptif:** soal berikutnya naik satu level bila jawaban
  benar, turun bila salah (Easy ↔ Medium ↔ Hard ↔ Expert).
- **Timer 15 detik** per soal — mereplikasi tekanan psikologis
  penipuan nyata. Habis waktu = jawaban salah.
- **Formula skor:** jawaban benar = **10 PTS + sisa waktu × 5 PTS**.
  Contoh: jawab benar dengan sisa 13 detik = 75 PTS.
- **Fase pelaporan (Scam Reporter), 3 langkah** setelah 4 soal:
  1. Ambil screenshot bukti chat penipuan.
  2. Pilih kanal aduan — hanya portal Otoritas AduanNomor.id yang benar.
  3. Tautan eksternal ke https://aduannomor.id (aksi nyata).
  Kanal benar = **+25 PTS**.
- **Badge:** SCAM SURVIVOR (≥ 1 jawaban benar), SCAM HUNTER (4/4
  benar), ZERO TOLERANCE (4/4 benar dengan efisiensi waktu tertinggi).
- **Mission Report:** akurasi, total poin, analisis kelemahan per
  kategori taktik (Urgency / Authority / Emotion / Greed) + rekomendasi
  fokus belajar di Vocab Drill.

### 3.3 Live Simulation — 7 simpul

Percakapan WhatsApp dengan kurir J&T Express palsu (`.apk`).
Simpul: `start`, `node_2`, `node_2b`, `node_3`, `node_4`, `node_5`,
`node_6`. Tiap jawaban memilih simpul berikut; 3 akhir berbeda
(safe / scam / neutral). Poin: jawaban aman +5 PTS, berisiko −3 PTS,
netral 0. Jawaban berisiko membuka FeedbackDrawer berisi penjelasan
mengapa pilihan itu berbahaya.

### 3.4 Dashboard & gamifikasi

- **Misi harian:** deteksi 3 red flag kuis + selesaikan 1 simulasi;
  klaim +15 PTS per misi (tombol klaim aktif hanya bila misi selesai).
- **Streak:** hari aktif berurutan, dihitung dari tanggal di
  localStorage (bukan hardcode).
- **Akurasi:** jawaban benar / total jawaban sesi ini. Kosong = teks
  "Belum ada jawaban sesi ini".
- **Sertifikat:** terbuka bila poin ≥ 10 PTS; nomor sertifikat dibuat
  sekali per sesi; cetak via `window.print` dengan `@media print`
  yang mengisolasi lembar sertifikat (A4 landscape).
- **Panel Evaluator (peran Guru):** log skor semua sesi di perangkat
  yang sama — nama, poin, badge, tanggal — untuk evaluasi pre-test /
  post-test.

### 3.5 Login

Tanpa kata sandi. Dua peran: **Detektif** (siswa, isi nama agen) dan
**Guru** (evaluator, langsung ke panel). Sesi berakhir lewat
"KELUAR SESI" → kembali ke layar peran.

## 4. Persyaratan non-fungsional

- **Performa:** SPA statis; build ~470 KB JS (gzip ~142 KB); tanpa
  request jaringan selain font Google (dengan fallback sistem).
- **Aksesibilitas:** semua kontrol punya label; kartu vocab dan tombol
  punya `aria-label`; fokus terlihat; `prefers-reduced-motion`
  mematikan animasi; viewport tidak mengunci zoom.
- **Privasi:** semua data di localStorage perangkat pengguna. Tidak ada
  backend, tidak ada pelacak, tidak ada cookie pihak ketiga.
- **Responsif:** layout 390px tanpa overflow horizontal (diuji e2e).

## 5. Deploy & link preview

- Cloudflare Pages, proyek `lidm-copet` → https://lidm-copet.pages.dev.
- Link preview wajib (og-preview.md): `og:title`, `og:description`,
  `og:type`, `og:url`, `og:image` (absolut, 1200x630, screenshot asli
  landing di `public/og-image.png`), `twitter:card` summary_large_image
  + `twitter:title/description/image`. Detail: [deploy.md](deploy.md).

## 6. Kriteria penerimaan

1. `npm install && npm run build` hijau dari root repo.
2. E2E 16/16 (desktop + mobile) hijau.
3. Gate 7 sumbu desain ≥ 4/5 tiap sumbu + tes siluet lolos.
4. Checklist link preview lolos (curl live + curl og:image + dimensi).
5. CI hijau, live HTTP 200 + play-test.

## 7. Out of scope

Backend / akun / sinkronisasi antar-perangkat; pembayaran; integrasi
pihak ketiga. Firebase yang dulu direncanakan **dihapus** — config-nya
hanya placeholder dan tidak pernah ada kunci asli yang ter-commit.

## 8. Riwayat versi

- **0.1.0 (Okt 2026):** versi kompetisi LIDM — app di subfolder
  `COPET2-main/`, tanpa CI/docs/deploy.
- **1.0.0 (19 Nov 2026):** proper rebuild repo #38 program P1 —
  restructure ke root, desain baru, data ke localStorage, CI, docs,
  deploy Pages, link preview. Lihat [../CHANGELOG.md](../CHANGELOG.md).

## 9. Koreksi kejujuran (versi lama → versi ini)

| Klaim lama | Kenyataan | Perbaikan |
|---|---|---|
| Akurasi "87%" | Hardcode di kode | Dihitung nyata dari jawaban sesi |
| Streak "3 HARI" | `useState(3)` | Dihitung dari tanggal aktif |
| "235 juta pengguna / Rp 476 miliar / peringkat ke-2 di dunia" | Tanpa sumber | Dihapus; diganti angka asli repo (15/4/7/3) |
| "Initial Next.js project setup" (CHANGELOG lama) | App ini Vite, bukan Next.js | Dihapus dari CHANGELOG |
| Firebase "terintegrasi" | Config placeholder semua | Dihapus; localStorage |
| `typescript ~6.0.2` | Versi itu tidak pernah ada | `~5.9.3` |
