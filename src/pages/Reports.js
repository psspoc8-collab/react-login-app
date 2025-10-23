import React, { useMemo, useState } from "react";
import Navbar from "../components/Navbar";

/**
 * Reports screen (no CSV download)
 * - Reads payments from localStorage key: "pss_payments"
 * - Optionally reads accounts from "pss_accounts" (for future enrichment)
 * - Filters: account contains, date range, min/max balance
 * - Computes running balance per account (credit adds, debit subtracts)
 */

function getArray(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

const money = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(n)
    : n;

export default function Reports() {
  // Filters
  const [accountQuery, setAccountQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [minBal, setMinBal] = useState("");
  const [maxBal, setMaxBal] = useState("");

  // Load data
  const paymentsRaw = getArray("pss_payments"); // expects fields like: accountNumber, payee, type ('debit'/'credit'), amount (number), date (YYYY-MM-DD), status, source
  const accounts = getArray("pss_accounts");

  // Normalize + computed balance per account
  const payments = useMemo(() => {
    // Clone and coerce types
    const items = paymentsRaw
      .map((p) => ({
        ...p,
        accountNumber: (p.accountNumber || "").toString(),
        payee: p.payee || p.payeeName || "",
        type: (p.type || "").toLowerCase(), // 'debit' | 'credit'
        amount: typeof p.amount === "number" ? p.amount : Number(p.amount || 0),
        date: p.date || p.paymentDate || "",
        status: p.status || "",
        source: p.source || p.sourceOfPayment || "",
      }))
      // Keep only entries that have the minimum necessary fields
      .filter((p) => p.accountNumber && p.date && !Number.isNaN(p.amount));

    // Sort by accountNumber, then date asc for running balance
    items.sort((a, b) => {
      if (a.accountNumber.toLowerCase() < b.accountNumber.toLowerCase()) return -1;
      if (a.accountNumber.toLowerCase() > b.accountNumber.toLowerCase()) return 1;
      return (a.date || "").localeCompare(b.date || "");
    });

    // Compute running balance per account
    const balances = new Map(); // accountNumber -> current balance
    return items.map((p) => {
      const acct = p.accountNumber.toLowerCase();
      const curr = balances.get(acct) || 0;
      const next =
        p.type === "credit" ? curr + p.amount : p.type === "debit" ? curr - p.amount : curr;
      balances.set(acct, next);
      return { ...p, balance: next };
    });
  }, [paymentsRaw]);

  // Apply filters
  const filtered = useMemo(() => {
    const q = accountQuery.trim().toLowerCase();
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;
    const min = minBal !== "" ? Number(minBal) : null;
    const max = maxBal !== "" ? Number(maxBal) : null;

    return payments.filter((r) => {
      // account contains
      if (q && !r.accountNumber.toLowerCase().includes(q)) return false;

      // date range (inclusive)
      if (fromDate || toDate) {
        const d = new Date(r.date);
        if (Number.isNaN(d.getTime())) return false;
        if (fromDate && d < fromDate) return false;
        if (toDate) {
          // include the entire "to" day
          const toInclusive = new Date(toDate);
          toInclusive.setHours(23, 59, 59, 999);
          if (d > toInclusive) return false;
        }
      }

      // min/max balance
      if (min !== null && r.balance < min) return false;
      if (max !== null && r.balance > max) return false;

      return true;
    });
  }, [payments, accountQuery, from, to, minBal, maxBal]);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-indigo-50 via-white to-indigo-100 text-indigo-900">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-indigo-800">
            Reporting
          </h1>
          <p className="text-indigo-700/70 mt-1">
            Filter statements by account, date range, and running balance.
          </p>
        </header>

        {/* Filters */}
        <section className="bg-white/90 border border-indigo-100 rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-indigo-800 mb-1">
                Account # (contains)
              </label>
              <input
                type="text"
                value={accountQuery}
                onChange={(e) => setAccountQuery(e.target.value)}
                className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="e.g. 1001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-800 mb-1">
                From
              </label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-800 mb-1">
                To
              </label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-800 mb-1">
                Min Balance
              </label>
              <input
                type="number"
                value={minBal}
                onChange={(e) => setMinBal(e.target.value)}
                className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="e.g. 0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-800 mb-1">
                Max Balance
              </label>
              <input
                type="number"
                value={maxBal}
                onChange={(e) => setMaxBal(e.target.value)}
                className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="e.g. 10000"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setAccountQuery("");
                  setFrom("");
                  setTo("");
                  setMinBal("");
                  setMaxBal("");
                }}
                className="inline-flex items-center rounded-lg border border-indigo-200 px-4 py-2 text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="bg-white/90 border border-indigo-100 rounded-2xl shadow-lg">
          <div className="p-4 sm:p-6 border-b border-indigo-100">
            <h2 className="text-lg font-semibold text-indigo-800">
              Statement Results <span className="text-indigo-700/60">(Rows: {filtered.length})</span>
            </h2>
          </div>

          {filtered.length === 0 ? (
            <div className="p-6 text-indigo-700/70">No results. Adjust filters or add payments.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-indigo-50 text-indigo-900">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Account #</th>
                    <th className="px-4 py-3 text-left font-semibold">Payee</th>
                    <th className="px-4 py-3 text-left font-semibold">Type</th>
                    <th className="px-4 py-3 text-right font-semibold">Amount</th>
                    <th className="px-4 py-3 text-right font-semibold">Balance</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr
                      key={`${r.accountNumber}-${r.date}-${i}`}
                      className={i % 2 ? "bg-white" : "bg-indigo-50/40"}
                    >
                      <td className="px-4 py-3">{r.date}</td>
                      <td className="px-4 py-3">{r.accountNumber}</td>
                      <td className="px-4 py-3">{r.payee || "-"}</td>
                      <td className="px-4 py-3 capitalize">{r.type || "-"}</td>
                      <td className="px-4 py-3 text-right">{money(r.amount)}</td>
                      <td className="px-4 py-3 text-right">{money(r.balance)}</td>
                      <td className="px-4 py-3">{r.status || "-"}</td>
                      <td className="px-4 py-3">{r.source || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="text-center text-xs text-indigo-700/60 mt-6">
          © 2025 PSSPOC — Built with ❤️ using React &amp; Tailwind CSS
        </footer>
      </main>
    </div>
  );
}