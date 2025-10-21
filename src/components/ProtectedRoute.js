import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("loggedIn") !== "true") navigate("/login");
  }, [navigate]);
  return <>{children}</>;
}
