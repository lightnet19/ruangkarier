'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Users, ShieldAlert, TrendingDown, Award, BarChart2,
  MessageSquare, BookOpen, FileBarChart2, ArrowRight,
  CheckCircle, Activity
} from 'lucide-react';

interface AdminStats {
  total: number;
  redFlags: number;
  completed: number;
  completionRate: number;
  avgInitialAnxiety: number;
  avgPostAnxiety: number;
  anxietyReduction: number;
  riasecDistribution: Record<string, number>;
}

interface AdminData {
  stats: AdminStats;
  counselingRequests: {
    id: string;
    name: string;
    className: string;
    goal: string;
    discussion: string;
    sentAt: string;
    isRedFlag: boolean;
    riasec: string;
    anxiety: number;
    postAnxiety: number;
  }[];
  counselorSettings: { schoolName: string };
}

const quickLinks = [
  { href: '/admin/assessments', label: 'Data Asesmen Siswa', icon: Users, color: 'indigo', desc: 'Lihat seluruh rekam jejak asesmen Holland RIASEC & CBT siswa' },
  { href: '/admin/career-content', label: 'Konten Karier', icon: BookOpen, color: 'violet', desc: 'Kelola dan pratinjau 6 jalur konten karier yang ditampilkan kepada siswa' },
  { href: '/admin/counseling-requests', label: 'Permintaan Konseling', icon: MessageSquare, color: 'amber', desc: 'Pantau permintaan tindak lanjut konseling yang dikirim siswa ke Guru BK' },
  { href: '/admin/reports', label: 'Ekspor Laporan', icon: FileBarChart2, color: 'emerald', desc: 'Unduh laporan analitik program dalam format JSON atau CSV' },
];

