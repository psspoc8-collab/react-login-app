import React, { useState } from "react";
import Navbar from "../components/Navbar";

/**
 * Account Addition screen (indigo theme, spacious layout)
 * Persists accounts into localStorage under key: "pss_accounts"
 */
export default function AccountAdd() {
  const [form, setForm] = useState({
    accountNumber: "",
    name: "",
    address: "",
    state: "",
    country: "",
    zip: "",
    contact: "",
  });
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const resetForm = () =>
    setForm({
      accountNumber: "",
      name: "",
      address: "",
      state: "",
      country: "",
      zip: "",
      contact: "",
    });

  function validate() {
    if (!form.accountNumber.trim()) return "Account number is required.";
    if (!/^[0-9A-Za-z\-]+$/.test(form.accountNumber.trim()))
      return "Account number can contain letters, numbers, and dashes.";
    if (!form.name.trim()) return "Name is required.";
    if (form.zip && !/^[0-9A-Za-z\- ]{3,12}$/.test(form.zip))
      return "ZIP/Postal looks invalid.";
    if (form.contact && !/^[0-9+\-() ]{7,20}$/.test(form.contact))
      return "Contact number looks invalid.";
    return null;
  }

  function saveToLocalStorage(record) {
    try {
      const key = "pss_accounts";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      // if same accountNumber exists, update it; else push
      const ix = existing.findIndex(
        (a) =>
          (a.accountNumber || "").toLowerCase() ===
          record.accountNumber.toLowerCase()
      );
      if (ix >= 0) {
        existing[ix] = { ...existing[ix], ...record, updatedAt: Date.now() };
      } else {
        existing.push({ ...record, createdAt: Date.now() });
      }
      localStorage.setItem(key, JSON.stringify(existing));
      return true;
    } catch (e) {
      console.error("localStorage write failed", e);
      return false;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    const err = validate();
    if (err) {
      setMsg({ type: "error", text: err });
      return;
    }
    setSaving(true);
    // Local-only persistence for now. (Hook up API here later if needed.)
    const ok = saveToLocalStorage({
      accountNumber: form.accountNumber.trim(),
      name: form.name.trim(),
      address: form.address.trim(),
      state: form.state.trim(),
      country: form.country.trim(),
      zip: form.zip.trim(),
      contact: form.contact.trim(),
    });
    setSaving(false);
    if (ok) {
      setMsg({ type: "success", text: "✅ Account saved successfully." });
    } else {
      setMsg({
        type: "error",
        text: "Failed to save. Storage is unavailable.",
      });
    }
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-indigo-50 via-white to-indigo-100 text-indigo-900">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/90 border border-indigo-100 rounded-2xl shadow-lg p-6 sm:p-8">
          <header className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-indigo-800">
              Account Addition
            </h1>
            <p className="text-indigo-700/70 mt-1">
              Create or update customer account details.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-indigo-800 mb-1">
                    Account Number<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.accountNumber}
                    onChange={onChange("accountNumber")}
                    className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="e.g. 1001-AB"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-indigo-800 mb-1">
                    Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={onChange("name")}
                    className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="John Doe"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-indigo-800 mb-1">
                    Address
                  </label>
                  <textarea
                    rows={3}
                    value={form.address}
                    onChange={onChange("address")}
                    className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Street, City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-indigo-800 mb-1">
                    State / Province
                  </label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={onChange("state")}
                    className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="CA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-indigo-800 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={onChange("country")}
                    className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="USA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-indigo-800 mb-1">
                    ZIP / Postal
                  </label>
                  <input
                    type="text"
                    value={form.zip}
                    onChange={onChange("zip")}
                    className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="10001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-indigo-800 mb-1">
                    Contact
                  </label>
                  <input
                    type="text"
                    value={form.contact}
                    onChange={onChange("contact")}
                    className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </section>

            {msg && (
              <div
                className={`rounded-lg p-3 text-sm ${
                  msg.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}
              >
                {msg.text}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-70"
              >
                {saving ? "Saving..." : "Save Account"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center rounded-lg border border-indigo-200 px-4 py-2 text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        <footer className="text-center text-xs text-indigo-700/60 mt-6">
          © 2025 PSSPOC — Built with ❤️ using React &amp; Tailwind CSS
        </footer>
      </main>
    </div>
  );
}