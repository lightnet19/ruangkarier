'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Search, 
  ClipboardList, 
  MessageSquareHeart, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Users,
  LogIn,
  UserPlus
} from 'lucide-react';

export default function Home() {
  const [progress, setProgress] = useState({
    consent: false,
    screening: false,
    riasec: false,
    actionPlan: false,
    evaluation: false
  });
  const [hasStarted, setHasStarted] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Load student data from localStorage to show current progress on landing page cards
    try {
      const studentSession = localStorage.getItem('ruangkarier_student_session');
      if (studentSession) {
        const data = JSON.parse(studentSession);
        setUserName(data.profile?.name || '');
        setProgress({
          consent: !!data.profile?.consentChecked,
          screening: !!(data.screeningResponses && Object.keys(data.screeningResponses).length > 0),
          riasec: !!(data.riasecScores && Object.keys(data.riasecScores).length > 0),
          actionPlan: !!(data.actionPlan && data.actionPlan.goal),
          evaluation: !!(data.evaluation && data.evaluation.notes)
        });
        setHasStarted(true);
      }
    } catch (e) {
      console.error("Failed to load session progress:", e);
    }
  }, []);

  // Calculate percentages for 4 main cards
  const getCardProgress = (cardNum: number) => {
    if (cardNum === 1) {
      // Card 1: Kenali Diri (Consent, Screening, RIASEC)
      let score = 0;
      if (progress.consent) score += 30;
      if (progress.screening) score += 30;
      if (progress.riasec) score += 40;
      return score;
    }
    if (cardNum === 2) {
      // Card 2: Jelajah Karier (Unlocked once RIASEC is filled)
      return progress.riasec ? 100 : 0;
    }
    if (cardNum === 3) {
      // Card 3: Ruang Aksi (LKPD CBT Planner)
      return progress.actionPlan ? 100 : 0;
    }
    if (cardNum === 4) {
      // Card 4: Evaluasi & RTL (UCE and Booking BK)
      return progress.evaluation ? 100 : 0;
    }
    return 0;
  };

  return (
    <main className="flex-1 flex flex-col items-center">
      {/* 🚀 Premium Hero Section */}
      <section className="relative w-full max-w-6xl mx-auto px-4 md:px-8 pt-12 pb-16 md:py-20 flex flex-col md:flex-row items-center gap-12">
        {/* Glow Effects Background */}
        <div className="absolute top-1/4 left-1/4 -z-10 w-72 h-72 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 -z-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />

        {/* Text Content */}
        <div className="flex-1 text-left flex flex-col gap-6 select-none animate-fade-in-up">
          {/* Brand Logo Display */}
          <div className="h-12 w-auto max-w-[240px] relative mb-2">
            <img src="/logo.png" alt="Logo Ruang Karier" className="h-full w-auto object-contain" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-secondary/15 text-primary border border-secondary/20 w-fit">
            <ShieldCheck size={16} className="text-secondary fill-secondary/10" />
            <span className="text-xs font-bold font-heading tracking-wide uppercase">
              Web Career Self-Defense Portal
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary font-heading leading-tight tracking-tight">
            Ubah Kegalauan Karier <br />
            Menjadi <span className="text-secondary relative inline-block">
              Rencana Pasti
              <span className="absolute left-0 bottom-1 w-full h-2.5 bg-accent/20 -z-10 rounded" />
            </span>
          </h1>

          <p className="text-sm md:text-md text-text-dark/85 leading-relaxed max-w-xl">
            Selamat datang di safe space bimbingan karier digital Anda. Dirancang khusus bagi siswa SMA/MA/SMK untuk memetakan potensi diri (Holland RIASEC), menepis kecemasan masa depan melalui restrukturisasi kognitif (CBT), dan menyusun Career Action Plan nyata.
          </p>

          <div className="flex flex-wrap gap-3 mt-2">
            <Link 
              href={hasStarted ? '/student' : '/register'} 
              className="flex items-center gap-2 py-4 px-6 md:px-8 bg-primary hover:bg-primary-light text-white text-sm font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              {hasStarted ? (
                <><LogIn size={18} className="text-secondary" /><span>Lanjutkan Eksplorasi ({userName})</span></>
              ) : (
                <><UserPlus size={18} className="text-secondary" /><span>Daftar & Mulai Sekarang</span></>
              )}
            </Link>
            
            <Link 
              href="/login?tab=counselor" 
              className="flex items-center gap-2 py-4 px-6 bg-white/70 hover:bg-white text-primary text-sm font-bold rounded-2xl border border-primary/10 transition-all cursor-pointer"
            >
              <Users size={18} />
              <span>Portal Guru BK</span>
            </Link>

            <Link 
              href="/login?tab=admin" 
              className="flex items-center gap-2 py-3 px-5 bg-transparent hover:bg-primary/5 text-primary/50 hover:text-primary text-xs font-semibold rounded-2xl border border-primary/10 transition-all cursor-pointer"
            >
              <ShieldCheck size={14} />
              <span>Admin</span>
            </Link>
          </div>
        </div>

        {/* Hero Visual Block */}
        <div className="flex-1 w-full max-w-md md:max-w-lg aspect-square relative select-none flex items-center justify-center">
          
          {/* Main Visual Shape mimicking logo/concept */}
          <div className="w-80 h-80 rounded-[48px] bg-gradient-to-tr from-primary to-secondary/40 shadow-2xl relative flex items-center justify-center p-8 animate-float">
            
            {/* Glossy Overlay Box represent gawai/screen */}
            <div className="absolute inset-4 rounded-[36px] bg-white/20 backdrop-blur-md border border-white/30 flex flex-col justify-between p-6">
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-400" />
                  <span className="w-3 h-3 rounded-full bg-accent" />
                  <span className="w-3 h-3 rounded-full bg-secondary" />
                </div>
                <div className="px-2 py-0.5 rounded-full bg-white/30 text-[10px] text-primary font-bold">
                  Live Asesmen
                </div>
              </div>

              {/* Central Illustration mimics silhouette head and compass */}
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center my-4">
                <div className="w-20 h-20 rounded-full bg-bg-warm/95 shadow-lg flex items-center justify-center text-primary border-4 border-secondary animate-pulse">
                  <Compass size={40} className="text-secondary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white font-heading tracking-wide">
                    PETA JALUR KARIER
                  </span>
                  <span className="text-[10px] text-white/80">
                    Mengarahkan Minat &amp; Mengelola Kecemasan
                  </span>
                </div>
              </div>

              {/* Bottom tag line in visual block */}
              <div className="bg-white/80 rounded-xl py-2 px-3 border border-white/50 text-center shadow-sm">
                <p className="text-[10px] font-bold text-primary font-heading">
                  🚀 94% Siswa Merasa Lebih Tenang Pasca Bimbingan
                </p>
              </div>

            </div>

            {/* Float Elements */}
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-lg text-white">
              <Sparkles size={22} />
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white rounded-3xl flex flex-col items-center justify-center shadow-xl text-primary border border-primary/5">
              <TrendingUp size={22} className="text-secondary" />
              <span className="text-[8px] font-extrabold mt-0.5 uppercase tracking-tighter">RIASEC</span>
            </div>

          </div>

        </div>
      </section>

      {/* 🔮 Method & Rationale section */}
      <section className="w-full bg-white/40 border-y border-primary/5 py-16 px-4 md:px-8 select-none">
        <div className="max-w-6xl mx-auto text-center flex flex-col gap-12">
          
          <div className="flex flex-col items-center gap-2 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary font-heading tracking-tight">
              Metode &amp; Pendekatan Kita 💡
            </h2>
            <p className="text-sm text-text-dark/80 leading-relaxed">
              Kami menggabungkan ilmu psikologi perkembangan remaja dan metodologi bimbingan konseling modern untuk melindungimu dari kecemasan berlebih.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Box 1 */}
            <div className="bg-white/80 rounded-3xl p-6 border border-primary/5 shadow-sm text-left flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
                <Compass size={20} className="stroke-[2.5]" />
              </div>
              <h3 className="text-md font-bold font-heading text-primary">
                Tipologi RIASEC Holland
              </h3>
              <p className="text-xs text-text-dark/80 leading-relaxed">
                Mengevaluasi 6 dimensi kecenderungan minat (Realistic, Investigative, Artistic, Social, Enterprising, Conventional) secara presisi untuk mencocokkan kepribadianmu dengan pilihan karir yang ideal.
              </p>
            </div>

            {/* Box 2 */}
            <div className="bg-white/80 rounded-3xl p-6 border border-primary/5 shadow-sm text-left flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                <ShieldCheck size={20} className="stroke-[2.5]" />
              </div>
              <h3 className="text-md font-bold font-heading text-primary">
                Cognitive Restructuring (CBT)
              </h3>
              <p className="text-xs text-text-dark/80 leading-relaxed">
                Melalui lembar kerja adaptif, kamu dipandu membongkar pikiran-pikiran negatif atau ketakutan buruk mengenai masa depan, lalu merekonstruksinya menjadi keyakinan baru yang tangguh &amp; optimis.
              </p>
            </div>

            {/* Box 3 */}
            <div className="bg-white/80 rounded-3xl p-6 border border-primary/5 shadow-sm text-left flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                <ClipboardList size={20} className="stroke-[2.5]" />
              </div>
              <h3 className="text-md font-bold font-heading text-primary">
                Sistem Pemicu Pengaman
              </h3>
              <p className="text-xs text-text-dark/80 leading-relaxed">
                Dilengkapi dengan sensor tingkat stres akademik dan kecemasan real-time. Jika kecemasan terdeteksi melampaui batas wajar, sistem akan memicu Safety Card penenang dan menghubungkanmu ke Guru BK.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 🗺️ Interactive Dashboard grid (4 Cards) */}
      <section className="w-full max-w-6xl mx-auto px-4 md:px-8 py-16 text-center select-none animate-fade-in-up">
        
        <div className="flex flex-col items-center gap-2 mb-12">
          <span className="text-xs font-bold text-secondary font-heading uppercase tracking-widest">
            MENU UTAMA Bimbel Mandiri
          </span>
          <h2 className="text-3xl font-extrabold text-primary font-heading tracking-tight">
            Dashboard Eksplorasi Karier Anda 🗂️
          </h2>
          <p className="text-sm text-text-dark/85 max-w-xl leading-relaxed">
            Selesaikan setiap kartu bimbingan di bawah ini secara bertahap. Kemajuan Anda disimpan secara otomatis untuk diserahkan sebagai portofolio akhir ke Guru BK.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="glass-card rounded-3xl p-6 border border-primary/5 flex flex-col text-left justify-between interactive-hover relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Compass size={24} />
                </div>
                <span className="text-[10px] font-bold font-heading px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 uppercase">
                  Langkah 1
                </span>
              </div>
              <h3 className="text-md font-bold font-heading text-primary mb-2">
                Card 1: Kenali Diriku
              </h3>
              <p className="text-xs text-text-dark/80 leading-relaxed mb-6">
                Lengkapi Profil Awal, Skrining Hambatan Internal-Eksternal, Cek Stres, serta ikuti 30 butir Kuis Minat RIASEC Holland.
              </p>
            </div>

            <div className="mt-auto">
              {/* Progress and Action */}
              <div className="flex items-center justify-between text-xs font-semibold mb-3">
                <span className="text-muted-gray">Progress</span>
                <span className="text-indigo-700">{getCardProgress(1)}%</span>
              </div>
              <div className="w-full bg-primary/5 h-2 rounded-full mb-6 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${getCardProgress(1)}%` }} 
                />
              </div>
              
              <Link 
                href="/student" 
                className="flex items-center justify-between w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <span>{getCardProgress(1) > 0 ? 'Lanjutkan Tes' : 'Mulai Sekarang'}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card rounded-3xl p-6 border border-primary/5 flex flex-col text-left justify-between interactive-hover relative">
            {!progress.riasec && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-3xl flex flex-col items-center justify-center p-4 text-center z-10">
                <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center mb-2">
                  🔒
                </div>
                <span className="text-xs font-bold font-heading text-primary">Terkunci</span>
                <p className="text-[10px] text-muted-gray max-w-[150px] mt-1 leading-normal">
                  Selesaikan Kuis RIASEC pada Card 1 untuk membuka menu ini.
                </p>
              </div>
            )}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Search size={24} />
                </div>
                <span className="text-[10px] font-bold font-heading px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 uppercase">
                  Langkah 2
                </span>
              </div>
              <h3 className="text-md font-bold font-heading text-primary mb-2">
                Card 2: Jelajah Karier
              </h3>
              <p className="text-xs text-text-dark/80 leading-relaxed mb-6">
                Eksplorasi multi-jalur (PTN, PTS, PTKIN, Sekolah Kedinasan, Kerja, Wirausaha) yang auto-filter sesuai kode minat Holland-mu.
              </p>
            </div>

            <div className="mt-auto">
              <div className="flex items-center justify-between text-xs font-semibold mb-3">
                <span className="text-muted-gray">Progress</span>
                <span className="text-emerald-700">{getCardProgress(2)}%</span>
              </div>
              <div className="w-full bg-primary/5 h-2 rounded-full mb-6 overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${getCardProgress(2)}%` }} 
                />
              </div>
              
              <Link 
                href="/student?step=4" 
                className="flex items-center justify-between w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <span>Buka Jelajah</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card rounded-3xl p-6 border border-primary/5 flex flex-col text-left justify-between interactive-hover relative">
            {!progress.riasec && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-3xl flex flex-col items-center justify-center p-4 text-center z-10">
                <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center mb-2">
                  🔒
                </div>
                <span className="text-xs font-bold font-heading text-primary">Terkunci</span>
                <p className="text-[10px] text-muted-gray max-w-[150px] mt-1 leading-normal">
                  Selesaikan Kuis RIASEC pada Card 1 untuk membuka menu ini.
                </p>
              </div>
            )}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <ClipboardList size={24} />
                </div>
                <span className="text-[10px] font-bold font-heading px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 uppercase">
                  Langkah 3
                </span>
              </div>
              <h3 className="text-md font-bold font-heading text-primary mb-2">
                Card 3: Ruang Aksi (LKPD)
              </h3>
              <p className="text-xs text-text-dark/80 leading-relaxed mb-6">
                Tulis rencana aksi karier riil (CBT), periksa pikiran penghambat, temukan fakta penyeimbang, dan bangun komitmen checklist tindakan.
              </p>
            </div>

            <div className="mt-auto">
              <div className="flex items-center justify-between text-xs font-semibold mb-3">
                <span className="text-muted-gray">Progress</span>
                <span className="text-amber-700">{getCardProgress(3)}%</span>
              </div>
              <div className="w-full bg-primary/5 h-2 rounded-full mb-6 overflow-hidden">
                <div 
                  className="bg-accent h-full rounded-full transition-all duration-500" 
                  style={{ width: `${getCardProgress(3)}%` }} 
                />
              </div>
              
              <Link 
                href="/student?step=5" 
                className="flex items-center justify-between w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <span>Buka LKPD</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-card rounded-3xl p-6 border border-primary/5 flex flex-col text-left justify-between interactive-hover relative">
            {!progress.actionPlan && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-3xl flex flex-col items-center justify-center p-4 text-center z-10">
                <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center mb-2">
                  🔒
                </div>
                <span className="text-xs font-bold font-heading text-primary">Terkunci</span>
                <p className="text-[10px] text-muted-gray max-w-[150px] mt-1 leading-normal">
                  Selesaikan LKPD pada Card 3 untuk membuka menu ini.
                </p>
              </div>
            )}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
                  <MessageSquareHeart size={24} />
                </div>
                <span className="text-[10px] font-bold font-heading px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 uppercase">
                  Langkah 4
                </span>
              </div>
              <h3 className="text-md font-bold font-heading text-primary mb-2">
                Card 4: Evaluasi &amp; RTL
              </h3>
              <p className="text-xs text-text-dark/80 leading-relaxed mb-6">
                Evaluasi perasaanmu pasca-bimbingan (UCE model), bandingkan skor cemas, dan kirimkan portofolio PDF final Anda ke Guru BK.
              </p>
            </div>

            <div className="mt-auto">
              <div className="flex items-center justify-between text-xs font-semibold mb-3">
                <span className="text-muted-gray">Progress</span>
                <span className="text-rose-700">{getCardProgress(4)}%</span>
              </div>
              <div className="w-full bg-primary/5 h-2 rounded-full mb-6 overflow-hidden">
                <div 
                  className="bg-rose-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${getCardProgress(4)}%` }} 
                />
              </div>
              
              <Link 
                href="/student?step=6" 
                className="flex items-center justify-between w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <span>Evaluasi Akhir</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>

      </section>

      {/* 📊 Trust stats / counselor note footer banner */}
      <section className="w-full max-w-6xl mx-auto px-4 md:px-8 pb-16 select-none animate-fade-in-up">
        <div className="w-full bg-gradient-to-tr from-primary to-primary-light rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-secondary/15 rounded-full blur-2xl" />
          
          <div className="flex flex-col gap-2 text-left">
            <h3 className="text-lg md:text-xl font-bold font-heading">
              Butuh Konseling Individual Secara Langsung? 🏫
            </h3>
            <p className="text-xs text-white/80 max-w-xl leading-relaxed">
              Ingat, Anda tidak sendirian. Guru Bimbingan dan Konseling (BK) sekolah siap menyambut kehadiran Anda untuk berdiskusi, melegakan perasaan, serta merencanakan masa depan bersama dengan aman dan tertutup.
            </p>
          </div>

          <div className="flex items-center gap-6 self-start md:self-center">
            <div className="flex -space-x-3 select-none">
              <div className="w-10 h-10 rounded-full bg-secondary text-primary font-black border-2 border-primary flex items-center justify-center text-xs">BK</div>
              <div className="w-10 h-10 rounded-full bg-accent text-primary font-black border-2 border-primary flex items-center justify-center text-xs">CBT</div>
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-black border-2 border-primary flex items-center justify-center text-xs">✓</div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-white/95 font-bold leading-tight font-heading">Konseling Sekolah</span>
              <span className="text-[10px] text-white/60">Tersedia Setiap Hari Kerja</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
