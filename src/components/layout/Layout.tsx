import { useGameEngine } from '../../hooks/useGameEngine';
import { useTheme } from '../../contexts/ThemeContext';
import { Shield, Trophy, BookOpenCheck, Sun, Moon } from 'lucide-react';

/* Ikon GitHub inline — lucide-react terbaru menghapus ikon brand. */
function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

const GITHUB_URL = 'https://github.com/dezzorigin/lidm-copet';

/* Masthead koran berkas perkara: logo kiri, GitHub + tema + skor kanan,
   garis ganda koran di bawah. Lihat docs/DESIGN.md. */
export function Layout({ children }: LayoutProps) {
  const { userPoints, masteredCount, setMode, role } = useGameEngine();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-kertas text-tinta dark:bg-arsip dark:text-kertas-gelap selection:bg-bukti/30 transition-colors duration-200">
      <header className="sticky top-0 z-50 bg-kertas/95 dark:bg-arsip/95 backdrop-blur border-b-2 border-tinta dark:border-kertas-gelap/40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setMode(role === 'guest' ? 'welcome' : 'home')}
            className="flex items-center gap-2.5 min-h-11 rounded-sm focus-visible:outline-2 focus-visible:outline-laci"
            aria-label="COPET — kembali ke beranda"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-sm border-2 border-tinta bg-laci text-kertas dark:border-kertas-gelap">
              <Shield className="w-5 h-5" aria-hidden="true" />
            </span>
            <span className="text-left leading-none">
              <span className="block font-display text-2xl font-black tracking-tight">
                COPET
              </span>
              <span className="block font-mono text-[10px] font-semibold tracking-[0.18em] text-daktil dark:text-kertas-gelap/60">
                COUNTER PENIPUAN TERINTEGRASI
              </span>
            </span>
          </button>

          <div className="flex items-center gap-2 md:gap-3">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Kode sumber COPET di GitHub"
              className="flex h-11 w-11 items-center justify-center rounded-sm border border-tinta/30 text-tinta transition-colors hover:bg-tinta hover:text-kertas dark:border-kertas-gelap/40 dark:text-kertas-gelap dark:hover:bg-kertas-gelap dark:hover:text-arsip focus-visible:outline-2 focus-visible:outline-laci active:scale-97"
            >
              <GithubMark className="w-5 h-5" />
            </a>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
              className="flex h-11 w-11 items-center justify-center rounded-sm border border-tinta/30 text-tinta transition-colors hover:bg-tinta hover:text-kertas dark:border-kertas-gelap/40 dark:text-kertas-gelap dark:hover:bg-kertas-gelap dark:hover:text-arsip focus-visible:outline-2 focus-visible:outline-laci active:scale-97"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Moon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>

            <div
              className="hidden sm:flex items-center gap-1.5 rounded-sm border border-bukti bg-bukti/10 px-3 py-2 font-mono text-xs font-bold text-bukti"
              title="Poin sesi berjalan"
            >
              <Trophy className="w-4 h-4" aria-hidden="true" />
              <span className="tabular-nums">{userPoints} PTS</span>
            </div>
            <div
              className="hidden sm:flex items-center gap-1.5 rounded-sm border border-laci bg-laci/10 px-3 py-2 font-mono text-xs font-bold text-laci dark:text-kertas-gelap"
              title="Kosakata yang ditandai dikuasai sesi ini"
            >
              <BookOpenCheck className="w-4 h-4" aria-hidden="true" />
              <span className="tabular-nums">{masteredCount} DIKUASAI</span>
            </div>
          </div>
        </div>
        <div className="rule-double text-tinta/60 dark:text-kertas-gelap/30" aria-hidden="true" />
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-10">{children}</main>

      <footer className="max-w-6xl mx-auto px-4 pb-10">
        <div className="rule-double text-tinta/60 dark:text-kertas-gelap/30" aria-hidden="true" />
        <div className="flex flex-col gap-3 pt-5 font-mono text-xs text-daktil dark:text-kertas-gelap/60 md:flex-row md:items-center md:justify-between">
          <p>
            <span className="font-display text-base font-bold text-tinta dark:text-kertas-gelap">
              COPET
            </span>{' '}
            — LEXiCO · Lomba Inovasi Digital Mahasiswa (LIDM) 2026
          </p>
          <p className="max-w-md leading-relaxed">
            Data latihan tersimpan lokal di perangkatmu — tanpa akun, tanpa
            server.
          </p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-laci underline underline-offset-4 hover:text-laci-tua dark:text-kertas-gelap"
          >
            <GithubMark className="w-4 h-4" />
            dezzorigin/lidm-copet
          </a>
        </div>
      </footer>
    </div>
  );
}
