'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StoriesBar } from '@/components/home/StoriesBar';
import { HeroBanner } from '@/components/home/HeroBanner';
import { FlashDeals } from '@/components/home/FlashDeals';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { TrustBadges } from '@/components/home/TrustBadges';
import { ProductCard } from '@/components/products/ProductCard';
import { INITIAL_PRODUCTS } from '@/data/catalog';
import { Sparkles, ArrowRight, Phone, Gift, Tag, Award } from 'lucide-react';

export default function HomePage() {
  const featuredProducts = INITIAL_PRODUCTS.filter((p) => p.featured).slice(0, 8);
  const bikesProducts = INITIAL_PRODUCTS.filter((p) => p.categoryId === 'cat-movilidad').slice(0, 4);
  const christmasSpecials = INITIAL_PRODUCTS.filter((p) => p.categoryId === 'cat-temporada-deportes').slice(0, 4);

  return (
    <div className="space-y-0">
      {/* 1. Visual Stories Bar (Instagram style) */}
      <StoriesBar />

      {/* 2. Hero Banner with Christmas 2026 Visual Campaign */}
      <HeroBanner />

      {/* 3. Flash Deals with Live Countdown Clock */}
      <FlashDeals />

      {/* 4. Official Category Navigation Grid (7 Categories) */}
      <CategoryGrid />

      {/* 5. Featured Products of the Catalog */}
      <section className="py-12 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-red uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Lo Más Vendido en OK Shop</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-950 mt-1">
                Productos Destacados de la Temporada
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Calidad garantizada, descuentos exclusivos y precios especiales pagando con transferencia
              </p>
            </div>

            <Link
              href="/productos?featured=true"
              className="text-xs font-bold text-brand-red hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Ver todos los destacados</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Special Christmas Feature (Anchetas & Juguetería) */}
      <section className="py-12 bg-gradient-to-r from-red-900 via-brand-red-dark to-emerald-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
            <div className="lg:col-span-8 space-y-2">
              <span className="text-xs font-bold bg-amber-400 text-gray-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Catálogo Navideño 2026
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white">
                Anchetas Navideñas de Lujo &amp; Juguetería
              </h3>
              <p className="text-xs sm:text-sm text-gray-200 max-w-xl">
                Sorprende a tu equipo de trabajo o a tu familia con canastas que combinan los mejores licores, delicias gourmet y juguetes para todas las edades.
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end gap-3">
              <a
                href="https://wa.me/573017777760?text=Hola%20OK%20Shop!%20Deseo%20cotizar%20anchetas%20navideñas%20corporativas"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-brand-whatsapp hover:bg-green-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
              >
                <Phone className="w-4 h-4" />
                <span>Cotizar por WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {christmasSpecials.map((product) => (
              <div key={product.id} className="text-gray-900">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Movilidad Eléctrica Spotlight */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Cero Emisiones • Ahorro Total
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-950 mt-1">
                Movilidad &amp; Vehículos Eléctricos
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Bicicletas eléctricas de largo alcance, motos y patinetas urbanas con garantía directa
              </p>
            </div>

            <Link
              href="/productos?categoria=movilidad-vehiculos"
              className="text-xs font-bold text-brand-red hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Ver todos los vehículos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bikesProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Promotional WhatsApp Full Banner */}
      <section className="bg-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-whatsapp text-white flex items-center justify-center flex-shrink-0 shadow-lg">
                <Phone className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-whatsapp uppercase tracking-wider">
                  Canal Oficial de Ventas &amp; Asesoría
                </p>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5">
                  Haz tu pedido directo al WhatsApp: <span className="text-brand-red">301 777 77 60</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Atención personalizada para cotizaciones empresariales, dudas sobre envíos o compras asistidas.
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/573017777760?text=Hola%20OK%20Shop!%20Quiero%20hacer%20un%20pedido%20o%20solicitar%20asesoría"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-brand-whatsapp hover:bg-green-600 text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-green-200 transition-all hover:scale-105 whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              <span>Chatear al 301 777 77 60</span>
            </a>
          </div>
        </div>
      </section>

      {/* 9. Trust Badges */}
      <TrustBadges />
    </div>
  );
}
