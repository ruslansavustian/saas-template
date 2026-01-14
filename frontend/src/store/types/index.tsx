import { Product } from "@/interfaces";
import { User } from "../interfaces/interfaces";

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string[] | null;
}

export interface RootState {
  users: UsersState;
  auth: AuthState;
  products: ProductsState;
}
