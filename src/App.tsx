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

/* Router berbasis state (bukan react-router — app satu halaman).
   Dulu: setiap pindah mode menampilkan layar loading penuh selama
   2 detik. Itu dihapus: pergantian view sekarang hanya fade 150ms.
   Loading 2 detik di tiap navigasi adalah cacat UX, bukan fitur. */
function GameRouter() {
  const { currentMode, role } = useGameEngine();

  const renderView = (mode: string) => {
    // Penjaga: tamu (belum pilih peran) hanya boleh melihat
    // halaman depan dan halaman masuk.
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
        // Proteksi: hanya peran admin yang boleh masuk panel evaluator.
        if (role === 'admin') return <AdminView />;
        return <DashboardView />;
      default:
        return <LandingPageView />;
    }
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {renderView(currentMode)}
        </motion.div>
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
