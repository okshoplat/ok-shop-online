'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  MapPin,
  Heart,
  ShoppingCart,
  User,
  PackageSearch,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { AnnouncementBar } from './AnnouncementBar';
import { GlobalSearch } from './GlobalSearch';
import { MegaMenu } from './MegaMenu';
import { LocationModal } from './LocationModal';
import { useCartStore } from '@/store/useCartStore';
import { useLocationStore } from '@/store/useLocationStore';
import { useWishlistStore } from '@/store/useWishlistStore';

export const Header: React.FC = () => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const { items, setDrawerOpen } = useCartStore();
  const { city, openModal } = useLocationStore();
  const { favorites } = useWishlistStore();

  const totalCartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="relative flex items-center">
              {/* Christmas Santa Hat decoration over OK logo */}
              <div className="absolute -top-3.5 -left-1 text-base select-none animate-bounce">
                🎅
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-red to-brand-red-dark flex items-center justify-center text-white shadow-md shadow-red-200 group-hover:scale-105 transition-transform">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black tracking-tight text-gray-950 font-sans">
                  OK <span className="text-brand-red">SHOP</span>
                </span>
                <span className="text-[10px] bg-red-600 text-white font-extrabold px-1.5 py-0.2 rounded tracking-wider">
                  2026
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase -mt-1 hidden sm:block">
                Variedad • Calidad • Tu Mejor Opción
              </p>
            </div>
          </Link>

          {/* Location Selector Button */}
          <button
            onClick={openModal}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200/70 transition-all text-xs text-left"
            title="Cambiar ciudad de entrega"
          >
            <div className="w-7 h-7 rounded-full bg-red-100 text-brand-red flex items-center justify-center flex-shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium leading-none">
                Enviar a:
              </p>
              <p className="font-bold text-gray-900 leading-tight truncate max-w-[110px]">
                {city}
              </p>
            </div>
          </button>

          {/* Global Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-4">
            <GlobalSearch />
          </div>

          {/* Quick Action Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Sigue tu Pedido */}
            <Link
              href="/sigue-tu-pedido"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-brand-red p-2 rounded-xl hover:bg-red-50/50 transition-colors"
            >
              <PackageSearch className="w-4 h-4 text-gray-500" />
              <span>Sigue tu pedido</span>
            </Link>

            {/* Facturación Electrónica */}
            <Link
              href="/factura-electronica"
              className="hidden xl:flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-brand-red p-2 rounded-xl hover:bg-red-50/50 transition-colors"
            >
              <span>Factura DIAN</span>
            </Link>

            {/* Mi Cuenta */}
            <Link
              href="/mi-cuenta"
              className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-brand-red p-2 rounded-xl hover:bg-gray-50 transition-colors"
              title="Mi Cuenta de Cliente"
            >
              <User className="w-4 h-4 text-gray-600" />
              <span className="hidden sm:inline">Mi Cuenta</span>
            </Link>

            {/* Favoritos */}
            <Link
              href="/mi-cuenta#favoritos"
              className="relative p-2 rounded-xl text-gray-700 hover:text-brand-red hover:bg-red-50/50 transition-colors"
              title="Mis Favoritos"
            >
              <Heart className="w-5 h-5 text-gray-600 hover:text-brand-red" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-red text-white text-[10px] font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Carrito */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white px-3.5 py-2 rounded-full font-bold text-xs shadow-md shadow-red-200 transition-all hover:scale-105"
              aria-label="Abrir carrito de compras"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Carrito</span>
              <span className="w-5 h-5 rounded-full bg-white text-brand-red text-xs font-extrabold flex items-center justify-center">
                {totalCartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="mt-3 lg:hidden">
          <GlobalSearch />
        </div>
      </div>

      {/* 3. Categories MegaMenu Bar */}
      <div className="bg-gray-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-medium">
          {/* MegaMenu Trigger Button */}
          <button
            onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
            className="flex items-center gap-2 py-2.5 px-4 bg-brand-red hover:bg-brand-red-dark text-white font-bold transition-colors"
            aria-expanded={isMegaMenuOpen}
          >
            <Menu className="w-4 h-4" />
            <span className="uppercase tracking-wider">Categorías</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                isMegaMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Quick Category Tabs */}
          <nav className="hidden md:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            <Link
              href="/productos?categoria=movilidad-vehiculos"
              className="px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              Movilidad & Vehículos
            </Link>
            <Link
              href="/productos?categoria=tecnologia-electronica"
              className="px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              Tecnología
            </Link>
            <Link
              href="/productos?categoria=electrodomesticos"
              className="px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              Electrodomésticos
            </Link>
            <Link
              href="/productos?categoria=hogar-lenceria"
              className="px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              Hogar & Lencería
            </Link>
            <Link
              href="/productos?categoria=licores-termos"
              className="px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              Licores & Termos
            </Link>
            <Link
              href="/productos?categoria=temporada-deportes"
              className="px-3 py-1.5 rounded-lg text-amber-400 font-bold hover:text-amber-300 hover:bg-white/10 transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Anchetas & Juguetes</span>
            </Link>
          </nav>

          {/* Flash Deals Tab Link */}
          <Link
            href="/productos?flashDeals=true"
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-bold py-2 px-3 rounded hover:bg-white/5 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Ofertas Relámpago</span>
          </Link>
        </div>

        {/* MegaMenu Dropdown Content */}
        <MegaMenu
          isOpen={isMegaMenuOpen}
          onClose={() => setIsMegaMenuOpen(false)}
        />
      </div>

      {/* Location Modal */}
      <LocationModal />
    </header>
  );
};
