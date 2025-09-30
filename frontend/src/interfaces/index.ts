export interface FormState {
  email?: string;
  password?: string;
  name?: string;
  title?: string;
  priceUSD?: string;
  priceUAH?: string;
  description?: string;
  specification?: string;
  orderId?: string;
  isNew?: string;
  photo?: string;
  guaranteeStart?: string;
  guaranteeEnd?: string;
  serialNumber?: string;
  type?: string;
  orderDate?: string;
}

export interface InputChangeEvent {
  target: {
    name: string;
    value: string;
  };
}

export interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ProductFormData {
  serialNumber: string;
  title: string;
  type: string;
  priceUSD: string;
  priceUAH: string;
  orderId: string;
  specification?: string;
  photo?: string;
  guaranteeStart?: string;
  guaranteeEnd?: string;
  isNew: string;
  description?: string;
}

export interface Product {
  id: number;
  serialNumber: number;
  isNew: boolean;
  photo?: string;
  title: string;
  type: string;
  specification?: string;
  guarantee?: {
    start: string;
    end: string;
  };
  price: Array<{
    value: number;
    symbol: string;
    isDefault: boolean;
  }>;
  date: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  orderId: number;
  order?: {
    id: number;
    title: string;
  };
}

export interface CreateProductDto {
  serialNumber?: number;
  isNew?: boolean;
  photo?: string;
  title?: string;
  type?: string;
  specification?: string;
  guarantee?: {
    start: string;
    end: string;
  };
  price: Array<{
    value: number;
    symbol: string;
    isDefault: boolean;
  }>;
  date?: string;
}

export interface ProductTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (productId: number) => void;
  loading?: boolean;
}

export interface Order {
  id: number;
  title: string;
  description?: string;
  date: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  products: Product[];
}

export interface CreateOrderDto {
  title: string;
  description: string;
  products: Array<{
    serialNumber: string;
    title: string;
    type: string;
    specification?: string;
    isNew: boolean;
    photo?: string;
    guarantee?: {
      start: string;
      end: string;
    };
    price: Array<{
      value: number;
      symbol: string;
      isDefault: boolean;
    }>;
  }>;
}

export interface OrderFormData {
  title: string;
  description: string;
  products: string;
}

export interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface OrderTableProps {
  orders: Order[];
  onDelete?: (orderId: number) => void;
  onView?: (order: Order) => void;
  selectedOrderId?: number | null;
  loading?: boolean;
}

export interface OrderRowProps {
  order: Order;
  isSelected?: boolean | null;
  onView: (order: Order) => void;
  onDelete?: (orderId: string) => void;
  totals: any;
  selectedOrderId?: string | null;
}

export interface ProductRowProps {
  product: Product;
  isSelected: boolean;
  onView: (product: Product) => void;
  onDelete: (product: Product) => void;
  locale: string;
  t: any;
}
