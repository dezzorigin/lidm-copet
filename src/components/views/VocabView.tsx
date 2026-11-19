import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { vocabulary } from '../../data/vocabulary';
import { useGameEngine } from '../../hooks/useGameEngine';
import { ChevronRight, ChevronLeft, ArrowLeft, Volume2, Globe2, BookOpen, Check } from 'lucide-react';

type CategoryFilter = 'All' | 'Scam Tactic' | 'Language Clue' | 'Security Concept';

/* Vocab Drill — kartu flash bilingual 15 istilah. Dulu kartu memakai
   gradient warna-warni per kategori (larangan P0) dan penghitung
   "dikuasai" di navbar tidak pernah bertambah dari modul ini.
   Sekarang kartu memakai permukaan kertas ber-border tinta dengan aksen
   garis atas per kategori, dan ada tombol "Tandai dikuasai" yang
   benar-benar mengisi penghitung tersebut. */
export function VocabView() {
  const { setMode, markMastered, masteredTerms } = useGameEngine();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

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
  const isMastered = term ? masteredTerms.includes(term.id) : false;

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
    e.stopPropagation();
    if (!('speechSynthesis' in window)) {
      alert('Browser Anda tidak mendukung Text-to-Speech.');
      return;
    }

    if (isSpeaking) {
      stopSpeech();
      return;
    }

    setIsSpeaking(true);

    const englishUtterance = new SpeechSynthesisUtterance(term.englishExample);
    englishUtterance.lang = 'en-US';
    englishUtterance.rate = 0.9;

    englishUtterance.onend = () => {
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
    e.stopPropagation();
    setShowTranslation(prev => !prev);
  };

  // Aksen kategori: garis atas + chip, bukan isi gradient.
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Scam Tactic':
        return { topBorder: 'border-t-cap', chip: 'border-cap/50 bg-cap/10 text-cap', tabActive: 'bg-cap text-kertas border-cap' };
      case 'Security Concept':
        return { topBorder: 'border-t-laci', chip: 'border-laci/50 bg-laci/10 text-laci dark:text-kertas-gelap', tabActive: 'bg-laci text-kertas border-laci' };
      case 'Language Clue':
        return { topBorder: 'border-t-bukti', chip: 'border-bukti/50 bg-bukti/10 text-bukti', tabActive: 'bg-bukti text-arsip border-bukti' };
      default:
        return { topBorder: 'border-t-tinta', chip: 'border-tinta/40 text-tinta dark:text-kertas-gelap', tabActive: 'bg-tinta text-kertas border-tinta dark:bg-kertas-gelap dark:text-arsip' };
    }
  };

  const styles = term ? getCategoryStyles(term.category) : getCategoryStyles('All');

  // Highlights the search/scam cues inside the example text
  const highlightCue = (text: string, cue: string) => {
    if (!text) return '';
    if (!cue) return text;

    const parts = text.split(new RegExp(`(${cue})`, 'gi'));
    return parts.map((part: string, i: number) =>
      part.toLowerCase() === cue.toLowerCase() ? (
        <mark key={i} className="rounded-sm border border-bukti bg-bukti/25 px-1 py-0.5 font-bold text-tinta dark:text-kertas-gelap">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center p-4 md:p-8">
      <div className="mb-6 flex w-full max-w-4xl items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleBackToMenu}
          className="flex min-h-11 items-center gap-2 rounded-sm border-2 border-tinta/40 bg-kertas px-4 py-2.5 font-mono text-xs font-bold transition-colors hover:border-tinta focus-visible:outline-2 focus-visible:outline-laci md:text-sm dark:border-kertas-gelap/40 dark:bg-arsip dark:text-kertas-gelap"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" />
          <span>MENU UTAMA</span>
        </button>

        <p className="rounded-sm border-2 border-tinta/25 bg-kertas px-4 py-2.5 font-mono text-xs font-bold tabular-nums md:text-sm dark:border-kertas-gelap/25 dark:bg-arsip">
          {filteredVocabulary.length > 0 ? currentIndex + 1 : 0} / {filteredVocabulary.length}
          <span className="ml-2 hidden text-daktil sm:inline dark:text-kertas-gelap/60">
            · {masteredTerms.length}/{vocabulary.length} dikuasai
          </span>
        </p>
      </div>

      <div className="flex w-full max-w-2xl flex-col items-center">
        <div className="mb-6 text-center">
          <h2 className="flex items-center justify-center gap-2 font-display text-2xl font-black">
            <BookOpen className="h-6 w-6 text-laci dark:text-kertas-gelap" aria-hidden="true" />
            Vocab Database
          </h2>
          <p className="mt-1 text-xs font-medium text-tinta/80 md:text-sm dark:text-kertas-gelap/80">
            Pelajari istilah taktik penipuan, cara deteksi resi palsu, dan konsep keamanan siber.
          </p>
        </div>

        {/* Filter kategori */}
        <div className="mb-8 flex w-full max-w-2xl flex-wrap justify-center gap-2 rounded-sm border-2 border-tinta/25 bg-kertas-2 p-2 dark:border-kertas-gelap/25 dark:bg-arsip-2" role="tablist" aria-label="Filter kategori kosakata">
          {(['All', 'Scam Tactic', 'Language Clue', 'Security Concept'] as const).map((cat) => {
            const isActive = selectedCategory === cat;
            const catStyle = getCategoryStyles(cat);
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleCategoryChange(cat)}
                className={`min-h-11 rounded-sm border-2 px-4 py-2.5 font-mono text-[10px] font-bold tracking-wide transition-all focus-visible:outline-2 focus-visible:outline-laci md:text-xs ${
                  isActive
                    ? catStyle.tabActive
                    : 'border-transparent text-daktil hover:bg-kertas hover:text-tinta dark:text-kertas-gelap/60 dark:hover:bg-arsip dark:hover:text-kertas-gelap'
                }`}
              >
                {cat === 'All' ? 'SEMUA' : cat.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Kartu kosakata */}
        {filteredVocabulary.length > 0 ? (
          <div className="mb-6 w-full" style={{ perspective: 1200 }}>
            <motion.div
              key={`${selectedCategory}-${currentIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="relative h-[450px] w-full"
            >
              <motion.div
                className="relative h-full w-full cursor-pointer"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => setIsFlipped(!isFlipped)}
                style={{ transformStyle: 'preserve-3d' }}
                role="button"
                tabIndex={0}
                aria-label={`Kartu ${term.word} — ketuk untuk membalik`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsFlipped(!isFlipped);
                  }
                }}
              >
                {/* Sisi depan */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-between overflow-hidden rounded-sm border-2 border-tinta border-t-4 ${styles.topBorder} bg-kertas-2 p-6 shadow-[4px_4px_0_#1b1a17] md:p-8 dark:border-kertas-gelap/60 dark:bg-arsip-2 dark:shadow-[4px_4px_0_#efe9dc33]`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="z-20 flex w-full items-center justify-between">
                    <button
                      type="button"
                      onClick={speakVocab}
                      aria-label="Dengar pengucapan contoh kalimat"
                      className="flex h-11 w-11 items-center justify-center rounded-sm border border-tinta/40 text-tinta transition-colors hover:bg-kertas focus-visible:outline-2 focus-visible:outline-laci active:scale-97 dark:border-kertas-gelap/40 dark:text-kertas-gelap"
                    >
                      <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-pulse' : ''}`} aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      onClick={toggleTranslate}
                      aria-label={showTranslation ? 'Tampilkan definisi Inggris' : 'Terjemahkan ke Indonesia'}
                      aria-pressed={showTranslation}
                      className={`flex h-11 w-11 items-center justify-center rounded-sm border transition-colors focus-visible:outline-2 focus-visible:outline-laci active:scale-97 ${
                        showTranslation
                          ? 'border-bukti bg-bukti text-arsip'
                          : 'border-tinta/40 text-tinta hover:bg-kertas dark:border-kertas-gelap/40 dark:text-kertas-gelap'
                      }`}
                    >
                      <Globe2 className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>

                  <span className={`rounded-sm border px-4 py-1.5 font-mono text-[10px] font-bold ${styles.chip}`}>
                    {term.category.toUpperCase()}
                  </span>

                  <div className="flex w-full flex-1 flex-col items-center justify-center px-4 text-center">
                    <h3 className="mb-4 font-display text-3xl font-black tracking-wide md:text-5xl">
                      {term.word}
                    </h3>

                    <div className="flex h-20 items-center justify-center">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={showTranslation ? 'id' : 'en'}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="max-w-sm text-sm font-medium leading-relaxed text-tinta/80 md:text-base dark:text-kertas-gelap/80"
                        >
                          {showTranslation ? term.indonesianMeaning : term.definition}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>

                  <p className="rounded-sm border border-tinta/25 bg-kertas px-4 py-2 font-mono text-xs font-bold text-daktil dark:border-kertas-gelap/25 dark:bg-arsip dark:text-kertas-gelap/60">
                    Ketuk kartu untuk membalik
                  </p>
                </div>

                {/* Sisi belakang */}
                <div
                  className={`absolute inset-0 flex flex-col justify-between overflow-hidden rounded-sm border-2 border-tinta border-t-4 ${styles.topBorder} bg-kertas-2 p-5 shadow-[4px_4px_0_#1b1a17] md:p-8 dark:border-kertas-gelap/60 dark:bg-arsip-2 dark:shadow-[4px_4px_0_#efe9dc33]`}
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <div className="z-20 flex w-full items-center justify-between">
                    <button
                      type="button"
                      onClick={speakVocab}
                      aria-label="Dengar pengucapan contoh kalimat"
                      className="flex h-11 w-11 items-center justify-center rounded-sm border border-tinta/40 text-tinta transition-colors hover:bg-kertas focus-visible:outline-2 focus-visible:outline-laci active:scale-97 dark:border-kertas-gelap/40 dark:text-kertas-gelap"
                    >
                      <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-pulse' : ''}`} aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      onClick={toggleTranslate}
                      aria-label={showTranslation ? 'Tampilkan contoh Inggris' : 'Terjemahkan ke Indonesia'}
                      aria-pressed={showTranslation}
                      className={`flex h-11 w-11 items-center justify-center rounded-sm border transition-colors focus-visible:outline-2 focus-visible:outline-laci active:scale-97 ${
                        showTranslation
                          ? 'border-bukti bg-bukti text-arsip'
                          : 'border-tinta/40 text-tinta hover:bg-kertas dark:border-kertas-gelap/40 dark:text-kertas-gelap'
                      }`}
                    >
                      <Globe2 className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-4 flex w-full flex-1 flex-col justify-center gap-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={showTranslation ? 'id-content' : 'en-content'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="w-full space-y-4"
                      >
                        {showTranslation ? (
                          <>
                            <div className="rounded-sm border border-tinta/25 bg-kertas p-4 dark:border-kertas-gelap/25 dark:bg-arsip">
                              <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-wider text-bukti">
                                Kasus (Bahasa Indonesia):
                              </p>
                              <p className="text-xs font-medium italic leading-relaxed md:text-sm">
                                &ldquo;{term.indonesianExample}&rdquo;
                              </p>
                            </div>

                            <div className="rounded-sm border border-tinta/25 bg-kertas p-4 dark:border-kertas-gelap/25 dark:bg-arsip">
                              <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-wider text-daktil dark:text-kertas-gelap/60">
                                Makna istilah:
                              </p>
                              <p className="text-xs font-medium leading-relaxed md:text-sm">
                                {term.indonesianMeaning}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="rounded-sm border border-tinta/25 bg-kertas p-4 dark:border-kertas-gelap/25 dark:bg-arsip">
                              <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-wider text-cap">
                                Scam drill (English context):
                              </p>
                              <p className="text-xs font-medium italic leading-relaxed md:text-sm">
                                &ldquo;{highlightCue(term.englishExample, term.languageCue)}&rdquo;
                              </p>
                            </div>

                            <div className="rounded-sm border border-tinta/25 bg-kertas p-4 dark:border-kertas-gelap/25 dark:bg-arsip">
                              <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-wider text-daktil dark:text-kertas-gelap/60">
                                English definition:
                              </p>
                              <p className="text-xs font-medium leading-relaxed md:text-sm">
                                {term.definition}
                              </p>
                            </div>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <p className="mt-2 w-full text-center font-mono text-[11px] font-bold text-daktil dark:text-kertas-gelap/60">
                    Ketuk kartu untuk membalik kembali
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        ) : (
          <div className="flex h-[250px] w-full flex-col items-center justify-center rounded-sm border-2 border-tinta/25 bg-kertas-2 font-mono text-sm text-daktil dark:border-kertas-gelap/25 dark:bg-arsip-2">
            Tidak ada kosakata dalam kategori ini.
          </div>
        )}

        {/* Kontrol navigasi */}
        {filteredVocabulary.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={isFirstItem}
              className={`flex min-h-12 items-center gap-1.5 rounded-sm border-2 px-6 py-3 font-mono text-xs font-bold transition-all focus-visible:outline-2 focus-visible:outline-laci disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                isFirstItem
                  ? 'border-tinta/20 text-daktil dark:border-kertas-gelap/20'
                  : 'border-tinta/40 bg-kertas text-tinta hover:border-tinta active:scale-97 dark:border-kertas-gelap/40 dark:bg-arsip dark:text-kertas-gelap'
              }`}
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" /> Sebelumnya
            </button>

            <button
              type="button"
              onClick={() => markMastered(term.id)}
              disabled={isMastered}
              className={`flex min-h-12 items-center gap-1.5 rounded-sm border-2 px-6 py-3 font-mono text-xs font-bold transition-all focus-visible:outline-2 focus-visible:outline-laci disabled:cursor-not-allowed disabled:opacity-60 md:text-sm ${
                isMastered
                  ? 'border-laci/50 bg-laci/10 text-laci dark:text-kertas-gelap'
                  : 'border-tinta bg-laci text-kertas hover:bg-laci-tua active:scale-97'
              }`}
            >
              <Check className="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" />
              {isMastered ? 'Sudah dikuasai' : 'Tandai dikuasai'}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex min-h-12 items-center gap-1.5 rounded-sm border-2 border-tinta bg-laci px-8 py-3 font-mono text-xs font-bold text-kertas transition-all hover:bg-laci-tua focus-visible:outline-2 focus-visible:outline-laci active:scale-97 md:text-sm"
            >
              {isLastItem ? 'Selesai (Menu)' : 'Istilah berikut'} <ChevronRight className="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
