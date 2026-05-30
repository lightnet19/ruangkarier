# 🗺️ Rencana Implementasi (Implementation Plan) — RuangKarier Web App

RuangKarier akan dibangun sebagai aplikasi web interaktif berbasis **Next.js (App Router)**, **React 19**, dan **Tailwind CSS v4**. Untuk menghadirkan purwarupa MVP (*Minimum Viable Product*) yang dapat langsung berfungsi penuh tanpa dependensi eksternal yang rumit, kita akan menerapkan **State Management & Local Database berbasis LocalStorage** yang mensinkronisasi data antara alur siswa dengan Dasbor Guru BK secara real-time.

---

## 🎨 1. Fondasi Sistem Desain (Design System)

Kami akan menerapkan panduan estetika dari `docs/design.md` untuk menciptakan antarmuka premium:
*   **Warna Kunci (Tailwind v4 Config / CSS Variables):**
    *   `primary`: `#1B2A4A` (Navy Blue — Profesional, stabil)
    *   `secondary`: `#7BA08A` (Sage Green — Tumbuh, tenang)
    *   `accent`: `#F5A623` (Warm Amber — Optimisme, safety trigger)
    *   `background`: `#FAF6F1` (Warm Beige — Safe space, nyaman di mata)
    *   `surface`: `#FFFFFF` (White — Kartu & modal)
    *   `text-dark`: `#2D3748` (Dark Slate — Kontras tinggi)
    *   `muted`: `#94A3B8` (Cool Gray — Teks sekunder)
*   **Tipografi:**
    *   Mengintegrasikan `Plus Jakarta Sans` untuk Headings (H1, H2, H3) dan `Inter` untuk elemen UI & body copy melalui Google Fonts.
*   **Aset Visual:**
    *   Penggunaan ikon modern melalui `lucide-react` untuk merepresentasikan komponen visual yang canggih.
    *   Elemen glassmorphism yang halus (`backdrop-blur-md bg-white/75 border border-white/20`) pada navigasi dan dialog.

---

## 📂 2. Struktur Arsitektur File & Direktori

Kita akan merancang folder aplikasi di bawah `src/` dengan struktur modular berikut:

```plaintext
src/
├── app/
│   ├── layout.tsx            # Root layout dengan font, meta tag, & background
│   ├── page.tsx              # Landing page interaktif (Pintu masuk utama)
│   ├── globals.css           # Integrasi Tailwind CSS v4, Font, & tema warna
│   ├── student/
│   │   └── page.tsx          # Alur Eksplorasi Siswa (Consent -> Screening -> RIASEC -> LKPD -> UCE)
│   ├── counselor/
│   │   └── page.tsx          # Dasbor Guru BK (Live Activity, Red-Flag Alerts, & Portfolio Viewer)
│   └── portfolio/
│       └── [id]/
│           └── page.tsx      # Tampilan Portfolio Siswa (Siap cetak/simpan PDF)
├── components/
│   ├── AlertModal.tsx        # Modal Peringatan Kecemasan Tinggi (Safety Card)
│   ├── RiasecChart.tsx       # Diagram Radar SVG murni untuk visualisasi RIASEC
│   ├── Navbar.tsx            # Sticky glassmorphism navigation
│   └── Footer.tsx            # Footer minimalis yang hangat
├── hooks/
│   └── useLocalStorage.ts    # Custom hook untuk sinkronisasi state
50: └── data/
│     ├── riasecQuestions.ts    # Kumpulan 30 item pernyataan RIASEC
│     └── careerContent.ts      # Data informasi multi-jalur (PTN/PTS/Kedinasan/dll)
```

---

## 🔄 3. Alur Pengguna (User Journey Flow)

### 3.1. Landing Page (`/`)
*   Hero section premium dengan visualisasi optimis (Gen-Z friendly).
*   **Dashboard 4 Card Utama** dengan ikon interaktif dan indikator kemajuan (progress bar).
*   Tombol Call to Action (CTA) besar untuk berpindah ke modul bimbingan siswa (`/student`) atau masuk ke portal konselor (`/counselor`).

### 3.2. Alur Siswa / Student Journey (`/student`)
Siswa akan dipandu melalui antarmuka **Wizard Stepper** interaktif untuk menjaga fokus (satu langkah per layar):
1.  **Langkah 1: Informed Consent (Keluhan Awal)**
    *   Form profil singkat (Nama, Kelas, Jurusan).
    *   Skala keyakinan awal (1-10 slider) & kendala terbesar yang dicemaskan.
    *   Checkbox persetujuan sukarela.
