import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddBrand = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const getBrandId = location.pathname.split("/")[3];

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const isEditing = Boolean(getBrandId);

  useEffect(() => {
    if (getBrandId) {
      const fetchBrand = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`http://localhost:5000/api/brand/${getBrandId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTitle(res.data.title);
        } catch (err) {
          toast.error("Failed to fetch brand");
        } finally {
          setLoading(false);
        }
      };
      fetchBrand();
    }
  }, [getBrandId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Brand name is required");
      return;
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (getBrandId) {
        await axios.put(`http://localhost:5000/api/brand/${getBrandId}`, { title }, config);
        toast.success("Brand updated successfully!");
      } else {
        await axios.post(`http://localhost:5000/api/brand`, { title }, config);
        toast.success("Brand added successfully!");
        setTitle("");
      }
      navigate("/admin/list-brand");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="max-w-xl mx-auto">

        {/* Page Header */}
        <div className="mb-7 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => navigate("/admin/list-brand")}
                className="text-gray-400 hover:text-gray-600 transition-colors text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Brands
              </button>
              <span className="text-gray-300">/</span>
              <span className="text-sm text-gray-500">{isEditing ? "Edit" : "New"}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {isEditing ? "Edit Brand" : "Add New Brand"}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {isEditing ? "Update the brand name below." : "Register a new product brand."}
            </p>
          </div>

          <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            isEditing
              ? "bg-amber-50 text-amber-600 border border-amber-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isEditing ? "bg-amber-400" : "bg-red-400"}`}></span>
            {isEditing ? "Editing" : "New Brand"}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Brand Name Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-800">Brand Details</h2>
                <p className="text-xs text-gray-400">Enter the official brand name</p>
              </div>
            </div>

            <div className="px-6 py-5">
              <label htmlFor="brand" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Brand Name <span className="text-red-400 normal-case tracking-normal font-normal">*</span>
              </label>
              <input
                type="text"
                id="brand"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Nike, Apple, Samsung..."
                className="w-full px-3.5 py-2.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg outline-none transition-all duration-150 focus:border-red-500 focus:ring-2 focus:ring-red-100 placeholder-gray-400"
              />

              <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Use the official brand name as it appears on the product.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 pb-6">
            <button
              type="button"
              onClick={() => navigate("/admin/list-brand")}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 active:bg-red-800 transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                  {isEditing ? "Update Brand" : "Add Brand"}
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

export default AddBrand;