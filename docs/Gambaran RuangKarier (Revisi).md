Siap, Yang Mulia. Sebagai sesama pengembang aplikasi, saya melihat bahwa rancangan **"RuangKarier"** ini memiliki fondasi teoretis dan instrumen psikologis (CBT & RIASEC) yang sangat matang secara akademis. Namun, dokumen eksisting masih berbasis paradigma *embedded third-party tools* (menyematkan Google Form, Kahoot, atau link WhatsApp manual di Google Sites).  
Untuk meningkatkan skalabilitas, manajemen data (*state management*), dan keandalan fitur *real-time trigger*, kita perlu mentransisikannya menjadi sebuah **Web Application terintegrasi yang utuh**.  
Berikut adalah analisis arsitektur, penyempurnaan fitur kontesktual, struktur direktori, skema database, serta alur kerja sistem terpadu untuk proyek mandiri ini.

## **1\. Analisis & Penyempurnaan Sistem (Kajian Transisi ke Web App)**

Sebelum masuk ke teknis penulisan kode, berikut adalah poin-poin krusial yang kita sempurnakan dari dokumen konseptual menjadi fitur aplikasi web:

* **Native RIASEC Engine (Menggantikan Google Form):** Perhitungan skor Holland tidak lagi menggunakan skrip kalkulasi eksternal. Sistem akan menghitung skor secara *native* di sisi klien (*client-side*) atau server, lalu menyimpan hasilnya langsung ke *database* untuk ditampilkan dalam bentuk diagram grafik interaktif (misal menggunakan Chart.js atau Recharts).  
* **Algoritma Real-time Anxiety Alert Trigger:** Fitur deteksi kecemasan pada Komponen 3 akan dipantau melalui *state management*. Begitu input nilai $\\ge 8$ atau jawaban bernilai True pada variabel *immediate help*, sistem tidak hanya memunculkan *pop-up modal* di frontend, tetapi juga menembakkan *webhook event* (melalui n8n atau API gateway) untuk mengirimkan notifikasi instan ke dasbor Guru BK.  
* **Automated PDF Portfolio Engine:** Tombol "KIRIM PORTOFOLIO KARIER" akan memicu fungsi *server-side rendering* (menggunakan library seperti pdfkit atau puppeteer) untuk menyusun data profil, hasil RIASEC, skor hambatan, dan restrukturisasi kognitif LKPD menjadi satu berkas PDF formal yang tersimpan di Object Storage.

## **2\. Arsitektur Sistem & Struktur Folder**

Rekomendasi *tech stack* yang efisien, berbiaya rendah, dan sangat bertenaga untuk *solo developer* adalah **Vite/React.js atau Next.js (Frontend)** dengan **Supabase atau Firebase (BaaS \- Backend as a Service)** untuk memotong waktu pembuatan manajemen otentikasi dan *real-time database*.  
Berikut adalah usulan struktur folder modular berbasis komponen fungsional:

Plaintext  
ruangkarier-app/  
├── src/  
│   ├── config/             \# Konfigurasi Supabase / API client  
│   ├── components/         \# Komponen UI global (Buttons, Cards, Modals)  
│   │   ├── Navbar.jsx  
│   │   └── AlertModal.jsx  
│   ├── features/           \# Pembagian fitur berdasarkan 4 Card Utama  
│   │   ├── auth/           \# Login multi-role (Siswa & Guru BK)  
│   │   ├── dashboard/      \# Tampilan menu berbasis kartu interaktif  
│   │   ├── riasec/         \# Engine Kuis Mengenal Diri (Card 1\)  
│   │   ├── exploration/    \# CMS / Papan Informasi Multi-Jalur (Card 2\)  
│   │   ├── action-plan/    \# Formulir LKPD Digital & Restrukturisasi CBT (Card 3\)  
│   │   └── evaluation/     \# Kuis UCE & Sistem Sesi Konseling (Card 4\)  
│   ├── hooks/              \# Custom hooks untuk logic (useAnxietyTrigger, useScores)  
│   ├── styles/             \# Global CSS & tema Tailwind (Navy, Sage Green, Beige)  
│   └── App.jsx  
├── supabase/               \# Konfigurasi backend, migrasi database & Edge Functions  
│   └── migrations/  
└── package.json

