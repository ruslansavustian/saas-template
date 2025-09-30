import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../index";
import { CreateOrderDto, Order } from "@/interfaces";
import { request } from "@/utils/request";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (order: CreateOrderDto, { rejectWithValue }) => {
    try {
      const response = await request.post("/orders", order);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        Array(error.response?.data?.message)?.join(", ") ||
          error.response?.data?.message ||
          error.message ||
          "Failed to create order"
      );
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request.get("/orders");
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async (
    { id, order }: { id: number; order: Partial<CreateOrderDto> },
    { rejectWithValue }
  ) => {
    try {
      const response = await request.put(`/orders/${id}`, order);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        Array(error.response?.data?.message)?.join(", ") ||
          error.response?.data?.message ||
          error.message ||
          "Failed to update order"
      );
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (id: number, { rejectWithValue }) => {
    try {
      await request.delete(`/orders/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        Array(error.response?.data?.message)?.join(", ") ||
          error.response?.data?.message ||
          error.message ||
          "Failed to delete order"
      );
    }
  }
);

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string[] | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearErrorOrders: (state) => {
      state.error = null;
    },
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string[];
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string[];
      })
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string[];
      })
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(
          (order) => order.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string[];
      });
  },
});

export const { clearErrorOrders, setOrders } = orderSlice.actions;

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectOrdersLoading = (state: RootState) => state.orders.loading;
export const selectOrdersError = (state: RootState) => state.orders.error;

export default orderSlice.reducer;
