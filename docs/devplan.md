# 🗺️ RuangKarier — Development Plan (Rencana Pengembangan)

> **Versi:** 2.0 | **Diperbarui:** Mei 2026  
> Dokumen ini adalah panduan tunggal untuk developer kontributor memahami arsitektur, status, dan arah pengembangan RuangKarier.  
> Untuk analisis kompetitor dan detail roadmap lanjutan, lihat [`competitive_analysis_roadmap.md`](./competitive_analysis_roadmap.md).

---

## 🎯 Visi & Positioning

**RuangKarier** adalah platform bimbingan karier digital yang dirancang untuk ekosistem layanan Bimbingan Konseling (BK) di sekolah menengah Indonesia.

**Unique Value Proposition:**  
*Satu-satunya platform yang menggabungkan asesmen RIASEC + CBT restrukturisasi kognitif + PDF portofolio formal + dashboard BK — dalam satu sistem, gratis untuk siswa, terjangkau untuk sekolah.*

**Model Bisnis Target:** B2B Affordable (Sekolah) + B2C Gratis (Siswa)

---

## 🛠️ Stack Teknologi Saat Ini

| Layer | Teknologi | Versi |
|:---|:---|:---|
| **Framework** | Next.js (App Router) | 16.2.6 |
| **UI Runtime** | React | 19.2.4 |
| **Bahasa** | TypeScript | 5.x |
| **Styling** | TailwindCSS v4 + Custom CSS | 4.x |
| **Ikon** | Lucide React | 1.17+ |
| **PDF Engine** | Puppeteer (Headless Chromium) | ^25.1 |
| **Database** | Flat-file JSON (`data/db.json`) | — |
| **Font** | Plus Jakarta Sans, Inter (Google Fonts) | — |

**Stack Target (Fase 7+):** Supabase (PostgreSQL) + Supabase Auth JWT + Vercel + Gemini API

---

## 📐 Arsitektur Sistem Saat Ini

```mermaid
graph TD
    A[Siswa: Landing Page] -->|Mulai / Register / Login| B[Langkah 1: Informed Consent]
    B --> C[Langkah 2: Skrining Hambatan Karier]
    C --> D[Langkah 3: Cek Stres & Alarm Kecemasan]
    D -->|Skor >= 8 atau Butuh Bantuan| D1[AlertModal: Crisis Safety Card]
    D1 -->|Siswa Siap| E[Langkah 4: Kuis Minat RIASEC]
    D -->|Stabil| E
    E -->|Kalkulasi Skor Holland| F[Langkah 5: Jelajah Karier & LKPD CBT]
    F --> G[Langkah 6: Evaluasi UCE & RTL]
    G -->|POST ke API| H[(db.json — Flatfile DB)]

    I[Guru BK: Login /login] -->|passcode: konselor123| J[Dashboard Konselor /counselor]
    J -->|GET /api/counselor/students| H
    J -->|Lihat Portofolio| K[/portfolio/id]

    L[Admin: Login /login] -->|passcode: admin123| M[Dashboard Admin /admin]
    M -->|GET /api/admin/data| H
    M -->|Ekspor| N[JSON / CSV Download]

    K -->|GET /api/portfolio/generate-pdf| O[Puppeteer PDF Engine]
    O -->|Binary Stream| P[Browser Download]
```

---

## 🏁 Status Fase Pengembangan

### ✅ Fase 1 — Fondasi & Sistem Desain (SELESAI)
- [x] Inisialisasi Next.js App Router + TypeScript
- [x] Konfigurasi Google Fonts (Plus Jakarta Sans & Inter)
- [x] Palet warna premium: Navy Blue, Sage Green, Warm Beige, Accent Amber
- [x] Utilitas glassmorphism, hover transitions, layout cetak di `globals.css`
- [x] Shell global: Navbar, Footer, layout.tsx

