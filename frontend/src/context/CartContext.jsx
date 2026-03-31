import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const getGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem("shopeasy_guest_cart")) || [];
  } catch (error) {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const { userInfo } = useAuth();
  const [items, setItems] = useState(getGuestCart);
  const [loading, setLoading] = useState(false);

  const authConfig = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${userInfo?.token || ""}`
      }
    }),
    [userInfo]
  );

  const syncGuestCart = (cartItems) => {
    localStorage.setItem("shopeasy_guest_cart", JSON.stringify(cartItems));
    setItems(cartItems);
  };

  const fetchServerCart = async () => {
    if (!userInfo?.token) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/cart", authConfig);
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.token) {
      localStorage.removeItem("shopeasy_guest_cart");
      fetchServerCart();
    } else {
      setItems(getGuestCart());
    }
  }, [userInfo]);

  const addToCart = async (product, qty) => {
    const quantity = Number(qty);
    if (quantity < 1) return;

    if (userInfo?.token) {
      await api.post(
        "/cart",
        { productId: product._id, qty: quantity },
        authConfig
      );
      await fetchServerCart();
      return;
    }

    const current = getGuestCart();
    const existing = current.find((item) => item.product === product._id);
    let nextItems;
    if (existing) {
      nextItems = current.map((item) =>
        item.product === product._id
          ? {
              ...item,
              qty: Math.min(item.qty + quantity, product.countInStock)
            }
          : item
      );
    } else {
      nextItems = [
        ...current,
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          countInStock: product.countInStock,
          qty: quantity
        }
      ];
    }
    syncGuestCart(nextItems);
  };

  const updateItemQty = async (productId, qty) => {
    const quantity = Number(qty);
    if (quantity < 1) return;

    if (userInfo?.token) {
      await api.put(`/cart/${productId}`, { qty: quantity }, authConfig);
      await fetchServerCart();
      return;
    }

    const nextItems = items.map((item) =>
      item.product === productId
        ? { ...item, qty: Math.min(quantity, item.countInStock) }
        : item
    );
    syncGuestCart(nextItems);
  };

  const removeItem = async (productId) => {
    if (userInfo?.token) {
      await api.delete(`/cart/${productId}`, authConfig);
      await fetchServerCart();
      return;
    }

    const nextItems = items.filter((item) => item.product !== productId);
    syncGuestCart(nextItems);
  };

  const clearCart = async () => {
    if (userInfo?.token) {
      await api.delete("/cart", authConfig);
      await fetchServerCart();
      return;
    }
    syncGuestCart([]);
  };

  const value = useMemo(
    () => ({ items, loading, addToCart, updateItemQty, removeItem, clearCart, fetchServerCart }),
    [items, loading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};
