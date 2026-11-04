import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameEngine } from '../../hooks/useGameEngine';
import { quizData } from '../../data/quizData';
import { 
  ArrowLeft, ChevronRight, Clock, AlertCircle, 
  CheckCircle2, XCircle, Languages, ShieldCheck, Target,
  Camera, FileImage, Send, ExternalLink
} from 'lucide-react';

const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard', 'Expert'];

const OPTION_COLORS = [
  "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_6px_0_#be123c] border-rose-400",
  "bg-sky-500 hover:bg-sky-600 text-white shadow-[0_6px_0_#0369a1] border-sky-400",
  "bg-amber-500 hover:bg-amber-600 text-white shadow-[0_6px_0_#b45309] border-amber-400",
  "bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_6px_0_#047857] border-emerald-400",
];

export function SpotTheScamView() {
  const { setMode, addPoints, unlockAchievement, unlockAdvancedLevel, saveScoreLog, recordMistake, getWeakestCategory, addQuizCorrectProgress } = useGameEngine();
  
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
    if (timeLeft > 0 && !isAnswered && !isQuizFinished && !isReportingPhase) {
      const timerId = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !isAnswered) {
      setIsTimeOut(true);
      setIsAnswered(true);
      setSelectedAnswer(-1);
      setPointsEarnedThisRound(0);
      recordMistake(question.category || 'General');
    }
  }, [timeLeft, isAnswered, isQuizFinished, isReportingPhase]);

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
      
      addQuizCorrectProgress(1);
      setCurrentDiffIndex(prev => Math.min(prev + 1, DIFFICULTY_LEVELS.length - 1));
    } else {
      setPointsEarnedThisRound(0);
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
    let highestBadge = "MEMBER BARU"; 
    
    if (correctAnswersCount > 0) {
      unlockAchievement("SCAM SURVIVOR");
      earned.push("SCAM SURVIVOR");
      highestBadge = "SCAM SURVIVOR";
    }
    
    if (correctAnswersCount === totalQuestionsToPlay) {
      unlockAchievement("SCAM HUNTER");
      earned.push("SCAM HUNTER");
      highestBadge = "SCAM HUNTER";
      unlockAchievement("ZERO TOLERANCE");
      earned.push("ZERO TOLERANCE");
      highestBadge = "ZERO TOLERANCE";
      unlockAdvancedLevel();
    }
    
    setNewAchievements(earned);
    saveScoreLog(highestBadge);
  };

  const getDifficultyColor = (level: string) => {
    switch(level) {
      case 'Easy': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Hard': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Expert': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    }
  };

  if (isQuizFinished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative select-none">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-white border-2 border-indigo-100 p-8 md:p-12 rounded-3xl w-full max-w-2xl text-center shadow-[0_12px_0_rgba(99,102,241,0.08)]"
        >
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-black text-slate-800 mb-2 font-mono">MISSION REPORT</h2>
          <p className="text-slate-500 mb-8 font-mono text-sm">HASIL EVALUASI RADAR SIBER AGEN</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-left">
            <div className="bg-indigo-50/40 p-6 rounded-2xl border border-indigo-100 flex flex-col items-center justify-center text-center">
              <div className="text-4xl font-black text-indigo-600 mb-2">{correctAnswersCount}/{totalQuestionsToPlay}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Akurasi Jawaban</div>
            </div>
            
            <div className="bg-rose-50/40 p-6 rounded-2xl border border-rose-100 flex flex-col items-center justify-center text-center">
              <Target className="w-6 h-6 text-rose-500 mb-2" />
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Rekomendasi Fokus:</div>
              <div className="text-sm font-black text-rose-600 uppercase tracking-wide">
                {getWeakestCategory()}
              </div>
            </div>
          </div>

          {newAchievements.length > 0 && (
            <div className="mb-8 text-left bg-purple-50/40 p-6 rounded-2xl border border-purple-100">
              <h3 className="text-purple-700 font-bold text-sm mb-3 flex items-center gap-2">
                🌟 BADGE BARU TERBUKA
              </h3>
              <div className="flex flex-wrap gap-2">
                {newAchievements.map(ach => (
                  <span key={ach} className="bg-white border-2 border-purple-200 text-purple-700 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
                    🏅 {ach}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setMode('home')}
            className="w-full bg-indigo-600 hover:bg-indigo-500 active:translate-y-1 active:border-b-0 text-white px-8 py-4 border-b-4 border-indigo-800 rounded-2xl font-bold transition-all shadow-md"
          >
            KEMBALI KE DASHBOARD
          </button>
        </motion.div>
      </div>
    );
  }

  if (isReportingPhase) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative select-none">
        <div className="w-full max-w-3xl flex justify-between items-center mb-6">
          <div className="text-indigo-600 font-bold text-sm flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" /> SCAM_REPORTER_STATION
          </div>
          <div className="bg-white border-2 border-indigo-100 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-600 shadow-sm">
            Langkah: {reportStep}/3
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-indigo-100 p-6 md:p-8 rounded-3xl w-full max-w-3xl shadow-[0_12px_0_rgba(99,102,241,0.08)] relative overflow-hidden"
        >
          {reportStep === 1 && (
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-800 mb-2 font-mono">AMBIL BUKTI BERSALAH</h2>
              <p className="text-slate-500 mb-6 text-sm">Simulasi: Pelaku mengirimkan file berbahaya berkedok dokumen kurir ekspedisi. Amankan bukti screenshot sebelum memblokir!</p>
              
              <div className="bg-[#0b141a] border-4 border-slate-700 rounded-2xl p-4 max-w-sm mx-auto text-left relative overflow-hidden shadow-lg mb-8">
                <div className="bg-[#202c33] -m-4 mb-4 p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-xs font-bold text-white">J&T</div>
                  <div className="text-white text-sm font-bold">Kurir J&T Express</div>
                </div>
                <div className="bg-[#202c33] text-white p-3 rounded-lg rounded-tl-none text-sm w-[85%] mb-2">
                  Permisi pak/ibu.. benar dgn nama pemilik no ini? Ada paket..
                </div>
                <div className="bg-[#202c33] text-white p-3 rounded-lg rounded-tl-none text-sm w-[85%] border border-rose-500/40">
                  <div className="flex items-center gap-2 mb-2 bg-slate-800 p-2 rounded">
                    <FileImage className="text-rose-400 w-5 h-5 animate-pulse" />
                    <span className="font-mono text-xs text-rose-300">Lihat_Foto_Paket.apk</span>
                  </div>
                  Silahkan di cek detail foto paketnya disni ya agar jelas
                </div>
              </div>

              <button
                onClick={() => setReportStep(2)}
                className="group inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:translate-y-1 active:border-b-0 text-white px-8 py-4 border-b-4 border-indigo-800 rounded-2xl font-bold transition-all shadow-md text-sm"
              >
                <Camera className="w-4 h-4" />
                AMBIL SCREENSHOT BUKTI
              </button>
            </div>
          )}

          {reportStep === 2 && (
            <div className="text-center">
              <div className="inline-block bg-emerald-100 text-emerald-600 p-3 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2 font-mono">BUKTI BERHASIL DISIMPAN!</h2>
              <p className="text-slate-500 mb-8 text-sm">Ke portal aduan resmi mana nomor penipu siber ini harus dilaporkan?</p>

              <div className="grid gap-4 max-w-lg mx-auto text-left font-sans">
                <button onClick={() => handleReportSubmit(false)} className="bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 p-4 rounded-2xl transition-all w-full text-left">
                  <span className="block font-bold text-slate-800">Share Massal di Sosial Media</span>
                  <span className="text-xs text-slate-500">Biar viral saja, namun nomor penipu tetap bebas aktif berkeliaran mencari korban.</span>
                </button>
                <button onClick={() => handleReportSubmit(true)} className="bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 p-4 rounded-2xl transition-all w-full text-left">
                  <span className="font-bold text-indigo-700 flex items-center justify-between">
                    Portal Otoritas AduanNomor.id 🛡️
                  </span>
                  <span className="text-xs text-indigo-600">Melaporkan nomor ke database aduan resmi Kominfo agar segera diblokir permanen.</span>
                </button>
                <button onClick={() => handleReportSubmit(false)} className="bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 p-4 rounded-2xl transition-all w-full text-left">
                  <span className="block font-bold text-slate-800">Abaikan & Hapus Chat</span>
                  <span className="text-xs text-slate-500">Mengamankan diri sendiri namun membiarkan penipu mencari target berikutnya.</span>
                </button>
              </div>
            </div>
          )}

          {reportStep === 3 && (
            <div className="text-center py-6">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block bg-emerald-100 text-emerald-600 p-4 rounded-full mb-6">
                <Send className="w-10 h-10" />
              </motion.div>
              <h2 className="text-3xl font-black text-slate-800 mb-2 font-mono">LAPORAN DIKIRIM!</h2>
              <p className="text-slate-500 mb-6 text-sm">Langkah tanggap Anda membantu melindungi jutaan pengguna internet nasional.</p>
              
              <div className="inline-block bg-emerald-50 border-2 border-emerald-200 px-6 py-3 rounded-2xl mb-8">
                <span className="text-emerald-700 font-bold text-sm md:text-base">+25 PTS (Anti-Scam Squad Bonus)</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center text-xs font-bold">
                <a 
                  href="https://aduannomor.id/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl border border-slate-300"
                >
                  <ExternalLink className="w-4 h-4" /> KUNJUNGI ADUANNOMOR.ID
                </a>
                <button onClick={calculateAchievements} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:translate-y-0.5 text-white px-6 py-3 rounded-xl shadow-md">
                  LIHAT MISSION REPORT <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-12 relative flex flex-col items-center select-none">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <button onClick={() => setMode('home')} className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-indigo-600 border-2 border-indigo-100 rounded-2xl shadow-sm transition-all text-xs font-bold">
          <ArrowLeft className="w-4 h-4 text-indigo-500" />
          <span>BATALKAN MISI</span>
        </button>
        <div className="flex gap-4">
          <div className="bg-white border-2 border-indigo-100 px-4 py-2.5 rounded-2xl text-xs font-bold text-indigo-600">
            Misi Teruji: {visitedIndices.length} / {totalQuestionsToPlay}
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl flex flex-col items-center">
        <div className="flex flex-col items-center mb-6 w-full">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-4 flex items-center gap-2 font-mono">
            🚨 SPOT_THE_SCAM
          </h2>
          
          <div className="flex items-center justify-between w-full bg-white border-2 border-indigo-50 p-4 rounded-2xl shadow-sm">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(question.difficulty)}`}>
              LEVEL: {question.difficulty.toUpperCase()}
            </span>

            <div className={`flex items-center gap-1.5 font-bold text-lg ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-indigo-600'}`}>
              <Clock className="w-5 h-5 text-indigo-500" />
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>
          </div>
        </div>

        {/* SCENARIO CONTAINER (VIBRANT INSPIRED) */}
        <div className="w-full bg-white border-2 border-indigo-100 p-6 md:p-8 rounded-3xl mb-6 shadow-[0_8px_0_rgba(99,102,241,0.05)] relative overflow-hidden flex flex-col items-start">
          {!isAnswered && (
            <motion.div initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: 15, ease: "linear" }} className={`absolute top-0 left-0 h-1.5 ${timeLeft <= 5 ? 'bg-rose-500' : 'bg-indigo-500'}`} />
          )}

          <p className="text-slate-800 text-lg md:text-xl font-bold leading-relaxed">
            "{question.scenarioEn}"
          </p>

          <AnimatePresence>
            {showTranslation && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-slate-500 italic text-sm md:text-base mt-4 pt-4 border-t-2 border-slate-100 w-full font-medium">
                ID: "{question.scenarioId}"
              </motion.p>
            )}
          </AnimatePresence>

          <button onClick={() => setShowTranslation(!showTranslation)} className="mt-6 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-end">
            <Languages className="w-4 h-4 text-indigo-500" />
            {showTranslation ? 'Sembunyikan Terjemahan' : 'Terjemahkan (ID)'}
          </button>
        </div>

        {/* OPTIONS BUTTONS (VIBRANT COLORS & HOVER SCALE) */}
        <div className="w-full flex flex-col gap-4 mb-8">
          {question.optionsEn.map((optionEn, index) => {
            let colorClass = OPTION_COLORS[index] || OPTION_COLORS[0];
            
            if (isAnswered) {
              if (index === question.correctAnswerIndex) {
                colorClass = "bg-emerald-500 text-white shadow-[0_6px_0_#047857] border-emerald-300 scale-102"; 
              } else if (index === selectedAnswer) {
                colorClass = "bg-rose-500 text-white shadow-[0_6px_0_#be123c] border-rose-300"; 
              } else {
                colorClass = "bg-slate-100 border-2 border-slate-200 text-slate-400 opacity-40"; 
              }
            }

            return (
              <motion.button 
                key={index} 
                whileHover={{ scale: isAnswered ? 1 : 1.05 }} 
                whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                onClick={() => handleSelect(index)} 
                disabled={isAnswered} 
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between font-bold text-sm md:text-base ${colorClass}`}
              >
                <div className="flex flex-col gap-1 w-11/12">
                  <span>{optionEn}</span>
                  <AnimatePresence>
                    {showTranslation && (
                      <motion.span initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-xs text-white/80 italic font-medium mt-1">
                        {question.optionsId[index]}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="w-1/12 flex justify-end shrink-0">
                  {isAnswered && index === question.correctAnswerIndex && <CheckCircle2 className="w-6 h-6 text-white fill-emerald-600 rounded-full" />}
                  {isAnswered && index === selectedAnswer && index !== question.correctAnswerIndex && <XCircle className="w-6 h-6 text-white fill-rose-600 rounded-full" />}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ANSWER EXPLANATION CARD */}
        {isAnswered && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`w-full p-6 rounded-3xl mb-8 border-2 relative ${isTimeOut ? 'bg-amber-50 border-amber-200 text-slate-800' : selectedAnswer === question.correctAnswerIndex ? 'bg-emerald-50 border-emerald-200 text-slate-800' : 'bg-rose-50 border-rose-200 text-slate-800'}`}>
            {selectedAnswer === question.correctAnswerIndex && !isTimeOut && (
               <div className="absolute -top-4 right-6 bg-emerald-500 text-white font-extrabold px-4 py-1.5 rounded-full text-xs md:text-sm animate-bounce shadow-md">
                 +{pointsEarnedThisRound} PTS (Speed Bonus!)
               </div>
            )}
            <div className="flex items-start gap-3">
              <AlertCircle className={`w-6 h-6 shrink-0 mt-1 ${isTimeOut ? 'text-amber-500' : selectedAnswer === question.correctAnswerIndex ? 'text-emerald-500' : 'text-rose-500'}`} />
              <div className="flex flex-col gap-2 w-full">
                <h3 className={`text-lg font-black ${isTimeOut ? 'text-amber-600' : selectedAnswer === question.correctAnswerIndex ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isTimeOut ? "WAKTU HABIS!" : selectedAnswer === question.correctAnswerIndex ? "ANALISIS BENAR!" : "ANALISIS KURANG TEPAT!"}
                </h3>
                <p className="text-slate-700 font-semibold leading-relaxed text-sm md:text-base">
                  {question.explanationEn}
                </p>
                {showTranslation && (
                  <p className="text-slate-600 italic leading-relaxed text-xs md:text-sm border-t border-slate-200 pt-2 mt-1">
                    ID: {question.explanationId}
                  </p>
                )}
              </div>
            </div>
            <button onClick={handleNext} className="w-full mt-6 flex justify-center items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 border-b-4 border-indigo-800 rounded-2xl font-bold transition-all shadow-md">
              {isLastQuestion ? 'PROSES EVALUASI & ADUAN' : 'KASUS BERIKUTNYA'} <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}