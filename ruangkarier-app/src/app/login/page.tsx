'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  GraduationCap,
  UserCog,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Lock,
  LogIn,
} from 'lucide-react';

type TabType = 'student' | 'counselor' | 'admin';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-white text-sm animate-pulse">Memuat halaman...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('student');

  // Student login state
  const [nis, setNis] = useState('');
  const [studentPasscode, setStudentPasscode] = useState('');
  const [showStudentPass, setShowStudentPass] = useState(false);

  // Counselor login state
  const [counselorPasscode, setCounselorPasscode] = useState('');
  const [showCounselorPass, setShowCounselorPass] = useState(false);

  // Admin login state
  const [adminPasscode, setAdminPasscode] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const tab = searchParams?.get('tab') as TabType | null;
    if (tab && ['student', 'counselor', 'admin'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleAutofillStudent = (selectedNis: string, selectedPass: string) => {
    setNis(selectedNis);
    setStudentPasscode(selectedPass);
    setError('');
    setSuccessMsg('');
  };

  const handleAutofillCounselor = (selectedPass: string) => {
    setCounselorPasscode(selectedPass);
    setError('');
    setSuccessMsg('');
  };

  const handleAutofillAdmin = (selectedPass: string) => {
    setAdminPasscode(selectedPass);
    setError('');
    setSuccessMsg('');
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/student/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', nis, passcode: studentPasscode }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Save session
        sessionStorage.setItem('rk_student_nis', nis);
        sessionStorage.setItem('rk_student_passcode', studentPasscode);
        sessionStorage.setItem('rk_student_name', data.student.name);
        sessionStorage.setItem('rk_student_id', data.student.id);
        setSuccessMsg(data.message);
        setTimeout(() => router.push('/student'), 800);
      } else {
        setError(data.error || 'Login gagal.');
      }
    } catch {
      setError('Tidak dapat terhubung ke server. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCounselorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      // Check if there's a counselor auth API or use the existing pattern
      const res = await fetch('/api/counselor/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: counselorPasscode }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('rk_counselor_passcode', counselorPasscode);
        setSuccessMsg('Login Guru BK berhasil! Mengalihkan...');
        setTimeout(() => router.push('/counselor'), 800);
      } else {
        setError(data.error || 'Kode sandi Guru BK tidak valid.');
      }
    } catch {
      setError('Tidak dapat terhubung ke server. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: adminPasscode }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('rk_admin_passcode', adminPasscode);
        setSuccessMsg('Login Admin berhasil! Mengalihkan ke panel...');
        setTimeout(() => router.push('/admin'), 800);
      } else {
        setError(data.error || 'Kode sandi Admin tidak valid.');
      }
    } catch {
      setError('Tidak dapat terhubung ke server. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const tabConfig = [
    { key: 'student' as TabType, label: 'Siswa', icon: GraduationCap, color: 'indigo' },
    { key: 'counselor' as TabType, label: 'Guru BK', icon: UserCog, color: 'emerald' },
    { key: 'admin' as TabType, label: 'Admin', icon: ShieldCheck, color: 'violet' },
  ];

  const tabColorMap = {
    student: {
      bg: 'bg-indigo-600',
      hover: 'hover:bg-indigo-500',
      text: 'text-indigo-400',
      border: 'border-indigo-500/30',
      glow: 'bg-indigo-600/10',
      active: 'bg-indigo-600/10 text-indigo-300 border-indigo-500/20',
    },
    counselor: {
      bg: 'bg-emerald-600',
      hover: 'hover:bg-emerald-500',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      glow: 'bg-emerald-600/10',
      active: 'bg-emerald-600/10 text-emerald-300 border-emerald-500/20',
    },
    admin: {
      bg: 'bg-violet-600',
      hover: 'hover:bg-violet-500',
      text: 'text-violet-400',
      border: 'border-violet-500/30',
      glow: 'bg-violet-600/10',
      active: 'bg-violet-600/10 text-violet-300 border-violet-500/20',
    },
  };

  const colors = tabColorMap[activeTab];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet-600/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-emerald-600/6 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Header */}
        <div className="text-center mb-8 flex flex-col items-center gap-3">
          <Link href="/" className="flex items-center justify-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-white overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-shadow">
              <img src="/icon.png" alt="Icon RuangKarier" className="w-full h-full object-cover" />
            </div>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white font-heading tracking-tight">
              Masuk ke <span className="text-indigo-400">RuangKarier</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Pilih portal sesuai peranmu</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 p-1 bg-slate-900/80 rounded-2xl border border-white/5 mb-6">
          {tabConfig.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setError(''); setSuccessMsg(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                activeTab === key
                  ? tabColorMap[key].active
                  : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">

          {/* Success message */}
          {successMsg && (
            <div className="mb-4 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
              <Sparkles size={14} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              ⚠️ {error}
            </div>
          )}

          {/* === STUDENT TAB === */}
          {activeTab === 'student' && (
            <form onSubmit={handleStudentLogin} className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap size={18} className="text-indigo-400" />
                <span className="text-sm font-bold text-white">Portal Siswa</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  NIS (Nomor Induk Siswa)
                </label>
                <input
                  id="student-nis"
                  type="text"
                  value={nis}
                  onChange={e => setNis(e.target.value)}
                  placeholder="Contoh: 2025001"
                  required
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Kode Sandi
                </label>
                <div className="relative">
                  <input
                    id="student-passcode"
                    type={showStudentPass ? 'text' : 'password'}
                    value={studentPasscode}
                    onChange={e => setStudentPasscode(e.target.value)}
                    placeholder="Kode sandi yang kamu buat saat daftar"
                    required
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowStudentPass(!showStudentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showStudentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !nis || !studentPasscode}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={16} />
                    <span>Masuk sebagai Siswa</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2 border-t border-white/5">
                <p className="text-xs text-slate-500 mb-2">Belum punya akun?</p>
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <span>Daftar Sekarang</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </form>
          )}

          {/* === COUNSELOR TAB === */}
          {activeTab === 'counselor' && (
            <form onSubmit={handleCounselorLogin} className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <UserCog size={18} className="text-emerald-400" />
                <span className="text-sm font-bold text-white">Portal Guru BK</span>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3 text-xs text-emerald-400/80 leading-relaxed">
                <Lock size={12} className="inline mr-1.5" />
                Masukkan kode sandi Guru BK yang telah dikonfigurasi oleh Administrator sistem sekolah.
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Kode Sandi Guru BK
                </label>
                <div className="relative">
                  <input
                    id="counselor-passcode"
                    type={showCounselorPass ? 'text' : 'password'}
                    value={counselorPasscode}
                    onChange={e => setCounselorPasscode(e.target.value)}
                    placeholder="Masukkan kode sandi Guru BK..."
                    required
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCounselorPass(!showCounselorPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showCounselorPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !counselorPasscode}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserCog size={16} />
                    <span>Masuk ke Dasbor BK</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* === ADMIN TAB === */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={18} className="text-violet-400" />
                <span className="text-sm font-bold text-white">Panel Administrator</span>
              </div>

              <div className="bg-violet-500/5 border border-violet-500/15 rounded-xl px-4 py-3 text-xs text-violet-400/80 leading-relaxed">
                <Lock size={12} className="inline mr-1.5" />
                Akses terbatas. Hanya untuk administrator sistem yang berwenang.
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Kode Sandi Admin
                </label>
                <div className="relative">
                  <input
                    id="admin-passcode"
                    type={showAdminPass ? 'text' : 'password'}
                    value={adminPasscode}
                    onChange={e => setAdminPasscode(e.target.value)}
                    placeholder="Masukkan kode sandi admin..."
                    required
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-all"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPass(!showAdminPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showAdminPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !adminPasscode}
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Masuk ke Panel Admin</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back to home */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-all">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>

        {/* Demo Accounts Panel */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 mt-6 shadow-xl relative overflow-hidden transition-all">
          <div className="absolute top-0 right-0 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-white/5">
            🔑 Mode Demo
          </div>
          <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
            <span>✨</span> Akun Uji Coba (Demo)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Klik akun simulasi di bawah ini untuk mengisi kredensial secara otomatis:
          </p>

          {activeTab === 'student' && (
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {[
                { name: 'Ahmad Fauzi (XII-IPS 1)', nis: '2025001', pass: 'siswa123', status: 'Kecemasan Tinggi (Target UGM)', badge: '🔴 Butuh Konseling BK' },
                { name: 'Siti Aminah (XII-MIPA 2)', nis: '2025002', pass: 'siswa123', status: 'Kecemasan Sedang (Target UNAIR)', badge: '🟡 Cemas Sedang' },
                { name: 'Budi Pratama (XI-MIPA 1)', nis: '2025003', pass: 'siswa123', status: 'Dilema Karier (ITS vs STIS)', badge: '🔵 Dilema Biaya' },
                { name: 'Dewi Lestari (XII-MIPA 1)', nis: '2025004', pass: 'siswa123', status: 'Kedokteran Hewan IPB', badge: '🟢 Cemas Rendah' },
                { name: 'Fajar Ramadhan (XII-IPS 2)', nis: '2025005', pass: 'siswa123', status: 'Kecemasan Sangat Tinggi (Ekonomi)', badge: '🔴 Butuh Konseling BK' },
                { name: 'Rizky Saputra (X-1)', nis: '2025006', pass: 'siswa123', status: 'Akun Siswa Baru', badge: '⚪ Baru Masuk' },
              ].map((item, idx) => (
                <button 
                  type="button"
                  key={idx}
                  onClick={() => handleAutofillStudent(item.nis, item.pass)}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-800/40 hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/20 rounded-xl transition-all cursor-pointer text-left gap-2 w-full"
                >
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                      <span>👤 {item.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 group-hover:text-slate-400">
                      NIS: <span className="font-mono text-slate-300 font-bold">{item.nis}</span> | Sandi: <span className="font-mono text-slate-300">{item.pass}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 italic">
                      🎯 {item.status}
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 mt-1 sm:mt-0">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/5">
                      {item.badge}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Isi ⚡
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'counselor' && (
            <button 
              type="button"
              onClick={() => handleAutofillCounselor('konselor123')}
              className="group flex items-center justify-between p-3.5 bg-slate-800/40 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/20 rounded-xl transition-all cursor-pointer text-left w-full"
            >
              <div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  <span>🧑‍🏫 Akun Guru Bimbingan Konseling (BK)</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Kode Sandi: <span className="font-mono text-slate-300 font-bold">konselor123</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Isi ⚡
              </span>
            </button>
          )}

          {activeTab === 'admin' && (
            <button 
              type="button"
              onClick={() => handleAutofillAdmin('admin123')}
              className="group flex items-center justify-between p-3.5 bg-slate-800/40 hover:bg-violet-500/10 border border-white/5 hover:border-violet-500/20 rounded-xl transition-all cursor-pointer text-left w-full"
            >
              <div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-violet-300 transition-colors flex items-center gap-1.5">
                  <span>🛡️ Akun Administrator Utama</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Kode Sandi: <span className="font-mono text-slate-300 font-bold">admin123</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-violet-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Isi ⚡
              </span>
            </button>
          )}
        </div>

        <p className="text-center text-[10px] text-slate-700 mt-6">
          RuangKarier © {new Date().getFullYear()} — Sistem Bimbingan Karier Digital
        </p>
      </div>
    </div>
  );
}
