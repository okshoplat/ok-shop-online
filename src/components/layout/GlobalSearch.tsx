'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, TrendingUp, Sparkles } from 'lucide-react';
import { INITIAL_PRODUCTS, ProductData } from '@/data/catalog';
import { formatCOP } from '@/lib/utils';

export const GlobalSearch: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<ProductData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const POPULAR_SEARCHES = [
    'Bicicleta Eléctrica',
    'Smartwatch Ultra',
    'Ancheta Navideña',
    'Freidora de Aire',
    'Lencería para el hogar',
    'Whisky Black Label',
    'Carro control remoto',
  ];

  // Live filter products
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      const q = query.toLowerCase().trim();
      const filtered = INITIAL_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.categorySlug.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      ).slice(0, 5);

      setResults(filtered);
      setLoading(false);
      setSelectedIndex(-1);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        router.push(`/productos?q=${encodeURIComponent(results[selectedIndex].name)}`);
        setIsOpen(false);
      } else if (query.trim()) {
        router.push(`/productos?q=${encodeURIComponent(query.trim())}`);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelectPopular = (term: string) => {
    setQuery(term);
    router.push(`/productos?q=${encodeURIComponent(term)}`);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative flex-1 max-w-2xl mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-label="Buscar en OK Shop"
          placeholder="Buscar bicicletas, tecnología, electrodomésticos, anchetas..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-11 pr-24 py-2.5 bg-gray-100/90 hover:bg-gray-100 focus:bg-white text-gray-800 placeholder-gray-400 text-sm rounded-full border border-transparent focus:border-brand-red focus:ring-4 focus:ring-red-100 outline-none transition-all shadow-inner"
        />

        <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />

        <div className="absolute right-2 top-1.5 flex items-center gap-1">
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200/70"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              if (query.trim()) {
                router.push(`/productos?q=${encodeURIComponent(query.trim())}`);
                setIsOpen(false);
              }
            }}
            className="bg-brand-red hover:bg-brand-red-dark text-white px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <span>Buscar</span>
            )}
          </button>
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn"
        >
          {query.trim().length > 0 ? (
            <div>
              <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Resultados sugeridos para &quot;{query}&quot;</span>
                <span>{results.length} coincidencias</span>
              </div>

              {results.length > 0 ? (
                <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                  {results.map((product, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <Link
                        key={product.id}
                        href={`/productos?q=${encodeURIComponent(product.name)}`}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 p-3 transition-colors ${
                          isSelected ? 'bg-red-50 text-brand-red' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate">
                            {product.shortDescription}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-brand-red">
                              {formatCOP(product.offerPrice)}
                            </span>
                            <span className="text-[10px] text-gray-400 line-through">
                              {formatCOP(product.regularPrice)}
                            </span>
                            {product.isFlashDeal && (
                              <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                                OFERTA FLASH
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                  <div className="p-2.5 bg-gray-50 text-center">
                    <button
                      onClick={() => {
                        router.push(`/productos?q=${encodeURIComponent(query.trim())}`);
                        setIsOpen(false);
                      }}
                      className="text-xs font-bold text-brand-red hover:underline"
                    >
                      Ver todos los resultados para &quot;{query}&quot; &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-sm text-gray-500">
                  <p className="font-medium text-gray-700">No encontramos coincidencias directas.</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Prueba buscando por categoría como &quot;Bicicletas&quot;, &quot;Audífonos&quot; o &quot;Anchetas&quot;.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Popular Trends */
            <div className="p-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                <TrendingUp className="w-3.5 h-3.5 text-brand-red" />
                <span>Búsquedas Populares Navideñas</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleSelectPopular(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-gray-100 hover:bg-red-50 hover:text-brand-red text-gray-700 transition-colors border border-gray-200/60"
                  >
                    <Sparkles className="w-3 h-3 text-brand-gold" />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
