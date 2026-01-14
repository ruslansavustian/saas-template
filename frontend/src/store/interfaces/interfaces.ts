export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData extends Record<string, unknown> {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export interface ClearAction {
  clearAction: () => void;
}

export interface ServicePointsState {
  servicePoints: ServicePoint[];
  loading: boolean;
  error: string | null;
}

export interface ServicePoint {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  description: string;
  latitude: number;
  longitude: number;
}
