import React, { useState, useEffect, useMemo } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";

const STATUS_OPTIONS = ["Ordered", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_STYLES = {
  Ordered:    { bg: "bg-amber-50",   text: "text-amber-600",   dot: "bg-amber-400" },
  Processing: { bg: "bg-blue-50",    text: "text-blue-600",    dot: "bg-blue-400" },
  Shipped:    { bg: "bg-violet-50",  text: "text-violet-600",  dot: "bg-violet-400" },
  Delivered:  { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400" },
  Cancelled:  { bg: "bg-red-50",     text: "text-red-500",     dot: "bg-red-400" },
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function getToken() {
  return localStorage.getItem("token");
}

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ status: "", priceRange: "all" });
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/getallorders", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleEdit = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/updateOrder/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status: editStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, orderStatus: editStatus } : o));
      setEditingId(null);
      showToast("Order status updated successfully");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/supplier/order/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setOrders((prev) => prev.filter((o) => o._id !== id));
      setShowConfirm(false);
      showToast("Order deleted successfully");
    } catch (err) {
      showToast(err.message, "error");
      setShowConfirm(false);
    }
  };

  const hasActiveFilters = filters.status || filters.priceRange !== "all";

  const clearFilters = () => {
    setFilters({ status: "", priceRange: "all" });
    setSearchQuery("");
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderId = order._id.slice(-8).toUpperCase();
      const name = `${order.user?.firstname} ${order.user?.lastname}`.toLowerCase();
      const email = order.user?.email?.toLowerCase() || "";
      const q = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || orderId.toLowerCase().includes(q) || name.includes(q) || email.includes(q);
      const matchesStatus = !filters.status || order.orderStatus === filters.status;
      let matchesPrice = true;
      const price = order.totalPriceAfterDiscount;
      if (filters.priceRange === "0-50") matchesPrice = price <= 50;
      else if (filters.priceRange === "50-200") matchesPrice = price > 50 && price <= 200;
      else if (filters.priceRange === "200-500") matchesPrice = price > 200 && price <= 500;
      else if (filters.priceRange === "500+") matchesPrice = price > 500;
      return matchesSearch && matchesStatus && matchesPrice;
    });
  }, [orders, searchQuery, filters]);

  const selectClass = "w-full px-3.5 py-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg outline-none appearance-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-150 cursor-pointer";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Management</p>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Supplier Orders</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {loading ? "Loading..." : `${orders.length} order${orders.length !== 1 ? "s" : ""} total`}
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-150 shadow-sm self-start sm:self-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
              <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Refresh
          </button>
        </div>

        {/* Search + Filter Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-4 overflow-hidden">
          <div className="px-5 py-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center border-b border-gray-100">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by order ID, name or email..."
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-150 ${
                  showFilters || hasActiveFilters ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                Filters
                {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-indigo-500"></span>}
              </button>
              {(hasActiveFilters || searchQuery) && (
                <button onClick={clearFilters} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-all duration-150">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
                <div className="relative">
                  <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className={selectClass}>
                    <option value="">All Statuses</option>
                    {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Price Range</label>
                <div className="relative">
                  <select value={filters.priceRange} onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })} className={selectClass}>
                    <option value="all">All Prices</option>
                    <option value="0-50">$0 – $50</option>
                    <option value="50-200">$50 – $200</option>
                    <option value="200-500">$200 – $500</option>
                    <option value="500+">$500+</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="w-8 h-8 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm text-gray-400">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">
                  {hasActiveFilters || searchQuery ? "No orders match your filters" : "No orders yet"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {hasActiveFilters || searchQuery ? "Try adjusting your search or filters" : "Orders will appear here once placed"}
                </p>
              </div>
              {(hasActiveFilters || searchQuery) && (
                <button onClick={clearFilters} className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["#", "Order ID", "Customer", "Items", "Shipping", "Total", "Paid At", "Status", "Actions"].map((h) => (
                      <th key={h} className={`px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap ${
                        h === "Actions" ? "text-center" : h === "Total" ? "text-right" : "text-left"
                      }`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.map((order, index) => {
                    const statusStyle = STATUS_STYLES[order.orderStatus] || STATUS_STYLES.Ordered;
                    const isEditing = editingId === order._id;

                    return (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-100 group">

                        {/* # */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="text-xs font-mono font-medium text-gray-400">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </td>

                        {/* Order ID */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-xs font-mono font-medium text-gray-600">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="text-sm font-medium text-gray-800">
                            {order.user?.firstname} {order.user?.lastname}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{order.user?.email}</p>
                        </td>

                        {/* Items */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1">
                            {order.orderItems.map((item) => (
                              <span key={item._id} className="inline-flex items-center gap-1.5 text-xs text-gray-600">
                                <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 font-medium">
                                  {item.product?.title}
                                </span>
                                <span className="text-gray-400">×{item.quantity}</span>
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Shipping */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="text-xs text-gray-600">{order.shippingInfo.city}, {order.shippingInfo.state}</p>
                          <p className="text-xs text-gray-400">{order.shippingInfo.pincode}</p>
                        </td>

                        {/* Total */}
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <span className="text-sm font-semibold text-gray-800">${order.totalPriceAfterDiscount}</span>
                          {order.totalPrice !== order.totalPriceAfterDiscount && (
                            <p className="text-xs text-gray-400 line-through">${order.totalPrice}</p>
                          )}
                        </td>

                        {/* Paid At */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="text-xs text-gray-500">{formatDate(order.paidAt)}</span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          {isEditing ? (
                            <div className="relative">
                              <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                className="px-2.5 py-1.5 pr-6 text-xs text-gray-800 bg-white border border-indigo-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 appearance-none cursor-pointer"
                              >
                                {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                              </select>
                              <svg className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          ) : (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                              {order.orderStatus}
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleEdit(order._id)}
                                  className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-150"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-150"
                                >
                                  ✕
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => { setEditingId(order._id); setEditStatus(order.orderStatus); }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-150"
                                >
                                  <BiEdit className="w-3.5 h-3.5" />
                                </button>
                     
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {!loading && filteredOrders.length > 0 && (
            <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing <span className="font-medium text-gray-600">{filteredOrders.length}</span> of{" "}
                <span className="font-medium text-gray-600">{orders.length}</span> orders
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors">
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Delete Order</h4>
                <p className="text-xs text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete this order? All associated data will be permanently removed.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg transition-colors shadow-sm"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg border flex items-center gap-2 ${
          toast.type === "error" ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
        }`}>
          {toast.type === "error"
            ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={2}/><line x1="12" y1="8" x2="12" y2="12" strokeWidth={2}/><line x1="12" y1="16" x2="12.01" y2="16" strokeWidth={2}/></svg>
            : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
          }
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default OrderList;