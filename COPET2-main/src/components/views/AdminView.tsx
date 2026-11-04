import { useGameEngine } from '../../hooks/useGameEngine';
import { LogOut, ShieldCheck, Users, BarChart3, Terminal, Award } from 'lucide-react';

export function AdminView() {
  const { logout, playerName, scoreLogs } = useGameEngine();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[length:24px_24px]" />
      
      <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 mb-12 border-b border-cyan-500/30 pb-6 z-10 relative">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-mono tracking-widest text-cyan-400 flex items-center gap-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <ShieldCheck className="text-cyan-400" /> RESTRICTED_ADMIN_SYSTEM
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">Operator Session: <span className="text-rose-400 font-bold">{playerName}</span></p>
        </div>

        <button
          onClick={() => logout()}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-950/60 hover:bg-rose-950/40 text-cyan-400 hover:text-rose-400 border border-cyan-500/30 hover:border-rose-500/30 rounded-xl text-sm font-mono transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
        >
          <LogOut className="w-4 h-4" /> TERMINATE_SESSION
        </button>
      </div>

      <div className="w-full max-w-5xl mx-auto space-y-8 z-10 relative">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex items-center gap-4 shadow-lg">
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400"><Users /></div>
            <div>
              <div className="text-2xl font-bold font-mono">{scoreLogs.length}</div> 
              <div className="text-xs text-slate-500 font-mono">Total Siswa Teruji</div>
            </div>
          </div>
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex items-center gap-4 shadow-lg">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400"><BarChart3 /></div>
            <div>
              <div className="text-2xl font-bold font-mono">Live</div>
              <div className="text-xs text-slate-500 font-mono">Data Terintegrasi</div>
            </div>
          </div>
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex items-center gap-4 shadow-lg">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400"><Award /></div>
            <div>
              <div className="text-2xl font-bold font-mono">3 Level</div>
              <div className="text-xs text-slate-500 font-mono">Curriculum Active</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-2xl backdrop-blur-sm shadow-2xl">
          <h2 className="text-base font-mono text-indigo-400 tracking-wider mb-6 flex items-center gap-2 uppercase">
            <Terminal className="w-4 h-4 animate-pulse" /> Live_User_Evaluation_Logger
          </h2>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse font-mono text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase text-xs tracking-wider">
                  <th className="pb-3 font-semibold">Nama Siswa</th>
                  <th className="pb-3 font-semibold">Skor Akhir</th>
                  <th className="pb-3 font-semibold">Pencapaian Tertinggi</th>
                  <th className="pb-3 font-semibold text-right">Waktu Uji</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {scoreLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-4 font-medium text-slate-200">{log.name}</td>
                    <td className="py-4 text-cyan-400 font-bold">{log.score} PTS</td>
                    <td className="py-4">
                      <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs px-2 py-0.5 rounded shadow-sm">
                        {log.badge}
                      </span>
                    </td>
                    <td className="py-4 text-right text-slate-500 text-xs">{log.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}