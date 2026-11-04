# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
---

## 🚀 Laporan Implementasi Fitur & Gamifikasi Sistem (Changelog Pengembang)

Aplikasi COPET telah dikembangkan menggunakan metode **ADDIE** (*Analysis, Design, Development, Implementation, Evaluation*) untuk membekali siswa SMA ke atas dalam menghadapi taktik manipulasi bahasa (*linguistic manipulation*) oleh scammer daring . Berikut adalah keselarasan fitur yang telah selesai diimplementasikan berdasarkan rancangan proposal:

### 📑 1. Advanced Vocabulary Drill & Linguistic Strategy (Tugas 3)
- **Implementasi Teori:** Berdasarkan 8 Strategi Linguistik Penipuan (Pradesi & Marlianingsih, 2025) pada proposal, fitur *Flashcard* pada `VocabView.tsx` telah diperluas.
- **Dynamic Highlights & Cues:** Sistem secara otomatis mendeteksi dan memberi tanda (*highlight* merah berkedip) pada bagian kalimat penipuan (*Language Key Cues*) untuk mengenali kategori:
  - *Urgency Cues* (contoh kata: *Urgent action required*, *Immediately*, *Locked in 24 hours*).
  - *Authority Cues* (contoh kata: *Verify your account*, *Official department*).
  - *Emotional Manipulation & Vague Promises* (contoh kata: *Congratulations*, *Guaranteed return*).

### 🛬 2. Classified Landing Page & Literasi Konteks (Tugas 4)
- **Contextual Awareness:** Berdasarkan data kerugian siber nasional, halaman utama (`LandingPageView.tsx`) menyajikan pengenalan operasional dan edukasi *Social Engineering* secara mendalam untuk meningkatkan kesadaran literasi digital pengguna sebelum masuk ke Dashboard.

### 📈 3. Level Kuis Bertingkat (Tugas 5)
- **Threat Levels:** Menu kuis (`SpotTheScamView.tsx`) dikembangkan secara dinamis dengan membagi studi kasus ke dalam tingkatan level adaptif: `EASY` ➔ `MEDIUM` ➔ `HARD` ➔ `EXPERT` untuk menyesuaikan kurikulum pengajaran interaktif.

### 🎮 4. Interaksi Gamifikasi Lanjutan (Tugas 6)
- **Speed & Accuracy Multiplier:** Menambahkan real-time countdown *Timer 15 Detik* untuk mereplikasi tekanan psikologis penipuan nyata. Skor akhir dikalkulasi melalui ketepatan jawaban dikombinasikan dengan bonus sisa waktu berpikir (**Poin Dasar 10 PTS + Sisa Waktu × 5 PTS**).
- **Badge Achievement System:** Menyediakan penghargaan piala virtual guna memicu motivasi belajar:
  - 🏅 *SCAM SURVIVOR*: Berhasil mendeteksi ancaman minimal 1 kali dengan benar.
  - 🏅 *SCAM HUNTER*: Menjawab seluruh kasus kuis dengan akurasi 100% sempurna.
  - 🏅 *ZERO TOLERANCE*: Penghargaan deteksi 100% benar dengan batas efisiensi waktu tertinggi.
- **Security Mastery Lock:** Mengunci akses modul level lanjutan (*Advanced Level Lock*) sebelum pengguna mencapai indikator *mastery* penuh pada database kosakata dan kuis dasar.

### ↩️ 5. Global Navigation & Core Usability (Tugas 2)
- **Tombol Kembali Utama:** Implementasi tombol navigasi "MENU UTAMA" yang konsisten di seluruh views untuk mempermudah pergerakan alur belajar pengguna sesuai standar UI/UX modern.

### 📊 6. Admin Panel Scoreboard (Tugas 1)
- **User Score Tracking:** Menambahkan panel khusus admin (`AdminView.tsx`) untuk memantau data hasil pengujian skor akhir pengguna, mempermudah evaluasi efektivitas platform (analisis *pre-test* & *post-test*) sesuai metodologi evaluasi produk.
---

