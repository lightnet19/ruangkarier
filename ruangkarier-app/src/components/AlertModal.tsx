'use client';

import React from 'react';
import { ShieldAlert, MessageCircle, ArrowRight } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
}

export function AlertModal({ isOpen, onClose, studentName }: AlertModalProps) {
  if (!isOpen) return null;

  const handleWhatsAppClick = () => {
    // Simulated WhatsApp BK link with custom text
    const message = encodeURIComponent(
      `Halo Guru BK RuangKarier, saya ${studentName || 'Siswa'} kelas XI/XII ingin bercerita dan berkonsultasi mengenai rencana serta kecemasan karier masa depan saya.`
    );
    window.open(`https://wa.me/628123456789?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-md animate-fade-in-up">
      <div className="w-full max-w-md overflow-hidden bg-gradient-to-br from-amber-50 to-white border-2 border-accent rounded-3xl shadow-2xl glass-card animate-float">
        
        {/* Warning Indicator Header */}
        <div className="relative flex items-center justify-center py-6 bg-accent/10 border-b border-accent/20">
          <div className="absolute top-3 right-3 flex space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
          </div>
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/20 text-accent">
            <ShieldAlert size={28} className="stroke-[2.5]" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold text-primary font-heading mb-3">
            Hei {studentName ? studentName : 'Sobat'}, menarik napas dalam-dalam dulu yuk... 🌾
          </h3>
          <p className="text-sm text-text-dark/95 leading-relaxed mb-6">
            Merasa bingung, cemas, atau tertekan memikirkan masa depan adalah hal yang <strong>sangat wajar</strong> bagi remaja seusiamu. Kamu tidak harus memikul semua beban ini sendirian. 
          </p>
          <div className="bg-white/80 rounded-2xl p-4 border border-accent/10 mb-6 text-left shadow-inner">
            <p className="text-xs text-primary font-semibold font-heading mb-1 uppercase tracking-wider text-accent">
              Pesan Hangat Dari Kami:
            </p>
            <p className="text-xs text-text-dark italic leading-relaxed">
              &ldquo;Kami di sini untuk mendengarkan, mendukung, dan menemanimu merancang masa depan dengan tenang, tanpa ada penilaian buruk sedikit pun.&rdquo;
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <MessageCircle size={20} className="fill-white/10" />
              <span>Hubungi Guru BK via WhatsApp</span>
            </button>
            
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 w-full py-3 px-4 bg-white/70 hover:bg-white hover:text-accent text-primary font-semibold rounded-2xl border border-primary/10 transition-all cursor-pointer"
            >
              <span>Saya Sudah Lebih Tenang & Ingin Lanjut Tes</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Muted Footer */}
        <div className="bg-primary/5 py-3 text-center border-t border-primary/5">
          <p className="text-[10px] text-muted-gray">
            Kerahasiaan data dan proses konseling dijamin 100% aman &amp; profesional.
          </p>
        </div>
      </div>
    </div>
  );
}
export default AlertModal;
