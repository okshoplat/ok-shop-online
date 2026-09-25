'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  FileText,
  Instagram,
  Facebook,
  Sparkles,
} from 'lucide-react';
import { CATEGORIES_TAXONOMY } from '@/data/catalog';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & Contact */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-red to-brand-red-dark flex items-center justify-center text-white shadow-lg">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black text-white tracking-tight">
                  OK <span className="text-brand-red">SHOP</span>
                </span>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Variedad • Calidad • Tu Mejor Opción
                </p>
              </div>
            </Link>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Tu tienda online de confianza en Colombia. Especialistas en movilidad eléctrica, tecnología, electrodomésticos, lencería para el hogar, anchetas navideñas y licores seleccionados.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2.5 text-gray-300">
                <Phone className="w-4 h-4 text-brand-whatsapp flex-shrink-0" />
                <span>WhatsApp de Ventas: <strong>301 777 77 60</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-300">
                <Mail className="w-4 h-4 text-brand-red flex-shrink-0" />
                <span>contacto@okshop.com.co</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-300">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Carrera 15 # 93-60, Bogotá D.C., Colombia</span>
              </div>
            </div>

            {/* Social Icons matching the flyers */}
            <div className="pt-2 flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-400">Síguenos en redes:</span>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-red text-white flex items-center justify-center transition-colors"
                aria-label="Instagram de OK Shop"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
                aria-label="Facebook de OK Shop"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-black text-white flex items-center justify-center transition-colors text-xs font-bold"
                aria-label="TikTok de OK Shop"
              >
                TK
              </a>
            </div>
          </div>

          {/* Column 2: Categorías Principales */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-red pl-2">
              Categorías
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES_TAXONOMY.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/productos?categoria=${c.slug}`}
                    className="hover:text-white hover:underline transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Portal del Cliente */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-green pl-2">
              Portal del Cliente
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/mi-cuenta" className="hover:text-white transition-colors">
                  Mi Cuenta &amp; Direcciones
                </Link>
              </li>
              <li>
                <Link href="/sigue-tu-pedido" className="hover:text-white transition-colors flex items-center gap-1.5 text-amber-300 font-semibold">
                  <Sparkles className="w-3 h-3" />
                  <span>Sigue tu Pedido en Vivo</span>
                </Link>
              </li>
              <li>
                <Link href="/factura-electronica" className="hover:text-white transition-colors">
                  Facturación Electrónica DIAN
                </Link>
              </li>
              <li>
                <Link href="/pqrs" className="hover:text-white transition-colors">
                  PQRS &amp; Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="/productos?flashDeals=true" className="hover:text-white transition-colors">
                  Ofertas Relámpago
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Respaldo y DIAN */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-400 pl-2">
              Respaldo Legal
            </h4>
            <div className="space-y-3 text-xs text-gray-400">
              <p>
                <strong>OK SHOP COMERCIALIZADORA S.A.S.</strong><br />
                NIT: 901.458.789-3<br />
                Régimen Común DIAN
              </p>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>DIAN Facturación</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-snug">
                  Resolución No. 187640029104 con validación CUFE y entrega directa por correo.
                </p>
              </div>

              <div className="pt-2 text-[10px] text-gray-400">
                Estatuto del Consumidor (Ley 1480 de 2011). Derecho de retracto y reversión de pago.
              </div>
            </div>
          </div>
        </div>

        {/* Payment badges & Copyright bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="font-semibold text-gray-400">Medios de pago autorizados:</span>
            <span className="px-2 py-1 bg-white/10 rounded font-bold text-white text-[11px]">NEQUI</span>
            <span className="px-2 py-1 bg-white/10 rounded font-bold text-white text-[11px]">DAVIPLATA</span>
            <span className="px-2 py-1 bg-white/10 rounded font-bold text-white text-[11px]">PSE</span>
            <span className="px-2 py-1 bg-white/10 rounded font-bold text-white text-[11px]">BANCOLOMBIA</span>
            <span className="px-2 py-1 bg-white/10 rounded font-bold text-white text-[11px]">VISA / MASTERCARD</span>
            <span className="px-2 py-1 bg-white/10 rounded font-bold text-white text-[11px]">CONTRA ENTREGA</span>
          </div>

          <p className="text-center md:text-right">
            &copy; {new Date().getFullYear()} OK Shop Tienda Online. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
