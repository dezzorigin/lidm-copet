# PRD — COPET (LEXiCO)

## 1. Informasi Proyek

| Field | Nilai |
|---|---|
| Nama produk | COPET — Counter Penipuan Terintegrasi (LEXiCO: Literacy & English Critical Observation) |
| Tujuan | Platform micro-teaching gamified untuk LIDM 2026: edukasi anti-penipuan berbahasa Inggris bagi siswa SMA ke atas |
| Metode | ADDIE (Analysis, Design, Development, Implementation, Evaluation) |
| Stack | Vite 8 + React 19 + TypeScript + Tailwind CSS v4 (SPA, tanpa backend) |
| Status | Proper rebuild selesai 19 Nov 2026 (repo #38 program P1) |
| Live | https://lidm-copet.pages.dev |

## 2. Masalah

Penipu daring memakai manipulasi bahasa Inggris (urgency, authority,
greed, emotion) yang sulit dikenali siswa. Materi literasi digital yang
ada umumnya ceramah, bukan latihan. COPET melatih radar deteksi lewat
kasus nyata yang bisa dijawab, bukan dibaca saja.

## 3. Pengguna

- **Siswa (Detektif):** main 3 modul, kumpulkan poin, cetak sertifikat.
- **Guru / evaluator:** masuk tanpa kata sandi sebagai "Guru", pantau log
  skor semua sesi di Panel Evaluator (pre-test / post-test).
- Tidak ada akun, tidak ada kata sandi, tidak ada data yang keluar dari
  peramban (localStorage saja).

## 4. Fitur

### 4.1 Vocab Drill — 15 istilah
Flashcard bilingual (Inggris–Indonesia) + contoh kalimat + TTS
(`speechSynthesis`, `en-US`) + sorot kata kunci per kategori
(Scam Tactic / Language Clue / Security Concept) + tombol
"Tandai dikuasai" per istilah. Istilah dikuasai membuka level lanjutan
kuis (Advanced Level Lock).

### 4.2 Spot the Scam — 4 skenario kuis adaptif
| ID | Kanal | Kasus | Taktik |
|---|---|---|---|
| q1 | SMS | Hadiah Rp100 juta dari Shopee | Greed / iming-iming |
| q2 | Telepon | Bank BCA minta OTP | Authority |
| q3 | Email | HRD kirim `Form_Interview.exe` | Urgency |
| q4 | Chat | Teman pinjam uang dari nomor baru | Emotion |

- Kesulitan adaptif Easy → Medium → Hard → Expert: naik bila benar,
  turun bila salah.
- Timer 15 detik per soal (tekanan psikologis penipuan nyata).
- Skor: **10 PTS + sisa waktu × 5 PTS** per jawaban benar.
- Setelah 4 soal: fase pelaporan 3 langkah (screenshot bukti → pilih
  kanal aduan → tautan ke https://aduannomor.id) — kanal benar +25 PTS.
- Badge: SCAM SURVIVOR (≥ 1 benar), SCAM HUNTER (4/4 benar),
  ZERO TOLERANCE (4/4 benar dengan efisiensi waktu tertinggi).
- Mission Report: akurasi, total poin, analisis kelemahan per kategori
  taktik (Urgency / Authority / Emotion / Greed) + rekomendasi fokus.

### 4.3 Live Simulation — 7 simpul bercabang
Percakapan WhatsApp dengan kurir J&T palsu (`.apk`). Setiap jawaban
menentukan simpul berikut; 3 akhir berbeda (safe / scam / neutral).
Jawaban aman +5 PTS, jawaban berisiko −3 PTS, jawaban netral 0.
Jawaban berisiko membuka FeedbackDrawer dengan penjelasan.

### 4.4 Dashboard
- Misi harian: deteksi 3 red flag kuis + selesaikan 1 simulasi — klaim
  +15 PTS per misi.
- Streak: hari aktif berurutan, dihitung dari tanggal di localStorage.
- Akurasi: jawaban benar / total jawaban sesi ini (kosong = "Belum ada
  jawaban sesi ini", bukan angka palsu).
- Sertifikat: terbuka bila poin ≥ 10; cetak via `window.print`
  (hanya lembar sertifikat yang tercetak).

### 4.5 Panel Evaluator
Log skor semua sesi (nama, poin, badge, tanggal). Data dari localStorage
perangkat yang sama — bukan server pusat.

## 5. Teori yang dipakai

- **8 Strategi Linguistik Penipuan** (Pradesi & Marlianingsih, 2025):
  urgency, authority, emotional manipulation, vague promises, dan
  kawan-kawan — dipakai sebagai kategori sorot kata kunci di Vocab Drill
  dan kategori diagnostik di Mission Report.
- **Gamifikasi:** poin + timer + badge + streak + misi harian
  (retensi), sertifikat sebagai luaran portofolio.

## 6. Bukan fitur (out of scope)

- Backend / akun / sinkronisasi antar-perangkat (dulu direncanakan
  Firebase — dihapus: config-nya hanya placeholder, tidak pernah ada
  kunci asli yang ter-commit).
- Pembayaran, pendaftaran event, atau integrasi pihak ketiga apa pun.

## 7. Kriteria keberhasilan

- App jalan dari root repo (`npm install && npm run build` hijau).
- Semua fitur inti lolos play-test end-to-end (e2e 16/16: desktop +
  mobile).
- Tidak ada angka tanpa sumber di UI.
- CI hijau, live terverifikasi, link preview (OG/Twitter) lolos.

Detail penuh: [docs/PRD.md](docs/PRD.md).
