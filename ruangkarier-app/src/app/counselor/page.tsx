'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  ShieldAlert, 
  TrendingDown, 
  Award, 
  MessageCircle, 
  FileText, 
  Trash2, 
  Sparkles, 
  Search,
  CheckCircle,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Match student session format
interface StudentSession {
  id: string;
  profile?: {
    name: string;
    className: string;
    consentChecked: boolean;
    confidenceScore: number;
    mainProblem: string;
    prepNotes: string;
  };
  screeningResponses?: Record<string, number>;
  anxietyLogs?: {
    academicPressureScore: number;
    graduationAnxietyScore: number;
    needsImmediateHelp: boolean;
    triggeredAlert: boolean;
    createdAt: string;
  };
  riasecResponses?: Record<number, number>;
  riasecScores?: {
    R: number;
    I: number;
    A: number;
    S: number;
    E: number;
    C: number;
    top3Code: string;
  };
  actionPlan?: {
    goal: string;
    challengeLevel: number;
    emotionText: string;
    negativeThought: string;
    evidenceNegative: string;
    counterEvidence: string;
    alternativeView: string;
    newBelief: string;
    selectedCommitments: string[];
    monthlyActions: string[];
  };
  evaluation?: {
    understandingScore: number;
    comfortScore: number;
    actionScore: number;
    notes: string;
    postAnxietyScore: number;
    counselorDiscussion: string;
    sentToCounselor: boolean;
    sentAt?: string;
  };
  createdAt: string;
}

