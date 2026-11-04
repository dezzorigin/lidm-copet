import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { vocabulary } from '../../data/vocabulary';
import { useGameEngine } from '../../hooks/useGameEngine';
import { ChevronRight, ChevronLeft, ArrowLeft, Volume2, Globe2 } from 'lucide-react';

type CategoryFilter = 'All' | 'Scam Tactic' | 'Language Clue' | 'Security Concept';

export function VocabView() {
  const { setMode } = useGameEngine();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false); // Bilingual toggle state

  // Stop TTS if user leaves or changes cards
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const filteredVocabulary = selectedCategory === 'All'
    ? vocabulary
    : vocabulary.filter(item => item.category === selectedCategory);

  const term = filteredVocabulary[currentIndex] || filteredVocabulary[0];
  const isFirstItem = currentIndex === 0;
  const isLastItem = currentIndex === filteredVocabulary.length - 1;

  const handleNext = () => {
    stopSpeech();
    if (!isLastItem) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
    } else {
      setMode('home');
    }
  };

  const handlePrev = () => {
    stopSpeech();
    if (!isFirstItem) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 200);
    }
  };

  const handleCategoryChange = (category: CategoryFilter) => {
    stopSpeech();
    setSelectedCategory(category);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleBackToMenu = () => {
    stopSpeech();
    setMode('home');
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const speakVocab = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from flipping!
    if (!('speechSynthesis' in window)) {
      alert("Browser Anda tidak mendukung Text-to-Speech.");
      return;
    }

    if (isSpeaking) {
      stopSpeech();
      return;
    }

    setIsSpeaking(true);

    // Speak English Example in en-US voice
    const englishUtterance = new SpeechSynthesisUtterance(term.englishExample);
    englishUtterance.lang = 'en-US';
    englishUtterance.rate = 0.9;

    englishUtterance.onend = () => {
      // 0.5 seconds delay before speaking Indonesian translation
      setTimeout(() => {
        const indonesianUtterance = new SpeechSynthesisUtterance(term.indonesianMeaning);
        indonesianUtterance.lang = 'id-ID';
        indonesianUtterance.rate = 1.0;
        indonesianUtterance.onend = () => setIsSpeaking(false);
        indonesianUtterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(indonesianUtterance);
      }, 500);
    };

    englishUtterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(englishUtterance);
  };

  const toggleTranslate = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from flipping!
    setShowTranslation(prev => !prev);
  };

  // Helper for category-specific colors matching Kahoot/Duolingo vibrancy
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Scam Tactic':
        return {
          cardBg: 'from-rose-400 to-pink-500 text-white border-rose-300',
          shadowColor: 'rgba(244,63,94,0.3)',
          badgeBg: 'bg-rose-600/30 border-rose-300/30'
        };
      case 'Security Concept':
        return {
          cardBg: 'from-emerald-400 to-teal-500 text-white border-emerald-300',
          shadowColor: 'rgba(16,185,129,0.3)',
          badgeBg: 'bg-emerald-600/30 border-emerald-300/30'
        };
      case 'Language Clue':
        return {
          cardBg: 'from-sky-400 to-indigo-500 text-white border-sky-300',
          shadowColor: 'rgba(14,165,233,0.3)',
          badgeBg: 'bg-sky-600/30 border-sky-300/30'
        };
      default:
        return {
          cardBg: 'from-purple-400 to-indigo-500 text-white border-purple-300',
          shadowColor: 'rgba(99,102,241,0.3)',
          badgeBg: 'bg-purple-600/30 border-purple-300/30'
        };
    }
  };

  const styles = term ? getCategoryStyles(term.category) : getCategoryStyles('All');

  // Highlights the search/scam cues inside the example text
  const highlightCue = (text: string, cue: string) => {
    if (!text) return "";
    if (!cue) return text;

    const parts = text.split(new RegExp(`(${cue})`, 'gi'));
    return parts.map((part: string, i: number) => 
      part.toLowerCase() === cue.toLowerCase() ? (
        <span key={i} className="text-yellow-300 font-extrabold bg-black/20 px-2 py-0.5 rounded border border-yellow-300/40 animate-pulse">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="min-h-[80vh] p-4 md:p-12 relative flex flex-col items-center select-none overflow-x-hidden transition-colors duration-300">
      
      {/* 1. HEADER & TOMBOL BACK */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <button
          onClick={handleBackToMenu}
          className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700/60 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-100 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all text-xs md:text-sm font-bold active:translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-indigo-500" />
          <span>MENU UTAMA</span>
        </button>

        <div className="bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-gray-700 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold text-indigo-600 dark:text-indigo-450 shadow-sm transition-all duration-300">
          {filteredVocabulary.length > 0 ? currentIndex + 1 : 0} / {filteredVocabulary.length}
        </div>
      </div>

      <div className="flex flex-col items-center max-w-2xl w-full mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-1 flex justify-center items-center gap-2 font-mono">
            📖 Vocab Database
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium">Pelajari istilah taktik penipuan, cara deteksi resi palsu, dan konsep keamanan siber.</p>
        </div>

        {/* 2. CATEGORY TABS FILTER */}
        <div className="w-full max-w-2xl mb-8 flex flex-wrap gap-2 justify-center bg-white/70 dark:bg-gray-800/80 p-2 rounded-2xl border-2 border-indigo-50 dark:border-gray-700 shadow-sm backdrop-blur-md transition-all duration-300">
          {(['All', 'Scam Tactic', 'Language Clue', 'Security Concept'] as const).map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2.5 rounded-xl text-[10px] md:text-xs font-bold tracking-wide transition-all ${
                  isActive
                    ? cat === 'Scam Tactic'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : cat === 'Language Clue'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : cat === 'Security Concept'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-transparent text-slate-500 dark:text-slate-400 border border-transparent hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-700/60'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* 3. AREA KARTU KOSAKATA */}
        {filteredVocabulary.length > 0 ? (
          <div className="w-full mb-10" style={{ perspective: 1200 }}>
            <motion.div
              key={`${selectedCategory}-${currentIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-[450px]"
            >
              <motion.div
                className="w-full h-full relative cursor-pointer"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 220, damping: 22 }}
                onClick={() => setIsFlipped(!isFlipped)}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* SISI DEPAN (FRONT FACE) */}
                <div 
                  className={`absolute inset-0 bg-linear-to-br ${styles.cardBg} border-2 rounded-4xl p-6 md:p-8 flex flex-col items-center justify-between overflow-hidden shadow-2xl transition-all`}
                  style={{ 
                    backfaceVisibility: "hidden",
                    boxShadow: `0 12px 0 ${styles.shadowColor}`
                  }}
                >
                  {/* Floating Action Buttons Left (Speaker) & Right (Translate) */}
                  <div className="w-full flex justify-between items-center z-20">
                    <button
                      onClick={speakVocab}
                      className="p-3 bg-white/20 hover:bg-white/30 border border-white/30 rounded-2xl text-white transition-all active:scale-90"
                      title="Dengar Pengucapan"
                    >
                      <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce' : ''}`} />
                    </button>

                    <button
                      onClick={toggleTranslate}
                      className={`p-3 border rounded-2xl transition-all active:scale-90 ${
                        showTranslation 
                          ? 'bg-yellow-400 text-slate-900 border-yellow-300 shadow-md' 
                          : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                      }`}
                      title="Terjemahkan"
                    >
                      <Globe2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Category Pill */}
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border ${styles.badgeBg}`}>
                    {term.category.toUpperCase()}
                  </span>
                  
                  {/* Word & Definition Crossfade */}
                  <div className="text-center w-full flex-1 flex flex-col justify-center items-center px-4">
                    <h3 className="text-3xl md:text-5xl font-black mb-4 tracking-wide font-sans">
                      {term.word}
                    </h3>
                    
                    <div className="h-20 flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={showTranslation ? 'id' : 'en'}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="text-white/90 text-sm md:text-base font-medium max-w-sm leading-relaxed"
                        >
                          {showTranslation ? term.indonesianMeaning : term.definition}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  {/* Bottom Guide */}
                  <div className="flex items-center gap-1.5 text-white/80 bg-white/10 px-4 py-2 rounded-full font-bold text-xs select-none border border-white/20">
                    <span>💡 Tap to Flip Card</span>
                  </div>
                </div>

                {/* SISI BELAKANG (BACK FACE) */}
                <div 
                  className={`absolute inset-0 bg-linear-to-br ${styles.cardBg} border-2 rounded-4xl p-5 md:p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-all`} 
                  style={{ 
                    backfaceVisibility: "hidden", 
                    transform: "rotateY(180deg)",
                    boxShadow: `0 12px 0 ${styles.shadowColor}`
                  }}
                >
                  {/* Floating Action Buttons Left (Speaker) & Right (Translate) */}
                  <div className="w-full flex justify-between items-center z-20">
                    <button
                      onClick={speakVocab}
                      className="p-3 bg-white/20 hover:bg-white/30 border border-white/30 rounded-2xl text-white transition-all active:scale-90"
                      title="Dengar Pengucapan"
                    >
                      <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce' : ''}`} />
                    </button>

                    <button
                      onClick={toggleTranslate}
                      className={`p-3 border rounded-2xl transition-all active:scale-90 ${
                        showTranslation 
                          ? 'bg-yellow-400 text-slate-900 border-yellow-300 shadow-md' 
                          : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                      }`}
                      title="Terjemahkan"
                    >
                      <Globe2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Core Meanings / Examples Crossfade */}
                  <div className="flex-1 flex flex-col justify-center gap-4 w-full mt-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={showTranslation ? 'id-content' : 'en-content'}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4 w-full"
                      >
                        {showTranslation ? (
                          // INDONESIAN CONTENT
                          <>
                            <div className="bg-black/15 p-4 rounded-2xl border border-white/20">
                              <span className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-yellow-300">
                                💬 Kasus (Bahasa Indonesia):
                              </span>
                              <p className="text-xs md:text-sm text-white/95 leading-relaxed font-medium italic">
                                "{term.indonesianExample}"
                              </p>
                            </div>

                            <div className="bg-black/10 p-4 rounded-2xl border border-white/10">
                              <span className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-white/80">
                                🎯 Makna Istilah:
                              </span>
                              <p className="text-xs md:text-sm text-white/90 leading-relaxed font-medium">
                                {term.indonesianMeaning}
                              </p>
                            </div>
                          </>
                        ) : (
                          // ENGLISH CONTENT
                          <>
                            <div className="bg-black/15 p-4 rounded-2xl border border-white/20">
                              <span className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-yellow-300">
                                ⚠️ Scam Drill (English Context):
                              </span>
                              <p className="text-xs md:text-sm text-white/95 leading-relaxed font-medium italic">
                                "{highlightCue(term.englishExample, term.languageCue)}"
                              </p>
                            </div>

                            <div className="bg-black/10 p-4 rounded-2xl border border-white/10">
                              <span className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-white/80">
                                📖 English Definition:
                              </span>
                              <p className="text-xs md:text-sm text-white/90 leading-relaxed font-medium">
                                {term.definition}
                              </p>
                            </div>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Bottom Flip Guide */}
                  <div className="text-center w-full mt-2">
                    <span className="text-[11px] font-bold text-white/70 bg-white/10 px-3 py-1 rounded-full">💡 Tap to Flip Back</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        ) : (
          <div className="w-full h-[250px] bg-white dark:bg-gray-800 border-2 border-indigo-50 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 font-mono text-sm shadow-sm transition-all duration-300">
            Tidak ada kosakata dalam kategori ini.
          </div>
        )}

        {/* 4. KONTROL NAVIGASI */}
        {filteredVocabulary.length > 0 && (
          <div className="flex gap-4 w-full justify-center mt-2">
            <button
              onClick={handlePrev}
              disabled={isFirstItem}
              className={`px-6 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all flex items-center gap-1.5 ${
                isFirstItem 
                  ? 'bg-slate-200 dark:bg-gray-700/50 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300/40 dark:border-gray-750' 
                  : 'bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 text-indigo-600 dark:text-indigo-450 border-2 border-indigo-100 dark:border-gray-700 shadow-sm active:translate-y-0.5'
              }`}
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-indigo-500" /> Prev
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all shadow-md hover:shadow-lg border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1"
            >
              {isLastItem ? 'Selesai (Menu)' : 'Next Term'} <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}