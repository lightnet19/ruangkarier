# PRD — RuangKarier

## 1. Ringkasan Produk
**RuangKarier** adalah web app bimbingan karier online untuk siswa SMA/MA yang membantu mereka:
1. mengenali minat diri melalui instrumen RIASEC,
2. mengeksplorasi jalur karier dan studi lanjut,
3. menyusun action plan karier,
4. melakukan evaluasi layanan,
5. terhubung ke Guru BK bila membutuhkan konseling lanjutan.

Produk ini dirancang sebagai **safe space** yang ramah, reflektif, dan tidak menghakimi. Arsitekturnya memakai **card-based dashboard** agar mudah digunakan di mobile maupun desktop.

## 2. Latar Belakang Masalah
Siswa SMA/MA sering mengalami kebingungan karier, kecemasan masa depan, dan kesulitan memilih jalur setelah lulus. Di sisi lain, Guru BK memiliki keterbatasan waktu tatap muka untuk mendampingi seluruh siswa secara personal. RuangKarier menjawab masalah ini dengan model blended BK berbasis web.

## 3. Tujuan Produk
### Tujuan utama
Membantu siswa menganalisis diri, mengeksplorasi pilihan karier, dan menyusun rencana tindakan yang realistis.

### Tujuan turunan
- Menghasilkan hasil RIASEC yang mudah dipahami.
- Menyajikan informasi jalur PTN, PTS, PTKIN, kedinasan, kerja, dan wirausaha.
- Mengubah hasil refleksi menjadi action plan.
- Menyediakan jalur RTL ke Guru BK jika dibutuhkan.

## 4. Prinsip Desain
- **Self-awareness first**: mulai dari refleksi diri.
- **No lecturing**: sistem memandu, bukan menggurui.
- **Mobile-first**: nyaman dipakai di smartphone.
- **Low-friction**: langkah sederhana dan bertahap.
- **Safety trigger**: siswa yang cemas tinggi langsung diarahkan ke bantuan BK.
- **Teacher-friendly**: Guru BK mudah memantau dan menindaklanjuti.

## 5. Target Pengguna
### Primary user
- Siswa SMA/MA kelas XI–XII

### Secondary user
- Guru BK / konselor sekolah

### Admin user
- Pengembang / operator konten

## 6. Scope MVP
### In scope
- Landing page
- Login sederhana atau akses berbasis kode kelas
- Consent form
- Screening hambatan karier
- Kuis RIASEC
- Hasil top 3 RIASEC
- Jelajah karier berbasis kartu
- LKPD digital / Career Action Planner
- Evaluasi layanan UCE
- Tombol Hubungi Guru BK
- Export portofolio PDF
- Admin dashboard dasar
- Rekap data ke spreadsheet / database

### Out of scope untuk MVP awal
- AI career coach penuh
- Chat real-time 24/7
- Integrasi payment
- Forum antar siswa
- Rekomendasi karier berbasis machine learning kompleks

## 7. Information Architecture
### Public pages
- `/`
- `/dashboard`
- `/start`
- `/assessment/consent`
- `/assessment/screening`
- `/assessment/riasec`
- `/career-explore`
- `/action-plan`
- `/evaluation`
- `/portfolio/:id`

### Counselor/Admin pages
- `/admin/login`
- `/admin/dashboard`
- `/admin/students`
- `/admin/submissions`
- `/admin/career-content`
- `/admin/evaluations`
- `/admin/export`

## 8. Core User Journey
1. Siswa membuka landing page.
2. Siswa membaca pengantar singkat dan menyetujui eksplorasi.
3. Siswa mengisi data awal dan screening hambatan.
4. Sistem mendeteksi level cemas tinggi jika ada.
5. Siswa mengisi kuis RIASEC.
6. Sistem menghitung skor dan menampilkan top 3.
7. Siswa masuk ke modul Jelajah Karier.
8. Siswa mengisi LKPD Digital / Career Action Planner.
9. Siswa mengisi evaluasi layanan.
10. Siswa mengunduh portofolio atau mengirim ke Guru BK.
11. Jika perlu, siswa mengajukan konseling lanjutan.

## 9. Functional Requirements

