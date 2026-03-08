import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Star, Flame, Sparkles, Plus, Trash2 } from "lucide-react";

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const getProductId = location.pathname.split("/")[3];
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategory, setsubcategory] = useState("");
  const [subitem, setsubitem] = useState("");
  const [tags, setTags] = useState("");
  const [quantity, setQuantity] = useState("");
  const [images, setImages] = useState([]);

  // Wholesale fields
  const [sku, setSku] = useState("");
  const [minOrderQty, setMinOrderQty] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("piece");
  const [pricingTiers, setPricingTiers] = useState([{ minQty: "", price: "" }]);

  const [brandsList, setBrandsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Derived from selected category
  const selectedCatData = categoriesList.find((c) => c._id === categoryId);
  const subList = selectedCatData?.sub || [];
  const selectedSubData = subList.find((s) => s.name === subcategory);
  const itemList = selectedSubData?.items || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/brand", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5000/api/category", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setBrandsList(brandsRes.data);
        setCategoriesList(categoriesRes.data);
      } catch (err) {
        toast.error("Failed to fetch data");
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    if (getProductId) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`http://localhost:5000/api/product/${getProductId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const p = res.data;
          setTitle(p.title); setDescription(p.description); setPrice(p.price);
          setBrand(p.brand); setCategory(p.category); setCategoryId(p.categoryId || "");
          setsubcategory(p.subcategory || ""); setsubitem(p.subitem || "");
          setTags(p.tags);
          setQuantity(p.quantity);
          setImages(p.images?.map((img) => ({ url: img.url })) || []);
          // Wholesale fields
          setSku(p.sku || "");
          setMinOrderQty(p.minOrderQty || "");
          setWeight(p.weight || "");
          setUnit(p.unit || "piece");
          setPricingTiers(p.pricing?.length ? p.pricing : [{ minQty: "", price: "" }]);
        } catch (err) {
          toast.error("Failed to fetch product");
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [getProductId, token]);

  const handleCategoryChange = (e) => {
    const id = e.target.value;
    const cat = categoriesList.find((c) => c._id === id);
    setCategoryId(id);
    setCategory(cat?.title || "");
    setsubcategory("");
    setsubitem("");
  };

  const handleSubChange = (e) => {
    setsubcategory(e.target.value);
    setsubitem("");
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => setImages(images.filter((_, i) => i !== index));

  // Pricing tier handlers
  const addPricingTier = () => setPricingTiers([...pricingTiers, { minQty: "", price: "" }]);
  const removePricingTier = (index) => setPricingTiers(pricingTiers.filter((_, i) => i !== index));
  const updatePricingTier = (index, field, value) => {
    setPricingTiers(pricingTiers.map((tier, i) => i === index ? { ...tier, [field]: value } : tier));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !price || !brand || !category || !tags || !quantity) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!subcategory) {
      toast.warn("Please select a subcategory.");
      return;
    }
    if (itemList.length > 0 && !subitem) {
      toast.warn("Please select an item within the subcategory.");
      return;
    }
    if (!sku) { toast.error("Please enter a SKU"); return; }
    if (!minOrderQty) { toast.error("Please enter a minimum order quantity"); return; }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title); formData.append("description", description);
      formData.append("price", price); formData.append("brand", brand);
      formData.append("category", category); formData.append("categoryId", categoryId);
      formData.append("subcategory", subcategory);
      if (subitem) formData.append("subitem", subitem);
      formData.append("tags", tags);
      formData.append("quantity", quantity);
      formData.append("slug", title.toLowerCase().replace(/\s+/g, "-"));
      images.forEach((img) => { if (img.file) formData.append("images", img.file); });
      // Wholesale fields
      formData.append("sku", sku);
      formData.append("minOrderQty", minOrderQty);
      if (weight) formData.append("weight", weight);
      formData.append("unit", unit);
      const validTiers = pricingTiers.filter((t) => t.minQty !== "" && t.price !== "");
      if (validTiers.length > 0) formData.append("pricing", JSON.stringify(validTiers));

      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" };
      if (getProductId) {
        // ─── DEBUG LOG ───────────────────────────────────────────────
        const validTiersDebug = pricingTiers.filter((t) => t.minQty !== "" && t.price !== "");
        const debugPayload = {
          productId: getProductId,
          title,
          description,
          price,
          brand,
          category,
          categoryId,
          subcategory,
          subitem,
          tags,
          quantity,
          sku,
          minOrderQty,
          weight,
          unit,
          pricingTiers: validTiersDebug,
          existingImages: images.filter((img) => !img.file).map((img) => img.url),
          newImageFiles: images.filter((img) => img.file).map((img) => img.file.name),
        };
        console.log("📦 PUT payload being sent:", debugPayload);
        console.log("📋 FormData entries:");
        for (let [key, value] of formData.entries()) {
          console.log(`  ${key}:`, value);
        }
        // ────────────────────────────────────────────────────────────
        await axios.put(`http://localhost:5000/api/product/${getProductId}`, formData, { headers });
        toast.success("Product updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/product", formData, { headers });
        toast.success("Product added successfully!");
        setTitle(""); setDescription(""); setPrice(""); setBrand("");
        setCategory(""); setCategoryId(""); setsubcategory(""); setsubitem("");
        setTags(""); setQuantity(""); setImages([]);
        setSku(""); setMinOrderQty(""); setWeight(""); setUnit("piece");
        setPricingTiers([{ minQty: "", price: "" }]);
      }
      navigate("/admin/list-product");
    } catch (err) {
      console.error("❌ PUT error:", err.response?.data || err.message);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isEditing = Boolean(getProductId);

  const inputClass =
    "w-full px-3.5 py-2.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg outline-none transition-all duration-150 focus:border-red-500 focus:ring-2 focus:ring-red-100 placeholder-gray-400";
  const disabledClass =
    "w-full px-3.5 py-2.5 text-sm text-gray-400 bg-gray-50 border border-gray-100 rounded-lg outline-none cursor-not-allowed";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 px-4">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="max-w-3xl mx-auto">

        {/* Page Header */}
        <div className="mb-7 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => navigate("/admin/list-product")}
                className="text-gray-400 hover:text-gray-600 transition-colors text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Products
              </button>
              <span className="text-gray-300">/</span>
              <span className="text-sm text-gray-500">{isEditing ? "Edit" : "New"}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {isEditing ? "Update the product information below." : "Fill in the details to create a new product listing."}
            </p>
          </div>

          <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            isEditing ? "bg-amber-50 text-amber-600 border border-amber-200" : "bg-red-50 text-red-600 border border-red-200"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isEditing ? "bg-amber-400" : "bg-red-400"}`}></span>
            {isEditing ? "Editing" : "New Product"}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Basic Info */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-800">Basic Information</h2>
                <p className="text-xs text-gray-400">Product name and description</p>
              </div>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className={labelClass}>Product Title <span className="text-red-400 normal-case tracking-normal font-normal">*</span></label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Classic Leather Sneaker" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Description <span className="text-red-400 normal-case tracking-normal font-normal">*</span></label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the product — materials, features, sizing..." rows={4} className={`${inputClass} resize-none leading-relaxed`} />
              </div>
              {/* SKU */}
              <div>
                <label className={labelClass}>SKU <span className="text-red-400 normal-case tracking-normal font-normal">*</span></label>
                <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. ABC123" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-800">Pricing & Inventory</h2>
                <p className="text-xs text-gray-400">Set price and stock quantity</p>
              </div>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Price (USD) <span className="text-red-400 normal-case tracking-normal font-normal">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" min="0" step="0.01" className={`${inputClass} pl-8`} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Stock Quantity <span className="text-red-400 normal-case tracking-normal font-normal">*</span></label>
                  <div className="relative">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" min="0" className={`${inputClass} pl-10`} />
                  </div>
                </div>
              </div>

              {/* Min Order Qty + Unit + Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Min. Order Qty <span className="text-red-400 normal-case tracking-normal font-normal">*</span></label>
                  <input type="number" value={minOrderQty} onChange={(e) => setMinOrderQty(e.target.value)} placeholder="e.g. 50" min="1" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Unit <span className="text-red-400 normal-case tracking-normal font-normal">*</span></label>
                  <div className="relative">
                    <select value={unit} onChange={(e) => setUnit(e.target.value)} className={`${inputClass} appearance-none pr-9 cursor-pointer`}>
                      {["piece", "box", "set", "pack", "pair", "roll", "bag", "carton", "kg", "litre"].map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Weight</label>
                  <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 2kg" className={inputClass} />
                </div>
              </div>

              {/* Volume Pricing Tiers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={`${labelClass} mb-0`}>Volume Pricing Tiers</label>
                  <button
                    type="button"
                    onClick={addPricingTier}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Plus size={12} /> Add Tier
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-[1fr_1fr_auto] gap-3 px-1">
                    <span className="text-xs text-gray-400 font-medium">Min. Qty</span>
                    <span className="text-xs text-gray-400 font-medium">Price per Unit (USD)</span>
                    <span className="w-7"></span>
                  </div>
                  {pricingTiers.map((tier, index) => (
                    <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-center bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5">
                      <input
                        type="number"
                        value={tier.minQty}
                        onChange={(e) => updatePricingTier(index, "minQty", e.target.value)}
                        placeholder="e.g. 50"
                        min="1"
                        className={`${inputClass} bg-white`}
                      />
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                        <input
                          type="number"
                          value={tier.price}
                          onChange={(e) => updatePricingTier(index, "price", e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className={`${inputClass} pl-8 bg-white`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removePricingTier(index)}
                        disabled={pricingTiers.length === 1}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Categorization */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-800">Categorization</h2>
                <p className="text-xs text-gray-400">Brand, category, subcategory, and tag</p>
              </div>
            </div>
            <div className="px-6 py-5 space-y-4">

              {/* Brand + Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Brand <span className="text-red-400 normal-case tracking-normal font-normal">*</span></label>
                  <div className="relative">
                    <select value={brand} onChange={(e) => setBrand(e.target.value)} className={`${inputClass} appearance-none pr-9 cursor-pointer`}>
                      <option value="">Select brand</option>
                      {brandsList.map((b) => <option key={b._id} value={b.title}>{b.title}</option>)}
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Category <span className="text-red-400 normal-case tracking-normal font-normal">*</span></label>
                  <div className="relative">
                    <select value={categoryId} onChange={handleCategoryChange} className={`${inputClass} appearance-none pr-9 cursor-pointer`}>
                      <option value="">Select category</option>
                      {categoriesList.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* subcategory + Item — cascading */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    subcategory <span className="text-red-400 normal-case tracking-normal font-normal">*</span>
                  </label>
                  {categoryId && subList.length > 0 ? (
                    <div className="relative">
                      <select value={subcategory} onChange={handleSubChange} className={`${inputClass} appearance-none pr-9 cursor-pointer`}>
                        <option value="">Select subcategory</option>
                        {subList.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        disabled
                        placeholder={categoryId ? "No subcategories available" : "Select a category first"}
                        className={disabledClass}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Item</label>
                  {subcategory && itemList.length > 0 ? (
                    <div className="relative">
                      <select value={subitem} onChange={(e) => setsubitem(e.target.value)} className={`${inputClass} appearance-none pr-9 cursor-pointer`}>
                        <option value="">Select item</option>
                        {itemList.map((item, i) => <option key={i} value={item}>{item}</option>)}
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  ) : (
                    <input
                      type="text"
                      disabled
                      placeholder={subcategory ? "No items available" : "Select a subcategory first"}
                      className={disabledClass}
                    />
                  )}
                </div>
              </div>

              {/* Breadcrumb trail */}
              {(category || subcategory || subitem) && (
                <div className="flex items-center gap-1.5 px-3 py-2 bg-violet-50 border border-violet-100 rounded-lg flex-wrap">
                  <svg className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  {category && <span className="text-xs font-semibold text-violet-600">{category}</span>}
                  {subcategory && (
                    <>
                      <svg className="w-3 h-3 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="text-xs font-medium text-violet-500">{subcategory}</span>
                    </>
                  )}
                  {subitem && (
                    <>
                      <svg className="w-3 h-3 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="text-xs font-medium text-violet-400">{subitem}</span>
                    </>
                  )}
                </div>
              )}

              {/* Tags */}
              <div>
                <label className={labelClass}>Tag <span className="text-red-400 normal-case tracking-normal font-normal">*</span></label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {[
                    { value: "featured", label: "Featured", icon: Star },
                    { value: "popular", label: "Popular", icon: Flame },
                    { value: "special", label: "Special", icon: Sparkles },
                  ].map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTags(t.value)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
                        tags === t.value
                          ? "bg-red-600 text-white border-red-600 shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-500"
                      }`}
                    >
                      <t.icon size={16} /> {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-800">
                  Product Images
                  {images.length > 0 && (
                    <span className="ml-2 text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                      {images.length} {images.length === 1 ? "file" : "files"}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-gray-400">Upload one or more product photos</p>
              </div>
            </div>
            <div className="px-6 py-5">
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50 hover:bg-red-50 hover:border-red-300 transition-all duration-150 group">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:border-red-200 transition-colors">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 group-hover:text-red-600 transition-colors">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP — multiple files supported</p>
                  </div>
                </div>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>

              {images.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-4">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group shadow-sm">
                      <img src={img.url} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-150" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-150 hover:bg-red-500 hover:text-white text-gray-600"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 pb-6">
            <button
              type="button"
              onClick={() => navigate("/admin/list-product")}
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
                  {isEditing ? "Update Product" : "Add Product"}
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

export default AddProduct;