### ✅ Fase 2 — Landing Page & Komponen Dasar (SELESAI)
- [x] Landing page interaktif (`page.tsx`) dengan hero & card dashboard
- [x] Custom hook `useLocalStorage.ts` (offline-first state)
- [x] Komponen `RiasecChart` (SVG Radar Chart presisi tinggi)
- [x] Komponen `AlertModal` (safety trigger kecemasan)
- [x] Data statis: `riasecQuestions.ts` (30 item), `careerContent.ts` (6 jalur)

### ✅ Fase 3 — Wizard Siswa & Modul RIASEC (SELESAI)
- [x] Stepper 7 langkah di `/student/page.tsx` dengan `<Suspense>` boundary
- [x] Formulir Skrining Hambatan Core Beliefs (S1–S6)
- [x] Safety Trigger deteksi kecemasan real-time
- [x] Mesin hitung RIASEC + ekstraksi Holland Code Top 3
- [x] Modul rekomendasi jalur dengan tag RIASEC + LKPD CBT
- [x] Evaluasi UCE + Rencana Tindak Lanjut (RTL)

### ✅ Fase 4 — Portofolio & Dashboard BK (SELESAI)
- [x] Dynamic routing `/portfolio/[id]/page.tsx` (radar chart + CBT table)
- [x] Print-friendly CSS layout (`@media print`, `.no-print`, `.print-card`)
- [x] Dashboard Guru BK `/counselor` (KPI, Red-Flag feed, datatable)
- [x] WhatsApp BK follow-up integration

### ✅ Fase 5 — Flatfile Database Server-Side (SELESAI)
- [x] `data/db.json` + wrapper `src/lib/flatfileDb.ts`
- [x] API Routes: `/api/student/submit`, `/api/counselor/students`, `/api/counselor/seed`
- [x] Sinkronisasi real-time wizard → database server
- [x] Dashboard BK & Admin terhubung ke API

### ✅ Fase 6a — Admin Dashboard (SELESAI)
- [x] 6 halaman Admin: utama, assessments, career-content, counseling-requests, reports, settings
- [x] Ekspor laporan JSON & CSV
- [x] Pengaturan sistem (nama sekolah, passcode) via `/admin/settings`

### ✅ Fase 6b — Server-Side PDF Generation (SELESAI)
- [x] Migrasi dari `html2canvas-pro` ke Puppeteer headless
- [x] Endpoint `/api/portfolio/generate-pdf` (deviceScaleFactor: 2, print media emulation)
- [x] Dependency cleanup (hapus 30+ library obsolet)
- [x] Build produksi 100% stabil

### ✅ Fase 6c — Login/Register & Auth Multi-Role (SELESAI)
- [x] Halaman `/login` (tab: Siswa / Konselor / Admin)
- [x] Halaman `/register` (daftar akun siswa baru)
- [x] API: `/api/student/auth`, `/api/counselor/auth`
- [x] Navbar diperbarui dengan link Login/Register
- [x] Data dummy 3 siswa terseed di `db.json`

---

## 🔮 Roadmap Pengembangan (Fase 7–10)

> Detail lengkap: [`competitive_analysis_roadmap.md`](./competitive_analysis_roadmap.md)

### 🔵 Fase 7 — Database & Intelligence Layer (2–3 bulan)
**Goal:** Konten karier paling relevan untuk siswa Indonesia

- [ ] **7.1** Migrasi ke Supabase (PostgreSQL + Auth JWT + RLS)
- [ ] **7.2** Database Karier Indonesia (200+ profesi dengan metadata lengkap)
- [ ] **7.3** Database Jurusan & Kampus (150+ jurusan, PTN/PTS/PTKIN/Kedinasan)
- [ ] **7.4** Interlinking: RIASEC Result → Jurusan → Karier → Kampus

### 🟣 Fase 8 — UX Enhancement & Multi-battery Assessment (3–4 bulan)
**Goal:** Pengalaman tes lebih kaya, engagement lebih tinggi

