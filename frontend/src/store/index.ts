import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

import usersReducer from "./slices/user-slice";
import authReducer from "./slices/auth-slice";
import productReducer from "./slices/product-slice";
import orderReducer from "./slices/order-slice";
export const store = configureStore({
  reducer: {
    users: usersReducer,
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
  devTools:
    process.env.NODE_ENV !== "production"
      ? {
          name: "PS Play Store",
          trace: true,
          traceLimit: 25,

          maxAge: 50,
          shouldHotReload: false,
          shouldRecordChanges: true,
          shouldStartLocked: false,
        }
      : false,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
