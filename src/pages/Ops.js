import React, { useMemo, useState } from "react";
import Navbar from "../components/Navbar";

// --- localStorage helpers ---
function getArray(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}
function setArray(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr || []));
}

const money = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(n)
    : n;

export default function Ops() {
  // base data
  const [payments, setPayments] = useState(() =>
    getArray("pss_payments").map((p, i) => ({ id: p.id ?? i, ...p }))
  );

  // filters
  const [qAccount, setQAccount] = useState("");
  const [qPayee, setQPayee] = useState("");

  // selection + editable copy
  const [selectedId, setSelectedId] = useState(null);
  const selected = useMemo(
    () => payments.find((p) => p.id === selectedId) || null,
    [payments, selectedId]
  );
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState(null);

  // compute filtered rows
  const rows = useMemo(() => {
    const a = qAccount.trim().toLowerCase();
    const p = qPayee.trim().toLowerCase();
    return payments.filter((r) => {
      const matchA = a ? (r.accountNumber || "").toString().toLowerCase().includes(a) : true;
      const matchP = p ? (r.payee || r.payeeName || "").toLowerCase().includes(p) : true;
      return matchA && matchP;
    });
  }, [payments, qAccount, qPayee]);

  // when pick a row to edit
  function onSelect(row) {
    setSelectedId(row.id);
    setForm({
      accountNumber: row.accountNumber || "",
      payee: row.payee || row.payeeName || "",
      type: (row.type || "").toLowerCase() || "debit",
      amount: typeof row.amount === "number" ? row.amount : Number(row.amount || 0),
      date: row.date || row.paymentDate || "",
      status: row.status || "",
      source: row.source || row.sourceOfPayment || "",
    });
    setMsg(null);
  }

  function onCancel() {
    setSelectedId(null);
    setForm(null);
    setMsg(null);
  }

  function onSave(e) {
    e.preventDefault();
    setMsg(null);

    // simple validation
    if (!form) return;
    if (!form.accountNumber) {
      setMsg({ type: "error", text: "Account # is required." });
      return;
    }
    if (!form.date) {
      setMsg({ type: "error", text: "Payment date is required." });
      return;
    }
    if (form.type !== "debit" && form.type !== "credit") {
      setMsg({ type: "error", text: "Type must be debit or credit." });
      return;
    }

    // update in memory
    const next = payments.map((r) =>
      r.id === selectedId
        ? {
            ...r,
            accountNumber: form.accountNumber,
            payee: form.payee,
            type: form.type,
            amount: Number(form.amount || 0),
            date: form.date,
            status: form.status,
            source: form.source,
          }
        : r
    );

    // persist
    setPayments(next);
    setArray("pss_payments", next);

    setMsg({ type: "success", text: "Payment updated." });
    // keep selection so user can continue editing, or uncomment to clear:
    // onCancel();
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-indigo-50 via-white to-indigo-100 text-indigo-900">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-indigo-800">
            Payment Maintenance
          </h1>
          <p className="text-indigo-700/70 mt-1">
            Search, select, and update any payment record.
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
                value={qAccount}
                onChange={(e) => setQAccount(e.target.value)}
                className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="e.g. 1001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-indigo-800 mb-1">
                Payee (contains)
              </label>
              <input
                type="text"
                value={qPayee}
                onChange={(e) => setQPayee(e.target.value)}
                className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="e.g. Amazon"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setQAccount("");
                  setQPayee("");
                }}
                className="inline-flex items-center rounded-lg border border-indigo-200 px-4 py-2 text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </section>

        {/* Edit Form */}
        <section className="bg-white/90 border border-indigo-100 rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-semibold text-indigo-800 mb-4">
            {selected ? "Edit Payment" : "Select a row to edit"}
          </h2>

          {selected ? (
            <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">
                  Account #
                </label>
                <input
                  type="text"
                  value={form.accountNumber}
                  onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                  className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">
                  Payee
                </label>
                <input
                  type="text"
                  value={form.payee}
                  onChange={(e) => setForm({ ...form, payee: e.target.value })}
                  className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">
                  Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="debit">debit</option>
                  <option value="credit">credit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">
                  Status
                </label>
                <input
                  type="text"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="e.g. posted, pending"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-indigo-800 mb-1">
                  Source of Payment
                </label>
                <input
                  type="text"
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="e.g. ACH, Wire, UPI"
                />
              </div>

              {msg && (
                <div
                  className={`md:col-span-2 text-sm ${
                    msg.type === "error" ? "text-red-600" : "text-green-700"
                  }`}
                >
                  {msg.text}
                </div>
              )}

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-lg bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="inline-flex items-center rounded-lg border border-indigo-200 px-4 py-2 text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <p className="text-indigo-700/70">Pick a row below to edit.</p>
          )}
        </section>

        {/* Results */}
        <section className="bg-white/90 border border-indigo-100 rounded-2xl shadow-lg">
          <div className="p-4 sm:p-6 border-b border-indigo-100">
            <h2 className="text-lg font-semibold text-indigo-800">
              Payments <span className="text-indigo-700/60">(Rows: {rows.length})</span>
            </h2>
          </div>

          {rows.length === 0 ? (
            <div className="p-6 text-indigo-700/70">
              No rows found. Adjust filters or add payments first.
            </div>
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
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Source</th>
                    <th className="px-4 py-3 text-left font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr
                      key={r.id ?? `${r.accountNumber}-${r.date}-${i}`}
                      className={i % 2 ? "bg-white" : "bg-indigo-50/40"}
                    >
                      <td className="px-4 py-3">{r.date || "-"}</td>
                      <td className="px-4 py-3">{r.accountNumber || "-"}</td>
                      <td className="px-4 py-3">{r.payee || r.payeeName || "-"}</td>
                      <td className="px-4 py-3 capitalize">{(r.type || "").toLowerCase() || "-"}</td>
                      <td className="px-4 py-3 text-right">{money(Number(r.amount || 0))}</td>
                      <td className="px-4 py-3">{r.status || "-"}</td>
                      <td className="px-4 py-3">{r.source || r.sourceOfPayment || "-"}</td>
                      <td className="px-4 py-3">
                        <button
                          className="text-indigo-700 hover:underline"
                          onClick={() => onSelect(r)}
                        >
                          Edit
                        </button>
                      </td>
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