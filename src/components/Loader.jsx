import React from "react";
import { FaSpinner } from "react-icons/fa";

export default function Loader({ size = 24, color = "text-blue-600", className = "" }) {
  return (
    <div 
      className={`flex justify-center items-center ${className}`}
      role="status"
      aria-label="در حال بارگذاری"
    >
      <FaSpinner 
        className={`animate-spin ${color}`} 
        size={size} 
      />
      <span className="sr-only">در حال بارگذاری...</span>
    </div>
  );
}