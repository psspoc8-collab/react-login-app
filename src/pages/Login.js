import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-300 to-teal-500">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-[90%] max-w-md text-center">
        <h1 className="text-2xl font-semibold text-sky-800 mb-2">Welcome to PSSPOC</h1>
        <p className="text-gray-600 mb-6">Choose an option to proceed</p>

        <div className="flex flex-col gap-3">
          <Link
            to="/login/existing"
            className="bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition"
          >
            Existing User Login
          </Link>
          <Link
            to="/login/new"
            className="border border-sky-600 text-sky-700 py-2 rounded-lg hover:bg-sky-50 transition"
          >
            Add New User
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          © 2025 PSSPOC — Built with ❤️ using React & Tailwind CSS
        </p>
      </div>
    </div>
  );
}

function Existing() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "TCS@123") {
      localStorage.setItem("loggedIn", "true");
      navigate("/reports");
    } else {
      setError("Invalid credentials. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-300 to-teal-500">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-[90%] max-w-md">
        <h2 className="text-xl font-semibold text-sky-800 mb-4 text-center">
          Existing User Login
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition"
          >
            Login
          </button>
          <Link
            to="/login"
            className="text-sky-700 hover:underline text-center text-sm"
          >
            Back
          </Link>
        </form>
        <p className="text-sm text-gray-500 mt-6 text-center">
          © 2025 PSSPOC — Built with ❤️ using React & Tailwind CSS
        </p>
      </div>
    </div>
  );
}

function NewUser() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-300 to-teal-500">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-[90%] max-w-md text-center">
        <h2 className="text-xl font-semibold text-sky-800 mb-4">Add New User</h2>
        <p className="text-gray-600 mb-6">This section can be developed further.</p>
        <Link
          to="/login"
          className="border border-sky-600 text-sky-700 py-2 px-4 rounded-lg hover:bg-sky-50 transition"
        >
          Back
        </Link>
        <p className="text-sm text-gray-500 mt-6">
          © 2025 PSSPOC — Built with ❤️ using React & Tailwind CSS
        </p>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/existing" element={<Existing />} />
      <Route path="/new" element={<NewUser />} />
    </Routes>
  );
}