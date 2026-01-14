"use client";

import { paths } from "@/constants/paths";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchCurrentUser,
  selectCurrentUser,
  selectLoading,
} from "@/store/slices/auth-slice";

export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithAuthCheckComponent = (props: P) => {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser);
    const loading = useAppSelector(selectLoading);
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    const checkAuth = useCallback(async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsChecking(false);
        router.push(paths.home);
        return;
      }

      if (!currentUser && !loading) {
        try {
          await dispatch(fetchCurrentUser()).unwrap();
        } catch (error) {
          console.log("Auth error:", error);
          localStorage.removeItem("token");
          setIsChecking(false);
          router.push(paths.home);
          return;
        }
      }

      if (currentUser) {
        setIsChecking(false);
      }
    }, [dispatch, currentUser, loading, router]);

    useEffect(() => {
      checkAuth();
    }, [checkAuth]);

    if (loading || isChecking) {
      return (
        <div className="min-h-screen flex items-center justify-center w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!currentUser) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthCheckComponent.displayName = `withAuthCheck(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithAuthCheckComponent;
};
