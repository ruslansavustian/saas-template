"use client";

import React, { useCallback, useState, useMemo } from "react";
import { useFormState } from "@/hooks/useForm";
import { CreateOrderDto, CreateOrderModalProps } from "@/interfaces";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/store";
import { createOrder, fetchOrders } from "@/store/slices/order-slice";
import AppInput from "@/components/ui-components/app-input";
import AppButton from "@/components/ui-components/app-button";
import "./create-order-modal.css";

interface ReceiptProduct {
  serialNumber: string;
  title: string;
  type: string;
  specification?: string;
  isNew: boolean;
  photo?: string;
  guarantee?: {
    start: string;
    end: string;
  };
  price: Array<{
    value: number;
    symbol: string;
    isDefault: boolean;
  }>;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const initialFormData = {
    title: "",
    description: "",
    orderDate: new Date().toISOString().split("T")[0],
  };

  const requiredFields = ["title", "orderDate"];

  const { formData, handleChange, resetForm, isFormValid } = useFormState(
    initialFormData,
    requiredFields
  );

  const [receiptProducts, setReceiptProducts] = useState<ReceiptProduct[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = useTranslations("dashboard.createOrderModal");
  const dispatch = useAppDispatch();

  const newProductTemplate: ReceiptProduct = useMemo(
    () => ({
      serialNumber: "",
      title: "",
      type: "",
      specification: "",
      isNew: true,
      photo: "",
      guarantee: {
        start: "",
        end: "",
      },
      price: [
        { value: 0, symbol: "USD", isDefault: false },
        { value: 0, symbol: "UAH", isDefault: true },
      ],
    }),
    []
  );

  const addProduct = useCallback(() => {
    setReceiptProducts((prev) => [...prev, { ...newProductTemplate }]);
  }, [newProductTemplate]);

  const updateProduct = useCallback(
    (index: number, field: keyof ReceiptProduct, value: any) => {
      setReceiptProducts((prev) =>
        prev.map((product, i) =>
          i === index ? { ...product, [field]: value } : product
        )
      );
    },
    []
  );

  const removeProduct = useCallback((index: number) => {
    setReceiptProducts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const areProductsValid = useMemo(() => {
    if (receiptProducts.length === 0) return false;

    return receiptProducts.every(
      (product) =>
        product.serialNumber.toString().trim() !== "" &&
        product.title.trim() !== "" &&
        product.type.trim() !== "" &&
        product.price.some((p) => p.value > 0) &&
        product.guarantee?.start &&
        product.guarantee?.end &&
        product.specification?.trim() !== ""
    );
  }, [receiptProducts]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!isFormValid || receiptProducts.length === 0 || !areProductsValid) {
        return;
      }

      setIsSubmitting(true);

      try {
        const orderData: CreateOrderDto = {
          title: formData.title ?? "",
          description: (formData.description || "") as string,
          products: receiptProducts.map((product) => ({
            serialNumber: product.serialNumber,
            title: product.title,
            type: product.type,
            specification: product.specification,
            isNew: product.isNew,
            photo: product.photo,
            guarantee: product.guarantee,
            price: product.price,
          })),
        };

        await dispatch(createOrder(orderData)).unwrap();
        resetForm();
        setReceiptProducts([]);
        onClose();
        dispatch(fetchOrders());
      } catch (error: any) {
        console.error("Error creating order:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isFormValid,
      receiptProducts,
      areProductsValid,
      formData,
      dispatch,
      resetForm,
      onClose,
    ]
  );

  const totalAmounts = useMemo(() => {
    return receiptProducts.reduce(
      (totals, product) => {
        const usdPrice = product.price.find((p) => p.symbol === "USD");
        const uahPrice = product.price.find((p) => p.symbol === "UAH");
        return {
          totalUSD: totals.totalUSD + (usdPrice?.value || 0),
          totalUAH: totals.totalUAH + (uahPrice?.value || 0),
        };
      },
      { totalUSD: 0, totalUAH: 0 }
    );
  }, [receiptProducts]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`create-order-modal__backdrop ${
          isOpen ? "create-order-modal__backdrop--visible" : ""
        }`}
        onClick={onClose}
      ></div>

      <div
        className={`create-order-modal ${
          isOpen ? "create-order-modal--open" : ""
        }`}
        id="createOrderModal"
        tabIndex={-1}
        aria-labelledby="createOrderModalLabel"
        aria-hidden="false"
      >
        <div className="create-order-modal__dialog">
          <div className="create-order-modal__content">
            {/* Header */}
            <div
              className={`create-order-modal__header ${
                isOpen
                  ? "animate__animated animate__fadeInDown animate__delay-200ms"
                  : ""
              }`}
            >
              <h5
                className="create-order-modal__title"
                id="createOrderModalLabel"
              >
                <i className="bi bi-receipt me-2"></i>
                {t("title")}
              </h5>
              <button
                type="button"
                className="create-order-modal__close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            <div className="create-order-modal__body">
              <div className="create-order-modal__form">
                <div
                  className={`create-order-modal__form-row ${
                    isOpen
                      ? "animate__animated animate__fadeInLeft animate__delay-300ms"
                      : ""
                  }`}
                >
                  <div className="create-order-modal__field">
                    <AppInput
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title || ""}
                      onChange={handleChange}
                      placeholder={t("orderTitlePlaceholder")}
                      label={`${t("orderTitle")} *`}
                      className="form-control"
                      required
                      inputStatus="default"
                    />
                  </div>

                  <div className="create-order-modal__field">
                    <AppInput
                      type="text"
                      id="description"
                      name="description"
                      value={formData.description || ""}
                      onChange={handleChange}
                      placeholder={t("descriptionPlaceholder")}
                      label={t("description")}
                      className="form-control"
                      inputStatus="default"
                    />
                  </div>

                  <div className="create-order-modal__field">
                    <AppInput
                      type="date"
                      id="orderDate"
                      name="orderDate"
                      value={
                        formData.orderDate ||
                        new Date().toISOString().split("T")[0]
                      }
                      onChange={handleChange}
                      label={`${t("orderDate")} *`}
                      className="form-control"
                      required
                      inputStatus="default"
                    />
                  </div>
                </div>

                <div
                  className={`create-order-modal__products-section ${
                    isOpen
                      ? "animate__animated animate__fadeInLeft animate__delay-400ms"
                      : ""
                  }`}
                >
                  <div className="create-order-modal__products-header">
                    <h6 className="create-order-modal__products-title">
                      <i className="bi bi-box-seam me-2"></i>
                      {t("products")} ({receiptProducts.length})
                    </h6>
                    <button
                      type="button"
                      className="create-order-modal__add-btn"
                      onClick={addProduct}
                    >
                      <i className="bi bi-plus-circle me-1"></i>
                      {t("addProduct")}
                    </button>
                  </div>

                  {receiptProducts.length === 0 ? (
                    <div className="create-order-modal__empty-state">
                      <i className="bi bi-inbox create-order-modal__empty-icon"></i>
                      <p className="create-order-modal__empty-text">
                        {t("addProduct")}
                      </p>
                      <div className="create-order-modal__warning">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {t("addAtleastOneProduct")}
                      </div>
                    </div>
                  ) : (
                    <div className="create-order-modal__products-grid">
                      {receiptProducts.map((product, index) => (
                        <ProductCard
                          key={`product-${index}`}
                          product={product}
                          index={index}
                          updateProduct={updateProduct}
                          removeProduct={removeProduct}
                          t={t}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Total Amount */}
                {receiptProducts.length > 0 && (
                  <div
                    className={`create-order-modal__total-card ${
                      isOpen
                        ? "animate__animated animate__fadeInUp animate__delay-500ms"
                        : ""
                    }`}
                  >
                    <h6 className="create-order-modal__total-title">
                      <i className="bi bi-calculator me-2"></i>
                      {t("totalAmount")}:
                    </h6>
                    <div className="create-order-modal__total-grid">
                      <div>
                        <div className="create-order-modal__total-amount create-order-modal__total-amount--usd">
                          ${totalAmounts.totalUSD.toFixed(2)}
                        </div>
                        <small className="create-order-modal__total-label">
                          USD
                        </small>
                      </div>
                      <div>
                        <div className="create-order-modal__total-amount create-order-modal__total-amount--uah">
                          ₴{totalAmounts.totalUAH.toFixed(2)}
                        </div>
                        <small className="create-order-modal__total-label">
                          UAH
                        </small>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div
              className={`create-order-modal__footer ${
                isOpen
                  ? "animate__animated animate__fadeInUp animate__delay-600ms"
                  : ""
              }`}
            >
              <AppButton
                type="button"
                isFormValid={true}
                title={t("cancel")}
                className="create-order-modal__btn create-order-modal__btn--secondary"
                onClick={onClose}
              />
              <AppButton
                type="button"
                isFormValid={
                  isFormValid ||
                  receiptProducts.length === 0 ||
                  !areProductsValid ||
                  isSubmitting
                }
                className={`create-order-modal__btn ${
                  !isFormValid ||
                  receiptProducts.length === 0 ||
                  !areProductsValid ||
                  isSubmitting
                    ? "create-order-modal__btn--disabled"
                    : "create-order-modal__btn--primary"
                }`}
                onClick={handleSubmit}
                title={isSubmitting ? t("creating") : t("create")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Отдельный компонент для карточки товара
const ProductCard = React.memo(
  ({
    product,
    index,
    updateProduct,
    removeProduct,
    t,
  }: {
    product: ReceiptProduct;
    index: number;
    updateProduct: (
      index: number,
      field: keyof ReceiptProduct,
      value: any
    ) => void;
    removeProduct: (index: number) => void;
    t: any;
  }) => (
    <div className="create-order-modal__product-card">
      {/* Remove Button - Top Right Corner */}
      <button
        type="button"
        className="create-order-modal__remove-btn"
        onClick={() => removeProduct(index)}
      >
        <i className="bi bi-trash"></i>
      </button>

      <div className="create-order-modal__product-form">
        <div className="create-order-modal__field">
          <AppInput
            type="text"
            id={`serialNumber-${index}`}
            name="serialNumber"
            value={product.serialNumber}
            onChange={(e) =>
              updateProduct(index, "serialNumber", e.target.value)
            }
            label={`${t("serialNumber")} *`}
            className="form-control form-control-sm"
            required
            inputStatus="default"
          />
        </div>

        <div className="create-order-modal__field">
          <AppInput
            type="text"
            id={`title-${index}`}
            name="title"
            value={product.title}
            onChange={(e) => updateProduct(index, "title", e.target.value)}
            label={`${t("name")} *`}
            className="form-control form-control-sm"
            required
            inputStatus="default"
          />
        </div>

        <div className="create-order-modal__field">
          <AppInput
            type="text"
            id={`type-${index}`}
            name="type"
            value={product.type}
            onChange={(e) => updateProduct(index, "type", e.target.value)}
            label={`${t("type")} *`}
            className="form-control form-control-sm"
            required
            inputStatus="default"
          />
        </div>

        <div className="create-order-modal__field">
          <div className="form-check h-1">
            <AppInput
              type="checkbox"
              id={`isNew-${index}`}
              name="isNew"
              className="form-check-input"
              value={product.isNew.toString()}
              onChange={(e) => updateProduct(index, "isNew", e.target.value)}
              label={t("isNew")}
              required
              inputStatus="default"
            />
          </div>
        </div>

        {/* Price USD */}
        <div className="create-order-modal__field">
          <AppInput
            type="number"
            id={`priceUSD-${index}`}
            name="priceUSD"
            value={String(
              product.price.find((p) => p.symbol === "USD")?.value || 0
            )}
            onChange={(e) => {
              const usdPrice = product.price.find((p) => p.symbol === "USD");
              if (usdPrice) {
                updateProduct(index, "price", [
                  ...product.price.filter((p) => p.symbol !== "USD"),
                  {
                    ...usdPrice,
                    value: parseFloat(e.target.value) || 0,
                  },
                ]);
              }
            }}
            label={t("priceUSD")}
            className="form-control form-control-sm"
            inputStatus="default"
          />
        </div>

        {/* Price UAH */}
        <div className="create-order-modal__field">
          <AppInput
            type="number"
            id={`priceUAH-${index}`}
            name="priceUAH"
            value={String(
              product.price.find((p) => p.symbol === "UAH")?.value || 0
            )}
            onChange={(e) => {
              const uahPrice = product.price.find((p) => p.symbol === "UAH");
              if (uahPrice) {
                updateProduct(index, "price", [
                  ...product.price.filter((p) => p.symbol !== "UAH"),
                  {
                    ...uahPrice,
                    value: parseFloat(e.target.value) || 0,
                  },
                ]);
              }
            }}
            label={t("priceUAH")}
            className="form-control form-control-sm"
            inputStatus="default"
          />
        </div>

        {/* Guarantee Dates */}
        <div className="create-order-modal__field">
          <div className="create-order-modal__product-actions">
            <div>
              <AppInput
                type="date"
                id={`guaranteeStart-${index}`}
                name="guaranteeStart"
                value={product.guarantee?.start || ""}
                onChange={(e) => {
                  const guarantee = product.guarantee || {
                    start: "",
                    end: "",
                  };
                  updateProduct(index, "guarantee", {
                    ...guarantee,
                    start: e.target.value,
                  });
                }}
                label={t("guaranteeStart")}
                className="form-control form-control-sm"
                inputStatus="default"
              />
            </div>
            <div>
              <AppInput
                type="date"
                id={`guaranteeEnd-${index}`}
                name="guaranteeEnd"
                value={product.guarantee?.end || ""}
                onChange={(e) => {
                  const guarantee = product.guarantee || {
                    start: "",
                    end: "",
                  };
                  updateProduct(index, "guarantee", {
                    ...guarantee,
                    end: e.target.value,
                  });
                }}
                label={t("guaranteeEnd")}
                className="form-control form-control-sm"
                inputStatus="default"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Specification and Photo */}
      <div className="create-order-modal__product-actions">
        <div className="create-order-modal__field">
          <label className="form-label small">{t("specification")}</label>
          <textarea
            className="form-control form-control-sm"
            rows={2}
            value={product.specification || ""}
            onChange={(e) =>
              updateProduct(index, "specification", e.target.value)
            }
          />
        </div>
        <div className="create-order-modal__field">
          <AppInput
            type="url"
            id={`photo-${index}`}
            name="photo"
            value={product.photo || ""}
            onChange={(e) => updateProduct(index, "photo", e.target.value)}
            label={t("photo")}
            className="form-control form-control-sm"
            inputStatus="default"
          />
        </div>
      </div>
    </div>
  )
);

ProductCard.displayName = "ProductCard";

export default CreateOrderModal;
