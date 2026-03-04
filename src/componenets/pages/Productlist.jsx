import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/product", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
      setShowConfirm(false);
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 p-4">
      <h3 className="text-2xl font-semibold mb-6">Products</h3>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr className="text-center">
                <th className="px-4 py-2 border">SNo</th>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Brand</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Colors</th>
                <th className="px-4 py-2 border">Tags</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Images</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, index) => (
                <tr key={p._id} className="text-center border-b hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{p.title}</td>
                  <td className="px-4 py-2 border">{p.brand?.title || p.brand}</td>
                  <td className="px-4 py-2 border">{p.category?.title || p.category}</td>
                  <td className="px-4 py-2 border flex justify-center gap-1 flex-wrap">
                    {p.color?.map((c, i) => (
                      <span
                        key={i}
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: c.title || "#000" }}
                      ></span>
                    ))}
                  </td>
                  <td className="px-4 py-2 border">{p.tags}</td>
                  <td className="px-4 py-2 border">{p.quantity}</td>
                  <td className="px-4 py-2 border">{p.price}</td>
                  <td className="px-4 py-2 border flex justify-center gap-1 flex-wrap">
                    {p.images?.map((img, i) => (
                      <img
                        key={i}
                        src={img.url}
                        alt=""
                        className="w-16 h-16 object-cover rounded"
                      />
                    ))}
                  </td>
                  <td className="px-4 py-2 border flex justify-center gap-2">
                    <Link
                      to={`/admin/product/${p._id}`}
                      className="text-green-600 text-xl"
                    >
                      <BiEdit />
                    </Link>
                    <button
                      onClick={() => {
                        setDeleteId(p._id);
                        setShowConfirm(true);
                      }}
                      className="text-red-600 text-xl"
                    >
                      <AiFillDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this product?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;