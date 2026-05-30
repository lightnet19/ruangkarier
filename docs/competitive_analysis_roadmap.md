# 🗺️ RuangKarier — Perencanaan Pengembangan Lanjutan
> Disusun berdasarkan analisis kompetitor mendalam (Mei 2026)

---

## 📊 Analisis Kompetitor

### Platform yang Dianalisis

| Platform | Model Bisnis | Segmen | Fokus Utama |
|:---|:---:|:---:|:---|
| **AkuPintar** (akupintar.id) | B2C Freemium + B2B | SD–SMA | RIASEC, DISC, VAK, Multiple Intelligence, Konseling Mobile |
| **Quipper Campus** (campus.quipper.com) | B2C Freemium | SMA | Tes Minat Bakat, Database Jurusan+Karier+Kampus terintegrasi |
| **Zenius** (zenius.ux9.in) | B2C Freemium | SMA | Tes Minat Bakat legacy, Bimbel UTBK |
| **BTW Edutech** (btwedutech.com) | B2B Sekolah | SMA/SMK | IST, MBTI, Holland, RMIB — dengan Proctoring & Dashboard BK |
| **Karierku** (karierku.id) | B2B Sekolah | SMA | RIASEC + Rekomendasi Kampus + Konsultasi Online |
| **BK Digital Jatidiri** (jatidiri.app) | B2B Sekolah | SMA | Manajemen BK, Monitoring Real-Time, Jurnal Harian |
| **Satu Persen** (satupersen.net) | B2C | SMA–Dewasa | Tes Karier RIASEC, Psikologi, Self-Development |
| **Kampus Impian** | Blog/Agregator | SMA | Informasi SNBT, KIP Kuliah |

---

## 🔬 Temuan Kunci dari Eksplorasi Langsung

### AkuPintar — Benchmark Utama
**Kelebihan yang perlu diadopsi:**
- ✅ **Multi-battery assessment**: RIASEC ("Peta Arah Minat") + DISC ("Dinamika Interaksi") + VAK (Gaya Belajar) + Multiple Intelligence — dalam satu ekosistem
- ✅ **UI kuesioner fokus**: Satu pertanyaan per layar, sidebar navigasi soal dengan kode warna (Biru=selesai, Oranye=aktif, Abu-abu=belum)
- ✅ **Naming yang membumi**: Holland Code diterjemahkan jadi bahasa yang relatable — *"Sang Eksekutor", "Sang Penyelidik", "Sang Kreator"*
- ✅ **Database karier 1000+** dengan label permintaan pasar kerja (*"Permintaan Sangat Tinggi"*)
- ✅ **Database kampus** dengan filter: Negeri/Swasta, D3/D4/S1, Akreditasi, Wilayah

**Gap/Kelemahan:**
- ❌ Konseling hanya di mobile app, tidak web-app
- ❌ Tidak ada PDF portfolio
- ❌ Tidak ada CBT-specific tools untuk hambatan kognitif

### Quipper Campus — Benchmark UX
**Kelebihan:**
- ✅ **Interlinking sempurna**: Jurusan → Karier → Kampus, semua terkoneksi dua arah
- ✅ Halaman detail jurusan dengan 6 tab (*Informasi, Keahlian, Keunggulan, Perkuliahan, Karier, Kampus*)
- ✅ UI premium, polish tinggi

**Gap:**
- ❌ Tidak ada CBT/BK tools
- ❌ Tidak ada dashboard untuk guru BK/konselor

### BTW Edutech — Model B2B yang Mature
**Kelebihan:**
- ✅ **Proctoring** kamera saat siswa mengerjakan tes
- ✅ **Dashboard BK**: kode akses, kuota, daftar siswa, unduh hasil
- ✅ Tes berstandar psikologi formal (IST, MBTI, Holland, RMIB)

**Gap:**
- ❌ Berbayar (tidak ada versi gratis siswa mandiri)
- ❌ Tidak ada PDF otomatis portofolio
- ❌ Tidak ada CBT tools

### BK Jatidiri — Closest Competitor untuk B2B BK
**Kelebihan:**
- ✅ Manajemen administrasi BK lengkap
- ✅ Monitoring real-time perkembangan siswa
- ✅ Jurnal harian siswa

