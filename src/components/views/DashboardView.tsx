import { useState } from 'react';
import { useGameEngine } from '../../hooks/useGameEngine';
import { CertificateModal } from '../ui/CertificateModal';
import {
  LogOut, Award, User, Flame, Target, CheckCircle2, Lightbulb,
  BookOpen, SearchCheck, MessagesSquare, ArrowRight,
} from 'lucide-react';

/* Dasbor agen. Semua angka di sini dihitung dari sesi berjalan:
   akurasi = jawaban benar / total jawaban (bukan "87%" hardcode),
   streak = hari aktif berurutan dari localStorage (bukan "3 HARI"
   hardcode). Sebelum ada jawaban, akurasi menampilkan keadaan kosong
   yang jujur. Kartu modul sengaja dibedakan bentuknya — simulasi
   tampil lebar sebagai modul utama, bukan tiga kartu identik. */
export function DashboardView() {
  const {
    setMode, logout, playerName, userPoints, achievements, testType,
    streakCount, answersCorrect, answersWrong,
    quizCorrectToday, simCompletedToday, isQuizClaimed, isSimClaimed, claimMissionReward,
  } = useGameEngine();

  const [isCertOpen, setIsCertOpen] = useState(false);

  const totalAnswers = answersCorrect + answersWrong;
  const accuracy = totalAnswers > 0 ? Math.round((answersCorrect / totalAnswers) * 100) : null;

  const mission = (
    done: boolean, claimed: boolean, title: string, progress: string,
    onClaim: () => void,
  ) => (
    <div className="flex items-center justify-between gap-4 rounded-sm border border-tinta/25 bg-kertas p-4 dark:border-kertas-gelap/25 dark:bg-arsip">
      <div className="flex items-start gap-3">
        <CheckCircle2
          className={`mt-0.5 h-5 w-5 shrink-0 ${done ? 'text-laci' : 'text-daktil/50'}`}
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-bold">{title}</p>
          <p className="mt-0.5 font-mono text-xs text-daktil dark:text-kertas-gelap/60">
            {progress}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClaim}
        disabled={!done || claimed}
        className={`min-h-11 shrink-0 rounded-sm border-2 px-3 py-2 font-mono text-xs font-bold transition-all focus-visible:outline-2 focus-visible:outline-laci disabled:cursor-not-allowed ${
          claimed
            ? 'border-tinta/20 text-daktil/60 dark:border-kertas-gelap/20'
            : done
              ? 'border-tinta bg-laci text-kertas hover:bg-laci-tua active:scale-97'
              : 'border-tinta/20 text-daktil/60 dark:border-kertas-gelap/20'
        }`}
      >
        {claimed ? 'DIKLAIM' : 'KLAIM (+15)'}
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
      {/* ── Kolom utama ─────────────────────────────────────── */}
      <div className="space-y-8 lg:col-span-3">
        <div>
          <p className="font-mono text-xs font-bold tracking-[0.2em] text-daktil dark:text-kertas-gelap/60">
            MEJA PENYIDIK · {testType.toUpperCase()}
          </p>
          <h2 className="mt-2 font-display text-3xl font-black tracking-tight md:text-5xl">
            Selamat datang, Detektif {playerName}.
          </h2>
          <p className="mt-3 max-w-2xl border-l-4 border-laci pl-3 text-sm leading-relaxed text-tinta/80 dark:text-kertas-gelap/80 md:text-base">
            Pilih satu modul pelatihan di bawah ini untuk menguji dan mengasah
            radar sibermu.
          </p>
        </div>

        {/* Misi harian */}
        <section aria-labelledby="misi" className="rounded-sm border-2 border-tinta bg-kertas-2 p-5 md:p-6 dark:border-kertas-gelap/60 dark:bg-arsip-2">
          <h3 id="misi" className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-laci dark:text-kertas-gelap">
            <Target className="w-4 h-4" aria-hidden="true" /> Misi harian agen
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {mission(
              quizCorrectToday >= 3, isQuizClaimed,
              'Deteksi 3 red flag kuis',
              `Progress: ${quizCorrectToday}/3 soal benar`,
              () => claimMissionReward('quiz'),
            )}
            {mission(
              simCompletedToday, isSimClaimed,
              'Selesaikan live simulation',
              `Progress: ${simCompletedToday ? '1' : '0'}/1 misi`,
              () => claimMissionReward('sim'),
            )}
          </div>
        </section>

        {/* Modul: simulasi lebar + dua modul sejajar */}
        <section aria-label="Modul pelatihan" className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode('sim')}
            className="group rounded-sm border-2 border-tinta border-t-4 border-t-bukti bg-kertas-2 p-5 text-left shadow-[4px_4px_0_#1b1a17] transition-all hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-laci active:translate-y-0 active:shadow-none md:col-span-2 dark:border-kertas-gelap/60 dark:bg-arsip-2 dark:shadow-[4px_4px_0_#efe9dc33]"
          >
            <span className="flex items-start justify-between gap-4">
              <MessagesSquare className="h-7 w-7 text-bukti" aria-hidden="true" />
              <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-daktil dark:text-kertas-gelap/60">
                BERKAS 03 · MODUL UTAMA
              </span>
            </span>
            <span className="mt-3 block font-display text-2xl font-black">Live Simulation</span>
            <span className="mt-1 block max-w-2xl text-sm leading-relaxed text-tinta/80 dark:text-kertas-gelap/80">
              Masuk ke percakapan WhatsApp dengan kurir palsu. Setiap balasan
              menentukan keamanan akunmu — 7 simpul percabangan, tiga akhir
              berbeda.
            </span>
            <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs font-bold text-bukti">
              Mulai simulasi
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMode('vocab')}
            className="group rounded-sm border-2 border-tinta border-t-4 border-t-laci bg-kertas-2 p-5 text-left transition-all hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-laci active:translate-y-0 dark:border-kertas-gelap/60 dark:bg-arsip-2"
          >
            <BookOpen className="h-6 w-6 text-laci dark:text-kertas-gelap" aria-hidden="true" />
            <span className="mt-3 block font-mono text-[11px] font-bold tracking-[0.2em] text-daktil dark:text-kertas-gelap/60">
              BERKAS 01
            </span>
            <span className="mt-1 block font-display text-xl font-black">Vocab Drill</span>
            <span className="mt-1 block text-sm leading-relaxed text-tinta/80 dark:text-kertas-gelap/80">
              15 istilah taktik penipuan dalam kartu flash interaktif — ada
              contoh kalimat, sorotan kata kunci, dan audio pengucapan.
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMode('quiz')}
            className="group rounded-sm border-2 border-tinta border-t-4 border-t-cap bg-kertas-2 p-5 text-left transition-all hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-laci active:translate-y-0 dark:border-kertas-gelap/60 dark:bg-arsip-2"
          >
            <SearchCheck className="h-6 w-6 text-cap" aria-hidden="true" />
            <span className="mt-3 block font-mono text-[11px] font-bold tracking-[0.2em] text-daktil dark:text-kertas-gelap/60">
              BERKAS 02
            </span>
            <span className="mt-1 block font-display text-xl font-black">Scam Quiz</span>
            <span className="mt-1 block text-sm leading-relaxed text-tinta/80 dark:text-kertas-gelap/80">
              4 skenario bertingkat Easy sampai Expert dengan timer krisis
              15 detik dan bonus kecepatan.
            </span>
          </button>
        </section>

        {/* Tahukah kamu */}
        <aside className="rounded-sm border-2 border-bukti/60 bg-bukti/10 p-5">
          <h3 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-bukti">
            <Lightbulb className="w-4 h-4" aria-hidden="true" /> Tahukah kamu?
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm font-medium leading-relaxed">
            <li>Penipu sering berpura-pura menjadi kurir atau pihak berwenang untuk membuat kita panik.</li>
            <li>File foto rincian barang tidak pernah berbentuk aplikasi (.APK). Kalau kamu memasang .APK palsu, SMS OTP bank bisa disadap.</li>
            <li>Jaga kerahasiaan kredensial akun — kode OTP, PIN, dan kata sandi — dari siapa pun, termasuk dari petugas bank.</li>
          </ul>
        </aside>
      </div>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        <section className="relative rounded-sm border-2 border-tinta bg-kertas-2 p-5 text-center dark:border-kertas-gelap/60 dark:bg-arsip-2" aria-label="Profil agen">
          <p className="absolute right-3 top-3 flex items-center gap-1 rounded-sm border border-bukti bg-bukti/10 px-2 py-1 font-mono text-[10px] font-bold text-bukti">
            <Flame className="w-3.5 h-3.5" aria-hidden="true" />
            {streakCount} HARI
          </p>
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-tinta bg-kertas text-laci dark:border-kertas-gelap dark:bg-arsip">
            <User className="w-8 h-8" aria-hidden="true" />
          </span>
          <h3 className="mt-3 font-display text-lg font-black">{playerName}</h3>
          <p className="mt-1 font-mono text-xs text-daktil dark:text-kertas-gelap/60">{testType}</p>
          <p className={`mt-3 inline-block rounded-sm border px-3 py-1 font-mono text-[10px] font-bold tracking-wider ${
            userPoints === 0
              ? 'border-cap/50 bg-cap/10 text-cap'
              : 'border-laci/50 bg-laci/10 text-laci dark:text-kertas-gelap'
          }`}>
            {userPoints === 0 ? 'RENTAN — BELUM BERLATIH' : 'SEDANG BERLATIH'}
          </p>
        </section>

        {/* Akurasi nyata sesi berjalan */}
        <section className="rounded-sm border-2 border-tinta bg-kertas-2 p-5 dark:border-kertas-gelap/60 dark:bg-arsip-2" aria-label="Radar akurasi">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-daktil dark:text-kertas-gelap/60">
            Radar akurasi
          </h4>
          {accuracy === null ? (
            <p className="mt-3 text-sm leading-relaxed text-tinta/80 dark:text-kertas-gelap/80">
              Belum ada jawaban sesi ini — jawab satu kasus kuis atau simulasi
              untuk melihat akurasimu.
            </p>
          ) : (
            <>
              <p className="mt-2 font-mono text-2xl font-black tabular-nums text-laci dark:text-kertas-gelap">
                {accuracy}%
                <span className="ml-2 font-mono text-xs font-normal text-daktil dark:text-kertas-gelap/60">
                  deteksi berhasil ({answersCorrect}/{totalAnswers} jawaban)
                </span>
              </p>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-sm border border-tinta/20 bg-kertas dark:border-kertas-gelap/20 dark:bg-arsip" role="progressbar" aria-valuenow={accuracy} aria-valuemin={0} aria-valuemax={100} aria-label="Akurasi deteksi">
                <div className="h-full bg-laci transition-all duration-200" style={{ width: `${accuracy}%` }} />
              </div>
            </>
          )}
        </section>

        <section className="rounded-sm border-2 border-tinta bg-kertas-2 p-5 text-center dark:border-kertas-gelap/60 dark:bg-arsip-2" aria-label="Poin terkumpul">
          <h4 className="font-mono text-xs font-bold text-daktil dark:text-kertas-gelap/60">Poin terkumpul</h4>
          <p className="mt-1 font-mono text-4xl font-black tabular-nums text-laci dark:text-kertas-gelap">
            {userPoints} <span className="text-sm font-bold text-daktil dark:text-kertas-gelap/60">PTS</span>
          </p>
        </section>

        <section className="flex-1 rounded-sm border-2 border-tinta bg-kertas-2 p-5 dark:border-kertas-gelap/60 dark:bg-arsip-2" aria-label="Badge kehormatan">
          <h4 className="flex items-center gap-2 border-b border-tinta/15 pb-2 font-mono text-xs font-bold text-daktil dark:border-kertas-gelap/15 dark:text-kertas-gelap/60">
            <Award className="w-4 h-4 text-laci dark:text-kertas-gelap" aria-hidden="true" /> Badge kehormatan
          </h4>
          <div className="mt-3 flex flex-col gap-2">
            {achievements.length > 0 ? (
              achievements.map((ach) => (
                <p key={ach} className="rounded-sm border border-laci/40 bg-laci/10 px-3 py-2 text-center font-mono text-xs font-bold text-laci dark:text-kertas-gelap">
                  {ach}
                </p>
              ))
            ) : (
              <p className="py-4 text-center font-mono text-xs italic text-daktil dark:text-kertas-gelap/60">
                Selesaikan kuis untuk membuka badge.
              </p>
            )}
          </div>
        </section>

        <button
          type="button"
          onClick={() => setIsCertOpen(true)}
          disabled={userPoints < 10}
          className={`flex min-h-14 w-full items-center justify-center gap-2 rounded-sm border-2 border-tinta p-4 font-mono text-xs font-bold transition-all focus-visible:outline-2 focus-visible:outline-laci disabled:cursor-not-allowed disabled:opacity-60 ${
            userPoints >= 10
              ? 'bg-laci text-kertas hover:bg-laci-tua active:scale-97'
              : 'bg-kertas-2 text-daktil dark:bg-arsip-2'
          }`}
        >
          {userPoints >= 10 ? 'UNDUH SERTIFIKAT' : 'SERTIFIKAT TERKUNCI (MIN. 10 PTS)'}
        </button>

        <button
          type="button"
          onClick={() => logout()}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-sm border-2 border-cap/50 bg-cap/10 p-4 font-mono text-xs font-bold text-cap transition-colors hover:bg-cap/20 focus-visible:outline-2 focus-visible:outline-laci active:scale-97"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" /> KELUAR SESI
        </button>
      </div>

      <CertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        playerName={playerName}
        score={userPoints}
      />
    </div>
  );
}
