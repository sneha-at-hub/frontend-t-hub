import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const ListSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewSupplier, setViewSupplier] = useState(null);

  const token = localStorage.getItem("token");

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/supplier/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuppliers(res.data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() => {
    if (!searchQuery) return suppliers;
    const q = searchQuery.toLowerCase();
    return suppliers.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.businessName?.toLowerCase().includes(q) ||
        s.phone?.toLowerCase().includes(q) ||
        s.panVat?.toLowerCase().includes(q)
    );
  }, [suppliers, searchQuery]);

  const avatarColors = [
    "bg-violet-100 text-violet-600",
    "bg-indigo-100 text-indigo-600",
    "bg-sky-100 text-sky-600",
    "bg-emerald-100 text-emerald-600",
    "bg-rose-100 text-rose-600",
    "bg-amber-100 text-amber-600",
  ];

  const getAvatarColor = (id) => {
    const sum = id?.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) || 0;
    return avatarColors[sum % avatarColors.length];
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "S";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Management</p>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Suppliers</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {loading ? "Loading..." : `${suppliers.length} registered supplier${suppliers.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {/* Search Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-4 overflow-hidden">
          <div className="px-5 py-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, email, business or PAN/VAT..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder-gray-400 transition-all duration-150"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="w-8 h-8 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm text-gray-400">Loading suppliers...</p>
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">
                  {searchQuery ? "No suppliers match your search" : "No suppliers found"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {searchQuery ? "Try adjusting your search" : "Suppliers will appear here once added"}
                </p>
              </div>
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["#", "Supplier", "Email", "Phone", "Business Name", "PAN / VAT", "Address", "Joined", "Actions"].map((h) => (
                      <th key={h} className={`px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap ${
                        h === "Actions" ? "text-center" : "text-left"
                      }`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredSuppliers.map((s, index) => (
                    <tr key={s._id} className="hover:bg-gray-50 transition-colors duration-100 group">

                      {/* # */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono font-medium text-gray-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </td>

                      {/* Supplier */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getAvatarColor(s._id)}`}>
                            {getInitials(s.name)}
                          </div>
                          <span className="text-sm font-medium text-gray-800">{s.name}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{s.email}</span>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">{s.phone || <span className="text-gray-300">—</span>}</span>
                      </td>

                      {/* Business Name */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 text-xs font-medium text-indigo-600">
                          {s.businessName}
                        </span>
                      </td>

                      {/* PAN / VAT */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {s.panVat ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-xs font-mono font-medium text-gray-600">
                            {s.panVat}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>

                      {/* Address */}
                      <td className="px-5 py-4 max-w-[180px]">
                        <span className="text-xs text-gray-500 truncate block">{s.address || <span className="text-gray-300">—</span>}</span>
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs text-gray-500">
                          {new Date(s.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => setViewSupplier(s)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-150"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {!loading && filteredSuppliers.length > 0 && (
            <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing <span className="font-medium text-gray-600">{filteredSuppliers.length}</span> of{" "}
                <span className="font-medium text-gray-600">{suppliers.length}</span> suppliers
              </p>
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors">
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* View Supplier Modal */}
      {viewSupplier && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-200 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${getAvatarColor(viewSupplier._id)}`}>
                  {getInitials(viewSupplier.name)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{viewSupplier.name}</h4>
                  <p className="text-xs text-gray-400">{viewSupplier.email}</p>
                </div>
              </div>
              <button onClick={() => setViewSupplier(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-3">
              {[
                { label: "Supplier ID", value: viewSupplier._id, mono: true },
                { label: "Phone", value: viewSupplier.phone || "—" },
                { label: "PAN / VAT", value: viewSupplier.panVat || "—", mono: true },
                { label: "Business Name", value: viewSupplier.businessName || "—" },
                { label: "Address", value: viewSupplier.address || "—" },
                { label: "Business Address", value: viewSupplier.businessAddress || "—" },
                { label: "Role", value: viewSupplier.role },
                {
                  label: "Joined",
                  value: new Date(viewSupplier.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
                },
                {
                  label: "Last Updated",
                  value: new Date(viewSupplier.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
                },
              ].map(({ label, value, mono }) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{label}</span>
                  <span className={`text-xs text-right text-gray-700 break-all ${mono ? "font-mono" : "font-medium"}`}>{String(value)}</span>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setViewSupplier(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListSupplier;