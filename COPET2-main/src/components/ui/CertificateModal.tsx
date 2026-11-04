import { Trophy, Download, X, Award } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  score: number;
}

export function CertificateModal({ isOpen, onClose, playerName, score }: CertificateModalProps) {
  if (!isOpen) return null;

  const handleDownload = () => {
    window.print(); // Triggers browser print PDF dialog
  };

  // Replace default Agent name with a more casual fallback if empty
  const displayName = playerName === "Agent Anonim" || playerName.trim() === "" 
    ? "Detektif Siber Hebat" 
    : playerName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 dark:bg-slate-950/90 backdrop-blur-md print:p-0 print:bg-white">
      
      {/* MAIN CONTAINER */}
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-gray-700 rounded-3xl p-6 shadow-2xl relative print:border-0 print:shadow-none print:rounded-none print:bg-white print:max-w-none print:w-full print:h-full transition-colors duration-300">
        
        {/* ACTION BUTTONS (Hidden when printed) */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
            <Award className="w-4 h-4" /> Piagam_Penghargaan_Engine
          </h3>
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:translate-y-0.5 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
            >
              <Download className="w-4 h-4" /> CETAK PIAGAM
            </button>
            <button
              onClick={onClose}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-500 dark:text-slate-300 rounded-xl transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CERTIFICATE SHEET (A4 LANDSCAPE ASPECT 1.414:1)                */}
        {/* ============================================================== */}
        <div className="w-full aspect-[1.414/1] bg-amber-50/20 dark:bg-amber-950/10 border-4 border-double border-amber-400/60 dark:border-amber-600/40 rounded-2xl p-6 md:p-12 flex flex-col justify-between items-center relative overflow-hidden print:border-slate-800 print:text-slate-900 print:bg-white print:m-0 print:rounded-none transition-colors duration-300">
          
          {/* Subtle Background Ribbon/Decorations */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-amber-400 to-amber-600 opacity-20 transform rotate-45 translate-x-12 -translate-y-12 print:hidden" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-linear-to-br from-indigo-400 to-indigo-600 opacity-20 transform rotate-45 -translate-x-12 translate-y-12 print:hidden" />

          {/* LARGE GOLDEN TROPHY ICON */}
          <div className="flex flex-col items-center text-center">
            <Trophy className="w-16 h-16 md:w-20 md:h-20 text-amber-500 fill-amber-300 drop-shadow-[0_4px_10px_rgba(245,158,11,0.25)] mb-3" />
            <h1 className="text-3xl md:text-5xl font-black font-sans tracking-wide text-slate-800 dark:text-white print:text-slate-900">
              PIAGAM PENGHARGAAN
            </h1>
            <p className="text-[9px] md:text-xs font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
              No Sertifikat: CPT-LIDM-{Date.now().toString().slice(-6)}
            </p>
          </div>

          {/* STUDENT NAME AND DESCRIPTION */}
          <div className="text-center my-4 space-y-4">
            <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider print:text-slate-600">
              Diberikan Kepada Siswa Berprestasi:
            </p>
            <h2 className="text-2xl md:text-4xl font-black font-sans text-amber-600 dark:text-amber-400 border-b-2 border-amber-300/40 pb-2 inline-block px-12 tracking-wide print:text-slate-900 print:border-slate-800">
              {displayName}
            </h2>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-sans font-medium max-w-xl mx-auto leading-relaxed print:text-slate-700">
              Telah berhasil menyelesaikan rangkaian simulasi siber <span className="font-bold text-slate-800 dark:text-white print:text-slate-900">Detektif COPET v2.0</span>, mencakup analisis petunjuk bahasa dari manipulasi penipu online, serta lulus ujian ketangkasan siber dalam evaluasi:
            </p>
            <div className="inline-block bg-amber-100 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 px-6 py-2.5 rounded-2xl font-sans text-xs md:text-sm text-amber-700 dark:text-amber-300 font-bold print:border-slate-800 print:text-slate-900 shadow-sm">
              🌟 SKOR EVALUASI: {score} POIN DETEKTIF
            </div>
          </div>

          {/* FOOTER SIGNATURE */}
          <div className="w-full flex justify-between items-end border-t border-slate-100 dark:border-gray-700/50 pt-4 print:border-slate-300">
            <div className="text-left font-sans text-[9px] md:text-[10px] text-slate-400 dark:text-slate-500">
              <p>Platform: DETEKTIF COPET</p>
              <p>Metode: Gamified Active Learning</p>
            </div>
            <div className="text-center font-sans">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-gray-700 pb-1 px-6 mb-1 print:text-slate-900 print:border-slate-800">
                Dewan Penguji COPET
              </div>
              <div className="text-[8px] md:text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold">
                Sistem Evaluator Otomatis
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}