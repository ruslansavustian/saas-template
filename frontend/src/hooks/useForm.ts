import { FormState, InputChangeEvent } from "@/interfaces";
import { useState } from "react";

export type StatusType = "default" | "success" | "error";

export const useFormState = (
  initialData: FormState,
  requiredFields?: string[]
) => {
  const [formData, setFormData] = useState<FormState>(initialData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const initialStatus: Record<string, StatusType> = {};
  Object.keys(initialData).forEach((key) => {
    initialStatus[key] = "default";
  });

  const [inputStatus, setInputStatus] =
    useState<Record<string, StatusType>>(initialStatus);

  const validateField = (name: string, value: string) => {
    let errorMessage = "";
    let isValid = true;

    switch (name) {
      case "email":
        if (!value) {
          errorMessage = "Email обязателен";
          isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMessage = "Введите корректный email";
          isValid = false;
        }
        break;

      case "password":
        if (!value) {
          errorMessage = "Пароль обязателен";
          isValid = false;
        } else if (value.length < 4) {
          errorMessage = "Пароль должен содержать минимум 6 символов";
          isValid = false;
        }
        break;
      case "confirmPassword":
        if (!value) {
          errorMessage = "Пароль обязателен";
          isValid = false;
        } else if (value.length < 4) {
          errorMessage = "Пароль должен содержать минимум 6 символов";
          isValid = false;
        }
        break;

      case "name":
        if (!value) {
          errorMessage = "Имя обязательно";
          isValid = false;
        } else if (value.length < 2) {
          errorMessage = "Имя должно содержать минимум 2 символа";
          isValid = false;
        }
        break;

      case "title":
        if (!value) {
          errorMessage = "Название продукта обязательно";
          isValid = false;
        } else if (value.length < 2) {
          errorMessage = "Название должно содержать минимум 2 символа";
          isValid = false;
        }
        break;

      case "serialNumber":
        if (!value) {
          errorMessage = "Серийный номер обязателен";
          isValid = false;
        } else if (isNaN(Number(value)) || Number(value) <= 0) {
          errorMessage = "Введите корректный серийный номер";
          isValid = false;
        }
        break;

      case "type":
        if (!value) {
          errorMessage = "Тип продукта обязателен";
          isValid = false;
        } else if (value.length < 2) {
          errorMessage = "Тип должен содержать минимум 2 символа";
          isValid = false;
        }
        break;

      case "priceUSD":
        if (!value) {
          errorMessage = "Цена в USD обязательна";
          isValid = false;
        } else if (isNaN(Number(value)) || Number(value) <= 0) {
          errorMessage = "Введите корректную цену в USD";
          isValid = false;
        }
        break;

      case "priceUAH":
        if (!value) {
          errorMessage = "Цена в UAH обязательна";
          isValid = false;
        } else if (isNaN(Number(value)) || Number(value) <= 0) {
          errorMessage = "Введите корректную цену в UAH";
          isValid = false;
        }
        break;

      case "orderId":
        if (!value) {
          errorMessage = "ID заказа обязателен";
          isValid = false;
        } else if (isNaN(Number(value)) || Number(value) <= 0) {
          errorMessage = "Введите корректный ID заказа";
          isValid = false;
        }
        break;

      case "specification":
        if (value && value.length < 10) {
          errorMessage = "Спецификация должна содержать минимум 10 символов";
          isValid = false;
        }
        break;

      case "photo":
        if (value && !/^https?:\/\/.+/.test(value)) {
          errorMessage = "Введите корректный URL фото";
          isValid = false;
        }
        break;

      case "guaranteeStart":
        if (
          value &&
          formData.guaranteeEnd &&
          new Date(value) >= new Date(formData.guaranteeEnd)
        ) {
          errorMessage =
            "Дата начала гарантии должна быть раньше даты окончания";
          isValid = false;
        }
        break;

      case "guaranteeEnd":
        if (
          value &&
          formData.guaranteeStart &&
          new Date(value) <= new Date(formData.guaranteeStart)
        ) {
          errorMessage =
            "Дата окончания гарантии должна быть позже даты начала";
          isValid = false;
        }
        break;

      case "description":
        if (!value) {
          errorMessage = "Описание обязательно";
          isValid = false;
        } else if (value.length < 10) {
          errorMessage = "Описание должно содержать минимум 10 символов";
          isValid = false;
        }
        break;

      default:
        break;
    }

    if (isValid) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
      setInputStatus((prev) => ({ ...prev, [name]: "success" }));
    } else {
      setFormErrors((prev) => ({ ...prev, [name]: errorMessage }));
      setInputStatus((prev) => ({ ...prev, [name]: "error" }));
    }

    return isValid;
  };

  const handleChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setInputStatus((prev) => ({ ...prev, [name]: "default" }));
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    validateField(name, value);
  };

  const setErorrs = (errors: Record<string, string>) => {
    setFormErrors(errors);
  };

  const resetForm = () => {
    setFormData(initialData);
    setFormErrors({});
    setInputStatus(initialStatus);
  };

  const fieldsToValidate = requiredFields || Object.keys(initialData);
  const isFormValid = fieldsToValidate.every((fieldName) => {
    const value = (formData as any)[fieldName];
    return value !== undefined && value !== null && String(value).trim() !== "";
  });

  return {
    formData,
    handleChange,
    resetForm,
    inputStatus,
    formErrors,
    isFormValid,
    setErorrs,
    setInputStatus,
  };
};
