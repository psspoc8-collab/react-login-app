// src/pages/Login.js
import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

// ✅ Base API configuration
const API_BASE =
  (typeof window !== "undefined" && window.__API_BASE_OVERRIDE__) ||
  process.env.REACT_APP_API_BASE ||
  "https://9euohw1p27.execute-api.us-east-1.amazonaws.com/prod";

if (typeof window !== "undefined") {
  window.__API_BASE__ = API_BASE;
  console.log("Using API_BASE:", API_BASE);
}

export default function Login() {
  const [tab, setTab] = useState("login");
  const [loginForm, setLoginForm] = useState({ userId: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    userId: "",
    password: "",
    confirm: "",
  });
  const [loginMsg, setLoginMsg] = useState(null);
  const [signupMsg, setSignupMsg] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const navigate = useNavigate();

  // ---------- LOGIN ----------
  async function handleLogin(e) {
    e.preventDefault();
    setLoginMsg(null);
    setLoginLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: loginForm.userId.trim(),
          password: loginForm.password,
        }),
      });
      const data = await res.json().catch(() => ({}));
      console.log("Login API status:", res.status, data);

      if (res.ok && data?.message === "Login successful") {
        // ✅ Store session flags
        localStorage.setItem("authUser", loginForm.userId.trim());
        localStorage.setItem("loggedIn", "true");

        console.log("Login flags set:", {
          authUser: loginForm.userId.trim(),
          loggedIn: "true",
        });

        // ✅ Redirect to Reports page
        window.location.hash = "#/reports";
        return;
      } else {
        setLoginMsg({
          type: "error",
          text: data?.message || "Invalid credentials. Try again.",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoginMsg({ type: "error", text: "Network error. Check API URL/CORS." });
    } finally {
      setLoginLoading(false);
    }
  }

  // ---------- SIGNUP ----------
  const validateSignup = () => {
    if (!signupForm.userId.trim()) return "User ID is required.";
    if (!signupForm.password) return "Password is required.";
    if (signupForm.password.length < 6)
      return "Password must be at least 6 characters.";
    if (signupForm.password !== signupForm.confirm)
      return "Passwords do not match.";
    return null;
  };

  async function handleSignup(e) {
    e.preventDefault();
    setSignupMsg(null);
    const err = validateSignup();
    if (err) {
      setSignupMsg({ type: "error", text: err });
      return;
    }

    setSignupLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: signupForm.userId.trim(),
          password: signupForm.password,
        }),
      });
      const data = await res.json().catch(() => ({}));
      console.log("Signup API status:", res.status, data);

      if (res.status === 201) {
        setSignupMsg({
          type: "success",
          text: "✅ User created. You can sign in now.",
        });
        setLoginForm({ userId: signupForm.userId.trim(), password: "" });
        setTimeout(() => setTab("login"), 800);
      } else if (res.status === 409) {
        setSignupMsg({
          type: "info",
          text: data?.error || data?.message || "ℹ️ User already exists.",
        });
        setLoginForm({ userId: signupForm.userId.trim(), password: "" });
        setTimeout(() => setTab("login"), 800);
      } else {
        setSignupMsg({
          type: "error",
          text: data?.error || "Signup failed. Check API/CORS.",
        });
      }
    } catch (err) {
      console.error("Signup error:", err);
      setSignupMsg({ type: "error", text: "Network error. Check API URL/CORS." });
    } finally {
      setSignupLoading(false);
    }
  }

  // ---------- UI ----------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-white to-indigo-300 text-gray-900">
      <main className="w-full max-w-md bg-white border border-indigo-100 shadow-xl rounded-2xl p-6">
        <h1 className="text-2xl font-bold tracking-tight text-center mb-2 text-indigo-800">
          {tab === "login" ? "Login" : "Create Account"}
        </h1>

        {/* Tabs */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            className={`px-4 py-2 rounded-lg font-medium ${
              tab === "login"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-indigo-100 text-indigo-700"
            }`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${
              tab === "signup"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-indigo-100 text-indigo-700"
            }`}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* LOGIN FORM */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="User ID"
              value={loginForm.userId}
              onChange={(e) =>
                setLoginForm({ ...loginForm, userId: e.target.value })
              }
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {loginMsg && (
              <p
                className={`text-sm ${
                  loginMsg.type === "error"
                    ? "text-red-500"
                    : "text-green-600"
                }`}
              >
                {loginMsg.text}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              disabled={loginLoading}
            >
              {loginLoading ? "Signing in..." : "Login"}
            </button>
            <Link
              to="/"
              className="text-indigo-700 hover:underline text-center text-sm"
            >
              Back
            </Link>
          </form>
        )}

        {/* SIGNUP FORM */}
        {tab === "signup" && (
          <form onSubmit={handleSignup} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="User ID"
              value={signupForm.userId}
              onChange={(e) =>
                setSignupForm({ ...signupForm, userId: e.target.value })
              }
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={signupForm.password}
              onChange={(e) =>
                setSignupForm({ ...signupForm, password: e.target.value })
              }
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={signupForm.confirm}
              onChange={(e) =>
                setSignupForm({ ...signupForm, confirm: e.target.value })
              }
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {signupMsg && (
              <p
                className={`text-sm ${
                  signupMsg.type === "error"
                    ? "text-red-500"
                    : signupMsg.type === "success"
                    ? "text-green-600"
                    : "text-blue-600"
                }`}
              >
                {signupMsg.text}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              disabled={signupLoading}
            >
              {signupLoading ? "Creating..." : "Create Account"}
            </button>
          </form>
        )}

        <p className="text-xs text-center text-gray-400 mt-6">
          © 2025 PSSPOC — Built with ❤️ using React & Tailwind CSS
        </p>
      </main>
    </div>
  );
}