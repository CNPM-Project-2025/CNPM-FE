import { useState } from "react";
import { FastFoodItem } from "../types/FastFoodItem";


interface CartItem extends FastFoodItem {
  quantity: number;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  // 🛒 Thêm sản phẩm vào giỏ hàng
  const addToCart = (product: FastFoodItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // ➕ Tăng số lượng sản phẩm
  const increaseQuantity = (id: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  // ➖ Giảm số lượng sản phẩm (nếu về 0 thì xóa)
  const decreaseQuantity = (id: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  // ❌ Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  return { cart, addToCart, increaseQuantity, decreaseQuantity, removeFromCart };
}
