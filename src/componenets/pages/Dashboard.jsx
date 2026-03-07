import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { base_url } from "../../utils/baseUrl";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ── helpers ───────────────────────────────────────────────────────────────────
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const countFrom = (data) => {
  if (Array.isArray(data)) return data.length;
  if (data && typeof data === "object") {
    for (const key of ["data","users","orders","products","categories","suppliers","brands","results","items"]) {
      if (Array.isArray(data[key])) return data[key].length;
    }
    if (typeof data.count === "number") return data.count;
    if (typeof data.total === "number") return data.total;
  }
  return 0;
};

const fmt = (n) =>
  Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── CountUp animation ──────────────────────────────────────────────────────────
const CountUp = ({ target, loading, prefix = "", decimals = false }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (loading || target === 0) { setCount(0); return; }
    let start = 0;
    const steps = 40;
    const increment = target / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 900 / steps);
    return () => clearInterval(timer);
  }, [target, loading]);
  return <span>{prefix}{decimals ? fmt(count) : Math.floor(count).toLocaleString()}</span>;
};

// ── Custom chart tooltip ───────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, prefix = "" }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3">
        <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-900">{prefix}{Number(payload[0].value).toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

// ── Status badge ───────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    Ordered:    "bg-blue-50 text-blue-600",
    Processing: "bg-amber-50 text-amber-600",
    Dispatched: "bg-indigo-50 text-indigo-600",
    Delivered:  "bg-emerald-50 text-emerald-600",
    Cancelled:  "bg-red-50 text-red-500",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${map[status] || "bg-gray-100 text-gray-500"}`}>
      {status || "—"}
    </span>
  );
};

// ── Stat cards config ──────────────────────────────────────────────────────────
const statsConfig = [
  {
    key: "users", label: "Customers", border: "border-indigo-100", text: "text-indigo-600", iconBg: "bg-indigo-100",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  },
  {
    key: "orders", label: "Orders", border: "border-emerald-100", text: "text-emerald-600", iconBg: "bg-emerald-100",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  },
  {
    key: "products", label: "Products", border: "border-orange-100", text: "text-orange-600", iconBg: "bg-orange-100",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" /></svg>,
  },
  {
    key: "categories", label: "Categories", border: "border-violet-100", text: "text-violet-600", iconBg: "bg-violet-100",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  },
  {
    key: "suppliers", label: "Suppliers", border: "border-sky-100", text: "text-sky-600", iconBg: "bg-sky-100",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  },
  {
    key: "brands", label: "Brands", border: "border-rose-100", text: "text-rose-600", iconBg: "bg-rose-100",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>,
  },
];

// ═════════════════════════════════════════════════════════════════════════════
const Dashboard = () => {
  const token = localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const [stats, setStats]                   = useState({ users:0, orders:0, products:0, categories:0, suppliers:0, brands:0 });
  const [yearly, setYearly]                 = useState({ amount: 0, count: 0 });
  const [monthlyIncome, setMonthlyIncome]   = useState([]);
  const [monthlySales, setMonthlySales]     = useState([]);
  const [orders, setOrders]                 = useState([]);
  const [statsLoading, setStatsLoading]     = useState(true);
  const [chartsLoading, setChartsLoading]   = useState(true);

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  // ── fetch counts ─────────────────────────────────────────────────────────────
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const [usersRes, ordersRes, productsRes, categoriesRes, suppliersRes, brandsRes] = await Promise.all([
        axios.get(`${base_url}user/all-users`, authHeaders),
        axios.get(`${base_url}user/getallorders`, authHeaders),
        axios.get(`${base_url}product`),
        axios.get(`${base_url}category`),
     
        axios.get(`${base_url}supplier/`, authHeaders),
        axios.get(`${base_url}brand/`),
      ]);
      setStats({
        users:      countFrom(usersRes.data),
        orders:     countFrom(ordersRes.data),
        products:   countFrom(productsRes.data),
        categories: countFrom(categoriesRes.data),
        suppliers:  countFrom(suppliersRes.data),
        brands:     countFrom(brandsRes.data),
      });
    } catch {
      toast.error("Failed to load dashboard stats");
    } finally {
      setStatsLoading(false);
    }
  };

  // ── fetch charts + orders ─────────────────────────────────────────────────────
  const fetchCharts = async () => {
    setChartsLoading(true);
    try {
      const [monthlyRes, yearlyRes, ordersRes] = await Promise.all([
        axios.get(`${base_url}user/getMonthWiseOrderIncome`, authHeaders),
        axios.get(`${base_url}user/getyearlyorders`, authHeaders),
        axios.get(`${base_url}user/getallorders`, authHeaders),
      ]);

      // yearly summary
      const yr = Array.isArray(yearlyRes.data) ? yearlyRes.data[0] : yearlyRes.data;
      setYearly({ amount: yr?.amount || 0, count: yr?.count || 0 });

      // monthly charts — month index from API is 1-based
      const monthly = Array.isArray(monthlyRes.data) ? monthlyRes.data : [];
      setMonthlyIncome(monthly.map((m) => ({ month: MONTH_NAMES[(m._id?.month ?? 1) - 1], value: m.amount || 0 })));
      setMonthlySales(monthly.map((m)  => ({ month: MONTH_NAMES[(m._id?.month ?? 1) - 1], value: m.count  || 0 })));

      // recent orders
      const raw = Array.isArray(ordersRes.data) ? ordersRes.data
        : Array.isArray(ordersRes.data?.orders) ? ordersRes.data.orders : [];
      setOrders(raw.slice(0, 20));
    } catch (e) {
      console.error(e);
      toast.error("Failed to load chart data");
    } finally {
      setChartsLoading(false);
    }
  };

  useEffect(() => { fetchStats(); fetchCharts(); }, []);

  // ── render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Overview</p>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">{greeting}! Here's what's happening in your store.</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => { fetchStats(); fetchCharts(); }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
            >
              <svg className={`w-4 h-4 ${(statsLoading || chartsLoading) ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <span className="text-xs text-gray-400 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
              {now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>

        {/* Yearly summary */}
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              label: "Total Income (This Year)", value: yearly.amount, prefix: "$", decimals: true,
              border: "border-emerald-100", text: "text-emerald-600", iconBg: "bg-emerald-100",
              icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            },
            {
              label: "Total Sales (This Year)", value: yearly.count, prefix: "", decimals: false,
              border: "border-indigo-100", text: "text-indigo-600", iconBg: "bg-indigo-100",
              icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
            },
          ].map((card) => (
            <div key={card.label} className={`bg-white border ${card.border} rounded-xl shadow-sm p-6 flex items-center justify-between`}>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{card.label}</p>
                <p className={`text-3xl font-bold tracking-tight ${card.text}`}>
                  <CountUp target={Number(card.value)} loading={chartsLoading} prefix={card.prefix} decimals={card.decimals} />
                </p>
                <p className="text-xs text-gray-400 mt-1">Last 12 months from today</p>
              </div>
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${card.iconBg} ${card.text} flex-shrink-0`}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Count stats grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statsConfig.map((stat) => (
            <div key={stat.key} className={`bg-white border ${stat.border} rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow duration-200`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{stat.label}</p>
                  <p className={`text-4xl font-bold tracking-tight ${stat.text}`}>
                    <CountUp target={stats[stat.key]} loading={statsLoading} />
                  </p>
                </div>
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${stat.iconBg} ${stat.text} flex-shrink-0`}>
                  {stat.icon}
                </div>
              </div>
              <div className={`mt-4 pt-4 border-t ${stat.border}`}>
                <span className="text-xs text-gray-400">
                  {statsLoading ? "Fetching..." : stats[stat.key] > 0 ? `${stats[stat.key]} total registered` : "No records found"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Income chart */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="mb-5">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Revenue</p>
              <h2 className="text-base font-bold text-gray-900">Monthly Income</h2>
            </div>
            {chartsLoading ? (
              <div className="flex items-center justify-center h-48">
                <svg className="w-6 h-6 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : monthlyIncome.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-sm text-gray-400">No income data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyIncome} barSize={24} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={52}
                    tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                  <Tooltip content={<CustomTooltip prefix="Rs. " />} cursor={{ fill: "#f3f4f6" }} />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Sales chart */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="mb-5">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Volume</p>
              <h2 className="text-base font-bold text-gray-900">Monthly Orders</h2>
            </div>
            {chartsLoading ? (
              <div className="flex items-center justify-center h-48">
                <svg className="w-6 h-6 animate-spin text-emerald-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : monthlySales.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-sm text-gray-400">No sales data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlySales} barSize={24} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f3f4f6" }} />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Orders table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Latest Activity</p>
              <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
            </div>
            {!chartsLoading && (
              <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 font-medium">
                {orders.length} orders
              </span>
            )}
          </div>

          {chartsLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <svg className="w-7 h-7 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm text-gray-400">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 font-medium">No orders yet</p>
              <p className="text-xs text-gray-400">Orders will appear here once placed</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["#", "Customer", "Items", "Total Price", "After Discount", "Status", "Date"].map((h) => (
                      <th key={h} className={`px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap ${
                        h === "Items" || h === "Total Price" || h === "After Discount" ? "text-right"
                        : h === "Status" ? "text-center" : "text-left"
                      }`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order, i) => (
                    <tr key={order._id || i} className="hover:bg-gray-50 transition-colors duration-100">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono font-medium text-gray-400">{String(i + 1).padStart(2, "0")}</span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-800">
                          {order.user ? `${order.user.firstname || ""} ${order.user.lastname || ""}`.trim() : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                          {order.orderItems?.length ?? 0}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-semibold text-gray-800">Rs. {fmt(order.totalPrice ?? 0)}</span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        {order.totalPriceAfterDiscount != null ? (
                          <span className="text-sm font-semibold text-emerald-600">Rs. {fmt(order.totalPriceAfterDiscount)}</span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-center">
                        <StatusBadge status={order.orderStatus} />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs text-gray-400">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!chartsLoading && orders.length > 0 && (
            <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-400">
                Showing <span className="font-medium text-gray-600">{orders.length}</span> most recent orders
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;