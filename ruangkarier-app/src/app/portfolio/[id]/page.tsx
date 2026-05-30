'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Printer, 
  ArrowLeft, 
  GraduationCap, 
  Calendar, 
  CheckSquare, 
  AlertTriangle,
  Smile,
  FileBadge
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { RiasecChart } from '@/components/RiasecChart';
import { riasecDescriptions } from '@/data/riasecQuestions';

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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StudentPortfolio({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  
  const [sessions] = useLocalStorage<StudentSession[]>('ruangkarier_submissions', []);
  const [session, setSession] = useState<StudentSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessions.length > 0 && id) {
      const match = sessions.find(s => s.id === id);
      if (match) {
        setSession(match);
      }
    }
    setIsLoading(false);
  }, [id, sessions]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 select-none">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary" />
      </div>
    );
  }

  if (!session || !session.profile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4 select-none">
        <AlertTriangle size={48} className="text-accent" />
        <h2 className="text-lg font-bold text-primary font-heading">Portofolio Tidak Ditemukan</h2>
        <p className="text-xs text-muted-gray">Maaf, data pengerjaan tidak dapat ditemukan di database lokal ini.</p>
        <Link href="/" className="py-2.5 px-6 bg-primary text-white text-xs font-bold rounded-xl shadow-md">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const { profile, riasecScores, actionPlan, evaluation, anxietyLogs } = session;
  const topCode = riasecScores?.top3Code || '???';
  const createdDate = new Date(session.createdAt).toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6 select-none">
      
      {/* 🖨️ Top sticky actions banner (Hidden on print) */}
      <section className="bg-primary/95 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg no-print backdrop-blur-md sticky top-16 z-30 border border-white/10">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="text-left flex flex-col">
            <span className="text-xs font-bold font-heading text-secondary leading-none mb-0.5">Portofolio Mandiri Siswa</span>
            <span className="text-sm font-black font-heading leading-tight">{profile.name} ({profile.className})</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 py-2.5 px-5 bg-secondary hover:bg-secondary-light text-primary text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <Printer size={16} />
            <span>Cetak / Ekspor PDF</span>
          </button>
          
          <Link
            href="/"
            className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all"
          >
            Beranda
          </Link>
        </div>
      </section>

      {/* 📄 Formal Printable Document Container */}
      <article className="bg-white rounded-3xl p-8 md:p-12 border border-primary/5 shadow-xl print-card flex flex-col gap-8 text-left text-text-dark font-sans relative">
        
        {/* Document watermark/badge */}
        <div className="absolute top-8 right-8 text-primary opacity-10 no-print">
          <FileBadge size={120} className="stroke-[1]" />
        </div>

        {/* 1. Formal Document Header (KOP Surat Sekolah BK) */}
        <header className="border-b-4 border-primary pb-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white">
              <GraduationCap size={32} className="text-secondary" />
            </div>
            <div className="text-left flex flex-col">
              <span className="text-lg font-black font-heading tracking-wide uppercase text-primary leading-tight">
                RuangKarier
              </span>
              <span className="text-xxs font-bold text-muted-gray tracking-widest uppercase mt-0.5">
                PORTAL KOGNITIF ADAPTIF &amp; RIASEC HOLLAND
              </span>
              <span className="text-[10px] text-primary font-bold mt-1">
                Layanan Bimbingan Kelompok BK / Konseling Mandiri Karier
              </span>
            </div>
          </div>

          <div className="text-center sm:text-right flex flex-col gap-1 text-xs select-none">
            <div className="flex items-center justify-center sm:justify-end gap-1.5 text-muted-gray text-[10px]">
              <Calendar size={13} />
              <span>Tanggal Pengerjaan:</span>
            </div>
            <span className="font-extrabold text-primary font-heading tracking-wide">
              {createdDate}
            </span>
          </div>
        </header>

        {/* 2. Profil Singkat Siswa */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-bg-warm/40 rounded-2xl p-5 border border-primary/5">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[9px] uppercase font-bold text-muted-gray">Nama Lengkap Siswa</span>
            <span className="text-sm font-bold text-primary font-heading leading-tight">{profile.name}</span>
          </div>
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[9px] uppercase font-bold text-muted-gray">Kelas / Rombel</span>
            <span className="text-sm font-bold text-primary font-heading leading-tight">{profile.className}</span>
          </div>
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[9px] uppercase font-bold text-muted-gray">Skala Keyakinan Awal</span>
            <span className="text-sm font-bold text-primary font-heading leading-tight">{profile.confidenceScore} / 10</span>
          </div>
          
          <div className="sm:col-span-3 flex flex-col gap-1 border-t border-primary/5 pt-3 text-left">
            <span className="text-[9px] uppercase font-bold text-muted-gray">Kendala Utama yang Dicemaskan (Awal)</span>
            <p className="text-xs leading-relaxed text-text-dark/95 italic bg-white p-3 rounded-xl border border-primary/5 shadow-inner">
              &ldquo;{profile.mainProblem}&rdquo;
            </p>
          </div>
        </section>

        {/* 3. Hasil RIASEC Holland Section */}
        <section className="flex flex-col gap-4 border-t border-primary/5 pt-6">
          <h3 className="text-sm font-bold font-heading text-primary uppercase tracking-wider border-l-4 border-secondary pl-2">
            I. DIAGNOSIS POTENSI &amp; TIPE MINAT HOLLAND (RIASEC)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Visual Radar */}
            <div className="md:col-span-5 flex justify-center py-2 bg-bg-warm/25 rounded-2xl border border-primary/5">
              {riasecScores && <RiasecChart scores={riasecScores} />}
            </div>

            {/* Explanatory text */}
            <div className="md:col-span-7 flex flex-col gap-4 text-left">
              <div className="bg-primary/95 text-white p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-4 shadow-sm">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-secondary font-bold font-heading">
                    Kode Holland Utama (Top 3):
                  </span>
                  <span className="text-3xl font-black font-heading tracking-widest text-white mt-0.5">
                    {topCode}
                  </span>
                </div>
                <div className="text-right text-[10px] text-white/80 max-w-[150px] leading-relaxed">
                  Menyajikan tiga dimensi minat paling dominan berdasarkan kuis 30 item.
                </div>
              </div>

              {/* Bullet Descriptions */}
              <div className="flex flex-col gap-3">
                {topCode.split('').map((char, index) => {
                  const desc = riasecDescriptions[char as 'R'|'I'|'A'|'S'|'E'|'C'];
                  if (!desc) return null;
                  return (
                    <div key={char} className="flex gap-2.5 items-start">
                      <span className="w-5 h-5 rounded-full bg-secondary text-primary font-black text-xxs flex items-center justify-center font-heading mt-0.5">
                        {index + 1}
                      </span>
                      <div className="flex flex-col flex-1 leading-normal">
                        <h4 className="text-xs font-bold text-primary font-heading">
                          {desc.title}
                        </h4>
                        <p className="text-[10px] text-text-dark/90 mt-0.5 leading-relaxed">
                          {desc.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* 4. Skrining Hambatan & Evaluasi Cemas */}
        <section className="flex flex-col gap-4 border-t border-primary/5 pt-6">
          <h3 className="text-sm font-bold font-heading text-primary uppercase tracking-wider border-l-4 border-secondary pl-2">
            II. SKRINING HAMBATAN &amp; MONITORING KECEMASAN ADAPTIF
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-left">
            
            {/* Table of screening scores */}
            <div className="flex flex-col gap-2.5">
              <h4 className="text-xs font-bold text-primary font-heading">Skor Screening Hambatan Core Beliefs:</h4>
              <div className="border border-primary/10 rounded-2xl overflow-hidden shadow-inner bg-white">
                <table className="w-full text-[10.5px]">
                  <thead>
                    <tr className="bg-primary text-white text-left font-heading text-[10px] uppercase">
                      <th className="py-2.5 px-3">Hambatan Refleksi</th>
                      <th className="py-2.5 px-3 text-center">Skor (0-4)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    <tr>
                      <td className="py-2 px-3 font-medium">Bakat atau Kelebihan Menjolok (S1)</td>
                      <td className="py-2 px-3 text-center font-bold text-secondary bg-primary/5">{session.screeningResponses?.S1 ?? 2}</td>
                    </tr>
                    <tr className="bg-bg-warm/30">
                      <td className="py-2 px-3 font-medium">Ketakutan Gagal Melangkah (S2)</td>
                      <td className="py-2 px-3 text-center font-bold text-secondary bg-primary/5">{session.screeningResponses?.S2 ?? 2}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium">Rasa Lemah/Banding Sosial (S3)</td>
                      <td className="py-2 px-3 text-center font-bold text-secondary bg-primary/5">{session.screeningResponses?.S3 ?? 2}</td>
                    </tr>
                    <tr className="bg-bg-warm/30">
                      <td className="py-2 px-3 font-medium">Kekhawatiran Salah Jurusan (S4)</td>
                      <td className="py-2 px-3 text-center font-bold text-secondary bg-primary/5">{session.screeningResponses?.S4 ?? 2}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium">Tuntutan Sosial &amp; Orang Tua (S6)</td>
                      <td className="py-2 px-3 text-center font-bold text-secondary bg-primary/5">{session.screeningResponses?.S6 ?? 2}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Anxiety Comparison and Red flag alerts */}
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold text-primary font-heading">Indikator Tingkat Kecemasan Masa Depan:</h4>
              
              {/* Box comparison indicator */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-bg-warm/60 rounded-2xl p-4 border border-primary/5 flex flex-col items-center justify-center text-center shadow-inner">
                  <span className="text-[9px] uppercase font-bold text-muted-gray">Cemas Awal (Stres)</span>
                  <span className="text-2xl font-black text-accent font-heading mt-1">
                    {anxietyLogs?.graduationAnxietyScore ?? 5} <span className="text-xs text-muted-gray font-normal">/10</span>
                  </span>
                </div>
                
                <div className="bg-bg-warm/60 rounded-2xl p-4 border border-primary/5 flex flex-col items-center justify-center text-center shadow-inner">
                  <span className="text-[9px] uppercase font-bold text-muted-gray">Cemas Pasca Bimbingan</span>
                  <span className="text-2xl font-black text-secondary font-heading mt-1">
                    {evaluation?.postAnxietyScore ?? 5} <span className="text-xs text-muted-gray font-normal">/10</span>
                  </span>
                </div>
              </div>

              {/* Red flag trigger report status */}
              {anxietyLogs?.triggeredAlert ? (
                <div className="bg-amber-500/10 rounded-2xl p-4 border border-accent flex gap-3 text-left">
                  <AlertTriangle className="text-accent shrink-0 mt-0.5" size={18} />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-accent font-heading leading-none">Alarm Safety-Alert Dipicu</span>
                    <p className="text-[10px] text-text-dark/90 leading-relaxed mt-1">
                      Siswa memicu alert pengaman karena skor kecemasan awal &ge; 8 atau menekan bantuan darurat. Telah diberikan edukasi Safety Card terpadu.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-500/5 rounded-2xl p-4 border border-emerald-500/20 flex gap-3 text-left">
                  <Smile className="text-emerald-600 shrink-0 mt-0.5" size={18} />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-emerald-800 font-heading leading-none">Kondisi Stabil / Aman</span>
                    <p className="text-[10px] text-text-dark/95 leading-relaxed mt-1">
                      Remaja berada dalam batas ambang kecemasan yang stabil selama asesmen awal dan tidak membutuhkan intervensi krisis khusus.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* 5. Restrukturisasi Kognitif (LKPD CBT) */}
        {actionPlan && (
          <section className="flex flex-col gap-4 border-t border-primary/5 pt-6">
            <h3 className="text-sm font-bold font-heading text-primary uppercase tracking-wider border-l-4 border-secondary pl-2">
              III. RENCANA AKSI KARIER &amp; RESTRUKTURISASI KOGNITIF (LKPD CBT)
            </h3>

            {/* Target and Challenge scale banner */}
            <div className="bg-bg-warm/40 rounded-2xl p-4 border border-primary/5 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] uppercase font-bold text-muted-gray">Kampus/Karir Impian Target Utama</span>
                <span className="text-md font-bold text-primary font-heading leading-tight">{actionPlan.goal}</span>
              </div>
              <div className="text-left sm:text-right flex flex-col gap-0.5">
                <span className="text-[9px] uppercase font-bold text-muted-gray">Skala Tantangan Dirasakan</span>
                <span className="text-sm font-extrabold text-secondary font-heading">{actionPlan.challengeLevel} / 10</span>
              </div>
            </div>

            {/* Cognitive restructuring table */}
            <div className="flex flex-col gap-3 text-xs text-left leading-relaxed">
              <h4 className="text-xs font-bold text-primary font-heading">Langkah Rekonstruksi Pikiran Buruk Remaja:</h4>
              
              <div className="grid grid-cols-1 gap-3.5 mt-1">
                
                {/* 1 */}
                <div className="bg-white rounded-2xl p-4 border border-primary/5 shadow-sm flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-accent uppercase tracking-widest font-heading">
                    Langkah 1: Pikiran Negatif / Otomatis
                  </span>
                  <p className="text-xs text-text-dark/95 leading-relaxed italic bg-bg-warm/20 p-2.5 rounded-lg border border-primary/5 shadow-inner">
                    &ldquo;{actionPlan.negativeThought}&rdquo;
                  </p>
                </div>

                {/* 2 & 3 grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="bg-white rounded-2xl p-4 border border-primary/5 shadow-sm flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-primary font-heading uppercase tracking-widest text-muted-gray">
                      Langkah 2: Bukti Pendukung Pikiran Buruk
                    </span>
                    <p className="text-xs text-text-dark/95 leading-relaxed bg-bg-warm/20 p-2.5 rounded-lg border border-primary/5">
                      {actionPlan.evidenceNegative}
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 border border-primary/5 shadow-sm flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-secondary uppercase tracking-widest font-heading">
                      Langkah 3: Fakta Penyeimbang (Kelebihan/Potensi Rapor)
                    </span>
                    <p className="text-xs text-text-dark/95 leading-relaxed bg-bg-warm/20 p-2.5 rounded-lg border border-primary/5">
                      {actionPlan.counterEvidence}
                    </p>
                  </div>
                </div>

                {/* 4 & 5 grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="bg-white rounded-2xl p-4 border border-primary/5 shadow-sm flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-primary font-heading uppercase tracking-widest text-muted-gray">
                      Langkah 4: Sudut Pandang Alternatif (Nasihat Teman)
                    </span>
                    <p className="text-xs text-text-dark/95 leading-relaxed bg-bg-warm/20 p-2.5 rounded-lg border border-primary/5">
                      {actionPlan.alternativeView}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-primary/5 shadow-sm flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-emerald-800 font-heading uppercase tracking-widest">
                      Langkah 5: Keyakinan Baru / Afirmasi Mandiri
                    </span>
                    <p className="text-xs text-text-dark/95 leading-relaxed font-bold bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/10">
                      {actionPlan.newBelief}
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Checklist commitments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-left mt-3">
              
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold text-primary font-heading">Komitmen Tindakan Nyata Terpilih:</h4>
                <div className="flex flex-col gap-1.5">
                  {actionPlan.selectedCommitments.map((commit, i) => (
                    <div key={i} className="flex gap-2 items-start p-2.5 rounded-xl bg-bg-warm/40 border border-primary/5">
                      <CheckSquare size={15} className="text-secondary shrink-0 mt-0.5" />
                      <span className="text-[10.5px] text-text-dark leading-tight">{commit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold text-primary font-heading">Rencana 3 Aksi Utama Bulan Ini:</h4>
                <div className="flex flex-col gap-2">
                  {actionPlan.monthlyActions.map((act, i) => {
                    if (!act.trim()) return null;
                    return (
                      <div key={i} className="flex gap-2.5 items-center py-2 px-3 rounded-xl border border-primary/5 bg-white shadow-sm font-semibold">
                        <span className="w-5 h-5 rounded-lg bg-primary text-secondary font-black text-xxs flex items-center justify-center font-heading">
                          {i + 1}
                        </span>
                        <span className="text-[11px] text-primary">{act}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </section>
        )}

        {/* 6. Refleksi Evaluasi Layanan UCE */}
        {evaluation && (
          <section className="flex flex-col gap-4 border-t border-primary/5 pt-6">
            <h3 className="text-sm font-bold font-heading text-primary uppercase tracking-wider border-l-4 border-secondary pl-2">
              IV. REFLEKSI AKHIR &amp; EVALUASI LAYANAN BIMBINGAN (UCE)
            </h3>

            {/* UCE Score output indicators */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-bg-warm/40 rounded-2xl py-3 px-2 border border-primary/5 text-center shadow-inner">
                <span className="text-[8.5px] uppercase font-bold text-muted-gray leading-none">Understanding (Pemahaman)</span>
                <span className="text-lg font-black text-primary font-heading block mt-0.5">{evaluation.understandingScore} / 10</span>
              </div>
              <div className="bg-bg-warm/40 rounded-2xl py-3 px-2 border border-primary/5 text-center shadow-inner">
                <span className="text-[8.5px] uppercase font-bold text-muted-gray leading-none">Comfort (Kenyamanan)</span>
                <span className="text-lg font-black text-primary font-heading block mt-0.5">{evaluation.comfortScore} / 10</span>
              </div>
              <div className="bg-bg-warm/40 rounded-2xl py-3 px-2 border border-primary/5 text-center shadow-inner">
                <span className="text-[8.5px] uppercase font-bold text-muted-gray leading-none">Action (Kemantapan Aksi)</span>
                <span className="text-lg font-black text-primary font-heading block mt-0.5">{evaluation.actionScore} / 10</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-left mt-1">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase font-bold text-muted-gray">Refleksi Ketenangan Emosi Pasca-Bimbingan</span>
                <p className="text-xs text-text-dark leading-relaxed italic bg-bg-warm/20 p-3 rounded-xl border border-primary/5 shadow-inner">
                  &ldquo;{evaluation.notes}&rdquo;
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase font-bold text-muted-gray">Topik Krusial yang Paling Ingin Dibahas Tatap Muka</span>
                <p className="text-xs text-text-dark leading-relaxed font-semibold bg-bg-warm/20 p-3 rounded-xl border border-primary/5">
                  {evaluation.counselorDiscussion || 'Tidak ada spesifik (Siap konsultasi umum)'}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 7. Legal Signatures for official BK filing */}
        <footer className="border-t border-primary/10 pt-8 mt-4 grid grid-cols-2 gap-6 text-center text-xs">
          <div className="flex flex-col items-center">
            <span className="text-muted-gray text-[10px]">Siswa Peserta Bimbingan,</span>
            <div className="h-16 flex items-end justify-center">
              <span className="font-extrabold text-primary font-heading tracking-wide border-b border-primary/30 pb-0.5">
                {profile.name}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-muted-gray text-[10px]">Mengetahui, Konselor / Guru BK Sekolah,</span>
            <div className="h-16 flex items-end justify-center">
              <span className="font-extrabold text-primary font-heading tracking-wide border-b border-primary/30 pb-0.5">
                Guru BK RuangKarier, S.Pd., Kons.
              </span>
            </div>
          </div>
        </footer>

      </article>

      {/* Muted footnote */}
      <div className="text-center text-[10px] text-muted-gray select-none no-print">
        Portofolio digital ini diverifikasi sah oleh RuangKarier System. Simpan sebagai file PDF untuk kebutuhan unggahan portofolio kelulusan atau arsip pribadi.
      </div>
    </main>
  );
}