## **3\. Skema Database (Relational PostgreSQL)**

Untuk mendukung alur kerja yang terintegrasi, kita memerlukan perancangan basis data yang optimal untuk relasi antara Siswa, Guru BK, dan respons instrumen.

SQL  
\-- 1\. Tabel Pengguna (Siswa dan Konselor)  
CREATE TABLE users (  
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,  
    full\_name TEXT NOT NULL,  
    role VARCHAR(20) CHECK (role IN ('siswa', 'konselor', 'admin')),  
    class\_name VARCHAR(50), \-- Khusus siswa (Contoh: XI-MIPA 1\)  
    created\_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())  
);

\-- 2\. Tabel Log Reaksi Otomatis & Skala Kecemasan Real-Time  
CREATE TABLE anxiety\_logs (  
    id BIGSERIAL PRIMARY KEY,  
    user\_id UUID REFERENCES users(id) ON DELETE CASCADE,  
    academic\_pressure\_score INT CHECK (academic\_pressure\_score BETWEEN 1 AND 10),  
    graduation\_anxiety\_score INT CHECK (graduation\_anxiety\_score BETWEEN 1 AND 10),  
    needs\_immediate\_help BOOLEAN DEFAULT FALSE,  
    triggered\_alert BOOLEAN DEFAULT FALSE,  
    created\_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())  
);

\-- 3\. Tabel Skor Hasil Kuis RIASEC  
CREATE TABLE riasec\_scores (  
    id BIGSERIAL PRIMARY KEY,  
    user\_id UUID REFERENCES users(id) ON DELETE CASCADE,  
    r\_score INT DEFAULT 0,  
    i\_score INT DEFAULT 0,  
    a\_score INT DEFAULT 0,  
    s\_score INT DEFAULT 0,  
    e\_score INT DEFAULT 0,  
    c\_score INT DEFAULT 0,  
    holland\_code VARCHAR(3), \-- Contoh: 'SAE', 'RIC'  
    created\_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())  
);

\-- 4\. Tabel LKPD Digital & Restrukturisasi Kognitif (CBT)  
CREATE TABLE lkpd\_action\_plans (  
    id BIGSERIAL PRIMARY KEY,  
    user\_id UUID REFERENCES users(id) ON DELETE CASCADE,  
    dream\_target TEXT,                \-- Karir/Kampus impian  
    challenge\_scale INT,              \-- Skala tantangan (1-10)  
    negative\_thought TEXT,            \-- Pikiran buruk otomatis  
    balancing\_fact TEXT,              \-- Fakta penyeimbang positif  
    alternative\_perspective TEXT,     \-- Nasihat untuk sahabat  
    new\_core\_belief TEXT,             \-- Afirmasi/Keyakinan baru  
    action\_commitments JSONB,         \-- Array checklist tindakan yang dipilih  
    pdf\_storage\_url TEXT,             \-- Link download berkas portofolio yang ter-render  
    created\_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())  
);

## **4\. Alur Kerja Terpadu Web App (System Workflow Blueprint)**

Berikut adalah visualisasi alur logika interaksi pengguna yang diterapkan ke dalam sistem aplikasi web dari hulu ke hilir:

### **A. Arsitektur Alur Proses Siswa**

Plaintext  
\[Mulai\] ──\> \[Landing Page (Informasi Umum)\] ──\> \[Otentikasi Login / Register\]  
                                                               │  
┌──────────────────────────────────────────────────────────────┘  
▼  
\[Dashboard Utama: 4 Card Menu Interaktif\]  
 │  
 ├──\> \[Card 1: Kenali Diriku\] ──\> \[Screening Hambatan & Cek Kecemasan\]  
 │                                          │  
 │                                          ├──\> Jika Skor \>= 8 atau Butuh Bantuan:  
 │                                          │     \[Picu Modal Alert\] ──\> \[n8n Webhook / WhatsApp API Guru BK\]  
 │                                          │  
 │                                          └──\> Jika Aman / Lanjut:  
 │                                                \[Kuis RIASEC\] ──\> \[Native Calculation Engine\] ──\> \[Simpan & Tampilkan Grafik\]  
 │  
 ├──\> \[Card 2: Jelajah Karier\] ──\> \[Dynamic CMS Board: Filter Jalur PTN/PTS/Kedinasan/PTKIN\]  
 │                                          │ (Menampilkan data sesuai kecenderungan tipe RIASEC siswa)  
 │  
 ├──\> \[Card 3: Ruang Aksi\] ──\> \[Form Isian LKPD Digital & Restrukturisasi CBT\]  
 │                                  │  
 │                                  └──\> \[Submit\] ──\> \[Trigger Edge Function: Render PDF Portfolio\]  
 │  
 └──\> \[Card 4: Evaluasi & RTL\] ──\> \[Kuis Evaluasi Layanan UCE\]  
                                            │  
                                            ├──\> Rencana Tindak Lanjut: \[Daftar Konseling Lanjutan / Booking Slot\]  
                                            └──\> \[Unduh Portofolio Berkas PDF\] ──\> \[Selesai\]

