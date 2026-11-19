import { useState, type FormEvent } from 'react';
import { useGameEngine } from '../../hooks/useGameEngine';
import { KeyRound, UserRound, GraduationCap } from 'lucide-react';

/* Gerbang masuk: pilih peran, tanpa kata sandi dan tanpa akun.
   Nama dipakai untuk piagam dan log skor lokal. */
export function LoginView() {
  const { loginAs } = useGameEngine();
  const [agentName, setAgentName] = useState('');

  const submitDetective = (e: FormEvent) => {
    e.preventDefault();
    loginAs('user', agentName);
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center py-8">
      <div className="w-full max-w-2xl text-center">
        <p className="font-mono text-xs font-bold tracking-[0.2em] text-cap">
          LIDM 2026 · EDUKASI SIBER INTERAKTIF
        </p>
        <h1 className="mt-3 font-display text-5xl font-black tracking-tight md:text-6xl">
          Detektif COPET
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-tinta/80 dark:text-kertas-gelap/80">
          Asah radar sibermu dan lawan berbagai modus penipuan online —
          tanpa akun, tanpa kata sandi. Pilih peranmu untuk mulai.
        </p>

        <div className="mx-auto mt-10 grid w-full max-w-xl grid-cols-1 gap-5 text-left md:grid-cols-2">
          {/* Kartu detektif */}
          <form
            onSubmit={submitDetective}
            className="flex flex-col justify-between rounded-sm border-2 border-tinta bg-kertas-2 p-5 shadow-[4px_4px_0_#1b1a17] dark:border-kertas-gelap/60 dark:bg-arsip-2 dark:shadow-[4px_4px_0_#efe9dc33]"
          >
            <div>
              <span className="flex h-11 w-11 items-center justify-center rounded-sm border-2 border-tinta bg-laci text-kertas dark:border-kertas-gelap">
                <UserRound className="w-5 h-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-display text-xl font-black">Mulai berlatih</h2>
              <p className="mt-1 font-mono text-xs leading-relaxed text-daktil dark:text-kertas-gelap/60">
                Latihan deteksi penipuan — kuis, simulasi, dan drill kosakata.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <label htmlFor="agent-name" className="sr-only">
                Nama detektif
              </label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 w-4 h-4 -translate-y-1/2 text-daktil" aria-hidden="true" />
                <input
                  id="agent-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Nama kamu…"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="min-h-12 w-full rounded-sm border-2 border-tinta/40 bg-kertas px-10 py-3 font-mono text-sm font-semibold text-tinta placeholder:text-daktil focus:border-laci focus:outline-none dark:border-kertas-gelap/40 dark:bg-arsip dark:text-kertas-gelap"
                />
              </div>
              <button
                type="submit"
                className="min-h-12 w-full rounded-sm border-2 border-tinta bg-laci font-mono text-sm font-bold text-kertas transition-colors hover:bg-laci-tua focus-visible:outline-2 focus-visible:outline-laci active:scale-97"
              >
                MASUK SEBAGAI DETEKTIF
              </button>
            </div>
          </form>

          {/* Kartu evaluator */}
          <div className="flex flex-col justify-between rounded-sm border-2 border-tinta/40 bg-kertas p-5 dark:border-kertas-gelap/40 dark:bg-arsip">
            <div>
              <span className="flex h-11 w-11 items-center justify-center rounded-sm border-2 border-tinta/60 text-tinta dark:border-kertas-gelap/60 dark:text-kertas-gelap">
                <GraduationCap className="w-5 h-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-display text-xl font-black">Menu evaluator</h2>
              <p className="mt-1 font-mono text-xs leading-relaxed text-daktil dark:text-kertas-gelap/60">
                Akses papan nilai siswa — log skor pre-test dan post-test
                yang tersimpan di perangkat ini.
              </p>
            </div>
            <button
              type="button"
              onClick={() => loginAs('admin')}
              className="mt-6 min-h-12 w-full rounded-sm border-2 border-tinta/60 bg-kertas font-mono text-sm font-bold text-tinta transition-colors hover:bg-kertas-2 focus-visible:outline-2 focus-visible:outline-laci active:scale-97 dark:border-kertas-gelap/60 dark:bg-arsip dark:text-kertas-gelap dark:hover:bg-arsip-2"
            >
              MASUK SEBAGAI GURU
            </button>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-md font-mono text-[11px] leading-relaxed text-daktil dark:text-kertas-gelap/60">
          Tanpa kata sandi: peran guru di sini hanya membuka papan nilai
          lokal di perangkat ini, bukan sistem akun.
        </p>
      </div>
    </div>
  );
}
