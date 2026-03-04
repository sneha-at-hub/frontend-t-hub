import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Email and Password are required");
      return;
    }

    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/admin-login",
        { email, password }
      );

      if (res.status === 200) {

        // ✅ Save token separately
        localStorage.setItem("token", res.data.token);

        // ✅ Save full user object
        localStorage.setItem("user", JSON.stringify(res.data));

        toast.success("Login Successful!");
        navigate("/admin");
      } else {
        toast.error(res.data.message || "Login Failed");
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-400 p-4">
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-2">Login</h3>
        <p className="text-center text-gray-600 mb-4">
          Login to your account to continue
        </p>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 rounded-lg transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;