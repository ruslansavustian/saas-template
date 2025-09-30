"use client";

import React, { useCallback } from "react";

import { useFormState } from "@/hooks/useForm";
import { useAppDispatch, useAppSelector } from "@/store";
import { login, selectLoading } from "@/store/slices/auth-slice";
import { useRouter } from "@/i18n/navigation";
import { LoginDto } from "@/store/interfaces/interfaces";
import { paths } from "@/constants/paths";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "./locale-switcher";
import { ErrorContainer } from "./error-container";
import { LockIcon, MailIcon, User } from "lucide-react";
import AppButton from "./app-button";
import AppInput from "./app-input";

const LoginForm = () => {
  const { formData, handleChange, inputStatus, formErrors, isFormValid } =
    useFormState({
      email: "",
      password: "",
    });

  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoading);
  const router = useRouter();
  const t = useTranslations("auth.login");

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log("Form submitted with data:", formData);

      try {
        const result = await dispatch(login(formData as LoginDto)).unwrap();
        console.log("Login result:", result);
        if (result) {
          router.push(paths.orders);
        }
      } catch (error: unknown) {
        console.error("Login failed:", error);
      }
    },
    [dispatch, formData, router]
  );

  return (
    <div className=" relative min-h-screen flex items-center justify-center flex-col ">
      <div className=" w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <User size={36} />
            </div>
          </div>
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            {t("title")}
          </h1>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-8 py-2 flex flex-col items-center justify-center mih-h-[500px] min-w-[500px]">
          <div className="mt-4 text-center self-end">
            <LocaleSwitcher />
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {formErrors.general && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <p className="text-sm text-red-700">{formErrors.general}</p>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("email")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <MailIcon size={16} />
                </div>
                <AppInput
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  placeholder={t("emailPlaceholder")}
                  className="w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                  inputStatus={inputStatus.email}
                />
              </div>
              {formErrors.email && (
                <p className="mt-2 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("password")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <LockIcon size={16} />
                </div>
                <AppInput
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password || ""}
                  onChange={handleChange}
                  placeholder={t("passwordPlaceholder")}
                  className="w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                  inputStatus={inputStatus.password}
                />
              </div>
              {formErrors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {formErrors.password}
                </p>
              )}
            </div>

            <AppButton
              type="submit"
              isFormValid={isFormValid}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 shadow-sm hover:shadow-md rounded-full font-medium text-white transition-all duration-200"
              title={t("submit")}
              loading={loading}
            />
          </form>

          <div className="mt-8 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm"></div>
            </div>
          </div>
        </div>
      </div>

      <ErrorContainer />
    </div>
  );
};

export default LoginForm;
