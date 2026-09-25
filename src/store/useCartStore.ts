import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { calculateShipping, FREE_SHIPPING_THRESHOLD } from '@/lib/utils';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  regularPrice: number;
  offerPrice: number;
  specialTransferPrice: number;
  quantity: number;
  variantId?: string;
  variantName?: string;
}

export type PaymentMethodType = 'BANK_TRANSFER' | 'NEQUI' | 'DAVIPLATA' | 'PSE' | 'CREDIT_CARD' | 'CASH_ON_DELIVERY';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  paymentMethod: PaymentMethodType;
  couponCode: string | null;
  couponDiscount: number;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  setDrawerOpen: (open: boolean) => void;
  setPaymentMethod: (method: PaymentMethodType) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  getSubtotal: () => number;
  getSavings: () => number;
  getTotal: (city?: string) => {
    subtotal: number;
    discount: number;
    shipping: number;
    isFreeShipping: boolean;
    total: number;
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      paymentMethod: 'NEQUI',
      couponCode: null,
      couponDiscount: 0,

      addItem: (item) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += item.quantity;
            return { items: updated, isDrawerOpen: true };
          }

          const newItem: CartItem = {
            ...item,
            id: `${item.productId}-${item.variantId || 'base'}-${Date.now()}`,
          };
          return { items: [...state.items, newItem], isDrawerOpen: true };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      updateQuantity: (id, delta) => {
        set((state) => {
          const updated = state.items
            .map((item) => {
              if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean) as CartItem[];

          return { items: updated };
        });
      },

      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),

      setDrawerOpen: (open) => set({ isDrawerOpen: open }),

      setPaymentMethod: (method) => set({ paymentMethod: method }),

      applyCoupon: (code) => {
        const clean = code.trim().toUpperCase();
        const subtotal = get().getSubtotal();

        if (clean === 'NAVIDAD2026') {
          if (subtotal < 100000) {
            return { success: false, message: 'El cupón NAVIDAD2026 requiere una compra mínima de $100.000 COP' };
          }
          const discount = Math.round(subtotal * 0.15);
          set({ couponCode: clean, couponDiscount: discount });
          return { success: true, message: '¡Cupón NAVIDAD2026 aplicado! 15% de descuento adicional.' };
        }

        if (clean === 'OKSHOP10') {
          if (subtotal < 150000) {
            return { success: false, message: 'El cupón OKSHOP10 requiere una compra mínima de $150.000 COP' };
          }
          set({ couponCode: clean, couponDiscount: 20000 });
          return { success: true, message: '¡Cupón OKSHOP10 aplicado! Descuento directo de $20.000 COP.' };
        }

        return { success: false, message: 'El cupón ingresado no es válido o ya expiró.' };
      },

      removeCoupon: () => set({ couponCode: null, couponDiscount: 0 }),

      getSubtotal: () => {
        const { items, paymentMethod } = get();
        const isDirectTransfer = ['BANK_TRANSFER', 'NEQUI', 'DAVIPLATA', 'PSE'].includes(paymentMethod);

        return items.reduce((acc, item) => {
          const unitPrice = isDirectTransfer && item.specialTransferPrice
            ? item.specialTransferPrice
            : item.offerPrice;
          return acc + unitPrice * item.quantity;
        }, 0);
      },

      getSavings: () => {
        const { items, paymentMethod } = get();
        const isDirectTransfer = ['BANK_TRANSFER', 'NEQUI', 'DAVIPLATA', 'PSE'].includes(paymentMethod);

        return items.reduce((acc, item) => {
          const currentPrice = isDirectTransfer && item.specialTransferPrice
            ? item.specialTransferPrice
            : item.offerPrice;
          return acc + (item.regularPrice - currentPrice) * item.quantity;
        }, 0);
      },

      getTotal: (city = 'Bogotá D.C.') => {
        const subtotal = get().getSubtotal();
        const discount = get().couponDiscount;
        const shippingInfo = calculateShipping(city, subtotal);
        const total = Math.max(0, subtotal - discount + shippingInfo.cost);

        return {
          subtotal,
          discount,
          shipping: shippingInfo.cost,
          isFreeShipping: shippingInfo.isFree,
          total,
        };
      },
    }),
    {
      name: 'ok-shop-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        paymentMethod: state.paymentMethod,
        couponCode: state.couponCode,
        couponDiscount: state.couponDiscount,
      }),
    }
  )
);
