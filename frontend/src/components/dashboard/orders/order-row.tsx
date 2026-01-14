import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { OrderRowProps } from "@/interfaces";
import useFormatters from "@/utils/formaters";

import "./order-table.css";

const OrderRow = ({
  order,
  isSelected,
  onView,
  onDelete,
  totals,
  selectedOrderId,
}: OrderRowProps) => {
  const { formatDate } = useFormatters();
  const locale = useLocale();
  const t = useTranslations("dashboard.orderTable");
  return (
    <tr
      key={order.id}
      className={`order-table__row ${
        isSelected ? "order-table__row--selected" : ""
      }`}
      onClick={() => onView(order)}
    >
      <td className="order-table__cell">
        <div className="order-table__cell-content">
          <div className="order-table__cell-main">
            <div className="order-table__cell-title">{order.title}</div>
            {order.description && !selectedOrderId && (
              <small className="order-table__cell-description">
                {order.description}
              </small>
            )}
            {selectedOrderId && (
              <small className="order-table__cell-count">
                {order.products?.length || 0} {t("products")}
              </small>
            )}
          </div>
          {isSelected && (
            <i className="bi bi-chevron-right text-primary ms-2"></i>
          )}
        </div>
      </td>
      {!selectedOrderId && (
        <>
          <td className="order-table__cell">
            <span className="order-table__badge">
              {order.products?.length || 0}
            </span>
          </td>
          <td className="order-table__cell">
            <div className="order-table__amount">
              ${totals.totalUSD.toFixed(2)}
            </div>
            <small className="order-table__amount-secondary">
              ₴{totals.totalUAH.toFixed(2)}
            </small>
          </td>
        </>
      )}
      <td className="order-table__cell">
        <small className="order-table__date">
          {formatDate(order.date, locale)}
        </small>
      </td>
      <td className="order-table__cell order-table__actions">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(order.id.toString());
          }}
          className="order-table__btn order-table__btn--danger"
          title={t("delete")}
        >
          <i className="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
};

export default OrderRow;
