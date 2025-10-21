import React from "react";
import { GradientPage, CenterCard } from "../components/Layout";
import Navbar from "../components/Navbar";

export default function Ops() {
  return (
    <GradientPage>
      <CenterCard className="p-10">
        <Navbar />
        <h1 className="text-3xl font-bold text-center text-sky-800 mb-3">Payment Maintenance</h1>
        <p className="text-gray-600 text-center mb-8 text-lg">Update or modify existing payments</p>

        <div className="space-y-5 text-lg">
          <div className="grid grid-cols-2 gap-4">
            <input className="border border-gray-300 rounded-lg p-3" placeholder="Payee Name" />
            <input className="border border-gray-300 rounded-lg p-3" placeholder="Account Number" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input className="border border-gray-300 rounded-lg p-3" placeholder="Amount" />
            <select className="border border-gray-300 rounded-lg p-3 bg-white">
              <option>Debit</option>
              <option>Credit</option>
            </select>
          </div>

          {/* NEW: Source of Payment */}
          <select className="border border-gray-300 rounded-lg p-3 bg-white">
            <option value="">Source of Payment</option>
            <option>Wire Transfer</option>
            <option>ACH</option>
            <option>Internal Transfer</option>
            <option>Check</option>
            <option>Cash</option>
          </select>

          <input type="date" className="border border-gray-300 rounded-lg p-3" placeholder="Payment Date" />

          <button className="bg-sky-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-sky-700">
            Update Payment
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-10">
          © 2025 PSSPOC — Built with ❤️ using React & Tailwind CSS
        </p>
      </CenterCard>
    </GradientPage>
  );
}