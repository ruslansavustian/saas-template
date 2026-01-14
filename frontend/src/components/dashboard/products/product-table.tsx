"use client";

import React, { useMemo } from "react";

import { ProductTableProps } from "@/interfaces";
import { useTranslations } from "next-intl";

import useFormatters from "@/utils/formaters";
import "./product-table.css";
import { useLocale } from "next-intl";
import { ProductRow } from "./product-row";

const ProductTable = ({
  products,
  onEdit,
  onDelete,
  loading = false,
}: ProductTableProps) => {
  const t = useTranslations("dashboard.productTable");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { formatPrice, formatDate, formatDateShort, formatGuaranteeDates } =
    useFormatters();

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const itemData = useMemo(
    () => ({
      products: currentProducts,
      onEdit,
      onDelete,
      t,
      formatPrice,
      formatDate,
      formatDateShort,
      formatGuaranteeDates,
      locale,
    }),
    [
      currentProducts,
      onEdit,
      onDelete,
      t,
      formatPrice,
      formatDate,
      formatDateShort,
      formatGuaranteeDates,
      locale,
    ]
  );

  if (loading) {
    return (
      <div className="product-table__loading">
        <div className="product-table__spinner"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-table__empty">
        <div className="product-table__empty-title">{t("noProducts")}</div>
        <div className="product-table__empty-subtitle">{t("createFirst")}</div>
      </div>
    );
  }

  return (
    <div className="product-table">
      <div className="product-table__container">
        <div className="product-table__header">
          <div className="product-table__header-row">
            <div className="product-table__header-cell ">{t("product")}</div>
            <div className="product-table__header-cell">{t("type")}</div>
            <div className="product-table__header-cell">{t("guarantee")}</div>
            <div className="product-table__header-cell">{t("price")}</div>
            <div className="product-table__header-cell">{t("status")}</div>
            <div className="product-table__header-cell">{t("order")}</div>
          </div>
        </div>

        <div className="product-table__body">
          {currentProducts.map((product, index) => (
            <ProductRow
              key={product.id}
              index={index}
              style={{}}
              data={itemData}
            />
          ))}
        </div>
        <div className="flex justify-center w-full mb-4">
          {totalPages > 1 && (
            <div className="product-table__pagination">
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
    </div>
  );
};

export default ProductTable;
