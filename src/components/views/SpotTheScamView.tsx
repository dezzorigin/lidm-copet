import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameEngine } from '../../hooks/useGameEngine';
import { quizData } from '../../data/quizData';
import { EmailMockup } from '../ui/EmailMockup';
import {
  ArrowLeft, ChevronRight, Clock, AlertCircle,
  CheckCircle2, XCircle, Languages, ShieldCheck, Target,
  Camera, FileImage, Send, ExternalLink, Siren,
} from 'lucide-react';

const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard', 'Expert'];
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

const CHANNEL_LABEL: Record<string, string> = {
  sms: 'SMS',
  call: 'Panggilan telepon',
  email: 'Email',
  chat: 'Chat WhatsApp',
};

/* Spot the Scam — kuis skenario adaptif (Easy → Expert), timer 15 detik,
   lalu fase pelaporan ke kanal aduan resmi (aduannomor.id).
   Skenario email (q3) dirender sebagai mockup email sungguhan — dulu
   komponen EmailMockup tidak dipakai siapa pun (dead code). */
export function SpotTheScamView() {
  const { setMode, addPoints, unlockAchievement, unlockAdvancedLevel, saveScoreLog, recordMistake, getWeakestCategory, addQuizCorrectProgress, recordAnswer } = useGameEngine();

  const [visitedIndices, setVisitedIndices] = useState<number[]>([0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDiffIndex, setCurrentDiffIndex] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [pointsEarnedThisRound, setPointsEarnedThisRound] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimeOut, setIsTimeOut] = useState(false);

  const [isReportingPhase, setIsReportingPhase] = useState(false);
  const [reportStep, setReportStep] = useState(1);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  const totalQuestionsToPlay = Math.min(4, quizData.length);
  const isLastQuestion = visitedIndices.length >= totalQuestionsToPlay;
  const question = quizData[currentIndex] || quizData[0];

  useEffect(() => {
    if (isAnswered || isQuizFinished || isReportingPhase || timeLeft <= 0) return;
    const timerId = setTimeout(() => {
      if (timeLeft - 1 <= 0) {
        // Waktu habis — ditangani di dalam callback timer (bukan
        // sinkron di badan effect) supaya tidak cascading render.
        setIsTimeOut(true);
        setIsAnswered(true);
        setSelectedAnswer(-1);
        setPointsEarnedThisRound(0);
        recordAnswer(false);
        recordMistake(question.category || 'General');
      } else {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft, isAnswered, isQuizFinished, isReportingPhase, question.category, recordAnswer, recordMistake]);

  const findNextQuestion = (targetDiffIndex: number, currentVisited: number[]) => {
    const targetDifficulty = DIFFICULTY_LEVELS[targetDiffIndex];
    let nextIdx = quizData.findIndex((q, idx) => !currentVisited.includes(idx) && q.difficulty === targetDifficulty);

    if (nextIdx === -1) {
      nextIdx = quizData.findIndex((_, idx) => !currentVisited.includes(idx));
    }

    if (nextIdx !== -1) {
      setCurrentIndex(nextIdx);
      setVisitedIndices(prev => [...prev, nextIdx]);
    }
  };

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === question.correctAnswerIndex) {
      setCorrectAnswersCount(prev => prev + 1);
      const speedBonus = timeLeft * 5;
      const totalPoints = 10 + speedBonus;
      setPointsEarnedThisRound(totalPoints);
      addPoints(totalPoints);
      recordAnswer(true);

      addQuizCorrectProgress(1);
      setCurrentDiffIndex(prev => Math.min(prev + 1, DIFFICULTY_LEVELS.length - 1));
    } else {
      setPointsEarnedThisRound(0);
      recordAnswer(false);
      setCurrentDiffIndex(prev => Math.max(prev - 1, 0));
      recordMistake(question.category || 'General');
    }
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      findNextQuestion(currentDiffIndex, visitedIndices);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(15);
      setIsTimeOut(false);
      setShowTranslation(false);
      setPointsEarnedThisRound(0);
    } else {
      setIsReportingPhase(true);
    }
  };

  const handleReportSubmit = (isCorrectChannel: boolean) => {
    if (isCorrectChannel) {
      addPoints(25);
    }
    setReportStep(3);
  };

  const calculateAchievements = () => {
    setIsReportingPhase(false);
    setIsQuizFinished(true);
    const earned: string[] = [];
    let highestBadge: string;
    if (correctAnswersCount === totalQuestionsToPlay) {
      unlockAchievement('SCAM HUNTER');
      earned.push('SCAM HUNTER');
      unlockAchievement('ZERO TOLERANCE');
      earned.push('ZERO TOLERANCE');
      highestBadge = 'ZERO TOLERANCE';
      unlockAdvancedLevel();
    } else if (correctAnswersCount > 0) {
      unlockAchievement('SCAM SURVIVOR');
      earned.push('SCAM SURVIVOR');
      highestBadge = 'SCAM SURVIVOR';
    } else {
      highestBadge = 'MEMBER BARU';
    }

    setNewAchievements(earned);
    saveScoreLog(highestBadge);
  };

  const getDifficultyStyle = (level: string) => {
    switch (level) {
      case 'Easy': return 'border-laci/50 bg-laci/10 text-laci dark:text-kertas-gelap';
      case 'Medium': return 'border-bukti/50 bg-bukti/10 text-bukti';
      case 'Hard': return 'border-cap/50 bg-cap/10 text-cap';
      case 'Expert': return 'border-tinta bg-tinta text-kertas dark:border-kertas-gelap dark:bg-kertas-gelap dark:text-arsip';
      default: return 'border-tinta/40 text-tinta dark:text-kertas-gelap';
    }
  };

  if (isQuizFinished) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-2xl rounded-sm border-2 border-tinta bg-kertas-2 p-8 text-center shadow-[6px_6px_0_#1b1a17] md:p-12 dark:border-kertas-gelap/60 dark:bg-arsip-2 dark:shadow-[6px_6px_0_#efe9dc33]"
        >
          <p className="font-mono text-xs font-bold tracking-[0.2em] text-daktil dark:text-kertas-gelap/60">
            PERKARA SELESAI · MISSION REPORT
          </p>
          <h2 className="mt-2 font-display text-3xl font-black">Hasil evaluasi radar sibermu</h2>

          <div className="mt-8 grid grid-cols-1 gap-5 text-left sm:grid-cols-2">
            <div className="rounded-sm border border-tinta/25 bg-kertas p-5 text-center dark:border-kertas-gelap/25 dark:bg-arsip">
              <p className="font-mono text-4xl font-black tabular-nums text-laci dark:text-kertas-gelap">
                {correctAnswersCount}/{totalQuestionsToPlay}
              </p>
              <p className="mt-1 font-mono text-xs font-bold uppercase tracking-wider text-daktil dark:text-kertas-gelap/60">
                Akurasi jawaban
              </p>
            </div>

            <div className="rounded-sm border border-cap/40 bg-cap/5 p-5 text-center dark:border-cap/50">
              <Target className="mx-auto mb-2 h-6 w-6 text-cap" aria-hidden="true" />
              <p className="font-mono text-[10px] font-bold uppercase text-daktil dark:text-kertas-gelap/60">
                Rekomendasi fokus:
              </p>
              <p className="mt-1 text-sm font-black uppercase tracking-wide text-cap">
                {getWeakestCategory()}
              </p>
            </div>
          </div>

          {newAchievements.length > 0 && (
            <div className="mb-8 mt-5 rounded-sm border border-laci/40 bg-laci/10 p-5 text-left">
              <h3 className="font-mono text-sm font-bold text-laci dark:text-kertas-gelap">
                Badge baru terbuka
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {newAchievements.map(ach => (
                  <span key={ach} className="rounded-sm border-2 border-laci/50 bg-kertas px-3 py-1.5 font-mono text-xs font-bold text-laci dark:bg-arsip dark:text-kertas-gelap">
                    {ach}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMode('home')}
            className="min-h-14 w-full rounded-sm border-2 border-tinta bg-laci px-8 py-4 font-mono text-sm font-bold text-kertas transition-colors hover:bg-laci-tua focus-visible:outline-2 focus-visible:outline-laci active:scale-97"
          >
            KEMBALI KE DASHBOARD
          </button>
        </motion.div>
      </div>
    );
  }

  if (isReportingPhase) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 md:p-6">
        <div className="mb-6 flex w-full max-w-3xl items-center justify-between">
          <p className="flex items-center gap-2 font-mono text-sm font-bold text-laci dark:text-kertas-gelap">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" /> SCAM REPORTER STATION
          </p>
          <p className="rounded-sm border-2 border-tinta/25 bg-kertas px-3 py-1.5 font-mono text-xs font-bold dark:border-kertas-gelap/25 dark:bg-arsip">
            Langkah: {reportStep}/3
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-3xl rounded-sm border-2 border-tinta bg-kertas-2 p-6 shadow-[6px_6px_0_#1b1a17] md:p-8 dark:border-kertas-gelap/60 dark:bg-arsip-2 dark:shadow-[6px_6px_0_#efe9dc33]"
        >
          {reportStep === 1 && (
            <div className="text-center">
              <h2 className="font-display text-2xl font-black">Ambil bukti bersalah</h2>
              <p className="mx-auto mb-6 mt-2 max-w-lg text-sm leading-relaxed text-tinta/80 dark:text-kertas-gelap/80">
                Simulasi: pelaku mengirimkan file berbahaya berkedok dokumen kurir
                ekspedisi. Amankan bukti screenshot sebelum memblokir!
              </p>

              <div className="mx-auto mb-8 max-w-sm rounded-sm border-2 border-tinta bg-[#0b141a] p-4 text-left shadow-[4px_4px_0_#1b1a17]">
                <div className="mb-4 flex items-center gap-3 bg-[#202c33] p-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3b4a54] font-mono text-xs font-bold text-white">J&amp;T</span>
                  <span className="text-sm font-bold text-white">Kurir J&amp;T Express</span>
                </div>
                <p className="mb-2 w-[85%] rounded-sm rounded-tl-none bg-[#202c33] p-3 text-sm text-white">
                  Permisi pak/ibu.. benar dgn nama pemilik no ini? Ada paket..
                </p>
                <div className="w-[85%] rounded-sm rounded-tl-none border border-cap/60 bg-[#202c33] p-3 text-sm text-white">
                  <p className="mb-2 flex items-center gap-2 rounded-sm bg-[#111b21] p-2">
                    <FileImage className="h-5 w-5 text-cap" aria-hidden="true" />
                    <span className="font-mono text-xs text-red-300">Lihat_Foto_Paket.apk</span>
                  </p>
                  Silahkan di cek detail foto paketnya disni ya agar jelas
                </div>
              </div>

              <button
                type="button"
                onClick={() => setReportStep(2)}
                className="inline-flex min-h-14 items-center gap-2 rounded-sm border-2 border-tinta bg-laci px-8 py-4 font-mono text-sm font-bold text-kertas transition-colors hover:bg-laci-tua focus-visible:outline-2 focus-visible:outline-laci active:scale-97"
              >
                <Camera className="w-4 h-4" aria-hidden="true" />
                AMBIL SCREENSHOT BUKTI
              </button>
            </div>
          )}

          {reportStep === 2 && (
            <div className="text-center">
              <span className="mb-4 inline-block rounded-full bg-laci/10 p-3 text-laci dark:text-kertas-gelap">
                <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
              </span>
              <h2 className="font-display text-2xl font-black">Bukti berhasil disimpan!</h2>
              <p className="mb-8 mt-2 text-sm text-tinta/80 dark:text-kertas-gelap/80">
                Ke portal aduan resmi mana nomor penipu siber ini harus dilaporkan?
              </p>

              <div className="mx-auto grid max-w-lg gap-4 text-left">
                <button type="button" onClick={() => handleReportSubmit(false)} className="min-h-14 w-full rounded-sm border-2 border-tinta/25 bg-kertas p-4 text-left transition-colors hover:border-tinta focus-visible:outline-2 focus-visible:outline-laci dark:border-kertas-gelap/25 dark:bg-arsip">
                  <span className="block font-bold">Share massal di sosial media</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-daktil dark:text-kertas-gelap/60">Biar viral saja, namun nomor penipu tetap bebas aktif berkeliaran mencari korban.</span>
                </button>
                <button type="button" onClick={() => handleReportSubmit(true)} className="min-h-14 w-full rounded-sm border-2 border-laci bg-laci/10 p-4 text-left transition-colors hover:border-laci focus-visible:outline-2 focus-visible:outline-laci">
                  <span className="block font-bold text-laci dark:text-kertas-gelap">
                    Portal Otoritas AduanNomor.id
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-tinta/80 dark:text-kertas-gelap/80">Melaporkan nomor ke database aduan resmi Kominfo agar segera diblokir permanen.</span>
                </button>
                <button type="button" onClick={() => handleReportSubmit(false)} className="min-h-14 w-full rounded-sm border-2 border-tinta/25 bg-kertas p-4 text-left transition-colors hover:border-tinta focus-visible:outline-2 focus-visible:outline-laci dark:border-kertas-gelap/25 dark:bg-arsip">
                  <span className="block font-bold">Abaikan dan hapus chat</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-daktil dark:text-kertas-gelap/60">Mengamankan diri sendiri namun membiarkan penipu mencari target berikutnya.</span>
                </button>
              </div>
            </div>
          )}

          {reportStep === 3 && (
            <div className="py-6 text-center">
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 inline-block rounded-full bg-laci/10 p-4 text-laci dark:text-kertas-gelap">
                <Send className="w-10 h-10" aria-hidden="true" />
              </motion.span>
              <h2 className="font-display text-3xl font-black">Laporan dikirim!</h2>
              <p className="mb-6 mt-2 text-sm text-tinta/80 dark:text-kertas-gelap/80">
                Langkah tanggap Anda membantu melindungi jutaan pengguna internet nasional.
              </p>

              <p className="mb-8 inline-block rounded-sm border-2 border-laci/50 bg-laci/10 px-6 py-3 font-mono text-sm font-bold text-laci dark:text-kertas-gelap">
                +25 PTS (Anti-Scam Squad Bonus)
              </p>

              <div className="flex flex-col justify-center gap-4 font-mono text-xs font-bold sm:flex-row">
                <a
                  href="https://aduannomor.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 items-center justify-center gap-2 rounded-sm border-2 border-tinta/40 px-6 py-3 transition-colors hover:border-tinta focus-visible:outline-2 focus-visible:outline-laci"
                >
                  <ExternalLink className="w-4 h-4" aria-hidden="true" /> KUNJUNGI ADUANNOMOR.ID
                </a>
                <button type="button" onClick={calculateAchievements} className="flex min-h-12 items-center justify-center gap-2 rounded-sm border-2 border-tinta bg-laci px-6 py-3 text-kertas transition-colors hover:bg-laci-tua focus-visible:outline-2 focus-visible:outline-laci active:scale-97">
                  LIHAT MISSION REPORT <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center p-4 md:p-8">
      <div className="mb-8 flex w-full max-w-4xl items-center justify-between">
        <button
          type="button"
          onClick={() => setMode('home')}
          className="flex min-h-11 items-center gap-2 rounded-sm border-2 border-tinta/40 bg-kertas px-4 py-2.5 font-mono text-xs font-bold transition-colors hover:border-tinta focus-visible:outline-2 focus-visible:outline-laci dark:border-kertas-gelap/40 dark:bg-arsip dark:text-kertas-gelap"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>BATALKAN MISI</span>
        </button>
        <p className="rounded-sm border-2 border-tinta/25 bg-kertas px-4 py-2.5 font-mono text-xs font-bold dark:border-kertas-gelap/25 dark:bg-arsip">
          Misi teruji: {visitedIndices.length} / {totalQuestionsToPlay}
        </p>
      </div>

      <div className="flex w-full max-w-3xl flex-col items-center">
        <div className="mb-6 flex w-full flex-col items-center">
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-black md:text-3xl">
            <Siren className="h-6 w-6 text-cap" aria-hidden="true" />
            Spot the Scam
          </h2>

          <div className="flex w-full items-center justify-between rounded-sm border-2 border-tinta bg-kertas-2 p-4 dark:border-kertas-gelap/60 dark:bg-arsip-2">
            <span className={`rounded-sm border px-3 py-1 font-mono text-xs font-bold ${getDifficultyStyle(question.difficulty)}`}>
              LEVEL: {question.difficulty.toUpperCase()}
            </span>

            <span className={`flex items-center gap-1.5 font-mono text-lg font-bold tabular-nums ${timeLeft <= 5 ? 'animate-pulse text-cap' : 'text-laci dark:text-kertas-gelap'}`}>
              <Clock className="w-5 h-5" aria-hidden="true" />
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </span>
          </div>
        </div>

        {/* Skenario: mockup email untuk kanal email, kartu barang bukti untuk kanal lain */}
        <div className="relative mb-6 w-full overflow-hidden rounded-sm border-2 border-tinta bg-kertas-2 shadow-[4px_4px_0_#1b1a17] dark:border-kertas-gelap/60 dark:bg-arsip-2 dark:shadow-[4px_4px_0_#efe9dc33]">
          {!isAnswered && (
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 15, ease: 'linear' }}
              className={`absolute left-0 top-0 h-1.5 ${timeLeft <= 5 ? 'bg-cap' : 'bg-laci'}`}
              aria-hidden="true"
            />
          )}
          {question.channel === 'email' ? (
            <div className="p-4 md:p-6">
              <p className="mb-3 font-mono text-xs font-bold tracking-wide text-daktil dark:text-kertas-gelap/60">
                BARANG BUKTI · KANAL: EMAIL
              </p>
              <EmailMockup
                senderName="HRD Perusahaan X"
                senderAddress="hrd@perusahaan-x.example"
                subject="Undangan Interview — Formulir Terlampir"
                content={question.scenarioEn}
                date="Hari ini, 09:41"
              />
              <p className="mt-3 flex items-start gap-2 font-mono text-xs leading-relaxed text-cap">
                <FileImage className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                Lampiran: Form_Interview.exe — file PDF tidak mungkin berekstensi .exe.
              </p>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              <p className="mb-3 font-mono text-xs font-bold tracking-wide text-daktil dark:text-kertas-gelap/60">
                BARANG BUKTI · KANAL: {CHANNEL_LABEL[question.channel]?.toUpperCase() ?? 'PESAN'} · {question.category?.toUpperCase()}
              </p>
              <p className="text-lg font-bold leading-relaxed md:text-xl">
                &ldquo;{question.scenarioEn}&rdquo;
              </p>
              <AnimatePresence>
                {showTranslation && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 w-full border-t-2 border-tinta/15 pt-4 text-sm italic leading-relaxed text-tinta/80 dark:text-kertas-gelap/80"
                  >
                    ID: &ldquo;{question.scenarioId}&rdquo;
                  </motion.p>
                )}
              </AnimatePresence>
              <button
                type="button"
                onClick={() => setShowTranslation(!showTranslation)}
                className="mt-6 flex min-h-11 items-center gap-1.5 self-end rounded-sm border border-tinta/40 px-4 py-2 font-mono text-xs font-bold transition-colors hover:border-tinta focus-visible:outline-2 focus-visible:outline-laci"
              >
                <Languages className="w-4 h-4" aria-hidden="true" />
                {showTranslation ? 'Sembunyikan terjemahan' : 'Terjemahkan (ID)'}
              </button>
            </div>
          )}
        </div>

        {/* Pilihan jawaban */}
        <div className="mb-8 flex w-full flex-col gap-3">
          {question.optionsEn.map((optionEn, index) => {
            let stateClass = 'border-tinta/40 bg-kertas hover:border-tinta dark:border-kertas-gelap/40 dark:bg-arsip dark:hover:border-kertas-gelap';
            if (isAnswered) {
              if (index === question.correctAnswerIndex) {
                stateClass = 'border-laci bg-laci/10 text-laci dark:text-kertas-gelap';
              } else if (index === selectedAnswer) {
                stateClass = 'border-cap bg-cap/10 text-cap';
              } else {
                stateClass = 'border-tinta/20 text-daktil/50 opacity-60 dark:border-kertas-gelap/20';
              }
            }

            return (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(index)}
                disabled={isAnswered}
                className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-sm border-2 p-4 text-left font-bold transition-all focus-visible:outline-2 focus-visible:outline-laci disabled:cursor-default ${stateClass}`}
              >
                <span className="flex flex-1 flex-col gap-1">
                  <span className="flex items-baseline gap-2.5 text-sm md:text-base">
                    <span className="font-mono text-xs font-bold opacity-70">{OPTION_LETTERS[index]}.</span>
                    <span>{optionEn}</span>
                  </span>
                  <AnimatePresence>
                    {showTranslation && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="pl-6 text-xs italic opacity-80"
                      >
                        {question.optionsId[index]}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                <span className="flex shrink-0 justify-end">
                  {isAnswered && index === question.correctAnswerIndex && <CheckCircle2 className="h-6 w-6 text-laci dark:text-kertas-gelap" aria-hidden="true" />}
                  {isAnswered && index === selectedAnswer && index !== question.correctAnswerIndex && <XCircle className="h-6 w-6 text-cap" aria-hidden="true" />}
                </span>
              </button>
            );
          })}
        </div>

        {/* Penjelasan jawaban */}
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`relative mb-8 w-full rounded-sm border-2 p-6 ${
              isTimeOut
                ? 'border-bukti/60 bg-bukti/10'
                : selectedAnswer === question.correctAnswerIndex
                  ? 'border-laci/60 bg-laci/10'
                  : 'border-cap/60 bg-cap/10'
            }`}
          >
            {selectedAnswer === question.correctAnswerIndex && !isTimeOut && (
              <p className="absolute -top-4 right-6 rounded-sm border-2 border-tinta bg-bukti px-4 py-1.5 font-mono text-xs font-black text-arsip">
                +{pointsEarnedThisRound} PTS (bonus kecepatan)
              </p>
            )}
            <div className="flex items-start gap-3">
              <AlertCircle
                className={`mt-1 h-6 w-6 shrink-0 ${isTimeOut ? 'text-bukti' : selectedAnswer === question.correctAnswerIndex ? 'text-laci dark:text-kertas-gelap' : 'text-cap'}`}
                aria-hidden="true"
              />
              <div className="flex w-full flex-col gap-2">
                <h3 className={`font-display text-lg font-black ${isTimeOut ? 'text-bukti' : selectedAnswer === question.correctAnswerIndex ? 'text-laci dark:text-kertas-gelap' : 'text-cap'}`}>
                  {isTimeOut ? 'Waktu habis!' : selectedAnswer === question.correctAnswerIndex ? 'Analisis benar!' : 'Analisis kurang tepat!'}
                </h3>
                <p className="text-sm font-semibold leading-relaxed md:text-base">
                  {question.explanationEn}
                </p>
                {showTranslation && (
                  <p className="border-t border-tinta/15 pt-2 text-xs italic leading-relaxed text-tinta/80 dark:text-kertas-gelap/80">
                    ID: {question.explanationId}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="mt-6 flex min-h-14 w-full items-center justify-center gap-1.5 rounded-sm border-2 border-tinta bg-laci px-8 py-3.5 font-mono text-sm font-bold text-kertas transition-colors hover:bg-laci-tua focus-visible:outline-2 focus-visible:outline-laci active:scale-97"
            >
              {isLastQuestion ? 'PROSES EVALUASI & ADUAN' : 'KASUS BERIKUTNYA'} <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
