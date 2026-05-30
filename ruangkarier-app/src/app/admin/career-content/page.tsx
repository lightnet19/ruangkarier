'use client';

import React from 'react';
import { careerContent, CareerPathway } from '@/data/careerContent';
import { BookOpen, Tag, CheckCircle2, Lightbulb, Building2 } from 'lucide-react';

const categoryColors: Record<string, string> = {
  ptn: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20',
  pts: 'bg-violet-500/15 text-violet-300 border-violet-500/20',
  ptkin: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
  kedinasan: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  kerja: 'bg-slate-500/15 text-slate-300 border-slate-500/20',
  wirausaha: 'bg-rose-500/15 text-rose-300 border-rose-500/20',
};

const categoryLabels: Record<string, string> = {
  ptn: 'PTN', pts: 'PTS', ptkin: 'PTKIN',
  kedinasan: 'Kedinasan', kerja: 'Vokasi / Kerja', wirausaha: 'Wirausaha',
};

const riasecColors: Record<string, string> = {
  R: 'bg-orange-500/15 text-orange-300', I: 'bg-blue-500/15 text-blue-300',
  A: 'bg-purple-500/15 text-purple-300', S: 'bg-green-500/15 text-green-300',
  E: 'bg-rose-500/15 text-rose-300', C: 'bg-slate-500/15 text-slate-300',
};

export default function CareerContentPage() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white font-heading">Konten Panduan Karier</h1>
        <p className="text-sm text-slate-400 mt-1">
          Pratinjau 6 jalur karier pasca-kelulusan yang ditampilkan kepada siswa. Konten ini diambil langsung dari basis data statis <code className="text-indigo-400 text-[11px] bg-indigo-500/10 px-1.5 py-0.5 rounded">src/data/careerContent.ts</code>.
        </p>
      </div>

      {/* Category summary chips */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(categoryLabels).map(([key, label]) => (
          <span key={key} className={`text-xs font-bold px-3 py-1.5 rounded-full border ${categoryColors[key]}`}>
            {label}
          </span>
        ))}
      </div>

      <div className="bg-slate-800/40 border border-amber-500/20 rounded-2xl px-5 py-3 text-xs text-amber-400 flex items-start gap-2">
        <Lightbulb size={14} className="mt-0.5 shrink-0" />
        <span>
          <strong>Catatan Developer:</strong> Pada prototype ini, konten karier bersifat statis. Untuk production, konten ini dapat dimigrasikan ke tabel database agar bisa diedit langsung melalui panel admin ini.
        </span>
      </div>

      {/* Career Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {careerContent.map((career: CareerPathway) => (
          <div
            key={career.id}
            className="bg-slate-900 rounded-3xl border border-white/5 overflow-hidden flex flex-col"
          >
            {/* Card Header */}
            <div className="p-5 border-b border-white/5 flex items-start justify-between gap-3">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${categoryColors[career.category]}`}>
                    {categoryLabels[career.category]}
                  </span>
                  {career.riasecTags.map(tag => (
                    <span key={tag} className={`text-[10px] font-black px-2 py-0.5 rounded font-heading tracking-widest ${riasecColors[tag]}`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-sm font-bold text-white font-heading leading-tight">{career.title}</h3>
              </div>
              <BookOpen size={18} className="text-slate-600 shrink-0 mt-1" />
            </div>

            {/* Description */}
            <div className="px-5 pt-4">
              <p className="text-xs text-slate-400 leading-relaxed">{career.description}</p>
            </div>

            {/* Requirements */}
            <div className="px-5 pt-4 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <CheckCircle2 size={12} />
                <span>Persyaratan Utama</span>
              </div>
              <ul className="flex flex-col gap-1">
                {career.requirements.map((req, i) => (
                  <li key={i} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Examples */}
            <div className="px-5 pt-4 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <Building2 size={12} />
                <span>Contoh Institusi</span>
              </div>
              <ul className="flex flex-col gap-1">
                {career.examples.map((ex, i) => (
                  <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                    <span className="text-violet-500 mt-0.5">›</span>
                    {ex}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips */}
            <div className="p-5 mt-auto">
              <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-xl px-4 py-3">
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Lightbulb size={11} /> Tips untuk Siswa
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">{career.tips}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
