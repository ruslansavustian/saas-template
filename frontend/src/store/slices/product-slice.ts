import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../index";
import { CreateProductDto, Product } from "@/interfaces";
import { ProductsState } from "../types";
import { request } from "@/utils/request";

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (product: CreateProductDto, { rejectWithValue }) => {
    try {
      const response = await request.post("/products", product);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        Array(error.response?.data?.message)?.join(", ") ||
          error.response?.data?.message ||
          error.message ||
          "Failed to create product"
      );
    }
  }
);

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request.get("/products");
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearErrorProducts: (state) => {
      state.error = null;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string[];
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string[];
      });
  },
});

export const { clearErrorProducts, setProducts } = productSlice.actions;

export const selectProducts = (state: RootState) => state.products.products;
export const selectProductsLoading = (state: RootState) =>
  state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;

export default productSlice.reducer;
