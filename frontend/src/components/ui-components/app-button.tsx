import React from "react";
import Loader from "./loader";

interface AppButtonProps {
  type: "submit" | "button" | "reset";
  isFormValid?: boolean;
  className: string;
  title: string;
  onClick?: () => void;
  loading?: boolean;
}
const AppButton = ({
  isFormValid = true,
  type,
  className,
  title,
  onClick,
  loading,
}: AppButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        borderRadius: "35px",
      }}
      disabled={!isFormValid || loading}
      className={` ${className} ${
        isFormValid ? `cursor-pointer` : `opacity-50 cursor-not-allowed`
      }`}
    >
      {loading ? <Loader /> : title}
    </button>
  );
};

export default AppButton;
