export interface VocabularyItem {
  id: string;
  word: string;
  definition: string;
  englishExample: string;
  languageCue: string;
  indonesianMeaning: string;
  indonesianExample: string;
  category: 'Scam Tactic' | 'Security Concept' | 'Language Clue';
}

export const vocabulary: VocabularyItem[] = [
  // --- SCAM TACTIC ---
  {
    id: 'v1',
    word: 'Phishing',
    definition: 'A fraudulent attempt to obtain sensitive information by disguising as a trustworthy entity.',
    englishExample: 'The email looked like it was from my bank, but it was a phishing scam.',
    languageCue: 'from my bank',
    indonesianMeaning: 'Upaya penipuan untuk mendapatkan informasi sensitif dengan menyamar sebagai pihak tepercaya.',
    indonesianExample: 'Email itu terlihat seperti dari bank saya, tapi ternyata itu adalah penipuan phishing.',
    category: 'Scam Tactic'
  },
  {
    id: 'v2',
    word: 'Spoofing',
    definition: 'Falsifying data to disguise an unknown source as a known, trusted source.',
    englishExample: 'The sender address was a classic case of spoofing; the display name said Apple, but the email was completely random.',
    languageCue: 'email was completely random',
    indonesianMeaning: 'Memalsukan data untuk menyamarkan sumber yang tidak dikenal sebagai sumber yang tepercaya.',
    indonesianExample: 'Alamat pengirim adalah spoofing klasik; nama tampilan mengatakan Apple, tapi email aslinya benar-benar acak.',
    category: 'Scam Tactic'
  },
  {
    id: 'v3',
    word: 'Malware',
    definition: 'Software specifically designed to disrupt, damage, or gain unauthorized access to a computer system.',
    englishExample: 'Opening the suspicious attachment installed malware on his laptop.',
    languageCue: 'suspicious attachment',
    indonesianMeaning: 'Perangkat lunak yang dirancang khusus untuk merusak atau mendapatkan akses tidak sah.',
    indonesianExample: 'Membuka lampiran mencurigakan itu menginstal malware di laptopnya.',
    category: 'Scam Tactic'
  },
  {
    id: 'v4',
    word: 'Social Engineering',
    definition: 'The use of deception to manipulate individuals into divulging confidential or personal information.',
    englishExample: 'The scammer used social engineering to convince the employee to reset the password.',
    languageCue: 'reset the password',
    indonesianMeaning: 'Manipulasi psikologis untuk membohongi korban agar memberikan informasi rahasia.',
    indonesianExample: 'Penipu tersebut menggunakan rekayasa sosial untuk meyakinkan korban mereset kata sandi.',
    category: 'Scam Tactic'
  },
  {
    id: 'v5',
    word: 'Pig Butchering',
    definition: 'A long-term scam where the fraudster builds a fake relationship before convincing the victim to invest in bogus schemes.',
    englishExample: 'He lost his savings to a pig butchering scam after chatting with a fake expert for months.',
    languageCue: 'invest in bogus schemes',
    indonesianMeaning: 'Penipuan jangka panjang berkedok asmara atau persahabatan yang berujung pada investasi bodong.',
    indonesianExample: 'Dia kehilangan tabungannya karena penipuan investasi setelah mengobrol dengan pakar palsu selama berbulan-bulan.',
    category: 'Scam Tactic'
  },
  // --- LANGUAGE CLUE ---
  {
    id: 'v6',
    word: 'Urgent Action Required',
    definition: 'Scammers use this to make you panic. Legitimate institutions will not give such short deadlines.',
    englishExample: 'Urgent action required: Your account will be suspended in 24 hours.',
    languageCue: 'Urgent action required',
    indonesianMeaning: 'Tindakan segera diperlukan (Menciptakan kepanikan agar korban bertindak tanpa berpikir).',
    indonesianExample: 'Tindakan segera diperlukan: Akun Anda akan ditangguhkan dalam 24 jam.',
    category: 'Language Clue'
  },
  {
    id: 'v7',
    word: 'Verify Your Account',
    definition: 'A common trick to steal login credentials. Institutions don’t ask for verification via random links.',
    englishExample: 'We need you to verify your account by clicking this link to avoid suspension.',
    languageCue: 'verify your account',
    indonesianMeaning: 'Verifikasi akun Anda (Trik memancing korban untuk memasukkan data login ke situs palsu).',
    indonesianExample: 'Kami membutuhkan Anda untuk verifikasi akun Anda dengan mengklik tautan ini.',
    category: 'Language Clue'
  },
  {
    id: 'v8',
    word: 'Congratulations! / Winner',
    definition: 'Baiting victims with unexpected rewards or lottery winnings to trigger greed.',
    englishExample: 'Congratulations! Your number has been selected as the winner of $10,000.',
    languageCue: 'Congratulations!',
    indonesianMeaning: 'Selamat / Pemenang (Umpan manipulasi emosi menggunakan hadiah fiktif).',
    indonesianExample: 'Selamat! Nomor Anda terpilih sebagai pemenang hadiah Rp 100 Juta.',
    category: 'Language Clue'
  },
  {
    id: 'v9',
    word: 'Exclusive Opportunity',
    definition: 'A sweet phrase to trap you into risky investments or fake jobs.',
    englishExample: 'This is an exclusive opportunity to double your income working from home.',
    languageCue: 'exclusive opportunity',
    indonesianMeaning: 'Kesempatan eksklusif (Bahasa persuasif untuk menjebak korban ke bisnis bodong).',
    indonesianExample: 'Ini adalah kesempatan eksklusif untuk menggandakan penghasilan Anda dari rumah.',
    category: 'Language Clue'
  },
  {
    id: 'v10',
    word: 'Unauthorized Access',
    definition: 'Making the victim believe they are already hacked so they will accept fake help.',
    englishExample: 'We detected an unauthorized login attempt from a new device.',
    languageCue: 'unauthorized login attempt',
    indonesianMeaning: 'Akses Tidak Sah (Membuat korban panik seolah-olah sistem keamanannya sudah jebol).',
    indonesianExample: 'Kami mendeteksi upaya login tidak sah dari perangkat baru.',
    category: 'Language Clue'
  },
  // --- SECURITY CONCEPT ---
  {
    id: 'v11',
    word: 'Credentials',
    definition: 'Information used to verify identity, such as passwords, PINs, or security questions.',
    englishExample: 'Never share your login credentials with anyone over chat.',
    languageCue: 'share your login credentials',
    indonesianMeaning: 'Kredensial (Data rahasia pertahanan identitas akun, seperti password atau PIN).',
    indonesianExample: 'Jangan pernah membagikan kredensial login Anda kepada siapapun melalui chat.',
    category: 'Security Concept'
  },
  {
    id: 'v12',
    word: 'Two-Factor Authentication (2FA)',
    definition: 'An extra layer of security used to ensure that people trying to gain access to an online account are who they say they are.',
    englishExample: 'Even if they have your password, 2FA will block them from logging in.',
    languageCue: 'block them from logging in',
    indonesianMeaning: 'Autentikasi Dua Faktor (Lapisan keamanan ganda selain kata sandi utama).',
    indonesianExample: 'Bahkan jika mereka memiliki kata sandi Anda, 2FA akan memblokir mereka untuk login.',
    category: 'Security Concept'
  },
  {
    id: 'v13',
    word: 'Legitimate',
    definition: 'Conforming to the law or to rules; genuine and real.',
    englishExample: 'Always verify that a website is legitimate before entering your credit card details.',
    languageCue: 'entering your credit card',
    indonesianMeaning: 'Sah / Asli (Situs atau instansi resmi yang valid dan bukan tiruan).',
    indonesianExample: 'Selalu verifikasi bahwa sebuah situs web itu sah sebelum memasukkan detail kartu kredit Anda.',
    category: 'Security Concept'
  },
  {
    id: 'v14',
    word: 'One-Time Password (OTP)',
    definition: 'A password that is valid for only one login session or transaction.',
    englishExample: 'Do not share this OTP code with anyone, including bank staff.',
    languageCue: 'Do not share this OTP',
    indonesianMeaning: 'Kunci Sekali Pakai (Kode numerik jangka pendek yang tidak boleh diketahui orang lain).',
    indonesianExample: 'Jangan bagikan kode OTP ini kepada siapapun, termasuk staf bank.',
    category: 'Security Concept'
  },
  {
    id: 'v15',
    word: 'Encryption',
    definition: 'The process of converting information or data into a code, especially to prevent unauthorized access.',
    englishExample: 'End-to-end encryption ensures that only you and the recipient can read the chat.',
    languageCue: 'encryption ensures',
    indonesianMeaning: 'Enkripsi (Proses mengacak data menjadi kode rahasia agar tidak bisa dibaca oleh penyadap).',
    indonesianExample: 'Enkripsi ujung-ke-ujung memastikan hanya Anda dan penerima yang dapat membaca chat.',
    category: 'Security Concept'
  }
];