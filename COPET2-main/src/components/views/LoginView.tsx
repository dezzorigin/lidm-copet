import { useState } from 'react';
import { useGameEngine } from '../../hooks/useGameEngine';
import { KeyRound } from 'lucide-react';

export function LoginView() {
  const { loginAs } = useGameEngine();
  const [agentName, setAgentName] = useState('');

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-2 md:p-6 relative select-none">
      
      <div className="w-full max-w-2xl text-center z-10">
        <div className="inline-block bg-indigo-100 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs px-4 py-2 rounded-full mb-6 font-bold tracking-wide shadow-sm">
          🇮🇩 LIDM 2026 • Edukasi Siber Interaktif
        </div>

        <div className="flex items-center justify-center gap-3 mb-2">
          <h1 className="text-5xl md:text-7xl font-black text-slate-800 dark:text-white tracking-tight">
            DETEKTIF <span className="text-indigo-600 dark:text-indigo-400">COPET</span> 🛡️
          </h1>
        </div>
        
        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium mb-12">
          Asah radar siber detektifmu dan lawan berbagai modus penipuan online!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl mx-auto">
          
          {/* USER CARD (KASUAL) */}
          <div className="bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-gray-700 p-6 rounded-3xl shadow-[0_8px_0_rgba(99,102,241,0.04)] flex flex-col justify-between transition-all duration-300">
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="text-4xl">👨‍✈️</div>
              <div className="text-center">
                <span className="block font-black text-lg text-slate-800 dark:text-white">MULAI PETUALANGAN</span>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Mulai Latihan Deteksi Penipuan</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Nama Kece Kamu..." 
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-gray-900 border-2 border-indigo-50 dark:border-gray-700 text-slate-800 dark:text-white px-10 py-3 rounded-2xl text-sm font-semibold focus:outline-none focus:border-indigo-400 transition-colors placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={() => loginAs('user', agentName)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 active:translate-y-1 active:border-b-0 text-white py-3 border-b-4 border-indigo-800 rounded-2xl font-bold transition-all shadow-sm text-sm"
              >
                MASUK SEBAGAI DETEKTIF
              </button>
            </div>
          </div>

          {/* ADMIN CARD (GURU / EVALUATOR) */}
          <div className="bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-gray-700 p-6 rounded-3xl shadow-[0_8px_0_rgba(99,102,241,0.04)] flex flex-col justify-between transition-all duration-300">
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="text-4xl">👩‍🏫</div>
              <div className="text-center">
                <span className="block font-black text-lg text-slate-800 dark:text-white">MENU EVALUATOR</span>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Akses Papan Nilai Siswa</span>
              </div>
            </div>

            <div className="flex flex-col justify-end h-full mt-4 md:mt-0">
              <button
                onClick={() => loginAs('admin')}
                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600/80 text-slate-700 dark:text-slate-200 py-3 rounded-2xl font-bold transition-all text-sm active:translate-y-0.5 border border-slate-300/40 dark:border-gray-600"
              >
                MASUK SEBAGAI GURU
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}