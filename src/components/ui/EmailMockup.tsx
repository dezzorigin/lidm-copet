import { UserCircle, Paperclip } from 'lucide-react';

interface EmailMockupProps {
  senderName: string;
  senderAddress?: string;
  subject?: string;
  content: string;
  date?: string;
}

/* Mockup klien email — dipakai kuis untuk skenario kanal email (q3).
   Dulu komponen ini tidak dipakai siapa pun (dead code) dan tombol
   Reply/Forward-nya mati. Sekarang: tampil sebagai barang bukti statis,
   tanpa tombol mati; tanggal default memakai locale id-ID. */
export function EmailMockup({
  senderName,
  senderAddress = 'unknown@example.com',
  subject = '(no subject)',
  content,
  date,
}: EmailMockupProps) {
  const displayDate =
    date ||
    new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-sm border-2 border-tinta bg-kertas text-tinta dark:border-kertas-gelap/60 dark:bg-arsip dark:text-kertas-gelap">
      <div className="border-b-2 border-tinta bg-kertas-2 p-4 dark:border-kertas-gelap/40 dark:bg-arsip-2">
        <h2 className="font-display text-xl font-black">{subject}</h2>
      </div>

      <div className="flex items-start justify-between gap-3 p-4">
        <div className="flex gap-3">
          <UserCircle className="h-10 w-10 shrink-0 text-daktil dark:text-kertas-gelap/60" aria-hidden="true" />
          <div className="flex flex-col">
            <p className="flex flex-wrap items-baseline gap-2">
              <span className="text-[15px] font-bold">{senderName}</span>
              <span className="font-mono text-xs text-daktil dark:text-kertas-gelap/60">&lt;{senderAddress}&gt;</span>
            </p>
            <span className="font-mono text-xs text-daktil dark:text-kertas-gelap/60">kepada saya</span>
          </div>
        </div>
        <span className="shrink-0 font-mono text-xs text-daktil dark:text-kertas-gelap/60">{displayDate}</span>
      </div>

      <div className="whitespace-pre-wrap p-6 pt-2 text-sm leading-relaxed">
        {content}
      </div>

      <div className="flex items-center gap-2 border-t border-tinta/20 p-4 font-mono text-xs text-daktil dark:border-kertas-gelap/20 dark:text-kertas-gelap/60">
        <Paperclip className="h-4 w-4" aria-hidden="true" />
        <span>1 lampiran — periksa ekstensi file sebelum dibuka.</span>
      </div>
    </div>
  );
}
