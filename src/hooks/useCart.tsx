import { useEffect, useState } from "react";
import { foodType, categoryType } from "../types/ProductTpye";
import { TentIcon } from "lucide-react";
import { toast } from "react-toastify";
import { flushSync } from "react-dom";
let tax: number = 10 / 100;

export interface CartItem extends foodType {
  quantity: number;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  const addToCart = (product: foodType) => {

    if (product.stock <= 0) {
      toast.error("sản phẩm đã hết hàng");
      return;
    }
    
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) => {
          if (item.id === product.id) {
            if (item.stock > item.quantity) {
              toast.success("Thêm sản phẩm thành công");
              return { ...item, quantity: item.quantity + 1 };
            } else {
              toast.error("Sản phẩm đã hết hàng");
              return item;
            }
          }
          return item;
        });
      }
      toast.success("Thêm sản phẩm thành công");
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const addToCartbySL = (product: foodType, sl: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + sl }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: sl }];
    });
  };

  // ➕ Tăng số lượng sản phẩm
  const increaseQuantity = (id: number) => {

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          if (item.stock > item.quantity) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            toast.error("Sản phẩm đã hết hàng");
            return item;
          }
        }
        return item;
      })
    );
  };

  const getProductById = (id: number) => {
    return cart.find((item) => item.id === id) || null;
  };

  // ➖ Giảm số lượng sản phẩm (nếu về 0 thì xóa)
  const decreaseQuantity = (id: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };
  // Tính tổng giá sản phẩm
  const getTotalPrice = () => {
    let sum: number = 0;
    cart.forEach((val) => {
      sum += val.sell_price * val.quantity;
    });
    return sum;
  };

  //Tính tổng thuế
  const getTotalTax = () => {
    return getTotalPrice() * tax;
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // lưu xuất giỏ hàng vào localStorage
  const saveCartToLocalStorage = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };
  // lấy giỏ hàng từ localStorage
  const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }

  // xóa tất cả 
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  useEffect(() => {
    // bỏ qua lần đầu tiên
    if (isLoading) {
      return;
    }
    saveCartToLocalStorage();
  }, [cart]);

  useEffect(() => {
    setIsLoading(true);
    loadCartFromLocalStorage();
    setIsLoading(false);
  }, []);

  return {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    getTotalPrice,
    getTotalTax,
    removeFromCart,
    addToCartbySL,
    isLoading,
    clearCart,
    getProductById,
  };
}