## 🚀 Progres Pembaruan Fitur Terintegrasi

Dokumen ini mencatat seluruh penambahan arsitektur sistem, peningkatan pengalaman pengguna (UX), serta mekanik gamifikasi yang berhasil diintegrasikan ke dalam ekosistem **COPET** malam ini.

### 7. Advanced Landing Page & English Threat Intel
* **Deskripsi:** Peningkatan bobot urgensi aplikasi pada halaman awal dengan menyajikan data statistik kejahatan siber berskala nasional menggunakan Bahasa Inggris.
* **Fitur Utama:**
  * Komponen *Threat Intel: Indonesia Region* yang menonjolkan posisi Indonesia sebagai negara peringkat ke-2 paling rawan penipuan daring global.
  * Visualisasi data kerugian Rp 476 Miliar dan paparan risiko *Social Engineering* terhadap 235 juta pengguna internet aktif secara infografis.
  * Meningkatkan impresi akademik di hadapan juri kompetisi sejak detikan pertama aplikasi dibuka.

### 8. Multi-User Authentication Engine (Dynamic Personalization)
* **Deskripsi:** Rombakan total pada gerbang masuk (`LoginView`) dari yang sebelumnya bersifat satu user statis (*single-tenant*) menjadi sistem multi-user dinamis berbasis input nama.
* **Fitur Utama:**
  * Form input *Agent Name* pada panel *User Operation*.
  * Pemisahan *state* identitas digital: setiap nama baru yang diinput akan memiliki sesi pelatihan, penayangan nama profil, akumulasi poin net, serta pencatatan log evaluasi akhir yang unik dan terisolasi.
  * Sinkronisasi data nama secara *real-time* ke panel *Restricted Admin System* (`ScoreLog`), mempermudah pengujian aplikasi oleh beberapa penguji/juri sekaligus tanpa tumpang tindih data.

### 9. Optimized Session Lifecycle Router (UX Flow Fix)
* **Deskripsi:** Perbaikan jalur navigasi (*routing workflow*) pada aksi penutupan sesi untuk menjaga kenyamanan pengalaman pengguna (UX).
* **Fitur Utama:**
  * Tombol **ABORT SESSION** (User) dan **TERMINATE SESSION** (Admin) kini secara logis mengarahkan pengguna kembali ke `LoginView` (Halaman Pilihan Role & Input Nama).
  * Menghilangkan anomali alur di mana pengguna harus membaca ulang infografis *Landing Page* dari awal setiap kali ingin berganti akun atau peran.

### 10. "Scam Reporter" Interactive Mini-Game
* **Deskripsi:** Modul taktis pasca-kuis di akhir simulasi kasus yang melatih pengguna untuk bertindak aktif melaporkan kejahatan siber, bukan sekadar menghindar.
* **Fitur Utama:**
  * **Step 1 (Evidence Capture):** Fitur simulasi mengambil jepretan layar (*screenshot*) bukti chat penipuan bermodus `.apk` kurir ekspedisi J&T.
  * **Step 2 (Channel Selection):** Labirin pilihan keputusan untuk menguji pengetahuan pengguna mengenai kanal aduan resmi.
  * **Step 3 (Legal Redirection):** Integrasi tautan langsung (*hyperlink*) eksternal aman menuju portal resmi Pemerintah **https://aduannomor.id/** untuk aksi nyata di dunia riil.
  * **Anti-Scam Squad Reward:** Bonus instan **+25 PTS** jika pengguna berhasil mengeksekusi pelaporan melalui kanal yang valid.