**Gap:**
- ❌ Tidak ada tes RIASEC terintegrasi
- ❌ Tidak ada rekomendasi karier
- ❌ Tidak ada PDF portfolio

---

## 🎯 Matriks Diferensiasi RuangKarier

| Fitur | RuangKarier | AkuPintar | Quipper | BTW | Jatidiri |
|:---|:---:|:---:|:---:|:---:|:---:|
| Tes RIASEC | ✅ | ✅ | ✅ | ✅ | ❌ |
| CBT Action Plan (LKPD) | ✅ | ❌ | ❌ | ❌ | ❌ |
| PDF Portofolio Otomatis | ✅ | ❌ | ❌ | ❌ | ❌ |
| Dashboard Guru BK | ✅ | ✅ | ❌ | ✅ | ✅ |
| Multi-battery assessment | ❌ | ✅ | ❌ | ✅ | ❌ |
| Database Karier 1000+ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Database Jurusan/Kampus | ❌ | ✅ | ✅ | ❌ | ❌ |
| B2B Sekolah (Multi-tenant) | ❌ | ✅ | ❌ | ✅ | ✅ |
| Konseling Online | ❌ | ✅ | ❌ | ❌ | ✅ |
| Safety Alert Kecemasan | ✅ | ❌ | ❌ | ❌ | ❌ |
| Administrasi BK (AKPD) | ❌ | ❌ | ❌ | ❌ | ✅ |

> **Unique Value Proposition RuangKarier:**  
> *Satu-satunya platform yang menggabungkan asesmen RIASEC + CBT restrukturisasi kognitif + PDF portofolio formal + dashboard BK dalam satu sistem terintegrasi — dirancang khusus untuk ekosistem layanan BK di sekolah Indonesia.*

---

## 🚀 Roadmap Pengembangan (Fase 7–10)

---

### FASE 7 — Database & Intelligence Layer
**Target: 2–3 bulan**  
**Goal: Menjadi platform dengan konten karier paling relevan untuk siswa Indonesia**

#### 7.1 Migrasi ke Supabase (PostgreSQL)
- [ ] Setup Supabase project + schema migration dari `db.json`
- [ ] Auth JWT berbasis Supabase Auth (ganti passcode dengan akun resmi)
- [ ] Row Level Security (RLS) per sekolah/role
- [ ] Realtime subscriptions untuk dashboard BK

#### 7.2 Database Karier Indonesia
- [ ] Kurate **200+ profesi** dengan metadata lengkap:
  - Nama profesi + deskripsi
  - Holland Code yang relevan (misalnya: "Dokter" → ISR)
  - Rata-rata gaji Indonesia (range IDR)
  - Tingkat permintaan pasar (Sangat Tinggi / Tinggi / Sedang / Menurun)
  - Tren pekerjaan 5–10 tahun ke depan
  - Kompetensi utama yang dibutuhkan
- [ ] Filter & search: by Holland Code, industri, gaji, permintaan pasar
- [ ] Tampilan kartu karier dengan badge permintaan pasar (seperti AkuPintar)

#### 7.3 Database Jurusan & Kampus
- [ ] Kurate **150+ jurusan** populer dengan:
  - Nama + deskripsi jurusan
  - Holland Code relevan
  - Mata kuliah unggulan
  - Prospek karier (linked ke database 7.2)
  - Akreditasi BAN-PT
- [ ] Integrasi data kampus: PTN, PTS, PTKIN, Kedinasan
- [ ] Filter kampus: Tipe, Akreditasi, Wilayah, Jalur Masuk (SNBT/Mandiri)
- [ ] **Interlinking Quipper-style**: RIASEC Result → Jurusan → Karier → Kampus

---

### FASE 8 — UX Enhancement & Multi-battery Assessment
**Target: 3–4 bulan**  
**Goal: Pengalaman tes yang lebih kaya dan engagement lebih tinggi**

