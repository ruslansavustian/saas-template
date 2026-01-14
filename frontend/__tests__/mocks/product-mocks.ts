import { CreateProductDto, Product } from "@/interfaces";

export const mockProductData: CreateProductDto = {
  title: "Test Product",
  type: "Electronics",
  price: [{ value: 100, symbol: "USD", isDefault: true }],
  serialNumber: 12345,
  isNew: true,
};

export const mockCreatedProduct: Product = {
  id: 1,
  serialNumber: 12345,
  isNew: true,
  title: "Test Product",
  type: "Electronics",
  price: [{ value: 100, symbol: "USD", isDefault: true }],
  date: "2024-01-01",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  deleted: false,
  orderId: 1,
};

export const mockProducts: Product[] = [
  {
    id: 1,
    serialNumber: 12345,
    isNew: true,
    title: "Product 1",
    type: "Electronics",
    price: [{ value: 100, symbol: "USD", isDefault: true }],
    date: "2024-01-01",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    deleted: false,
    orderId: 1,
  },
  {
    id: 2,
    serialNumber: 67890,
    isNew: false,
    title: "Product 2",
    type: "Accessories",
    price: [{ value: 50, symbol: "USD", isDefault: true }],
    date: "2024-01-02",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
    deleted: false,
    orderId: 2,
  },
];

export const mockProductForSet: Product = {
  id: 1,
  serialNumber: 12345,
  isNew: true,
  title: "Test Product",
  type: "Electronics",
  price: [{ value: 100, symbol: "USD", isDefault: true }],
  date: "2024-01-01",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  deleted: false,
  orderId: 1,
};
