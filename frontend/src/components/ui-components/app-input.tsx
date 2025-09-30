import React from "react";

interface AppInputProps {
  type: string;
  id: string;
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className: string;
  required?: boolean;
  inputStatus: string;
  icon?: React.ReactNode;
  errorMessage?: string;
}

const AppInput = ({
  type,
  id,
  name,
  value,
  onChange,
  placeholder,
  label,
  className,
  required,
  inputStatus,
  icon,
  errorMessage,
}: AppInputProps) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {icon}
        </div>
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`${className} w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            inputStatus === "error"
              ? "border-red-300 bg-red-50"
              : inputStatus === "success"
              ? "border-green-300 bg-green-50"
              : "border-gray-300 hover:border-gray-400 focus:bg-white"
          }`}
        />
      </div>
      {inputStatus === "error" && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default AppInput;
