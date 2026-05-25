# Catatan Redesign Landing Page Katalogi

## V2 — Light Theme + Content Fill

### Perubahan Utama
- Dark theme → Light theme (putih bg, hitam text, solid indigo-600 accent)
- Zero gradient, zero shadow
- Anti-vibecode principles dari sobatti.web.id

### Struktur Halaman
```
Hero → Tentang → Features → Program Kerja → CTA → Footer
```

### Navbar Links
| Link | Target | Section |
|---|---|---|
| Tentang | `#about` | `LandingTentang.tsx` — visi + misi |
| Fitur | `#features` | `LandingFeatures.tsx` — 6 fitur produk |
| Program | `#program` | `LandingProgram.tsx` — 5 program kerja |

### File yang Diubah/Dibuat (10 files)

| File | Perubahan |
|---|---|
| `src/app/globals.css` | Light theme, grid-overlay, float-icon, ring-pulse, scroll reveal |
| `src/app/page.tsx` | White bg, import 2 section baru (Tentang + Program) |
| `src/components/landing/LandingNavbar.tsx` | Tambah Tentang, ganti Showcase→Program, hapus Harga |
| `src/components/landing/LandingHero.tsx` | White bg, ring, floating icons, clamp heading, solid indigo-600 |
| `src/components/landing/LandingTentang.tsx` | **BARU** — Visi (blockquote) + Misi (3 item dengan icon) |
| `src/components/landing/LandingFeatures.tsx` | Light theme cards, border-only, scroll reveal |
| `src/components/landing/LandingProgram.tsx` | **BARU** — 5 program kerja dengan grid 3+2 |
| `src/components/landing/LandingCTA.tsx` | Solid indigo-600, no gradient, no shadow |
| `src/components/landing/LandingFooter.tsx` | White bg, solid indigo-600 logo |
| `CATATAN.md` | Dokumentasi ini |

### Konten Baru

**Visi:** Menjadi penyedia solusi website katalog ternama di kancah global

**Misi:**
1. Membangun brand dan image ke ranah luas
2. Membantu bisnis menata produk secara rapi dan terstruktur
3. Membantu usaha membangun keberlanjutan usaha melalui website dan portofolio

**Program Kerja:**
1. Promosi & Pemasaran — platform media sosial + pameran
2. Pelatihan & Tren — mengikuti trend pasar terbaru
3. Garansi & Support — 1 bulan penuh tanpa biaya
