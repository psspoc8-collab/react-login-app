// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Correct and dynamic API base
const API_BASE =
  (typeof window !== "undefined" && window.__API_BASE_OVERRIDE__) ||
  process.env.REACT_APP_API_BASE ||
  "https://9euohw1p27.execute-api.us-east-1.amazonaws.com/prod";

// ✅ Expose for runtime debugging (browser Console)
if (typeof window !== "undefined") {
  window.__API_BASE__ = API_BASE;
  console.log("Using API_BASE:", API_BASE);
}

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");

  // Login form states
  const [loginForm, setLoginForm] = useState({ userId: "", password: "" });
  const [loginMsg, setLoginMsg] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup form states
  const [signupForm, setSignupForm] = useState({
    userId: "",
    password: "",
    confirm: "",
  });
  const [signupMsg, setSignupMsg] = useState(null);
  const [signupLoading, setSignupLoading] = useState(false);

  const changeLogin = (k) => (e) =>
    setLoginForm((s) => ({ ...s, [k]: e.target.value }));
  const changeSignup = (k) => (e) =>
    setSignupForm((s) => ({ ...s, [k]: e.target.value }));

  // LOGIN handler
  async function handleLogin(e) {
    e.preventDefault();
    setLoginMsg(null);
    if (!loginForm.userId || !loginForm.password) {
      setLoginMsg({ type: "error", text: "User ID and password are required." });
      return;
    }
    setLoginLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.message === "Login successful") {
        localStorage.setItem("authUser", loginForm.userId);
        navigate("/accounts");
      } else {
        setLoginMsg({ type: "error", text: data?.message || "Login failed." });
      }
    } catch {
      setLoginMsg({ type: "error", text: "Network error. Check API URL/CORS." });
    } finally {
      setLoginLoading(false);
    }
  }

  // Signup form validation
  const validateSignup = () => {
    if (!signupForm.userId.trim()) return "User ID is required.";
    if (!signupForm.password) return "Password is required.";
    if (signupForm.password.length < 6)
      return "Password must be at least 6 characters.";
    if (signupForm.password !== signupForm.confirm)
      return "Passwords do not match.";
    return null;
  };

  // SIGNUP handler
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
      if (res.status === 201) {
        setSignupMsg({ type: "success", text: "✅ User created. You can sign in now." });
        setLoginForm({ userId: signupForm.userId.trim(), password: "" });
        setTimeout(() => setTab("login"), 800);
      } else if (res.status === 409 && data?.error === "User already exists") {
        setSignupMsg({ type: "success", text: "ℹ️ User exists. Please sign in." });
        setLoginForm({ userId: signupForm.userId.trim(), password: "" });
        setTimeout(() => setTab("login"), 800);
      } else {
        setSignupMsg({
          type: "error",
          text: data?.error || "Signup failed. Check API/CORS.",
        });
      }
    } catch {
      setSignupMsg({ type: "error", text: "Network error. Check API URL/CORS." });
    } finally {
      setSignupLoading(false);
    }
  }

  // UI layout
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-indigo-50 via-white to-indigo-100 text-indigo-900 flex items-center">
      <main className="w-full">
        <div className="mx-auto max-w-md bg-white/90 border border-indigo-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold tracking-tight text-center mb-2">
            Welcome to PSSPOC
          </h1>

          <div className="flex justify-center mb-4">
            <button
              className={`px-3 py-2 rounded-t-lg ${tab === "login" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setTab("login")}
            >
              Login
            </button>
            <button
              className={`px-3 py-2 rounded-t-lg ml-2 ${tab === "signup" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setTab("signup")}
            >
              Add New User
            </button>
          </div>

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="text"
                placeholder="User ID"
                value={loginForm.userId}
                onChange={changeLogin("userId")}
                className="w-full border rounded-lg p-2"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={changeLogin("password")}
                className="w-full border rounded-lg p-2"
              />
              {loginMsg && (
                <p className={`text-sm ${loginMsg.type === "error" ? "text-red-500" : "text-green-600"}`}>
                  {loginMsg.text}
                </p>
              )}
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                disabled={loginLoading}
              >
                {loginLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-3">
              <input
                type="text"
                placeholder="User ID"
                value={signupForm.userId}
                onChange={changeSignup("userId")}
                className="w-full border rounded-lg p-2"
              />
              <input
                type="password"
                placeholder="Password"
                value={signupForm.password}
                onChange={changeSignup("password")}
                className="w-full border rounded-lg p-2"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={signupForm.confirm}
                onChange={changeSignup("confirm")}
                className="w-full border rounded-lg p-2"
              />
              {signupMsg && (
                <p className={`text-sm ${signupMsg.type === "error" ? "text-red-500" : "text-green-600"}`}>
                  {signupMsg.text}
                </p>
              )}
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                disabled={signupLoading}
              >
                {signupLoading ? "Creating..." : "Create Account"}
              </button>
            </form>
          )}

          <p className="text-xs text-center text-gray-400 mt-6">
            © 2025 PSSPOC — Built with ❤️ using React & Tailwind CSS
          </p>
        </div>
      </main>
    </div>
  );
}
