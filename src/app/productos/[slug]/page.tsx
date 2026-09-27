import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Star, Zap } from 'lucide-react';

import {
  INITIAL_PRODUCTS,
  ProductData,
} from '@/data/catalog';

import { formatCOP } from '@/lib/utils';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  // Busca el producto utilizando el slug de la URL.
  // NO modifica ni elimina ningún producto del catálogo.
  const product: ProductData | undefined = INITIAL_PRODUCTS.find(
    (item) => item.slug === slug
  );

  // Si el slug no corresponde a ningún producto,
  // Next.js mostrará su página 404.
  if (!product) {
    notFound();
  }

  const discountPercentage =
    product.regularPrice > product.offerPrice
      ? Math.round(
          ((product.regularPrice - product.offerPrice) /
            product.regularPrice) *
            100
        )
      : 0;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Volver al catálogo */}
        <div className="mb-6">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-brand-red transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al catálogo
          </Link>
        </div>

        {/* Producto */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">

          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Imagen */}
            <div className="relative aspect-square lg:aspect-auto lg:min-h-[600px] bg-gray-50">

              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-contain p-8 lg:p-12"
              />

              {/* Descuento */}
              {discountPercentage > 0 && (
                <div className="absolute top-5 left-5 bg-brand-red text-white text-sm font-extrabold px-4 py-2 rounded-full shadow">
                  -{discountPercentage}%
                </div>
              )}

              {/* Oferta flash */}
              {product.isFlashDeal && (
                <div className="absolute top-5 right-5 bg-amber-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow flex items-center gap-1">
                  <Zap className="w-4 h-4 fill-white" />
                  OFERTA FLASH
                </div>
              )}
            </div>

            {/* Información */}
            <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">

              {/* Calificación */}
              <div className="flex items-center gap-2 mb-4">

                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-sm font-bold text-gray-900">
                    {product.rating}
                  </span>
                </div>

                <span className="text-sm text-gray-400">
                  ({product.reviewsCount} reseñas)
                </span>

              </div>

              {/* Nombre */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Descripción corta */}
              <p className="mt-4 text-gray-600 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Separador */}
              <div className="border-t border-gray-200 my-6" />

              {/* Precio regular */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 line-through">
                  {formatCOP(product.regularPrice)}
                </span>

                <span className="text-xs text-gray-500">
                  Precio regular
                </span>
              </div>

              {/* Precio oferta */}
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-3xl sm:text-4xl font-black text-gray-950">
                  {formatCOP(product.offerPrice)}
                </span>

                <span className="text-sm font-bold text-brand-red">
                  Oferta catálogo
                </span>
              </div>

              {/* Precio transferencia */}
              {product.specialTransferPrice && (
                <div className="mt-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">

                  <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                    Precio especial
                  </div>

                  <div className="mt-1 text-2xl font-black text-emerald-800">
                    {formatCOP(product.specialTransferPrice)}
                  </div>

                  <div className="mt-1 text-xs font-medium text-emerald-700">
                    Con Nequi / PSE
                  </div>

                </div>
              )}

              {/* SKU / identificación */}
              <div className="mt-6 text-xs text-gray-400">
                <span className="font-semibold">
                  Referencia:
                </span>{' '}
                {product.id}
              </div>

              {/* Botón volver */}
              <div className="mt-8">

                <Link
                  href="/productos"
                  className="w-full inline-flex items-center justify-center py-3.5 px-5 bg-gray-900 hover:bg-brand-red text-white rounded-xl text-sm font-bold transition-colors"
                >
                  Ver más productos
                </Link>

              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}