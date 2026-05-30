# RuangKarier Web Application Walkthrough

Platform **RuangKarier** telah berhasil dibangun dari model teoretis menjadi aplikasi web interaktif, modern, dan siap produksi berbasis **Next.js (App Router)** dan **Tailwind CSS v4**. Seluruh komponen fungsional telah diimplementasikan dengan kepatuhan penuh terhadap standar tipe data TypeScript, optimasi rendering, serta keselarasan estetika premium (*Navy Blue*, *Sage Green*, *Warm Beige*, *Glassmorphism*, dan *Micro-animations*).

---

## 🛠️ Ringkasan Arsitektur & Teknologi

1. **Inti Framework:** Next.js 16.2.6 (App Router) & React 19.
2. **Sistem Desain:** Tailwind CSS v4 dikonfigurasi melalui `@theme` pada `globals.css` dengan memetakan Google Fonts (*Plus Jakarta Sans* & *Inter*), gradasi warna premium, dan kelas kustom:
   - `.glass-card` (efek kaca ber-blur halus).
   - `.interactive-hover` (animasi mikro transisi skala dan bayangan).
   - `.no-print` & `.print-card` (kontrol layout cetak dokumen resmi).
3. **Penyimpanan State:** Custom hook `useLocalStorage.ts` untuk sinkronisasi state data siswa (profil awal, skrining hambatan, tingkat kecemasan, respons RIASEC, rencana CBT, dan evaluasi) secara otomatis dan bebas-hidrasi di sisi klien.
4. **Library Pendukung:** `lucide-react` untuk visual ikon premium terpadu.

---

## 📦 Peta Halaman & Komponen Utama yang Berhasil Diimplementasikan

### 1. Shell Aplikasi (`src/app/layout.tsx`)
- Mengintegrasikan navigasi global `Navbar` (ber-glassmorphism transparan dan melayang di atas layar) dan `Footer` (memuat ringkasan metodologi BK & alur sistem) secara responsif.
- Mengonfigurasi metadata SEO global yang ramah perayap pencarian.

### 2. Beranda Interaktif (`src/app/page.tsx`)
- Banner Hero dinamis bertemakan "*Career Self-Defense Portal*".
- Dasbor 4 kartu bimbingan mandiri dengan indikator progres langsung berbasis `localStorage` untuk memandu langkah siswa.
- Akses instan bagi Siswa (*Mulai Bimbingan*) dan Guru BK (*Dasbor BK*).

### 3. Stepper Perjalanan Siswa (`src/app/student/page.tsx`)
Wizard 6 langkah komprehensif terbungkus dalam batas `<Suspense>` agar aman untuk prerendering Next.js:
- **Langkah 1 (Informed Consent):** Form profil pribadi (Nama, Kelas dropdown), slider keyakinan karier awal (1-10), esai kendala kecemasan terbesar, usaha nyata yang telah dilakukan, serta checkbox persetujuan sukarela (Consent).
- **Langkah 2 (Skrining Hambatan):** Tabel evaluasi 8 pernyataan hambatan internal dan eksternal dengan radio button skala keyakinan 0-4.
- **Langkah 3 (Cek Kecemasan Real-Time):** Deteksi tingkat tekanan akademik dan kecemasan masa depan pasca-kelulusan menggunakan slider visual (1-10).
  - *🛡️ Fitur Pengaman Adaptif:* Jika skor kecemasan awal &ge; 8 atau siswa menekan tombol "Ya" membutuhkan bantuan segera, modal krisis terintegrasi (`AlertModal`) akan dipicu secara otomatis. Modal menyajikan kartu penenang taktis dan tautan WhatsApp BK sebelum memperkenankan siswa melanjutkan tes.
- **Langkah 4 (Kuis RIASEC Holland):** 30 butir pernyataan aktivitas karier (skala ketertarikan 1-5). Sistem secara otomatis menghitung skor total kumulatif per dimensi (R, I, A, S, E, C) dan merumuskan **3 Huruf Kode Holland Utama (Top 3)**.
- **Langkah 5 (Jelajah Karier & LKPD CBT):**
  - *Modul Sinkronisasi Cerdas:* Menyaring 6 jalur pendidikan kelulusan (PTN, PTS, PTKIN, Kedinasan, Kerja, Wirausaha). Jalur yang paling selaras dengan huruf pertama kode Holland siswa ditandai dengan ikon bintang khusus ⭐. Detail kurikulum, syarat masuk, dan tips sukses BK disajikan secara interaktif.
  - *LKPD Restrukturisasi Kognitif CBT:* Siswa membedah pikiran otomatis yang mencemaskan melalui 5 pertanyaan berurutan (Pikiran Negatif &rarr; Bukti Pendukung &rarr; Fakta Penyeimbang &rarr; Sudut Pandang Sahabat &rarr; Pola Pikir Baru), memilih 3 komitmen aksi nyata, serta menuliskan 3 rencana aksi bulanan secara spesifik.
