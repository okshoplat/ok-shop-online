import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Shipping calculation logic for Colombia
export interface ShippingCalculation {
  cost: number;
  isFree: boolean;
  carrier: string;
  estimatedDays: string;
}

export const COLOMBIA_CITIES = [
  { city: 'Bogotá D.C.', department: 'Cundinamarca', baseCost: 9900, days: '24-48 horas' },
  { city: 'Medellín', department: 'Antioquia', baseCost: 12900, days: '24-48 horas' },
  { city: 'Cali', department: 'Valle del Cauca', baseCost: 13900, days: '48-72 horas' },
  { city: 'Barranquilla', department: 'Atlántico', baseCost: 14900, days: '48-72 horas' },
  { city: 'Bucaramanga', department: 'Santander', baseCost: 12900, days: '48 horas' },
  { city: 'Cartagena', department: 'Bolívar', baseCost: 15900, days: '48-72 horas' },
  { city: 'Pereira', department: 'Risaralda', baseCost: 11900, days: '24-48 horas' },
  { city: 'Manizales', department: 'Caldas', baseCost: 11900, days: '24-48 horas' },
  { city: 'Cúcuta', department: 'Norte de Santander', baseCost: 14900, days: '48-72 horas' },
  { city: 'Ibagué', department: 'Tolima', baseCost: 11900, days: '24-48 horas' },
  { city: 'Santa Marta', department: 'Magdalena', baseCost: 15900, days: '48-72 horas' },
  { city: 'Villavicencio', department: 'Meta', baseCost: 12900, days: '24-48 horas' },
  { city: 'Pasto', department: 'Nariño', baseCost: 16900, days: '72 horas' },
  { city: 'Montería', department: 'Córdoba', baseCost: 14900, days: '48-72 horas' },
  { city: 'Neiva', department: 'Huila', baseCost: 13900, days: '48 horas' },
  { city: 'Armenia', department: 'Quindío', baseCost: 11900, days: '24-48 horas' },
];

export const FREE_SHIPPING_THRESHOLD = 150000; // Free shipping over $150.000 COP

export function calculateShipping(city: string, subtotal: number): ShippingCalculation {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return {
      cost: 0,
      isFree: true,
      carrier: 'Coordinadora Express',
      estimatedDays: '24-48 horas',
    };
  }

  const found = COLOMBIA_CITIES.find(
    (c) => c.city.toLowerCase() === city.toLowerCase()
  );

  const cost = found ? found.baseCost : 14900;
  const days = found ? found.days : '48-72 horas';

  return {
    cost,
    isFree: false,
    carrier: 'Servientrega / Coordinadora',
    estimatedDays: days,
  };
}

export function generateRadicado(): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PQRS-2026-${random}`;
}

export function generateOrderNumber(): string {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `OK-2026-${random}`;
}

export function generateCUFE(orderNumber: string, date: string, nit: string): string {
  // Generates DIAN CUFE SHA-384 simulation format
  const raw = `${orderNumber}-${date}-${nit}-OKSHOP-DIAN-AUTORIZADO-2026`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `fe7b89${hex}c3d5e90214a7810df6732cb491e0a941582e01df39ca25b${hex}7194`;
}
