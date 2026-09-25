import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { COLOMBIA_CITIES, calculateShipping } from '@/lib/utils';

interface LocationState {
  city: string;
  department: string;
  isModalOpen: boolean;
  setCity: (city: string, department: string) => void;
  openModal: () => void;
  closeModal: () => void;
  getShippingDetails: (subtotal: number) => ReturnType<typeof calculateShipping>;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      city: 'Bogotá D.C.',
      department: 'Cundinamarca',
      isModalOpen: false,

      setCity: (city, department) => set({ city, department, isModalOpen: false }),
      openModal: () => set({ isModalOpen: true }),
      closeModal: () => set({ isModalOpen: false }),

      getShippingDetails: (subtotal: number) => {
        return calculateShipping(get().city, subtotal);
      },
    }),
    {
      name: 'ok-shop-location-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
