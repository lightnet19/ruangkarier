'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, BookOpen, MessageSquare,
  FileBarChart2, Settings, LogOut, ShieldCheck,
  ChevronRight, Menu, X
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/assessments', label: 'Data Asesmen', icon: Users },
  { href: '/admin/career-content', label: 'Konten Karier', icon: BookOpen },
  { href: '/admin/counseling-requests', label: 'Permintaan Konseling', icon: MessageSquare },
  { href: '/admin/reports', label: 'Ekspor Laporan', icon: FileBarChart2 },
  { href: '/admin/settings', label: 'Pengaturan Sistem', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [inputPasscode, setInputPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  const validatePasscode = useCallback(async (code: string) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: code }),
      });
      if (res.ok) {
        sessionStorage.setItem('rk_admin_passcode', code);
        setPasscode(code);
        setIsAuthorized(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Kode sandi tidak valid.');
        setIsAuthorized(false);
      }
    } catch {
      setError('Gagal terhubung ke server.');
    } finally {
      setIsLoading(false);
      setChecking(false);
    }
  }, []);

  const hasValidated = React.useRef(false);

  useEffect(() => {
    if (isAuthorized || hasValidated.current) {
      return;
    }
    hasValidated.current = true;

    const saved = sessionStorage.getItem('rk_admin_passcode');
    if (saved) {
      validatePasscode(saved);
    } else {
      setChecking(false);
    }
  }, [validatePasscode, isAuthorized]);


  const handleLogout = () => {
    sessionStorage.removeItem('rk_admin_passcode');
    setPasscode('');
    setIsAuthorized(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Logo + Brand */}
          <div className="text-center mb-8 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/20">
              <img src="/icon.png" alt="Icon" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white font-heading tracking-tight">
                RuangKarier <span className="text-indigo-400">Admin</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Portal Manajemen Sistem &mdash; Akses Terbatas</p>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck size={18} className="text-indigo-400" />
              <span className="text-sm font-bold text-white">Autentikasi Admin</span>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); validatePasscode(inputPasscode); }} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Kode Sandi Admin
                </label>
                <input
                  type="password"
                  value={inputPasscode}
                  onChange={e => setInputPasscode(e.target.value)}
                  placeholder="Masukkan kode sandi admin..."
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !inputPasscode}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
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

            <div className="mt-6 pt-5 border-t border-white/5 text-center">
              <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-all">
                ← Kembali ke Beranda Publik
              </Link>
            </div>
          </div>

          <p className="text-center text-[10px] text-slate-600 mt-6">
            Akses tidak sah akan dicatat. RuangKarier © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-white/5 z-30 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        {/* Sidebar Header */}
        <div className="p-5 border-b border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white overflow-hidden border border-white/10">
            <img src="/icon.png" alt="Icon" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-white font-heading leading-tight">
              RuangKarier
            </span>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
              Admin Panel
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="ml-auto lg:hidden text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/admin' && pathname?.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-indigo-400' : ''} />
                <span>{label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto text-indigo-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 mb-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <ShieldCheck size={14} className="text-indigo-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Administrator</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest">Terautentikasi</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all cursor-pointer"
          >
            <LogOut size={15} />
            <span>Keluar dari Admin</span>
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-300 transition-all mt-1"
          >
            ← Kembali ke Beranda Publik
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 bg-slate-900/80 border-b border-white/5 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="hidden sm:inline">RuangKarier Admin</span>
            <ChevronRight size={12} className="text-slate-600" />
            <span className="text-white font-semibold capitalize">
              {navItems.find(n => n.href === pathname || (n.href !== '/admin' && pathname?.startsWith(n.href)))?.label || 'Dashboard'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ● Sistem Aktif
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 text-white">
          {/* Inject passcode into children via context (we use sessionStorage directly in children) */}
          {children}
        </main>
      </div>
    </div>
  );
}
