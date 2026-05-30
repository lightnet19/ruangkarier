export interface CareerPathway {
  id: string;
  title: string;
  category: 'ptn' | 'pts' | 'ptkin' | 'kedinasan' | 'kerja' | 'wirausaha';
  riasecTags: ('R' | 'I' | 'A' | 'S' | 'E' | 'C')[];
  description: string;
  requirements: string[];
  examples: string[];
  tips: string;
}

export const careerContent: CareerPathway[] = [
  {
    id: "ptn-research",
    title: "Jalur PTN (Akademis & Riset)",
    category: "ptn",
    riasecTags: ["I", "R"],
    description: "Perguruan Tinggi Negeri dengan fokus pada pengembangan ilmu pengetahuan dasar, riset terapan, dan metodologi akademis tingkat tinggi. Sangat cocok bagi Anda yang memiliki rasa ingin tahu tinggi, senang memecahkan rumus rumit, atau mendalami sains.",
    requirements: [
      "Nilai rata-rata rapor yang konsisten tinggi (SNBP)",
      "Kemampuan analisis dan penguasaan soal-soal penalaran matematika/skolastik (SNBT)",
      "Ketekunan dalam belajar mandiri secara konsisten"
    ],
    examples: [
      "Universitas Indonesia (UI) - Bioteknologi, Fisika Murni",
      "Institut Teknologi Bandung (ITB) - Rekayasa Penerbangan, Aktuaria",
      "Universitas Gadjah Mada (UGM) - Kedokteran Hewan, Kimia"
    ],
    tips: "Fokuslah pada penguatan konsep-konsep dasar Matematika, Fisika, Kimia, Biologi, atau IPS, serta biasakan membaca teks-teks akademis yang panjang untuk melatih nalar kritis."
  },
  {
    id: "pts-creative",
    title: "Jalur PTS (Praktis, Industri & Kreatif)",
    category: "pts",
    riasecTags: ["A", "E"],
    description: "Perguruan Tinggi Swasta menawarkan fleksibilitas kurikulum yang sangat dinamis, kemitraan erat dengan industri global, serta penekanan pada kemampuan praktis dan industri kreatif (seperti komunikasi visual, bisnis digital, dan teknologi informasi).",
    requirements: [
      "Portofolio karya kreatif (khusus program seni/desain)",
      "Nilai tes masuk seleksi mandiri PTS",
      "Kesiapan mental untuk magang industri lebih awal"
    ],
    examples: [
      "Telkom University - Digital Business, DKV, Teknik Telekomunikasi",
      "Binus University - Game Application and Technology, Cyber Security",
      "Universitas Multimedia Nusantara (UMN) - Animasi, Film & Televisi"
    ],
    tips: "Mulailah membangun portofolio pribadi berupa gambar, tulisan, proyek coding kecil, atau ide bisnis inovatif karena PTS sangat menghargai bukti karya nyata."
  },
  {
    id: "ptkin-social",
    title: "Jalur PTKIN (Keagamaan & Pengabdian Sosial)",
    category: "ptkin",
    riasecTags: ["S", "C"],
    description: "Perguruan Tinggi Keagamaan Islam Negeri menggabungkan studi keilmuan akademis umum dengan nilai-nilai spiritual keislaman yang kuat. Sangat relevan bagi Anda yang berjiwa sosial tinggi, senang membimbing masyarakat, mendidik, atau menyukai keteraturan etika.",
    requirements: [
      "Nilai rapor dan prestasi keagamaan (SPAN-PTKIN)",
      "Nilai ujian tulis sistem elektronik (UM-PTKIN)",
      "Minat tinggi dalam pengabdian masyarakat"
    ],
    examples: [
      "UIN Syarif Hidayatullah Jakarta - Psikologi, Pendidikan Agama Islam",
      "UIN Sunan Kalijaga Yogyakarta - Komunikasi & Penyiaran Islam, Ilmu Perpustakaan",
      "UIN Maulana Malik Ibrahim Malang - Syariah & Hukum, Tadris Bahasa Inggris"
    ],
    tips: "Perkuat pemahaman dasar mengenai bahasa asing (Arab/Inggris) serta wawasan moderasi keagamaan dan keaktifan sosial di sekolah maupun organisasi keagamaan remaja."
  },
  {
    id: "kedinasan-prosedural",
    title: "Sekolah Kedinasan (Disiplin & Layanan Publik)",
    category: "kedinasan",
    riasecTags: ["C", "R", "E"],
    description: "Perguruan Tinggi ikatan dinas milik instansi pemerintah yang menawarkan jaminan karier sebagai Aparatur Sipil Negara (ASN) pasca-kelulusan. Menuntut disiplin militer/semi-militer yang tinggi, kepatuhan prosedur, ketelitian administrasi, serta kemampuan fisik prima.",
    requirements: [
      "Nilai rapor minimal sesuai ambang batas syarat (misal 70.00 atau 75.00)",
      "Kesehatan fisik prima (tidak buta warna, tinggi badan minimal)",
      "Lulus Seleksi Kompetensi Dasar (SKD: TWK, TIU, TKP) berbasis komputer"
    ],
    examples: [
      "STAN (Akuntansi Sektor Publik, Kebijakan Pajak)",
      "STIS (Statistika, Komputasi Statistik)",
      "IPDN (Praja Administrasi Pemerintahan)",
      "Poltekip/Poltekim (Hukum Keimigrasian & Pemasyarakatan)"
    ],
    tips: "Berlatihlah mengerjakan soal CAT SKD sejak dini (TIU, TWK, TKP) serta jaga kebugaran fisik dengan lari, pull-up, push-up, dan sit-up secara teratur."
  },
  {
    id: "kerja-vokasional",
    title: "Dunia Kerja & Pendidikan Vokasi (Aksi Praktis)",
    category: "kerja",
    riasecTags: ["R", "C"],
    description: "Jalur langsung memasuki dunia industri, manufaktur, jasa, atau menempuh pendidikan vokasi (D3/D4) yang mengedepankan keahlian taktis. Cocok bagi Anda yang menyukai aktivitas langsung di lapangan, mengoperasikan sistem terstruktur, atau melakukan pekerjaan praktis berketerampilan tinggi.",
    requirements: [
      "Sertifikasi keahlian (kompetensi BNSP)",
      "Kemampuan komunikasi kerja dan kerja sama tim",
      "Ketahanan fisik dan kedisiplinan kerja yang tangguh"
    ],
    examples: [
      "Politeknik Negeri Jakarta (PNJ) - Teknik Alat Berat, Konstruksi Sipil",
      "Politeknik Manufaktur Bandung (POLMAN)",
      "Industri Manufaktur Otomotif, Logistik, Operator Sistem Jaringan"
    ],
    tips: "Carilah sertifikasi kompetensi keahlian yang diakui industri saat ini dan perkuat portofolio praktik kerja industri (Prakerin/Magang) Anda."
  },
  {
    id: "wirausaha-mandiri",
    title: "Wirausaha & Start-up (Inisiatif & Kepemimpinan)",
    category: "wirausaha",
    riasecTags: ["E", "A"],
    description: "Membangun usaha mandiri, memecahkan masalah pasar dengan produk baru, atau merintis bisnis kreatif secara otonom. Jalur ini menuntut keberanian mengambil keputusan di tengah ketidakpastian, kecakapan persuasi, presentasi ide, serta manajemen keuangan yang mandiri.",
    requirements: [
      "Kreativitas tinggi dalam mengidentifikasi masalah pasar",
      "Keberanian mengambil risiko finansial dan manajemen operasional",
      "Kemampuan komunikasi untuk mempengaruhi pelanggan dan investor"
    ],
    examples: [
      "Founder Brand Fashion Lokal / F&B Modern",
      "Rintisan Agen Pemasaran Digital (Digital Marketing Agency)",
      "Usaha Kreatif Desain, Kerajinan Tangan, atau Jasa Fotografi"
    ],
    tips: "Mulailah dengan usaha kecil (micro-business) untuk mempelajari dasar-dasar perputaran uang (cashflow), cara memuaskan pelanggan, serta memanfaatkan pemasaran digital di media sosial."
  }
];
