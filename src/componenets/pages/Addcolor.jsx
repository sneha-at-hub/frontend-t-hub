import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddColor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const getColorId = location.pathname.split("/")[3];
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [colorName, setColorName] = useState("");

  // Fetch color if editing
  useEffect(() => {
    if (getColorId) {
      axios
        .get(`http://localhost:5000/api/color/${getColorId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => setTitle(res.data.title))
        .catch(() => toast.error("Failed to fetch color"));
    }
  }, [getColorId]);

  // Update color name when hex value changes
  useEffect(() => {
    if (title) {
      setColorName(getColorNameFromHex(title));
    }
  }, [title]);

  const getColorNameFromHex = (hex) => {
    const colorMap = {
      "#FF0000": "Red",
      "#00FF00": "Green",
      "#0000FF": "Blue",
      "#FFFF00": "Yellow",
      "#FF00FF": "Magenta",
      "#00FFFF": "Cyan",
      "#000000": "Black",
      "#FFFFFF": "White",
      "#808080": "Gray",
      "#FFA500": "Orange",
      "#800080": "Purple",
      "#FFC0CB": "Pink",
      "#A52A2A": "Brown",
      "#FFD700": "Gold",
      "#006400": "Dark Green",
    };
    return colorMap[title.toUpperCase()] || "Custom Color";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!title.trim()) {
      setError("Color is required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (getColorId) {
        // Update color
        await axios.put(
          `http://localhost:5000/api/color/${getColorId}`,
          { title },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Color updated successfully!");
        navigate("/admin/list-color");
      } else {
        // Add new color
        await axios.post(
          "http://localhost:5000/api/color",
          { title },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Color added successfully!");
        setTitle(""); // reset form
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

        * {
          font-family: 'Outfit', sans-serif;
        }

        .color-input-wrapper {
          position: relative;
          display: inline-block;
          width: 100%;
        }

        .color-picker-input {
          appearance: none;
          -webkit-appearance: none;
          width: 100%;
          height: 140px;
          border: none;
          border-radius: 16px;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .color-picker-input::-webkit-color-swatch-wrapper {
          padding: 8px;
        }

        .color-picker-input::-webkit-color-swatch {
          border: none;
          border-radius: 12px;
        }

        .color-picker-input:hover {
          box-shadow: 0 8px 30px rgba(59, 130, 246, 0.15);
          transform: translateY(-4px);
        }

        .color-picker-input:focus {
          outline: none;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 30px rgba(59, 130, 246, 0.15);
        }

        .form-container {
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .heading-glow {
          animation: textGlow 2s ease-in-out infinite;
        }

        @keyframes textGlow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(59, 130, 246, 0.1);
          }
          50% {
            text-shadow: 0 0 40px rgba(59, 130, 246, 0.2);
          }
        }

        .submit-button {
          position: relative;
          overflow: hidden;
        }

        .submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }

        .submit-button:hover::before {
          left: 100%;
        }

        .error-shake {
          animation: shake 0.4s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }

        .info-badge {
          animation: fadeInDown 0.5s ease-out;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hex-display {
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.05em;
        }
      `}</style>

      <ToastContainer position="top-right" autoClose={3000} />

      <div className="form-container w-full max-w-md">
        {/* White card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="heading-glow text-4xl font-bold text-slate-900 mb-2">
              {getColorId ? "Edit" : "Create"} Color
            </h3>
            <p className="text-slate-600 text-sm font-light">
              {getColorId
                ? "Update your product color"
                : "Add a new color to your catalog"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Color Picker Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="title"
                  className="text-sm font-semibold text-slate-900 uppercase tracking-wider"
                >
                  Select Color
                </label>
                {title && (
                  <div className="info-badge text-xs font-medium px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
                    {colorName}
                  </div>
                )}
              </div>

              <div className="color-input-wrapper">
                <input
                  type="color"
                  id="title"
                  value={title || "#3B82F6"}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`color-picker-input transition-all ${
                    error ? "error-shake" : ""
                  }`}
                />
              </div>

              {/* Hex Value Display */}
              {title && (
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-center">
                  <p className="text-slate-600 text-xs uppercase tracking-widest mb-1">
                    Hex Value
                  </p>
                  <p className="hex-display text-slate-900 text-lg font-semibold">
                    {title.toUpperCase()}
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-300 rounded-lg p-3 flex items-start gap-3">
                  <div className="text-red-600 mt-0.5">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="submit-button w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-slate-400 disabled:to-slate-300 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <span>
                  {getColorId ? "Update" : "Add"} Color
                </span>
              )}
            </button>

            {/* Helper Text */}
            <p className="text-center text-xs text-slate-500">
              Click the color square to open your color picker
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddColor;