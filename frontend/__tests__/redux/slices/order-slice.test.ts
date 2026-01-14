import { configureStore } from "@reduxjs/toolkit";
import orderSlice, {
  createOrder,
  fetchOrders,
  updateOrder,
  deleteOrder,
  clearErrorOrders,
  setOrders,
} from "@/store/slices/order-slice";
import { CreateOrderDto } from "@/interfaces";
import {
  mockOrderData,
  mockCreatedOrder,
  mockOrders,
  mockUpdateData,
  mockUpdatedOrder,
  mockExistingOrder,
  mockOrderForSet,
  mockOrderToDelete,
} from "../../mocks/order-mocks";

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

describe("Order Slice", () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        orders: orderSlice,
      },
    });
    jest.clearAllMocks();
  });

  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const state = store.getState();
      expect((state as any).orders).toEqual({
        orders: [],
        loading: false,
        error: null,
      });
    });
  });

  describe("createOrder", () => {
    it("should handle pending state", () => {
      store.dispatch(createOrder.pending("", mockOrderData));
      const state = store.getState();

      expect((state as any).orders.loading).toBe(true);
    });

    it("should handle fulfilled state", () => {
      store.dispatch(createOrder.pending("", mockOrderData));
      store.dispatch(
        createOrder.fulfilled(mockCreatedOrder, "", mockOrderData)
      );
      const state = store.getState();

      expect((state as any).orders.loading).toBe(false);
      expect((state as any).orders.orders).toHaveLength(1);
    });

    it("should handle rejected state", () => {
      const errorMessage = "Failed to create order";

      store.dispatch(createOrder.pending("", mockOrderData));
      store.dispatch(
        createOrder.rejected(
          new Error(errorMessage),
          "",
          mockOrderData,
          errorMessage
        )
      );
      const state = store.getState();

      expect((state as any).orders.loading).toBe(false);
      expect((state as any).orders.error).toBe(errorMessage);
    });

    it("should make API call", async () => {
      mockRequest.post.mockResolvedValueOnce({ data: mockCreatedOrder });

      await store.dispatch(createOrder(mockOrderData) as any);

      expect(mockRequest.post).toHaveBeenCalledWith("/orders", mockOrderData);
    });

    afterEach(() => {
      console.group("📝 createOrder Tests");
      console.log("✅ Pending state handled");
      console.log("✅ Fulfilled state handled");
      console.log("✅ Rejected state handled");
      console.log("✅ API call made");
      console.groupEnd();
    });
  });

  describe("fetchOrders", () => {
    it("should handle pending state", () => {
      store.dispatch(fetchOrders.pending(""));
      const state = store.getState();

      expect((state as any).orders.loading).toBe(true);
    });

    it("should handle fulfilled state", () => {
      store.dispatch(fetchOrders.pending(""));
      store.dispatch(fetchOrders.fulfilled(mockOrders, ""));
      const state = store.getState();

      expect((state as any).orders.loading).toBe(false);
      expect((state as any).orders.orders).toEqual(mockOrders);
    });

    it("should make API call", async () => {
      mockRequest.get.mockResolvedValueOnce({ data: mockOrders });

      await store.dispatch(fetchOrders() as any);

      expect(mockRequest.get).toHaveBeenCalledWith("/orders");
    });

    afterEach(() => {
      console.group("📋 fetchOrders Tests");
      console.log("✅ Pending state handled");
      console.log("✅ Fulfilled state handled");
      console.log("✅ API call made");
      console.groupEnd();
    });
  });

  describe("updateOrder", () => {
    it("should handle pending state", () => {
      store.dispatch(updateOrder.pending("", mockUpdateData));
      const state = store.getState();

      expect((state as any).orders.loading).toBe(true);
    });

    it("should handle fulfilled state", () => {
      store.dispatch(setOrders([mockExistingOrder]));
      store.dispatch(updateOrder.pending("", mockUpdateData));
      store.dispatch(
        updateOrder.fulfilled(mockUpdatedOrder, "", mockUpdateData)
      );
      const state = store.getState();

      expect((state as any).orders.loading).toBe(false);
      expect((state as any).orders.orders[0]).toEqual(mockUpdatedOrder);
    });

    it("should make API call", async () => {
      mockRequest.put.mockResolvedValueOnce({ data: mockUpdatedOrder });

      await store.dispatch(updateOrder(mockUpdateData) as any);

      expect(mockRequest.put).toHaveBeenCalledWith(
        `/orders/${mockUpdateData.id}`,
        mockUpdateData.order
      );
    });

    afterEach(() => {
      console.group("✏️ updateOrder Tests");
      console.log("✅ Pending state handled");
      console.log("✅ Fulfilled state handled");
      console.log("✅ API call made");
      console.groupEnd();
    });
  });

  describe("deleteOrder", () => {
    const orderId = 1;

    it("should handle pending state", () => {
      store.dispatch(deleteOrder.pending("", orderId));
      const state = store.getState();

      expect((state as any).orders.loading).toBe(true);
    });

    it("should handle fulfilled state", () => {
      store.dispatch(setOrders([mockOrderToDelete]));
      store.dispatch(deleteOrder.pending("", orderId));
      store.dispatch(deleteOrder.fulfilled(orderId, "", orderId));
      const state = store.getState();

      expect((state as any).orders.loading).toBe(false);
      expect((state as any).orders.orders).toHaveLength(0);
    });

    it("should make API call", async () => {
      mockRequest.delete.mockResolvedValueOnce({});

      await store.dispatch(deleteOrder(orderId) as any);

      expect(mockRequest.delete).toHaveBeenCalledWith(`/orders/${orderId}`);

      console.log("Order deleted");
    });
  });

  describe("Reducers", () => {
    it("should clear error", () => {
      store.dispatch(
        createOrder.rejected(
          new Error("Test error"),
          "",
          {} as CreateOrderDto,
          "Test error"
        )
      );
      store.dispatch(clearErrorOrders());
      const state = store.getState();

      expect((state as any).orders.error).toBe(null);
    });

    it("should set orders", () => {
      store.dispatch(setOrders([mockOrderForSet]));
      const state = store.getState();

      expect((state as any).orders.orders).toEqual([mockOrderForSet]);

      console.log("Orders set");
    });
  });
});
