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
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 z-50 w-full rounded-t-sm border-t-2 border-tinta bg-kertas-2 dark:border-kertas-gelap/60 dark:bg-arsip-2"
          role="dialog"
          aria-live="polite"
          aria-label={isCorrect ? 'Jawaban benar' : 'Jawaban kurang tepat'}
        >
          <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6 md:flex-row md:items-start md:p-8">
            <div className="flex-1">
              <div className="mb-4 flex items-center gap-3">
                {isCorrect ? (
                  <>
                    <CheckCircle className="h-8 w-8 text-laci dark:text-kertas-gelap" aria-hidden="true" />
                    <h3 className="font-display text-2xl font-black text-laci dark:text-kertas-gelap">Jawaban benar!</h3>
                  </>
                ) : (
                  <>
                    <XCircle className="h-8 w-8 text-cap" aria-hidden="true" />
                    <h3 className="font-display text-2xl font-black text-cap">Kurang tepat</h3>
                  </>
                )}
              </div>
              <p className="mb-4 text-sm font-semibold leading-relaxed md:text-base">{explanation}</p>

              {clues && clues.length > 0 && (
                <div className="mb-6 md:mb-0">
                  <h4 className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-daktil dark:text-kertas-gelap/60">Identifikasi kunci</h4>
                  <div className="flex flex-wrap gap-2">
                    {clues.map((clue, idx) => (
                      <span key={idx} className="rounded-sm border border-laci/50 bg-laci/10 px-3 py-1 font-mono text-xs font-bold text-laci dark:text-kertas-gelap">
                        {clue}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex w-full shrink-0 items-end justify-center md:w-auto md:justify-end md:ml-auto">
              <button
                type="button"
                onClick={onNext}
                className="flex min-h-14 w-full items-center justify-center gap-2 rounded-sm border-2 border-tinta bg-laci px-8 py-3.5 font-mono text-sm font-bold text-kertas transition-colors hover:bg-laci-tua focus-visible:outline-2 focus-visible:outline-laci active:scale-97 md:w-auto"
              >
                Lanjut skenario <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
