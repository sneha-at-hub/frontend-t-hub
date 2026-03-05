import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/user/admin-login", { email, password });

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data));
        toast.success("Login successful!");
        navigate("/admin");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="w-full max-w-sm">

        {/* Logo / Brand mark */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center shadow-md mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Portal</h1>
          <p className="text-sm text-gray-400 mt-1">Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          {/* Top accent */}
          <div className="h-1 bg-red-600 w-full" />

          <div className="px-7 py-7">

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2.5 px-4 py-3 mb-5 bg-red-50 border border-red-100 rounded-lg">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="admin@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg outline-none transition-all duration-150 focus:border-red-500 focus:ring-2 focus:ring-red-100 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-2.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg outline-none transition-all duration-150 focus:border-red-500 focus:ring-2 focus:ring-red-100 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 active:bg-red-800 transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Restricted access — authorized personnel only.
        </p>
      </div>
    </div>
  );
};

export default Login;