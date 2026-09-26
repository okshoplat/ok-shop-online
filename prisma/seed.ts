import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cargando datos iniciales en la base de datos...');

  // 1. Limpiar registros relacionados en orden para evitar violaciones de clave foránea
  await prisma.orderItem.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.subcategory.deleteMany({});
  await prisma.category.deleteMany({});

  // 2. Crear Categoría base
  const categoria = await prisma.category.create({
    data: {
      name: 'Tecnología',
      slug: 'tecnologia',
      description: 'Productos de tecnología y electrónica',
      active: true,
    },
  });

  // 3. Crear Productos de prueba
  await prisma.product.create({
    data: {
      name: 'Producto de prueba 1',
      slug: 'producto-de-prueba-1',
      sku: 'PROD-001',
      shortDescription: 'Descripción corta del producto 1',
      description: 'Descripción detallada del producto 1',
      regularPrice: 60000,
      offerPrice: 50000,
      specialTransferPrice: 48000,
      inStock: true,
      stockQuantity: 10,
      categoryId: categoria.id,
      images: {
        create: [
          {
            url: '/images/producto1.jpg',
            altText: 'Imagen producto 1',
            isPrimary: true,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Producto de prueba 2',
      slug: 'producto-de-prueba-2',
      sku: 'PROD-002',
      shortDescription: 'Descripción corta del producto 2',
      description: 'Descripción detallada del producto 2',
      regularPrice: 90000,
      offerPrice: 75000,
      specialTransferPrice: 70000,
      inStock: true,
      stockQuantity: 15,
      categoryId: categoria.id,
      images: {
        create: [
          {
            url: '/images/producto2.jpg',
            altText: 'Imagen producto 2',
            isPrimary: true,
          },
        ],
      },
    },
  });

  console.log('¡Base de datos poblada con éxito!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });