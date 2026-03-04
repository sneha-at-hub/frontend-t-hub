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
  const [hoveredId, setHoveredId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch Categories
  const getCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/category",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCategories(res.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  // Delete Category
  const deleteCategory = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/category/${deleteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Category Deleted Successfully!");
      setShowModal(false);
      getCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        
        * {
          font-family: 'Geist', sans-serif;
        }
        
        .category-table {
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .table-row-enter {
          animation: slideIn 0.4s ease-out forwards;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .action-button {
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .action-button:hover {
          transform: scale(1.15);
        }

        .spinner {
          background: linear-gradient(90deg, #3b82f6 25%, #1e40af 50%, #3b82f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <ToastContainer position="top-right" autoClose={2500} />

      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              Categories
            </h1>
            <span className="text-sm font-medium text-slate-500 px-3 py-1 bg-blue-100 rounded-full">
              {loading ? "Loading..." : `${categories.length} items`}
            </span>
          </div>
          <p className="text-slate-600 text-sm">Manage your product categories</p>
        </div>

        {/* Main Table Container */}
        <div className="category-table bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 rounded-full spinner mb-4"></div>
              <p className="text-slate-500 text-sm">Loading categories...</p>
            </div>
          ) : categories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Table Header */}
                <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Category Name
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100">
                  {categories.map((cat, index) => (
                    <tr
                      key={cat._id}
                      className="table-row-enter hover:bg-blue-50 transition-colors duration-200 group"
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onMouseEnter={() => setHoveredId(cat._id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700 transition-colors">
                          {cat.title}
                        </p>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            to={`/admin/category/${cat._id}`}
                            className="action-button inline-flex items-center justify-center p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg"
                            title="Edit category"
                          >
                            <BiEdit className="w-5 h-5" />
                          </Link>

                          <button
                            onClick={() => {
                              setDeleteId(cat._id);
                              setShowModal(true);
                            }}
                            className="action-button inline-flex items-center justify-center p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg"
                            title="Delete category"
                          >
                            <AiFillDelete className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-slate-300 mb-4">
                <svg
                  className="w-16 h-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-slate-600 text-sm font-medium">
                No categories yet
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Create your first category to get started
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm border border-slate-200 transform transition-all">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
              <AiFillDelete className="w-6 h-6 text-red-600" />
            </div>

            <h4 className="text-xl font-semibold text-slate-900 mb-2">
              Delete Category
            </h4>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Are you sure you want to delete this category? This action cannot be undone and may affect related products.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={deleteCategory}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categorylist;