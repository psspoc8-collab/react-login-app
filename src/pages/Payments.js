// src/pages/Payments.js
import React, { useState } from "react";
import Navbar from "../components/Navbar";

export default function Payments() {
  const [form, setForm] = useState({
    payeeName: "",
    payeeAddress: "",
    state: "",
    country: "",
    zip: "",
    accountNumber: "",
    amount: "",
    type: "debit",
    source: "",
    paymentDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleClear = () =>
    setForm({
      payeeName: "",
      payeeAddress: "",
      state: "",
      country: "",
      zip: "",
      accountNumber: "",
      amount: "",
      type: "debit",
      source: "",
      paymentDate: "",
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Payment:", form);
    alert("✅ Payment processed successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      {/* Top Navbar */}
      <Navbar active="payments" />

      {/* Centered Card */}
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-md border border-indigo-100 p-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-indigo-700 text-center mb-6">
            Payment Processing
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <input
              name="payeeName"
              value={form.payeeName}
              onChange={handleChange}
              placeholder="Payee Name"
              className="border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400"
            />
            <input
              name="payeeAddress"
              value={form.payeeAddress}
              onChange={handleChange}
              placeholder="Payee Address"
              className="border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400"
            />

            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              className="border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400"
            />
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Country"
              className="border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400"
            />

            <input
              name="zip"
              value={form.zip}
              onChange={handleChange}
              placeholder="ZIP Code"
              className="border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400"
            />
            <input
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              placeholder="Account Number"
              className="border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400"
            />

            <input
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Amount"
              type="number"
              className="border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400"
            />
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400"
            >
              <option value="debit">Debit</option>
              <option value="credit">Credit</option>
            </select>

            {/* ✅ Source of Payment full width */}
            <select
              name="source"
              value={form.source}
              onChange={handleChange}
              className="border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 col-span-1 md:col-span-2"
            >
              <option value="">Source of Payment</option>
              <option value="bank">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI / Wallet</option>
            </select>

            <input
              name="paymentDate"
              value={form.paymentDate}
              onChange={handleChange}
              type="date"
              className="border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 col-span-1 md:col-span-2"
            />

            <div className="col-span-1 md:col-span-2 flex items-center justify-center gap-4 mt-4">
              <button
                type="button"
                onClick={handleClear}
                className="px-5 py-2 rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Submit Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}