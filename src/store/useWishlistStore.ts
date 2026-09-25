import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WishlistState {
  favorites: string[]; // product IDs
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      favorites: ['prod-ebike-ok-pro', 'prod-smartwatch-ultra', 'prod-ancheta-navidena-gran-reserva'],
      toggleFavorite: (productId) => {
        const { favorites } = get();
        if (favorites.includes(productId)) {
          set({ favorites: favorites.filter((id) => id !== productId) });
        } else {
          set({ favorites: [...favorites, productId] });
        }
      },
      isFavorite: (productId) => get().favorites.includes(productId),
    }),
    {
      name: 'ok-shop-wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
