'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FileBarChart2, Download, FileText, BarChart2, Calendar, Users, Loader2 } from 'lucide-react';

interface ReportStats {
  total: number;
  redFlags: number;
  completionRate: number;
  avgInitialAnxiety: number;
  avgPostAnxiety: number;
  anxietyReduction: number;
}

export default function ReportsPage() {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState<'json' | 'csv' | null>(null);
  const [schoolName, setSchoolName] = useState('');

  const fetchData = useCallback(async () => {
    const passcode = sessionStorage.getItem('rk_admin_passcode') || '';
    const res = await fetch(`/api/admin/data?passcode=${passcode}`);
    if (res.ok) {
      const d = await res.json();
      setStats(d.stats);
      setSchoolName(d.counselorSettings?.schoolName || 'SMA Negeri Pilihan');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleExport = async (format: 'json' | 'csv') => {
    setIsExporting(format);
    const passcode = sessionStorage.getItem('rk_admin_passcode') || '';
    const res = await fetch(`/api/admin/reports?passcode=${passcode}&format=${format}`);
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ruangkarier-report-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setIsExporting(null);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white font-heading">Ekspor Laporan Analitik</h1>
        <p className="text-sm text-slate-400 mt-1">
          Unduh laporan agregat program bimbingan karier RuangKarier dalam format JSON atau CSV untuk keperluan dokumentasi institusi.
        </p>
      </div>

      {/* School Info Banner */}
      {!isLoading && (
        <div className="bg-slate-900 rounded-2xl border border-white/5 px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nama Sekolah</span>
            <span className="text-sm font-bold text-white mt-0.5">{schoolName}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tanggal Ekspor</span>
            <span className="text-sm font-bold text-white mt-0.5">
              {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : stats ? (
        <div className="bg-slate-900 rounded-3xl border border-white/5 p-6 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <BarChart2 size={16} className="text-indigo-400" />
            <span className="text-sm font-bold text-white font-heading">Ringkasan Laporan</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Total Siswa', value: stats.total, icon: Users, color: 'text-indigo-400' },
              { label: 'Red Flag', value: stats.redFlags, icon: FileBarChart2, color: 'text-amber-400' },
              { label: 'Penyelesaian', value: `${stats.completionRate}%`, icon: FileText, color: 'text-emerald-400' },
              { label: 'Cemas Awal (Rerata)', value: `${stats.avgInitialAnxiety}/10`, icon: BarChart2, color: 'text-rose-400' },
              { label: 'Cemas Akhir (Rerata)', value: `${stats.avgPostAnxiety}/10`, icon: BarChart2, color: 'text-emerald-400' },
              { label: 'Reduksi Kecemasan', value: `${stats.anxietyReduction} poin`, icon: Calendar, color: 'text-violet-400' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-slate-800/60 rounded-2xl p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <Icon size={12} className={item.color} />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                  </div>
                  <span className="text-xl font-black text-white">{item.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Export Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* JSON Export */}
        <div className="bg-slate-900 rounded-3xl border border-white/5 p-6 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <FileText size={18} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Laporan JSON</h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Format data terstruktur lengkap. Cocok untuk integrasi dengan sistem lain atau analisis lanjutan.
              </p>
            </div>
          </div>
          <ul className="flex flex-col gap-1.5">
            {['Ringkasan analitik program', 'Data lengkap semua siswa', 'Metadata tanggal & sekolah'].map(f => (
              <li key={f} className="text-xs text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleExport('json')}
            disabled={isExporting !== null}
            className="mt-auto w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
          >
            {isExporting === 'json'
              ? <Loader2 size={16} className="animate-spin" />
              : <Download size={16} />
            }
            <span>{isExporting === 'json' ? 'Mengunduh...' : 'Unduh Laporan JSON'}</span>
          </button>
        </div>

        {/* CSV Export */}
        <div className="bg-slate-900 rounded-3xl border border-white/5 p-6 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <BarChart2 size={18} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Laporan CSV</h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Format spreadsheet tabel. Dapat langsung dibuka di Microsoft Excel atau Google Sheets.
              </p>
            </div>
          </div>
          <ul className="flex flex-col gap-1.5">
            {['Satu baris per siswa', 'Kolom: nama, kelas, RIASEC, kecemasan', 'Kompatibel Excel & Google Sheets'].map(f => (
              <li key={f} className="text-xs text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting !== null}
            className="mt-auto w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
          >
            {isExporting === 'csv'
              ? <Loader2 size={16} className="animate-spin" />
              : <Download size={16} />
            }
            <span>{isExporting === 'csv' ? 'Mengunduh...' : 'Unduh Laporan CSV'}</span>
          </button>
        </div>
      </div>

      <p className="text-[10px] text-slate-600 text-center">
        Laporan berisi data pribadi siswa. Simpan dan kelola sesuai kebijakan privasi institusi yang berlaku.
      </p>
    </div>
  );
}
