import React from "react";
import { GradientPage, CenterCard } from "../components/Layout";
import Navbar from "../components/Navbar";

export default function Reports() {
  return (
    <GradientPage>
      <CenterCard>
        <Navbar />
        <h1 className="text-2xl font-semibold text-center mb-2">Reporting</h1>
        <p className="text-gray-600 text-center mb-6">Generate statements or balance info.</p>
        {/* your form/table */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © 2025 PSSPOC — Built with ❤️ using React & Tailwind CSS
        </p>
      </CenterCard>
    </GradientPage>
  );
}