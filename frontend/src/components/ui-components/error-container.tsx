import { useDispatch, useSelector } from "react-redux";

import { useEffect, useState } from "react";
import { clearErrorAuth, selectErrorAuth } from "@/store/slices/auth-slice";
import { clearErrorUsers, selectUsersError } from "@/store/slices/user-slice";

import { CircleX, TriangleAlert } from "lucide-react";
import {
  clearErrorProducts,
  selectProductsError,
} from "@/store/slices/product-slice";

export const ErrorContainer = () => {
  const dispatch = useDispatch();
  const errorAuth = useSelector(selectErrorAuth);
  const errorUsers = useSelector(selectUsersError);
  const errorProducts = useSelector(selectProductsError);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (errorAuth) {
      setTimeout(() => {
        dispatch(clearErrorAuth());
      }, 5000);
    }
    if (errorUsers) {
      setTimeout(() => {
        dispatch(clearErrorUsers());
      }, 5000);
    }
    if (errorProducts) {
      setTimeout(() => {
        dispatch(clearErrorProducts());
      }, 5000);
    }
  }, [errorAuth, errorUsers, errorProducts, dispatch]);

  const errors = [
    { type: "auth", message: errorAuth },
    { type: "users", message: errorUsers },
    { type: "products", message: errorProducts },
  ].filter((error) => error.message);

  const handleClearError = () => {
    if (errorAuth) dispatch(clearErrorAuth());
    else if (errorUsers) dispatch(clearErrorUsers());
    else if (errorProducts) dispatch(clearErrorProducts());
  };

  useEffect(() => {
    if (errorAuth || errorUsers || errorProducts) {
      setShouldRender(true);

      setTimeout(() => setIsVisible(true), 10);

      const timer = setTimeout(() => {
        setIsVisible(false);

        setTimeout(() => {
          setShouldRender(false);
          if (errorAuth) dispatch(clearErrorAuth());
          if (errorUsers) dispatch(clearErrorUsers());
          if (errorProducts) dispatch(clearErrorProducts());
        }, 500);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errorAuth, errorUsers, errorProducts, dispatch]);

  if (!shouldRender || errors.length === 0) return null;
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2 max-w-md w-full px-4">
      {errors.map((error, index) => (
        <div
          key={index}
          className={`animate__animated ${
            isVisible
              ? "animate__slideInUp animate__faster"
              : "animate__slideOutDown animate__faster"
          }`}
        >
          <div className="bg-white border border-red-200 rounded-xl p-4 shadow-lg flex items-center justify-between">
            <div className="flex items-center flex-1">
              <TriangleAlert size={24} className="text-red-500 mr-2" />
              <div className="flex flex-col items-center w-full">
                <p className="text-sm font-medium text-red-800 mb-0 text-center">
                  {error.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleClearError()}
              className="ml-2 text-red-400 hover:text-red-600 transition-colors"
            >
              <CircleX size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
