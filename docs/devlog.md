# 📝 RuangKarier - Development Log (Catatan Harian Pengembang)

Berkas ini mencatat peristiwa penting, perbaikan *bug*, serta keputusan teknis utama selama proses perancangan dan implementasi aplikasi RuangKarier.

---

## 🪵 Kronologi Log Pengembang

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
