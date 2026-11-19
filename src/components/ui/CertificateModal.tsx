import { useState } from 'react';
import { Trophy, Download, X, Award } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  score: number;
}

export function CertificateModal({ isOpen, onClose, playerName, score }: CertificateModalProps) {
  // Nomor sertifikat stabil selama komponen hidup (lazy initializer
  // useState — dihitung sekali, bukan di setiap render).
  const [certNo] = useState(() => `CPT-LIDM-${String(Date.now()).slice(-6)}`);

  if (!isOpen) return null;

  const handleDownload = () => {
    window.print();
  };

  const displayName =
    playerName === 'Agent Anonim' || playerName.trim() === ''
      ? 'Detektif Siber Hebat'
      : playerName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-arsip/70 p-4 backdrop-blur-sm print:bg-white print:p-0">
      <div className="relative w-full max-w-4xl rounded-sm border-2 border-tinta bg-kertas p-6 dark:border-kertas-gelap/60 dark:bg-arsip">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <h3 className="flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-widest text-laci dark:text-kertas-gelap">
            <Award className="w-4 h-4" aria-hidden="true" /> Piagam penghargaan
          </h3>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDownload}
              className="flex min-h-11 items-center gap-2 rounded-sm border-2 border-tinta bg-laci px-5 py-2.5 font-mono text-xs font-bold text-kertas transition-colors hover:bg-laci-tua focus-visible:outline-2 focus-visible:outline-laci active:scale-97"
            >
              <Download className="w-4 h-4" aria-hidden="true" /> CETAK PIAGAM
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup piagam"
              className="flex h-11 w-11 items-center justify-center rounded-sm border-2 border-tinta/40 transition-colors hover:border-tinta focus-visible:outline-2 focus-visible:outline-laci active:scale-97"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Lembar sertifikat (A4 landscape, rasio 1.414:1) */}
        <div
          id="certificate-sheet"
          className="relative flex aspect-[1.414/1] w-full flex-col items-center justify-between overflow-hidden rounded-sm border-4 border-double border-bukti/70 bg-kertas-2 p-6 md:p-12 dark:bg-arsip-2 print:border-tinta print:bg-white print:text-tinta"
        >
          <div className="flex flex-col items-center text-center">
            <Trophy className="mb-3 h-16 w-16 text-bukti md:h-20 md:w-20" aria-hidden="true" />
            <h1 className="font-display text-3xl font-black tracking-wide md:text-5xl">
              PIAGAM PENGHARGAAN
            </h1>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-daktil md:text-xs dark:text-kertas-gelap/60">
              No Sertifikat: {certNo}
            </p>
          </div>

          <div className="my-4 space-y-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-daktil md:text-sm dark:text-kertas-gelap/60">
              Diberikan kepada siswa berprestasi:
            </p>
            <h2 className="inline-block border-b-2 border-bukti/60 px-12 pb-2 font-display text-2xl font-black tracking-wide text-laci md:text-4xl dark:text-kertas-gelap">
              {displayName}
            </h2>
            <p className="mx-auto max-w-xl text-xs font-medium leading-relaxed text-tinta/80 md:text-sm dark:text-kertas-gelap/80">
              Telah berhasil menyelesaikan rangkaian simulasi siber{' '}
              <span className="font-bold">Detektif COPET</span>, mencakup analisis
              petunjuk bahasa dari manipulasi penipu online, serta lulus ujian
              ketangkasan siber dalam evaluasi:
            </p>
            <p className="inline-block rounded-sm border border-bukti/60 bg-bukti/10 px-6 py-2.5 font-mono text-xs font-bold text-bukti md:text-sm">
              SKOR EVALUASI: {score} POIN DETEKTIF
            </p>
          </div>

          <div className="flex w-full items-end justify-between border-t border-tinta/20 pt-4">
            <div className="text-left font-mono text-[9px] text-daktil md:text-[10px] dark:text-kertas-gelap/60">
              <p>Platform: DETEKTIF COPET</p>
              <p>Metode: Gamified Active Learning</p>
            </div>
            <div className="text-center">
              <p className="mb-1 border-b border-tinta/40 px-6 pb-1 text-xs font-bold">
                Dewan Penguji COPET
              </p>
              <p className="font-mono text-[8px] uppercase tracking-widest text-daktil md:text-[9px] dark:text-kertas-gelap/60">
                Sistem evaluator otomatis
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
