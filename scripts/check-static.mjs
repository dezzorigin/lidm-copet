// check-static.mjs — gate anti-slop P0 + penjaga restructure + link preview,
// dipakai `npm run validate` dan job `static-checks` di CI:
//   1. Tanpa gradient ungu/biru, tanpa headline gradient, tanpa font Inter /
//      Roboto, tanpa rounded-2xl/3xl + shadow-lg/2xl di UI, tanpa emoji mentah
//      sebagai ikon fungsi, tanpa statistik vanity palsu peninggalan app lama.
//   2. Tanpa sisa restructure: folder COPET2-main/ di tree; tanpa file .env
//      yang ter-commit; tanpa secret kasar.
//   3. Link preview (og-preview.md): index.html wajib memuat SEMUA tag
//      og:/twitter: dan public/og-image.png wajib ada.
// Keluar 1 bila ada satu saja temuan.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const fail = (msg) => failures.push(msg);

const SRC_FILES = [];
const walk = (dir) => {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (!['node_modules', '.git', 'dist', 'test-results', 'playwright-report', 'docs'].includes(e.name)) walk(p);
    } else if (/\.(tsx?|css|mjs|js|json|html)$/.test(e.name) && !e.name.endsWith('.lock')) {
      SRC_FILES.push(p);
    }
  }
};
walk(join(ROOT, 'src'));
walk(join(ROOT, 'public'));
walk(join(ROOT, 'scripts'));
walk(join(ROOT, 'e2e'));
SRC_FILES.push(join(ROOT, 'package.json'));
SRC_FILES.push(join(ROOT, 'index.html'));
// Checker dikecualikan dari scan sendiri: pola-pola P0 di file ini adalah
// data aturan, bukan UI.
const CHECKER = join(ROOT, 'scripts', 'check-static.mjs');
const SCANNED = SRC_FILES.filter((f) => f !== CHECKER);

const P0_CHECKS = [
  [/linear-gradient\([^)]*(violet|purple|indigo|blue|#6366f1|#818cf8|#7d2ae8|#00c4cc)/i, 'gradient ungu/biru'],
  [/bg-clip-text/, 'headline gradient (bg-clip-text)'],
  [/\bfont-family:[^;]*\bInter\b/, 'font Inter'],
  [/\bfont-family:[^;]*\bRoboto\b/, 'font Roboto'],
  [/rounded-2xl|rounded-3xl|rounded-4xl/, 'rounded-2xl/3xl/4xl (radius template)'],
  [/shadow-lg|shadow-2xl/, 'shadow-lg/2xl di permukaan'],
  [/from-(violet|purple|indigo|blue|fuchsia|rose|sky|emerald|teal)-\d+/, 'gradient Tailwind (from-…-…)'],
  [/bg-linear-to-(br|tr|tl|r|b)/, 'gradient linear Tailwind (bg-linear-to-…)'],
  [/235 Juta|476 Miliar|peringkat ke-2/, 'statistik vanity tanpa sumber (app lama)'],
  [/87% Deteksi|3 HARI|streakCount.*=.*3/, 'angka hardcode palsu (app lama)'],
  [/maximumScale:\s*1/, 'viewport maximumScale: 1 (melarang zoom)'],
];

for (const f of SCANNED) {
  const raw = readFileSync(f, 'utf-8');
  // Strip komentar (blok + baris penuh) sebelum cek: komentar boleh
  // MENYEBUT angka lama sebagai dokumentasi, bukan menampilkannya.
  const src = raw
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .filter((l) => !l.trim().startsWith('//'))
    .join('\n');
  for (const [re, label] of P0_CHECKS) {
    if (re.test(src)) fail(`${f.replace(ROOT + '/', '')}: ${label}`);
  }
  // Emoji mentah sebagai ikon fungsi (bukan di komentar/dok).
  // Data kuis/kosakata/simulasi adalah konten edukasi — emoji di sana
  // juga dilarang: semua string tampil di UI.
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(src)) {
    fail(`${f.replace(ROOT + '/', '')}: emoji mentah di kode UI`);
  }
}

// Sisa restructure: subfolder lama tidak boleh ada di tree.
if (existsSync(join(ROOT, 'COPET2-main'))) fail('COPET2-main/ masih ada — restructure belum bersih');
// Secret kasar di file yang ter-commit.
for (const f of SCANNED) {
  const src = readFileSync(f, 'utf-8');
  if (/(api[_-]?key|secret|password)\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}['"]/i.test(src)) {
    fail(`${f.replace(ROOT + '/', '')}: kemungkinan secret ter-commit`);
  }
}
if (existsSync(join(ROOT, '.env'))) fail('.env ter-commit');

// Link preview (og-preview.md): semua tag wajib ada di index.html.
const html = readFileSync(join(ROOT, 'index.html'), 'utf-8');
const OG_TAGS = [
  'og:title', 'og:description', 'og:type', 'og:url', 'og:image',
  'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image',
];
for (const tag of OG_TAGS) {
  if (!html.includes(tag)) fail(`index.html: tag ${tag} tidak ada (og-preview.md)`);
}
if (!html.includes('https://lidm-copet.pages.dev/og-image.png')) {
  fail('index.html: og:image bukan URL absolut lidm-copet.pages.dev/og-image.png');
}
const ogImage = join(ROOT, 'public', 'og-image.png');
if (!existsSync(ogImage)) fail('public/og-image.png tidak ada (og-preview.md)');
else if (statSync(ogImage).size < 10_000) fail('public/og-image.png terlalu kecil — curiga bukan screenshot 1200x630');

if (failures.length > 0) {
  console.error('check-static GAGAL:');
  for (const m of failures) console.error(` - ${m}`);
  process.exit(1);
}
console.log('check-static OK');