### 11. Intelligent Personalized Learning Path (Adaptive Engine)
* **Deskripsi:** Otak kecerdasan buatan (*Adaptive & Diagnostic Engine*) yang disuntikkan ke dalam sistem navigasi kuis (`SpotTheScamView`) untuk menyajikan kurikulum yang personal.
* **Fitur Utama:**
  * **Dynamic Adaptive Difficulty:** Tingkat kesulitan soal berikutnya (*Easy ➔ Medium ➔ Hard ➔ Expert*) akan naik secara otomatis jika pengguna menjawab benar, dan turun level jika pengguna menjawab salah secara *real-time*.
  * **Diagnostic Tracker:** Melacak data kesalahan pengguna berdasarkan pengelompokan kategori taktik manipulasi psikologis penipu (*Urgency, Authority, Emotion, Greed*).
  * **Fokus Area Recommendation:** Menampilkan analisis kelemahan radar siber pengguna pada layar *Mission Report* sebagai saran fokus area pembelajaran selanjutnya di menu *Vocab Drill*.

### 12. Gamified Daily Streak & Mission Board
* **Deskripsi:** Penerapan retensi psikologi game (*game theory engagement*) untuk memicu motivasi belajar harian siswa secara konsisten.
* **Fitur Utama:**
  * **Daily Streak Counter:** Indikator kobaran api siber (`Flame`) yang melacak keaktifan harian pengguna (Simulasi: *3 Days Streak*).
  * **Daily Operational Missions:** Papan misi harian interaktif di dasbor user dengan target:
    1. *Misi Kuis:* Deteksi 3 Red Flags Kuis (Terbuka/selesai otomatis setelah 3 kali menjawab benar).
    2. *Misi Simulasi:* Menyelesaikan 1 sesi modul *Live Simulation*.
  * **Claim Reward Engine:** Tombol klaim interaktif yang memberikan hadiah **+15 PTS** ke saldo poin net global jika misi berhasil diselesaikan.

### 13. Progress Analytical HUD & Digital Portfolio Certificate
* **Deskripsi:** Luaran konkret media pembelajaran berupa dasbor metrik performa serta sertifikat digital formal yang dapat digunakan siswa sebagai portofolio digital.
* **Fitur Utama:**
  * **Cyber Radar Analytics:** Tampilan grafik persentase kemahiran deteksi ancaman (`87% Scam Cues Terdeteksi`) dengan visualisasi *progress bar* melingkar/horizontal di sidebar kanan dasbor.
  * **Automated Certificate Modal:** Jendela pop-up pratinjau sertifikat kelulusan estetik bertema militer siber yang mencetak nama agen `{playerName}` dan skor akhir `{userPoints}` secara dinamis.
  * **Print-to-PDF Printface Isolation:** Menggunakan teknologi penataan `@media print` pada CSS untuk mengisolasi cetakan hanya pada area sertifikat berukuran A4 Landscape bersih, otomatis menyembunyikan elemen antarmuka website lainnya saat tombol di-klik.

---

## 📂 Berkas Arsitektur yang Diperbarui

1. `src/hooks/useGameEngine.tsx` — Penambahan *state* global (`mistakes`, `scoreLogs`, `streakCount`, `missionProgress`) dan fungsi mekanik pemicu data.
2. `src/components/views/DashboardView.tsx` — Implementasi tata letak Opsi 3 (*Vertical Command Center*), panel Misi Harian, baris *Live Threat Feed*, indikator api *streak*, serta modul pembungkus sertifikat kelulusan.
3. `src/components/views/LoginView.tsx` — Integrasi komponen form kendali nama agen secara dinamis sebelum inisialisasi sesi.
4. `src/components/views/LandingPageView.tsx` — Penyajian dokumentasi kasus siber regional Indonesia dalam Bahasa Inggris.
5. `src/components/views/SpotTheScamView.tsx` — Penggabungan logika kuis adaptif, pencatatan tracker diagnostik, perbaikan *bug strict-mode index*, serta layar interaktif *Scam Reporter* (`aduannomor.id`).
6. `src/components/ui/CertificateModal.tsx` — Pembuatan cetakan komponen HTML sertifikat kelulusan formal portofolio siswa.
7. `src/index.css` — Penyuntikan aturan `@media print` untuk isolasi ekspor dokumen PDF landscape.
8. `src/data/quizData.ts` — Pendaftaran properti opsional `category` pada struktur model data kuis TypeScript.
