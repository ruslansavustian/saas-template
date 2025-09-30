"use client";

import React, { useState, useEffect } from "react";
import { Clock, Users } from "lucide-react";
import { useSocket } from "@/hooks/use-socket";
import useFormatters from "@/utils/formaters";
import { useLocale, useTranslations } from "next-intl";

const ShowDate = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { activeConnections, isConnected, connectSocket } = useSocket();
  const t = useTranslations("header");
  const locale = useLocale();
  const getLocation = () => {
    return locale === "en" ? "en-US" : "uk-UA";
  };
  const { formatTime } = useFormatters();
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  return (
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2 text-sm text-gray-700">
        <div className="flex flex-col">
          <div className="font-medium flex flex-row items-center gap-2">
            <Clock size={16} className="text-green-600" />
            {formatTime(currentTime, locale)}
          </div>
          <div className="text-xs text-gray-500">
            {currentTime.toLocaleDateString(getLocation(), {
              weekday: "short",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {isConnected && (
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <Users size={24} className="text-blue-600" />
          <div className="flex flex-col">
            <div className="font-medium">
              {activeConnections} {t("session")}
            </div>
            <div className="text-xs text-gray-500">{t("connected")}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowDate;
