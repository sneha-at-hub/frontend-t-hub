import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const colorPickerStyles = `
  .ap-color-picker {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 120px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    padding: 0;
    background: none;
  }
  .ap-color-picker::-webkit-color-swatch-wrapper { padding: 0; }
  .ap-color-picker::-webkit-color-swatch {
    border: none;
    border-radius: 12px;
  }
  .ap-color-picker::-moz-color-swatch {
    border: none;
    border-radius: 12px;
  }
`;

const isLight = (hex) => {
  try {
    const c = hex.replace("#", "");
    if (c.length < 6) return true;
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 160;
  } catch { return true; }
};

const AddColor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const getColorId = location.pathname.split("/")[3];

  const [title, setTitle] = useState("#6366f1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(getColorId);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (getColorId) {
      axios
        .get(`http://localhost:5000/api/color/${getColorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setTitle(res.data.title))
        .catch(() => toast.error("Failed to fetch color"));
    }
  }, [getColorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Color is required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (getColorId) {
        await axios.put(`http://localhost:5000/api/color/${getColorId}`, { title }, config);
        toast.success("Color updated successfully!");
        navigate("/admin/list-color");
      } else {
        await axios.post("http://localhost:5000/api/color", { title }, config);
        toast.success("Color added successfully!");
        setTitle("#6366f1");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const light = isLight(title);

  return (
    <div className="min-h-screen bg-gray-50 px-4">
      <style>{colorPickerStyles}</style>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-xl mx-auto">

        {/* Page Header */}
        <div className="mb-7 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => navigate("/admin/list-color")}
                className="text-gray-400 hover:text-gray-600 transition-colors text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Colors
              </button>
              <span className="text-gray-300">/</span>
              <span className="text-sm text-gray-500">{isEditing ? "Edit" : "New"}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {isEditing ? "Edit Color" : "Add New Color"}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {isEditing ? "Update the color value below." : "Pick a color to add to your catalog."}
            </p>
          </div>

          <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            isEditing
              ? "bg-amber-50 text-amber-600 border border-amber-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isEditing ? "bg-amber-400" : "bg-red-400"}`}></span>
            {isEditing ? "Editing" : "New Color"}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Color Picker Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-pink-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-800">Color Picker</h2>
                <p className="text-xs text-gray-400">Click the swatch to open the color picker</p>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">

              {/* Large preview + picker */}
              <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm" style={{ backgroundColor: title }}>
                {/* Overlay with color info */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none ${light ? "text-gray-800" : "text-white"}`}>
                  <span className="text-2xl font-bold font-mono tracking-widest opacity-90">
                    {title.toUpperCase()}
                  </span>
                </div>
                {/* Invisible full-size color input */}
                <input
                  type="color"
                  id="title"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setError(""); }}
                  className="ap-color-picker opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                  style={{ height: "140px" }}
                />
                {/* Visible height spacer */}
                <div style={{ height: "140px" }} />
              </div>

              {/* Hex input + swatch row */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg border border-gray-200 shadow-sm flex-shrink-0 cursor-pointer"
                  style={{ backgroundColor: title }}
                />
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Hex Value <span className="text-red-400 normal-case tracking-normal font-normal">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setError("");
                    }}
                    placeholder="#000000"
                    className={`w-full px-3.5 py-2.5 text-sm font-mono text-gray-800 bg-white border rounded-lg outline-none transition-all duration-150 placeholder-gray-400
                      ${error
                        ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      }`}
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="flex items-center gap-1.5 text-red-500 text-xs">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              )}

              {/* Tip */}
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                You can click the preview above or type a hex value directly.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 pb-6">
            <button
              type="button"
              onClick={() => navigate("/admin/list-color")}
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
                  {isEditing ? "Update Color" : "Add Color"}
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

export default AddColor;