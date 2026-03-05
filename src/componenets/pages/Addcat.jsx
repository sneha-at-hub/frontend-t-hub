import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import * as yup from "yup";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const schema = yup.object().shape({
  title: yup.string().required("Category name is required"),
  sub: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Subcategory name is required"),
        items: yup
          .array()
          .of(yup.string().required("Item cannot be empty"))
          .min(1, "At least one item is required"),
      })
    )
    .min(1, "At least one subcategory is required"),
});

const defaultSub = () => ({ name: "", items: [""] });

const Addcat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const getPCatId = location.pathname.split("/")[3];

  const [title, setTitle] = useState("");
  const [sub, setSub] = useState([defaultSub()]);
  const [promo, setPromo] = useState({ title: "", sub: "", cta: "" });
  const [hasPromo, setHasPromo] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const isEditing = Boolean(getPCatId);

  useEffect(() => {
    if (getPCatId) {
      axios
        .get(`http://localhost:5000/api/category/${getPCatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const data = res.data;
          setTitle(data.title || "");
          setSub(
            data.sub?.length
              ? data.sub.map((s) => ({ name: s.name, items: s.items?.length ? s.items : [""] }))
              : [defaultSub()]
          );
          if (data.promo) {
            setPromo(data.promo);
            setHasPromo(true);
          }
        })
        .catch(() => toast.error("Failed to fetch category"));
    }
  }, [getPCatId, token]);

  // --- Sub helpers ---
  const addSub = () => setSub([...sub, defaultSub()]);
  const removeSub = (i) => setSub(sub.filter((_, idx) => idx !== i));
  const updateSubName = (i, val) => {
    const updated = [...sub];
    updated[i] = { ...updated[i], name: val };
    setSub(updated);
  };

  // --- Item helpers ---
  const addItem = (si) => {
    const updated = [...sub];
    updated[si] = { ...updated[si], items: [...updated[si].items, ""] };
    setSub(updated);
  };
  const removeItem = (si, ii) => {
    const updated = [...sub];
    updated[si] = { ...updated[si], items: updated[si].items.filter((_, idx) => idx !== ii) };
    setSub(updated);
  };
  const updateItem = (si, ii, val) => {
    const updated = [...sub];
    const items = [...updated[si].items];
    items[ii] = val;
    updated[si] = { ...updated[si], items };
    setSub(updated);
  };

  const getError = (path) => {
    const parts = path.split(".");
    let cur = errors;
    for (const p of parts) cur = cur?.[p];
    return cur;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      title,
      sub: sub.map((s) => ({ name: s.name, items: s.items.filter((i) => i.trim()) })),
      ...(hasPromo && (promo.title || promo.sub || promo.cta) ? { promo } : {}),
    };

    // Toast-based requirement checks
    if (!title.trim()) {
      toast.warn("Please enter a category name to add your category.");
      return;
    }
    const hasValidSub = payload.sub.some((s) => s.name.trim() && s.items.length > 0);
    if (!hasValidSub) {
      toast.warn("There must be at least one subcategory with at least one item.");
      return;
    }

    try {
      await schema.validate({ title, sub: payload.sub }, { abortEarly: false });
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (getPCatId) {
        await axios.put(`http://localhost:5000/api/category/${getPCatId}`, payload, config);
        toast.success("Category updated successfully!");
        navigate("/admin/list-category");
      } else {
        await axios.post("http://localhost:5000/api/category", payload, config);
        toast.success("Category added successfully!");
        setTitle("");
        setSub([defaultSub()]);
        setPromo({ title: "", sub: "", cta: "" });
        setHasPromo(false);
      }
    } catch (err) {
      if (err.inner) {
        const formErrors = {};
        err.inner.forEach((e) => {
          const keys = e.path.split(".");
          let cur = formErrors;
          keys.forEach((k, idx) => {
            if (idx === keys.length - 1) cur[k] = e.message;
            else { cur[k] = cur[k] || {}; cur = cur[k]; }
          });
        });
        setErrors(formErrors);
      } else {
        toast.error(err.response?.data?.message || "Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-2xl mx-auto">

        {/* Page Header */}
        <div className="mb-7 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => navigate("/admin/list-category")}
                className="text-gray-400 hover:text-gray-600 transition-colors text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Categories
              </button>
              <span className="text-gray-300">/</span>
              <span className="text-sm text-gray-500">{isEditing ? "Edit" : "New"}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {isEditing ? "Edit Category" : "Add New Category"}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {isEditing ? "Update the category details below." : "Create a new product category with subcategories."}
            </p>
          </div>

          <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            isEditing
              ? "bg-amber-50 text-amber-600 border border-amber-200"
              : "bg-indigo-50 text-indigo-600 border border-indigo-200"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isEditing ? "bg-amber-400" : "bg-indigo-400"}`}></span>
            {isEditing ? "Editing" : "New Category"}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ── Category Name ── */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-800">Category Details</h2>
                <p className="text-xs text-gray-400">Provide a clear, descriptive name</p>
              </div>
            </div>
            <div className="px-6 py-5">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Category Name <span className="text-red-400 normal-case tracking-normal font-normal">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Electronics, Men's Footwear..."
                className={`w-full px-3.5 py-2.5 text-sm text-gray-800 bg-white border rounded-lg outline-none transition-all duration-150 placeholder-gray-400
                  ${errors.title ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"}`}
              />
              {errors.title && <p className="flex items-center gap-1.5 text-red-500 text-xs mt-2"><svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.title}</p>}
            </div>
          </div>

          {/* ── Subcategories ── */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h8" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">Subcategories</h2>
                  <p className="text-xs text-gray-400">At least one subcategory with items required</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addSub}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-200 rounded-lg hover:bg-violet-100 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Sub
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {errors.sub && typeof errors.sub === "string" && (
                <p className="flex items-center gap-1.5 text-red-500 text-xs"><svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.sub}</p>
              )}

              {sub.map((s, si) => {
                const subErr = errors.sub?.[si];
                return (
                  <div key={si} className="border border-gray-100 rounded-xl p-4 bg-gray-50/60 relative">
                    {/* Sub header row */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {si + 1}
                      </span>
                      <input
                        type="text"
                        value={s.name}
                        onChange={(e) => updateSubName(si, e.target.value)}
                        placeholder="Subcategory name, e.g. Computers"
                        className={`flex-1 px-3 py-2 text-sm text-gray-800 bg-white border rounded-lg outline-none transition-all placeholder-gray-400
                          ${subErr?.name ? "border-red-300 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"}`}
                      />
                      {sub.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSub(si)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {subErr?.name && <p className="text-red-500 text-xs mb-2 ml-7">{subErr.name}</p>}

                    {/* Items */}
                    <div className="ml-7 space-y-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Items</p>
                      {s.items.map((item, ii) => (
                        <div key={ii} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-300 flex-shrink-0"></span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateItem(si, ii, e.target.value)}
                            placeholder={`Item ${ii + 1}, e.g. Laptops`}
                            className={`flex-1 px-3 py-1.5 text-sm text-gray-700 bg-white border rounded-lg outline-none transition-all placeholder-gray-400
                              ${subErr?.items?.[ii] ? "border-red-300 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"}`}
                          />
                          {s.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(si, ii)}
                              className="w-6 h-6 flex items-center justify-center rounded text-gray-300 hover:text-red-400 transition-all flex-shrink-0"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      {subErr?.items && typeof subErr.items === "string" && (
                        <p className="text-red-500 text-xs">{subErr.items}</p>
                      )}
                      <button
                        type="button"
                        onClick={() => addItem(si)}
                        className="inline-flex items-center gap-1 text-xs text-violet-500 hover:text-violet-700 font-medium mt-1 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add item
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Promo (optional) ── */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">Promo Banner <span className="text-xs font-normal text-gray-400 ml-1">Optional</span></h2>
                  <p className="text-xs text-gray-400">Add a promotional banner to this category</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHasPromo(!hasPromo)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${hasPromo ? "bg-rose-500" : "bg-gray-200"}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${hasPromo ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
            </div>

            {hasPromo && (
              <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Promo Title", key: "title", placeholder: "e.g. Hot Deals" },
                  { label: "Subtitle", key: "sub", placeholder: "e.g. Up to 50% off" },
                  { label: "CTA Text", key: "cta", placeholder: "e.g. Shop now" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
                    <input
                      type="text"
                      value={promo[key]}
                      onChange={(e) => setPromo({ ...promo, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full px-3.5 py-2.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg outline-none transition-all placeholder-gray-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    />
                  </div>
                ))}
              </div>
            )}

            {!hasPromo && (
              <div className="px-6 py-4">
                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Toggle to add a promotional banner (title, subtitle, and call-to-action).
                </p>
              </div>
            )}
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center justify-end gap-3 pt-2 pb-6">
            <button
              type="button"
              onClick={() => navigate("/admin/list-category")}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                  {isEditing ? "Update Category" : "Add Category"}
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

export default Addcat;