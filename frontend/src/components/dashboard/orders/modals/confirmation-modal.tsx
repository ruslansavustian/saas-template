"use client";

import React, { useEffect } from "react";
import "@/components/dashboard/dashboard.css";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Підтвердити",
  cancelText = "Скасувати",
  type = "danger",
}) => {
  const modalId = `confirmationModal`;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          iconClass: "confirmation-modal__icon--danger",
          buttonClass: "confirmation-modal__btn--danger",
        };
      case "warning":
        return {
          iconClass: "confirmation-modal__icon--warning",
          buttonClass: "confirmation-modal__btn--warning",
        };
      case "info":
        return {
          iconClass: "confirmation-modal__icon--info",
          buttonClass: "confirmation-modal__btn--info",
        };
      default:
        return {
          iconClass: "confirmation-modal__icon--danger",
          buttonClass: "confirmation-modal__btn--danger",
        };
    }
  };

  const styles = getTypeStyles();

  if (!isOpen) return null;

  return (
    <>
      <div className="confirmation-modal__backdrop" onClick={onClose}></div>
      <div
        className="confirmation-modal"
        id={modalId}
        tabIndex={-1}
        aria-labelledby="confirmationModalLabel"
        aria-hidden="false"
      >
        <div className="confirmation-modal__dialog">
          <div className="confirmation-modal__content">
            {/* Header */}
            <div className="confirmation-modal__header">
              <div className="confirmation-modal__title-container">
                <i
                  className={`bi bi-exclamation-triangle-fill ${styles.iconClass}`}
                ></i>
                <h5
                  className="confirmation-modal__title"
                  id="confirmationModalLabel"
                >
                  {title}
                </h5>
              </div>
              <button
                type="button"
                className="confirmation-modal__close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            <div className="confirmation-modal__body">
              <p className="confirmation-modal__message">{message}</p>
            </div>

            <div className="confirmation-modal__footer">
              <button
                type="button"
                className="confirmation-modal__btn confirmation-modal__btn--secondary"
                onClick={onClose}
              >
                {cancelText}
              </button>
              <button
                type="button"
                className={`confirmation-modal__btn ${styles.buttonClass}`}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
