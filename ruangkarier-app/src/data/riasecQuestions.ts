export interface RiasecQuestion {
  id: number;
  statement: string;
  dimension: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
}

export const riasecQuestions: RiasecQuestion[] = [
  // Realistic (R) - Item 1 to 5
  { id: 1, statement: "Saya senang memperbaiki peralatan yang rusak.", dimension: "R" },
  { id: 2, statement: "Saya tertarik pada pekerjaan lapangan.", dimension: "R" },
  { id: 3, statement: "Saya suka mengoperasikan mesin atau alat.", dimension: "R" },
  { id: 4, statement: "Saya senang membuat atau merakit sesuatu.", dimension: "R" },
  { id: 5, statement: "Saya tertarik pada pekerjaan teknik.", dimension: "R" },
  
  // Investigative (I) - Item 6 to 10
  { id: 6, statement: "Saya senang memecahkan masalah yang rumit.", dimension: "I" },
  { id: 7, statement: "Saya tertarik melakukan penelitian.", dimension: "I" },
  { id: 8, statement: "Saya suka menganalisis data atau informasi.", dimension: "I" },
  { id: 9, statement: "Saya menikmati pelajaran sains atau ilmu pengetahuan.", dimension: "I" },
  { id: 10, statement: "Saya suka mencari penyebab suatu masalah secara mendalam.", dimension: "I" },
  
  // Artistic (A) - Item 11 to 15
  { id: 11, statement: "Saya senang menggambar atau mendesain.", dimension: "A" },
  { id: 12, statement: "Saya suka menulis cerita, puisi, atau karya kreatif.", dimension: "A" },
  { id: 13, statement: "Saya tertarik pada musik, seni, atau pertunjukan.", dimension: "A" },
  { id: 14, statement: "Saya suka mengekspresikan ide dengan cara yang kreatif.", dimension: "A" },
  { id: 15, statement: "Saya senang membuat karya yang unik dan berbeda.", dimension: "A" },
  
  // Social (S) - Item 16 to 20
  { id: 16, statement: "Saya senang membantu orang lain menyelesaikan masalahnya.", dimension: "S" },
  { id: 17, statement: "Saya suka mengajar atau membimbing orang lain.", dimension: "S" },
  { id: 18, statement: "Saya mudah bergaul dengan banyak orang.", dimension: "S" },
  { id: 19, statement: "Saya tertarik pada kegiatan sosial dan kemasyarakatan.", dimension: "S" },
  { id: 20, statement: "Saya senang mendengarkan dan memahami perasaan orang lain.", dimension: "S" },
  
  // Enterprising (E) - Item 21 to 25
  { id: 21, statement: "Saya suka memimpin kelompok atau organisasi.", dimension: "E" },
  { id: 22, statement: "Saya senang memengaruhi atau meyakinkan orang lain.", dimension: "E" },
  { id: 23, statement: "Saya tertarik pada dunia bisnis atau kewirausahaan.", dimension: "E" },
  { id: 24, statement: "Saya suka mengambil keputusan penting.", dimension: "E" },
  { id: 25, statement: "Saya senang berbicara atau presentasi di depan umum.", dimension: "E" },
  
  // Conventional (C) - Item 26 to 30
  { id: 26, statement: "Saya suka bekerja secara teratur dan sistematis.", dimension: "C" },
  { id: 27, statement: "Saya senang mengelola dokumen, arsip, atau data.", dimension: "C" },
  { id: 28, statement: "Saya teliti terhadap detail pekerjaan.", dimension: "C" },
  { id: 29, statement: "Saya menyukai aturan dan prosedur yang jelas.", dimension: "C" },
  { id: 30, statement: "Saya senang membuat jadwal, daftar, atau perencanaan.", dimension: "C" }
];

export const riasecDescriptions = {
  R: {
    title: "Realistic (Praktis & Fisik)",
    description: "Orang dengan tipe kepribadian Realistik menyukai aktivitas fisik yang memerlukan keterampilan, kekuatan, dan koordinasi. Mereka senang bekerja dengan objek, peralatan, mesin, tumbuhan, atau hewan di luar ruangan.",
    careers: "Teknik Mesin, Teknik Elektro, Arsitektur, Kehutanan, Pertanian, Penerbang/Pilot, Teknisi IT, Pengelola Konstruksi.",
    tagline: "Suka berorientasi pada tindakan nyata, benda konkret, dan penyelesaian masalah fisik secara praktis."
  },
  I: {
    title: "Investigative (Analitis & Riset)",
    description: "Orang dengan tipe kepribadian Investigatif menyukai aktivitas yang melibatkan observasi, analisis, evaluasi, penelitian ilmiah, dan pemecahan masalah teoritis.",
    careers: "Peneliti/Ilmuwan, Analis Data, Ahli IT/Software Engineer, Dokter/Tenaga Medis, Ahli Statistik, Psikolog Klinis, Ahli Matematika.",
    tagline: "Senang mengamati, belajar, menyelidiki, menganalisis, mengevaluasi, atau memecahkan masalah kognitif."
  },
  A: {
    title: "Artistic (Kreatif & Ekspresif)",
    description: "Orang dengan tipe kepribadian Artistik menyukai aktivitas yang tidak terstruktur, ambigu, dan kreatif untuk mengekspresikan diri mereka secara artistik melalui tulisan, lukisan, desain, akting, atau musik.",
    careers: "Desainer Grafis, Animator, Penulis Kreatif, Arsitek Lansekap, Musisi, Sutradara Film, Spesialis Media Sosial, Humas/PR.",
    tagline: "Memiliki kemampuan artistik, inovatif, intuitif, dan senang bekerja dalam situasi yang tidak terstruktur."
  },
  S: {
    title: "Social (Penolong & Pendidik)",
    description: "Orang dengan tipe kepribadian Sosial menyukai aktivitas yang melibatkan interaksi dengan orang lain untuk membantu, mengajar, menyembuhkan, melatih, atau mengembangkan potensi mereka.",
    careers: "Guru/Pendidik, Guru BK/Konselor, Pekerja Sosial, Psikolog, Tenaga Medis/Perawat, Pengelola Komunitas, Spesialis Hubungan Masyarakat.",
    tagline: "Suka bekerja dengan orang lain untuk mencerahkan, menginformasikan, membantu, melatih, menyembuhkan, atau merawat mereka."
  },
  E: {
    title: "Enterprising (Pemberani & Pemimpin)",
    description: "Orang dengan tipe kepribadian Enterprising menyukai aktivitas yang melibatkan pengaruh, persuasi, kepemimpinan, dan pengelolaan bisnis untuk mencapai keuntungan ekonomi atau sasaran organisasi.",
    careers: "Wirausaha, Manajer Pemasaran, Pengacara/Advokat, Direktur Eksekutif, Politisi, Perencana Keuangan, Manajer Penjualan.",
    tagline: "Senang mempengaruhi, membujuk, memimpin, mengarahkan, atau mengelola orang lain untuk sasaran organisasi atau ekonomi."
  },
  C: {
    title: "Conventional (Teratur & Rapi)",
    description: "Orang dengan tipe kepribadian Konvensional menyukai aktivitas terstruktur, teratur, mengelola data secara sistematis, menyimpan catatan, dan mengikuti instruksi atau aturan yang jelas.",
    careers: "Akuntan, Analis Keuangan, Administrator Kantor, Arsiparis, Spesialis Pajak, Ahli Database, Pegawai Bank, Penjamin Mutu.",
    tagline: "Senang bekerja dengan data, memiliki kemampuan klerikal atau numerik, memperhatikan detail, dan mengikuti instruksi secara presisi."
  }
};
