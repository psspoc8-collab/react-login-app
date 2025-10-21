import React from "react";

// Gradient background (like your dashboard)
export function GradientPage({ children }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-300 to-teal-500 flex items-center justify-center">
      {children}
    </div>
  );
}

// Centered white rounded card container
export function CenterCard({ children, className = "" }) {
  return (
    <div className={`relative bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-2xl ${className}`}>
      {children}
    </div>
  );
}