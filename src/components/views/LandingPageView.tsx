import { useGameEngine } from '../../hooks/useGameEngine';
import { quizData } from '../../data/quizData';
import { vocabulary } from '../../data/vocabulary';
import { simulationBranch } from '../../data/simulationData';
import {
  ArrowRight,
  ArrowDown,
  AlertTriangle,
  BookOpen,
  SearchCheck,
  MessagesSquare,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';

/* Halaman depan koran berkas perkara (lihat docs/DESIGN.md):
   hero dua kolom — headline kiri, panel barang bukti kanan —
   lalu antrean kasus dan daftar isi berkas. Angka yang tampil adalah
   angka asli isi repo (15 kosakata, 4 skenario, 7 simpul simulasi),
   bukan statistik vanity tanpa sumber. */
export function LandingPageView() {
  const { setMode } = useGameEngine();
  const simNodes = Object.keys(simulationBranch).length;

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      {/* ── Hero dua kolom ─────────────────────────────────────── */}
      <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-7"
        >
          <p className="font-mono text-xs font-bold tracking-[0.2em] text-cap">
            LEXiCO · LIDM 2026 · MICRO-TEACHING ANTI-PENIPUAN
          </p>
          <h1 className="mt-4 font-display text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
            Kenali pesannya sebelum uangmu hilang.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-tinta/80 dark:text-kertas-gelap/80 md:text-lg">
            COPET — Counter Penipuan Terintegrasi — melatih radar
            anti-penipuan berbahasa Inggris lewat kasus nyata: SMS hadiah
            palsu, telepon bank yang meminta OTP, lampiran .exe berkedok
            PDF, sampai teman yang tiba-tiba pinjam uang dari nomor baru.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setMode('login')}
              className="group flex min-h-14 items-center gap-2 rounded-sm border-2 border-tinta bg-laci px-7 font-mono text-sm font-bold text-kertas shadow-[4px_4px_0_#1b1a17] transition-all hover:bg-laci-tua focus-visible:outline-2 focus-visible:outline-laci active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:border-kertas-gelap dark:shadow-[4px_4px_0_#efe9dc]"
            >
              Mulai penyidikan
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
            <a
              href="#kasus"
              className="flex min-h-14 items-center gap-2 rounded-sm border-2 border-tinta/40 px-7 font-mono text-sm font-bold text-tinta transition-colors hover:border-tinta focus-visible:outline-2 focus-visible:outline-laci dark:border-kertas-gelap/40 dark:text-kertas-gelap"
            >
              Lihat daftar kasus
              <ArrowDown className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

          {/* Isi berkas — angka asli repo */}
          <dl className="mt-9 grid grid-cols-2 gap-px border border-tinta/25 bg-tinta/25 sm:grid-cols-4 dark:border-kertas-gelap/25 dark:bg-kertas-gelap/25">
            {[
              { n: String(vocabulary.length), label: 'Istilah di drill kosakata' },
              { n: String(quizData.length), label: 'Skenario kuis berwaktu' },
              { n: String(simNodes), label: 'Simpul simulasi bercabang' },
              { n: '3', label: 'Modul pelatihan' },
            ].map((s) => (
              <div key={s.label} className="bg-kertas px-4 py-4 dark:bg-arsip">
                <dt className="font-mono text-2xl font-bold tabular-nums">{s.n}</dt>
                <dd className="mt-1 font-mono text-[11px] leading-snug text-daktil dark:text-kertas-gelap/60">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* ── Panel barang bukti ─────────────────────────────── */}
        <motion.aside
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="relative lg:col-span-5"
          aria-label="Barang bukti: contoh chat penipu modus kurir"
        >
          <div className="rounded-sm border-2 border-tinta bg-kertas-2 shadow-[6px_6px_0_#1b1a17] dark:border-kertas-gelap/60 dark:bg-arsip-2 dark:shadow-[6px_6px_0_#efe9dc33]">
            <div className="flex items-center justify-between gap-3 border-b-2 border-tinta px-5 py-3 dark:border-kertas-gelap/40">
              <p className="font-mono text-xs font-bold tracking-wide">
                BARANG BUKTI Nº 01
              </p>
              <p className="font-mono text-[11px] text-daktil dark:text-kertas-gelap/60">
                WhatsApp · +62 821-4321-9876
              </p>
            </div>
            <div className="flex flex-col gap-3 px-5 py-5 text-sm leading-relaxed">
              <p className="max-w-[85%] rounded-sm rounded-tl-none border border-tinta/25 bg-kertas px-3.5 py-2.5 dark:border-kertas-gelap/25 dark:bg-arsip">
                Permisi pak/ibu.. benar dgn nama pemilik no ini? Ada paket..
              </p>
              <p className="max-w-[85%] rounded-sm rounded-tl-none border border-cap/50 bg-cap/10 px-3.5 py-2.5 dark:border-cap/60">
                Silahkan di cek detail foto paketnya disini ya agar jelas —{' '}
                <span className="font-mono text-xs font-bold text-cap">
                  Lihat_Foto_Paket.apk
                </span>
              </p>
              <p className="max-w-[85%] self-end rounded-sm rounded-tr-none border border-laci/40 bg-laci/10 px-3.5 py-2.5">
                Foto paket tidak pernah berbentuk aplikasi (.APK).
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-tinta/20 px-5 py-3 font-mono text-[11px] text-daktil dark:border-kertas-gelap/20 dark:text-kertas-gelap/60">
              <span>Modus: resi kurir palsu</span>
              <span>Disita dari simulasi COPET</span>
            </div>
          </div>
          <span className="stamp absolute -right-2 -top-4 text-sm md:-right-4" aria-hidden="true">
            Penipuan
          </span>
        </motion.aside>
      </section>

      <div className="rule-double text-tinta/60 dark:text-kertas-gelap/30" aria-hidden="true" />

      {/* ── Tahukah kamu ──────────────────────────────────────── */}
      <section aria-labelledby="tahukah">
        <h2 id="tahukah" className="flex items-center gap-2 font-mono text-xs font-bold tracking-[0.2em] text-cap">
          <AlertTriangle className="w-4 h-4" aria-hidden="true" />
          TAHUKAH KAMU?
        </h2>
        <p className="mt-3 max-w-3xl border-l-4 border-bukti pl-4 text-base leading-relaxed md:text-lg">
          File foto rincian barang tidak pernah berbentuk aplikasi (.APK).
          Kalau kamu memasang .APK palsu berkedok foto paket, data SMS OTP
          bank kamu bisa disadap. Penipu juga sering berpura-pura menjadi
          kurir atau pihak berwenang supaya kamu panik — panik adalah
          bahan bakar rekayasa sosial.
        </p>
      </section>

      {/* ── Antrean kasus (dari data kuis asli) ────────────────── */}
      <section id="kasus" aria-labelledby="kasus-judul" className="scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs font-bold tracking-[0.2em] text-daktil dark:text-kertas-gelap/60">
              ANTREAN KASUS · SPOT THE SCAM
            </p>
            <h2 id="kasus-judul" className="mt-2 font-display text-3xl font-black tracking-tight md:text-4xl">
              Empat kasus menunggu diperiksa.
            </h2>
          </div>
          <p className="max-w-sm font-mono text-xs leading-relaxed text-daktil dark:text-kertas-gelap/60">
            Tiap kasus dibatasi 15 detik — meniru tekanan waktu yang dipakai
            penipu asli. Pilih satu untuk membuka berkasnya.
          </p>
        </div>
        <ol className="mt-6 divide-y-2 divide-tinta/15 border-y-2 border-tinta dark:divide-kertas-gelap/15 dark:border-kertas-gelap/60">
          {quizData.map((q, i) => (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="group flex w-full min-h-11 items-center gap-4 px-1 py-4 text-left transition-colors hover:bg-kertas-2 focus-visible:outline-2 focus-visible:outline-laci dark:hover:bg-arsip-2"
              >
                <span className="font-mono text-sm font-bold tabular-nums text-daktil dark:text-kertas-gelap/60">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1">
                  <span className="block font-display text-lg font-bold leading-snug md:text-xl">
                    {q.category ?? 'Kasus penipuan'}
                  </span>
                  <span className="mt-0.5 block font-mono text-xs text-daktil dark:text-kertas-gelap/60">
                    PERKARA Nº COPET-2026-{q.id.toUpperCase()} · Kanal:{' '}
                    {q.channel === 'sms'
                      ? 'SMS'
                      : q.channel === 'call'
                        ? 'Telepon'
                        : q.channel === 'email'
                          ? 'Email'
                          : 'Chat'}
                  </span>
                </span>
                <span className="rounded-sm border border-tinta/40 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wide dark:border-kertas-gelap/40">
                  {q.difficulty}
                </span>
                <ArrowRight className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Daftar isi berkas: tiga modul ─────────────────────── */}
      <section aria-labelledby="modul-judul">
        <p className="font-mono text-xs font-bold tracking-[0.2em] text-daktil dark:text-kertas-gelap/60">
          DAFTAR ISI BERKAS
        </p>
        <h2 id="modul-judul" className="mt-2 font-display text-3xl font-black tracking-tight md:text-4xl">
          Tiga modul, satu meja penyidik.
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              icon: BookOpen,
              no: 'BERKAS 01',
              title: 'Vocab Drill',
              accent: 'border-t-laci',
              text: 'Pelajari 15 istilah taktik penipuan dan petunjuk bahasa yang dipakai pelaku — lengkap dengan contoh kalimat, sorotan kata kunci, dan pengucapan audio.',
            },
            {
              icon: SearchCheck,
              no: 'BERKAS 02',
              title: 'Spot the Scam',
              accent: 'border-t-cap',
              text: 'Uji radar siber di 4 skenario bertingkat Easy sampai Expert. Timer 15 detik, poin bonus kecepatan, lalu laporkan kasusnya ke kanal aduan resmi.',
            },
            {
              icon: MessagesSquare,
              no: 'BERKAS 03',
              title: 'Live Simulation',
              accent: 'border-t-bukti',
              text: 'Masuk ke percakapan WhatsApp dengan kurir palsu. Setiap balasan menentukan keamanan akunmu — ada 7 simpul percabangan dan tiga akhir berbeda.',
            },
          ].map((m) => (
            <article
              key={m.no}
              className={`rounded-sm border-2 border-tinta bg-kertas-2 p-5 ${m.accent} border-t-4 dark:border-kertas-gelap/60 dark:bg-arsip-2`}
            >
              <m.icon className="w-6 h-6" aria-hidden="true" />
              <p className="mt-4 font-mono text-[11px] font-bold tracking-[0.2em] text-daktil dark:text-kertas-gelap/60">
                {m.no}
              </p>
              <h3 className="mt-1 font-display text-2xl font-black">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-tinta/80 dark:text-kertas-gelap/80">
                {m.text}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-6 flex items-start gap-2 font-mono text-xs leading-relaxed text-daktil dark:text-kertas-gelap/60">
          <FileText className="mt-0.5 w-4 h-4 shrink-0" aria-hidden="true" />
          Metode ADDIE — Analysis, Design, Development, Implementation,
          Evaluation — untuk siswa SMA ke atas. Selesai berlatih, unduh
          piagammu dari dasbor (terbuka setelah 10 poin).
        </p>
        <p className="mt-3 flex items-start gap-2 font-mono text-xs leading-relaxed text-daktil dark:text-kertas-gelap/60">
          <ShieldCheck className="mt-0.5 w-4 h-4 shrink-0" aria-hidden="true" />
          Satu aturan yang tidak pernah berubah: bank asli tidak pernah
          meminta kode OTP, PIN, atau kata sandi — dengan alasan apa pun.
        </p>
      </section>
    </div>
  );
}
