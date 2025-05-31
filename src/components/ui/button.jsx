import React from "react";
import classNames from "classnames";

export const Button = ({ children, className, variant = "primary", ...props }) => {
  const baseStyles = "px-4 py-2 rounded font-medium transition-colors";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      className={classNames(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};