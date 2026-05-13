import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name_vi: string;
  name_en: string;
  slug: string;
  price: number;
  original_price?: number;
  images: string[];
  stock_quantity: number;
  category?: { id?: number; name_vi: string; name_en: string; slug: string };
}

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotal: () => number;
  getSubtotal: () => number;
  getShipping: () => number;
  getCount: () => number;
}

interface Admin {
  id: number;
  email: string;
  name: string;
  avatar_url?: string;
}

interface AdminStore {
  admin: Admin | null;
  token: string | null;
  setAdmin: (admin: Admin, token: string) => void;
  clearAdmin: () => void;
  isAuthenticated: () => boolean;
}

interface ThemeStore {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// ─── Cart Store ───────────────────────────────────────────────────────────────

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock_quantity) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(quantity, i.stock_quantity) } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      getShipping: () => {
        const subtotal = get().getSubtotal();
        return subtotal >= 500000 ? 0 : 30000;
      },
      getTotal: () => get().getSubtotal() + get().getShipping(),
      getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'rtshop-cart',
      // Only persist items, not UI state
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// ─── Admin Auth Store ─────────────────────────────────────────────────────────

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      admin: null,
      token: null,

      setAdmin: (admin, token) => {
        set({ admin, token });
        // Also set as cookie for SSR middleware
        if (typeof document !== 'undefined') {
          document.cookie = `admin_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict`;
        }
      },

      clearAdmin: () => {
        set({ admin: null, token: null });
        if (typeof document !== 'undefined') {
          document.cookie = 'admin_token=; path=/; max-age=0';
        }
      },

      isAuthenticated: () => !!get().token && !!get().admin,
    }),
    {
      name: 'rtshop-admin',
    }
  )
);

// ─── Theme Store ──────────────────────────────────────────────────────────────

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'light',

      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
          }
          return { theme: newTheme };
        }),

      setTheme: (theme) => {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
        set({ theme });
      },
    }),
    {
      name: 'rtshop-theme',
      onRehydrateStorage: () => (state) => {
        // Apply theme class on hydration
        if (state && typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', state.theme === 'dark');
        }
      },
    }
  )
);
