import { CreateOrderDto, Order } from "@/interfaces";

export const mockOrderData: CreateOrderDto = {
  title: "Test Order",
  description: "Test description",
  products: [
    {
      serialNumber: "12345",
      title: "Product 1",
      type: "Electronics",
      isNew: true,
      price: [{ value: 100, symbol: "USD", isDefault: true }],
    },
  ],
};

export const mockCreatedOrder: Order = {
  id: 1,
  title: "Test Order",
  description: "Test description",
  date: "2024-01-01",
  deleted: false,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  products: [],
};

export const mockOrders: Order[] = [
  {
    id: 1,
    title: "Order 1",
    description: "Description 1",
    date: "2024-01-01",
    deleted: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    products: [],
  },
  {
    id: 2,
    title: "Order 2",
    description: "Description 2",
    date: "2024-01-02",
    deleted: false,
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
    products: [],
  },
];

export const mockUpdateData = {
  id: 1,
  order: {
    title: "Updated Order",
    description: "Updated description",
  },
};

export const mockUpdatedOrder: Order = {
  id: 1,
  title: "Updated Order",
  description: "Updated description",
  date: "2024-01-01",
  deleted: false,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  products: [],
};

export const mockExistingOrder: Order = {
  id: 1,
  title: "Original Order",
  description: "Original description",
  date: "2024-01-01",
  deleted: false,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  products: [],
};

export const mockOrderToDelete: Order = {
  id: 1,
  title: "Order to Delete",
  description: "This order will be deleted",
  date: "2024-01-01",
  deleted: false,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  products: [],
};

export const mockOrderForSet: Order = {
  id: 1,
  title: "Test Order",
  description: "Test description",
  date: "2024-01-01",
  deleted: false,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  products: [],
};
