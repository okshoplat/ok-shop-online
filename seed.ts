import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Cargando datos iniciales...')

  // Limpiar datos existentes si es necesario
  await prisma.product.deleteMany({})

  // Insertar productos de prueba
  await prisma.product.createMany({
    data: [
      {
        nombre: 'Producto de prueba 1',
        slug: 'producto-de-prueba-1',
        descripcion: 'Descripción del producto 1',
        precio: 50000,
        imagen: '/images/producto1.jpg',
        categoria: 'tecnologia-electronica',
        stock: 10,
      },
      {
        nombre: 'Producto de prueba 2',
        slug: 'producto-de-prueba-2',
        descripcion: 'Descripción del producto 2',
        precio: 75000,
        imagen: '/images/producto2.jpg',
        categoria: 'hogar',
        stock: 15,
      },
    ],
  })

  console.log('¡Carga de datos exitosa!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })