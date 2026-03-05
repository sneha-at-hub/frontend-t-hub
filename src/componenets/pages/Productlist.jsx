import React, { useEffect, useState, useMemo } from "react";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ brand: "", category: "", subcategory: "", priceRange: "all" });
  const [showFilters, setShowFilters] = useState(false);

  const token = localStorage.getItem("token");

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

  useEffect(() => { fetchProducts(); }, []);

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

  const uniqueBrands = useMemo(() => [...new Set(products.map((p) => p.brand?.title || p.brand).filter(Boolean))], [products]);
  const uniqueCategories = useMemo(() => [...new Set(products.map((p) => p.category?.title || p.category).filter(Boolean))], [products]);
  const uniqueSubcategories = useMemo(() => [...new Set(products.map((p) => p.subcategory).filter(Boolean))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = !filters.brand || (product.brand?.title || product.brand) === filters.brand;
      const matchesCategory = !filters.category || (product.category?.title || product.category) === filters.category;
      const matchesSubcategory = !filters.subcategory || product.subcategory === filters.subcategory;
      let matchesPrice = true;
      if (filters.priceRange !== "all") {
        const price = product.price;
        if (filters.priceRange === "0-50") matchesPrice = price <= 50;
        else if (filters.priceRange === "50-100") matchesPrice = price > 50 && price <= 100;
        else if (filters.priceRange === "100-500") matchesPrice = price > 100 && price <= 500;
        else if (filters.priceRange === "500+") matchesPrice = price > 500;
      }
      return matchesSearch && matchesBrand && matchesCategory && matchesSubcategory && matchesPrice;
    });
  }, [products, searchQuery, filters]);

  const hasActiveFilters = filters.brand || filters.category || filters.subcategory || filters.priceRange !== "all";

  const clearFilters = () => {
    setFilters({ brand: "", category: "", subcategory: "", priceRange: "all" });
    setSearchQuery("");
  };

  const selectClass = "w-full px-3.5 py-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg outline-none appearance-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-150 cursor-pointer";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Management</p>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {loading ? "Loading..." : `${products.length} product${products.length !== 1 ? "s" : ""} in inventory`}
            </p>
          </div>
          <Link
            to="/admin/add-product"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-150 shadow-sm self-start sm:self-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </Link>
        </div>

        {/* Search + Filter Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-4 overflow-hidden">
          <div className="px-5 py-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center border-b border-gray-100">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder-gray-400 transition-all duration-150"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-150 ${
                  showFilters || hasActiveFilters
                    ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                Filters
                {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-indigo-500"></span>}
              </button>

              {(hasActiveFilters || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-all duration-150"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Brand</label>
                <div className="relative">
                  <select value={filters.brand} onChange={(e) => setFilters({ ...filters, brand: e.target.value })} className={selectClass}>
                    <option value="">All Brands</option>
                    {uniqueBrands.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
                <div className="relative">
                  <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className={selectClass}>
                    <option value="">All Categories</option>
                    {uniqueCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Subcategory</label>
                <div className="relative">
                  <select value={filters.subcategory} onChange={(e) => setFilters({ ...filters, subcategory: e.target.value })} className={selectClass}>
                    <option value="">All Subcategories</option>
                    {uniqueSubcategories.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Price Range</label>
                <div className="relative">
                  <select value={filters.priceRange} onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })} className={selectClass}>
                    <option value="all">All Prices</option>
                    <option value="0-50">$0 – $50</option>
                    <option value="50-100">$50 – $100</option>
                    <option value="100-500">$100 – $500</option>
                    <option value="500+">$500+</option>
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="w-8 h-8 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm text-gray-400">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">
                  {hasActiveFilters || searchQuery ? "No products match your filters" : "No products yet"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {hasActiveFilters || searchQuery ? "Try adjusting your search or filters" : "Add your first product to get started"}
                </p>
              </div>
              {(hasActiveFilters || searchQuery) && (
                <button onClick={clearFilters} className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["#", "Product", "Brand", "Category", "Subcategory", "Item", "Colors", "Stock", "Price", "Images", "Actions"].map((h) => (
                      <th key={h} className={`px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap ${
                        h === "Actions" || h === "Colors" || h === "Images" ? "text-center" : h === "Price" ? "text-right" : "text-left"
                      }`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.map((p, index) => (
                    <tr key={p._id} className="hover:bg-gray-50 transition-colors duration-100 group">

                      {/* # */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono font-medium text-gray-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </td>

                      {/* Product */}
                      <td className="px-5 py-4 whitespace-nowrap max-w-[160px]">
                        <span className="text-sm font-medium text-gray-800 truncate block">{p.title}</span>
                      </td>

                      {/* Brand */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600">
                          {p.brand?.title || p.brand}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-violet-50 text-xs font-medium text-violet-600">
                          {p.category?.title || p.category}
                        </span>
                      </td>

                      {/* Subcategory */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {p.subcategory ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 text-xs font-medium text-indigo-600">
                            {p.subcategory}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>

                      {/* Item */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {p.subItem ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-sky-50 text-xs font-medium text-sky-600">
                            {p.subItem}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>

                      {/* Colors */}
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-1.5 flex-wrap">
                          {p.color?.map((c, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200"
                              style={{ backgroundColor: c.title || "#000" }}
                              title={c.title}
                            />
                          ))}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          p.quantity > 20
                            ? "bg-emerald-50 text-emerald-600"
                            : p.quantity > 5
                            ? "bg-amber-50 text-amber-600"
                            : "bg-red-50 text-red-500"
                        }`}>
                          {p.quantity}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-semibold text-gray-800">${p.price}</span>
                      </td>

                      {/* Images */}
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-1.5 flex-wrap">
                          {p.images?.slice(0, 3).map((img, i) => (
                            <img key={i} src={img.url} alt="product" className="w-9 h-9 object-cover rounded-lg border border-gray-200 shadow-sm" />
                          ))}
                          {p.images?.length > 3 && (
                            <div className="w-9 h-9 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                              +{p.images.length - 3}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            to={`/admin/product/${p._id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-150"
                          >
                            <BiEdit className="w-3.5 h-3.5" />
                      
                          </Link>
                          <button
                            onClick={() => { setDeleteId(p._id); setShowConfirm(true); }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-150"
                          >
                            <AiFillDelete className="w-3.5 h-3.5" />
                      
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {!loading && filteredProducts.length > 0 && (
            <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing <span className="font-medium text-gray-600">{filteredProducts.length}</span> of{" "}
                <span className="font-medium text-gray-600">{products.length}</span> products
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors">
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Delete Product</h4>
                <p className="text-xs text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete this product? All associated data will be permanently removed.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg transition-colors shadow-sm"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;