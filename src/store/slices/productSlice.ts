import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FastFoodItem } from "../../types/FastFoodItem.ts";
import { getProducts } from "../../services/productService";

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const response = await getProducts();
  return response;
});

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [] as FastFoodItem[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      });
  },
});

export default productSlice.reducer;