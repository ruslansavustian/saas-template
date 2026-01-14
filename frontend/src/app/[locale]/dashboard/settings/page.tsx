"use client";

import AppButton from "@/components/ui-components/app-button";
import { paths } from "@/constants/paths";
import { useAppDispatch } from "@/store";
import { logoutAction } from "@/store/slices/auth-slice";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const t = useTranslations("");
  const handleLogout = useCallback(async () => {
    dispatch(logoutAction());
    router.push(paths.home);
  }, [dispatch, router]);
  return (
    <div className="p-6 flex flex-col flex-1 ">
      <div className="flex justify-end">
        <AppButton
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
          title={t("auth.login.logout")}
          type="button"
        />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        {t("dashboard.settings")}
      </h1>
      <p className="text-gray-600">{t("dashboard.settingsPage.subtitle")}</p>
    </div>
  );
}