#### 8.1 Upgrade UI Wizard Tes RIASEC
- [ ] **One-question-per-screen mode** (seperti AkuPintar): satu soal per tampilan penuh
- [ ] **Sidebar progress navigator**: panel soal dengan kode warna (✅ selesai / 🟠 aktif / ⬜ belum)
- [ ] Animasi transisi antar soal (smooth slide)
- [ ] Simpan progres otomatis (resume tes jika koneksi terputus)

#### 8.2 Rename Holland Code ke Bahasa Relatable
- [ ] Terjemahkan 6 tipe Holland menjadi persona yang menarik bagi siswa Indonesia:
  | Kode | Nama Persona | Tagline |
  |:---:|:---|:---|
  | R | **Si Penjelajah** | *"Tanganmu adalah senjatamu"* |
  | I | **Si Pemikir** | *"Selalu ada pertanyaan baru"* |
  | A | **Si Kreator** | *"Ekspresi adalah hidupmu"* |
  | S | **Si Penghubung** | *"Orang lain adalah energimu"* |
  | E | **Si Pemimpin** | *"Kamu lahir untuk memimpin"* |
  | C | **Si Pengatur** | *"Keteraturan adalah kekuatanmu"* |

#### 8.3 Tambah Tes Multi-battery
- [ ] **Tes Gaya Belajar (VAK)**: Visual, Auditory, Kinesthetic — 18 item
- [ ] **Tes Tipe Kepribadian sederhana (berbasis MBTI)**: 16 tipe kepribadian
- [ ] **Dashboard Komprehensif**: Tampilkan 3 dimensi (RIASEC + Gaya Belajar + Kepribadian) dalam satu infografik interaktif
- [ ] Hasil multi-battery tersimpan dan bisa dilihat riwayatnya (progress tracking)

#### 8.4 Hasil yang Lebih Kaya
- [ ] Halaman hasil RIASEC yang lebih detail: deskripsi panjang tiap dimensi
- [ ] **Kombinasi Holland Code**: Penjelasan khusus untuk kombinasi 3 huruf teratas (contoh: "EAI artinya...")
- [ ] Rekomendasi karier yang langsung ter-link dari hasil tes → bukan hanya kartu statis
- [ ] Share hasil ke media sosial (card grafis yang instagrammable)

---

### FASE 9 — B2B Sekolah (Multi-tenant Platform)
**Target: 4–6 bulan**  
**Goal: Menjadi platform resmi layanan BK yang bisa dilanggani sekolah**

#### 9.1 Arsitektur Multi-tenant
- [ ] Setiap sekolah punya workspace terisolasi (data siswa tidak bercampur)
- [ ] Super Admin RuangKarier dapat mengelola semua sekolah
- [ ] Sekolah bisa undang guru BK multiple (role-based)

#### 9.2 Dashboard Guru BK v2.0
- [ ] **Kode Akses Sekolah**: Sekolah punya kode unik untuk siswa join
- [ ] **Progress Tracking Real-time**: Status pengerjaan per siswa (belum mulai / sedang / selesai)
- [ ] **Analitik Kelas/Angkatan**: Distribusi Holland Code per kelas, rata-rata kecemasan per angkatan
- [ ] **Catatan Konseling Digital**: Guru BK bisa tambah catatan per sesi konseling siswa
- [ ] **Jadwal Konseling**: Booking slot konseling langsung dari dashboard
- [ ] **Notifikasi Otomatis**: Alert ke guru BK saat ada siswa red-flag baru

#### 9.3 Fitur Administrasi BK (AKPD & SPB)
- [ ] **AKPD Digital**: Aplikasi Kebutuhan Peserta Didik — form digital sesuai standar BK Kemendikbud
- [ ] **Satuan Pelayanan Bimbingan (SPB)**: Template laporan otomatis per sesi bimbingan
- [ ] **Laporan Semester**: Generate laporan BK otomatis per semester dalam format PDF resmi
- [ ] **Ekspor Excel**: Kompatibel dengan format pelaporan Dapodik

#### 9.4 Pricing B2B
- [ ] **Tier Gratis**: 1 sekolah, 30 siswa, fitur dasar
- [ ] **Tier Sekolah** (Rp 299.000/bulan): Unlimited siswa, 2 guru BK, semua fitur
- [ ] **Tier Dinas** (Custom): Multi-sekolah, laporan terpusat, API integration

