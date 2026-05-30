# Walkthrough: Akun Uji Coba & Peningkatan UX Halaman Login RuangKarier

Kami telah berhasil mengimplementasikan fitur **"Akun Uji Coba / Demo"** dengan antarmuka yang sangat premium (*glassmorphism*) serta fungsionalitas pengisian instan (*one-click autofill*). Fitur ini mempermudah proses demonstrasi dan evaluasi platform RuangKarier tanpa memerlukan masukan kredensial secara manual.

Berikut adalah ringkasan lengkap dari seluruh perubahan, arsitektur, serta bukti verifikasi visual.

---

## 🛠️ Perubahan yang Dilakukan

### 1. Database & Seeder
* **[db.json](file:///c:/Projects/ruangkarier/ruangkarier-app/data/db.json)**
  * Menormalisasi seluruh data siswa simulasi (6 akun) agar memiliki NIS unik yang konsisten (`2025001` - `2025006`) dan menggunakan passcode standar `siswa123`.
* **[route.ts](file:///c:/Projects/ruangkarier/ruangkarier-app/src/app/api/counselor/seed/route.ts)**
  * Memperbarui endpoint seeder BK agar ketika database di-seed ulang, data akun Ahmad Fauzi, Siti Aminah, dan Budi Pratama tetap sinkron dan membawa field `nis` serta `passcode` terbaru.

### 2. Antarmuka / Frontend Halaman Login
* **[page.tsx](file:///c:/Projects/ruangkarier/ruangkarier-app/src/app/login/page.tsx)**
  * Mendesain panel interaktif **"Akun Uji Coba / Demo"** menggunakan gaya *glassmorphism* modern dengan transisi tab yang halus.
  * Mengintegrasikan fungsi handler: `handleAutofillStudent`, `handleAutofillCounselor`, dan `handleAutofillAdmin` agar saat tombol pengisian cepat (**"Isi ⚡"**) diklik, field login terisi seketika dan data langsung divalidasi.

### 3. Dokumentasi Proyek
* **[README.md](file:///c:/Projects/ruangkarier/README.md)**
  * Melengkapi tabel kredensial lengkap untuk Siswa, Guru BK, dan Admin beserta instruksi pemakaian demo widget.
* **[devlog.md](file:///c:/Projects/ruangkarier/docs/devlog.md)**
  * Mencatat rilis kronologis log pengembang mengenai penyelarasan kredensial dan widget autofill.

---

## 📸 Dokumentasi & Hasil Verifikasi Visual

Kami telah melakukan pengujian fungsionalitas login otomatis menggunakan agen browser terotomatisasi untuk memastikan pengalihan rute berjalan sempurna ke halaman dasbor masing-masing peran.

### Rekaman Alur Pengujian Autofill & Login
Berikut adalah rekaman sesi browser ketika agen melakukan pengujian login terotomatisasi untuk Siswa, Guru BK, dan Admin:

![Rekaman Sesi Uji Coba Login Autofill](C:\Users\yppnu\.gemini\antigravity\brain\8f9ea9cb-be00-4cd4-9a19-a8929f9595a9\login_widget_verification_1780149915997.webp)

---

### Hasil Tangkapan Layar Dasbor setelah Berhasil Masuk

````carousel
![Dasbor Siswa - Lembar Eksplorasi Karier](C:\Users\yppnu\.gemini\antigravity\brain\8f9ea9cb-be00-4cd4-9a19-a8929f9595a9\student_dashboard_success_1780149986729.png)
<!-- slide -->
![Dasbor Analitik Guru BK](C:\Users\yppnu\.gemini\antigravity\brain\8f9ea9cb-be00-4cd4-9a19-a8929f9595a9\counselor_dashboard_success_1780150042100.png)
<!-- slide -->
![Dasbor Panel Admin Utama](C:\Users\yppnu\.gemini\antigravity\brain\8f9ea9cb-be00-4cd4-9a19-a8929f9595a9\admin_dashboard_success_1780150104196.png)
````

---

## 🧪 Rencana Verifikasi Mendatang

### Pengujian Mandiri oleh Pengguna:
1. Pastikan server lokal berjalan (`npm run dev`).
2. Kunjungi URL [http://localhost:3000/login](http://localhost:3000/login).
3. Di bawah kotak login, temukan panel **"Akun Uji Coba / Demo"**.
4. Klik tab **Siswa**, pilih salah satu akun (misalnya Ahmad Fauzi), lalu klik **Isi ⚡**. Kolom NIS dan passcode akan terisi otomatis. Klik **Masuk** dan Anda akan dialihkan ke halaman portofolio/eksplorasi siswa.
5. Klik **Keluar** untuk kembali, lalu uji tab **Guru BK** (klik **Isi ⚡** -> **Masuk**) dan tab **Admin** (klik **Isi ⚡** -> **Masuk**). Semuanya akan mengarahkan ke dasbor yang sesuai.
