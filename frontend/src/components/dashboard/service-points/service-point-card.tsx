import { ServicePoint } from "@/store/interfaces/interfaces";
import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import "./service-point-card.css";

export interface ServicePointCardProps {
  point: ServicePoint;

  isSelected?: boolean;
  onSelect?: () => void;
}

const ServicePointCard = ({
  point,

  isSelected = false,
  onSelect,
}: ServicePointCardProps) => {
  return (
    <div
      key={point.id}
      className={`service-point-card ${
        isSelected ? "service-point-card--selected" : ""
      }`}
      onClick={onSelect}
    >
      <div className="service-point-card__header">
        <h3 className="service-point-card__title">{point.name}</h3>
      </div>

      <div className="service-point-card__content">
        <div className="service-point-card__info">
          <div className="service-point-card__info-item">
            <MapPin size={16} />
            <span>{point.address}</span>
          </div>
          <div className="service-point-card__info-item">
            <Phone size={16} />
            <span>{point.phone}</span>
          </div>
          <div className="service-point-card__info-item">
            <Mail size={16} />
            <span>{point.email}</span>
          </div>
          <div className="service-point-card__info-item">
            <Clock size={16} />
            <span>{point.workingHours}</span>
          </div>
        </div>

        {point.description && (
          <div className="service-point-card__description">
            <p>{point.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicePointCard;
