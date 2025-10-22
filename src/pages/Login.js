// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://UserLoginValidator.execute-api.us-east-1.amazonaws.com"; // ← set your API

export default function Login() {
  const navigate = useNavigate();

  // which tab is active: 'login' or 'signup'
  const [tab, setTab] = useState("login");

  // login form
  const [loginForm, setLoginForm] = useState({ userId: "", password: "" });
  const [loginMsg, setLoginMsg] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // signup form (moved here from Add User)
  const [signupForm, setSignupForm] = useState({
    userId: "",
    password: "",
    confirm: "",
  });
  const [signupMsg, setSignupMsg] = useState(null);
  const [signupLoading, setSignupLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  // helpers
  const changeLogin = (k) => (e) =>
    setLoginForm((s) => ({ ...s, [k]: e.target.value }));
  const changeSignup = (k) => (e) =>
    setSignupForm((s) => ({ ...s, [k]: e.target.value }));

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
        // go to your first app screen after auth
        navigate("/accounts"); // or "/reports" if you prefer
      } else {
        setLoginMsg({ type: "error", text: data?.message || "Login failed." });
      }
    } catch {
      setLoginMsg({ type: "error", text: "Network error. Check API URL/CORS." });
    } finally {
      setLoginLoading(false);
    }
  }

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
      if (res.status === 201) {
        setSignupMsg({ type: "success", text: "✅ User created. You can sign in now." });
        // prefill login with new user & switch to login tab
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

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-indigo-50 via-white to-indigo-100 text-indigo-900 flex items-center">
      <main className="w-full">
        <div className="mx-auto max-w-md bg-white/90 border border-indigo-100 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold tracking-tight text-center mb-2">
            Welcome to PSSPOC
          </h1>
          <p className="text-center text-sm text-indigo-600 mb-6">
            Sign in or create a new user to continue
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 rounded-lg px-3 py-2 border ${
                tab === "login"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-indigo-200 hover:bg-indigo-50"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab("signup")}
              className={`flex-1 rounded-lg px-3 py-2 border ${
                tab === "signup"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-indigo-200 hover:bg-indigo-50"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Login panel */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              {loginMsg && (
                <div
                  className={`rounded-lg px-3 py-2 text-sm mb-1 ${
                    loginMsg.type === "error"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-green-50 text-green-700 border border-green-200"
                  }`}
                >
                  {loginMsg.text}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">User ID</label>
                <input
                  type="text"
                  value={loginForm.userId}
                  onChange={changeLogin("userId")}
                  className="w-full rounded-lg border border-indigo-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. admin"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={changeLogin("password")}
                  className="w-full rounded-lg border border-indigo-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter password"
                />
              </div>
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full rounded-lg bg-indigo-600 text-white py-2 hover:bg-indigo-700 disabled:opacity-50"
              >
                {loginLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          )}

          {/* Signup panel */}
          {tab === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              {signupMsg && (
                <div
                  className={`rounded-lg px-3 py-2 text-sm mb-1 ${
                    signupMsg.type === "error"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-green-50 text-green-700 border border-green-200"
                  }`}
                >
                  {signupMsg.text}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">User ID</label>
                <input
                  type="text"
                  value={signupForm.userId}
                  onChange={changeSignup("userId")}
                  className="w-full rounded-lg border border-indigo-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Choose a user ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={signupForm.password}
                    onChange={changeSignup("password")}
                    className="w-full rounded-lg border border-indigo-200 px-3 py-2 pr-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 border border-indigo-200 rounded-md hover:bg-indigo-50"
                  >
                    {showPwd ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="mt-1 text-xs text-indigo-500">
                  Min 6 characters (tighten policy later).
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  type={showPwd ? "text" : "password"}
                  value={signupForm.confirm}
                  onChange={changeSignup("confirm")}
                  className="w-full rounded-lg border border-indigo-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Re-enter password"
                />
              </div>
              <button
                type="submit"
                disabled={signupLoading}
                className="w-full rounded-lg bg-indigo-600 text-white py-2 hover:bg-indigo-700 disabled:opacity-50"
              >
                {signupLoading ? "Creating..." : "Create Account"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-indigo-500">
            © 2025 PSSPOC — Built with ❤️ using React & Tailwind CSS
          </p>
        </div>
      </main>
    </div>
  );
}