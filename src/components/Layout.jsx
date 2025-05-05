import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { motion } from "motion/react";

export default function Layout() {
  return (
    <div
     className="min-h-screen bg-gray-100">
      <header className="bg-white shadow sticky top-0 z-50">
        <nav className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Translation Tool</h1>
          <div className="space-x-4">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
              }
            >
              مدیریت ترجمه
            </NavLink>
            <span> </span>
            <NavLink
              to="/public"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
              }
            >
              نمایش عمومی
            </NavLink>
          </div>
        </nav>
      </header>
      <motion.main
        className="max-w-5xl mx-auto p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
