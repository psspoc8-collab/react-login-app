import React from "react";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute.js";
import Login from "./pages/Login.js";
import AccountAdd from "./pages/AccountAdd.js";
import Payments from "./pages/Payments.js";
import Ops from "./pages/Ops.js";
import Reports from "./pages/Reports.js";

export default function App() {
  return (
    <Routes>
      <Route path="/login/*" element={<Login />} />
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