---

### FASE 10 — AI & Personalization Layer
**Target: 6–12 bulan**  
**Goal: Platform karier terpintar di Indonesia**

#### 10.1 AI-powered Career Matching
- [ ] Model rekomendasi karier berbasis ML (collaborative filtering dari data anonim)
- [ ] Personalized career path berdasarkan: RIASEC + nilai akademik + lokasi + ekonomi keluarga
- [ ] "Siswa sepertimu umumnya memilih..." (social proof rekomendasi)

#### 10.2 AI Career Counselor (Chatbot)
- [ ] Chatbot berbahasa Indonesia yang dapat menjawab pertanyaan karier umum
- [ ] Terhubung dengan data profil siswa (RIASEC result + tes lainnya)
- [ ] Eskalasi ke guru BK jika pertanyaan membutuhkan konseling mendalam
- [ ] Menggunakan Gemini API / GPT-4 dengan prompt yang di-tuning untuk konteks BK Indonesia

#### 10.3 Portofolio Digital Interaktif
- [ ] Portofolio berbasis web yang bisa dibagikan via link (bukan hanya PDF)
- [ ] Siswa bisa update portofolio secara berkala (add prestasi, sertifikat)
- [ ] QR Code di PDF yang mengarah ke portofolio web online
- [ ] Template portofolio berbeda per jalur karier (PTN / Kedinasan / Vokasi / Wirausaha)

#### 10.4 Notifikasi & Engagement
- [ ] Email digest mingguan untuk siswa (reminder action plan)
- [ ] Push notification mobile (via PWA)
- [ ] Gamifikasi: badge untuk setiap tahap yang diselesaikan
- [ ] Leaderboard anonim antar sekolah (tingkat penyelesaian bimbingan)

---

## 🎨 Rekomendasi Perbaikan UI/UX Segera

### Quick Wins (dapat dikerjakan sekarang, Fase 6d)

1. **Landing Page Hero Section**
   - Tambah animasi lottie/SVG pada hero (karakter siswa yang berpikir tentang karier)
   - Tambah testimoni quotes siswa (3 quote carousel)
   - Tambah counter: "X siswa telah menemukan jalur karier mereka"

2. **Wizard Tes RIASEC**
   - Ubah ke one-question-per-screen
   - Tambah progress bar yang lebih visual (animated)
   - Tambah estimated time remaining ("Perkiraan selesai dalam 5 menit")

3. **Halaman Hasil RIASEC**
   - Tampilkan persona Holland Code dengan ilustrasi/ikon unik
   - Tambah kalimat deskripsi lebih panjang dan inspiratif
   - Tambah tombol "Bagikan Hasilku" (share ke Instagram Stories)

4. **Dashboard BK — Red Flag**
   - Tambah sound alert saat ada siswa baru dengan kecemasan tinggi
   - Tambah tombol "Hubungi via WA" + "Jadwalkan Konseling" per baris

5. **Portofolio PDF**
   - Tambah QR code di halaman terakhir PDF (link ke portofolio web)
   - Tambah kop surat sekolah yang bisa dikustomisasi dari dashboard Admin

---

## 📐 Rekomendasi Arsitektur Teknis

### Short-term (Fase 7)
```
Supabase (PostgreSQL)
├── auth.users          # Supabase Auth JWT
├── public.schools      # Data sekolah (multi-tenant)
├── public.students     # Profil siswa
├── public.submissions  # Hasil pengerjaan bimbingan
├── public.careers      # Database karier 200+
├── public.majors       # Database jurusan 150+
├── public.campuses     # Database kampus
└── public.counseling_sessions  # Log sesi konseling BK
```

### Migrasi PDF untuk Serverless
```typescript
// Ganti puppeteer → puppeteer-core + @sparticuz/chromium
// Untuk Vercel/Netlify deployment
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
```

