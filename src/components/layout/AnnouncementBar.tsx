'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Phone, Truck, ShieldCheck } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-brand-red via-brand-red-dark to-brand-green text-white text-xs sm:text-sm py-2 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-white text-brand-red uppercase tracking-wider animate-pulse">
            🎅 Catálogo 2026
          </span>
          <span className="hidden md:inline">
            ¡Regalos que hacen especial esta Navidad! Envíos gratis por compras superiores a <strong>$150.000 COP</strong>
          </span>
          <span className="md:hidden">
            ¡Catálogo Navideño 2026! Envíos gratis &gt; $150.000 COP
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <Link
            href="/sigue-tu-pedido"
            className="hidden lg:flex items-center gap-1 hover:text-brand-gold transition-colors"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Rastreo Nacional</span>
          </Link>

          <span className="hidden lg:inline text-white/40">|</span>

          <a
            href="https://wa.me/573017777760?text=Hola%20OK%20Shop!%20Quiero%20información%20del%20Catálogo%20Navideño%202026"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-brand-whatsapp/90 hover:bg-brand-whatsapp text-white px-2.5 py-0.5 rounded-full font-semibold transition-all hover:scale-105 shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>WhatsApp: 301 777 77 60</span>
          </a>
        </div>
      </div>
    </div>
  );
};