- **Langkah 6 (Evaluasi Akhir UCE):** Refleksi akhir menggunakan 3 kriteria UCE (*Understanding*, *Comfort*, *Action*), evaluasi tingkat kecemasan pasca-bimbingan, dan pengiriman portofolio langsung ke dasbor guru BK.

### 4. Portofolio Cetak Siswa (`src/app/portfolio/[id]/page.tsx`)
- Kompilasi seluruh rekam jejak bimbingan siswa ke dalam bentuk dokumen resmi/arsip sekolah yang sangat rapi.
- Visualisasi Diagram Radar RIASEC berbasis SVG dinamis yang digambar secara presisi berdasarkan skor asli masing-masing dimensi.
- Bar aksi atas yang adaptif (hanya terlihat di layar) dengan tombol **Cetak / Ekspor PDF** terintegrasi langsung dengan perintah cetak browser (`window.print()`).
- Tampilan cetak formal dilengkapi dengan Kop Surat BK (*KOP Sekolah*), layout data grid teratur, dan kolom tanda tangan siswa serta konselor di bagian bawah halaman.

### 5. Dasbor Analitik Guru BK (`src/app/counselor/page.tsx`)
- **Panel Statistik Utama (KPI):** Menyajikan total siswa aktif, jumlah kasus tindak lanjut prioritas (Red-Flags), rata-rata kecemasan awal vs kecemasan akhir (membuktikan efektivitas CBT), serta persentase penyelesaian LKPD.
- **Feed Live Alert (Tindak Lanjut Prioritas):** Siswa dengan tingkat cemas tinggi atau yang meminta bantuan mendesak akan langsung masuk ke daftar kartu berkategori merah di bagian atas dasbor. Dilengkapi tombol **Follow-up WhatsApp** yang secara otomatis memformulasikan pesan chat BK yang hangat, profesional, dan empatik untuk dikirimkan langsung ke siswa via WhatsApp Web.
- **Database Rekaman Pengerjaan:** Data grid tabular lengkap yang memuat nama siswa, kelas, kecocokan tipe Holland, progres penurunan kecemasan, target impian, dan tombol langsung ke portofolio detail siswa.
- **BK Mock Data Seeder:** Dilengkapi tombol **Simulasi Data BK** yang secara otomatis menginjeksi 3 profil siswa BK tiruan yang sangat realistis (lengkap dengan data riwayat kecemasan tinggi, grafik radar RIASEC, dan restrukturisasi kognitif). Fitur ini membuat dasbor langsung hidup dan interaktif saat pertama kali diuji tanpa harus mengulang tes siswa secara manual!

---

## 🔍 Hasil Uji Validasi & Kompilasi

Perintah kompilasi produksi Next.js (`npm run build`) telah dijalankan dan memberikan hasil **Sukses Penuh (100% Bebas Error)**:

```bash
✓ Compiled successfully in 3.4s
  Running TypeScript ...
  Finished TypeScript in 3.7s ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (5/5) ...
  Finalizing page optimization ...

Route (app)
70: ┌ ○ /
71: ├ ○ /_not-found
72: ├ ○ /counselor
73: ├ ƒ /portfolio/[id]
74: └ ○ /student

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

Exit code: 0
```

---

## 🏃 Cara Menjalankan & Menguji Aplikasi

Aplikasi saat ini telah **aktif berjalan secara lokal** pada port default Next.js. Anda dapat langsung membukanya di browser melalui URL berikut:

- **Halaman Utama (Beranda):** [http://localhost:3000](http://localhost:3000)
- **Halaman Stepper Bimbingan Siswa:** [http://localhost:3000/student](http://localhost:3000/student)
- **Halaman Dasbor Analitis Guru BK:** [http://localhost:3000/counselor](http://localhost:3000/counselor)

### 💡 Tips Alur Pengujian Cepat:
1. Buka halaman **Dasbor Guru BK** (`/counselor`), kemudian klik tombol **`Simulasi Data BK`** di kanan atas.
   - *Dasbor akan langsung terisi dengan 3 data profil siswa yang sangat komprehensif, menampilkan visual radar minat Holland, data perbandingan kecemasan pasca-bimbingan, dan indikator alarm tindak lanjut (Red-Flag) lengkap dengan integrasi pesan WhatsApp BK!*
2. Dari baris data siswa di database dasbor tersebut, ketuk tombol **`Lihat Portofolio`**. Anda akan diarahkan ke halaman portofolio siswa yang rapi dan siap cetak. Silakan coba klik tombol **`Cetak / Ekspor PDF`** untuk melihat pratinjau lembar BK resmi.
3. Kembali ke **Beranda** (`/`), ketuk **`Mulai Bimbingan Mandiri`** untuk merasakan langsung alur stepper perjalanan siswa dari awal hingga akhir, termasuk menguji modal keselamatan adaptif jika Anda menyetel tingkat kecemasan di angka &ge; 8.
