"use client";

import CreateProductModal from "@/components/dashboard/products/modals/create-product-modal";
import ProductTable from "@/components/dashboard/products/product-table";
import AppButton from "@/components/ui-components/app-button";
import { Product } from "@/interfaces";
import { useTranslations } from "next-intl";
import React, { useState, useEffect, useMemo } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchProducts,
  selectProducts,
  selectProductsLoading,
} from "@/store/slices/product-slice";
import SkeletonProductTable from "@/components/ui-components/skeleton-product-table";

const ProductsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("all");

  const t = useTranslations("dashboard");

  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const loading = useAppSelector(selectProductsLoading);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const productTypes = useMemo(() => {
    const types = products.map((product) => product.type);
    return Array.from(new Set(types)).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedType === "all") {
      return products;
    }
    return products.filter((product) => product.type === selectedType);
  }, [products, selectedType]);

  const handleEdit = (product: Product) => {
    console.log("Editing product:", product);
  };

  return (
    <div className="p-6 flex-1">
      <CreateProductModal isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t("products")}</h1>
        <AppButton
          type="button"
          title={t("createProduct")}
          onClick={() => setIsOpen(true)}
          isFormValid={true}
          className="flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors duration-200"
        />
      </div>

      {/* Filter */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label
            htmlFor="type-filter"
            className="text-sm font-medium text-gray-700"
          >
            {t("productTable.filterByType")}:
          </label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">{t("productTable.allTypes")}</option>
            {productTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500 ml-2">
            {t("productTable.showing")}: {filteredProducts.length}{" "}
            {t("productTable.of")} {products.length}
          </span>
        </div>
      </div>

      {loading ? (
        <SkeletonProductTable />
      ) : (
        <ProductTable products={filteredProducts} onEdit={handleEdit} />
      )}
    </div>
  );
};

export default ProductsPage;
