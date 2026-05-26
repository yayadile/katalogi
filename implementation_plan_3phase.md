# Riset Teknologi Wix Editor Mode — Perbandingan dengan Katalogi

Berdasarkan riset mendalam terhadap arsitektur Wix Editor dan analisis lengkap codebase Katalogi, berikut hasilnya:

---

## 🏗️ Arsitektur Wix Editor

### 1. **Tech Stack Wix**
| Komponen | Wix | Katalogi (Saat Ini) |
|---|---|---|
| **Frontend Framework** | React (custom renderer) + Bolt framework | Next.js 16 + React 19 |
| **State Management** | Proprietary (Thunderbolt platform, Santa renderer) | Zustand (single flat store) |
| **Drag & Drop** | Custom engine (absolute positioning, pixel-perfect) | @dnd-kit (sortable vertical list only) |
| **Canvas Rendering** | Stage/viewport dengan virtual DOM isolation | Langsung render DOM di `<div>` biasa |
| **Data Layer** | Document Services API (JSON document model) | Prisma + PostgreSQL (JSON column) |
| **Real-time Save** | Continuous autosave + revision history | Debounced autosave (1.2s) tanpa revisi |
| **Storage** | Cloud-first (Wix Media Manager, CDN) | Supabase Storage |
| **Styling** | CSS-in-JS + design tokens + style presets | Tailwind CSS utilities + inline styles |

### 2. **Fitur Utama Wix Editor Mode**

#### 📐 **Canvas & Viewport System**
- **Wix**: Editor menggunakan **isolated iframe** untuk canvas — konten website dirender dalam iframe terpisah dari editor UI. Ini memisahkan styling editor dari styling website user.
- **Katalogi**: Canvas langsung embedded di DOM yang sama (`CanvasPreview.tsx`) — styling bisa bocor antar editor dan konten.

#### 🎯 **Selection & Manipulation**
- **Wix**: Multi-select, group elements, element hierarchy (parent-child nesting), resize handles (8 titik), rotation, alignment guides (smart guides), snap-to-grid.
- **Katalogi**: Single-select saja (`selectedId`), ada `selectedSubId` tapi belum fully implemented. Tidak ada resize, rotate, atau snap guides.

#### 🧱 **Block/Component System**
- **Wix**: Ribuan komponen (Apps Market), nested components, repeaters, dynamic pages, Velo (custom code), database collections (CMS).
- **Katalogi**: 16 block types flat (HERO, CATALOG, CONTACT, TEXT, dll). Tidak ada nesting — semua block adalah sibling di root level.

#### 📱 **Responsive Design**
- **Wix**: Breakpoint editor (Desktop, Tablet, Mobile) dengan override styling per breakpoint. Mobile editor terpisah.
- **Katalogi**: Toggle Desktop/Mobile preview saja (`previewMode`), tapi styling tidak berubah per breakpoint — hanya ukuran wrapper yang berubah.

#### 🎨 **Design System**
- **Wix**: 
  - Site Theme (global colors, fonts, text presets)
  - Design Presets per component
  - Global CSS custom properties
  - Animation presets (hover, scroll, load)
- **Katalogi**: ThemeConfig sederhana (`primaryColor`, `secondaryColor`, `fontFamily`, `buttonStyle`, `backgroundColor`). Tidak ada animasi editor.

#### 💾 **Data & Save Architecture**
- **Wix**: 
  - **Document Model**: Seluruh website disimpan sebagai JSON document tree besar
  - **Revision History**: Undo/redo unlimited + save versions
  - **Draft/Published**: Dua versi terpisah (draft site vs live site)
  - **Auto-save**: Real-time, setiap perubahan langsung tersimpan ke cloud
- **Katalogi**: 
  - Setiap block disimpan individual ke DB (`PageBlock` table)
  - Tidak ada undo/redo
  - Auto-save debounced 1.2 detik
  - Tidak ada revision history

