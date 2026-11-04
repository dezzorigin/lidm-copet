import { useGameEngine } from '../../hooks/useGameEngine';
import { ArrowRight, AlertTriangle, Globe, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function LandingPageView() {
  const { setMode } = useGameEngine();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-2 md:p-6 relative select-none">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl text-center z-10"
      >
        {/* Playful Tag */}
        <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-4 py-1.5 rounded-full text-xs font-bold mb-6 shadow-sm">
          🎯 #MisiKeamananSiberSekolah
        </div>

        {/* Ceria Title */}
        <h1 className="text-4xl md:text-7xl font-black mb-4 tracking-tight leading-none text-slate-900 dark:text-white">
          Belajar Seru <br /> 
          <span className="text-indigo-600 dark:text-indigo-400">Anti-Penipuan!</span>
        </h1>

        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium mb-8 max-w-2xl mx-auto leading-relaxed">
          Waktunya membekali dirimu dengan simulasi COPET: Counter Penipuan Terintegrasi. Latih kemampuan deteksi pesan palsu secara asyik!
        </p>

        {/* Threat Trivia Card (Gaya Kasual) */}
        <div className="bg-white dark:bg-gray-800 border-2 border-rose-100 dark:border-rose-900/50 p-5 md:p-6 rounded-3xl mb-8 text-left shadow-[0_8px_0_rgba(244,63,94,0.05)] transition-all">
          <h2 className="text-rose-600 dark:text-rose-400 font-bold text-sm md:text-base mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 animate-bounce" /> Tahukah Kamu? 💡
          </h2>
          <p className="text-slate-700 dark:text-slate-300 font-medium text-xs md:text-sm leading-relaxed border-l-4 border-rose-400 pl-4">
            Indonesia saat ini berada di peringkat ke-2 di dunia sebagai negara yang paling sering menjadi sasaran penipuan online. Banyak kasus menggunakan modus resi kurir paket palsu berekstensi <strong>.APK</strong> untuk menguras rekening bank.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left">
          <div className="bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-gray-700 p-5 rounded-2xl shadow-[0_6px_0_rgba(99,102,241,0.03)] transition-all">
            <Globe className="text-sky-500 mb-2 w-5 h-5" />
            <div className="text-xl font-black text-slate-800 dark:text-white">235 Juta</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Pengguna Internet Aktif</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-gray-700 p-5 rounded-2xl shadow-[0_6px_0_rgba(99,102,241,0.03)] transition-all">
            <HelpCircle className="text-amber-500 mb-2 w-5 h-5" />
            <div className="text-xl font-black text-slate-800 dark:text-white">Rp 476 Miliar</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Kerugian Akibat Penipuan</div>
          </div>

          <div className="bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-gray-700 p-5 rounded-2xl shadow-[0_6px_0_rgba(99,102,241,0.03)] transition-all">
            <ShieldCheck className="text-emerald-500 mb-2 w-5 h-5" />
            <div className="text-xl font-black text-slate-800 dark:text-white">15 Kosakata</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Materi Drill Penyelamat</div>
          </div>
        </div>

        {/* Play Button */}
        <button
          onClick={() => setMode('login')}
          className="group bg-indigo-600 hover:bg-indigo-500 active:translate-y-1 active:border-b-0 text-white px-10 py-5 border-b-4 border-indigo-800 rounded-2xl font-black text-lg transition-all shadow-md flex items-center gap-2 mx-auto"
        >
          Mulai Petualangan <ArrowRight className="group-hover:translate-x-2 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}