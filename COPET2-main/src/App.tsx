import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameEngineProvider, useGameEngine } from './hooks/useGameEngine';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/layout/Layout';
import { LandingPageView } from './components/views/LandingPageView'; 
import { LoginView } from './components/views/LoginView'; 
import { DashboardView } from './components/views/DashboardView';
import { SpotTheScamView } from './components/views/SpotTheScamView';
import { VocabView } from './components/views/VocabView';
import { SimulationView } from './components/views/SimulationView';
import { AdminView } from './components/views/AdminView'; 

function GameRouter() {
  const { currentMode, role } = useGameEngine();
  const [activeView, setActiveView] = useState(currentMode);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (currentMode !== activeView) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setActiveView(currentMode);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentMode, activeView]);

  const renderView = (mode: string) => {
    // 🛡️ SECURITY GUARD: Kalau belum milih role, user cuma boleh lihat Welcome / Login!
    if (role === 'guest' && mode !== 'welcome' && mode !== 'login') {
      return <LoginView />;
    }

    switch (mode) {
      case 'welcome':
        return <LandingPageView />;
      case 'login':
        return <LoginView />;
      case 'home':
        return <DashboardView />;
      case 'vocab':
        return <VocabView />;
      case 'quiz':
        return <SpotTheScamView />;
      case 'sim':
        return <SimulationView />;
      case 'admin':
        // Proteksi: cuma role admin yang boleh tembus ke panel Admin
        if (role === 'admin') return <AdminView />;
        return <DashboardView />;
      default:
        return <LandingPageView />;
    }
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {isTransitioning ? (
          <motion.div
            key="loading"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-indigo-600 dark:bg-gray-900 flex flex-col items-center justify-center gap-4 border-b-4 border-indigo-800 dark:border-gray-700 shadow-lg"
          >
            <motion.h1
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-5xl md:text-7xl font-black text-white tracking-widest"
            >
              CO<span className="text-pink-400">PET</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-sans font-bold text-indigo-200 dark:text-gray-400 tracking-wider text-sm sm:text-base animate-pulse"
            >
              {currentMode === 'admin' ? 'MEMBUKA PANEL EVALUATOR...' : 'MENYIAPKAN MISI DETEKTIF...'}
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderView(activeView)}
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <GameEngineProvider>
        <GameRouter />
      </GameEngineProvider>
    </ThemeProvider>
  );
}

export default App;