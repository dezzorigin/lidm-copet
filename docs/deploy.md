# Deploy — COPET

## 1. Cloudflare Pages

| Item | Nilai |
|---|---|
| Proyek | `lidm-copet` |
| URL live | https://lidm-copet.pages.dev |
| Build | Vite statis — output `dist/` |
| Akun Cloudflare | 4518bdd3ad5cab1d1f7cd6715fd1e6c6 |

Deploy memakai helper `~/workspace/github-actions/cf_pages.py`:

```bash
python3 ~/workspace/github-actions/cf_pages.py create-project lidm-copet
# bila 404 sesaat setelah create: retry setelah ~20 detik (bukan error nama)
python3 ~/workspace/github-actions/cf_pages.py deploy lidm-copet ~/workspace/lidm-copet/dist
```

Nama "lidm-copet" didapat bersih (tanpa sufiks). Fallback yang
disiapkan (tidak terpakai): `lidmcopet` → `copet`.

Setelah live, pasang URL di About repo via PATCH homepage dan
verifikasi homepage terpasang.

## 2. Verifikasi live (sebelum merge)

```bash
# 1. Halaman utama
curl -s -o /tmp/live.html -w "%{http_code}\n" https://lidm-copet.pages.dev/
# 2. Semua tag link preview ada
grep -o "og:[a-z]*\|twitter:[a-z]*" /tmp/live.html | sort -u
#    harus ada: og:title og:description og:type og:url og:image
#               twitter:card twitter:title twitter:description twitter:image
# 3. og:image hidup + bertipe gambar + 1200x630
curl -sI https://lidm-copet.pages.dev/og-image.png
#    HTTP 200 + content-type: image/png
python3 -c "from PIL import Image; print(Image.open('og-image.png').size)"
# 4. Favicon + bundle
curl -s -o /dev/null -w "%{http_code}\n" https://lidm-copet.pages.dev/favicon.svg
```

Catatan cache: setelah deploy, peramban bisa menampilkan versi lama
— verifikasi dengan hard-refresh (Ctrl+Shift+R) atau mode incognito.

## 3. Link preview (og-preview.md)

Tag-tag ini ada di template sumber `index.html` (bukan edit hasil
build — untuk SPA, tag harus ada di `index.html` hasil build):

```html
<meta property="og:title" content="COPET — Kenali pesannya sebelum uangmu hilang." />
<meta property="og:description" content="..." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://lidm-copet.pages.dev/" />
<meta property="og:image" content="https://lidm-copet.pages.dev/og-image.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="https://lidm-copet.pages.dev/og-image.png" />
```

`og-image.png` adalah **screenshot asli landing** (1200x630),
dibuat ulang oleh `npm run screenshots` dari build terbaru — bukan
gambar AI/generik, bukan URL eksternal. Bila nama Pages berubah,
URL absolut di `index.html` WAJIB diupdate.

Checklist sebelum merge (og-preview.md):
- [ ] curl URL live → grep ketemu semua tag og:/twitter:
- [ ] curl URL og:image → 200 + content-type image
- [ ] gambar 1200x630

## 4. CI

`.github/workflows/ci.yml` (Node 24): job `build` (typecheck + lint +
validate + vite build), `advisory-sweep` (OSV batch), `playwright-e2e`
(Chromium di-install di CI saja), `smoke`. Merge hanya bila semua
job hijau.
