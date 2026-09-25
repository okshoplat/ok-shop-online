'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Clock, ArrowRight, Flame } from 'lucide-react';
import { INITIAL_PRODUCTS, ProductData } from '@/data/catalog';
import { ProductCard } from '@/components/products/ProductCard';

export const FlashDeals: React.FC = () => {
  // 12-hour countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({
    hours: 11,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flashProducts = INITIAL_PRODUCTS.filter((p) => p.isFlashDeal);

  return (
    <section className="py-12 bg-gradient-to-b from-amber-500/10 via-white to-gray-50 border-y border-amber-200/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flash Deals Header Bar */}
        <div className="bg-gradient-to-r from-red-600 via-brand-red to-amber-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-white text-xs font-black uppercase tracking-wider backdrop-blur-sm">
              <Flame className="w-4 h-4 fill-amber-300 text-amber-300 animate-bounce" />
              <span>Precios de Locura Navideña</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Ofertas Relámpago de Hoy
            </h2>
            <p className="text-xs sm:text-sm text-white/90 max-w-md">
              Descuentos irrepetibles por tiempo y unidades limitadas. ¡Aprovecha antes de que se agote el cronómetro!
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3 bg-black/30 p-4 rounded-2xl backdrop-blur-md border border-white/20">
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black bg-white text-gray-900 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner font-mono">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 mt-1">
                Horas
              </span>
            </div>

            <span className="text-2xl font-black text-amber-300 pb-4">:</span>

            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black bg-white text-gray-900 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner font-mono">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 mt-1">
                Minutos
              </span>
            </div>

            <span className="text-2xl font-black text-amber-300 pb-4">:</span>

            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black bg-brand-gold text-gray-950 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner font-mono">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 mt-1">
                Segundos
              </span>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {flashProducts.map((product) => (
            <div key={product.id} className="flex flex-col">
              <ProductCard product={product} />

              {/* Stock sold progress indicator */}
              <div className="mt-2 p-2 bg-amber-50 rounded-xl border border-amber-200/60 text-xs">
                <div className="flex justify-between font-semibold text-amber-900 text-[11px] mb-1">
                  <span>¡Solo quedan {product.stockQuantity} unidades!</span>
                  <span>78% vendido</span>
                </div>
                <div className="w-full bg-amber-200/70 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-red h-full rounded-full w-3/4 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/productos?flashDeals=true"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 hover:bg-brand-red text-white text-xs font-bold transition-all shadow-md hover:scale-105"
          >
            <span>Ver todas las ofertas relámpago ({flashProducts.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
