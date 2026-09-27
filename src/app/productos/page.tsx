'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Filter,
  SlidersHorizontal,
  Search,
  Sparkles,
  Zap,
  ArrowUpDown,
  ChevronRight,
  X,
} from 'lucide-react';
import { CATEGORIES_TAXONOMY, INITIAL_PRODUCTS, ProductData } from '@/data/catalog';
import { ProductCard } from '@/components/products/ProductCard';
import { formatCOP } from '@/lib/utils';

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('categoria') || '';
  const subcategoryParam = searchParams.get('subcategoria') || '';
  const queryParam = searchParams.get('q') || '';
  const flashDealsParam = searchParams.get('flashDeals') === 'true';
  const featuredParam = searchParams.get('featured') === 'true';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(subcategoryParam);
  const [searchTerm, setSearchTerm] = useState<string>(queryParam);
  const [onlyFlashDeals, setOnlyFlashDeals] = useState<boolean>(flashDealsParam);
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(featuredParam);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(7000000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Sync state with search params changes
  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSelectedSubcategory(subcategoryParam);
    setSearchTerm(queryParam);
    setOnlyFlashDeals(flashDealsParam);
    setOnlyFeatured(featuredParam);
  }, [categoryParam, subcategoryParam, queryParam, flashDealsParam, featuredParam]);

  // Client-side filtering with full resilience
  const filteredProducts = INITIAL_PRODUCTS.filter((product) => {
    // Category check
    if (selectedCategory && product.categorySlug !== selectedCategory) {
      return false;
    }
    // Subcategory check
    if (selectedSubcategory && product.subcategorySlug !== selectedSubcategory) {
      return false;
    }
    // Text search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q) ||
        product.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    // Flash deals filter
    if (onlyFlashDeals && !product.isFlashDeal) {
      return false;
    }
    // Featured filter
    if (onlyFeatured && !product.featured) {
      return false;
    }
    // Max price
    if (product.offerPrice > maxPriceFilter) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.offerPrice - b.offerPrice;
    if (sortBy === 'price_desc') return b.offerPrice - a.offerPrice;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.featured ? 1 : -1;
  });

  const activeCategoryObj = CATEGORIES_TAXONOMY.find(
    (c) => c.slug === selectedCategory
  );

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
              <Link href="/" className="hover:text-brand-red">Inicio</Link>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-gray-900 font-semibold">
                {activeCategoryObj ? activeCategoryObj.name : 'Catálogo Completo'}
              </span>
              {selectedSubcategory && (
                <>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <span className="text-brand-red font-semibold">
                    {activeCategoryObj?.subcategories.find((s) => s.slug === selectedSubcategory)?.name}
                  </span>
                </>
              )}
            </nav>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              {activeCategoryObj ? activeCategoryObj.name : 'Todos los Productos OK Shop'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Mostrando {filteredProducts.length} producto(s) disponibles con despacho a nivel nacional
            </p>
          </div>

          {/* Sort selector and Mobile filter toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 shadow-sm"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filtros</span>
            </button>

            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-gray-500 font-medium hidden sm:inline">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-semibold text-gray-800 focus:outline-none cursor-pointer"
              >
                <option value="featured">Destacados Catálogo</option>
                <option value="price_asc">Menor Precio</option>
                <option value="price_desc">Mayor Precio</option>
                <option value="rating">Mejor Calificación</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* Sidebar Filters */}
          <aside className={`lg:block ${isMobileFilterOpen ? 'block' : 'hidden'} space-y-6`}>
            {/* Search filter */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-brand-red" />
                <span>Búsqueda Rápida</span>
              </h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nombre, marca o SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Categories & Subcategories Filter */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Categorías
                </h4>
                {selectedCategory && (
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setSelectedSubcategory('');
                    }}
                    className="text-[10px] font-bold text-brand-red hover:underline"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              <div className="space-y-1 text-xs">
                {CATEGORIES_TAXONOMY.map((cat) => {
                  const isCatSelected = selectedCategory === cat.slug;
                  return (
                    <div key={cat.id} className="space-y-1">
                      <button
                        onClick={() => {
                          setSelectedCategory(isCatSelected ? '' : cat.slug);
                          setSelectedSubcategory('');
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors font-semibold ${
                          isCatSelected
                            ? 'bg-red-50 text-brand-red font-bold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform ${
                            isCatSelected ? 'rotate-90 text-brand-red' : 'text-gray-400'
                          }`}
                        />
                      </button>

                      {/* Subcategories list if category selected */}
                      {isCatSelected && (
                        <div className="pl-4 pr-1 py-1 space-y-1">
                          {cat.subcategories.map((sub) => {
                            const isSubSelected = selectedSubcategory === sub.slug;
                            return (
                              <button
                                key={sub.id}
                                onClick={() =>
                                  setSelectedSubcategory(isSubSelected ? '' : sub.slug)
                                }
                                className={`w-full text-left py-1.5 px-2.5 rounded-lg text-[11px] transition-colors ${
                                  isSubSelected
                                    ? 'bg-brand-red text-white font-bold'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {sub.name}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Special toggles */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Filtros Especiales
              </h4>

              <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={onlyFlashDeals}
                  onChange={(e) => setOnlyFlashDeals(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-red focus:ring-brand-red cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Ofertas Relámpago</span>
                </span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={onlyFeatured}
                  onChange={(e) => setOnlyFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-red focus:ring-brand-red cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Destacados Navideños</span>
                </span>
              </label>
            </div>

            {/* Price slider */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-900 uppercase tracking-wider">Precio Máximo</span>
                <span className="font-extrabold text-brand-red">{formatCOP(maxPriceFilter)}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="7000000"
                step="50000"
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="w-full accent-brand-red cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>$ 50.000</span>
                <span>$ 7.000.000</span>
              </div>
            </div>
          </aside>

          {/* Main Products Grid */}
          <main className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-50 text-brand-red mx-auto flex items-center justify-center">
                  <Search className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    No encontramos productos con los filtros seleccionados
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    Intenta ampliar los filtros de precio, borrar el término de búsqueda o explorar todas las categorías.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedSubcategory('');
                    setSearchTerm('');
                    setOnlyFlashDeals(false);
                    setOnlyFeatured(false);
                    setMaxPriceFilter(7000000);
                  }}
                  className="px-5 py-2.5 bg-brand-red text-white text-xs font-bold rounded-xl hover:bg-brand-red-dark transition-colors shadow-md"
                >
                  Restablecer todos los filtros
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Cargando catálogo...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
