<div align="center">

# 🎓 RuangKarier

**Portal Bimbingan Karier Mandiri Adaptif Berbasis Kognitif (CBT + RIASEC Holland)**

*Untuk siswa SMA/SMK/MA Indonesia yang sedang mempersiapkan masa depan karier mereka*

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?logo=next.js&style=flat-square)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react&style=flat-square)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&style=flat-square)](https://tailwindcss.com/)
[![Puppeteer](https://img.shields.io/badge/PDF_Engine-Puppeteer_25.1-D14424?logo=googlechrome&style=flat-square)](https://pptr.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&style=flat-square)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/Lisensi-Hak_Cipta_Dilindungi-red?style=flat-square)](#)

</div>

---

## 📖 Tentang Proyek

**RuangKarier** adalah aplikasi web bimbingan karier mandiri yang dirancang untuk mendukung layanan **Bimbingan Konseling (BK)** di sekolah menengah. Siswa menjalani serangkaian instrumen kognitif-karier secara terstruktur: dari informed consent, skrining hambatan, tes minat RIASEC Holland, perencanaan aksi CBT, hingga evaluasi akhir — semua dalam satu sesi terpandu.

Guru BK dan Admin dapat memonitor, menganalitik, dan mengekspor hasilnya secara real-time melalui dashboard terpisah yang dilindungi passcode.

---

## ✨ Fitur Lengkap

### 👨‍🎓 Untuk Siswa
| Fitur | Deskripsi |
|---|---|
| **Registrasi & Login** | Daftar akun baru atau masuk dengan Student ID yang sudah ada |
| **Informed Consent** | Lembar persetujuan kerahasiaan data BK sebelum memulai sesi |
| **Skrining Hambatan Karier** | 6 item skrining hambatan kognitif (S1–S6) berbasis Core Beliefs |
| **Monitoring Kecemasan** | Pengukuran tingkat stres akademik & kecemasan kelulusan (0–10) |
| **Tes RIASEC Holland** | Kuesioner 30 item untuk menentukan 3 tipe minat karier dominan |
| **Radar Chart SVG** | Visualisasi interaktif hasil RIASEC dalam bentuk spider/radar chart |
| **CBT Action Plan** | Lembar kerja restrukturisasi kognitif: pikiran negatif → keyakinan baru |
| **Komitmen Bulanan** | Daftar komitmen aksi nyata dan rencana tindak lanjut |
| **Evaluasi Akhir** | Pengukuran perubahan kecemasan pasca-sesi (skor delta) |
| **Portofolio PDF** | Ekspor dokumen portofolio mandiri A4 berkualitas tinggi (server-side) |

### 👩‍🏫 Untuk Guru BK / Konselor
| Fitur | Deskripsi |
|---|---|
| **Dashboard Analitik** | Widget KPI: rata-rata penurunan kecemasan, distribusi Holland Code, tingkat penyelesaian |
| **Red Flag Detector** | Deteksi otomatis siswa dengan kecemasan kritis yang butuh perhatian segera |
| **Datatable Siswa** | Daftar lengkap pengerjaan siswa dengan filter, delta kecemasan, dan link portofolio |
| **Notifikasi WhatsApp** | Kirim pesan empatik langsung ke siswa melalui WhatsApp Web API |
| **Hapus Data** | Kelola dan bersihkan riwayat pengerjaan siswa dari panel konselor |

### 🔧 Untuk Admin
| Fitur | Deskripsi |
|---|---|
| **Dashboard Admin** | KPI terpusat, statistik agregat seluruh siswa, dan pratinjau permintaan konseling |
| **Manajemen Siswa** | Sortable/filterable datatable, hapus data individual atau massal |
| **Pratinjau Konten Karier** | 6 jalur karier dengan RIASEC tags dari bank konten statis |
| **Laporan & Ekspor** | Unduh data dalam format JSON atau CSV (kompatibel Excel/Google Sheets) |
| **Pengaturan Sistem** | Ubah nama sekolah, passcode konselor, dan passcode admin |

---

## 🗺️ Peta Rute Aplikasi (Sitemap)

```
/                          → Landing page publik
├── /login                 → Login siswa, admin, & konselor (multi-role tab)
├── /register              → Registrasi akun siswa baru
│
├── /student               → Wizard bimbingan siswa (7 langkah)
│   └── Step 1: Consent | Step 2: Profil | Step 3: Skrining | Step 4: Kecemasan
│       Step 5: RIASEC | Step 6: Action Plan | Step 7: Evaluasi
│
├── /portfolio/[id]        → Portofolio mandiri siswa (printable)
│
├── /counselor             → Dashboard Guru BK (passcode-protected)
│
└── /admin                 → Dashboard Admin (passcode-protected)
    ├── /admin/assessments
    ├── /admin/career-content
    ├── /admin/counseling-requests
    ├── /admin/reports
    └── /admin/settings
```

---

## 🛠️ Stack Teknologi

| Lapisan | Teknologi | Versi |
|---|---|---|
| **Framework** | [Next.js](https://nextjs.org) (App Router) | 16.2.6 |
| **UI Library** | [React](https://react.dev) | 19.2.4 |
| **Bahasa** | [TypeScript](https://www.typescriptlang.org) | 5.x |
| **Styling** | [TailwindCSS v4](https://tailwindcss.com) + Custom CSS | ^4.0 |
| **Ikon** | [Lucide React](https://lucide.dev) | ^1.17 |
| **PDF Engine** | [Puppeteer](https://pptr.dev) (Headless Chromium) | ^25.1 |
| **Database** | Flat-file JSON (`data/db.json`) | — |
| **Font** | Inter + Plus Jakarta Sans (Google Fonts) | — |

---

## 🚀 Panduan Memulai

### Prasyarat
- [Node.js v20.x](https://nodejs.org) atau lebih tinggi
- npm v10.x

### 1. Clone Repositori
```bash
git clone https://github.com/lightnet19/ruangkarier.git
cd ruangkarier/ruangkarier-app
```

### 2. Instalasi Dependensi
```bash
npm install --legacy-peer-deps
```

### 3. Jalankan Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### 4. Build Produksi
```bash
npm run build
npm run start
```

---

## 📂 Struktur Direktori

```
ruangkarier/
├── docs/                              # Dokumentasi proyek
│   ├── devlog.md                      # Catatan harian pengembang
│   ├── RuangKarier_PRD_Final.md       # Product Requirements Document
│   └── ...
│
└── ruangkarier-app/                   # Kode sumber Next.js
    ├── data/
    │   └── db.json                    # Flatfile database (siswa, admin, konselor)
    ├── public/
    │   ├── logo.png                   # Logo resmi RuangKarier
    │   └── icon.png                   # Ikon aplikasi / favicon
    ├── src/
    │   ├── app/
    │   │   ├── api/
    │   │   │   ├── admin/             # Auth, data, reports (admin)
    │   │   │   ├── counselor/         # Auth, students, seed (konselor)
    │   │   │   ├── portfolio/
    │   │   │   │   └── generate-pdf/  # ⭐ Server-side PDF (Puppeteer)
    │   │   │   └── student/           # Auth, submit (siswa)
    │   │   ├── admin/                 # Halaman-halaman Admin Dashboard
    │   │   ├── counselor/             # Halaman Counselor Dashboard
    │   │   ├── login/                 # Halaman Login (multi-role)
    │   │   ├── portfolio/[id]/        # Halaman Portofolio Siswa
    │   │   ├── register/              # Halaman Registrasi Siswa
    │   │   ├── student/               # Wizard Bimbingan Siswa
    │   │   ├── globals.css            # Design tokens, print CSS, glassmorphism
    │   │   └── layout.tsx             # Root layout + metadata
    │   ├── components/
    │   │   ├── Navbar.tsx             # Navigasi publik + link login/register
    │   │   └── RiasecChart.tsx        # Radar Chart SVG interaktif
    │   ├── data/
    │   │   ├── riasecQuestions.ts     # 30 pertanyaan RIASEC + deskripsi Holland
    │   │   └── careerContent.ts       # Bank konten jalur karier
    │   ├── hooks/
    │   │   └── useLocalStorage.ts     # Hook utilitas persisrensi data lokal
    │   └── lib/
    │       └── flatfileDb.ts          # DB helper: read/write/find/getAll
    ├── next.config.ts
    ├── package.json
    └── README.md
```

---

## 🔐 Akses & Kredensial

> **Catatan:** Passcode dapat diubah melalui `/admin/settings` atau langsung di `data/db.json`.

| Role | URL Masuk | Kredensial |
|---|---|---|
| **Siswa** | `/login` → tab Siswa | Student ID + Nama Lengkap |
| **Konselor / Guru BK** | `/login` → tab Konselor | Passcode: `konselor123` |
| **Admin** | `/login` → tab Admin | Passcode: `admin123` |

### Data Demo Tersedia
Gunakan ID berikut untuk menjelajahi portofolio langsung tanpa perlu mengisi wizard:

| Nama Siswa | Student ID | Kelas |
|---|---|---|
| Ahmad Fauzi | `mock_ahmad_fauzi` | XII-MIPA-1 |
| Siti Rahayu | `mock_siti_rahayu` | XII-IPS-2 |
| Budi Santoso | `mock_budi_santoso` | XII-MIPA-3 |

---

## 📄 Server-Side PDF Generation

Portofolio siswa diekspor sebagai PDF berkualitas tinggi menggunakan **Puppeteer (Headless Chromium)** yang berjalan di sisi server.

### Alur Kerja
```
Siswa klik "Unduh PDF"
  → GET /api/portfolio/generate-pdf?id={student_id}
    → Puppeteer launch Headless Chromium
      → Navigate ke /portfolio/{id}
        → emulateMediaType('print') — sembunyikan navbar/tombol
          → pdf({ format: 'A4', printBackground: true, deviceScaleFactor: 2 })
            → Return binary stream → Auto-download di browser
```

### Keunggulan vs Client-Side
| Aspek | Client-Side (html2canvas) | Server-Side (Puppeteer) ✅ |
|---|---|---|
| SVG Radar Chart | ❌ Sering blank/pixelated | ✅ Sempurna, vektor tajam |
| CSS Gradien/Glassmorphism | ❌ Warna hilang | ✅ Dipertahankan penuh |
| Font kustom | ❌ Fallback ke default | ✅ Google Fonts termuat |
| Ukuran bundle klien | ❌ +500KB library | ✅ Zero client overhead |
| Kontrol layout | ❌ Terbatas | ✅ CSS `@media print` penuh |

### Catatan Deployment Serverless
Untuk Vercel / Netlify Functions, ganti `puppeteer` → `puppeteer-core` + `@sparticuz/chromium`:
```bash
npm uninstall puppeteer
npm install puppeteer-core @sparticuz/chromium
```
```typescript
// route.ts
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath(),
  headless: chromium.headless,
});
```

---

## 🗄️ Database (Flat-File)

Aplikasi menggunakan file JSON sebagai database sementara. Skema utama `data/db.json`:

```json
{
  "submissions": [ /* Array data pengerjaan siswa */ ],
  "counselorSettings": { "passcode": "konselor123" },
  "adminSettings": { "passcode": "admin123", "schoolName": "..." }
}
```

**API Routes tersedia:**
| Endpoint | Method | Fungsi |
|---|---|---|
| `/api/student/submit` | GET / POST | Ambil atau simpan data siswa |
| `/api/student/auth` | POST | Login siswa (ID + nama) |
| `/api/counselor/auth` | POST | Login konselor |
| `/api/counselor/students` | GET / DELETE | Kelola data siswa (BK) |
| `/api/counselor/seed` | POST | Inject data dummy |
| `/api/admin/auth` | POST / PATCH | Login & ganti passcode admin |
| `/api/admin/data` | GET / DELETE / PATCH | Data + pengaturan sistem |
| `/api/admin/reports` | GET | Ekspor JSON / CSV |
| `/api/portfolio/generate-pdf` | GET | Generate PDF server-side |

---

## 🧪 Pengujian Cepat

1. Buka [http://localhost:3000](http://localhost:3000)
2. Klik **"Mulai Bimbingan"** atau **"Daftar"** untuk membuat sesi siswa baru
3. Lengkapi semua 7 langkah wizard
4. Di halaman portofolio, klik **"Unduh PDF"** — file akan terunduh otomatis
5. Untuk melihat dashboard Admin: klik **"Masuk"** → tab Admin → passcode `admin123`
6. Untuk melihat dashboard BK: klik **"Masuk"** → tab Konselor → passcode `konselor123`

---

## 📋 Rencana Pengembangan (Roadmap)

- [x] Fase 1: Inisiasi proyek & Informed Consent
- [x] Fase 2: Instrumen RIASEC Holland & CBT LKPD
- [x] Fase 3: Dashboard BK, Mock Seeder & Evaluasi
- [x] Fase 4: Kompilasi produksi & perbaikan bug rendering
- [x] Fase 5: Flatfile database, sinkronisasi API real-time
- [x] Fase 6a: Admin Dashboard lengkap (6 halaman)
- [x] Fase 6b: Server-Side PDF generation (Puppeteer)
- [x] Fase 6c: Halaman Login/Register & Auth API multi-role
- [ ] Fase 7: Migrasi ke Supabase (PostgreSQL + Auth)
- [ ] Fase 8: Notifikasi email otomatis & integrasi kalender konseling

---

## 📝 Lisensi

Hak Cipta © 2026 — RuangKarier. Dikembangkan untuk kemajuan layanan Bimbingan Konseling di Indonesia.  
Seluruh kode sumber dilindungi. Penggunaan untuk keperluan pendidikan dan penelitian diperbolehkan dengan atribusi.
