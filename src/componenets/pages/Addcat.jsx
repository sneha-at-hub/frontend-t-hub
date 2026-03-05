import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import * as yup from "yup";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const schema = yup.object().shape({
  title: yup.string().required("Category name is required"),
});

const Addcat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const getPCatId = location.pathname.split("/")[3];

  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const isEditing = Boolean(getPCatId);

  useEffect(() => {
    if (getPCatId) {
      axios
        .get(`http://localhost:5000/api/category/${getPCatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setTitle(res.data.title))
        .catch(() => toast.error("Failed to fetch category"));
    }
  }, [getPCatId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await schema.validate({ title }, { abortEarly: false });
      setLoading(true);

      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (getPCatId) {
        await axios.put(`http://localhost:5000/api/category/${getPCatId}`, { title }, config);
        toast.success("Category updated successfully!");
        navigate("/admin/list-category");
      } else {
        await axios.post("http://localhost:5000/api/category", { title }, config);
        toast.success("Category added successfully!");
        setTitle("");
      }
    } catch (err) {
      if (err.inner) {
        const formErrors = {};
        err.inner.forEach((e) => (formErrors[e.path] = e.message));
        setErrors(formErrors);
      } else {
        toast.error(err.response?.data?.message || "Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-xl mx-auto">

        {/* Page Header */}
        <div className="mb-7 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => navigate("/admin/list-category")}
                className="text-gray-400 hover:text-gray-600 transition-colors text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Categories
              </button>
              <span className="text-gray-300">/</span>
              <span className="text-sm text-gray-500">{isEditing ? "Edit" : "New"}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {isEditing ? "Edit Category" : "Add New Category"}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {isEditing ? "Update the category name below." : "Create a new product category."}
            </p>
          </div>

          <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            isEditing
              ? "bg-amber-50 text-amber-600 border border-amber-200"
              : "bg-indigo-50 text-indigo-600 border border-indigo-200"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isEditing ? "bg-amber-400" : "bg-indigo-400"}`}></span>
            {isEditing ? "Editing" : "New Category"}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Category Name Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-800">Category Details</h2>
                <p className="text-xs text-gray-400">Provide a clear, descriptive name</p>
              </div>
            </div>

            <div className="px-6 py-5">
              <label htmlFor="title" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Category Name <span className="text-red-400 normal-case tracking-normal font-normal">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Men's Footwear, Electronics, Accessories..."
                className={`w-full px-3.5 py-2.5 text-sm text-gray-800 bg-white border rounded-lg outline-none transition-all duration-150 placeholder-gray-400
                  ${errors.title
                    ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  }`}
              />
              {errors.title && (
                <p className="flex items-center gap-1.5 text-red-500 text-xs mt-2">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.title}
                </p>
              )}

              {/* Tip */}
              <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Use a concise name that clearly describes the product group.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 pb-6">
            <button
              type="button"
              onClick={() => navigate("/admin/list-category")}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  {isEditing ? "Update Category" : "Add Category"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Addcat;