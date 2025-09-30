"use client";

import React, { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Plus } from "lucide-react";
import { ServicePoint } from "@/store/interfaces/interfaces";
import ServicePointCard from "./service-point-card";
import ServicePointsMap from "./map";
import "./service-point-page.css";

const ServicePointsPage = () => {
  const t = useTranslations("dashboard.servicePointsPage");
  const servicePoints = [
    {
      id: "1",
      name: "Центр ремонту №1",
      address: "вул. Хрещатик, 22, Київ, Україна",
      phone: "+380 44 123 45 67",
      email: "repair1@example.com",
      workingHours: "Пн-Пт 9:00-18:00, Сб 10:00-16:00",
      description: "Спеціалізується на ремонті комп'ютерної техніки",
      latitude: 50.4501,
      longitude: 30.5234,
    },
    {
      id: "2",
      name: "Сервісний центр 'ТехноМастер'",
      address: "пр. Перемоги, 15, Київ, Україна",
      phone: "+380 44 987 65 43",
      email: "service@technomaster.com",
      workingHours: "Пн-Сб 8:00-20:00",
      description: "Повний спектр ремонтних послуг для електроніки",
      latitude: 50.449263846897644,
      longitude: 30.47547960330459,
    },
    {
      id: "3",
      name: "Ремонтний центр 'Електронік'",
      address: "вул. Шевченка, 45, Київ, Україна",
      phone: "+380 44 555 77 88",
      email: "electronics@repair.com",
      workingHours: "Пн-Пт 10:00-19:00, Сб 9:00-15:00",
      description: "Ремонт мобільних телефонів та планшетів",
      latitude: 50.48810362157012,
      longitude: 30.436678888370576,
    },
    {
      id: "4",
      name: "Сервіс 'Гаджет Про'",
      address: "пр. Науки, 12, Київ, Україна",
      phone: "+380 44 333 44 55",
      email: "gadget@service.com",
      workingHours: "Пн-Сб 9:00-18:00",
      description: "Спеціалізація на ремонті ноутбуків та комп'ютерів",
      latitude: 50.48488748473458,
      longitude: 30.592844114294266,
    },
    {
      id: "5",
      name: "Центр обслуговування 'Техно Сервіс'",
      address: "вул. Лібідська, 78, Київ, Україна",
      phone: "+380 44 777 88 99",
      email: "techno@service.com",
      workingHours: "Пн-Пт 8:00-20:00, Сб 9:00-17:00",
      description: "Ремонт та обслуговування всіх видів електроніки",
      latitude: 50.40644763720443,
      longitude: 30.538439022809783,
    },
  ];
  const [selectedPoint, setSelectedPoint] = useState<ServicePoint | null>(null);

  const handleMarkerClick = useCallback((point: ServicePoint) => {
    setSelectedPoint(point);
  }, []);

  return (
    <div className="p-6 flex-1 flex flex-col">
      <div className="dashboard-page">
        <div className="dashboard-page__content">
          {servicePoints.length === 0 ? (
            <div className="dashboard-page__empty">
              <MapPin size={64} className="dashboard-page__empty-icon" />
              <h3>{t("noServicePoints")}</h3>
              <button onClick={() => {}} className="dashboard-page__add-button">
                <Plus size={20} />
                {t("addServicePoint")}
              </button>
            </div>
          ) : (
            <div className="service-points-layout">
              <div className="service-points-list">
                <div className="service-points-list__header">
                  <h3 className="text-lg font-semibold mb-4">
                    {t("servicePointsList")}
                  </h3>
                </div>
                <div className="service-points-list__content">
                  {servicePoints.map((point) => (
                    <ServicePointCard
                      key={point.id}
                      point={point}
                      isSelected={selectedPoint?.id === point.id}
                      onSelect={() => setSelectedPoint(point)}
                    />
                  ))}
                </div>
              </div>

              {/* Правая часть - карта */}
              <div className="service-points-map-section">
                <div className="service-points-map-section__header">
                  <h3 className="text-lg font-semibold mb-4">
                    {t("mapSection")}
                  </h3>
                </div>
                <div className="service-points-map-section__content">
                  <ServicePointsMap
                    servicePoints={servicePoints}
                    onMarkerClick={handleMarkerClick}
                    focusPoint={selectedPoint}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicePointsPage;
