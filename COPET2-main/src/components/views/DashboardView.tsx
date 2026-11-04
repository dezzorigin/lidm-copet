import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameEngine } from '../../hooks/useGameEngine';
import { CertificateModal } from '../ui/CertificateModal'; 
import { 
  LogOut, Award, User, Flame, Target, CheckCircle2, Lightbulb 
} from 'lucide-react';

export function DashboardView() {
  const { 
    setMode, logout, playerName, userPoints, achievements,
    streakCount, quizCorrectToday, simCompletedToday, isQuizClaimed, isSimClaimed, claimMissionReward 
  } = useGameEngine();
  
  const [isCertOpen, setIsCertOpen] = useState(false); 

  return (
    <div className="min-h-[80vh] text-slate-800 dark:text-slate-100 p-2 md:p-6 relative select-none transition-colors duration-300">
      
      {/* MAIN GRID */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 z-10 relative">
        
        {/* ============================================================== */}
        {/* SISI KIRI (MAIN CONTENT AREA - 3/4 LAYAR)                      */}
        {/* ============================================================== */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* WELCOME BANNER */}
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
              Selamat Datang, Detektif! 👋
            </h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium text-sm md:text-base border-l-4 border-indigo-500 dark:border-indigo-400 pl-3">
              Pilih salah satu level pelatihan di bawah ini untuk menguji dan mengasah radar siber Anda.
            </p>
          </div>

          {/* DAILY OPERATIONAL MISSIONS BOARD */}
          <div className="bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-gray-700 p-6 rounded-3xl shadow-[0_8px_0_rgba(99,102,241,0.04)] dark:shadow-[0_8px_0_rgba(0,0,0,0.15)] transition-colors duration-300">
            <h3 className="text-xs font-mono font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" /> Misi Harian Agen
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* MISI 1: DETEKSI KUIS */}
              <div className="bg-indigo-50/40 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-100/70 dark:border-indigo-900/50 flex items-center justify-between gap-4 transition-colors duration-300">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${quizCorrectToday >= 3 ? 'text-emerald-500 font-bold' : 'text-slate-300 dark:text-slate-600'}`}>
                    <CheckCircle2 className="w-5 h-5 fill-current bg-white dark:bg-gray-700 rounded-full" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Deteksi 3 Red Flags Kuis</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">Progress: {quizCorrectToday}/3 Soal Benar</div>
                  </div>
                </div>
                <button
                  onClick={() => claimMissionReward('quiz')}
                  disabled={quizCorrectToday < 3 || isQuizClaimed}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isQuizClaimed
                      ? 'bg-slate-100 dark:bg-gray-700 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-gray-600 cursor-not-allowed'
                      : quizCorrectToday >= 3
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1'
                      : 'bg-slate-200 dark:bg-gray-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isQuizClaimed ? 'CLAIMED' : 'KLAIM (+15)'}
                </button>
              </div>

              {/* MISI 2: SIMULASI */}
              <div className="bg-indigo-50/40 dark:bg-indigo-950/20 p-4 rounded-2xl border border-indigo-100/70 dark:border-indigo-900/50 flex items-center justify-between gap-4 transition-colors duration-300">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${simCompletedToday ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`}>
                    <CheckCircle2 className="w-5 h-5 fill-current bg-white dark:bg-gray-700 rounded-full" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Selesaikan Live Simulation</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">Progress: {simCompletedToday ? '1' : '0'}/1 Misi</div>
                  </div>
                </div>
                <button
                  onClick={() => claimMissionReward('sim')}
                  disabled={!simCompletedToday || isSimClaimed}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSimClaimed
                      ? 'bg-slate-100 dark:bg-gray-700 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-gray-600 cursor-not-allowed'
                      : simCompletedToday
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1'
                      : 'bg-slate-200 dark:bg-gray-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isSimClaimed ? 'CLAIMED' : 'KLAIM (+15)'}
                </button>
              </div>
            </div>
          </div>

          {/* GRID 3 KARTU MODUL UTAMA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* CARD 1: VOCAB DRILL */}
            <motion.div 
              whileHover={{ y: -4 }}
              onClick={() => setMode('vocab')}
              className="group bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 p-6 rounded-3xl cursor-pointer transition-all flex flex-col gap-4 shadow-[0_8px_0_rgba(99,102,241,0.08)] dark:shadow-[0_8px_0_rgba(0,0,0,0.2)] hover:shadow-[0_12px_0_rgba(99,102,241,0.12)] dark:hover:shadow-[0_12px_0_rgba(0,0,0,0.25)] active:translate-y-1 active:shadow-[0_2px_0_rgba(99,102,241,0.08)]"
            >
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                📖
              </div>
              <div>
                <h3 className="text-xl font-black tracking-wide text-indigo-600 dark:text-indigo-400 mb-2">VOCAB DRILL</h3>
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">Pelajari taktik linguistik siber dan petunjuk bahasa penting yang sering dipakai pelaku.</p>
              </div>
            </motion.div>

            {/* CARD 2: SCAM QUIZ */}
            <motion.div 
              whileHover={{ y: -4 }}
              onClick={() => setMode('quiz')}
              className="group bg-white dark:bg-gray-800 border-2 border-pink-100 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-500 p-6 rounded-3xl cursor-pointer transition-all flex flex-col gap-4 shadow-[0_8px_0_rgba(244,63,94,0.08)] dark:shadow-[0_8px_0_rgba(0,0,0,0.2)] hover:shadow-[0_12px_0_rgba(244,63,94,0.12)] dark:hover:shadow-[0_12px_0_rgba(0,0,0,0.25)] active:translate-y-1 active:shadow-[0_2px_0_rgba(244,63,94,0.08)]"
            >
              <div className="w-16 h-16 bg-pink-50 dark:bg-pink-950/40 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                🚨
              </div>
              <div>
                <h3 className="text-xl font-black tracking-wide text-pink-600 dark:text-pink-400 mb-2">SCAM QUIZ</h3>
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">Uji radar siber Anda di kuis bertingkat dengan simulasi batas waktu krisis 15 detik.</p>
              </div>
            </motion.div>

            {/* CARD 3: LIVE SIMULATION */}
            <motion.div 
              whileHover={{ y: -4 }}
              onClick={() => setMode('sim')}
              className="group bg-white dark:bg-gray-800 border-2 border-emerald-100 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-500 p-6 rounded-3xl cursor-pointer transition-all flex flex-col gap-4 shadow-[0_8px_0_rgba(16,185,129,0.08)] dark:shadow-[0_8px_0_rgba(0,0,0,0.2)] hover:shadow-[0_12px_0_rgba(16,185,129,0.12)] dark:hover:shadow-[0_12px_0_rgba(0,0,0,0.25)] active:translate-y-1 active:shadow-[0_2px_0_rgba(16,185,129,0.08)]"
            >
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                💬
              </div>
              <div>
                <h3 className="text-xl font-black tracking-wide text-emerald-600 dark:text-emerald-400 mb-2">LIVE SIMULATION</h3>
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">Masuk ke skenario percakapan interaktif. Setiap balasan menentukan keamanan akun Anda.</p>
              </div>
            </motion.div>
          </div>

          {/* TAHUKAH KAMU? TRIVIA CARD */}
          <div className="bg-amber-50 dark:bg-amber-950/15 border-2 border-amber-100 dark:border-amber-900/50 p-5 rounded-3xl shadow-sm relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400 dark:bg-amber-600" />
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-amber-500 fill-amber-300 animate-pulse" />
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">Tahukah Kamu? 💡</span>
            </div>
            <div className="text-xs md:text-sm text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed font-semibold">
              <p>• Penipu sering berpura-pura menjadi kurir pengirim barang atau pihak berwenang untuk membuat kita panik (taktik rekayasa sosial).</p>
              <p>• File foto rincian barang tidak pernah berbentuk aplikasi (.APK). Jika kamu menginstal file .APK palsu, data SMS OTP bank kamu bisa disadap!</p>
              <p>• Selalu jaga kerahasiaan Kredensial akun seperti kode OTP, PIN, dan kata sandi dari siapa pun, termasuk dari petugas bank.</p>
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* SISI KANAN (SIDEBAR VERTICAL - 1/4 LAYAR)                      */}
        {/* ============================================================== */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* AGENT PROFILE & STREAK */}
          <div className="bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-gray-700 p-6 rounded-3xl text-center relative overflow-hidden shadow-[0_8px_0_rgba(99,102,241,0.03)] transition-colors duration-300">
            {/* FLOATING STREAK BADGE */}
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-orange-100 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 px-2 py-1 rounded-full text-[10px] font-bold text-orange-600 dark:text-orange-400">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" /> {streakCount} HARI
            </div>

            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-900/30 rounded-full mx-auto mb-3 flex items-center justify-center text-indigo-500 dark:text-indigo-400 shadow-inner">
              <User className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-white font-sans">{playerName}</h3>
            <span className="inline-block mt-2 px-3 py-1 bg-rose-100 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-[10px] font-bold rounded-full tracking-wider">
              {userPoints === 0 ? 'VULNERABLE ⚠️' : 'SECURE 🛡️'}
            </span>
          </div>

          {/* ACCURACY BOX */}
          <div className="bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-gray-700 p-6 rounded-3xl shadow-[0_8px_0_rgba(99,102,241,0.03)] transition-colors duration-300">
            <h4 className="text-xs font-mono font-bold text-slate-400 mb-2 uppercase tracking-wider">
              📊 Radar Akurasi
            </h4>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              87% <span className="text-xs text-slate-500 dark:text-slate-400 font-sans font-normal">Deteksi Berhasil</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-gray-900 h-2.5 rounded-full mt-3 overflow-hidden border border-slate-200/50 dark:border-gray-700">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '87%' }}></div>
            </div>
          </div>

          {/* NET POINTS */}
          <div className="bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-gray-700 p-6 rounded-3xl text-center shadow-[0_8px_0_rgba(99,102,241,0.03)] transition-colors duration-300">
            <h4 className="text-xs font-mono font-bold text-slate-400 mb-1">Poin Terkumpul</h4>
            <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-tighter">
              {userPoints} <span className="text-sm font-bold text-slate-400">PTS</span>
            </div>
          </div>

          {/* BADGES BOX */}
          <div className="bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-gray-700 p-6 rounded-3xl flex-1 shadow-[0_8px_0_rgba(99,102,241,0.03)] transition-colors duration-300">
            <h4 className="text-xs font-mono font-bold text-slate-400 mb-3 flex items-center gap-2 border-b border-indigo-50 dark:border-gray-750 pb-2">
              <Award className="w-4 h-4 text-indigo-500" /> Badge Kehormatan
            </h4>
            <div className="flex flex-col gap-2">
              {achievements.length > 0 ? (
                achievements.map((ach) => (
                  <div key={ach} className="w-full text-center font-bold bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-3 py-2 rounded-xl text-xs shadow-sm">
                    🏆 {ach}
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 font-sans italic text-center py-4">
                  Selesaikan kuis untuk membuka badge.
                </div>
              )}
            </div>
          </div>

          {/* REWARD DOWNLOAD CERTIFICATE */}
          <button
            onClick={() => setIsCertOpen(true)}
            disabled={userPoints < 10} 
            className={`w-full flex justify-center items-center gap-2 p-4 font-bold text-xs rounded-2xl transition-all shadow-md ${
              userPoints >= 10 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 cursor-pointer' 
                : 'bg-slate-200 dark:bg-gray-700 text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-gray-600 cursor-not-allowed opacity-60'
            }`}
          >
            {userPoints >= 10 ? '🎓 DOWNLOAD SERTIFIKAT' : '🔒 SERTIFIKAT TERKUNCI (Min. 10 PTS)'}
          </button>

          {/* LOGOUT BUTTON */}
          <button
            onClick={() => logout()}
            className="w-full flex justify-center items-center gap-2 p-4 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-500 dark:text-rose-400 border-2 border-rose-200 dark:border-rose-900/50 rounded-2xl text-xs font-bold transition-all active:translate-y-0.5"
          >
            <LogOut className="w-4 h-4" /> KELUAR SESI
          </button>

        </div>

      </div>

      {/* CERTIFICATE MODAL */}
      <CertificateModal 
        isOpen={isCertOpen} 
        onClose={() => setIsCertOpen(false)} 
        playerName={playerName} 
        score={userPoints} 
      />
    </div>
  );
}