- [ ] **8.1** UI RIASEC one-question-per-screen + sidebar navigator
- [ ] **8.2** Rename Holland Code → Persona Indonesia (Si Kreator, Si Pemimpin, dll.)
- [ ] **8.3** Tambah Tes Gaya Belajar VAK (18 item) + Tes Kepribadian DISC-lite
- [ ] **8.4** Hasil RIASEC lebih kaya + share ke Instagram Stories

### 🟠 Fase 9 — B2B Sekolah Multi-tenant (4–6 bulan)
**Goal:** Platform resmi layanan BK yang bisa dilanggani sekolah

- [ ] **9.1** Arsitektur multi-tenant (workspace terisolasi per sekolah)
- [ ] **9.2** Dashboard Guru BK v2.0 (kode akses, tracking real-time, jadwal konseling)
- [ ] **9.3** Administrasi BK digital (AKPD, SPB, laporan semester)
- [ ] **9.4** Pricing: Gratis (30 siswa) / Sekolah Rp299k/bln / Dinas Custom

### 🔴 Fase 10 — AI & Personalization (6–12 bulan)
**Goal:** Platform karier terpintar di Indonesia

- [ ] **10.1** AI Career Matching (Gemini API + collaborative filtering)
- [ ] **10.2** AI Chatbot BK berbahasa Indonesia
- [ ] **10.3** Portofolio web interaktif + QR Code di PDF
- [ ] **10.4** Gamifikasi, PWA, email digest mingguan

---

## ⚡ Prioritas Sprint Berikutnya

| # | Fitur | Estimasi | Impact |
|:---:|:---|:---:|:---:|
| 🔴 1 | Rename Holland Code → Persona Indonesia | 1 hari | ⭐⭐⭐⭐ |
| 🔴 2 | Supabase setup + migration | 2 minggu | ⭐⭐⭐⭐⭐ |
| 🔴 3 | Database karier 50+ profesi pertama | 1 minggu | ⭐⭐⭐⭐⭐ |
| 🟠 4 | UI RIASEC one-question-per-screen | 3 hari | ⭐⭐⭐⭐ |
| 🟠 5 | Interlinking hasil RIASEC → Karier | 1 minggu | ⭐⭐⭐⭐⭐ |
| 🟡 6 | Tes Gaya Belajar VAK | 3 hari | ⭐⭐⭐ |
| 🟢 7 | B2B multi-tenant architecture | 3 minggu | ⭐⭐⭐⭐⭐ |

---

## 🤝 Panduan Kontributor

### Setup Development

```bash
git clone https://github.com/lightnet19/ruangkarier.git
cd ruangkarier/ruangkarier-app
npm install --legacy-peer-deps
npm run dev
```

### Credential Akses (Development)

| Role | URL | Credential |
|:---|:---|:---|
| Admin | `/login` → tab Admin | passcode: `admin123` |
| Konselor | `/login` → tab Konselor | passcode: `konselor123` |
| Siswa Demo | `/portfolio/mock_ahmad_fauzi` | langsung akses |

### Konvensi Commit

```
feat:     Fitur baru
fix:      Perbaikan bug
docs:     Perubahan dokumentasi
refactor: Refaktorisasi kode
chore:    Konfigurasi/tooling
```

### Dokumen Referensi

| Dokumen | Keterangan |
|:---|:---|
| [`competitive_analysis_roadmap.md`](./competitive_analysis_roadmap.md) | Analisis kompetitor + roadmap detail Fase 7–10 |
| [`RuangKarier_PRD_Final.md`](./RuangKarier_PRD_Final.md) | Product Requirements Document |
| [`devlog.md`](./devlog.md) | Log harian keputusan teknis |
| [`design.md`](./design.md) | Panduan sistem desain visual |
| [`RuangKarier_schema.sql`](./RuangKarier_schema.sql) | Skema database SQL referensi |
