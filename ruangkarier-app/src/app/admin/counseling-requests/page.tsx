'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MessageSquare, ShieldAlert, Calendar, Target, FileText, Search } from 'lucide-react';

interface CounselingRequest {
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
}

export default function CounselingRequestsPage() {
  const [requests, setRequests] = useState<CounselingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterFlag, setFilterFlag] = useState<'all' | 'redflag'>('all');

  const fetchData = useCallback(async () => {
    const passcode = sessionStorage.getItem('rk_admin_passcode') || '';
    const res = await fetch(`/api/admin/data?passcode=${passcode}`);
    if (res.ok) {
      const d = await res.json();
      setRequests(d.counselingRequests || []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = requests.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      r.name.toLowerCase().includes(q) ||
      r.goal.toLowerCase().includes(q) ||
      r.discussion.toLowerCase().includes(q);
    if (filterFlag === 'redflag') return matchSearch && r.isRedFlag;
    return matchSearch;
  }).sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

  const flagCount = requests.filter(r => r.isRedFlag).length;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white font-heading">Permintaan Konseling Lanjutan</h1>
        <p className="text-sm text-slate-400 mt-1">
          Daftar siswa yang menandai <em>Rencana Tindak Lanjut (RTL)</em> dan meminta sesi konseling lebih lanjut bersama Guru BK.
        </p>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3">
        <span className="text-xs font-bold px-3 py-1.5 rounded-full border bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
          {requests.length} Total Permintaan
        </span>
        <span className="text-xs font-bold px-3 py-1.5 rounded-full border bg-amber-500/10 text-amber-400 border-amber-500/20">
          {flagCount} Red Flag
        </span>
        <span className="text-xs font-bold px-3 py-1.5 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
          {requests.length - flagCount} Stabil
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama, tujuan, atau catatan..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
        <select
          value={filterFlag}
          onChange={e => setFilterFlag(e.target.value as 'all' | 'redflag')}
          className="py-2.5 px-4 bg-slate-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none cursor-pointer"
        >
          <option value="all">Semua</option>
          <option value="redflag">Hanya Red Flag</option>
        </select>
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 rounded-3xl border border-white/5 p-16 text-center">
          <MessageSquare size={40} className="mx-auto mb-4 text-slate-700" />
          <p className="text-slate-400 font-semibold">Belum ada permintaan konseling</p>
          <p className="text-xs text-slate-600 mt-1">Permintaan akan muncul ketika siswa menandai &ldquo;Kirim ke Guru BK&rdquo; di langkah evaluasi.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(req => (
            <div
              key={req.id}
              className={`bg-slate-900 rounded-3xl border p-6 flex flex-col gap-4 transition-all ${
                req.isRedFlag ? 'border-amber-500/25 bg-amber-500/3' : 'border-white/5'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-black text-white font-heading">{req.name}</span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 font-heading tracking-widest">{req.riasec}</span>
                    {req.isRedFlag && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                        <ShieldAlert size={10} /> RED FLAG
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{req.className}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/portfolio/${req.id}`}
                    className="flex items-center gap-1.5 py-2 px-4 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-xs font-bold rounded-xl border border-indigo-500/20 transition-all"
                  >
                    <FileText size={14} />
                    <span>Portofolio</span>
                  </Link>
                </div>
              </div>

              {/* Info row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-800/60 rounded-xl p-3 flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Target Karier</span>
                  <span className="text-[11px] text-white font-semibold leading-tight">{req.goal}</span>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-3 flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Cemas Awal → Akhir</span>
                  <span className="text-[11px] font-black">
                    <span className="text-rose-400">{req.anxiety}</span>
                    <span className="text-slate-600 mx-1">→</span>
                    <span className="text-emerald-400">{req.postAnxiety}</span>
                    <span className="text-slate-500 font-normal text-[9px]">/10</span>
                  </span>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-3 flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={9} /> Waktu Kirim
                  </span>
                  <span className="text-[11px] text-white">
                    {new Date(req.sentAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className={`rounded-xl p-3 flex flex-col gap-0.5 ${req.isRedFlag ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Prioritas</span>
                  <span className={`text-[11px] font-bold ${req.isRedFlag ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {req.isRedFlag ? '⚠ Segera Ditindaklanjuti' : '✓ Normal'}
                  </span>
                </div>
              </div>

              {/* Discussion note */}
              <div className="bg-slate-800/40 rounded-2xl px-4 py-3 border border-white/5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <MessageSquare size={10} /> Catatan Diskusi dari Siswa
                </p>
                <p className="text-xs text-slate-300 leading-relaxed italic">&ldquo;{req.discussion}&rdquo;</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
