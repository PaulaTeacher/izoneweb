'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, Variant } from '@izone/shared-types';

export interface CartItem {
  id: string; // combination of variantId
  productId: string;
  variantId: string;
  productName: string;
  productSlug: string;
  variantDetails: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  hasProtection?: boolean;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, variant: Variant, quantity?: number, hasProtection?: boolean) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('izone_cart');
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem('izone_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = (product: Product, variant: Variant, quantity = 1, hasProtection = false) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.variantId === variant.id);
      if (existing) {
        return prev.map((item) =>
          item.variantId === variant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      const details = [variant.colorName, variant.storage].filter(Boolean).join(' • ');
      const newItem: CartItem = {
        id: `${product.id}-${variant.id}`,
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        productSlug: product.slug,
        variantDetails: details,
        imageUrl: variant.featuredImage || product.images?.[0],
        price: Number(variant.price) + (hasProtection ? 189000 : 0),
        quantity,
        hasProtection,
      };

      return [...prev, newItem];
    });
    setIsOpen(true);
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => setItems([]);

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
