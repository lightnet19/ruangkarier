'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Eye,
  EyeOff,
  UserPlus,
  ArrowRight,
  CheckCircle2,
  Info,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [nis, setNis] = useState('');
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (passcode !== confirmPasscode) {
      setError('Konfirmasi kode sandi tidak cocok.');
      return;
    }
    if (passcode.length < 6) {
      setError('Kode sandi minimal 6 karakter.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/student/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', name, className, nis, passcode }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // Save session
        sessionStorage.setItem('rk_student_nis', nis);
        sessionStorage.setItem('rk_student_passcode', passcode);
        sessionStorage.setItem('rk_student_name', data.student.name);
        sessionStorage.setItem('rk_student_id', data.student.id);
        setSuccessMsg(`${data.message} Mengarahkan ke portal bimbingan...`);
        setTimeout(() => router.push('/student'), 1500);
      } else {
        setError(data.error || 'Registrasi gagal. Coba lagi.');
      }
    } catch {
      setError('Tidak dapat terhubung ke server. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-emerald-600/6 rounded-full blur-3xl" />
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
              Daftar ke <span className="text-indigo-400">RuangKarier</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Buat akun siswa untuk memulai eksplorasi karier</p>
          </div>
        </div>

        {/* Register Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-5">
            <GraduationCap size={18} className="text-indigo-400" />
            <span className="text-sm font-bold text-white">Registrasi Akun Siswa</span>
          </div>

          {/* Info box */}
          <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-xl px-4 py-3 text-xs text-indigo-400/80 leading-relaxed mb-5">
            <Info size={12} className="inline mr-1.5" />
            Data kamu akan disimpan dengan aman dan hanya bisa diakses oleh Guru BK sekolah.
            NIS digunakan sebagai identitas unikmu di sistem ini.
          </div>

          {/* Success */}
          {successMsg && (
            <div className="mb-4 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
              <CheckCircle2 size={14} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Nama Lengkap
              </label>
              <input
                id="register-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nama lengkap sesuai rapor"
                required
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Class */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Kelas
              </label>
              <input
                id="register-class"
                type="text"
                value={className}
                onChange={e => setClassName(e.target.value)}
                placeholder="Contoh: XII-IPS 1 atau XII-MIPA 2"
                required
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            {/* NIS */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                NIS (Nomor Induk Siswa)
              </label>
              <input
                id="register-nis"
                type="text"
                value={nis}
                onChange={e => setNis(e.target.value)}
                placeholder="Contoh: 2025001"
                required
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Passcode */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Kode Sandi (min. 6 karakter)
              </label>
              <div className="relative">
                <input
                  id="register-passcode"
                  type={showPass ? 'text' : 'password'}
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                  placeholder="Buat kode sandi yang mudah diingat"
                  required
                  minLength={6}
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Passcode */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Konfirmasi Kode Sandi
              </label>
              <div className="relative">
                <input
                  id="register-confirm-passcode"
                  type={showConfirmPass ? 'text' : 'password'}
                  value={confirmPasscode}
                  onChange={e => setConfirmPasscode(e.target.value)}
                  placeholder="Ulangi kode sandi di atas"
                  required
                  className={`w-full bg-slate-800 border rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                    confirmPasscode && passcode !== confirmPasscode
                      ? 'border-red-500/50 focus:border-red-500'
                      : confirmPasscode && passcode === confirmPasscode
                      ? 'border-emerald-500/50 focus:border-emerald-500'
                      : 'border-white/10 focus:border-indigo-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPasscode && passcode !== confirmPasscode && (
                <span className="text-[11px] text-red-400 mt-0.5">Kode sandi tidak cocok</span>
              )}
              {confirmPasscode && passcode === confirmPasscode && (
                <span className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 size={11} /> Kode sandi cocok
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !name || !className || !nis || !passcode || !confirmPasscode}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Buat Akun & Mulai Eksplorasi</span>
                </>
              )}
            </button>
          </form>

          {/* Already have account */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <p className="text-xs text-slate-500 mb-2">Sudah punya akun?</p>
            <Link
              href="/login"
              className="flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <span>Masuk sekarang</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-700 mt-6">
          RuangKarier © {new Date().getFullYear()} — Sistem Bimbingan Karier Digital
        </p>
      </div>
    </div>
  );
}
