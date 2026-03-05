import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { AiFillDelete } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import "react-toastify/dist/ReactToastify.css";

const ColorList = () => {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const fetchColors = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/color", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setColors(res.data);
    } catch (err) {
      toast.error("Failed to fetch colors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchColors(); }, []);

  const deleteColor = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/color/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Color deleted successfully!");
      setShowModal(false);
      fetchColors();
    } catch (err) {
      toast.error("Failed to delete color");
    }
  };

  // Helper: get a readable label from a hex/css color value
  const getColorLabel = (val) => {
    if (!val) return "Unknown";
    return val.charAt(0).toUpperCase() + val.slice(1);
  };

  // Helper: determine if color is light (for contrast)
  const isLight = (hex) => {
    try {
      const c = hex.replace("#", "");
      if (c.length < 6) return true;
      const r = parseInt(c.slice(0, 2), 16);
      const g = parseInt(c.slice(2, 4), 16);
      const b = parseInt(c.slice(4, 6), 16);
      return (r * 299 + g * 587 + b * 114) / 1000 > 160;
    } catch {
      return true;
    }
  };

  const filtered = colors.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="max-w-4xl mx-auto">

        {/* Page Header */}
        <div className="mb-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Management</p>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Colors</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {loading ? "Loading..." : `${colors.length} color${colors.length !== 1 ? "s" : ""} registered`}
            </p>
          </div>

          <Link
            to="/admin/add-color"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-150 shadow-sm self-start sm:self-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Color
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
                placeholder="Search colors..."
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
              <p className="text-sm text-gray-400">Loading colors...</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-16">#</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Color</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Value</th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((color, index) => (
                    <tr key={color._id} className="hover:bg-gray-50 transition-colors duration-100 group">

                      {/* # */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono font-medium text-gray-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </td>

                      {/* Color swatch + name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg shadow-sm border border-black/10 flex-shrink-0"
                            style={{ backgroundColor: color.title }}
                          />
                          <span className="text-sm font-medium text-gray-800">
                            {getColorLabel(color.title)}
                          </span>
                        </div>
                      </td>

                      {/* Hex badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium border border-black/10"
                          style={{
                            backgroundColor: color.title,
                            color: isLight(color.title) ? "#374151" : "#f9fafb",
                          }}
                        >
                          {color.title}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/admin/color/${color._id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-150"
                          >
                            <BiEdit className="w-3.5 h-3.5" />
                     
                          </Link>
                          <button
                            onClick={() => { setDeleteId(color._id); setShowModal(true); }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-150"
                          >
                            <AiFillDelete className="w-3.5 h-3.5" />
             
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">
                  {search ? "No colors match your search" : "No colors yet"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {search ? "Try a different keyword" : "Add your first color to get started"}
                </p>
              </div>
              {!search && (
                <Link
                  to="/admin/add-color"
                  className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Color
                </Link>
              )}
            </div>
          )}

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing <span className="font-medium text-gray-600">{filtered.length}</span> of{" "}
                <span className="font-medium text-gray-600">{colors.length}</span> colors
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
                <h4 className="text-sm font-semibold text-gray-900">Delete Color</h4>
                <p className="text-xs text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete this color? Products using it may be affected.
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
                onClick={deleteColor}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg transition-colors shadow-sm"
              >
                Delete Color
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorList;