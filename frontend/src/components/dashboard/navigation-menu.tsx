"use client";
import { useTranslations } from "next-intl";
import React from "react";
import { paths } from "@/constants/paths";

import { usePathname, useRouter } from "next/navigation";
import { User } from "lucide-react";
import "./navigation-menu.css";

interface NavigationSlotProps {
  title: string;
  href: string;
  onClick: () => void;
}

const NavigationMenu = () => {
  const router = useRouter();
  const t = useTranslations("dashboard");

  const NavigationSlot = ({
    title,
    href,

    onClick,
  }: NavigationSlotProps) => {
    const handleClick = () => {
      onClick();
    };
    const pathname = usePathname();
    const selected = pathname.includes(href);

    return (
      <div
        onClick={handleClick}
        className={`navigation-menu__item ${
          selected ? "navigation-menu__item--active" : ""
        }`}
      >
        <div className="navigation-menu__item-title">{title}</div>
        <div className="navigation-menu__item-indicator">
          <div className="navigation-menu__item-progress" />
        </div>
      </div>
    );
  };

  return (
    <div className="navigation-menu">
      <div className="navigation-menu__user">
        <User size={48} className="text-white" />
      </div>
      <div className="navigation-menu__menu">
        <NavigationSlot
          title={t("orders")}
          href={paths.orders}
          onClick={() => router.push(paths.orders)}
        />

        <NavigationSlot
          title={t("products")}
          href={paths.products}
          onClick={() => router.push(paths.products)}
        />

        <NavigationSlot
          title={t("settings")}
          href={paths.settings}
          onClick={() => router.push(paths.settings)}
        />
        {/* <NavigationSlot
          title={t("users")}
          href={paths.users}
          onClick={() => router.push(paths.users)}
        /> */}
        <NavigationSlot
          title={t("statistics")}
          href={paths.statistics}
          onClick={() => router.push(paths.statistics)}
        />
        <NavigationSlot
          title={t("servicePointsPage.navgiationName")}
          href={paths.servicePoints}
          onClick={() => router.push(paths.servicePoints)}
        />
      </div>
    </div>
  );
};

export default NavigationMenu;
