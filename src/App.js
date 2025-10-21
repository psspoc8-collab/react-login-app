<<<<<<< HEAD
import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

// ✅ HOME PAGE (Login Type Selection)
function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>TCS -Citi PSS POC Login Page</h1>
        <div style={styles.buttonGroup}>
          <Link to="/login/existing" style={styles.primaryBtn}>Existing User</Link>
          <Link to="/login/new" style={styles.secondaryBtn}>New User</Link>
        </div>
        <p style={styles.info}>Default Login → <b>admin / TCS@123</b></p>
      </div>
    </div>
  );
}

// ✅ EXISTING USER LOGIN PAGE
function ExistingUser() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // default admin credentials
    if (userId === "admin" && password === "TCS@123") {
      setMsg("✅ Login successful (admin)");
      setTimeout(() => navigate("/dashboard"), 800);
      return;
    }

    // check localStorage users
    const users = JSON.parse(localStorage.getItem("tcs_users") || "[]");
    const found = users.find(
      (u) => u.userId === userId && u.password === password
    );

    if (found) {
      setMsg("✅ Login successful");
      setTimeout(() => navigate("/dashboard"), 800);
    } else {
      setMsg("❌ Invalid credentials");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Existing User Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            style={styles.input}
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.primaryBtn}>
              Login
            </button>
            <Link to="/login" style={styles.secondaryBtn}>
              Back
            </Link>
          </div>
        </form>
        {msg && <p style={styles.message}>{msg}</p>}
      </div>
    </div>
  );
}

// ✅ NEW USER REGISTRATION PAGE
function NewUser() {
  const [empId, setEmpId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("tcs_users") || "[]");
    if (users.some((u) => u.empId === empId || u.email === email)) {
      setMsg("❌ User already exists");
      return;
    }

    // Create simple userId
    const userId = `u${Date.now().toString().slice(-5)}`;
    users.push({ userId, empId, email, password });
    localStorage.setItem("tcs_users", JSON.stringify(users));

    setMsg(`✅ Registered! Your User ID: ${userId}`);
    setTimeout(() => navigate("/login/existing"), 1500);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>New User Registration</h2>
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Employee ID"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.primaryBtn}>
              Register
            </button>
            <Link to="/login" style={styles.secondaryBtn}>
              Back
            </Link>
          </div>
        </form>
        {msg && <p style={styles.message}>{msg}</p>}
      </div>
    </div>
  );
}

// ✅ DASHBOARD PAGE
function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.card, width: "400px" }}>
        <h2>Welcome to TCS -Citi PSS POC Dashboard</h2>
        <p>This is your dashboard screen. You can customize it further.</p>
        <button onClick={handleLogout} style={styles.secondaryBtn}>
          Logout
        </button>
      </div>
    </div>
  );
}

// ✅ APP ROUTES
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Home />} />
      <Route path="/login/existing" element={<ExistingUser />} />
      <Route path="/login/new" element={<NewUser />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

// ✅ STYLES
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #6dd5ed, #2193b0)",
    fontFamily: "Arial, sans-serif",
    padding: 20,
  },
  card: {
    background: "#fff",
    padding: 30,
    borderRadius: 12,
    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
    textAlign: "center",
    width: 350,
  },
  title: {
    fontSize: 22,
    color: "#0b3b4a",
    marginBottom: 20,
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
    marginTop: 15,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 10,
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  primaryBtn: {
    padding: "10px 16px",
    backgroundColor: "#0b7ea1",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    textDecoration: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
  secondaryBtn: {
    padding: "10px 16px",
    backgroundColor: "#fff",
    color: "#0b7ea1",
    border: "2px solid #0b7ea1",
    borderRadius: 8,
    textDecoration: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
  info: {
    marginTop: 15,
    color: "#555",
  },
  message: {
    marginTop: 15,
    color: "#333",
  },
};
=======
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AccountAdd from "./pages/AccountAdd";
import Payments from "./pages/Payments";
import Ops from "./pages/Ops";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        path="/accounts"
        element={
          <ProtectedRoute>
            <AccountAdd />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ops"
        element={
          <ProtectedRoute>
            <Ops />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* Default route */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
>>>>>>> b7c743a (Initial commit - React + Tailwind Login App)
