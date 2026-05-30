'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Users, ShieldAlert, Search, FileText, Trash2, ChevronDown } from 'lucide-react';

interface StudentRow {
  id: string;
  profile?: { name: string; className: string; confidenceScore: number };
  riasecScores?: { top3Code: string };
  anxietyLogs?: { graduationAnxietyScore: number; triggeredAlert: boolean; needsImmediateHelp: boolean };
  evaluation?: { postAnxietyScore: number; sentToCounselor: boolean; understandingScore: number; comfortScore: number; actionScore: number };
  actionPlan?: { goal: string };
  createdAt: string;
}

export default function AssessmentsPage() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterFlag, setFilterFlag] = useState<'all' | 'redflag' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'anxiety' | 'name'>('date');

  const fetchData = useCallback(async () => {
    const passcode = sessionStorage.getItem('rk_admin_passcode') || '';
    const res = await fetch(`/api/admin/data?passcode=${passcode}`);
    if (res.ok) {
      const d = await res.json();
      setStudents(d.students || []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus data siswa ini secara permanen?')) return;
    const passcode = sessionStorage.getItem('rk_admin_passcode') || '';
    await fetch(`/api/admin/data?passcode=${passcode}&id=${id}`, { method: 'DELETE' });
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const filtered = students
    .filter(s => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        s.profile?.name?.toLowerCase().includes(q) ||
        s.profile?.className?.toLowerCase().includes(q) ||
        s.riasecScores?.top3Code?.toLowerCase().includes(q) ||
        s.actionPlan?.goal?.toLowerCase().includes(q);
      const isFlag = s.anxietyLogs?.triggeredAlert || s.anxietyLogs?.needsImmediateHelp;
      const isDone = s.evaluation?.sentToCounselor;
      if (filterFlag === 'redflag') return matchSearch && isFlag;
      if (filterFlag === 'completed') return matchSearch && isDone;
      return matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'anxiety') return (b.anxietyLogs?.graduationAnxietyScore || 0) - (a.anxietyLogs?.graduationAnxietyScore || 0);
      if (sortBy === 'name') return (a.profile?.name || '').localeCompare(b.profile?.name || '');
      return 0;
    });

  const redFlagCount = students.filter(s => s.anxietyLogs?.triggeredAlert || s.anxietyLogs?.needsImmediateHelp).length;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white font-heading">Data Asesmen Siswa</h1>
        <p className="text-sm text-slate-400 mt-1">Rekam jejak lengkap asesmen Holland RIASEC, CBT, dan status portofolio seluruh siswa.</p>
      </div>

      {/* Stat chips */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: `${students.length} Total`, color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
          { label: `${redFlagCount} Red Flag`, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
          { label: `${students.filter(s => s.evaluation?.sentToCounselor).length} Selesai`, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
        ].map(c => (
          <span key={c.label} className={`text-xs font-bold px-3 py-1.5 rounded-full border ${c.color}`}>{c.label}</span>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama, kelas, kode Holland..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
        <select
          value={filterFlag}
          onChange={e => setFilterFlag(e.target.value as 'all' | 'redflag' | 'completed')}
          className="py-2.5 px-4 bg-slate-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none cursor-pointer appearance-none"
        >
          <option value="all">Semua Status</option>
          <option value="redflag">Hanya Red Flag</option>
          <option value="completed">Selesai & Terkirim</option>
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as 'date' | 'anxiety' | 'name')}
          className="py-2.5 px-4 bg-slate-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none cursor-pointer appearance-none"
        >
          <option value="date">Urutkan: Terbaru</option>
          <option value="anxiety">Urutkan: Kecemasan ↓</option>
          <option value="name">Urutkan: Nama A-Z</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-slate-900 rounded-3xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-800/60 text-slate-400 font-heading text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4 text-center">Holland Code</th>
                  <th className="py-3 px-4 text-center">Cemas Awal</th>
                  <th className="py-3 px-4 text-center">Cemas Akhir</th>
                  <th className="py-3 px-4">Target Karier</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Tanggal</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length > 0 ? filtered.map(s => {
                  const isFlag = s.anxietyLogs?.triggeredAlert || s.anxietyLogs?.needsImmediateHelp;
                  const isDone = s.evaluation?.sentToCounselor;
                  return (
                    <tr key={s.id} className={`hover:bg-white/3 transition-all ${isFlag ? 'bg-amber-500/3' : ''}`}>
                      <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {isFlag && <ShieldAlert size={12} className="text-amber-400 shrink-0" />}
                          {s.profile?.name || '—'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">{s.profile?.className || '—'}</td>
                      <td className="py-3 px-4 text-center">
                        {s.riasecScores?.top3Code ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-widest bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 font-heading">
                            {s.riasecScores.top3Code}
                          </span>
                        ) : <span className="text-slate-600">—</span>}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-rose-400">
                        {s.anxietyLogs?.graduationAnxietyScore ?? '—'}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-400">
                        {s.evaluation?.postAnxietyScore ?? '—'}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-slate-300">
                        {s.actionPlan?.goal || '—'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isDone
                          ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">Selesai</span>
                          : <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 font-bold">Progres</span>
                        }
                      </td>
                      <td className="py-3 px-4 text-center text-slate-500 whitespace-nowrap">
                        {new Date(s.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/portfolio/${s.id}`}
                            className="py-1.5 px-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-[10px] font-bold rounded-lg border border-indigo-500/20 transition-all flex items-center gap-1"
                          >
                            <FileText size={11} /> <span>Lihat</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-1.5 hover:bg-rose-500/10 text-slate-600 hover:text-rose-400 rounded-lg transition-all border border-transparent hover:border-rose-500/20 cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-slate-500">
                      <Users size={32} className="mx-auto mb-3 opacity-30" />
                      <p className="font-semibold text-slate-400">Tidak ada data ditemukan</p>
                      <p className="text-xs mt-1">Coba ubah filter pencarian atau tambahkan data simulasi dari Dasbor Guru BK.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
