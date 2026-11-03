"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { toast } from "@/components/ui/toast";

export type CartItem = {
  productId: string;
  variantId: string;
  name: string;
  color: string | null;
  size: string | null;
  price?: string | null;
  quantity: number;
};

type StoreState = {
  cartItems: CartItem[];
  wishlistProductIds: string[];
};

type StoreContextValue = StoreState & {
  cartCount: number;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  toggleWishlist: (productId: string, productName: string, price?: string) => void;
};

const STORAGE_KEY = "urban-styles-store";
const serverState: StoreState = { cartItems: [], wishlistProductIds: [] };
let state = serverState;
let initialized = false;
const listeners = new Set<() => void>();

function getSnapshot() {
  if (typeof window !== "undefined" && !initialized) {
    initialized = true;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as Partial<StoreState>;
        state = {
          cartItems: Array.isArray(data.cartItems) ? data.cartItems : [],
          wishlistProductIds: Array.isArray(data.wishlistProductIds) ? data.wishlistProductIds : [],
        };
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }
  return state;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function updateStore(update: (current: StoreState) => StoreState) {
  initialized = true;
  state = update(state);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ cartItems: state.cartItems, wishlistProductIds: state.wishlistProductIds }));
  } catch {
    // Keep the in-memory cart usable when browser storage is unavailable.
  }
  listeners.forEach((listener) => listener());
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const current = useSyncExternalStore(subscribe, getSnapshot, () => serverState);
  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    let quantity = 1;
    updateStore((previous) => {
      const existing = previous.cartItems.find((entry) => entry.variantId === item.variantId);
      quantity = (existing?.quantity ?? 0) + 1;
      const cartItems = existing
        ? previous.cartItems.map((entry) => entry.variantId === item.variantId ? { ...entry, quantity: entry.quantity + 1 } : entry)
        : [...previous.cartItems, { ...item, quantity: 1 }];
      return { ...previous, cartItems };
    });
    toast.add({
      title: `${item.name} added to cart`,
      description: [item.price && `Price: ${item.price}`, item.color && `Colour: ${item.color}`, item.size && `Size: ${item.size}`, `Quantity: ${quantity}`].filter(Boolean).join(" · "),
      type: "success",
    });
  }, []);
  const toggleWishlist = useCallback((productId: string, productName: string, price?: string) => {
    let wasAdded = false;
    updateStore((previous) => {
      const willSave = !previous.wishlistProductIds.includes(productId);
      wasAdded = willSave;
      const wishlistProductIds = willSave ? [...previous.wishlistProductIds, productId] : previous.wishlistProductIds.filter((id) => id !== productId);
      return { ...previous, wishlistProductIds };
    });
    toast.add({
      title: wasAdded ? `${productName} added to wishlist` : `${productName} removed from wishlist`,
      description: [price && `Price: ${price}`, `Your wishlist now has ${state.wishlistProductIds.length} ${state.wishlistProductIds.length === 1 ? "item" : "items"}.`].filter(Boolean).join(" · "),
      type: "success",
    });
  }, []);
  return <StoreContext.Provider value={{ ...current, cartCount: current.cartItems.reduce((total, item) => total + item.quantity, 0), addToCart, toggleWishlist }}>
    {children}
  </StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
