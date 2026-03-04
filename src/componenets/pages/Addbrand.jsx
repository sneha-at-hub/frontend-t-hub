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

  // Fetch brand if editing
  useEffect(() => {
    if (getBrandId) {
      const fetchBrand = async () => {
        try {
          setLoading(true);
          const res = await axios.get(
            `http://localhost:5000/api/brand/${getBrandId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
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
      if (getBrandId) {
        await axios.put(
          `http://localhost:5000/api/brand/${getBrandId}`,
          { title },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Brand updated successfully!");
      } else {
        await axios.post(
          `http://localhost:5000/api/brand`,
          { title },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Brand added successfully!");
        setTitle(""); // reset form
      }
      navigate("/admin/list-brand");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-6 bg-white shadow-md rounded-lg">
      <ToastContainer position="top-right" autoClose={2500} />
      <h3 className="text-2xl font-semibold mb-6">
        {getBrandId ? "Edit" : "Add"} Brand
      </h3>

      <form onSubmit={handleSubmit}>
        <label htmlFor="brand" className="block mb-2 text-sm font-medium text-slate-700">
          Brand Name
        </label>
        <input
          type="text"
          id="brand"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter brand name"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Processing..." : getBrandId ? "Update Brand" : "Add Brand"}
        </button>
      </form>
    </div>
  );
};

export default AddBrand;