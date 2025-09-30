"use client";

import React, { useEffect, useRef } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { ServicePoint } from "@/store/interfaces/interfaces";
import { useTranslations } from "next-intl";
import "./map.css";

interface ServicePointsMapProps {
  servicePoints: ServicePoint[];
  onMarkerClick?: (point: ServicePoint) => void;
  focusPoint?: ServicePoint | null;
}

const Map = ({
  servicePoints,
  onMarkerClick,
  focusPoint,
}: ServicePointsMapProps) => {
  const t = useTranslations("dashboard.servicePointsPage");
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => (marker.map = null));
    markersRef.current = [];

    if (!mapInstanceRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center:
          servicePoints.length > 0
            ? {
                lat:
                  servicePoints.reduce((sum, p) => sum + p.latitude, 0) /
                  servicePoints.length,
                lng:
                  servicePoints.reduce((sum, p) => sum + p.longitude, 0) /
                  servicePoints.length,
              }
            : { lat: 50.4501, lng: 30.5234 },
        zoom: servicePoints.length === 1 ? 15 : 10,
        mapId: "DEMO_MAP_ID",
      });
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    const markers = servicePoints.map((point) => {
      const markerElement = document.createElement("div");
      markerElement.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#3b82f6" stroke="#ffffff" stroke-width="2"/>
          <circle cx="12" cy="10" r="3" fill="#ffffff"/>
        </svg>
      `;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: { lat: point.latitude, lng: point.longitude },
        title: point.name,
        content: markerElement,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 300px;">
            <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px;">${
              point.name
            }</h3>
            <div style="font-size: 14px; color: #4b5563;">
              <p style="margin: 4px 0;"><strong>${t("addressLabel")}</strong> ${
          point.address
        }</p>
              <p style="margin: 4px 0;"><strong>${t("phoneLabel")}</strong> ${
          point.phone
        }</p>
              <p style="margin: 4px 0;"><strong>${t("emailLabel")}</strong> ${
          point.email
        }</p>
              <p style="margin: 4px 0;"><strong>${t(
                "workingHoursLabel"
              )}</strong> ${point.workingHours}</p>
              ${
                point.description
                  ? `<p style="margin: 4px 0;"><strong>${t(
                      "descriptionLabel"
                    )}</strong> ${point.description}</p>`
                  : ""
              }
            </div>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
        onMarkerClick?.(point);
      });

      return marker;
    });

    markersRef.current = markers;

    return () => {
      markers.forEach((marker) => (marker.map = null));
    };
  }, [servicePoints, onMarkerClick, t]);

  useEffect(() => {
    if (focusPoint && mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      const point = focusPoint;

      map.panTo({ lat: point.latitude, lng: point.longitude });
      map.setZoom(15);

      const marker = markersRef.current.find(
        (m, index) => servicePoints[index]?.id === point.id
      );

      if (marker) {
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 300px;">
              <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px;">${
                point.name
              }</h3>
              <div style="font-size: 14px; color: #4b5563;">
                <p style="margin: 4px 0;"><strong>${t(
                  "addressLabel"
                )}</strong> ${point.address}</p>
                <p style="margin: 4px 0;"><strong>${t("phoneLabel")}</strong> ${
            point.phone
          }</p>
                <p style="margin: 4px 0;"><strong>${t("emailLabel")}</strong> ${
            point.email
          }</p>
                <p style="margin: 4px 0;"><strong>${t(
                  "workingHoursLabel"
                )}</strong> ${point.workingHours}</p>
                ${
                  point.description
                    ? `<p style="margin: 4px 0;"><strong>${t(
                        "descriptionLabel"
                      )}</strong> ${point.description}</p>`
                    : ""
                }
              </div>
            </div>
          `,
        });

        infoWindow.open(map, marker);
      }
    }
  }, [focusPoint, servicePoints, t]);

  return <div ref={mapRef} style={{ height: "500px", width: "100%" }} />;
};

const RenderingMap: React.FC<ServicePointsMapProps> = ({
  servicePoints,
  onMarkerClick,
  focusPoint,
}) => {
  const t = useTranslations("dashboard.servicePointsPage");

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <p className="text-gray-600 mb-2">{t("mapUnavailable")}</p>
          <p className="text-sm text-gray-500">{t("mapApiKeyMessage")}</p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              {t("servicePointsCount", { count: servicePoints.length })}
            </p>
            {servicePoints.map((point, index) => (
              <div key={point.id} className="text-xs text-blue-700 mt-1">
                {index + 1}. {point.name} - {point.address}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return (
          <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">{t("loadingMap")}</p>
            </div>
          </div>
        );
      case Status.FAILURE:
        return (
          <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg border border-red-200">
            <div className="text-center">
              <p className="text-red-600 mb-2">{t("mapLoadError")}</p>
              <p className="text-sm text-red-500">{t("checkApiKey")}</p>
            </div>
          </div>
        );
      case Status.SUCCESS:
        return (
          <Map
            servicePoints={servicePoints}
            onMarkerClick={onMarkerClick}
            focusPoint={focusPoint}
          />
        );
    }
  };

  return (
    <div className="service-points-map">
      <Wrapper
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        render={render}
        libraries={["marker"]}
      />
    </div>
  );
};

export default RenderingMap;