const colorMap: Record<string, string> = {
  indigo: 'bg-indigo-600/15 text-indigo-400 border-indigo-500/20',
  violet: 'bg-violet-600/15 text-violet-400 border-violet-500/20',
  amber: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    const passcode = sessionStorage.getItem('rk_admin_passcode') || '';
    try {
      const res = await fetch(`/api/admin/data?passcode=${passcode}`);
      if (!res.ok) { setError('Gagal memuat data.'); return; }
      const d = await res.json();
      setData(d);
    } catch {
      setError('Gagal terhubung ke server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const stats = data?.stats;
  const topRiasec = stats?.riasecDistribution
    ? Object.entries(stats.riasecDistribution).sort((a, b) => b[1] - a[1]).slice(0, 5)
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit">
          <Activity size={12} className="text-indigo-400" />
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Sistem Aktif</span>
        </div>
        <h1 className="text-3xl font-black text-white font-heading tracking-tight">
          Admin Dashboard 🛡️
        </h1>
        <p className="text-sm text-slate-400 max-w-xl">
          Pusat komando dan analitik sistem RuangKarier. Monitoring progres program bimbingan karier, manajemen konten, dan ekspor laporan institusi.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-3 text-sm text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* KPI Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Siswa', value: stats?.total ?? 0, sub: 'Rekam Asesmen',
            icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10'
          },
          {
            label: 'Red Flag Aktif', value: stats?.redFlags ?? 0, sub: 'Perlu Tindak Lanjut',
            icon: ShieldAlert, color: 'text-amber-400', bg: 'bg-amber-500/10'
          },
          {
            label: 'Rerata Cemas Awal', value: `${stats?.avgInitialAnxiety ?? 0}/10`, sub: 'Skala Kegelisahan',
            icon: TrendingDown, color: 'text-rose-400', bg: 'bg-rose-500/10'
          },
          {
            label: 'Tingkat Penyelesaian', value: `${stats?.completionRate ?? 0}%`, sub: 'Portofolio Terkirim',
            icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-500/10'
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-slate-900 rounded-3xl p-5 border border-white/5 flex flex-col gap-2 relative overflow-hidden">
              <div className={`absolute right-4 top-4 w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center`}>
                <Icon size={18} className={kpi.color} />
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider leading-none">{kpi.label}</span>
              <span className="text-3xl font-black text-white font-heading mt-1">{kpi.value}</span>
              <span className="text-[9px] text-slate-500">{kpi.sub}</span>
            </div>
          );
        })}
      </section>

      {/* Secondary Row: Anxiety Reduction + RIASEC Distribution */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Anxiety Reduction Card */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-heading">Efektivitas Reduksi Kecemasan</h3>
            <BarChart2 size={16} className="text-slate-500" />
          </div>
          <div className="flex items-end gap-6">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-slate-500">Cemas Awal</span>
              <div className="w-16 bg-rose-500/10 rounded-xl flex items-center justify-center border border-rose-500/20" style={{ height: `${Math.max(40, (stats?.avgInitialAnxiety || 0) * 12)}px` }}>
                <span className="text-lg font-black text-rose-400">{stats?.avgInitialAnxiety ?? 0}</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${stats?.avgInitialAnxiety ? (1 - (stats.avgPostAnxiety / stats.avgInitialAnxiety)) * 100 : 0}%` }}
                />
              </div>
              <span className="text-center text-xs text-slate-400">
                Penurunan: <span className="font-bold text-emerald-400">
                  {stats ? (stats.avgInitialAnxiety - stats.avgPostAnxiety).toFixed(1) : '0'} poin
                </span>
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-slate-500">Cemas Akhir</span>
              <div className="w-16 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20" style={{ height: `${Math.max(40, (stats?.avgPostAnxiety || 0) * 12)}px` }}>
                <span className="text-lg font-black text-emerald-400">{stats?.avgPostAnxiety ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIASEC Distribution */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-heading">Distribusi Kode Holland Top-3</h3>
            <CheckCircle size={16} className="text-slate-500" />
          </div>
          {topRiasec.length > 0 ? (
            <div className="flex flex-col gap-2">
              {topRiasec.map(([code, count]) => (
                <div key={code} className="flex items-center gap-3">
                  <span className="w-12 text-xs font-black text-white text-right font-heading tracking-widest">{code}</span>
                  <div className="flex-1 h-5 bg-slate-800 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg transition-all duration-700 flex items-center pl-2"
                      style={{ width: `${(count / (stats?.total || 1)) * 100}%` }}
                    >
                      <span className="text-[10px] font-bold text-white">{count}</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 w-8">
                    {Math.round((count / (stats?.total || 1)) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-4">Belum ada data asesmen RIASEC.</p>
          )}
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Menu Manajemen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map(({ href, label, icon: Icon, color, desc }) => (
            <Link
              key={href}
              href={href}
              className="bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-white/10 rounded-2xl p-5 flex flex-col gap-3 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorMap[color]}`}>
                <Icon size={18} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{label}</span>
                <span className="text-[10px] text-slate-500 leading-relaxed">{desc}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 group-hover:text-indigo-400 transition-colors mt-auto">
                <span>Buka</span>
                <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Counseling Requests */}
      {data?.counselingRequests && data.counselingRequests.length > 0 && (
        <section className="bg-slate-900 rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-heading">Permintaan Konseling Terbaru</h3>
            <Link href="/admin/counseling-requests" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
              Lihat Semua <ArrowRight size={12} />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {data.counselingRequests.slice(0, 3).map(req => (
              <div key={req.id} className={`flex items-start justify-between gap-4 p-4 rounded-2xl border ${req.isRedFlag ? 'bg-amber-500/5 border-amber-500/20' : 'bg-white/3 border-white/5'}`}>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{req.name}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 font-heading tracking-widest">{req.riasec}</span>
                    {req.isRedFlag && <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-bold border border-amber-500/20">⚠ RED FLAG</span>}
                  </div>
                  <span className="text-xs text-slate-400">{req.className} · {req.goal}</span>
                  <p className="text-[10px] text-slate-500 mt-1 italic">&ldquo;{req.discussion}&rdquo;</p>
                </div>
                <Link href={`/portfolio/${req.id}`} className="shrink-0 py-1.5 px-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-[10px] font-bold rounded-xl border border-indigo-500/20 transition-all">
                  Portofolio
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
