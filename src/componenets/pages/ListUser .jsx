import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ role: "", status: "all" });
  const [showFilters, setShowFilters] = useState(false);
  const [viewUser, setViewUser] = useState(null);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/user/all-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.mobile?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = !filters.role || user.role === filters.role;
      let matchesStatus = true;
      if (filters.status === "verified") matchesStatus = user.isVerified === true;
      else if (filters.status === "unverified") matchesStatus = user.isVerified === false;
      else if (filters.status === "blocked") matchesStatus = user.isBlocked === true;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, filters]);

  const hasActiveFilters = filters.role || filters.status !== "all";

  const clearFilters = () => {
    setFilters({ role: "", status: "all" });
    setSearchQuery("");
  };

  const getInitials = (first, last) =>
    `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();

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

  const selectClass =
    "w-full px-3.5 py-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg outline-none appearance-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-150 cursor-pointer";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Management</p>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Users</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {loading ? "Loading..." : `${users.length} registered user${users.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {/* Search + Filter Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-4 overflow-hidden">
          <div className="px-5 py-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center border-b border-gray-100">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, email or mobile..."
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
                  showFilters || hasActiveFilters
                    ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                Filters
                {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-indigo-500"></span>}
              </button>

              {(hasActiveFilters || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-all duration-150"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Role</label>
                <div className="relative">
                  <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })} className={selectClass}>
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
                <div className="relative">
                  <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className={selectClass}>
                    <option value="all">All Statuses</option>
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                    <option value="blocked">Blocked</option>
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
              <p className="text-sm text-gray-400">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">
                  {hasActiveFilters || searchQuery ? "No users match your filters" : "No users found"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {hasActiveFilters || searchQuery ? "Try adjusting your search or filters" : "Users will appear here once registered"}
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
                    {["#", "User", "Email", "Mobile", "Role", "Wishlist", "Joined", "Actions"].map((h) => (
                      <th key={h} className={`px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap ${
                        h === "Actions" || h === "Wishlist" ? "text-center" : "text-left"
                      }`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map((user, index) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-100 group">

                      {/* # */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono font-medium text-gray-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </td>

                      {/* User */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getAvatarColor(user._id)}`}>
                            {getInitials(user.firstname, user.lastname)}
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            {user.firstname} {user.lastname}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{user.email}</span>
                      </td>

                      {/* Mobile */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">{user.mobile || <span className="text-gray-300">—</span>}</span>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-violet-50 text-violet-600"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Wishlist */}
                      <td className="px-5 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.wishlist?.length > 0
                            ? "bg-rose-50 text-rose-500"
                            : "bg-gray-50 text-gray-400"
                        }`}>
                          {user.wishlist?.length || 0}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </td>

                      {/* Actions - View only */}
                      <td className="px-5 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => setViewUser(user)}
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
          {!loading && filteredUsers.length > 0 && (
            <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing <span className="font-medium text-gray-600">{filteredUsers.length}</span> of{" "}
                <span className="font-medium text-gray-600">{users.length}</span> users
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

      {/* View User Modal */}
      {viewUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-200 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${getAvatarColor(viewUser._id)}`}>
                  {getInitials(viewUser.firstname, viewUser.lastname)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{viewUser.firstname} {viewUser.lastname}</h4>
                  <p className="text-xs text-gray-400">{viewUser.email}</p>
                </div>
              </div>
              <button onClick={() => setViewUser(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-3">
              {[
                { label: "User ID", value: viewUser._id, mono: true },
                { label: "Mobile", value: viewUser.mobile || "—" },
                { label: "Role", value: viewUser.role },
                { label: "Verified", value: viewUser.isVerified === true ? "Yes" : viewUser.isVerified === false ? "No" : "—" },
                { label: "Blocked", value: viewUser.isBlocked ? "Yes" : "No" },
                { label: "Cart Items", value: viewUser.cart?.length ?? 0 },
                { label: "Wishlist Items", value: viewUser.wishlist?.length ?? 0 },
                {
                  label: "Joined",
                  value: new Date(viewUser.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
                },
                {
                  label: "Last Updated",
                  value: new Date(viewUser.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
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
                onClick={() => setViewUser(null)}
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

export default ListUser;