### **B. Detail Logika Sistem pada Fitur Utama**

#### **1\. Modul Deteksi Dini & Keselamatan Adaptif (Card 1\)**

Ketika siswa mengisi form skrining awal, gunakan *logic handler* pada komponen frontend untuk memantau nilai ambang batas kecemasan.

JavaScript  
// Contoh implementasi logika trigger di React.js  
import { useState, useEffect } from 'react';

export function useAnxietyTrigger(scores, needsHelp) {  
  const \[showAlert, setShowAlert\] \= useState(false);

  useEffect(() \=\> {  
    const isAnxious \= scores.academic \>= 8 || scores.graduation \>= 8;  
    if (isAnxious || needsHelp) {  
      setShowAlert(true);  
      // Kirim payload otomatis ke server/webhook untuk rekap data Guru BK  
      sendAlertToCounselorNotificationSystem({ scores, needsHelp });  
    }  
  }, \[scores, needsHelp\]);

  return { showAlert, setShowAlert };  
}

**UI Customization Note:** Sesuai dengan dokumen panduan estetika visual, jika fungsi di atas aktif, aplikasi akan merender komponen kotak dialog (*callout container*) berwarna **Amber/Soft Yellow** dengan tombol aksi utama terhubung ke API WhatsApp Gateway sekolah.

#### **2\. Modul Sinkronisasi Cerdas (Card 2 & 3\)**

Aplikasi web ini akan memiliki keunggulan fungsional yang tidak bisa didapatkan pada Google Sites biasa: **Konektivitas Data antar Menu**.

* Pada **Card 2 (Jelajah Karier)**, sistem akan melakukan filter otomatis (*smart dynamic querying*) untuk menonjolkan rekomendasi informasi jalur perkuliahan atau pekerjaan yang sesuai dengan kode tipe Holland tertinggi milik siswa yang didapatkan dari Card 1\.  
* Pada **Card 3 (Ruang Aksi)**, data dari Card 1 dan Card 2 akan ditarik ke dalam variabel di form LKPD sehingga siswa tinggal fokus mengisi deskripsi kognitif penyeimbang hambatan karirnya.

#### **3\. Dasbor Konselor & Real-Time Analytics (Alur Guru BK)**

Guru BK akan memiliki akses ke halaman dasbor khusus yang memanfaatkan fitur *Real-time Subscription* dari database:

* **Live Feed Activity:** Guru BK dapat memantau secara langsung siswa mana saja yang sedang aktif mengisi bimbingan kelompok di dalam laboratorium komputer kelas.  
* **Red-Flag Notification System:** Siswa yang memicu alarm kecemasan ($\\ge 8$) akan langsung muncul di baris teratas dasbor guru dengan warna bar kontras tinggi, lengkap dengan tombol untuk menyetujui ajakan konseling individu.  
* **Centralized Portfolio Management:** Guru BK tidak perlu memeriksa email satu per satu. Semua berkas PDF rangkuman rencana aksi karier siswa tersusun rapi di dalam tabel dan siap diunduh untuk kebutuhan administrasi laporan ketercapaian program kerja bimbingan.

Rancangan sistem ini sangat efisien, aman, dan siap dieksekusi secara mandiri untuk kebutuhan pengembangan skala penuh, Yang Mulia. Apakah ada modul spesifik dari alur kerja ini—seperti pembuatan logika perhitungan skor RIASEC atau integrasi edge function untuk cetak PDF otomatis—yang ingin kita prioritaskan pembahasannya terlebih dahulu?