2.  **Langkah 2: Screening Hambatan Karier**
    *   Tabel interaktif berisi 8 butir hambatan internal/eksternal dengan skor 0–4.
3.  **Langkah 3: Reaksi Otomatis & Cek Kecemasan (Safety Trigger)**
    *   3 pertanyaan cek tekanan akademik dan kecemasan real-time.
    *   **Logika Pemicu Peringatan (Safety Trigger):**
        *   Jika *Anxiety Score* $\ge 8$ ATAU Siswa memilih *Ya* (Butuh Bantuan Segera), **Safety Card (Alert Modal)** akan langsung muncul dengan desain Amber/Soft Yellow yang hangat.
        *   Menyediakan tombol langsung ke WhatsApp Guru BK (simulasi) dan opsi kelanjutan kuis jika siswa merasa lebih tenang.
        *   Mendaftarkan status *Red Flag* siswa tersebut ke database konselor.
4.  **Langkah 4: RIASEC Assessment (Kuis Minat)**
    *   30 butir pertanyaan terbagi menjadi 6 dimensi (R, I, A, S, E, C) berskala 1-5.
    *   Menghitung skor secara native dan menghasilkan 3 kode Holland teratas.
    *   Menampilkan **Radar Chart SVG murni** yang interaktif & penjelasan kepribadian yang membesarkan hati.
5.  **Langkah 5: Ruang Aksi (LKPD Digital - Restrukturisasi Kognitif CBT)**
    *   Form input interaktif untuk merancang karir impian, memeriksa pikiran negatif, mencari bukti penyeimbang, merancang sudut pandang alternatif, dan menetapkan keyakinan baru.
    *   Checklist tindakan adaptif (minimal memilih 3 komitmen) dan menuliskan 3 aksi bulanan terbesar.
6.  **Langkah 6: Evaluasi Layanan (UCE - Understanding, Comfort, Action)**
    *   Refleksi akhir mengenai tingkat ketenangan setelah bimbingan.
    *   Skala kecemasan pasca-bimbingan (untuk dibandingkan dengan kecemasan awal).
    *   Satu hal krusial yang ingin dibahas tatap muka dengan konselor.
    *   Tombol **"KIRIM PORTOFOLIO KE GURU BK"** yang mengunci data ke LocalStorage dan membuka halaman portofolio mandiri.

---

## 📊 4. Dasbor Guru BK / Counselor Dashboard (`/counselor`)

Guru BK memiliki akses penuh ke sistem manajemen terpusat dengan fitur-fitur berikut:
1.  **Statistik & KPI Dashboard:**
    *   Jumlah siswa aktif, rata-rata kecemasan awal vs akhir, persentase penyelesaian, dan jumlah kasus peringatan merah (*Red Flags*).
2.  **Red-Flag Notification Feed:**
    *   Siswa dengan tingkat kecemasan tinggi ($\ge 8$) atau yang menekan tombol darurat akan langsung muncul di baris teratas dengan latar belakang Amber/Soft Red yang berkedip lembut, disertai detail kontak WhatsApp.
3.  **Daftar Siswa & Portofolio:**
    *   Tabel terstruktur berisi seluruh rekap siswa yang telah berpartisipasi.
    *   Tombol untuk membuka halaman **Portofolio Siswa** yang diformat dengan tata letak profesional siap cetak/simpan sebagai PDF (`/portfolio/[id]`).

---

## ⚡ 5. Rencana Aksi Pembuatan Kode (Coding Action Plan)

*   **Step 1:** Menyetel file `globals.css` dengan mendefinisikan palet warna *Navy Blue*, *Sage Green*, *Warm Beige*, serta font `Plus Jakarta Sans` & `Inter`.
*   **Step 2:** Membuat data statis kuis RIASEC (`riasecQuestions.ts`) dan informasi jalur pendidikan (`careerContent.ts`).
*   **Step 3:** Membuat custom hook `useLocalStorage.ts` untuk mengelola state data siswa secara persisten.
*   **Step 4:** Membuat komponen visual utama: `AlertModal.tsx` dan `RiasecChart.tsx` (Radar Chart SVG murni).
*   **Step 5:** Mengembangkan antarmuka interaktif halaman utama (`page.tsx`) dengan desain premium.
*   **Step 6:** Membangun wizard stepper lengkap di `/student/page.tsx` yang mencakup 6 komponen instrumen digital.
*   **Step 7:** Mengembangkan portal analitik guru BK di `/counselor/page.tsx`.
*   **Step 8:** Merancang visualisasi laporan portofolio cetak di `/portfolio/[id]/page.tsx` agar terlihat seperti dokumen BK profesional saat disimpan sebagai PDF.
