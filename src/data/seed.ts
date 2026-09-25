import { prisma } from '../lib/prisma';
import { CATEGORIES_TAXONOMY, INITIAL_PRODUCTS } from './catalog';
import { generateCUFE } from '../lib/utils';

async function main() {
  console.log('🌱 Seeding OK Shop database...');

  // 1. Seed Categories & Subcategories
  for (const cat of CATEGORIES_TAXONOMY) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        displayOrder: 1,
      },
    });

    for (const sub of cat.subcategories) {
      await prisma.subcategory.upsert({
        where: {
          categoryId_slug: {
            categoryId: category.id,
            slug: sub.slug,
          },
        },
        update: {
          name: sub.name,
          description: sub.description,
        },
        create: {
          id: sub.id,
          categoryId: category.id,
          name: sub.name,
          slug: sub.slug,
          description: sub.description,
        },
      });
    }
  }
  console.log('✅ Categories and subcategories seeded.');

  // 2. Seed Products
  for (const p of INITIAL_PRODUCTS) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        regularPrice: p.regularPrice,
        offerPrice: p.offerPrice,
        specialTransferPrice: p.specialTransferPrice,
        stockQuantity: p.stockQuantity,
        isFlashDeal: p.isFlashDeal,
        featured: p.featured,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
      },
      create: {
        id: p.id,
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        shortDescription: p.shortDescription,
        description: p.description,
        categoryId: p.categoryId,
        subcategoryId: p.subcategoryId,
        regularPrice: p.regularPrice,
        offerPrice: p.offerPrice,
        specialTransferPrice: p.specialTransferPrice,
        inStock: p.inStock,
        stockQuantity: p.stockQuantity,
        isFlashDeal: p.isFlashDeal,
        featured: p.featured,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        tags: p.tags.join(','),
      },
    });

    // Create primary image
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: p.image,
        altText: p.name,
        isPrimary: true,
        order: 0,
      },
    });

    // Create variants if any
    if (p.variants && p.variants.length > 0) {
      await prisma.productVariant.deleteMany({ where: { productId: product.id } });
      for (const v of p.variants) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            sku: v.sku,
            name: v.name,
            additionalPrice: v.additionalPrice,
            stockQuantity: v.stock,
          },
        });
      }
    }
  }
  console.log('✅ Products and variants seeded.');

  // 3. Seed Coupons
  await prisma.coupon.upsert({
    where: { code: 'NAVIDAD2026' },
    update: {},
    create: {
      code: 'NAVIDAD2026',
      discountPercent: 15,
      minPurchase: 100000,
      expiresAt: new Date('2026-12-31T23:59:59'),
      active: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'OKSHOP10' },
    update: {},
    create: {
      code: 'OKSHOP10',
      discountFixed: 20000,
      minPurchase: 150000,
      expiresAt: new Date('2026-12-31T23:59:59'),
      active: true,
    },
  });
  console.log('✅ Promotional coupons seeded.');

  // 4. Seed Demo Order with Tracking and Electronic Invoice
  const demoOrder = await prisma.order.upsert({
    where: { orderNumber: 'OK-2026-10492' },
    update: {},
    create: {
      orderNumber: 'OK-2026-10492',
      customerName: 'Carlos Alberto Rodríguez',
      customerEmail: 'carlos.rodriguez@example.com',
      customerPhone: '3158941203',
      shippingDepartment: 'Antioquia',
      shippingCity: 'Medellín',
      shippingAddressLine: 'Calle 10 # 43E-12, Poblado',
      subtotal: 3190000,
      shippingCost: 0,
      discountAmount: 0,
      totalAmount: 3190000,
      paymentType: 'NEQUI',
      paymentStatus: 'PAID',
      orderStatus: 'IN_TRANSIT',
      trackingCarrier: 'Coordinadora',
      trackingNumber: 'CRD-948102941CO',
      estimatedDelivery: new Date(Date.now() + 24 * 3600 * 1000),
      timelineJson: JSON.stringify([
        { title: 'Pedido Confirmado', date: '2026-09-24 14:30', status: 'completed', description: 'Pago recibido por Nequi' },
        { title: 'En Preparación', date: '2026-09-24 17:00', status: 'completed', description: 'Empacado y revisado en Bodega Central Bogotá' },
        { title: 'Despachado', date: '2026-09-25 08:15', status: 'completed', description: 'Entregado a Coordinadora Guía CRD-948102941CO' },
        { title: 'En Camino a Medellín', date: '2026-09-25 11:45', status: 'current', description: 'En vehículo de reparto hacia la dirección de entrega' },
        { title: 'Entregado', date: 'Estimado: Mañana antes de las 2:00 PM', status: 'pending', description: 'Firma y entrega a destinatario' },
      ]),
    },
  });

  // Attach Order Item
  await prisma.orderItem.deleteMany({ where: { orderId: demoOrder.id } });
  await prisma.orderItem.create({
    data: {
      orderId: demoOrder.id,
      productId: 'prod-ebike-ok-pro',
      name: 'Bicicleta Eléctrica Todo Terreno Rin 29 OK E-Bike 500W',
      price: 3190000,
      quantity: 1,
      total: 3190000,
    },
  });

  // Attach DIAN Invoice
  await prisma.invoice.upsert({
    where: { orderId: demoOrder.id },
    update: {},
    create: {
      invoiceNumber: 'FE-OK-2026-000841',
      orderId: demoOrder.id,
      cufe: generateCUFE('OK-2026-10492', '2026-09-24', '901458789-3'),
      qrCodeData: 'NumFac:FE-OK-2026-000841,FecFac:2026-09-24,NitFac:901458789,DocAdq:1017203491,ValFac:3190000,ValIva:509327',
      dianResolution: 'Resolución DIAN No. 187640029104 de 2026/01/15 Rango FE-OK-2026-000001 a 100000',
      customerName: 'Carlos Alberto Rodríguez',
      customerDocType: 'CC',
      customerDocNumber: '1017203491',
      customerEmail: 'carlos.rodriguez@example.com',
      customerAddress: 'Calle 10 # 43E-12, Poblado, Medellín',
      subtotal: 2680673,
      ivaAmount: 509327, // 19% IVA included
      totalAmount: 3190000,
      status: 'DIAN_VALIDATED',
    },
  });

  // 5. Seed Demo PQRS
  await prisma.pQRS.upsert({
    where: { radicado: 'PQRS-2026-4819' },
    update: {},
    create: {
      radicado: 'PQRS-2026-4819',
      type: 'PETICION',
      customerName: 'Mariana Gómez',
      email: 'mariana.gomez@gmail.com',
      phone: '3004567890',
      orderNumber: 'OK-2026-10492',
      subject: 'Solicitud de certificación de garantía para E-Bike',
      description: 'Deseo solicitar la tarjeta de propiedad y certificación de garantía extendida para la bicicleta eléctrica adquirida.',
      status: 'RESOLVED',
      response: 'Estimada Mariana, hemos enviado la carta de garantía y número de serie a tu correo registrado. Tu bicicleta cuenta con 2 años de respaldo directo.',
      responseDate: new Date('2026-09-25T10:00:00'),
    },
  });

  console.log('✅ Demo Order, DIAN Electronic Invoice and PQRS seeded.');
  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
