"use client";

import React from "react";
import LocaleSwitcher from "../ui-components/locale-switcher";

import { LayoutDashboard } from "lucide-react";
import { useTranslations } from "next-intl";
import "./header.css";
import ShowDate from "../ui-components/show-date";

const Header = () => {
  const t = useTranslations("header");
  return (
    <div className="dashboard-header">
      <div className="dashboard-header__container">
        <div className="dashboard-header__logo">
          <LayoutDashboard size={36} />
          <h1 className="dashboard-header__title">{t("title")}</h1>
        </div>
        <div className="dashboard-header__info">
          <ShowDate />
          <LocaleSwitcher />
        </div>
      </div>
    </div>
  );
};

export default Header;
