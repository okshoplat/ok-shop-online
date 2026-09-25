'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Zap, ShieldCheck } from 'lucide-react';
import { ProductData } from '@/data/catalog';
import { formatCOP } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';

interface ProductCardProps {
  product: ProductData;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, paymentMethod } = useCartStore();
  const { toggleFavorite, isFavorite } = useWishlistStore();

  const favorite = isFavorite(product.id);
  const discountPercentage = Math.round(
    ((product.regularPrice - product.offerPrice) / product.regularPrice) * 100
  );

  const isSpecialPayment = ['BANK_TRANSFER', 'NEQUI', 'DAVIPLATA', 'PSE'].includes(paymentMethod);
  const currentActivePrice = isSpecialPayment && product.specialTransferPrice
    ? product.specialTransferPrice
    : product.offerPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      regularPrice: product.regularPrice,
      offerPrice: product.offerPrice,
      specialTransferPrice: product.specialTransferPrice,
      quantity: 1,
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <Link href={`/productos?q=${encodeURIComponent(product.name)}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges Container */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {discountPercentage > 0 && (
            <span className="bg-brand-red text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
              -{discountPercentage}%
            </span>
          )}
          {product.isFlashDeal && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
              <Zap className="w-3 h-3 fill-white" />
              <span>OFERTA FLASH</span>
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md z-10 ${
            favorite
              ? 'bg-red-50 text-brand-red'
              : 'bg-white/90 text-gray-400 hover:text-brand-red hover:bg-white'
          }`}
          aria-label={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <Heart className={`w-4 h-4 ${favorite ? 'fill-brand-red' : ''}`} />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-gray-800">{product.rating}</span>
            <span className="text-[11px] text-gray-400">({product.reviewsCount})</span>
          </div>

          {/* Title */}
          <Link href={`/productos?q=${encodeURIComponent(product.name)}`}>
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-brand-red transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-[11px] text-gray-500 line-clamp-1 mt-1">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing Matrix */}
        <div className="mt-3 pt-3 border-t border-gray-50 space-y-1">
          {/* Regular Price (Strikethrough) */}
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-gray-400 line-through">
              {formatCOP(product.regularPrice)}
            </span>
            <span className="text-[10px] text-gray-500 font-medium">Precio Regular</span>
          </div>

          {/* Catalog Offer Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black text-gray-950">
              {formatCOP(product.offerPrice)}
            </span>
            <span className="text-[11px] font-semibold text-brand-red">
              Oferta Catálogo
            </span>
          </div>

          {/* Special Payment Method Price */}
          <div className="p-1.5 rounded-lg bg-emerald-50/80 border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800">
              <span className="text-xs">💰</span>
              <span>{formatCOP(product.specialTransferPrice)}</span>
            </div>
            <span className="text-[9px] font-extrabold uppercase tracking-tight text-emerald-700 bg-emerald-100/70 px-1 py-0.2 rounded">
              Con Nequi / PSE (-5%)
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-3 pt-2">
          <button
            onClick={handleAddToCart}
            className="w-full py-2.5 px-3 bg-gray-900 group-hover:bg-brand-red text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Agregar al Carrito</span>
          </button>
        </div>
      </div>
    </div>
  );
};
