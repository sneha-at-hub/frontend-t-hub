import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import * as yup from "yup";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

// Yup schema for validation
const schema = yup.object().shape({
  title: yup.string().required("Category Name is Required"),
});

const Addcat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const getPCatId = location.pathname.split("/")[3]; // extract id if editing

  // Local state
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Fetch category if editing
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      // Validate title
      await schema.validate({ title }, { abortEarly: false });

      setLoading(true);

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (getPCatId) {
        // Update existing category
        await axios.put(
          `http://localhost:5000/api/category/${getPCatId}`,
          { title },
          config
        );
        toast.success("Category Updated Successfully!");
        navigate("/admin/list-category");
      } else {
        // Create new category
        await axios.post("http://localhost:5000/api/category", { title }, config);
        toast.success("Category Added Successfully!");
        setTitle(""); // reset form
      }
    } catch (err) {
      if (err.inner) {
        // Collect validation errors from Yup
        const formErrors = {};
        err.inner.forEach((e) => (formErrors[e.path] = e.message));
        setErrors(formErrors);
      } else {
        toast.error(err.response?.data?.message || "Something Went Wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">
        {getPCatId ? "Edit" : "Add"} Category
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Category Input */}
        <div className="flex flex-col">
          <label htmlFor="title" className="mb-2 font-medium text-gray-700">
            Enter Product Category
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Category Name"
            className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition duration-300 disabled:opacity-50"
        >
          {loading ? "Processing..." : getPCatId ? "Edit" : "Add"} Category
        </button>
      </form>
    </div>
  );
};

export default Addcat;