"use client";

import React, { useCallback } from "react";
import { X } from "lucide-react";
import AppInput from "@/components/ui-components/app-input";
import AppButton from "@/components/ui-components/app-button";
import { useFormState } from "@/hooks/useForm";
import { CreateProductDto, CreateProductModalProps } from "@/interfaces";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/store";
import { createProduct } from "@/store/slices/product-slice";
import { ErrorContainer } from "@/components/ui-components/error-container";
import "./create-product-modal.css";

const CreateProductModal: React.FC<CreateProductModalProps> = ({
  isOpen,
  onClose,
}) => {
  const initialFormData = {
    serialNumber: "",
    title: "",
    type: "",
    priceUSD: "",
    priceUAH: "",
    specification: "",

    isNew: "true",
    photo: "",
    guaranteeStart: "",
    guaranteeEnd: "",
    description: "",
  };

  const requiredFields = [
    "serialNumber",
    "title",
    "type",
    "priceUSD",
    "priceUAH",
  ];

  const {
    formData,
    handleChange,
    resetForm,
    inputStatus,
    formErrors,
    isFormValid,
  } = useFormState(initialFormData, requiredFields);

  const dispatch = useAppDispatch();

  const t = useTranslations("dashboard.createProductModal");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const productData: CreateProductDto = {
          serialNumber: parseInt(formData.serialNumber || "0"),
          title: formData.title || "",
          type: formData.type || "",
          price: [
            {
              value: parseFloat(formData.priceUSD || "0"),
              symbol: "USD",
              isDefault: true,
            },
            {
              value: parseFloat(formData.priceUAH || "0"),
              symbol: "UAH",
              isDefault: false,
            },
          ],

          isNew: formData.isNew === "true",
          photo: formData.photo || undefined,
          specification: formData.specification || undefined,
          guarantee:
            formData.guaranteeStart && formData.guaranteeEnd
              ? {
                  start: formData.guaranteeStart,
                  end: formData.guaranteeEnd,
                }
              : undefined,
        };

        const result = await dispatch(createProduct(productData)).unwrap();
        if (result) {
          resetForm();
          onClose();
        }
      } catch (error: unknown) {
        console.error("Create product failed:", error);
      }
    },
    [dispatch, formData, resetForm, onClose]
  );

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`create-product-modal__backdrop ${
          isOpen ? "create-product-modal__backdrop--visible" : ""
        }`}
        onClick={onClose}
      ></div>

      <div
        className={`create-product-modal ${
          isOpen
            ? "create-product-modal--open animate__animated animate__slideInRight"
            : ""
        }`}
      >
        <div className="create-product-modal__error-container">
          <ErrorContainer />
        </div>

        <div className="create-product-modal__content">
          {/* Header */}
          <div
            className={`create-product-modal__header ${
              isOpen
                ? "animate__animated animate__fadeInDown animate__delay-200ms"
                : ""
            }`}
          >
            <h2 className="create-product-modal__title">{t("title")}</h2>
            <button onClick={onClose} className="create-product-modal__close">
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="create-product-modal__form">
            {/* Серийный номер */}
            <div
              className={`create-product-modal__field ${
                isOpen
                  ? "animate__animated animate__fadeInLeft animate__delay-300ms"
                  : ""
              }`}
            >
              <AppInput
                label={t("serialNumber")}
                type="number"
                id="serialNumber"
                name="serialNumber"
                value={formData.serialNumber || ""}
                onChange={handleChange}
                placeholder={t("serialNumberPlaceholder")}
                className=""
                required={true}
                inputStatus={inputStatus.serialNumber || "default"}
              />
              {formErrors.serialNumber && (
                <p className="create-product-modal__error">
                  {formErrors.serialNumber}
                </p>
              )}
            </div>

            {/* Название продукта */}
            <div
              className={`create-product-modal__field ${
                isOpen
                  ? "animate__animated animate__fadeInLeft animate__delay-400ms"
                  : ""
              }`}
            >
              <label htmlFor="title" className="create-product-modal__label">
                {t("name")} *
              </label>
              <AppInput
                type="text"
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                placeholder={t("namePlaceholder")}
                className=""
                required={true}
                inputStatus={inputStatus.title || "default"}
              />
              {formErrors.title && (
                <p className="create-product-modal__error">
                  {formErrors.title}
                </p>
              )}
            </div>

            {/* Тип продукта */}
            <div
              className={`create-product-modal__field ${
                isOpen
                  ? "animate__animated animate__fadeInLeft animate__delay-500ms"
                  : ""
              }`}
            >
              <label htmlFor="type" className="create-product-modal__label">
                {t("type")} *
              </label>
              <AppInput
                type="text"
                id="type"
                name="type"
                value={formData.type || ""}
                onChange={handleChange}
                placeholder={t("typePlaceholder")}
                className=""
                required={true}
                inputStatus={inputStatus.type || "default"}
              />
              {formErrors.type && (
                <p className="create-product-modal__error">{formErrors.type}</p>
              )}
            </div>

            {/* Цены */}
            <div
              className={`create-product-modal__grid ${
                isOpen
                  ? "animate__animated animate__fadeInLeft animate__delay-600ms"
                  : ""
              }`}
            >
              <div className="create-product-modal__field">
                <label
                  htmlFor="priceUSD"
                  className="create-product-modal__label"
                >
                  {t("priceUSD")} *
                </label>
                <AppInput
                  type="number"
                  id="priceUSD"
                  name="priceUSD"
                  value={formData.priceUSD || ""}
                  onChange={handleChange}
                  placeholder={t("priceUSDPlaceholder")}
                  className=""
                  required={true}
                  inputStatus={inputStatus.priceUSD || "default"}
                />
                {formErrors.priceUSD && (
                  <p className="create-product-modal__error">
                    {formErrors.priceUSD}
                  </p>
                )}
              </div>

              <div className="create-product-modal__field">
                <label
                  htmlFor="priceUAH"
                  className="create-product-modal__label"
                >
                  {t("priceUAH")} *
                </label>
                <AppInput
                  type="number"
                  id="priceUAH"
                  name="priceUAH"
                  value={formData.priceUAH || ""}
                  onChange={handleChange}
                  placeholder={t("priceUAHPlaceholder")}
                  className=""
                  required={true}
                  inputStatus={inputStatus.priceUAH || "default"}
                />
                {formErrors.priceUAH && (
                  <p className="create-product-modal__error">
                    {formErrors.priceUAH}
                  </p>
                )}
              </div>
            </div>

            {/* Спецификация */}
            <div
              className={`create-product-modal__field ${
                isOpen
                  ? "animate__animated animate__fadeInLeft animate__delay-700ms"
                  : ""
              }`}
            >
              <label
                htmlFor="specification"
                className="create-product-modal__label"
              >
                {t("specification")}
              </label>
              <textarea
                id="specification"
                name="specification"
                value={formData.specification || ""}
                onChange={handleChange}
                placeholder="Введите спецификацию продукта"
                rows={3}
                className={`create-product-modal__textarea ${
                  inputStatus.specification === "error"
                    ? "create-product-modal__textarea--error"
                    : inputStatus.specification === "success"
                    ? "create-product-modal__textarea--success"
                    : ""
                }`}
              />
              {formErrors.specification && (
                <p className="create-product-modal__error">
                  {formErrors.specification}
                </p>
              )}
            </div>

            {/* Гарантия */}
            <div
              className={`create-product-modal__grid ${
                isOpen
                  ? "animate__animated animate__fadeInLeft animate__delay-800ms"
                  : ""
              }`}
            >
              <div className="create-product-modal__field">
                <label
                  htmlFor="guaranteeStart"
                  className="create-product-modal__label"
                >
                  {t("guaranteeStart")}
                </label>
                <AppInput
                  type="date"
                  id="guaranteeStart"
                  name="guaranteeStart"
                  value={formData.guaranteeStart || ""}
                  onChange={handleChange}
                  placeholder=""
                  className=""
                  inputStatus={inputStatus.guaranteeStart || "default"}
                />
              </div>

              <div className="create-product-modal__field">
                <label
                  htmlFor="guaranteeEnd"
                  className="create-product-modal__label"
                >
                  {t("guaranteeEnd")}
                </label>
                <AppInput
                  type="date"
                  id="guaranteeEnd"
                  name="guaranteeEnd"
                  value={formData.guaranteeEnd || ""}
                  onChange={handleChange}
                  placeholder=""
                  className=""
                  inputStatus={inputStatus.guaranteeEnd || "default"}
                />
              </div>
            </div>

            {/* Фото */}
            <div
              className={`create-product-modal__field ${
                isOpen
                  ? "animate__animated animate__fadeInLeft animate__delay-900ms"
                  : ""
              }`}
            >
              <label htmlFor="photo" className="create-product-modal__label">
                {t("photo")}
              </label>
              <AppInput
                type="url"
                id="photo"
                name="photo"
                value={formData.photo || ""}
                onChange={handleChange}
                placeholder="Введите URL фото"
                className=""
                inputStatus={inputStatus.photo || "default"}
              />
              {formErrors.photo && (
                <p className="create-product-modal__error">
                  {formErrors.photo}
                </p>
              )}
            </div>

            {/* Новый продукт */}
            <div
              className={`create-product-modal__checkbox-container ${
                isOpen
                  ? "animate__animated animate__fadeInLeft animate__delay-1000ms"
                  : ""
              }`}
            >
              <input
                type="checkbox"
                id="isNew"
                name="isNew"
                checked={formData.isNew === "true"}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "isNew",
                      value: e.target.checked.toString(),
                    },
                  })
                }
                className="create-product-modal__checkbox"
              />
              <label
                htmlFor="isNew"
                className="create-product-modal__checkbox-label"
              >
                {t("isNew")}
              </label>
            </div>

            {/* Buttons */}
            <div
              className={`create-product-modal__footer ${
                isOpen
                  ? "animate__animated animate__fadeInUp animate__delay-1100ms"
                  : ""
              }`}
            >
              <AppButton
                type="button"
                onClick={onClose}
                isFormValid={true}
                className="create-product-modal__btn create-product-modal__btn--secondary"
                title={t("cancel")}
              />
              <AppButton
                type="submit"
                isFormValid={isFormValid}
                className="create-product-modal__btn create-product-modal__btn--primary"
                title={t("create")}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateProductModal;
