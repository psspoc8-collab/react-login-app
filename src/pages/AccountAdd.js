import React from "react";
import { GradientPage, CenterCard } from "../components/Layout";
import Navbar from "../components/Navbar";

export default function AccountAdd() {
  return (
    <GradientPage>
      <CenterCard>
        <Navbar />
        <h1 className="text-2xl font-semibold text-center mb-2">Account Validation & Addition</h1>
        <p className="text-gray-600 text-center mb-6">Add/validate customer accounts.</p>

        <form className="grid grid-cols-1 gap-3">
          <input className="border rounded-lg p-2" placeholder="Account Number" />
          <input className="border rounded-lg p-2" placeholder="Name" />
          <input className="border rounded-lg p-2" placeholder="Address" />
          <div className="grid grid-cols-2 gap-3">
            <input className="border rounded-lg p-2" placeholder="State" />
            <input className="border rounded-lg p-2" placeholder="Country" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="border rounded-lg p-2" placeholder="ZIP" />
            <input className="border rounded-lg p-2" placeholder="Contact" />
          </div>
          <button className="mt-2 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700">
            Save Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          © 2025 PSSPOC — Built with ❤️ using React & Tailwind CSS
        </p>
      </CenterCard>
    </GradientPage>
  );
}