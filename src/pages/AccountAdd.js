// src/pages/AccountAdd.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// 👉 Set this to your API Gateway invoke URL (no trailing slash)
const API_BASE = process.env.REACT_APP_API_BASE || "https:UserLoginValidator.execute-api.us-east-1.amazonaws.com";

export default function AccountAdd() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userId: "",
    password: "",
    confirm: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const update = (k) => (e) => {
    setMsg({ type: "", text: "" });
    setForm((s) => ({ ...s, [k]: e.target.value }));
  };

  const validate = () => {
    if (!form.userId.trim()) return "User ID is required.";
    if (!form.password) return "Password is required.";
    if (form.password !== form.confirm) return "Passwords do not match.";
    // optional basic policy
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    return null;
    // You can add more rules (uppercase, number, special char) if you want.
  };

  async function signup(e) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setMsg({ type: "error", text: err });
      return;
    }

    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: form.userId.trim(), password: form.password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 201 || (res.status === 409 && data?.error === "User already exists")) {
        setMsg({
          type: "success",
          text:
            res.status === 201
              ? "✅ User created successfully."
              : "ℹ️ User already exists. You can log in with these credentials.",
        });
        // optional: auto-navigate to login after a moment
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setMsg({ type: "error", text: data?.error || "Signup failed. Check API/CORS and try again." });
      }
    } catch (err) {
      setMsg({ type: "error", text: "Network error. Check your API URL and CORS." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100dvh-0px)] bg-gradient-to-br from-indigo-50 via-white to-indigo-100 text-indigo-900">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 backdrop-blur bg-white/60 border-b border-indigo-100">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">Add New User</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition"
            >
              Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Home
            </button>
          </div>
        </div>
      </header>

      {/* Form Card */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mx-auto max-w-xl rounded-2xl shadow-lg bg-white/90 border border-indigo-100 p-6">
          <p className="text-sm text-indigo-600 mb-4">
            Create a new application user. The password is sent to your AWS API; the Lambda hashes it (bcrypt) and stores it in DynamoDB.
          </p>

          {msg.text ? (
            <div
              className={`mb-4 rounded-lg px-4 py-3 text-sm ${
                msg.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {msg.text}
            </div>
          ) : null}

          <form onSubmit={signup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">User ID</label>
              <input
                type="text"
                value={form.userId}
                onChange={update("userId")}
                placeholder="e.g. arghya"
                className="w-full rounded-lg border border-indigo-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={update("password")}
                  placeholder="Enter password"
                  className="w-full rounded-lg border border-indigo-200 px-3 py-2 pr-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 border border-indigo-200 rounded-md hover:bg-indigo-50"
                >
                  {showPwd ? "Hide" : "Show"}
                </button>
              </div>
              <p className="mt-1 text-xs text-indigo-500">Min 6 chars. You can tighten policy later.</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input
                type={showPwd ? "text" : "password"}
                value={form.confirm}
                onChange={update("confirm")}
                placeholder="Re-enter password"
                className="w-full rounded-lg border border-indigo-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create User"}
              </button>
              <button
                type="button"
                onClick={() => setForm({ userId: "", password: "", confirm: "" })}
                className="rounded-lg border border-indigo-200 px-4 py-2 hover:bg-indigo-50"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-sm text-indigo-500">
          © 2025 PSSPOC — Built with ❤️ using React & Tailwind CSS
        </footer>
      </main>
    </div>
  );
}