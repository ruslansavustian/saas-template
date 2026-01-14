"use client";
import Header from "@/components/dashboard/header";
import NavigationMenu from "@/components/dashboard/navigation-menu";
import { withAuth } from "@/hoc/with-auth";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 flex flex-col bg-white">
      <Header />
      <div className="flex flex-1">
        <NavigationMenu />
        {children}
      </div>
    </div>
  );
};

export default withAuth(DashboardLayout);
