'use client';

import React from 'react';
import { Truck, ShieldCheck, FileText, PhoneCall, CreditCard, RotateCcw } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const BADGES = [
    {
      icon: <Truck className="w-6 h-6 text-brand-red" />,
      title: 'Envíos Nacionales',
      description: 'Gratis en compras superiores a $150.000 COP con Servientrega e Inter Rapidísimo.',
    },
    {
      icon: <FileText className="w-6 h-6 text-brand-green" />,
      title: 'Factura Electrónica DIAN',
      description: 'Emitimos factura legal con código CUFE y validación previa oficial de la DIAN.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
      title: 'Garantía Directa OK Shop',
      description: 'Todos nuestros productos cuentan con garantía real de fábrica y soporte técnico.',
    },
    {
      icon: <PhoneCall className="w-6 h-6 text-brand-whatsapp" />,
      title: 'WhatsApp 301 777 77 60',
      description: 'Asesoría personalizada en tiempo real para cotizaciones, pedidos y seguimiento.',
    },
  ];

  return (
    <div className="py-8 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BADGES.map((b, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm"
            >
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0">
                {b.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{b.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
