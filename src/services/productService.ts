import { FastFoodItem } from "../types/FastFoodItem";

import rawProducts from "../data/Products.json";

// Định nghĩa kiểu dữ liệu thô từ products.json
interface RawFastFoodItem {
  id: number;
  name: string;
  price: number;
  category: string; // Tạm thời để là string
  inStock: boolean;
  image: string;
  description?: string;
  createdAt: string; // createdAt trong JSON là string
}

export const getProducts = async (): Promise<FastFoodItem[]> => {
  // Ép kiểu dữ liệu thô từ JSON
  const products = rawProducts as RawFastFoodItem[];

  return products.map((product: RawFastFoodItem) => {
    // Kiểm tra và chuyển đổi category
    const category: "Food" | "Drink" =
      product.category === "Food" || product.category === "Drink"
        ? product.category
        : "Food"; // Mặc định là "Food" nếu category không hợp lệ

    // Chuyển đổi createdAt từ string sang Date
    const createdAt = product.createdAt
      ? new Date(product.createdAt)
      : new Date();

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      category, // Đã kiểm tra và chuyển đổi
      inStock: product.inStock,
      image: product.image,
      description: product.description,
      createdAt, // Đã chuyển đổi sang Date
    } as FastFoodItem;
  });
};