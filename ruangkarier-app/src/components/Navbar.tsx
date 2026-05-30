'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, UserCog, Sparkles, LogIn } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Beranda', icon: Sparkles },
    { href: '/student', label: 'Bimbingan Siswa', icon: Compass },
    { href: '/counselor', label: 'Dasbor Guru BK', icon: UserCog },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full glass-card border-b border-primary/5 px-4 md:px-8 py-3.5 flex items-center justify-between no-print">
      {/* Brand Logo & Icon */}
      <Link href="/" className="flex items-center gap-2 group cursor-pointer select-none">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-md border border-primary/10 overflow-hidden">
          <img src="/icon.png" alt="Icon Ruang Karier" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="flex flex-col">
          <span className="text-md font-bold leading-tight font-heading text-primary tracking-wide">
            Ruang<span className="text-secondary font-extrabold">Karier</span>
          </span>
          <span className="text-[10px] text-muted-gray leading-none font-medium">
            Career Self-Defense Portal
          </span>
        </div>
      </Link>

      {/* Nav Links + Login Button */}
      <div className="flex items-center gap-1.5 md:gap-3">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'text-primary/70 hover:bg-primary/5 hover:text-primary'
              }`}
            >
              <Icon size={16} className={`${isActive ? 'text-secondary' : ''}`} />
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          );
        })}

        {/* Login / Masuk Button */}
        <Link
          href="/login"
          className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer border ${
            pathname === '/login' || pathname === '/register'
              ? 'bg-secondary text-white border-secondary shadow-md'
              : 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary hover:text-white'
          }`}
        >
          <LogIn size={16} />
          <span className="hidden sm:inline">Masuk</span>
        </Link>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="w-full bg-primary text-white py-12 px-4 md:px-8 mt-auto border-t-4 border-secondary no-print">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Col 1 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white overflow-hidden border border-white/10 shadow-sm">
              <img src="/icon.png" alt="Icon Ruang Karier" className="w-full h-full object-cover" />
            </div>
            <span className="text-lg font-bold font-heading">
              Ruang<span className="text-secondary">Karier</span>
            </span>
          </div>
          <p className="text-xs text-muted-gray leading-relaxed max-w-sm">
            Portal eksplorasi karier dan restrukturisasi kognitif adaptif digital untuk membantu siswa mengelola kecemasan masa depan pasca-kelulusan.
          </p>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="text-sm font-bold font-heading mb-4 text-secondary uppercase tracking-wider">
            Alur Eksplorasi
          </h4>
          <ul className="text-xs text-muted-gray space-y-2">
            <li>1. Informed Consent &amp; Profil</li>
            <li>2. Screening Hambatan Karier</li>
            <li>3. Deteksi Kecemasan &amp; Safety Card</li>
            <li>4. RIASEC Holland Assessment</li>
            <li>5. Ruang Rencana Aksi (LKPD CBT)</li>
            <li>6. Evaluasi Layanan UCE</li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="text-sm font-bold font-heading mb-4 text-secondary uppercase tracking-wider">
            Portal Akses
          </h4>
          <ul className="text-xs text-muted-gray space-y-2">
            <li>
              <Link href="/login" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span>🎓</span> Login Siswa
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span>✏️</span> Daftar Akun Siswa
              </Link>
            </li>
            <li>
              <Link href="/login?tab=counselor" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span>👩‍🏫</span> Portal Guru BK
              </Link>
            </li>
            <li>
              <Link href="/login?tab=admin" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span>🛡️</span> Panel Administrator
              </Link>
            </li>
          </ul>
          <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-muted-gray">
            Status: <span className="text-emerald-400 font-semibold">Aktif (Simulasi Offline Database)</span>
          </div>
        </div>

      </div>

      <div className="max-w-6xl mx-auto border-t border-white/10 mt-8 pt-6 text-center text-xs text-muted-gray flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} RuangKarier. Semua Hak Dilindungi Undang-Undang.</p>
        <p className="flex items-center gap-1.5 text-[10px]">
          Made with <span className="text-rose-400 animate-pulse">❤️</span> for Indonesian Students
        </p>
      </div>
    </footer>
  );
}
