"use client";

import React, { useMemo } from "react";

import { OrderTableProps } from "@/interfaces";
import { useTranslations } from "next-intl";
import "./order-table.css";
import OrderRow from "./order-row";

const OrderTable = ({
  orders,
  onDelete,
  onView,
  selectedOrderId,
  loading,
}: OrderTableProps) => {
  const t = useTranslations("dashboard.orderTable");
  const tCommon = useTranslations("common");

  const calculateTotalAmount = useMemo(
    () => (products: any[]) => {
      let totalUSD = 0;
      let totalUAH = 0;

      products.forEach((product) => {
        const usdPrice = product.price?.find((p: any) => p.symbol === "USD");
        const uahPrice = product.price?.find((p: any) => p.symbol === "UAH");

        if (usdPrice) {
          totalUSD += usdPrice.value;
        }
        if (uahPrice) {
          totalUAH += uahPrice.value;
        }
      });

      return { totalUSD, totalUAH };
    },
    []
  );

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="order-table__loading">
        <div className="order-table__spinner"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="order-table__empty">
        <div className="order-table__empty-title">{t("noOrders")}</div>
        <div className="order-table__empty-subtitle">{t("createFirst")}</div>
      </div>
    );
  }

  return (
    <div className="order-table">
      <div className="order-table__container">
        <table className="order-table__table">
          <thead className="order-table__header">
            <tr>
              <th className="order-table__header-cell">
                <i className="bi bi-receipt me-2"></i>
                {t("orderTitle")}
              </th>
              {!selectedOrderId && (
                <>
                  <th className="order-table__header-cell">
                    <i className="bi bi-box-seam me-2"></i>
                    {t("productsCount")}
                  </th>
                  <th className="order-table__header-cell">
                    <i className="bi bi-currency-dollar me-2"></i>
                    {t("totalAmount")}
                  </th>
                </>
              )}
              <th className="order-table__header-cell">
                <i className="bi bi-calendar me-2"></i>
                {t("date")}
              </th>
              <th className="order-table__header-cell">
                <i className="bi bi-gear me-2"></i>
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => {
              const totals = calculateTotalAmount(order.products || []);
              const isSelected = selectedOrderId === order.id;
              return (
                <OrderRow
                  key={order.id}
                  order={order}
                  isSelected={isSelected}
                  onView={onView!}
                  onDelete={
                    onDelete
                      ? (orderId: string) => onDelete(parseInt(orderId))
                      : undefined
                  }
                  totals={totals}
                  selectedOrderId={selectedOrderId?.toString()}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center w-full mb-4">
        {totalPages > 1 && (
          <div className="order-table__pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn btn-outline-primary btn-sm"
            >
              {tCommon("back")}
            </button>
            <span className="mx-3">
              {tCommon("page")} {currentPage} {tCommon("of")} {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="btn btn-outline-primary btn-sm"
            >
              {tCommon("next")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTable;
