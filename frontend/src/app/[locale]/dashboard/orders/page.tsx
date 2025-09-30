"use client";

import CreateOrderModal from "@/components/dashboard/orders/modals/create-order-modal";
import OrderTable from "@/components/dashboard/orders/order-table";
import OrderDetailsPanel from "@/components/dashboard/orders/order-details-panel";
import ConfirmationModal from "@/components/dashboard/orders/modals/confirmation-modal";

import { Order } from "@/interfaces";
import { useTranslations } from "next-intl";
import React, { useState, useEffect, useCallback } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchOrders,
  deleteOrder,
  selectOrders,
  selectOrdersLoading,
} from "@/store/slices/order-slice";

const OrdersPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    orderId: number | null;
    orderTitle: string;
  }>({
    isOpen: false,
    orderId: null,
    orderTitle: "",
  });

  const t = useTranslations("dashboard");

  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const loading = useAppSelector(selectOrdersLoading);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleDelete = useCallback(
    (orderId: number) => {
      const order = orders.find((o) => o.id === orderId);
      setDeleteModal({
        isOpen: true,
        orderId,
        orderTitle: order?.title || "",
      });
    },
    [orders]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteModal.orderId) return;

    try {
      await dispatch(deleteOrder(deleteModal.orderId)).unwrap();

      setSelectedOrder(null);

      setDeleteModal({ isOpen: false, orderId: null, orderTitle: "" });
    } catch (error) {
      console.error("Помилка при видаленні приходу:", error);
    }
  }, [deleteModal.orderId, dispatch]);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModal({ isOpen: false, orderId: null, orderTitle: "" });
  }, []);

  const deleteMessage = t("orderTable.deleteOrderMessage", {
    title: deleteModal.orderTitle,
  });

  const handleView = useCallback((order: Order) => {
    setSelectedOrder(order);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  return (
    <div className="p-6 flex-1">
      <CreateOrderModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title={t("orderTable.deleteOrder")}
        message={deleteMessage}
        confirmText={t("orderTable.delete")}
        cancelText={t("orderTable.cancel")}
        type="danger"
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t("orders")}</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsOpen(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          {t("createOrder")}
        </button>
      </div>

      <div className="flex gap-6 transition-all duration-300 overflow-hidden">
        <div
          className={`transition-all duration-300 ${
            selectedOrder ? "w-1/3" : "w-full"
          }`}
        >
          <div className="overflow-hidden">
            <OrderTable
              orders={orders}
              onDelete={handleDelete}
              onView={handleView}
              selectedOrderId={selectedOrder?.id}
              loading={loading}
            />
          </div>
        </div>

        {selectedOrder && (
          <div className="w-2/3 transition-all duration-300 overflow-hidden">
            <div className="order-details order-details--open">
              <OrderDetailsPanel
                order={selectedOrder}
                onClose={handleCloseDetails}
                onDelete={handleDelete}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
