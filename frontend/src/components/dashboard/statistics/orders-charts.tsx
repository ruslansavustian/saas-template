"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { Order } from "@/interfaces";
import { useTranslations, useLocale } from "next-intl";

import useFormatters from "@/utils/formaters";
import "./orders-charts.css";

interface OrdersChartsProps {
  orders: Order[];
}

const OrdersCharts: React.FC<OrdersChartsProps> = ({ orders }) => {
  const t = useTranslations("dashboard.statisticsPage");
  const { formatDate } = useFormatters();
  const locale = useLocale();
  const chartData = useMemo(() => {
    // Фильтруем заказы за последний месяц
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.date);
      return orderDate >= oneMonthAgo;
    });

    const ordersByDate = new Map<
      string,
      {
        date: string;
        orders: number;
        totalUSD: number;
        totalUAH: number;
        products: number;
      }
    >();

    const productsByType = new Map<string, number>();

    filteredOrders.forEach((order) => {
      const date = new Date(order.date).toISOString().split("T")[0];

      if (!ordersByDate.has(date)) {
        ordersByDate.set(date, {
          date: formatDate(date, locale),
          orders: 0,
          totalUSD: 0,
          totalUAH: 0,
          products: 0,
        });
      }

      const dayData = ordersByDate.get(date)!;
      dayData.orders += 1;
      dayData.products += order.products?.length || 0;

      if (order.products) {
        order.products.forEach((product) => {
          const usdPrice = product.price?.find((p) => p.symbol === "USD");
          const uahPrice = product.price?.find((p) => p.symbol === "UAH");

          if (usdPrice) dayData.totalUSD += usdPrice.value;
          if (uahPrice) dayData.totalUAH += uahPrice.value;

          const type = product.type || "Unknown";
          productsByType.set(type, (productsByType.get(type) || 0) + 1);
        });
      }
    });

    const sortedDates = Array.from(ordersByDate.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const pieData = Array.from(productsByType.entries()).map(
      ([type, count]) => ({
        name: type,
        value: count,
      })
    );

    return {
      ordersByDate: sortedDates,
      productsByType: pieData,
      stats: {
        totalOrders: filteredOrders.length,
        totalProducts: filteredOrders.reduce(
          (total, order) => total + (order.products?.length || 0),
          0
        ),
        totalUSD: Array.from(ordersByDate.values()).reduce(
          (sum, day) => sum + day.totalUSD,
          0
        ),
        totalUAH: Array.from(ordersByDate.values()).reduce(
          (sum, day) => sum + day.totalUAH,
          0
        ),
      },
    };
  }, [orders, formatDate, locale]);

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];

  return (
    <div className="orders-charts">
      <div className="orders-charts__header mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          {t("ordersAnalytics")}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Статистика за последний месяц
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h4 className="text-lg font-medium text-gray-700 mb-4">
            {t("ordersByDate")}
          </h4>
          <ResponsiveContainer width="100%" height={600}>
            <BarChart data={chartData.ordersByDate} height={600}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* График сумм */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h4 className="text-lg font-medium text-gray-700 mb-4">
            {t("orderSums")}
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.ordersByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="totalUSD"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.ordersByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#2563eb",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="totalUAH"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart по типам */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h4 className="text-lg font-medium text-gray-700 mb-4">
            {t("productTypes")}
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.productsByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) => {
                  const { name, percent } = props;
                  return `${name} ${(percent * 100).toFixed(0)}%`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.productsByType.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Статистика */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
          <h4 className="text-lg font-medium text-gray-700 mb-4">
            {t("statistics")}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {chartData.stats.totalOrders}
              </div>
              <div className="text-sm text-gray-600">{t("totalOrders")}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {chartData.stats.totalProducts}
              </div>
              <div className="text-sm text-gray-600">{t("totalProducts")}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                ${chartData.stats.totalUSD.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">{t("totalUSD")}</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                ₴{chartData.stats.totalUAH.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">{t("totalUAH")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersCharts;