### 9.1 Landing Page
- Menampilkan nama RuangKarier, tagline, dan CTA utama.
- Menjelaskan manfaat platform dalam bahasa yang hangat.
- Menampilkan 4 kartu utama dashboard.

### 9.2 Consent & Initial Screening
- Form profil singkat: nama, kelas, sekolah.
- Skala keyakinan terhadap pilihan karier.
- Teks masalah utama yang dirasakan.
- Checkbox persetujuan sukarela.
- Screening hambatan karier internal dan eksternal.
- Real-time anxiety trigger.

### 9.3 RIASEC Assessment
- 30 item, skala 1–5.
- Skor dihitung per dimensi R, I, A, S, E, C.
- Output: total skor, ranking, dan top 3 kode Holland.
- Output ditampilkan dengan bahasa reflektif, bukan diagnostik.

### 9.4 Career Explore
- Kartu konten untuk:
  - PTN
  - PTS
  - PTKIN
  - Sekolah Kedinasan
  - Dunia Kerja
  - Wirausaha
- Konten bisa difilter berdasarkan top 3 RIASEC.
- Setiap kartu berisi ringkasan, prasyarat, dan contoh jalur.

### 9.5 Action Plan / LKPD
- Form reflektif berisi:
  - tujuan karier utama,
  - hambatan,
  - emosi yang muncul,
  - pikiran negatif,
  - fakta penyeimbang,
  - sudut pandang alternatif,
  - keyakinan baru,
  - 3 tindakan terbesar bulan ini.
- Hasil dapat disimpan sebagai portofolio.

### 9.6 Evaluation & RTL
- Evaluasi layanan model UCE:
  - Understanding
  - Comfort
  - Action
- Tombol “Hubungi Guru BK”.
- Tombol “Daftar Konseling Lanjutan”.
- Opsi unduh PDF.

### 9.7 Admin Dashboard
- Melihat rekap user, hasil asesmen, dan status RTL.
- Mengelola konten karier.
- Mengekspor data ke CSV / spreadsheet.
- Melihat siswa yang perlu tindak lanjut prioritas.

## 10. Business Rules
1. User harus menyetujui consent sebelum lanjut.
2. Jika skor kecemasan tinggi atau user memilih bantuan segera, tampilkan safety card dan tombol kontak BK.
3. RIASEC dihitung berdasarkan penjumlahan tiap dimensi.
4. Top 3 skor RIASEC menjadi hasil utama yang ditampilkan.
5. Portofolio akhir menggabungkan seluruh input dari tahap awal sampai evaluasi.
6. Evaluasi layanan wajib tersimpan sebagai data terpisah.
7. Konten karier harus bisa diperbarui tanpa mengubah struktur aplikasi.

## 11. Data Entities
- User
- ConsentSession
- ScreeningResponse
- RiasecResponse
- RiasecResult
- CareerModule
- ActionPlan
- Evaluation
- CounselingRequest
- PortfolioExport

## 12. Non-Functional Requirements
- Responsive di mobile.
- Load cepat pada koneksi sekolah yang lemah.
- Aksesibilitas warna dan ukuran teks baik.
- Data sensitif tersimpan aman.
- UI sederhana dan ramah remaja.
- Logging tersedia untuk admin.
- PDF export harus stabil.

## 13. Success Metrics
- Completion rate kuis RIASEC
- Completion rate LKPD
- Jumlah portofolio yang berhasil diekspor
- Jumlah siswa yang mengajukan RTL
- Penurunan skor kecemasan dari awal ke akhir
- Tingkat kepuasan siswa terhadap layanan

## 14. MVP Delivery Plan
### Phase 1
- Landing page
- Consent
- Screening
- RIASEC
- Hasil top 3
- Action plan
- Export PDF

### Phase 2
- Jelajah karier berbasis kategori
- Evaluasi UCE
- Booking BK
- Admin dashboard

### Phase 3
- Notifikasi otomatis
- Statistik sekolah
- Riwayat user
- Rekomendasi konten adaptif

## 15. Open Questions
- Apakah login memakai akun sekolah, kode kelas, atau akses tanpa login?
- Apakah PDF dikirim via email, WhatsApp, atau hanya unduhan?
- Apakah dashboard admin perlu role terpisah untuk konselor dan admin teknis?
- Apakah konten karier akan diinput manual atau via CMS sederhana?