import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import "react-toastify/dist/ReactToastify.css";

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/brand", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBrands(res.data);
    } catch (err) {
      toast.error("Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const deleteBrand = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/brand/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Brand deleted successfully!");
      setShowModal(false);
      fetchBrands();
    } catch (err) {
      toast.error("Failed to delete brand");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="max-w-5xl mx-auto">
        <h3 className="text-4xl font-bold mb-6 text-slate-900">Brands</h3>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 rounded-full animate-spin border-4 border-blue-400 border-t-transparent mb-4"></div>
              <p className="text-slate-500 text-sm">Loading brands...</p>
            </div>
          ) : brands.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Brand Name
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {brands.map((brand, index) => (
                    <tr
                      key={brand._id}
                      className="hover:bg-blue-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-slate-900">
                          {brand.title}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            to={`/admin/brand/${brand._id}`}
                            className="inline-flex items-center justify-center p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg"
                          >
                            <BiEdit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => {
                              setDeleteId(brand._id);
                              setShowModal(true);
                            }}
                            className="inline-flex items-center justify-center p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg"
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
              <p className="text-slate-600 text-sm">No brands yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm border border-slate-200">
            <h4 className="text-xl font-semibold text-slate-900 mb-4">
              Delete Brand
            </h4>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete this brand? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteBrand}
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

export default BrandList;