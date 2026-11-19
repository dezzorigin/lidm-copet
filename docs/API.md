# API & Model Data — COPET

COPET tidak punya backend. "API" di sini adalah (a) model data di
`src/data/` dan (b) API engine lokal `useGameEngine` + skema
localStorage. Dokumen ini adalah kontrak untuk kontributor.

## 1. Model data

### 1.1 `src/data/vocabulary.ts` — `VocabularyItem[]` (15 item)

```ts
interface VocabularyItem {
  word: string;        // istilah Inggris, mis. "Phishing"
  definition: string;  // definisi Inggris
  translation: string; // terjemahan Indonesia
  example: string;     // contoh kalimat (Inggris)
  category: 'Scam Tactic' | 'Language Clue' | 'Security Concept';
  languageCues?: string[]; // kata kunci yang disorot merah di contoh
}
```

### 1.2 `src/data/quizData.ts` — `QuizQuestion[]` (4 soal)

```ts
interface QuizQuestion {
  id: string;          // 'q1'..'q4'
  scenario: string;    // teks kasus (Inggris)
  scenarioId: string;  // terjemahan Indonesia
  channel: 'sms' | 'call' | 'email' | 'chat'; // kanal bukti
  options: string[];   // 4 jawaban (Inggris)
  correctAnswerIndex: number;
  explanation: string; // penjelasan (Inggris)
  explanationId: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  category: 'Greed' | 'Authority' | 'Urgency' | 'Emotion';
  email?: {            // hanya q3 — dirender EmailMockup
    from: string; subject: string; date: string; body: string;
  };
}
```

### 1.3 `src/data/simulationData.ts` — `SimulationNode[]` (7 simpul)

```ts
interface SimChoice {
  text: string;        // teks pilihan (Inggris)
  nextNodeId: string | null; // null = akhir simulasi
  points: number;      // +5 aman, -3 berisiko, 0 netral
  feedback: string;    // penjelasan pilihan ini
  isSafe: boolean;
  isDangerous: boolean;
}
interface SimulationNode {
  id: string;          // 'start' | 'node_2' | 'node_2b' | 'node_3' | 'node_4' | 'node_5' | 'node_6'
  sender: 'scammer' | 'user';
  message: string;
  choices?: SimChoice[];
  isEnd?: boolean;
  endType?: 'safe' | 'scam' | 'neutral';
  endMessage?: string;
}
```

## 2. Engine — `useGameEngine()`

Hook `src/hooks/useGameEngine.tsx` (dipakai `App.tsx`, di-pass ke view):

| Anggota | Jenis | Arti |
|---|---|---|
| `playerName`, `setPlayerName` | string | nama agen (input login) |
| `role`, `setRole` | 'detective' \| 'teacher' | peran sesi |
| `userPoints`, `addPoints(n)`, `deductPoints(n)` | number | poin sesi |
| `masteredTerms` (Set), `markMastered(word)` | Set<string> | istilah dikuasai |
| `unlockAdvancedLevel()` | () => boolean | true bila semua 15 istilah dikuasai |
| `answersCorrect`, `answersWrong`, `recordAnswer(ok)` | number | akurasi sesi |
| `quizCorrectToday`, `simCompletedToday` | number | progres misi harian |
| `isQuizClaimed`, `isSimClaimed`, `claimQuizMission()`, `claimSimMission()` | boolean | klaim +15 PTS |
| `streakCount` | number | hari aktif berurutan |
| `scoreLogs`, `saveScoreLog(badge)` | ScoreLog[] | log skor untuk admin |
| `resetSession()` | () => void | bersihkan state sesi (logout) |

### Formula skor (kontrak)

- Kuis benar: `10 + timeLeft * 5` PTS (`timeLeft` = sisa detik dari 15).
- Kuis salah / habis waktu: 0 PTS, kesulitan turun satu level.
- Simulasi: pilihan aman +5, berisiko −3, netral 0.
- Pelaporan benar: +25 PTS. Misi harian: +15 PTS per klaim.
- Sertifikat terbuka bila `userPoints >= 10`.

## 3. Skema localStorage

| Kunci | Isi |
|---|---|
| `copet_score_logs` | `ScoreLog[]` — `{ name, points, badge, date }` |
| `copet_mastered_terms` | `string[]` — istilah dikuasai |
| `copet_active_days` | `string[]` — tanggal ISO hari aktif |
| `copet_quiz_correct` | `{ date, count }` — jawaban benar hari ini |
| `copet_sim_completed` | `{ date, count }` — simulasi selesai hari ini |

Semua kunci diawali `copet_`. Tidak ada data yang dikirim ke server
mana pun. Hapus lewat "Hapus data situs" di peramban, atau
`localStorage.clear()` di konsol.

## 4. Tautan eksternal (satu-satunya)

- https://aduannomor.id — portal resmi pengaduan nomor penipu
  (fase pelaporan kuis, dibuka di tab baru).
- https://github.com/dezzorigin/lidm-copet — kode sumber (masthead).
- https://fonts.googleapis.com — font Fraunces + IBM Plex Mono
  (dengan fallback sistem bila gagal).
