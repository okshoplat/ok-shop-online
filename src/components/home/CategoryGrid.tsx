'use client';

import React from 'react';
import Link from 'next/link';
import {
  Bike,
  Smartphone,
  Tv,
  BedDouble,
  Sparkles,
  Wine,
  Gift,
  ArrowRight,
} from 'lucide-react';
import { CATEGORIES_TAXONOMY } from '@/data/catalog';

const ICON_MAP: Record<string, React.ReactNode> = {
  Bike: <Bike className="w-8 h-8" />,
  Smartphone: <Smartphone className="w-8 h-8" />,
  Tv: <Tv className="w-8 h-8" />,
  BedDouble: <BedDouble className="w-8 h-8" />,
  Sparkles: <Sparkles className="w-8 h-8" />,
  Wine: <Wine className="w-8 h-8" />,
  Gift: <Gift className="w-8 h-8" />,
};

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  'cat-movilidad': { bg: 'bg-blue-50 hover:bg-blue-100/80', text: 'text-blue-700', border: 'border-blue-200' },
  'cat-tecnologia': { bg: 'bg-purple-50 hover:bg-purple-100/80', text: 'text-purple-700', border: 'border-purple-200' },
  'cat-electrodomesticos': { bg: 'bg-amber-50 hover:bg-amber-100/80', text: 'text-amber-700', border: 'border-amber-200' },
  'cat-hogar': { bg: 'bg-rose-50 hover:bg-rose-100/80', text: 'text-rose-700', border: 'border-rose-200' },
  'cat-aseo-mascotas': { bg: 'bg-teal-50 hover:bg-teal-100/80', text: 'text-teal-700', border: 'border-teal-200' },
  'cat-licores-termos': { bg: 'bg-indigo-50 hover:bg-indigo-100/80', text: 'text-indigo-700', border: 'border-indigo-200' },
  'cat-temporada-deportes': { bg: 'bg-red-50 hover:bg-red-100/80', text: 'text-brand-red', border: 'border-red-300' },
};

export const CategoryGrid: React.FC = () => {
  return (
    <section id="catalogo" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
          <div>
            <span className="text-xs font-bold text-brand-red uppercase tracking-wider">
              Navegación Oficial
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              Explora por Categoría
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Encuentra rápidamente los productos de nuestro catálogo oficial 2026
            </p>
          </div>

          <Link
            href="/productos"
            className="text-xs font-bold text-brand-red hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Ver todo el catálogo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES_TAXONOMY.map((cat) => {
            const colors = COLOR_MAP[cat.id] || {
              bg: 'bg-gray-50 hover:bg-gray-100',
              text: 'text-gray-700',
              border: 'border-gray-200',
            };

            return (
              <Link
                key={cat.id}
                href={`/productos?categoria=${cat.slug}`}
                className={`group p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md ${colors.bg} ${colors.border}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl bg-white shadow-sm ${colors.text} group-hover:scale-110 transition-transform`}>
                      {ICON_MAP[cat.icon] || <Gift className="w-8 h-8" />}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded-full text-gray-600">
                      {cat.subcategories.length} subcategorías
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mt-4 group-hover:text-brand-red transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-semibold text-gray-700 group-hover:text-brand-red">
                  <span>Ver productos</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
