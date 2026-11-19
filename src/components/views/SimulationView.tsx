import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { simulationBranch, type SimulationChoice } from '../../data/simulationData';
import { useGameEngine } from '../../hooks/useGameEngine';
import { WhatsAppMockup, type Message } from '../ui/WhatsAppMockup';
import { FeedbackDrawer } from '../ui/FeedbackDrawer';
import { Trophy, Globe2, ArrowLeft, MessagesSquare } from 'lucide-react';

function ActionCard({ choice, onClick, disabled }: { choice: SimulationChoice, onClick: () => void, disabled: boolean }) {
  const [isTranslated, setIsTranslated] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleTranslateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTranslated(prev => !prev);
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 500);
  };

  return (
    <motion.div 
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className="relative group w-full"
    >
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full text-left p-4 pr-12 rounded-sm border-2 border-tinta/40 bg-kertas hover:border-tinta transition-all text-xs md:text-sm font-bold disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-laci active:scale-97 dark:border-kertas-gelap/40 dark:bg-arsip dark:hover:border-kertas-gelap"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isTranslated ? 'id' : 'en'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {isTranslated && choice.idText ? choice.idText : choice.text}
          </motion.div>
        </AnimatePresence>
      </button>

      {choice.idText && (
        <button
          onClick={handleTranslateClick}
          disabled={disabled}
          className={`absolute right-3 top-1/2 -translate-y-1/2 min-h-11 min-w-11 flex items-center justify-center rounded-sm transition-all z-10 ${isTranslated ? 'text-kertas bg-laci' : 'text-daktil hover:text-laci hover:bg-kertas-2 dark:text-kertas-gelap/60'} disabled:opacity-50`}
          title="Translate"
        >
          <motion.div
            animate={{ rotate: isSpinning ? 360 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Globe2 className="w-4 h-4" />
          </motion.div>
        </button>
      )}
    </motion.div>
  );
}

export function SimulationView() {
  const { addPoints, unlockAdvancedLevel, setMode, triggerSimComplete, recordAnswer } = useGameEngine();
  const [currentNodeId, setCurrentNodeId] = useState<string | null>('start');
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<SimulationChoice | null>(null);
  
  // Riwayat chat diisi dari handler pilihan, bukan dari effect:
  // pesan penipu untuk simpul berikutnya ditambahkan saat simpul itu
  // dibuka (lihat appendNodeMessage). Pesan simpul awal diisi di sini.
  const [chatHistory, setChatHistory] = useState<Message[]>(() => {
    const start = simulationBranch['start'];
    return [{ id: 'scammer-start', text: start.message, idText: start.idMessage, isUser: false }];
  });
  const [isTyping, setIsTyping] = useState(false);

  const appendNodeMessage = (nodeId: string) => {
    const node = simulationBranch[nodeId];
    if (!node) return;
    setChatHistory(prev => [...prev, { id: `scammer-${node.id}`, text: node.message, idText: node.idMessage, isUser: false }]);
  };

  // Completed State
  if (!currentNodeId) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-16 text-center">
        <Trophy className="mb-6 h-20 w-20 text-laci dark:text-kertas-gelap" aria-hidden="true" />
        <h2 className="mb-2 font-display text-3xl font-black">Simulation complete</h2>
        <p className="mb-8 text-xs font-medium leading-relaxed text-tinta/80 md:text-sm dark:text-kertas-gelap/80">Anda berhasil menyelesaikan skenario simulasi investigasi kurir ini dengan sukses.</p>
        <button
          type="button"
          onClick={() => setMode('home')}
          className="min-h-14 w-full rounded-sm border-2 border-tinta bg-laci px-6 py-3.5 font-mono text-sm font-bold text-kertas transition-colors hover:bg-laci-tua focus-visible:outline-2 focus-visible:outline-laci active:scale-97"
        >
          KEMBALI KE DASHBOARD
        </button>
      </div>
    );
  }

  const node = simulationBranch[currentNodeId];

  const handleChoiceClick = (choice: SimulationChoice) => {
    setSelectedChoice(choice);
    setChatHistory(prev => [...prev, { id: `user-${Date.now()}`, text: choice.text, idText: choice.idText, isUser: true }]);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      if (choice.result === 'neutral') {
        if (choice.nextNodeId) {
          setCurrentNodeId(choice.nextNodeId);
          appendNodeMessage(choice.nextNodeId);
        } else {
          setCurrentNodeId(null);
        }
      } else {
        setFeedbackOpen(true);
        if (choice.result === 'safe') {
          addPoints(150);
          recordAnswer(true);
          unlockAdvancedLevel();
          triggerSimComplete();
        } else if (choice.result === 'scam') {
          recordAnswer(false);
        }
      }
    }, 1500);
  };

  const handleNext = () => {
    setFeedbackOpen(false);
    setTimeout(() => {
      const next = selectedChoice?.nextNodeId || null;
      setCurrentNodeId(next);
      if (next) appendNodeMessage(next);
      setSelectedChoice(null);
    }, 300);
  };

  return (
    <div className="relative pb-24 select-none">
      {/* HEADER WITH EXIT BUTTON */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="mb-1 flex items-center gap-2 font-display text-2xl font-black">
            <MessagesSquare className="h-6 w-6 text-laci dark:text-kertas-gelap" aria-hidden="true" />
            Live Simulation
          </h2>
          <p className="text-xs font-medium text-tinta/80 md:text-sm dark:text-kertas-gelap/80">Navigasikan percakapan investigasi dengan waspada.</p>
        </div>
        <button
          type="button"
          onClick={() => setMode('home')}
          className="flex min-h-11 items-center gap-2 rounded-sm border-2 border-tinta/40 bg-kertas px-4 py-2.5 font-mono text-xs font-bold transition-colors hover:border-tinta focus-visible:outline-2 focus-visible:outline-laci dark:border-kertas-gelap/40 dark:bg-arsip dark:text-kertas-gelap"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>ABORT MISSION</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
        {/* LEFT COLUMN: WHATSAPP PHONE MOCKUP */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <WhatsAppMockup senderName={node.sender} messages={chatHistory} isTyping={isTyping} />
        </div>
        
        {/* RIGHT COLUMN: ACTION SELECTION CARD */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4 mt-4 lg:mt-0 px-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={node.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4"
            >
              <h3 className="mb-1 font-mono text-sm font-bold uppercase tracking-wide text-daktil dark:text-kertas-gelap/60">Pilihan aksi respon:</h3>
              {node.choices.map((choice, idx) => (
                <ActionCard 
                  key={idx} 
                  choice={choice} 
                  onClick={() => handleChoiceClick(choice)} 
                  disabled={feedbackOpen || isTyping} 
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <FeedbackDrawer
        isOpen={feedbackOpen}
        isCorrect={selectedChoice?.result === 'safe'}
        explanation={selectedChoice?.feedback || ''}
        clues={[]}
        onNext={handleNext}
      />
    </div>
  );
}
