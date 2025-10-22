// src/components/Navbar.js
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide navbar on login-related routes
  if (location.pathname.startsWith("/login")) return null;

  return (
    <nav className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div className="font-semibold text-lg">PSSPOC</div>

      <div className="flex items-center gap-6 text-sm">
        <Link
          to="/accounts"
          className={`hover:text-yellow-300 ${
            location.pathname === "/accounts" ? "font-bold" : ""
          }`}
        >
          Accounts
        </Link>
        <Link
          to="/payments"
          className={`hover:text-yellow-300 ${
            location.pathname === "/payments" ? "font-bold" : ""
          }`}
        >
          Payments
        </Link>
        <Link
          to="/ops"
          className={`hover:text-yellow-300 ${
            location.pathname === "/ops" ? "font-bold" : ""
          }`}
        >
          Ops
        </Link>
        <Link
          to="/reports"
          className={`hover:text-yellow-300 ${
            location.pathname === "/reports" ? "font-bold" : ""
          }`}
        >
          Reports
        </Link>

        {/* 🔸 Logout Button */}
        <button
          onClick={() => {
            localStorage.removeItem("loggedIn");
            navigate("/login");
          }}
          className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}