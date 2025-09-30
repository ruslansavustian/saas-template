import React from "react";
import Image from "next/image";

export const ProductRow: React.FC<{
  index: number;
  style: React.CSSProperties;
  data: {
    products: any[];
    onEdit?: (product: any) => void;
    onDelete?: (id: number) => void;
    t: any;
    formatPrice: any;
    formatDate: any;
    formatDateShort: any;
    formatGuaranteeDates: any;
    locale: string;
  };
}> = ({ index, style, data }) => {
  const {
    products,
    t,
    formatPrice,
    formatDateShort,
    formatGuaranteeDates,
    locale,
  } = data;
  const product = products[index];

  return (
    <div style={style} className="product-table__virtual-row">
      <div className="product-table__row">
        <div className="product-table__cell product-table__cell--first">
          <div className="product-table__product">
            <div className="product-table__product-image">
              {product.photo && (
                <Image
                  src={product.photo}
                  alt={product.title}
                  width={40}
                  height={40}
                />
              )}
            </div>
            <div className="product-table__product-info">
              <div className="product-table__product-title">
                {product.title}
              </div>
              <div className="product-table__product-serial">
                #{product.serialNumber}
              </div>
            </div>
          </div>
        </div>
        <div className="product-table__cell">
          <span className="product-table__type-badge">{product.type}</span>
        </div>
        <div className="product-table__cell">
          <div className="product-table__guarantee">
            {formatGuaranteeDates(product.guarantee, locale)}
          </div>
          {product.guarantee && (
            <div className="product-table__guarantee-dates">
              {formatDateShort(product.guarantee.start, locale)} -{" "}
              {formatDateShort(product.guarantee.end, locale)}
            </div>
          )}
        </div>
        <div className="product-table__cell">
          <div className="product-table__price">
            {formatPrice(product.price)}
          </div>
        </div>
        <div className="product-table__cell">
          <span
            className={`product-table__status-badge ${
              product.isNew
                ? "product-table__status-badge--new"
                : "product-table__status-badge--used"
            }`}
          >
            {product.isNew ? t("new") : t("used")}
          </span>
        </div>
        <div className="product-table__cell">
          {product.order ? (
            <div className="product-table__order-info">
              <div className="product-table__order-title">
                {product.order.title}
              </div>
              <div className="product-table__order-id">
                ID: {product.order.id}
              </div>
            </div>
          ) : (
            <span className="product-table__order-empty">{t("notLinked")}</span>
          )}
        </div>
      </div>
    </div>
  );
};
