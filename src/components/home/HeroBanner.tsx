'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Phone,
  ArrowRight,
  ShieldCheck,
  Truck,
  Gift,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const HERO_SLIDES = [
  {
    title: 'Catálogo Navideño 2026',
    subtitle: 'Regalos que hacen especial esta Navidad',
    tagline: '¡Productos como éstos tenemos para ti!...',
    description: 'Bicicletas eléctricas y normales, tecnología de punta, lencería para el hogar, juguetes y anchetas exclusivas con despacho inmediato a todo Colombia.',
    primaryCtaText: 'Explorar Catálogo',
    primaryCtaLink: '#catalogo',
    whatsappCtaText: 'Pedir al 301 777 77 60',
    image: '/images/catalog/flyer_familia_navidad.jpg',
    accentColor: 'from-red-950 via-brand-red to-green-950',
    badge: 'EDICIÓN ESPECIAL 2026',
  },
  {
    title: 'Anchetas, Juguetes & Licores',
    subtitle: 'Diversión, alegría y momentos inolvidables',
    tagline: 'El detalle perfecto para compartir y celebrar',
    description: 'Canastas navideñas con licores premium y chocolates finos, además de los juguetes más deseados para los pequeños del hogar.',
    primaryCtaText: 'Ver Anchetas y Juguetes',
    primaryCtaLink: '/productos?categoria=temporada-deportes',
    whatsappCtaText: 'Cotizar al WhatsApp',
    image: '/images/catalog/flyer_juguetes_anchetas.jpg',
    accentColor: 'from-green-950 via-emerald-900 to-red-950',
    badge: 'EMPRESAS Y FAMILIAS',
  },
  {
    title: 'Movilidad & Tecnología',
    subtitle: 'Bicicletas Eléctricas, Smartwatches y Audio Hi-Res',
    tagline: 'Innovación y confort para tu día a día',
    description: 'E-Bikes con autonomía de 65km, patinetas de alta potencia y gadgets tecnológicos con precios de feria navideña.',
    primaryCtaText: 'Ver Vehículos & Tech',
    primaryCtaLink: '/productos?categoria=movilidad-vehiculos',
    whatsappCtaText: 'Asesoría Inmediata',
    image: '/images/catalog/flyer_tecnologia_bicis.jpg',
    accentColor: 'from-blue-950 via-brand-red-dark to-slate-900',
    badge: 'HASTA -35% DE DESCUENTO',
  },
];

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative overflow-hidden bg-gray-950 text-white">
      {/* Dynamic slide background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${slide.accentColor} opacity-90 transition-all duration-1000`}
      />

      {/* Subtle festive background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            {/* Christmas Campaign Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{slide.badge}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="text-white/80">OK Shop Colombia</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white drop-shadow-md">
                {slide.title}
              </h1>
              <p className="text-lg sm:text-2xl font-bold text-amber-300 drop-shadow">
                {slide.subtitle}
              </p>
              <p className="text-sm sm:text-base font-semibold text-white/90 italic">
                &ldquo;{slide.tagline}&rdquo;
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-200 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {slide.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href={slide.primaryCtaLink}
                className="w-full sm:w-auto px-6 py-3.5 bg-brand-red hover:bg-brand-red-dark text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-red-900/60 transition-all hover:scale-105"
              >
                <span>{slide.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="https://wa.me/573017777760?text=Hola%20OK%20Shop!%20Deseo%20hacer%20un%20pedido%20del%20Catálogo%20Navideño%202026"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3.5 bg-brand-whatsapp hover:bg-green-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-green-950/40"
              >
                <Phone className="w-4 h-4" />
                <span>{slide.whatsappCtaText}</span>
              </a>
            </div>

            {/* Trust highlights */}
            <div className="pt-4 grid grid-cols-3 gap-2 sm:gap-4 border-t border-white/10 text-[11px] text-gray-300">
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <Truck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Envíos Gratis &gt; $150k</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Garantía Directa OK</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <Gift className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>Factura DIAN Legal</span>
              </div>
            </div>
          </div>

          {/* Right Image Visual */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 group">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />

              {/* Floating WhatsApp pill badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center justify-between text-gray-900 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-whatsapp text-white flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-semibold leading-none">
                      Haz tu pedido por WhatsApp
                    </p>
                    <p className="text-xs font-black text-brand-red leading-tight">
                      301 777 77 60
                    </p>
                  </div>
                </div>

                <a
                  href="https://wa.me/573017777760?text=Hola%20OK%20Shop!%20Quiero%20comprar%20del%20Catálogo%20Navideño"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-brand-red text-white text-[11px] font-bold rounded-xl hover:bg-brand-red-dark transition-colors"
                >
                  Pedir ya
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-brand-red'
                  : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Ir a diapositiva ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
