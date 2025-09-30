import { configureStore } from "@reduxjs/toolkit";
import productSlice, {
  createProduct,
  fetchProducts,
  clearErrorProducts,
  setProducts,
} from "@/store/slices/product-slice";
import { CreateProductDto } from "@/interfaces";
import {
  mockProductData,
  mockCreatedProduct,
  mockProducts,
  mockProductForSet,
} from "../../mocks/product-mocks";

jest.mock("@/utils/request", () => ({
  request: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

import { request } from "@/utils/request";
const mockRequest = request as jest.Mocked<typeof request>;

describe("Product Slice", () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        products: productSlice,
      },
    });
    jest.clearAllMocks();
  });

  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const state = store.getState();
      expect((state as any).products).toEqual({
        products: [],
        loading: false,
        error: null,
      });
    });
  });

  describe("createProduct", () => {
    it("should handle pending state", () => {
      store.dispatch(createProduct.pending("", mockProductData));
      const state = store.getState();

      expect((state as any).products.loading).toBe(true);
      expect((state as any).products.error).toBe(null);
    });

    it("should handle fulfilled state", () => {
      store.dispatch(createProduct.pending("", mockProductData));
      store.dispatch(
        createProduct.fulfilled(mockCreatedProduct, "", mockProductData)
      );
      const state = store.getState();

      expect((state as any).products.loading).toBe(false);
      expect((state as any).products.products).toHaveLength(1);
    });

    it("should handle rejected state", () => {
      const errorMessage = "Failed to create product";

      store.dispatch(createProduct.pending("", mockProductData));
      store.dispatch(
        createProduct.rejected(
          new Error(errorMessage),
          "",
          mockProductData,
          errorMessage
        )
      );
      const state = store.getState();

      expect((state as any).products.loading).toBe(false);
      expect((state as any).products.error).toBe(errorMessage);
    });

    it("should make API call", async () => {
      mockRequest.post.mockResolvedValueOnce({ data: mockCreatedProduct });

      await store.dispatch(createProduct(mockProductData) as any);

      expect(mockRequest.post).toHaveBeenCalledWith(
        "/products",
        mockProductData
      );
    });
  });

  describe("fetchProducts", () => {
    it("should handle pending state", () => {
      store.dispatch(fetchProducts.pending(""));
      const state = store.getState();

      expect((state as any).products.loading).toBe(true);
    });

    it("should handle fulfilled state", () => {
      store.dispatch(fetchProducts.pending(""));
      store.dispatch(fetchProducts.fulfilled(mockProducts, ""));
      const state = store.getState();

      expect((state as any).products.loading).toBe(false);
      expect((state as any).products.products).toEqual(mockProducts);
    });

    it("should make API call", async () => {
      mockRequest.get.mockResolvedValueOnce({ data: mockProducts });

      await store.dispatch(fetchProducts() as any);

      expect(mockRequest.get).toHaveBeenCalledWith("/products");
    });
  });

  describe("Reducers", () => {
    it("should clear error", () => {
      store.dispatch(
        createProduct.rejected(
          new Error("Test error"),
          "",
          {} as CreateProductDto,
          "Test error"
        )
      );
      store.dispatch(clearErrorProducts());
      const state = store.getState();

      expect((state as any).products.error).toBe(null);
    });

    it("should set products", () => {
      store.dispatch(setProducts([mockProductForSet]));
      const state = store.getState();

      expect((state as any).products.products).toEqual([mockProductForSet]);
    });
  });
});
