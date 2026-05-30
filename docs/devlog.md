# 📝 RuangKarier - Development Log (Catatan Harian Pengembang)

Berkas ini mencatat peristiwa penting, perbaikan *bug*, serta keputusan teknis utama selama proses perancangan dan implementasi aplikasi RuangKarier.

---

## 🪵 Kronologi Log Pengembang

### [2026-05-30] - Penerapan Vercel Production Deployment & Pembaruan Dokumentasi
- **Aktivitas:** Melakukan perilisan versi live aplikasi RuangKarier ke platform Vercel dan memperbarui dokumentasi.
- **Implementasi & Perubahan:**
  1. **Deployment Vercel:** Berhasil menghubungkan repositori GitHub ke platform Vercel dan melakukan deploy web aplikasi pada domain resmi: [ruangkarier.vercel.app](https://ruangkarier.vercel.app/).
  2. **Pembaruan `README.md`:** 
     - Menambahkan lencana status deployment Vercel resmi.
     - Memperbarui demo link langsung yang mengarah ke tautan Vercel.
     - Menyematkan tautan akses produksi untuk Administrator, Konselor, dan Siswa pada bagian kredensial akses di README.
  3. **Integrasi Flatfile Database di Vercel:** Platform Next.js API Routes berhasil dieksekusi secara serverless dan merespons data in-memory/flatfile db dari basis berkas statis `db.json` dengan performa optimal.

### [2026-05-30] - Update Passcode Kredensial Admin & Konselor BK
- **Aktivitas:** Mengubah kode sandi default untuk akses administrator dan konselor/Guru BK di seluruh sistem.
- **Implementasi & Perubahan:**
  1. **Konfigurasi `data/db.json`:** Memperbarui field `adminSettings.passcode` menjadi `admin123` dan `counselorSettings.passcode` menjadi `konselor123` untuk akses data langsung.
  2. **Inisialisasi `src/lib/flatfileDb.ts`:** Mengubah nilai default pembuatan database (fallback inisialisasi awal) agar menggunakan `admin123` dan `konselor123`.
  3. **Fallback Rute API (`src/app/api/admin/*`):** Menyesuaikan konstanta fallback sandi admin dari `ADMIN2026` menjadi `admin123` pada file API auth, data, dan reports demi konsistensi sistem.
  4. **Verifikasi Build:** Menjalankan kompilasi produksi `cmd /c npm run build` dan berhasil 100% tanpa error (Exit Code: 0).

### [2026-05-30] - Resolving "Maximum Update Depth Exceeded" in Student Wizard
- **Aktivitas:** Memperbaiki rendering loop ("Maximum update depth exceeded") ketika pengguna mengklik link navigasi "Bimbingan Siswa" (`/student`).
- **Masalah:** 
  1. Komponen `StudentWizardInner` memicu pembaruan state di dalam `useEffect` saat mount tanpa dependensi stabil, diperparah dengan fungsi `setValue` pada hook kustom `useLocalStorage` yang berubah di setiap siklus rendering.
- **Implementasi & Perubahan:**
  1. **Custom Hook `useLocalStorage.ts`:** Menggunakan `useCallback` dan pembaruan state fungsional (`prevState => ...`) untuk menstabilkan referensi fungsi `setValue` dan mencegah eksekusi ulang side-effect yang tidak perlu.
  2. **Student Page (`src/app/student/page.tsx`):** Memindahkan generator inisialisasi respons RIASEC langsung ke fungsi inisialisasi `useState` daripada menggunakan kombinasi `useEffect` + `setRiasecResponses`, memutus total rantai render loop.
  3. **Verifikasi Stabilitas Admin & Publik:** Melakukan verifikasi navigasi penuh menggunakan browser otomatis pada sub-halaman `/admin/*` (Assessments, Career Content, Counseling Requests, Reports, Settings) dan `/student`, semuanya berjalan lancar dan super stabil.
  4. **Kompilasi Sukses:** Perintah kompilasi produksi `npm run build` berhasil dikompilasi 100% tanpa kesalahan tipe TypeScript maupun *warning* kompilasi.

### [2026-05-30] - Perbaikan Bug Loop Auth Admin Dashboard
- **Aktivitas:** Mengatasi issue rendering loop ("Maximum update depth exceeded") pada Admin Layout saat melakukan inisialisasi auto-login.
- **Implementasi & Perubahan:**
  1. **Admin Layout (`src/app/admin/layout.tsx`):**
     - Menyuntikkan `React.useRef(false)` (`hasValidated`) untuk mengunci eksekusi `useEffect` auto-login agar berjalan **tepat satu kali** pada saat mount pertama.
     - Menambahkan filter pengaman `isAuthorized` di dalam `useEffect` agar proses autentikasi otomatis tidak diulang jika admin sudah terverifikasi masuk.
     - Memperbarui array dependensi `useEffect` dengan menyertakan `isAuthorized` secara aman guna memenuhi kriteria build Next.js.
  2. **Validasi Produksi & Stabilitas:**
     - Berhasil menjalankan kompilasi produksi `npm run build` dengan status sukses penuh tanpa peringatan atau error.
     - Menguji kestabilan antarmuka admin menggunakan peramban otomatis: log masuk dengan sandi benar/salah, navigasi ke 6 halaman dashboard BK, dan logout berjalan sangat mulus tanpa error re-render.
- **Keputusan Teknis:**
  - Penggunaan `useRef` sebagai *guard flag* adalah standar industri React untuk mengatasi eksekusi ganda side-effect inisialisasi (terutama di React 18+ Strict Mode dan HMR), menjamin perlindungan mutlak dari looping pembaruan state secara rekursif.

### [2026-05-30] - Implementasi Admin Dashboard (Fase 6 — Manajemen Sistem)
- **Aktivitas:** Membangun Admin Dashboard lengkap di `/admin` dengan sistem autentikasi, analitik terpusat, manajemen data siswa, pratinjau konten karier, manajemen permintaan konseling, dan ekspor laporan.
- **Implementasi & Perubahan:**
  1. **Skema Database (`src/lib/flatfileDb.ts`):** Menambahkan field `adminSettings` (passcode + updatedAt) ke `DbSchema` dan `defaultData` agar kompatibel secara backward dengan `db.json` lama.
  2. **db.json:** Menyuntikkan blok `adminSettings` dengan *default passcode* `ADMIN2026` ke data live.
  3. **API Backend — Admin Authentication (`/api/admin/auth`):**
     - `POST`: Memvalidasi passcode admin terhadap `db.json`.
     - `PATCH`: Memperbarui passcode admin dengan verifikasi *passcode lama*.
  4. **API Backend — Admin Data (`/api/admin/data`):**
     - `GET`: Mengembalikan statistik agregat (KPI), daftar lengkap siswa, daftar permintaan konseling, dan pengaturan sistem.
     - `DELETE`: Menghapus data satu siswa (by ID) atau seluruh siswa.
     - `PATCH`: Memperbarui nama sekolah dan passcode Guru BK.
  5. **API Backend — Admin Reports (`/api/admin/reports`):** Mengekspor data dalam format `JSON` (download langsung) atau `CSV` (kompatibel Excel/Sheets).
  6. **Admin Layout (`src/app/admin/layout.tsx`):** Membangun layout terpisah dari publik — sidebar navigasi premium (dark mode), autentikasi *gate* via session storage, *mobile hamburger menu*, dan sistem logout.
  7. **6 Halaman Admin:**
     - `/admin` — Dashboard utama: KPI cards, visualisasi reduksi kecemasan, distribusi RIASEC, menu cepat, dan pratinjau permintaan konseling terbaru.
     - `/admin/assessments` — Tabel data siswa lengkap: sortable, filterable by red flag/status, aksi hapus & lihat portofolio.
     - `/admin/career-content` — Pratinjau 6 konten jalur karier (dari `careerContent.ts`) dalam tampilan kartu premium dengan RIASEC tags.
     - `/admin/counseling-requests` — Daftar RTL siswa dengan detektor red flag, delta kecemasan, catatan diskusi, dan link portofolio.
     - `/admin/reports` — Ringkasan analitik dan tombol ekspor JSON/CSV.
     - `/admin/settings` — Form edit nama sekolah, passcode BK, dan ganti passcode Admin.
  8. **Uji Kompilasi:** Build produksi berhasil dengan `✓ Compiled successfully` — 0 error TypeScript pada 18 rute.
- **Keputusan Teknis:**
  - Autentikasi Admin menggunakan `sessionStorage` (bukan cookie) untuk menyederhanakan prototipe. Passcode dikirim via `x-admin-passcode` header atau query param.
  - Admin Layout adalah *separate Next.js layout* sehingga tidak mempengaruhi navbar/footer publik.
  - Konten karier pada admin hanya *read-only preview* (statis), dengan catatan bahwa migrasi ke CRUD database dapat dilakukan di fase produksi.

### [2026-05-30] - Integrasi Logo Resmi (Final) & Ikon Aplikasi RuangKarier
- **Aktivitas:** Mengintegrasikan aset identitas visual resmi `Logo Ruang Karier (Final).png` dan `Icon Ruang Karier.png` ke seluruh antarmuka web app dan metadata sistem.
- **Implementasi & Perubahan:**
  1. **Penyimpanan Aset Publik:** Menyalin berkas logo dan ikon ke direktori `/public` dan direktori internal source `/src/app` agar dapat dilayani oleh server Next.js secara optimal.
  2. **Metadata & Favicon Global (`src/app/layout.tsx`):** Menambahkan konfigurasi metadata ikon global (`/icon.png`) untuk penayangan favicon resmi pada peramban.
  3. **Branding Navigasi (`src/components/Navbar.tsx`):** Mengganti ikon fallback GraduationCap pada navigasi header dan teks "RK" pada footer dengan kontainer gambar responsif yang menggunakan berkas ikon resmi (`/icon.png`).
  4. **Branding Dokumen Portofolio BK (`src/app/portfolio/[id]/page.tsx`):** Meningkatkan estetika Kop Surat Sekolah BK pada portofolio cetak dengan mengganti ikon generik menjadi ikon resmi RuangKarier.
  5. **Branding Hero Landing Page (`src/app/page.tsx`):** Menambahkan visualisasi resolusi tinggi berkas logo utama (`/logo.png`) langsung pada bagian pembuka Hero Section.
  6. **Uji Kompilasi:** Melakukan verifikasi produksi (`npm run build`) dan berhasil dikompilasi dengan sukses penuh 100%.

### [2026-05-30] - Finalisasi Migrasi Flatfile Database & Sinkronisasi API Real-Time
- **Aktivitas:** Mengintegrasikan sistem database flatfile server-side (`data/db.json`) dengan antarmuka siswa (Wizard), dasbor Guru BK (Counselor), dan halaman Portofolio, diikuti dengan pengujian kompilasi produksi.
- **Implementasi & Perubahan:**
  1. **Flatfile Database Utility (`src/lib/flatfileDb.ts`):** Melakukan manajemen pembacaan dan penulisan berkas JSON secara atomik dan aman dengan penanganan eror berkas.
  2. **API Route Terpadu (`src/app/api/`):**
     - `/api/student/submit`: Endpoint asinkron untuk menyimpan atau mengembalikan draf pengerjaan siswa.
     - `/api/counselor/students`: Endpoint terproteksi sandi akses BK untuk menarik, menghapus, atau mengosongkan riwayat data siswa.
     - `/api/counselor/seed`: Endpoint simulasi data BK untuk penyuntikan 3 contoh data profil siswa secara instan.
  3. **Sinkronisasi Antarmuka Siswa & Dasbor BK:**
     - **Siswa (`student/page.tsx`):** Mengirimkan data pengerjaan per langkah secara live ke database server serta menyimpan fallback lokal.
     - **Konselor (`counselor/page.tsx`):** Menampilkan widget analitik KPI (penurunan cemas, radar RIASEC, tingkat penyelesaian) langsung dari database server secara real-time.
     - **Portofolio (`portfolio/[id]/page.tsx`):** Mendukung pemuatan data dinamis langsung dari server secara persisten.
  4. **Validasi Produksi:** Berhasil memverifikasi kompilasi Next.js (`npm run build`) dengan status sukses penuh (Exit Code: 0).

### [2026-05-30] - Penyusunan Master PRD Final
- **Aktivitas:** Menyusun dokumen acuan utama `RuangKarier_PRD_Final.md` di folder `/docs` dan melakukan sinkronisasi akhir dengan GitHub.
- **Implementasi & Perubahan:**
  1. **Dokumen Master PRD (`docs/RuangKarier_PRD_Final.md`):** Menggabungkan konsep teoretis, sitemap, skema database SQL, integrasi Supabase, dan petunjuk ekspor PDF ke dalam dokumen referensi tunggal (*Single Source of Truth*).
  2. **Sinkronisasi Repositori:** Memastikan seluruh dokumen di dalam `/docs` ter-commit dan di-push ke GitHub (`lightnet19/ruangkarier`).

### [2026-05-30] - Restrukturisasi Direktori Dokumen & Sinkronisasi GitHub
- **Aktivitas:** Mengorganisasi seluruh dokumen eksternal ke dalam subfolder `/docs`, menyalin dokumen blueprint esensial, dan melakukan sinkronisasi dengan GitHub.
- **Implementasi & Perubahan:**
  1. **Restrukturisasi Direktori (`/docs`):** Memindahkan semua file dokumentasi (.md, .docx, .sql, .json, .png, .jpeg) dari root direktori ke `/docs` agar folder proyek tetap bersih dan modular.
  2. **Penyalinan Blueprint Penting:** Menyertakan `implementation_plan.md` (Rencana Aksi Sistem Desain dan Arsitektur) dan `walkthrough_results.md` (Catatan hasil kompilasi produksi dan petunjuk uji coba cepat) ke dalam folder `/docs`.
  3. **Konfigurasi & Push Git:** Mengatur identitas pengarang Git lokal (`lightnet19`) dan melakukan commit serta push sukses ke cabang `main` di GitHub. Repositori dan direktori lokal kini berstatus 100% bersih (*clean*).

### [2026-05-30] - Finalisasi Fitur & Uji Kompilasi Produksi
- **Aktivitas:** Mengonfigurasi antarmuka cetak, membenahi kompatibilitas Turbopack, dan menuntaskan tipe data TypeScript.
- **Bug Yang Diatasi:**
  1. **Strict CSS Import Order (`globals.css`):**
     * *Masalah:* Compiler Tailwind CSS v4 mendeteksi bahwa impor `@import` font eksternal (Google Fonts) diletakkan di bawah direktif `@import "tailwindcss"`, menyebabkan peringatan pembatasan build.
     * *Solusi:* Menyusun ulang impor agar Google Fonts dimuat terlebih dahulu sebelum Tailwind di bagian paling atas berkas `globals.css`.
  2. **Typo Tag Penutup JSX (`RiasecChart.tsx`):**
     * *Masalah:* Terjadi kegagalan parsing JSX di baris 126 karena sintaksis `))` alih-alih `)}` saat menutup pemetaan kondisional untuk `<polygon>` area skor RIASEC.
     * *Solusi:* Mengubah penutup sintaksis menjadi `)}` secara tepat.
  3. **Strict Type SVG textAnchor (`RiasecChart.tsx`):**
     * *Masalah:* TypeScript menolak kompilasi karena properti `textAnchor` pada tag `<text>` menerima variabel string bebas (`let textAnchor = 'middle'`), sedangkan React mendefinisikan tipe kaku `"end" | "inherit" | "middle" | "start" | undefined`.
     * *Solusi:* Memberikan deklarasi serikat literal secara eksplisit: `let textAnchor: 'middle' | 'start' | 'end' = 'middle';`.
  4. **Next.js CSR Suspense Prerendering Bailout (`student/page.tsx`):**
     * *Masalah:* Next.js 16 compiler gagal melakukan prerendering statis halaman `/student` dengan pesan error: `useSearchParams() should be wrapped in a suspense boundary`.
     * *Solusi:* Melakukan refaktorisasi internal. Mengubah komponen utama menjadi `StudentWizardInner` dan mengekspor pembungkus `StudentWizard` berbatas `<Suspense>` dengan visualizer spinner penunggu (*loading fallback*).
- **Hasil:** Perintah `npm run build` sukses 100% dengan kode keluar `0`.

### [2026-05-29] - Dasbor BK, Seeder Simulasi & Sistem Evaluasi UCE
- **Aktivitas:** Membangun dasbor analitis untuk guru BK, mengimplementasikan checklist rencana tindak lanjut, dan mendesain fungsi mock seeder.
- **Implementasi Fitur:**
  1. **Dasbor BK (`/counselor`):** Layout grid menampilkan widget KPI persentase penurunan cemas pasca-CBT, feed kartu cemas prioritas berkode warna merah (*Red-Flags*), dan datatable pengerjaan siswa.
  2. **Simulasi Data BK (Mock Seeder):** Memprogram generator data otomatis yang menyuntikkan 3 profil siswa BK tiruan (Fajar, Syafira, dan Budi) dengan data holistik yang kaya (skor kecemasan awal, 30 butir respons RIASEC, visual radar chart, serta esai restrukturisasi kognitif CBT).
  3. **Integrasi WhatsApp Web:** Membangun perumus pesan empatik ramah-BK yang dapat dikirimkan langsung ke nomor ponsel siswa yang cemas melalui integrasi API WhatsApp Web.

### [2026-05-28] - RIASEC Holland & Lembar Kerja CBT
- **Aktivitas:** Mengonfigurasi data 30 pernyataan RIASEC, menghitung 3 kode minat bakat dominan, menyusun jalur kelulusan bertagging RIASEC, serta mendesain tabel CBT kognitif.
- **Implementasi Fitur:**
  1. **Algoritma RIASEC:** Mengalokasikan 30 butir soal ke dalam dimensi R, I, A, S, E, C. Skor dihitung secara real-time untuk menyusun Holland Code (misalnya: *SEC*, *RIA*).
  2. **LKPD Restrukturisasi Kognitif:** Menyusun instrumen BK intervensi CBT (Pikiran Otomatis Negatif, Bukti Pendukung, Bukti Penyeimbang, Sudut Pandang Alternatif, Pikiran Baru yang Sehat) guna mengikis kecemasan akademik pasca-kelulusan.
  3. **Rekomendasi Jalur Cerdas:** Menandai jalur pendidikan dengan lambang bintang ⭐ jika memiliki keterkaitan erat dengan kode utama kepribadian Holland siswa.

### [2026-05-27] - Inisiasi Proyek & Informed Consent
- **Aktivitas:** Pembuatan struktur folder proyek Next.js, perancangan form profil siswa awal, dan lembar persetujuan eksplorasi (*Informed Consent*).
- **Implementasi Fitur:**
  1. **Lembar Consent:** Mengunci tombol mulai bimbingan sebelum siswa menyetujui jaminan kerahasiaan BK sekolah.
  2. **Hook useLocalStorage:** Membangun utility hook sisi klien untuk mengamankan data pengerjaan dari kehilangan akibat refresh halaman tak sengaja.
