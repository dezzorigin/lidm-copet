import { useGameEngine } from '../../hooks/useGameEngine';
import { LogOut, ShieldCheck, Users, BarChart3, BookOpen, Terminal } from 'lucide-react';

/* Panel evaluator. Data yang tampil adalah log skor sesi yang
   tersimpan lokal di perangkat ini (localStorage) — dulu panel ini
   mengklaim "Live" dan "Data Terintegrasi" padahal tidak ada backend
   sama sekali (Firestore tidak pernah dipakai). Rata-rata skor dihitung
   dari log yang ada; kalau log kosong, tampil keadaan kosong yang jujur. */
export function AdminView() {
  const { logout, playerName, scoreLogs } = useGameEngine();

  const avgScore = scoreLogs.length > 0
    ? Math.round(scoreLogs.reduce((sum, log) => sum + log.score, 0) / scoreLogs.length)
    : null;

  return (
    <div className="rounded-sm border-2 border-tinta bg-arsip p-6 text-kertas-gelap md:p-10 dark:border-kertas-gelap/60">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-between gap-4 border-b-2 border-kertas-gelap/30 pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 font-mono text-2xl font-bold tracking-wide md:text-3xl">
            <ShieldCheck className="text-bukti" aria-hidden="true" /> PANEL EVALUATOR
          </h1>
          <p className="mt-1 font-mono text-xs text-kertas-gelap/60">
            Operator: <span className="font-bold text-kertas-gelap">{playerName}</span>
            {' '}· Data lokal perangkat ini — tanpa server
          </p>
        </div>

        <button
          type="button"
          onClick={() => logout()}
          className="flex min-h-11 items-center gap-2 rounded-sm border-2 border-kertas-gelap/50 px-4 py-2 font-mono text-sm transition-colors hover:border-cap hover:text-cap focus-visible:outline-2 focus-visible:outline-bukti active:scale-97"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" /> AKHIRI SESI
        </button>
      </div>

      <div className="mx-auto mt-8 w-full max-w-5xl space-y-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-sm border border-kertas-gelap/30 bg-arsip-2 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-sm border border-kertas-gelap/30 text-bukti">
              <Users className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono text-2xl font-bold tabular-nums">{scoreLogs.length}</p>
              <p className="font-mono text-xs text-kertas-gelap/60">Sesi teruji (perangkat ini)</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-sm border border-kertas-gelap/30 bg-arsip-2 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-sm border border-kertas-gelap/30 text-bukti">
              <BarChart3 className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono text-2xl font-bold tabular-nums">
                {avgScore === null ? '—' : `${avgScore} PTS`}
              </p>
              <p className="font-mono text-xs text-kertas-gelap/60">Rata-rata skor akhir</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-sm border border-kertas-gelap/30 bg-arsip-2 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-sm border border-kertas-gelap/30 text-bukti">
              <BookOpen className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono text-2xl font-bold tabular-nums">3 modul</p>
              <p className="font-mono text-xs text-kertas-gelap/60">Kurikulum aktif</p>
            </div>
          </div>
        </div>

        <section className="rounded-sm border border-kertas-gelap/30 bg-arsip-2 p-6 md:p-8" aria-label="Log evaluasi pengguna">
          <h2 className="mb-6 flex items-center gap-2 font-mono text-base uppercase tracking-wider text-bukti">
            <Terminal className="w-4 h-4" aria-hidden="true" /> Log evaluasi pengguna
          </h2>

          {scoreLogs.length === 0 ? (
            <p className="rounded-sm border border-dashed border-kertas-gelap/40 p-6 text-center font-mono text-sm leading-relaxed text-kertas-gelap/70">
              Belum ada sesi yang selesai di perangkat ini. Minta siswa
              menyelesaikan satu kuis sampai Mission Report — skornya akan
              tercatat di sini.
            </p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left font-mono text-sm">
                <thead>
                  <tr className="border-b border-kertas-gelap/30 text-xs uppercase tracking-wider text-kertas-gelap/60">
                    <th scope="col" className="pb-3 font-semibold">Nama siswa</th>
                    <th scope="col" className="pb-3 font-semibold">Skor akhir</th>
                    <th scope="col" className="pb-3 font-semibold">Pencapaian tertinggi</th>
                    <th scope="col" className="pb-3 text-right font-semibold">Waktu uji</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-kertas-gelap/15">
                  {scoreLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-arsip/60">
                      <td className="py-4 font-medium">{log.name}</td>
                      <td className="py-4 font-bold text-bukti">{log.score} PTS</td>
                      <td className="py-4">
                        <span className="rounded-sm border border-bukti/50 bg-bukti/10 px-2 py-0.5 text-xs font-bold text-bukti">
                          {log.badge}
                        </span>
                      </td>
                      <td className="py-4 text-right text-xs text-kertas-gelap/60">{log.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
