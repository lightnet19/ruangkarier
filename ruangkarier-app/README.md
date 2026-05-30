# RuangKarier (App Bimbingan Kelompok & Karir Siswa)

[![Next.js Version](https://img.shields.io/badge/Next.js-16.2.6--canary-blue?logo=next.js&style=flat-square)](https://nextjs.org/)
[![React Version](https://img.shields.io/badge/React-19.2.4-green?logo=react&style=flat-square)](https://react.dev/)
[![TailwindCSS Version](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&style=flat-square)](https://tailwindcss.com/)
[![PDF Engine](https://img.shields.io/badge/PDF_Engine-Puppeteer-D14424?logo=puppeteer&style=flat-square)](https://pptr.dev/)

**RuangKarier** adalah portal bimbingan karier mandiri adaptif berbasis kognitif yang dikembangkan untuk siswa sekolah menengah di Indonesia. Aplikasi ini membantu siswa mendiagnosis potensi minat dan tipe kepribadian karier mereka menggunakan kuesioner **RIASEC Holland** (30 item) serta menyusun Rencana Aksi Karir (Action Plan) untuk mengatasi hambatan kognitif.

---

## ✨ Fitur Utama

1. **Dashboard Siswa**: Antarmuka responsif yang menyajikan tes RIASEC Holland, monitoring kecemasan akademik, dan perumusan komitmen bulanan.
2. **RIASEC Holland Diagnosis**: Visualisasi radar chart SVG interaktif yang mengklasifikasikan tiga tipe minat karier teratas siswa (Realistic, Investigative, Artistic, Social, Enterprising, Conventional).
3. **CBT Action Plan**: Formulir adaptif untuk membantu siswa merestrukturisasi keyakinan negatif terkait hambatan karir.
4. **Server-Side PDF Export**: Ekspor portofolio mandiri formal dengan kualitas tinggi (A4, print-optimized background, retina SVG rendering) menggunakan Puppeteer headless.
5. **Dashboard Konselor & Admin**: Panel manajemen siswa BK untuk memonitor hasil pengerjaan, tingkat kecemasan, serta memproses konseling lanjutan.

---

## 🛠️ Stack Teknologi

* **Frontend Framework**: [Next.js 16.2](https://nextjs.org) (App Router, React 19)
* **Styling**: [TailwindCSS v4](https://tailwindcss.com) (dengan dukungan modern CSS & oklch/oklab glassmorphism)
* **Database**: Flat-file database (`data/db.json`) dengan wrapper API robust untuk integrasi masa depan
* **PDF Generator**: [Puppeteer 25.1](https://pptr.dev) (Headless Chromium Server-Side PDF)

---

## 🚀 Panduan Memulai

### Prasyarat
* [Node.js v20.x](https://nodejs.org) atau lebih tinggi
* npm atau yarn

### 1. Kloning & Instalasi Dependensi
```bash
# Jalankan instalasi dependensi dengan opsi peer-dependencies
npm install --legacy-peer-deps
```

### 2. Menjalankan Server Pengembangan
```bash
# Start server lokal (port default: 3000)
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda untuk mengakses aplikasi.

### 3. Build Produksi
```bash
npm run build
npm run start
```

---

## 📂 Struktur Direktori Utama

```text
ruangkarier-app/
├── data/
│   └── db.json                 # Flatfile database pengerjaan siswa & autentikasi
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── portfolio/
│   │   │   │   └── generate-pdf/
│   │   │   │       └── route.ts  # Endpoint server-side PDF generator (Puppeteer)
│   │   │   └── student/
│   │   │       └── submit/
│   │   │           └── route.ts  # Database API retrieval
│   │   ├── portfolio/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Portofolio siswa & unduh action handler
│   │   ├── globals.css         # Global Tailwind & CSS print media query
│   │   └── layout.tsx
│   ├── components/
│   │   └── RiasecChart.tsx     # Komponen Radar Chart SVG interaktif
│   └── lib/
│       └── flatfileDb.ts       # Database helper (load/save/find)
```

---

## 🔐 Konfigurasi Keamanan & Akses

Akses dashboard admin dan konselor diamankan dengan kode sandi khusus berikut (dapat dikonfigurasi melalui `data/db.json`):

* **Akses Admin**:
  * Passcode: `admin123`
* **Akses Konselor (BK)**:
  * Passcode: `konselor123`

---

## 📄 Server-Side PDF Generation (Puppeteer)

Untuk menjamin kualitas ekspor portofolio dan rendering grafik radar chart SVG, aplikasi ini menggunakan generator PDF server-side:

### Mekanisme Kerja:
1. Ketika siswa mengklik **Unduh PDF**, permintaan dikirim ke `/api/portfolio/generate-pdf?id={id_siswa}`.
2. Server Next.js meluncurkan instance headless Chromium (Puppeteer) dengan viewport skala retina (`deviceScaleFactor: 2`).
3. Puppeteer menavigasi ke halaman portofolio siswa, memicu render oklch gradien dan SVG charts.
4. Perangkat emulasi media cetak (`emulateMediaType('print')`) diterapkan untuk mengaktifkan kelas `.no-print` (menyembunyikan panel kontrol, tombol, navigasi).
5. Output PDF dihasilkan dalam layout A4 dengan padding formal, lalu dikirim balik sebagai streaming binary buffer ke browser pengguna untuk segera diunduh.

### Tips Deployment Cloud Serverless:
Untuk memindahkan aplikasi ke Vercel atau Netlify Functions, ganti dependency `puppeteer` menjadi `puppeteer-core` dan pasang `@sparticuz/chromium` guna memintas batas ukuran fungsi serverless (50MB).

---

## 📄 Lisensi
Hak Cipta dilindungi undang-undang. Dikembangkan untuk kemajuan bimbingan karier BK Indonesia.
