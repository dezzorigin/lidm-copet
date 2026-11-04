import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface FeedbackDrawerProps {
  isOpen: boolean;
  isCorrect: boolean | null;
  explanation: string;
  clues: string[];
  onNext: () => void;
}

export function FeedbackDrawer({ isOpen, isCorrect, explanation, clues, onNext }: FeedbackDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 w-full z-50 bg-white border-t-2 border-indigo-100 rounded-t-4xl shadow-[0_-15px_30px_rgba(99,102,241,0.06)]"
        >
          <div className="max-w-4xl mx-auto p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-start select-none">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-8 h-8 text-emerald-500 fill-emerald-100" />
                    <h3 className="text-2xl font-black text-emerald-600">Jawaban Benar! 🎉</h3>
                  </>
                ) : (
                  <>
                    <XCircle className="w-8 h-8 text-rose-500 fill-rose-100" />
                    <h3 className="text-2xl font-black text-rose-600">Kurang Tepat ⚠️</h3>
                  </>
                )}
              </div>
              <p className="text-slate-700 text-sm md:text-base font-semibold leading-relaxed mb-4">{explanation}</p>
              
              {clues && clues.length > 0 && (
                <div className="mb-6 md:mb-0">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">Identifikasi Kunci</h4>
                  <div className="flex flex-wrap gap-2">
                    {clues.map((clue, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 text-xs rounded-full font-bold">
                        {clue}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-end justify-center md:justify-end md:ml-auto shrink-0 w-full md:w-auto">
              <button 
                onClick={onNext}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 border-b-4 border-indigo-800 rounded-2xl font-bold transition-all shadow-md active:translate-y-1 active:border-b-0"
              >
                Lanjut Skenario <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
