import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <FaExclamationTriangle 
          className="mx-auto text-yellow-500 mb-4" 
          size={48} 
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">۴۰۴</h1>
        <p className="text-gray-600 mb-6">صفحه مورد نظر یافت نشد!</p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
        >
          بازگشت به صفحه اصلی
        </button>
      </div>
    </div>
  );
}