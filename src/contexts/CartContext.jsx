import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_ITEMS_KEY = 'myapp_cartItems';
const CART_OPEN_KEY = 'myapp_cartIsOpen';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_ITEMS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_OPEN_KEY);
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  // Save cartItems to localStorage on change
  useEffect(() => {
    localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Save isCartOpen to localStorage on change
  useEffect(() => {
    localStorage.setItem(CART_OPEN_KEY, JSON.stringify(isCartOpen));
  }, [isCartOpen]);

  // Auto-close cart if empty
  useEffect(() => {
    if (cartItems.length === 0) {
      setIsCartOpen(false);
    }
  }, [cartItems]);

const addToCart = (product, showCart = true) => {
  setCartItems((prev) => {
    const existing = prev.find(item => 
      item.id === product.id &&
      JSON.stringify(item.variation || []) === JSON.stringify(product.variation || [])
    );

    if (existing) {
      // Add the quantity from product.quantity instead of always +1
      return prev.map(item =>
        item.id === product.id &&
        JSON.stringify(item.variation || []) === JSON.stringify(product.variation || [])
          ? { ...item, quantity: item.quantity + (product.quantity || 1) }
          : item
      );
    }
    // Add new product with its specified quantity or default 1
    return [...prev, { ...product, quantity: product.quantity || 1 }];
  });

  if (showCart) {
    setIsCartOpen(true);
  }
};

  

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) return removeFromCart(productId);
    setCartItems((prev) =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
