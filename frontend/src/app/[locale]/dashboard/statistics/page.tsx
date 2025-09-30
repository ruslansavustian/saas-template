"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchOrders,
  selectOrders,
  selectOrdersLoading,
} from "@/store/slices/order-slice";
import {
  fetchProducts,
  selectProducts,
  selectProductsLoading,
} from "@/store/slices/product-slice";
import OrdersCharts from "@/components/dashboard/statistics/orders-charts";
import { Loader } from "lucide-react";

const StatisticsPage = () => {
  const t = useTranslations("dashboard.statisticsPage");

  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const ordersLoading = useAppSelector(selectOrdersLoading);
  const products = useAppSelector(selectProducts);
  const productsLoading = useAppSelector(selectProductsLoading);

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchProducts());
  }, [dispatch]);

  if (ordersLoading || productsLoading) {
    return <Loader />;
  }

  return (
    <div className="p-6 flex-1">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
        <p className="text-gray-600 mt-2">{t("subtitle")}</p>
      </div>

      <OrdersCharts orders={orders} />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {t("generalStats")}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("totalOrders")}:</span>
              <span className="font-semibold text-blue-600">
                {orders.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("totalProducts")}:</span>
              <span className="font-semibold text-green-600">
                {products.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                {t("averageProductsPerOrder")}:
              </span>
              <span className="font-semibold text-purple-600">
                {orders.length > 0
                  ? (
                      orders.reduce(
                        (total, order) => total + (order.products?.length || 0),
                        0
                      ) / orders.length
                    ).toFixed(1)
                  : 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {t("financialStats")}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("totalSumUSD")}:</span>
              <span className="font-semibold text-green-600">
                $
                {orders
                  .reduce((total, order) => {
                    return (
                      total +
                      (order.products?.reduce((sum, product) => {
                        const usdPrice = product.price?.find(
                          (p) => p.symbol === "USD"
                        );
                        return sum + (usdPrice?.value || 0);
                      }, 0) || 0)
                    );
                  }, 0)
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("totalSumUAH")}:</span>
              <span className="font-semibold text-orange-600">
                ₴
                {orders
                  .reduce((total, order) => {
                    return (
                      total +
                      (order.products?.reduce((sum, product) => {
                        const uahPrice = product.price?.find(
                          (p) => p.symbol === "UAH"
                        );
                        return sum + (uahPrice?.value || 0);
                      }, 0) || 0)
                    );
                  }, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {t("recentActivity")}
          </h3>
          <div className="space-y-2">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="text-sm">
                <div className="font-medium text-gray-800">{order.title}</div>
                <div className="text-gray-500">
                  {new Date(order.date).toLocaleDateString("uk-UA")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
