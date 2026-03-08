import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Categorylist = () => {
  const [categories, setCategories] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const token = localStorage.getItem("token");

  const getCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/category", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getCategories(); }, []);

  const deleteCategory = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/category/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Category deleted successfully!");
      setShowModal(false);
      getCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const filtered = categories.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

  return (
    <div className="min-h-screen bg-gray-50  px-4">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="mb-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Management</p>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Categories</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {loading ? "Loading..." : `${categories.length} categor${categories.length !== 1 ? "ies" : "y"} registered`}
            </p>
          </div>

          <Link
            to="/admin/add-category"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 active:bg-red-800 transition-all duration-150 shadow-sm self-start sm:self-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </Link>
        </div>

        {/* Table Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-9 pr-3.5 py-2 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder-gray-400 transition-all duration-150"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {search && (
              <p className="text-xs text-gray-400 flex-shrink-0">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} for{" "}
                <span className="font-medium text-gray-600">"{search}"</span>
              </p>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="w-8 h-8 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm text-gray-400">Loading categories...</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-12">#</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Subcategories</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Promo</th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((cat, index) => (
                    <React.Fragment key={cat._id}>
                      <tr className="hover:bg-gray-50/80 transition-colors duration-100 group">

                        {/* # */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="text-xs font-mono font-medium text-gray-400">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </td>

                        {/* Category name */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-violet-500">
                                {cat.title.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-800">{cat.title}</span>
                          </div>
                        </td>

                        {/* Subcategories */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          {cat.sub?.length > 0 ? (
                            <button
                              onClick={() => toggleExpand(cat._id)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-50 hover:bg-violet-100 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h8" />
                              </svg>
                              <span className="text-xs font-semibold text-violet-600">{cat.sub.length} sub{cat.sub.length !== 1 ? "s" : ""}</span>
                              <svg
                                className={`w-3 h-3 text-violet-400 transition-transform duration-200 ${expanded === cat._id ? "rotate-180" : ""}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400 italic">None</span>
                          )}
                        </td>

                        {/* Promo */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          {cat.promo?.title ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-100">
                              <svg className="w-3 h-3 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              <span className="text-xs font-semibold text-rose-500 max-w-[100px] truncate">{cat.promo.title}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/admin/category/${cat._id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-150"
                            >
                              <BiEdit className="w-3.5 h-3.5" />
                           
                            </Link>
                            <button
                              onClick={() => { setDeleteId(cat._id); setShowModal(true); }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-150"
                            >
                              <AiFillDelete className="w-3.5 h-3.5" />
                    
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded subcategory detail row */}
                      {expanded === cat._id && cat.sub?.length > 0 && (
                        <tr className="bg-violet-50/40">
                          <td colSpan={5} className="px-5 py-4">
                            <div className="flex flex-wrap gap-3 ml-11">
                              {cat.sub.map((s) => (
                                <div key={s._id} className="bg-white border border-violet-100 rounded-xl px-4 py-3 min-w-[160px]">
                                  <p className="text-xs font-semibold text-violet-600 mb-2 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block"></span>
                                    {s.name}
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {s.items?.map((item, i) => (
                                      <span key={i} className="px-2 py-0.5 text-[11px] bg-violet-50 text-violet-500 rounded-md font-medium border border-violet-100">
                                        {item}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}

                              {/* Promo detail if exists */}
                              {cat.promo?.title && (
                                <div className="bg-white border border-rose-100 rounded-xl px-4 py-3 min-w-[160px]">
                                  <p className="text-xs font-semibold text-rose-500 mb-2 flex items-center gap-1.5">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    {cat.promo.title}
                                  </p>
                                  <p className="text-[11px] text-gray-500 mb-1">{cat.promo.sub}</p>
                                  <span className="px-2 py-0.5 text-[11px] bg-rose-50 text-rose-500 rounded-md font-medium border border-rose-100">
                                    {cat.promo.cta}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">
                  {search ? "No categories match your search" : "No categories yet"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {search ? "Try a different keyword" : "Add your first category to get started"}
                </p>
              </div>
              {!search && (
                <Link
                  to="/admin/add-category"
                  className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Category
                </Link>
              )}
            </div>
          )}

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing <span className="font-medium text-gray-600">{filtered.length}</span> of{" "}
                <span className="font-medium text-gray-600">{categories.length}</span> categories
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Delete Category</h4>
                <p className="text-xs text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete this category? Products associated with it may be affected.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteCategory}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg transition-colors shadow-sm"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categorylist;