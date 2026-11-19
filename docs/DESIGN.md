# DESIGN.md — Kontrak Arah Desain COPET (LEXiCO)

> Ditulis SEBELUM coding (standar anti-slop P1). Referensi dulu, baru bangun.

## Referensi

**Pemenang: Tipline — template Framer untuk software AML/KYC**
https://www.framer.com/marketplace/templates/tipline/

Kenapa menang: strukturnya adalah meja kerja penyidik, bukan landing
generik — halaman dibuka antrean alert hidup (satu alert dibuka, kartu
risikonya tampil di samping), lalu laporan SAR yang "mengetik sendiri"
dengan mengutip barang bukti. Ketiganya memetakan langsung ke COPET:
antrean alert → daftar kasus kuis Spot the Scam; kartu risiko → mockup
pesan penipu (WhatsApp/email) lengkap dengan stempel; laporan SAR →
Mission Report + sertifikat di akhir kuis. Hero-nya dua kolom (narasi
kiri, bukti hidup kanan), bukan hero tengah + 3 kartu.

Kandidat yang kalah:

- **Fraud Investigation Dashboard — Deriv AI Hackathon (Streamlit)**
  https://storage.googleapis.com/lablab-static-eu/presentations/submissions/sznvcu47118wdi7z6djuuh4a/sznvcu47118wdi7z6djuuh4a-1770483845880_u1upz87a65grd05w9xbl2jna.pdf
  Kalah: dashboard Streamlit gelap tanpa struktur landing yang bisa
  di-clone; yang bisa dipinjam hanya konsep antrean alert — sudah
  tercakup lebih baik oleh Tipline.
- **Dossier Noir — Ravenshore 1947 (itch.io, paket aset game detektif)**
  https://yukiostudios.itch.io/dossier-noir-ravenshore-1947
  Kalah: bukan layout web, melainkan koleksi dokumen/props game; yang
  dipinjam hanya motif stempel dan cap berkas sebagai detail khas.

## Palet (6 warna bernama, tiap warna punya tugas)

| Nama | Hex | Peran |
|---|---|---|
| Kertas Berkas | `#F5F0E6` | Latar utama semua halaman (kertas arsip) |
| Tinta Arsip | `#1B1A17` | Teks utama, border tebal, headline |
| Hijau Laci | `#1E5B40` | Aksi utama (tombol mulai, jawaban benar), status aman |
| Merah Cap | `#B3261E` | Bahaya/penipu, stempel PENIPUAN, jawaban salah |
| Kuning Barang Bukti | `#D97706` | Sorotan, peringatan, timer menipis |
| Abu Daktil | `#6E6A61` | Teks sekunder, label, nomor perkara |

Bukan satu hue: netral kertas/tinta + tiga aksen (hijau, merah, kuning).
Tanpa gradient apa pun; tanpa ungu/biru gradient. Mode gelap ("Arsip
Malam"): latar `#16130F`, permukaan `#221E19`, teks `#EFE9DC` — palet
yang sama, bukan tema Tailwind mentah.

## Tipografi (maks 2 keluarga)

- **Fraunces** — display/headline serif ala headline koran, bobot 600–900.
- **IBM Plex Mono** — label, nomor perkara, angka, tombol kecil (tabular).

## Layout (satu kalimat)

Halaman depan koran berkas perkara: masthead koran di atas, hero dua
kolom (headline kiri, panel barang bukti berisi chat penipu berstempel
kanan), antrean kasus sebagai daftar berkas bernomor, modul pelatihan
sebagai tiga kartu berkas dengan aksen berbeda.

## Detail khas

- **Stempel miring**: cap "PENIPUAN" / "BUKTI" — border ganda merah,
  huruf mono tebal, diputar −6°, menempel di sudut panel barang bukti.
- **Nomor perkara**: setiap kasus/modul membawa nomor mono
  `PERKARA Nº COPET-2026-…` — bukan badge bulat generik.
- **Garis ganda koran**: pemisah section berupa double rule (border
  3px + 1px), bukan divider abu tipis.

## Radius & spacing

Radius 4px di kartu, 2px di chip/label. Border 2px tinta pada kartu
utama, 1px pada permukaan sekunder. Bayangan datar: offset solid 4px
warna tinta (bukan blur lembut) hanya di kartu utama. Grid 8pt;
padding kartu ≥16px.

## Beda dari repo sebelumnya (#37 novel-fliy)

| Sumbu | #37 novel-fliy | #38 lidm-copet |
|---|---|---|
| Palet | Hitam Void / Limau / Magenta | Kertas Berkas / Hijau Laci / Merah Cap |
| Tipografi | Space Grotesk + JetBrains Mono | Fraunces serif + IBM Plex Mono |
| Layout | Kios tiket, rak sampul | Koran berkas perkara, 2 kolom |
| Radius/spacing | 0px, border 2/4px keras | 4px, double-rule koran, bayangan offset |
| Detail khas | Nomor tiket perforasi + struk | Stempel perkara + nomor perkara |

Beda 5/5 sumbu (minimal yang disyaratkan: 3/5).

## Larangan P0 yang dibersihkan dari app lama

- Gradient ungu/biru di hero (`bg-linear-to-br from-indigo-100 via-purple-50
  to-pink-100` di Layout) dihapus — latar jadi Kertas Berkas polos.
- Gradient kartu kosakata (`from-rose-400 to-pink-500`, `from-emerald-400
  to-teal-500`, `from-sky-400 to-indigo-500`, `from-purple-400 to-indigo-500`)
  dihapus — kartu jadi permukaan kertas ber-border tinta dengan aksen
  kategori berupa garis tepi, bukan isi gradient.
- Font Inter/system diganti Fraunces + IBM Plex Mono (Google Fonts).
- Hero tengah + 3 kartu identik di landing diganti hero dua kolom;
  kartu modul dashboard dibedakan (aksen + nomor berkas + isi berbeda).
- Emoji mentah sebagai ikon fungsi (📖 🚨 💬 👨‍✈️ 👩‍🏫 🏆 💡 🎉 ⚠️ 🛡️)
  diganti ikon Lucide satu bobot.
- Statistik vanity tanpa sumber ("235 Juta pengguna", "Rp 476 Miliar",
  "peringkat ke-2 di dunia") diganti angka asli repo: 15 kosakata,
  4 skenario kuis, 7 simpul simulasi, 3 modul.
- "87% Deteksi Berhasil" dan streak "3 HARI" (keduanya hardcode di
  `DashboardView` / `useGameEngine`) diganti akurasi yang dihitung dari
  jawaban sesi berjalan dan streak yang dihitung dari riwayat lokal;
  sebelum ada jawaban, tampil "Belum ada jawaban sesi ini".
- Kelas Tailwind tak valid (`text-slate-350`, `dark:text-indigo-450`,
  `border-gray-750`) dihapus.
- `lang="en"` diganti `lang="id"`; `maximumScale` tidak ada — pastikan
  tetap tidak ada.
- Transisi antar-mode 2 detik (layar loading penuh di `App.tsx`) dipangkas
  menjadi fade 150ms — loading 2 detik di setiap pindah halaman adalah
  cacat UX, bukan fitur.
- `tailwind.config.js` gaya v3 dihapus — Tailwind v4 mengabaikannya
  (termasuk `darkMode: 'class'`, sehingga toggle tema gelap sebelumnya
  tidak memengaruhi utility `dark:` sama sekali); konfigurasi pindah ke
  `@theme` + `@custom-variant dark` di `src/index.css`.
- `@tailwind components; @tailwind utilities;` setelah `@import "tailwindcss"`
  dihapus — bukan sintaks Tailwind v4.
