export interface FastFoodItem {
  id: number;
  name: string;
  price: number;
  category: "Food" | "Drink";
  inStock: boolean;
  image: string;
  description?: string;
  createdAt: Date;
}
