'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Settings, KeyRound, School, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [schoolName, setSchoolName] = useState('');
  const [bkPasscode, setBkPasscode] = useState('');
  const [currentAdminPass, setCurrentAdminPass] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [savingSchool, setSavingSchool] = useState(false);
  const [savingAdminPass, setSavingAdminPass] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = useCallback(async () => {
    const passcode = sessionStorage.getItem('rk_admin_passcode') || '';
    const res = await fetch(`/api/admin/data?passcode=${passcode}`);
    if (res.ok) {
      const d = await res.json();
      setSchoolName(d.counselorSettings?.schoolName || '');
      setBkPasscode(d.counselorSettings?.passcode || '');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const handleSaveSchool = async () => {
    setSavingSchool(true);
    const passcode = sessionStorage.getItem('rk_admin_passcode') || '';
    try {
      const res = await fetch(`/api/admin/data?passcode=${passcode}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolName, bkPasscode }),
      });
      const d = await res.json();
      if (res.ok) showMsg('success', 'Pengaturan sekolah berhasil disimpan.');
      else showMsg('error', d.error || 'Gagal menyimpan.');
    } catch {
      showMsg('error', 'Gagal terhubung ke server.');
    } finally {
      setSavingSchool(false);
    }
  };

  const handleChangeAdminPass = async () => {
    if (newAdminPass !== confirmAdminPass) {
      showMsg('error', 'Konfirmasi kode sandi baru tidak cocok.'); return;
    }
    setSavingAdminPass(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPasscode: currentAdminPass, newPasscode: newAdminPass }),
      });
      const d = await res.json();
      if (res.ok) {
        sessionStorage.setItem('rk_admin_passcode', newAdminPass);
        showMsg('success', 'Kode sandi Admin berhasil diperbarui.');
        setCurrentAdminPass(''); setNewAdminPass(''); setConfirmAdminPass('');
      } else {
        showMsg('error', d.error || 'Gagal memperbarui kode sandi.');
      }
    } catch {
      showMsg('error', 'Gagal terhubung ke server.');
    } finally {
      setSavingAdminPass(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white font-heading">Pengaturan Sistem</h1>
        <p className="text-sm text-slate-400 mt-1">Konfigurasi nama sekolah, kode sandi Guru BK, dan kode sandi Admin.</p>
      </div>

      {/* Toast notification */}
      {msg && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold ${
          msg.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {msg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {msg.text}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* School Settings */}
          <div className="bg-slate-900 rounded-3xl border border-white/5 p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4">
              <School size={16} className="text-indigo-400" />
              <h3 className="text-sm font-bold text-white font-heading">Pengaturan Sekolah & Guru BK</h3>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama Sekolah</label>
              <input
                type="text"
                value={schoolName}
                onChange={e => setSchoolName(e.target.value)}
                className="bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                placeholder="Nama sekolah..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Kode Sandi Guru BK</label>
              <input
                type="text"
                value={bkPasscode}
                onChange={e => setBkPasscode(e.target.value)}
                className="bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                placeholder="Kode sandi Guru BK..."
              />
              <p className="text-[10px] text-slate-600">Kode ini digunakan oleh Guru BK untuk mengakses Dasbor Konselor di /counselor.</p>
            </div>

            <button
              onClick={handleSaveSchool}
              disabled={savingSchool}
              className="flex items-center justify-center gap-2 py-3 px-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
            >
              {savingSchool ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              <span>{savingSchool ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
            </button>
          </div>

          {/* Admin Password Change */}
          <div className="bg-slate-900 rounded-3xl border border-white/5 p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4">
              <KeyRound size={16} className="text-amber-400" />
              <h3 className="text-sm font-bold text-white font-heading">Ganti Kode Sandi Admin</h3>
            </div>

            {[
              { label: 'Kode Sandi Saat Ini', value: currentAdminPass, setter: setCurrentAdminPass, placeholder: 'Kode sandi admin saat ini...' },
              { label: 'Kode Sandi Baru', value: newAdminPass, setter: setNewAdminPass, placeholder: 'Kode sandi baru (min. 6 karakter)...' },
              { label: 'Konfirmasi Kode Sandi Baru', value: confirmAdminPass, setter: setConfirmAdminPass, placeholder: 'Ulangi kode sandi baru...' },
            ].map(field => (
              <div key={field.label} className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{field.label}</label>
                <input
                  type="password"
                  value={field.value}
                  onChange={e => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  className="bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all font-mono"
                />
              </div>
            ))}

            <button
              onClick={handleChangeAdminPass}
              disabled={savingAdminPass || !currentAdminPass || !newAdminPass || !confirmAdminPass}
              className="flex items-center justify-center gap-2 py-3 px-6 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
            >
              {savingAdminPass ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />}
              <span>{savingAdminPass ? 'Memperbarui...' : 'Perbarui Kode Sandi Admin'}</span>
            </button>
          </div>

          {/* System Info */}
          <div className="bg-slate-900 rounded-3xl border border-white/5 p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4">
              <Settings size={16} className="text-slate-500" />
              <h3 className="text-sm font-bold text-white font-heading">Informasi Sistem</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                ['Arsitektur', 'Next.js 16.2 (App Router)'],
                ['Database', 'Flatfile JSON (data/db.json)'],
                ['Autentikasi', 'Passcode-based (session storage)'],
                ['Mode', 'Prototype / Development'],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">{k}</span>
                  <span className="text-slate-300">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
