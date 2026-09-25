import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_PRODUCTS, CATEGORIES_TAXONOMY } from '@/data/catalog';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const q = searchParams.get('q') || searchParams.get('search');
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const flashDeals = searchParams.get('flashDeals') === 'true';
    const featured = searchParams.get('featured') === 'true';
    const sort = searchParams.get('sort') || 'featured';
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || 20)));

    try {
      // Query from database
      const where: any = {};

      if (category) {
        where.OR = [
          { categoryId: category },
          { category: { slug: category } },
        ];
      }

      if (subcategory) {
        where.subcategoryId = subcategory;
      }

      if (q) {
        const queryTerm = q.toLowerCase();
        where.OR = [
          { name: { contains: queryTerm } },
          { description: { contains: queryTerm } },
          { sku: { contains: queryTerm } },
          { tags: { contains: queryTerm } },
        ];
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        where.offerPrice = {};
        if (minPrice !== undefined) where.offerPrice.gte = minPrice;
        if (maxPrice !== undefined) where.offerPrice.lte = maxPrice;
      }

      if (flashDeals) {
        where.isFlashDeal = true;
      }

      if (featured) {
        where.featured = true;
      }

      let orderBy: any = { createdAt: 'desc' };
      if (sort === 'price_asc') orderBy = { offerPrice: 'asc' };
      if (sort === 'price_desc') orderBy = { offerPrice: 'desc' };
      if (sort === 'rating') orderBy = { rating: 'desc' };
      if (sort === 'featured') orderBy = { featured: 'desc' };

      const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            category: true,
            subcategory: true,
            images: { orderBy: { order: 'asc' } },
            variants: true,
          },
          orderBy,
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.product.count({ where }),
      ]);

      return NextResponse.json({
        success: true,
        data: products,
        meta: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
          filters: { category, subcategory, q, minPrice, maxPrice, flashDeals, featured, sort },
        },
      });
    } catch (dbError) {
      console.warn('Prisma query failed, falling back to in-memory catalog data:', dbError);
      // Resilient fallback to memory catalog
      let list = [...INITIAL_PRODUCTS];

      if (category) {
        list = list.filter(
          (p) => p.categorySlug === category || p.categoryId === category
        );
      }
      if (subcategory) {
        list = list.filter(
          (p) => p.subcategorySlug === subcategory || p.subcategoryId === subcategory
        );
      }
      if (q) {
        const t = q.toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(t) ||
            p.description.toLowerCase().includes(t) ||
            p.sku.toLowerCase().includes(t) ||
            p.tags.some((tag) => tag.toLowerCase().includes(t))
        );
      }
      if (minPrice !== undefined) list = list.filter((p) => p.offerPrice >= minPrice);
      if (maxPrice !== undefined) list = list.filter((p) => p.offerPrice <= maxPrice);
      if (flashDeals) list = list.filter((p) => p.isFlashDeal);
      if (featured) list = list.filter((p) => p.featured);

      if (sort === 'price_asc') list.sort((a, b) => a.offerPrice - b.offerPrice);
      if (sort === 'price_desc') list.sort((a, b) => b.offerPrice - a.offerPrice);
      if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);

      const total = list.length;
      const paginated = list.slice((page - 1) * limit, page * limit);

      return NextResponse.json({
        success: true,
        data: paginated,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          source: 'memory-fallback',
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al consultar productos' },
      { status: 500 }
    );
  }
}
