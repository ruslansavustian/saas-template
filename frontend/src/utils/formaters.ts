import { Product } from "@/interfaces";
import { useTranslations } from "next-intl";

export default function useFormatters() {
  const t = useTranslations("dashboard.productTable");

  const formatPrice = (price: Product["price"]) => {
    const defaultPrice = price.find((p) => p.isDefault);
    const otherPrice = price.find((p) => !p.isDefault);

    if (defaultPrice && otherPrice) {
      return `${defaultPrice.value} ${defaultPrice.symbol} / ${otherPrice.value} ${otherPrice.symbol}`;
    }
    return `${price[0]?.value} ${price[0]?.symbol}`;
  };

  const formatDate = (dateString: string, locale: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === "en" ? "en-US" : "uk-UA",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  const formatDateShort = (dateString: string, locale: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === "en" ? "en-US" : "uk-UA",
      {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }
    );
  };

  const formatGuaranteeDates = (
    guarantee: Product["guarantee"],
    locale: string
  ) => {
    if (!guarantee) return t("noGuarantee");

    const startDate = new Date(guarantee.start).toLocaleDateString(
      locale === "en" ? "en-US" : "uk-UA",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );

    const endDate = new Date(guarantee.end).toLocaleDateString(
      locale === "en" ? "en-US" : "uk-UA",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );

    return `${startDate} - ${endDate}`;
  };

  const formatTime = (date: Date, locale: string) => {
    return date.toLocaleTimeString(locale === "en" ? "en-US" : "uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return {
    formatPrice,
    formatDate,
    formatDateShort,
    formatGuaranteeDates,
    formatTime,
  };
}
