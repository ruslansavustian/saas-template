"use client";

import React from "react";
import { X, Calendar, Package, Trash2 } from "lucide-react";
import { Order } from "@/interfaces";
import { useTranslations } from "next-intl";
import "./order-details-panel.css";

interface OrderDetailsPanelProps {
  order: Order | null;
  onClose: () => void;
  onDelete?: (orderId: number) => void;
}

const OrderDetailsPanel: React.FC<OrderDetailsPanelProps> = ({
  order,
  onClose,
  onDelete,
}) => {
  const t = useTranslations("dashboard.receiptTable");

  if (!order) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const totalAmounts = order.products?.reduce(
    (totals, product) => {
      const usdPrice = product.price.find((p) => p.symbol === "USD");
      const uahPrice = product.price.find((p) => p.symbol === "UAH");

      if (usdPrice) {
        totals.totalUSD += usdPrice.value;
      }
      if (uahPrice) {
        totals.totalUAH += uahPrice.value;
      }

      return totals;
    },
    { totalUSD: 0, totalUAH: 0 }
  ) || { totalUSD: 0, totalUAH: 0 };

  return (
    <div>
      {/* Header */}
      <div className="order-details__header">
        <h2 className="order-details__title">{order.title}</h2>
        <div className="order-details__actions">
          {onDelete && (
            <button
              onClick={() => onDelete(order.id)}
              className="order-details__action-btn order-details__action-btn--delete"
              title={t("delete")}
            >
              <Trash2 size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            className="order-details__action-btn order-details__action-btn--close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="order-details__content">
        {/* Основная информация */}
        <div className="order-details__section">
          {order.description && (
            <div>
              <p className="order-details__description">{order.description}</p>
            </div>
          )}

          {/* Даты */}
          <div className="order-details__info-grid">
            <div className="order-details__info-card order-details__info-card--blue">
              <div className="order-details__info-header">
                <Calendar size={16} className="order-details__icon--blue" />
                <span className="order-details__info-title order-details__info-title--blue">
                  {t("orderDate")}
                </span>
              </div>
              <div className="order-details__info-value order-details__info-value--blue">
                {formatDate(order.date)}
              </div>
              <div className="order-details__info-subtitle order-details__info-subtitle--blue">
                {formatDateShort(order.date)}
              </div>
            </div>

            <div className="order-details__info-card order-details__info-card--green">
              <div className="order-details__info-header">
                <Calendar size={16} className="order-details__icon--green" />
                <span className="order-details__info-title order-details__info-title--green">
                  {t("created")}
                </span>
              </div>
              <div className="order-details__info-value order-details__info-value--green">
                {formatDate(order.createdAt)}
              </div>
              <div className="order-details__info-subtitle order-details__info-subtitle--green">
                {formatDateShort(order.createdAt)}
              </div>
            </div>

            <div className="order-details__info-card order-details__info-card--purple">
              <div className="order-details__info-header">
                <Package size={16} className="order-details__icon--purple" />
                <span className="order-details__info-title order-details__info-title--purple">
                  {t("products")}
                </span>
              </div>
              <div className="order-details__info-number order-details__info-value--purple">
                {order.products?.length || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Список товаров */}
        <div>
          <h4 className="order-details__products-title">
            {t("productsInOrder")} ({order.products?.length || 0})
          </h4>

          {order.products && order.products.length > 0 ? (
            <div className="order-details__products-list">
              {order.products.map((product) => {
                const usdPrice = product.price.find((p) => p.symbol === "USD");
                const uahPrice = product.price.find((p) => p.symbol === "UAH");

                return (
                  <div key={product.id} className="order-details__product">
                    <div className="order-details__product-grid">
                      <div className="order-details__product-info">
                        <div className="order-details__product-header">
                          <h5 className="order-details__product-title">
                            {product.title}
                          </h5>
                          <span className="order-details__product-type">
                            {product.type}
                          </span>
                        </div>
                        {product.specification && (
                          <p className="order-details__product-spec">
                            {product.specification}
                          </p>
                        )}
                      </div>
                      <div className="order-details__product-serial">
                        #{product.serialNumber}
                      </div>
                      <div className="order-details__product-condition">
                        {product.isNew ? "Новый" : "Б/У"}
                      </div>
                      <div className="order-details__product-price">
                        <div className="order-details__product-price-usd">
                          ${usdPrice?.value || 0}
                        </div>
                        <div className="order-details__product-price-uah">
                          ₴{uahPrice?.value || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Итого */}
              <div className="order-details__total">
                <div className="order-details__total-row">
                  <span className="order-details__total-label">
                    Итого ({order.products.length} товаров):
                  </span>
                  <div className="order-details__total-amount">
                    <div className="order-details__total-usd">
                      ${totalAmounts.totalUSD.toFixed(2)}
                    </div>
                    <div className="order-details__total-uah">
                      ₴{totalAmounts.totalUAH.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="order-details__empty">
              <Package size={48} className="order-details__empty-icon" />
              <p>В приходе нет товаров</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPanel;
