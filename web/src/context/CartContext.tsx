"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { CartItemType, FoodType } from "@/common/common";

const CART_KEY = "nomnom-cart";
const ADDRESS_KEY = "nomnom-address";

type CartContextValue = {
  items: CartItemType[];
  address: string;
  itemsTotal: number;
  count: number;
  setAddress: (address: string) => void;
  addItem: (food: FoodType, quantity: number) => void;
  setQuantity: (foodId: string, quantity: number) => void;
  removeItem: (foodId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const readStored = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [address, setAddressState] = useState("");

  // localStorage-г зөвхөн browser дээр уншина — SSR-тэй зөрчилдөхгүйн тулд.
  useEffect(() => {
    setItems(readStored<CartItemType[]>(CART_KEY, []));
    setAddressState(readStored<string>(ADDRESS_KEY, ""));
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // хувийн цонх эсвэл сангийн эрх хаалттай үед алгасна
    }
  }, [items]);

  const setAddress = (next: string) => {
    setAddressState(next);
    try {
      window.localStorage.setItem(ADDRESS_KEY, JSON.stringify(next));
    } catch {
      // алгасна
    }
  };

  const addItem = (food: FoodType, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.food._id === food._id);
      if (existing) {
        return prev.map((item) =>
          item.food._id === food._id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { food, quantity }];
    });
  };

  const setQuantity = (foodId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) =>
        item.food._id === foodId ? { ...item, quantity } : item,
      ),
    );
  };

  const removeItem = (foodId: string) => {
    setItems((prev) => prev.filter((item) => item.food._id !== foodId));
  };

  const clearCart = () => setItems([]);

  const itemsTotal = useMemo(
    () =>
      items.reduce((sum, item) => sum + (item.food.price ?? 0) * item.quantity, 0),
    [items],
  );

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        address,
        itemsTotal,
        count,
        setAddress,
        addItem,
        setQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart-г CartProvider дотор ашиглана");
  }
  return context;
};