export default function CounselorDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('Semua');
  const [passcode, setPasscode] = useState('');
  const [inputPasscode, setInputPasscode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sessions, setSessions] = useState<StudentSession[]>([]);
  const [schoolName, setSchoolName] = useState('SMA Negeri Pilihan');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = async (code: string) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/counselor/students?passcode=${code}`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data.students || []);
        setSchoolName(data.schoolName || 'SMA Negeri Pilihan');
        setIsAuthorized(true);
        localStorage.setItem('ruangkarier_counselor_passcode', code);
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || 'Kode sandi Guru BK tidak valid!');
        setIsAuthorized(false);
      }
    } catch (err: any) {
      setErrorMsg('Gagal terhubung ke server. Silakan coba lagi.');
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedPasscode = localStorage.getItem('ruangkarier_counselor_passcode');
    if (savedPasscode) {
      setPasscode(savedPasscode);
      fetchData(savedPasscode);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPasscode.trim()) return;
    setPasscode(inputPasscode);
    fetchData(inputPasscode);
  };

  const handleLogout = () => {
    localStorage.removeItem('ruangkarier_counselor_passcode');
    setPasscode('');
    setInputPasscode('');
    setIsAuthorized(false);
    setSessions([]);
  };

  // Stats calculation
  const totalStudents = sessions.length;
  
  const redFlagsCount = sessions.filter(
    s => s.anxietyLogs?.triggeredAlert || s.anxietyLogs?.needsImmediateHelp
  ).length;

  const avgInitialAnxiety = totalStudents > 0 
    ? (sessions.reduce((acc, s) => acc + (s.anxietyLogs?.graduationAnxietyScore || 0), 0) / totalStudents).toFixed(1)
    : '0';

  const avgPostAnxiety = totalStudents > 0
    ? (sessions.reduce((acc, s) => acc + (s.evaluation?.postAnxietyScore || 0), 0) / totalStudents).toFixed(1)
    : '0';

  const completionRate = totalStudents > 0
    ? Math.round((sessions.filter(s => s.evaluation?.sentToCounselor).length / totalStudents) * 100)
    : 0;

  // Filter students based on search term & class dropdown
  const filteredSessions = sessions.filter((s) => {
    const matchesSearch = s.profile?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.riasecScores?.top3Code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.actionPlan?.goal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'Semua' || s.profile?.className === filterClass;
    return !!matchesSearch && matchesClass;
  });

  // Extract distinct classes for filtering
  const distinctClasses = Array.from(
    new Set(sessions.map(s => s.profile?.className).filter(Boolean))
  ) as string[];

  // WhatsApp follow-up link trigger
  const handleFollowUpWhatsApp = (session: StudentSession) => {
    const name = session.profile?.name || 'Siswa';
    const initialAnxiety = session.anxietyLogs?.graduationAnxietyScore || 8;
    const goal = session.actionPlan?.goal || 'Impiannya';
    const text = encodeURIComponent(
      `Halo ${name}, bapak/ibu Guru BK melihat hasil asesmen RuangKarier-mu. Kami sangat mengapresiasi keberanianmu merencanakan target ke ${goal}. Karena kamu sempat mencatat tingkat kecemasan awal di skala ${initialAnxiety}/10, yuk mampir sebentar ke ruang BK untuk mengobrol santai kapan saja kamu luang. Kami di sini untuk mendengarmu.`
    );
    window.open(`https://wa.me/628123456789?text=${text}`, '_blank');
  };

  // Mock Database Seeder for quick preview and demonstrations
  const handleSeedMockData = async () => {
    setIsLoading(true);
    try {
      const mockSessions: StudentSession[] = [
        {
          id: "mock_ahmad_fauzi",
          createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
          profile: {
            name: "Ahmad Fauzi",
            className: "XII-IPS 1",
            consentChecked: true,
            confidenceScore: 3,
            mainProblem: "Merasa minder karena nilai ekonomi jelek, padahal sangat ingin masuk bisnis UGM. Takut dituntut orang tua menjadi PNS.",
            prepNotes: "Membaca sekilas profil UGM, namun belum berani berdiskusi dengan orang tua."
          },
          screeningResponses: {
            S1: 3, S2: 4, S3: 3, S4: 4, S5: 4, S6: 4, S7: 3, S8: 2
          },
          anxietyLogs: {
            academicPressureScore: 9,
            graduationAnxietyScore: 9, // Red flag!
            needsImmediateHelp: true,
            triggeredAlert: true,
            createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
          },
          riasecResponses: {
            1:2, 2:2, 3:3, 4:2, 5:1, // R
            6:4, 7:4, 8:4, 9:3, 10:4, // I
            11:4, 12:5, 13:4, 14:5, 15:4, // A
            16:3, 17:3, 18:2, 19:3, 20:4, // S
            21:5, 22:5, 23:5, 24:4, 25:5, // E
            26:2, 27:3, 28:2, 29:3, 30:3  // C
          },
          riasecScores: {
            R: 10, I: 19, A: 22, S: 15, E: 24, C: 13,
            top3Code: "EAI"
          },
          actionPlan: {
            goal: "Manajemen Bisnis / Kewirausahaan Universitas Gadjah Mada (UGM)",
            challengeLevel: 9,
            emotionText: "Takut, minder, tidak berdaya",
            negativeThought: "Saya pasti gagal masuk UGM karena nilai saya jelek, dan orang tua akan marah jika saya tidak mendaftar CPNS.",
            evidenceNegative: "Nilai ujian akhir sekolah semester lalu jeblok di mata pelajaran matematika IPS.",
            counterEvidence: "Saya menjuarai lomba cipta bisnis tingkat kabupaten tahun lalu, dan nilai rata-rata bahasa Inggris saya 90.",
            alternativeView: "Ahmad, kamu hebat di bidang kepemimpinan dan ide bisnis kreatif. UGM tidak hanya melihat satu nilai matematika, tapi menghargai prestasi non-akademismu. Orang tua pasti bangga jika usahamu sukses.",
            newBelief: "Saya mungkin kurang kuat di rumus matematika murni, namun potensi kepemimpinan and wirausaha saya sangat matang. Saya berhak mengejar UGM melalui jalur prestasi!",
            selectedCommitments: [
              "Mengatur jadwal belajar harian secara teratur dan konsisten untuk menaikkan nilai mata pelajaran pendukung.",
              "Mengajak orang tua berdiskusi dengan kepala dingin mengenai pilihan jurusan dan rencana cadangannya.",
              "Berjalan ke ruang BK untuk melakukan validasi dan konsultasi mendalam bersama Guru BK sekolah."
            ],
            monthlyActions: [
              "Membuat presentasi proposal bisnis kecil untuk ditunjukkan ke orang tua.",
              "Belajar soal TPA/UTBK bagian logika verbal setengah jam setiap hari.",
              "Mengonsultasikan portofolio piagam juara bisnis ke Guru BK."
            ]
          },
          evaluation: {
            understandingScore: 9,
            comfortScore: 10,
            actionScore: 8,
            notes: "Saya merasa jauh lebih lega karena berhasil menepis ketakutan buruk mengenai tuntutan orang tua dan memiliki rencana aksi.",
            postAnxietyScore: 4, // Great reduction from 9!
            counselorDiscussion: "Ingin mendiskusikan cara berbicara yang dingin kepada ayah saya mengenai bisnis.",
            sentToCounselor: true,
            sentAt: new Date(Date.now() - 1.8 * 3600000).toISOString()
          }
        },
        {
          id: "mock_siti_aminah",
          createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
          profile: {
            name: "Siti Aminah",
            className: "XII-MIPA 2",
            consentChecked: true,
            confidenceScore: 4,
            mainProblem: "Sangat cemas menghadapi persaingan masuk Kedokteran Gigi Airlangga. Merasa buntu dan tertekan oleh harapan guru bidang studi.",
            prepNotes: "Mengerjakan try-out UTBK mandiri, namun skornya baru mencapai 550."
          },
          screeningResponses: {
            S1: 2, S2: 3, S3: 3, S4: 4, S5: 4, S6: 3, S7: 2, S8: 1
          },
          anxietyLogs: {
            academicPressureScore: 8, // Red flag!
            graduationAnxietyScore: 8,
            needsImmediateHelp: false,
            triggeredAlert: true,
            createdAt: new Date(Date.now() - 5 * 3600000).toISOString()
          },
          riasecResponses: {
            1:3, 2:3, 3:3, 4:2, 5:3, // R
            6:5, 7:5, 8:5, 9:5, 10:5, // I
            11:2, 12:2, 13:3, 14:3, 15:2, // A
            16:4, 17:4, 18:4, 19:4, 20:5, // S
            21:3, 22:3, 23:2, 24:3, 25:3, // E
            26:4, 27:4, 28:5, 29:4, 30:4  // C
          },
          riasecScores: {
            R: 14, I: 25, A: 12, S: 21, E: 14, C: 21,
            top3Code: "ISC"
          },
          actionPlan: {
            goal: "Kedokteran Gigi Universitas Airlangga (UNAIR)",
            challengeLevel: 8,
            emotionText: "Cemas, ragu-ragu, tertekan",
            negativeThought: "Skor try-out saya baru 550, sedangkan kedokteran UNAIR butuh minimal 680. Saya pasti tersingkir dan dicap gagal oleh guru biologi saya.",
            evidenceNegative: "Dua kali simulasi ujian mandiri sekolah, hasil skor saya masih tertinggal.",
            counterEvidence: "Nilai biologi dan kimia saya selalu menduduki ranking 3 besar paralel di sekolah, dan tipe kepribadian saya sangat condong ke Investigative (Investigatif/Analitis) dan Social (Penolong) yang sempurna untuk profesi medis.",
            alternativeView: "Siti, jangan berkecil hati. Try-out itu media latihan, bukan vonis mutlak. Kamu masih punya waktu 3 bulan untuk mengevaluasi bab soal yang lemah. Kredibilitas biologi rapor-mu membuktikan kemampuan akademismu tangguh.",
            newBelief: "Perjalanan menuju dokter gigi UNAIR memang menantang, namun kemampuan biologi/analitis saya dan kemauan penolong saya adalah modal terkuat. Saya akan belajar lebih taktis menghadapi try-out berikutnya!",
            selectedCommitments: [
              "Membuka website resmi kampus/instansi target untuk mencatat daya tampung dan syarat masuknya.",
              "Mencoba mengerjakan simulasi soal-soal seleksi (UTBK/Kedinasan) secara mandiri setidaknya seminggu sekali.",
              "Mengatur jadwal belajar harian secara teratur dan konsisten untuk menaikkan nilai mata pelajaran pendukung."
            ],
            monthlyActions: [
              "Membedah 10 soal try-out kimia/biologi yang salah setiap sore.",
              "Membuat jadwal review materi bab fisiologi tubuh secara khusus.",
              "Mengikuti try-out eksternal dua minggu sekali."
            ]
          },
          evaluation: {
            understandingScore: 8,
            comfortScore: 8,
            actionScore: 9,
            notes: "Saya mendapat kejelasan mengenai kelemahan try-out dan merasa tertantang untuk memperbaikinya ketimbang merenungi kegagalan.",
            postAnxietyScore: 3, // Great reduction from 8!
            counselorDiscussion: "Ingin mendiskusikan strategi pemilihan jalur cadangan mandiri PTS Kedokteran Gigi.",
            sentToCounselor: true,
            sentAt: new Date(Date.now() - 4.5 * 3600000).toISOString()
          }
        },
        {
          id: "mock_budi_pratama",
          createdAt: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
          profile: {
            name: "Budi Pratama",
            className: "XI-MIPA 1",
            consentChecked: true,
            confidenceScore: 6,
            mainProblem: "Bingung memilih antara fokus ke kuliah Teknik Elektro ITS atau langsung mendaftar Sekolah Kedinasan STIS karena pertimbangan biaya.",
            prepNotes: "Sudah mencatat daftar syarat masuk STIS dan ITS."
          },
          screeningResponses: {
            S1: 1, S2: 2, S3: 2, S4: 2, S5: 2, S6: 2, S7: 1, S8: 1
          },
          anxietyLogs: {
            academicPressureScore: 5,
            graduationAnxietyScore: 5, // Stable!
            needsImmediateHelp: false,
            triggeredAlert: false,
            createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
          },
          riasecResponses: {
            1:5, 2:4, 3:5, 4:5, 5:5, // R
            6:4, 7:4, 8:4, 9:4, 10:4, // I
            11:2, 12:1, 13:2, 14:2, 15:1, // A
            16:3, 17:3, 18:2, 19:3, 20:3, // S
            21:3, 22:3, 23:4, 24:3, 25:3, // E
            26:4, 27:5, 28:4, 29:5, 30:5  // C
          },
          riasecScores: {
            R: 24, I: 20, A: 8, S: 14, E: 16, C: 23,
            top3Code: "RCI"
          },
          actionPlan: {
            goal: "Teknik Elektro ITS / Statistika STIS (Ikatan Dinas)",
            challengeLevel: 6,
            emotionText: "Dilema, ragu-ragu",
            negativeThought: "Jika saya memilih ITS, biaya kuliahnya bisa membebani adik-adik saya. Namun jika memilih STIS, saya khawatir seleksi klerikal statistiknya sangat membosankan.",
            evidenceNegative: "Uang kuliah tunggal PTN saat ini melambung tinggi, dan persaingan beasiswa sangat ketat.",
            counterEvidence: "Nilai matematika dan fisika saya konsisten di atas 90. Tipe kepribadian saya RCI (Realistic-Conventional-Investigative) yang mana merupakan kecocokan absolut baik untuk teknik praktis maupun olah data statistika STIS.",
            alternativeView: "Budi, ini dilema yang sehat, bukan kebuntuan. Kedua jalurmu sangat cemerlang dan selaras dengan kecenderungan alamiahmu yang teratur dan praktis. Kamu bisa mencoba mendaftar keduanya sekaligus tanpa rasa bersalah.",
            newBelief: "Saya beruntung memiliki otak analitis dan ketelitian data yang kuat. Saya akan mendaftar jalur Kedinasan STIS sebagai prioritas bebas biaya, dan mempersiapkan seleksi mandiri ITS dengan opsi beasiswa KIP Kuliah!",
            selectedCommitments: [
              "Membuka website resmi kampus/instansi target untuk mencatat daya tampung dan syarat masuknya.",
              "Mengajak orang tua berdiskusi dengan kepala dingin mengenai pilihan jurusan dan rencana cadangannya.",
              "Mencoba mengerjakan simulasi soal-soal seleksi (UTBK/Kedinasan) secara mandiri setidaknya seminggu sekali."
            ],
            monthlyActions: [
              "Mempelajari silabus materi seleksi masuk STIS semester lalu.",
              "Berdiskusi dengan kakak tingkat yang berkuliah di Elektro ITS.",
              "Mengajukan syarat KIP-Kuliah ke tata usaha sekolah."
            ]
          },
          evaluation: {
            understandingScore: 9,
            comfortScore: 9,
            actionScore: 8,
            notes: "Proses pemetaan RIASEC membantu saya mengafirmasi bahwa data statistika dan teknik elektro sama-sama bidang terkuat saya.",
            postAnxietyScore: 4,
            counselorDiscussion: "Ingin berkonsultasi mengenai proses pengajuan beasiswa KIP Kuliah di sekolah.",
            sentToCounselor: true,
            sentAt: new Date(Date.now() - 23.5 * 3600000).toISOString()
          }
        }
      ];

      for (const session of mockSessions) {
        await fetch('/api/student/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(session)
        });
      }
      
      await fetchData(passcode);
      alert("Berhasil menambahkan 3 contoh data simulasi siswa BK ke database server secara real-time!");
    } catch (err: any) {
      alert(`Gagal simulasi data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all data
  const handleClearAllData = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus seluruh data siswa di database server? Tindakan ini tidak dapat dibatalkan.")) {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/counselor/students?passcode=${passcode}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          setSessions([]);
          localStorage.removeItem('ruangkarier_student_session');
          alert("Seluruh database server berhasil dikosongkan.");
        } else {
          const err = await res.json();
          alert(`Gagal mengosongkan database: ${err.error}`);
        }
      } catch (err: any) {
        alert(`Error: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Individual session delete
  const handleDeleteSession = async (id: string) => {
    if (confirm("Hapus data pengerjaan siswa ini dari database server?")) {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/counselor/students?passcode=${passcode}&id=${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          setSessions(prev => prev.filter(s => s.id !== id));
          alert("Data siswa berhasil dihapus.");
        } else {
          const err = await res.json();
          alert(`Gagal menghapus data siswa: ${err.error}`);
        }
      } catch (err: any) {
        alert(`Error: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8 select-none">
      
      {/* 🚀 Dashboard Title and Mock Controls banner */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-primary/5 pb-6">
        <div className="text-left flex flex-col gap-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-primary border border-secondary/20 w-fit text-[10px] font-bold tracking-wider uppercase font-heading">
            CBT &amp; RIASEC Analytics Hub
          </div>
          <h1 className="text-3xl font-extrabold text-primary font-heading tracking-tight leading-none mt-1">
            Dasbor Analitik Guru BK 🏫
          </h1>
          <p className="text-xs text-muted-gray">
            Pusat monitoring bimbingan kelompok karier mandiri, monitoring tingkat kecemasan, dan pengelolaan berkas portofolio siswa.
          </p>
        </div>

        {/* Action button controls */}
        <div className="flex items-center gap-2 select-none self-start sm:self-center">
          <button
            onClick={handleSeedMockData}
            className="flex items-center gap-1.5 py-2.5 px-4 bg-white border-2 border-dashed border-secondary hover:bg-secondary/10 text-primary text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <Sparkles size={15} className="text-secondary" />
            <span>Simulasi Data BK</span>
          </button>
          
          <button
            onClick={handleClearAllData}
            className="flex items-center gap-1.5 py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-all cursor-pointer border border-rose-200"
          >
            <Trash2 size={15} />
            <span>Kosongkan</span>
          </button>
        </div>
      </section>

      {/* 📊 KPI Statistics Dashboard Card Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Total */}
        <div className="bg-white rounded-3xl p-5 border border-primary/5 shadow-sm flex flex-col text-left gap-1 relative overflow-hidden">
          <div className="absolute right-4 top-4 text-primary/10">
            <Users size={40} className="stroke-[1.5]" />
          </div>
          <span className="text-[10px] uppercase font-bold text-muted-gray leading-none">Partisipasi Siswa</span>
          <span className="text-3xl font-black text-primary font-heading mt-2">{totalStudents}</span>
          <span className="text-[9px] text-muted-gray mt-1">Siswa Terdaftar Aktif</span>
        </div>

        {/* Card 2: Red Flags */}
        <div className={`rounded-3xl p-5 border shadow-sm flex flex-col text-left gap-1 relative overflow-hidden ${
          redFlagsCount > 0 
            ? 'bg-amber-500/5 border-accent text-accent' 
            : 'bg-white border-primary/5 text-primary'
        }`}>
          <div className="absolute right-4 top-4 text-accent/15">
            <ShieldAlert size={40} className="stroke-[1.5]" />
          </div>
          <span className="text-[10px] uppercase font-bold text-muted-gray leading-none">Tindak Lanjut Prioritas</span>
          <span className="text-3xl font-black font-heading mt-2">{redFlagsCount}</span>
          <span className="text-[9px] text-muted-gray mt-1">Kasus Red-Flag Terpemicu</span>
        </div>

        {/* Card 3: Initial Anxiety */}
        <div className="bg-white rounded-3xl p-5 border border-primary/5 shadow-sm flex flex-col text-left gap-1 relative overflow-hidden">
          <div className="absolute right-4 top-4 text-primary/10">
            <TrendingDown size={40} className="stroke-[1.5]" />
          </div>
          <span className="text-[10px] uppercase font-bold text-muted-gray leading-none">Rerata Cemas Awal</span>
          <span className="text-3xl font-black text-primary font-heading mt-2">
            {avgInitialAnxiety} <span className="text-xs text-muted-gray font-normal">/10</span>
          </span>
          <span className="text-[9px] text-muted-gray mt-1">Skala Ketegangan Remaja</span>
        </div>

        {/* Card 4: Post Anxiety */}
        <div className="bg-white rounded-3xl p-5 border border-primary/5 shadow-sm flex flex-col text-left gap-1 relative overflow-hidden">
          <div className="absolute right-4 top-4 text-emerald-500/10">
            <CheckCircle size={40} className="stroke-[1.5]" />
          </div>
          <span className="text-[10px] uppercase font-bold text-muted-gray leading-none">Rerata Cemas Akhir</span>
          <span className="text-3xl font-black text-secondary font-heading mt-2">
            {avgPostAnxiety} <span className="text-xs text-muted-gray font-normal">/10</span>
          </span>
          <span className="text-[9px] text-emerald-600 font-bold mt-1">✓ Terjadi Penurunan Signifikan</span>
        </div>

        {/* Card 5: Completion Rate */}
        <div className="bg-white rounded-3xl p-5 border border-primary/5 shadow-sm flex flex-col text-left gap-1 relative overflow-hidden col-span-2 lg:col-span-1">
          <div className="absolute right-4 top-4 text-primary/10">
            <Award size={40} className="stroke-[1.5]" />
          </div>
          <span className="text-[10px] uppercase font-bold text-muted-gray leading-none">Penyelesaian LKPD</span>
          <span className="text-3xl font-black text-primary font-heading mt-2">{completionRate}%</span>
          <span className="text-[9px] text-muted-gray mt-1">Portofolio Berhasil Dikirim</span>
        </div>

      </section>

      {/* 🔴 RED FLAGS Live Alert Feed */}
      {redFlagsCount > 0 && (
        <section className="bg-amber-500/5 border-2 border-accent rounded-3xl p-6 text-left flex flex-col gap-4 animate-fade-in-up">
          <div className="flex items-center gap-2 text-accent border-b border-accent/20 pb-3">
            <ShieldAlert size={20} className="stroke-[2.5]" />
            <h3 className="text-sm font-extrabold font-heading tracking-wide uppercase">
              TINDAKAN KONSULTASI PRIORITAS (RED-FLAGS TRIGGERED)
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions
              .filter(s => s.anxietyLogs?.triggeredAlert || s.anxietyLogs?.needsImmediateHelp)
              .map((flag) => (
                <div 
                  key={flag.id}
                  className="bg-white rounded-2xl p-4 border border-accent/20 shadow-sm flex flex-col justify-between gap-4 interactive-hover"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-bold text-primary font-heading">{flag.profile?.name}</span>
                      <span className="text-[9px] font-extrabold font-heading px-2 py-0.5 rounded-full bg-accent/20 text-accent uppercase">
                        {flag.profile?.className}
                      </span>
                    </div>
                    <span className="text-[9px] text-muted-gray">Skala Cemas: {flag.anxietyLogs?.graduationAnxietyScore}/10 | Target: {flag.actionPlan?.goal || 'Belum terisi'}</span>
                    
                    <p className="text-[10.5px] text-text-dark/95 italic bg-bg-warm/60 p-2.5 rounded-xl border border-primary/5 leading-relaxed mt-2 shadow-inner">
                      &ldquo;{flag.profile?.mainProblem}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-2 select-none border-t border-primary/5 pt-3">
                    <button
                      onClick={() => handleFollowUpWhatsApp(flag)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10.5px] rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      <MessageCircle size={14} className="fill-white/10" />
                      <span>Follow-up WhatsApp</span>
                    </button>
                    
                    <Link
                      href={`/portfolio/${flag.id}`}
                      className="flex items-center justify-center gap-1 py-2 px-3 bg-primary hover:bg-primary-light text-white font-bold text-[10.5px] rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      <FileText size={14} />
                      <span>Portofolio</span>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* 🗂️ Student Database Records Table */}
      <section className="bg-white/80 rounded-3xl p-6 md:p-8 border border-primary/5 shadow-xl glass-card flex flex-col gap-6 text-left">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-primary/5 pb-4">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-md font-bold font-heading text-primary">
              Database Pengerjaan Bimbingan Siswa
            </h3>
            <p className="text-[10px] text-muted-gray">
              Tabel pencarian profil, kecocokan Holland, dan progress tindakan restrukturisasi.
            </p>
          </div>

          {/* Search filters */}
          <div className="flex flex-wrap items-center gap-2 select-none">
            <div className="relative w-full sm:w-56">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-gray pointer-events-none">
                <Search size={14} />
              </span>
              <input 
                type="text"
                placeholder="Cari nama, kode Holland, target..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-9 pr-4 rounded-xl border border-primary/10 text-xs bg-white focus:outline-none focus:border-secondary transition-all"
              />
            </div>

            <select 
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="py-2 px-3 rounded-xl border border-primary/10 text-xs bg-white focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Kelas</option>
              {distinctClasses.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Datatable */}
        <div className="overflow-x-auto rounded-2xl border border-primary/10 bg-white shadow-inner">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-primary text-white font-heading text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4 text-center">Holland Code</th>
                <th className="py-3 px-4 text-center">Cemas Awal</th>
                <th className="py-3 px-4 text-center">Cemas Akhir</th>
                <th className="py-3 px-4">Kampus/Karir Impian</th>
                <th className="py-3 px-4 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((student) => {
                  const riasec = student.riasecScores?.top3Code || 'Belum Tes';
                  const goal = student.actionPlan?.goal || 'Belum mengisi LKPD';
                  const isRedFlag = student.anxietyLogs?.triggeredAlert || student.anxietyLogs?.needsImmediateHelp;
                  
                  return (
                    <tr 
                      key={student.id} 
                      className={`hover:bg-primary/5 transition-all ${
                        isRedFlag ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-primary whitespace-nowrap">
                        {student.profile?.name}
                      </td>
                      <td className="py-3 px-4 font-medium whitespace-nowrap">
                        {student.profile?.className}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase font-heading ${
                          riasec === 'Belum Tes' 
                            ? 'bg-slate-100 text-slate-400 font-semibold' 
                            : 'bg-secondary text-primary border border-secondary/20'
                        }`}>
                          {riasec}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-text-dark whitespace-nowrap">
                        {student.anxietyLogs?.graduationAnxietyScore ?? '-'}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-secondary whitespace-nowrap">
                        {student.evaluation?.postAnxietyScore ?? '-'}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate font-medium text-text-dark/80">
                        {goal}
                      </td>
                      <td className="py-3 px-4 select-none whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/portfolio/${student.id}`}
                            className="flex items-center gap-1 py-1.5 px-3 bg-primary hover:bg-primary-light text-white text-[10px] font-bold rounded-lg transition-all"
                          >
                            <FileText size={12} />
                            <span>Lihat Portofolio</span>
                          </Link>
                          
                          <button
                            onClick={() => handleDeleteSession(student.id)}
                            className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-all border border-transparent hover:border-rose-200 cursor-pointer"
                            title="Hapus Data"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 px-4 text-center text-xs text-muted-gray leading-normal">
                    <p className="font-semibold text-primary">Tidak Ada Data Siswa Ditemukan</p>
                    <p className="mt-1">Gunakan tombol &ldquo;Simulasi Data BK&rdquo; di atas untuk mengisi contoh data siswa instan secara otomatis!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </main>
  );
}
