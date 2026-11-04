export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Expert';

export interface QuizQuestion {
  id: string;
  difficulty: DifficultyLevel;
  scenarioEn: string;
  scenarioId: string;
  optionsEn: string[];
  optionsId: string[];
  correctAnswerIndex: number;
  explanationEn: string;
  explanationId: string;
  category?: string; // <-- Tuh Jott, ini kuncian biar nggak eror!
}

export const quizData: QuizQuestion[] = [
  {
    id: 'q1',
    difficulty: 'Easy',
    scenarioEn: 'You receive an SMS: "Congratulations! Your number has won Rp100 Million from Shopee. Click the following link to claim: http://shopee-hadiah-resmi.com". What do you do?',
    scenarioId: 'Anda menerima SMS: "Selamat! Nomor Anda memenangkan Rp100 Juta dari Shopee. Klik link berikut untuk klaim: http://shopee-hadiah-resmi.com". Apa yang Anda lakukan?',
    optionsEn: [
      'Click the link because I frequently shop at Shopee.',
      'Ignore and block the number because it is a scam.',
      'Reply to the SMS to ask if it is true.',
      'Share it with the family group so they can be happy too.'
    ],
    optionsId: [
      'Klik link tersebut karena saya memang sering belanja di Shopee.',
      'Abaikan dan blokir nomor tersebut karena itu penipuan.',
      'Balas SMS untuk menanyakan kebenarannya.',
      'Sebarkan ke grup keluarga biar mereka ikutan senang.'
    ],
    correctAnswerIndex: 1,
    explanationEn: 'Scammers often use the lure of large prizes with fake links (phishing) to steal your data.',
    explanationId: 'Scammer sering menggunakan iming-iming hadiah besar dengan link palsu (phishing) untuk mencuri data Anda.',
    category: 'Greed / Iming-iming' // <-- Kategori manipulasinya
  },
  {
    id: 'q2',
    difficulty: 'Medium',
    scenarioEn: 'Someone calls claiming to be from Bank BCA, stating there are suspicious transactions on your account and asks for the OTP code just sent via SMS to block it.',
    scenarioId: 'Seseorang menelpon mengaku dari Bank BCA, mengatakan ada transaksi mencurigakan di rekening Anda dan meminta kode OTP yang baru saja dikirim via SMS untuk memblokirnya.',
    optionsEn: [
      'Give the OTP because they are an official bank employee trying to help.',
      'Hang up and immediately contact HaloBCA from the official number.',
      'Give half of the OTP code to test them.',
      'Get angry at the caller.'
    ],
    optionsId: [
      'Berikan OTP tersebut karena dia orang bank resmi yang mau membantu.',
      'Tutup telepon dan segera hubungi HaloBCA dari nomor resmi.',
      'Berikan setengah dari kode OTP untuk mengetes.',
      'Marah-marah kepada penelepon.'
    ],
    correctAnswerIndex: 1,
    explanationEn: 'Real bank officials NEVER ask for your OTP code, PIN, or Password for any reason.',
    explanationId: 'Pihak bank asli TIDAK PERNAH meminta kode OTP, PIN, atau Password Anda dengan alasan apapun.',
    category: 'Authority / Otoritas Palsu' // <-- Kategori manipulasinya
  },
  {
    id: 'q3',
    difficulty: 'Hard',
    scenarioEn: 'You receive an email from "HRD Company X" (your target company) with a PDF attachment named "Form_Interview.exe".',
    scenarioId: 'Anda mendapat email dari "HRD Perusahaan X" (perusahaan incaran Anda) dengan lampiran PDF bernama "Form_Interview.exe".',
    optionsEn: [
      'Immediately open the attachment so you do not miss the interview schedule.',
      'Forward the email to a friend to have it checked.',
      'Be suspicious because a PDF file cannot have a .exe extension, and delete it.',
      'Reply to the email and ask for a different file format.'
    ],
    optionsId: [
      'Segera buka lampiran tersebut agar tidak ketinggalan jadwal interview.',
      'Forward email tersebut ke teman untuk dicek.',
      'Curiga karena file PDF tidak mungkin berekstensi .exe, lalu menghapusnya.',
      'Balas email tersebut dan minta format file lain.'
    ],
    correctAnswerIndex: 2,
    explanationEn: 'Files with a .exe extension disguised as documents are usually Malware/Trojans ready to infect your device.',
    explanationId: 'File berekstensi .exe yang disamarkan sebagai dokumen biasanya adalah Malware/Trojan yang siap menginfeksi perangkat Anda.',
    category: 'Urgency / Desakan Waktu' // <-- Kategori manipulasinya
  },
  {
    id: 'q4',
    difficulty: 'Expert',
    scenarioEn: 'Your friend chats you on WhatsApp using a new number. Their writing style is very similar. They urgently ask to borrow money and provide a bank account under someone else\'s name.',
    scenarioId: 'Teman Anda menge-chat di WhatsApp menggunakan nomor barunya. Gaya bahasanya sangat mirip. Ia meminta pinjaman uang mendesak dan memberikan nomor rekening bernama orang lain.',
    optionsEn: [
      'Transfer immediately out of pity since the writing style is so similar.',
      'Call them on their old or new number, ask for a video call to confirm.',
      'Ignore it because you do not have money right now.',
      'Transfer a small amount just in case.'
    ],
    optionsId: [
      'Langsung transfer karena kasihan dan gaya bahasanya sangat mirip.',
      'Telepon dia ke nomor lama atau nomor baru tersebut, suruh dia video call untuk konfirmasi.',
      'Abaikan saja karena Anda sedang tidak punya uang.',
      'Transfer sebagian kecil saja untuk berjaga-jaga.'
    ],
    correctAnswerIndex: 1,
    explanationEn: 'Social Engineering and Account Takeover techniques can mimic writing styles. Always verify via voice or video before transferring money to an unknown account.',
    explanationId: 'Teknik Social Engineering dan Account Takeover bisa meniru gaya bahasa. Selalu verifikasi via suara atau video sebelum mentransfer uang ke rekening tak dikenal.',
    category: 'Emotion / Manipulasi Emosi' // <-- Kategori manipulasinya
  }
];