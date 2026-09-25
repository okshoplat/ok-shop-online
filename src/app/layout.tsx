import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { WhatsAppWidget } from '@/components/common/WhatsAppWidget';

export const metadata: Metadata = {
  title: 'OK Shop - Variedad • Calidad • Tu Mejor Opción | Tienda Online Colombia',
  description:
    'Tienda en línea oficial de OK Shop. Descubre el Catálogo Navideño 2026: Bicicletas eléctricas, motos, tecnología, electrodomésticos, lencería para el hogar, anchetas navideñas, juguetes y licores. Envíos gratis a todo Colombia.',
  keywords: [
    'OK Shop',
    'Catálogo Navideño 2026',
    'Bicicletas eléctricas Colombia',
    'Anchetas navideñas Bogotá',
    'Lencería para el hogar',
    'Smartwatch ultra',
    'Freidora de aire',
    'Licores a domicilio',
  ],
  openGraph: {
    title: 'OK Shop - Catálogo Navideño 2026',
    description: 'Regalos que hacen especial esta Navidad. Variedad, calidad y tu mejor opción.',
    url: 'https://okshop.com.co',
    siteName: 'OK Shop',
    locale: 'es_CO',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <WhatsAppWidget />
      </body>
    </html>
  );
}
