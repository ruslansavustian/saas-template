"use client";

import { redirect } from "next/navigation";
import { paths } from "@/constants/paths";

const DashboardPage = () => {
  redirect(paths.orders);
};

export default DashboardPage;
