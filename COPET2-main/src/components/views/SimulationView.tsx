import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { simulationBranch, type SimulationChoice } from '../../data/simulationData';
import { useGameEngine } from '../../hooks/useGameEngine';
import { WhatsAppMockup, type Message } from '../ui/WhatsAppMockup';
import { FeedbackDrawer } from '../ui/FeedbackDrawer';
import { Trophy, Globe2, ArrowLeft } from 'lucide-react';

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
        className="w-full text-left p-4 pr-12 rounded-2xl border-2 border-indigo-100 bg-white hover:border-indigo-300 transition-all text-xs md:text-sm text-slate-800 font-bold disabled:opacity-50 relative overflow-hidden shadow-[0_4px_0_rgba(99,102,241,0.06)] hover:shadow-[0_6px_0_rgba(99,102,241,0.1)] active:translate-y-0.5"
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
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all z-10 ${isTranslated ? 'text-indigo-600 bg-indigo-100' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'} disabled:opacity-50`}
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
  const { addPoints, incrementMastered, setMode, triggerSimComplete } = useGameEngine();
  const [currentNodeId, setCurrentNodeId] = useState<string | null>('start');
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<SimulationChoice | null>(null);
  
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (currentNodeId && simulationBranch[currentNodeId]) {
      const node = simulationBranch[currentNodeId];
      setChatHistory(prev => [...prev, { id: `scammer-${node.id}`, text: node.message, idText: node.idMessage, isUser: false }]);
    }
  }, [currentNodeId]);

  // Completed State
  if (!currentNodeId) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in duration-700 max-w-md mx-auto">
        <Trophy className="w-20 h-20 text-emerald-500 mb-6 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
        <h2 className="text-3xl font-black text-slate-800 mb-2 font-mono">SIMULATION COMPLETE</h2>
        <p className="text-slate-500 mb-8 text-xs md:text-sm font-medium">Anda berhasil menyelesaikan skenario simulasi investigasi kurir ini dengan sukses.</p>
        <button 
          onClick={() => setMode('home')} 
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 border-b-4 border-indigo-800 rounded-2xl font-bold transition-all shadow-md active:translate-y-1 active:border-b-0"
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
        setCurrentNodeId(choice.nextNodeId);
      } else {
        setFeedbackOpen(true);
        if (choice.result === 'safe') {
          addPoints(150);
          incrementMastered();
          triggerSimComplete();
        }
      }
    }, 1500);
  };

  const handleNext = () => {
    setFeedbackOpen(false);
    setTimeout(() => {
      setCurrentNodeId(selectedChoice?.nextNodeId || null);
      setSelectedChoice(null);
    }, 300);
  };

  return (
    <div className="relative pb-24 select-none">
      {/* HEADER WITH EXIT BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 mb-1 flex items-center gap-2 font-mono">
            💬 Live Simulation
          </h2>
          <p className="text-slate-500 text-xs md:text-sm font-medium">Navigasikan percakapan investigasi dengan waspada.</p>
        </div>
        <button
          onClick={() => setMode('home')}
          className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-indigo-600 border-2 border-indigo-100 rounded-2xl shadow-sm transition-all text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-500" />
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
              <h3 className="text-sm font-mono font-bold text-slate-400 mb-1 tracking-wide uppercase">Pilihan Aksi Respon:</h3>
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