#### 📦 **Panels & Tooling**
- **Wix**:
  - **Add Panel**: Kategorisasi elements (Text, Image, Button, Strip, Container, etc.)
  - **Pages Panel**: Multi-page management + dynamic pages
  - **Design Panel**: Per-element style customization
  - **Inspector**: Precise position (x, y, w, h), constraints, behaviors
  - **Layers Panel**: Z-order management dengan visibility toggle
  - **Code Panel**: Velo (JavaScript IDE built-in)
- **Katalogi**:
  - **ElementsPanel**: Add elements (Sections + Elements tabs)
  - **BlockNavigator**: Layer list + drag reorder
  - **BlockSettingsPanel**: Properties + Style tabs
  - **ThemeSettings**: Global theme config

---

## 🔍 Gap Analysis: Katalogi vs Wix Editor

### Fitur Kritis yang Belum Ada di Katalogi

| No | Fitur | Prioritas | Kompleksitas |
|---|---|---|---|
| 1 | **Undo/Redo** | 🔴 CRITICAL | Medium |
| 2 | **Inline Text Editing** (klik langsung di canvas untuk edit teks) | 🔴 CRITICAL | High |
| 3 | **Isolated Canvas** (iframe atau shadow DOM) | 🟡 HIGH | High |
| 4 | **Responsive Breakpoints** (style override per device) | 🟡 HIGH | High |
| 5 | **Nested Blocks** (container → children) | 🟡 HIGH | Very High |
| 6 | **Element Resize & Reposition** (drag handles) | 🟠 MEDIUM | Medium |
| 7 | **Animation/Transition System** | 🟠 MEDIUM | Medium |
| 8 | **Multi-page Support** | 🟠 MEDIUM | Medium |
| 9 | **Revision History / Version Control** | 🟠 MEDIUM | Medium |
| 10 | **Keyboard Shortcuts** (Delete, Ctrl+Z, Ctrl+C, dll) | 🟢 LOW | Low |
| 11 | **Right-click Context Menu** | 🟢 LOW | Low |
| 12 | **Duplicate Block** | 🟢 LOW | Low |

---

## 🛠️ Tools & Libraries yang Digunakan Wix (Open Source Equivalents)

| Kebutuhan | Wix Internal | Open Source Equivalent | Cocok untuk Katalogi? |
|---|---|---|---|
| Canvas isolation | Thunderbolt iframe | **iframe** or **Shadow DOM** | ✅ Yes |
| Rich text editing | Ricos Editor | **TipTap** / Lexical / Plate | ✅ Yes (replace dangerouslySetInnerHTML) |
| Drag & resize | Custom engine | **@dnd-kit** + **re-resizable** | ✅ Already using dnd-kit |
| Undo/Redo | Proprietary | **zustand-middleware (temporal)** atau custom command pattern | ✅ Yes |
| Design tokens | Site Theme | **CSS Custom Properties** + Zustand | ✅ Already partial |
| Animation | Internal | **Framer Motion** / CSS animations | ✅ Yes |
| Image editing | Wix Media Manager | Supabase Storage (already using) | ✅ Already done |
| Code editor | Velo (Monaco-based) | **Monaco Editor** / CodeMirror | 🟡 Future |

---

## 📋 Rekomendasi Implementasi Prioritas

### Phase 1 — Editor Foundation (Quick Wins)
1. **Undo/Redo** — Tambahkan `zustand/middleware` temporal atau custom command stack
2. **Keyboard Shortcuts** — Delete selected block, Ctrl+Z/Y, Ctrl+D (duplicate)
3. **Duplicate Block** — Copy block dengan content yang sama
4. **Right-click Context Menu** — Delete, Duplicate, Move Up/Down

### Phase 2 — Content Editing UX
5. **Inline Text Editing** — Integrasikan TipTap/Lexical untuk edit teks langsung di canvas (menggantikan `dangerouslySetInnerHTML`)
6. **Isolated Canvas (iframe)** — Render preview di iframe agar styling tidak bocor
7. **Animation Presets** — Entrance animations (fade, slide, zoom) per block

### Phase 3 — Advanced Layout
8. **Responsive Breakpoints** — Style override per device width
9. **Nested Blocks** — Container blocks yang bisa menampung child blocks
10. **Multi-page Support** — Tambah halaman "Tentang", "Kontak", dll dalam satu website