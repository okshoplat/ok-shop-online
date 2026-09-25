'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Menu,
  ChevronDown,
  ChevronRight,
  Bike,
  Smartphone,
  Tv,
  BedDouble,
  Sparkles,
  Wine,
  Gift,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { CATEGORIES_TAXONOMY } from '@/data/catalog';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Bike: <Bike className="w-5 h-5" />,
  Smartphone: <Smartphone className="w-5 h-5" />,
  Tv: <Tv className="w-5 h-5" />,
  BedDouble: <BedDouble className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Wine: <Wine className="w-5 h-5" />,
  Gift: <Gift className="w-5 h-5" />,
};

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    CATEGORIES_TAXONOMY[0].id
  );
  const menuRef = useRef<HTMLDivElement>(null);

  const activeCategory =
    CATEGORIES_TAXONOMY.find((c) => c.id === activeCategoryId) ||
    CATEGORIES_TAXONOMY[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute left-0 right-0 top-full bg-white shadow-2xl border-t border-b border-gray-100 z-40 animate-fadeIn"
    >
      <div className="max-w-7xl mx-auto flex min-h-[420px]">
        {/* Category List Sidebar */}
        <div className="w-1/3 max-w-xs border-r border-gray-100 bg-gray-50/70 p-3">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 py-2">
            Todas las Categorías
          </p>
          <div className="space-y-1">
            {CATEGORIES_TAXONOMY.map((cat) => {
              const isActive = cat.id === activeCategoryId;
              return (
                <button
                  key={cat.id}
                  onMouseEnter={() => setActiveCategoryId(cat.id)}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-red text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-brand-red'}>
                      {ICON_MAP[cat.icon] || <Gift className="w-5 h-5" />}
                    </span>
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? 'text-white translate-x-1' : 'text-gray-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200/80 px-2">
            <Link
              href="/productos?flashDeals=true"
              onClick={onClose}
              className="flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-amber-600 hover:bg-amber-50 transition-colors"
            >
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>Ver Ofertas Relámpago</span>
            </Link>
          </div>
        </div>

        {/* Subcategories & Featured Card */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>{activeCategory.name}</span>
                  <span className="text-xs bg-red-100 text-brand-red px-2 py-0.5 rounded-full font-medium">
                    Catálogo 2026
                  </span>
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {activeCategory.description}
                </p>
              </div>

              <Link
                href={`/productos?categoria=${activeCategory.slug}`}
                onClick={onClose}
                className="text-xs font-bold text-brand-red hover:underline flex items-center gap-1"
              >
                <span>Ver todo en {activeCategory.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Subcategories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {activeCategory.subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/productos?categoria=${activeCategory.slug}&subcategoria=${sub.slug}`}
                  onClick={onClose}
                  className="group p-3.5 rounded-xl border border-gray-100 hover:border-brand-red/30 bg-white hover:bg-red-50/30 transition-all shadow-sm hover:shadow"
                >
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-brand-red transition-colors flex items-center justify-between">
                    <span>{sub.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-brand-red group-hover:translate-x-0.5 transition-all" />
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Productos seleccionados con garantía
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Promotional Banner inside MegaMenu */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-red-900 via-brand-red to-green-900 text-white flex items-center justify-between shadow-lg">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                Especial de Fin de Año
              </span>
              <p className="text-base font-bold">
                ¿Buscas anchetas corporativas o regalos en cantidad?
              </p>
              <p className="text-xs text-white/80">
                Atención preferencial para empresas y familias en todo el país.
              </p>
            </div>
            <a
              href="https://wa.me/573017777760?text=Hola%20OK%20Shop!%20Deseo%20cotizar%20compras%20al%20por%20mayor%20o%20anchetas"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-brand-red hover:bg-gray-100 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow"
            >
              Cotizar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
