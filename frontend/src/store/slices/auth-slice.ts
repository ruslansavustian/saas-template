import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthState,
  LoginDto,
  RegisterDto,
  User,
} from "../interfaces/interfaces";
import { request } from "@/utils/request";
import { handleApiError } from "@/utils/errorHandler";
import { RootState } from "..";

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await request.get("/auth/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (loginDto: LoginDto, { rejectWithValue }) => {
    try {
      console.log("Starting login process with:", loginDto);
      const sessionResponse = await request.post("/auth/init-session");
      const { uuid } = sessionResponse.data;
      const credentials = btoa(`${loginDto.email}:${loginDto.password}`);
      const response = await request.post(
        "/auth/login",
        { uuid },
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        }
      );
      if (response) {
        const { access_token, user } = response.data;
        localStorage.setItem("token", access_token);
        request.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${access_token}`;
        return user;
      }
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (registerDto: RegisterDto, { rejectWithValue }) => {
    try {
      const response = await request.post("/auth/register", registerDto);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearErrorAuth: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearErrorAuth,
  setUser,
  logout: logoutAction,
} = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectLoading = (state: RootState) => state.auth.loading;
export const selectErrorAuth = (state: RootState) => state.auth.error;

export default authSlice.reducer;
