# 🎨 Panduan Desain (Design System) — RuangKarier

## 1. Filosofi Desain
**"Ruang Aman Mengenali Potensi, Tempat Nyaman Merancang Masa Depan."**
RuangKarier dirancang untuk siswa SMA/MA/SMK (Gen-Z) dengan pendekatan *mobile-first*, *low-friction*, dan *non-judgmental*. Desain harus memancarkan kesan **Premium, Profesional, Ramah, dan Hidup (Dynamic)** menggunakan elemen glassmorphism, micro-animations, dan tata letak berbasis kartu (card-based layout).

## 2. Palet Warna (Color Palette)
Warna dipilih berdasarkan psikologi warna untuk remaja yang mencari ketenangan dan kejelasan masa depan:

- **Primary (Navy Blue):** `#1B2A4A` — Melambangkan profesionalisme, stabilitas, dan masa depan yang jelas.
- **Secondary (Sage Green):** `#7BA08A` — Melambangkan ruang tumbuh, ketenangan, dan keseimbangan emosional.
- **Accent (Warm Amber):** `#F5A623` — Melambangkan kehangatan, optimisme, dan peringatan (untuk *safety modal*).
- **Background (Warm Beige):** `#FAF6F1` — Memberikan kesan *safe space*, tidak menyilaukan mata seperti putih murni.
- **Surface (White):** `#FFFFFF` — Untuk kartu, modal, dan elemen *overlay* dengan *subtle shadow*.
- **Text (Dark Slate):** `#2D3748` — Kontras tinggi untuk keterbacaan.
- **Muted (Cool Gray):** `#94A3B8` — Untuk teks sekunder dan placeholder.

## 3. Tipografi (Typography)
Menggunakan Google Fonts yang modern, bersih, dan mudah dibaca:
- **Headings (H1, H2, H3):** `Plus Jakarta Sans` — Modern, clean, dan cocok untuk konteks Indonesia.
- **Body & UI Elements:** `Inter` — Sangat terbaca di layar kecil, fungsional untuk navigasi dan formulir.

## 4. UI Components & Layouts

### 4.1. Bentuk & Spasi (Shapes & Spacing)
- **Border Radius:** 
  - Kartu & Modal: `12px` (Medium) hingga `16px` (Large) untuk kesan ramah.
  - Tombol: `8px` (Regular) atau `24px` (Pill/Rounded) untuk aksi utama.
- **Spacing:** Menggunakan kelipatan `4px` atau `8px` (misal: 16px, 24px, 32px) untuk konsistensi.

### 4.2. Glassmorphism & Bayangan (Shadows)
- **Soft Shadows:** Bayangan halus dan lebar (`box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05)`) untuk kartu agar tampak melayang dari background *Warm Beige*.
- **Glassmorphism:** Digunakan secara selektif (misal: pada sticky navbar atau overlay) dengan *backdrop-blur* dan transparansi latar belakang putih (`rgba(255, 255, 255, 0.7)`).

### 4.3. Animasi Mikro (Micro-Animations)
- **Hover Effects:** Kartu sedikit naik (`translate-y-1`) dan bayangan membesar saat di-hover. Tombol aksi memudar perlahan warnanya (`transition-colors duration-200`).
- **Page Transitions:** Fade in yang lembut saat berpindah halaman atau step di wizard.

## 5. Komponen Utama (Key Components)

1. **Card-Based Dashboard:**
   - Grid 2x2 atau 1 kolom di mobile.
   - Setiap kartu memiliki ikon ilustrasi yang relevan (misal: Kompas untuk Eksplorasi).
   - Progress bar mini di bawah kartu untuk menunjukkan status (misal: "Selesai 50%").

2. **Wizard Stepper (Untuk Kuis & LKPD):**
   - Indikator progres horizontal di atas formulir.
   - Hanya menampilkan satu pertanyaan/tugas per layar agar tidak *overwhelming*.

3. **Data Visualization (Hasil RIASEC):**
   - **Radar Chart:** Menampilkan skor 6 dimensi (R-I-A-S-E-C).
   - **Badge Kode Holland:** Huruf besar (misal "SAE") dengan warna gradasi sesuai dominasi.

4. **Safety Modal (Anxiety Trigger):**
   - Menggunakan warna latar belakang *Warm Amber* terang dengan border *Accent*.
   - Tombol utama "Hubungi Guru BK via WhatsApp" yang jelas.

## 6. Aset & Media
- Hindari penggunaan foto *stock* yang kaku. 
- Gunakan ilustrasi flat/3D modern atau ikon vektor (misal dari Lucide Icons atau Heroicons).
- *No Placeholders*: Gunakan generator gambar untuk mockup atau aset demonstrasi.
