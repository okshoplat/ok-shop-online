# OK Shop - Plataforma de Comercio Electrónico & Catálogo Navideño 2026

Plataforma Full-Stack de comercio electrónico para **OK Shop** (*"Variedad • Calidad • Tu Mejor Opción"*), diseñada bajo estándares modernos de arquitectura de software para el mercado colombiano, con soporte de facturación electrónica DIAN, cálculo dinámico de fletes por ciudad, tracking en tiempo real, descuentos por métodos de pago y canal directo de WhatsApp.

---

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 14 (App Router) + React 18 + Tailwind CSS + Lucide Icons.
- **Backend:** Next.js Serverless API Route Handlers + Node.js.
- **ORM & Base de Datos:** Prisma ORM v5 + SQLite (local) / PostgreSQL (producción).
- **Estado Global & Persistencia:** Zustand con persistencia en `localStorage`.
- **Integraciones:** WhatsApp Business API (`301 777 77 60`), Facturación Electrónica DIAN (formato gráfico, CUFE y resolución), cálculo logístico para transportadoras colombianas (Coordinadora, Servientrega, Envía, Inter Rapidísimo).

---

## 📁 Estructura del Proyecto

```
j:/Comercializadora/OK Shop Tienda Online/
├── prisma/
│   └── schema.prisma              # Esquema de datos Prisma (PostgreSQL / SQLite)
├── public/
│   └── images/
│       └── catalog/               # Folletos oficiales del Catálogo Navideño 2026
├── src/
│   ├── app/
│   │   ├── api/v1/                # Controladores y Endpoints API REST
│   │   │   ├── products/          # GET /api/v1/products (Filtros, categorías, precios)
│   │   │   ├── orders/            # POST /api/v1/orders (Creación, cupones, fletes)
│   │   │   │   └── track/[id]/    # GET /api/v1/orders/track/:id (Rastreo en vivo)
│   │   │   ├── invoices/[orderId]/# GET /api/v1/invoices/:orderId (Factura DIAN & CUFE)
│   │   │   └── pqrs/              # POST /api/v1/pqrs y GET /api/v1/pqrs/:radicado
│   │   ├── factura-electronica/   # Portal de consulta y descarga de Factura DIAN
│   │   ├── mi-cuenta/             # Portal del cliente (Datos, direcciones, tarjetas)
│   │   ├── pqrs/                  # Sistema de radicación y seguimiento PQRS
│   │   ├── productos/             # Explorador y catálogo con filtros de taxonomía
│   │   ├── sigue-tu-pedido/       # Módulo de rastreo interactivo con timeline
│   │   ├── globals.css            # Estilos globales y animaciones de Tailwind
│   │   ├── layout.tsx             # Layout raíz con Header, Footer, Carrito y WhatsApp
│   │   └── page.tsx               # Home Page (Stories, Hero, Flash Deals, Categorías)
│   ├── components/
│   │   ├── cart/                  # CartDrawer interactivo con cálculo de envíos
│   │   ├── common/                # WhatsAppWidget flotante con número 301 777 77 60
│   │   ├── home/                  # StoriesBar, HeroBanner, FlashDeals, CategoryGrid
│   │   ├── layout/                # AnnouncementBar, Header, MegaMenu, LocationModal, Footer
│   │   └── products/              # ProductCard con regular, oferta y precio transferencia
│   ├── data/
│   │   ├── catalog.ts             # Taxonomía oficial de 7 categorías y productos
│   │   └── seed.ts                # Sembrador de base de datos Prisma
│   ├── lib/
│   │   ├── prisma.ts              # Cliente Prisma singleton
│   │   └── utils.ts               # Formato COP, fletes Colombia, hash CUFE y radicados
│   └── store/
│       ├── useCartStore.ts        # Zustand: carrito, cupones y descuentos de pago
│       ├── useLocationStore.ts    # Zustand: selector de ciudad y fletes Colombia
│       └── useWishlistStore.ts    # Zustand: lista de favoritos
├── .env                           # Variables de entorno y configuración
├── package.json                   # Dependencias y scripts de compilación
├── tailwind.config.js             # Configuración de diseño y colores OK Shop
└── tsconfig.json                  # Configuración estricta de TypeScript
```

---

## 🗂️ Taxonomía de Categorías Oficial

1. **Movilidad & Vehículos:**
   - Bicicletas (Normales / Eléctricas)
   - Motos (Normales / Eléctricas)
   - Carros (Normales / Eléctricos)
   - Patinetas Eléctricas
2. **Tecnología & Electrónica:**
   - Computadores, Celulares, Tablets, Smartwatches, Audífonos, Accesorios de Celulares
3. **Electrodomésticos:**
   - Televisores, Lavadoras, Estufas, Otros Electrodomésticos
4. **Hogar & Lencería:**
   - Productos para el Hogar, Lencería para el Hogar
5. **Aseo & Mascotas:**
   - Productos de Aseo, Mascotas
6. **Licores & Termos:**
   - Licores (Vinos, Whiskies, Rones con estampilla fiscal), Termos (Tumblers térmicos en acero inoxidable)
7. **Temporada & Deportes:**
   - Anchetas Navideñas (Edición 2026), Juguetes (RC Cars, Peluches, Juegos)

---

## 🔌 Endpoints de API REST (Backend)

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/v1/products` | Filtros por categoría, subcategoría, búsqueda `q`, precios min/max, ofertas flash y ordenamiento |
| `POST` | `/api/v1/orders` | Creación de pedidos, cálculo de flete según ciudad colombiana, cupones y emisión de factura DIAN |
| `GET` | `/api/v1/orders/track/:id` | Rastreo en vivo por número de orden (`OK-2026-XXXX`) o guía de Coordinadora/Servientrega |
| `GET` | `/api/v1/invoices/:orderId` | Consulta de Factura Electrónica legal DIAN con CUFE, código QR y desglose de IVA (19%) |
| `POST` | `/api/v1/pqrs` | Radicación de Petición, Queja, Reclamo o Sugerencia con radicado automático `PQRS-2026-XXXX` |
| `GET` | `/api/v1/pqrs/:radicado` | Consulta de estado y respuesta oficial del equipo de soporte para un radicado |

---

## 🚀 Puesta en Marcha

1. **Instalar Dependencias:**
   ```bash
   npm install
   ```

2. **Generar Cliente Prisma y Sincronizar Base de Datos:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Sembrar Catálogo Inicial y Órdenes de Demostración:**
   ```bash
   npx tsx src/data/seed.ts
   ```

4. **Ejecutar en Modo Desarrollo o Producción:**
   ```bash
   # Desarrollo
   npm run dev

   # Producción
   npm run build
   npm start
   ```

5. **Validar Endpoints:**
   ```bash
   node test-api.mjs
   ```
