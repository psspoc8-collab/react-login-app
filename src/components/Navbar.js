import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="w-full flex items-center justify-end px-8 py-4 bg-white/70 backdrop-blur-md shadow-md rounded-xl mb-6">
      <div className="flex items-center space-x-8">
        <Link className="text-sky-700 font-medium text-lg hover:text-sky-900 hover:underline transition" to="/accounts">Accounts</Link>
        <Link className="text-sky-700 font-medium text-lg hover:text-sky-900 hover:underline transition" to="/payments">Payments</Link>
        <Link className="text-sky-700 font-medium text-lg hover:text-sky-900 hover:underline transition" to="/ops">OPS</Link>
        <Link className="text-sky-700 font-medium text-lg hover:text-sky-900 hover:underline transition" to="/reports">Reports</Link>
        <button
          onClick={() => { localStorage.removeItem("loggedIn"); navigate("/login"); }}
          className="ml-6 border border-sky-600 text-sky-700 font-semibold px-5 py-2 rounded-lg hover:bg-sky-50 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
