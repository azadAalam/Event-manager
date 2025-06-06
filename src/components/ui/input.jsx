import React from "react";
import classNames from "classnames";

export const Input = ({ className, ...props }) => {
  return (
    <input
      className={classNames(
        "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
      {...props}
    />
  );
};