### Stack yang Direkomendasikan
| Layer | Teknologi | Alasan |
|:---|:---|:---|
| **Database** | Supabase (PostgreSQL) | RLS, Realtime, Auth bawaan, free tier generous |
| **Auth** | Supabase Auth | JWT, OAuth social login, email magic link |
| **Storage** | Supabase Storage | Foto profil, aset sekolah |
| **AI/ML** | Gemini API | Chatbot BK, rekomendasi karier |
| **PDF** | Puppeteer → @sparticuz/chromium | Serverless-ready |
| **Deployment** | Vercel | Edge network, free tier, CI/CD GitHub |
| **Email** | Resend | Developer-friendly, murah, React Email template |
| **Analytics** | Vercel Analytics | Privacy-first, GDPR, gratis |

---

## 📈 Proyeksi Traksi

| Milestone | Target Waktu | KPI |
|:---|:---:|:---|
| Launch MVP B2B (Fase 9.1–9.2) | Bulan 6 | 3 sekolah pilot, 150+ siswa |
| Database Karier + Jurusan live | Bulan 4 | 200 profesi, 150 jurusan kurated |
| Multi-battery Assessment | Bulan 5 | Retention rate tes naik 40% |
| AI Chatbot Beta | Bulan 10 | 500+ chat interactions/bulan |
| B2B Revenue (Tier Sekolah) | Bulan 7 | Rp 2.1jt ARR dari 7 sekolah |
| Pengguna aktif | Bulan 12 | 2.000+ siswa, 20+ sekolah |

---

## ⚡ Prioritas Eksekusi (Next Sprint)

Berdasarkan **impact tertinggi** dan **effort terendah**:

| Prioritas | Fitur | Estimasi | Impact |
|:---:|:---|:---:|:---:|
| 🔴 P1 | Supabase migration (auth + database) | 2 minggu | ⭐⭐⭐⭐⭐ |
| 🔴 P1 | Database karier 100+ profesi (konten) | 1 minggu | ⭐⭐⭐⭐⭐ |
| 🟠 P2 | UI RIASEC one-question-per-screen | 3 hari | ⭐⭐⭐⭐ |
| 🟠 P2 | Rename Holland Code → Persona Indonesia | 1 hari | ⭐⭐⭐⭐ |
| 🟠 P2 | Interlinking RIASEC Result → Karier | 1 minggu | ⭐⭐⭐⭐⭐ |
| 🟡 P3 | Tes Gaya Belajar (VAK) tambahan | 3 hari | ⭐⭐⭐ |
| 🟡 P3 | Share hasil RIASEC ke sosmed | 2 hari | ⭐⭐⭐ |
| 🟢 P4 | B2B multi-tenant architecture | 3 minggu | ⭐⭐⭐⭐⭐ |
| 🟢 P4 | AI Chatbot BK (Gemini API) | 2 minggu | ⭐⭐⭐⭐ |

---

## 💡 Insight Strategis

### Positioning yang Tepat
RuangKarier harus memposisikan diri sebagai **"Platform BK Digital untuk Guru, bukan hanya untuk Siswa"**. Inilah celah yang belum diisi kompetitor:

- **AkuPintar** → B2C (siswa mandiri), premium di mobile
- **Quipper** → B2C (siswa mandiri), fokus akademik
- **BTW Edutech** → B2B mahal, tes psikologi formal berbayar
- **BK Jatidiri** → B2B administrasi, tidak ada RIASEC/karier
- **RuangKarier** → **B2B affordable + B2C gratis**, CBT + RIASEC + PDF + BK tools

### Keunggulan Kompetitif yang Harus Dipertahankan
1. **PDF Portofolio Otomatis** — tidak ada satu pun kompetitor yang punya ini
2. **CBT LKPD Digital** — unik di pasar Indonesia
3. **Safety Alert Kecemasan** — diferensiator humanis yang kuat
4. **Gratis untuk siswa** — barrier to entry rendah, viral lewat sekolah

### Potensi Partnership
- Kemendikbudristek (integrasi dengan Dapodik)
- Dinas Pendidikan Kota/Kabupaten (lisensi massal)
- Perguruan Tinggi (sponsor "Rekomendasi Kampus" berbayar)
- HIMPSI (legitimasi tes psikologi)
