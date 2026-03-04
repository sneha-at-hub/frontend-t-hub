import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [tags, setTags] = useState("");
  const [colors, setColors] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [images, setImages] = useState([]);

  const [brandsList, setBrandsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [colorsList, setColorsList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch brands, categories, colors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, categoriesRes, colorsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/brand", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/category", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/color", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setBrandsList(brandsRes.data);
        setCategoriesList(categoriesRes.data);
        setColorsList(colorsRes.data);
      } catch (err) {
        toast.error("Failed to fetch data");
      }
    };
    fetchData();
  }, [token]);

  // Fetch product for editing
  useEffect(() => {
    if (getProductId) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const res = await axios.get(
            `http://localhost:5000/api/product/${getProductId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const p = res.data;
          setTitle(p.title);
          setDescription(p.description);
          setPrice(p.price);
          setBrand(p.brand);
          setCategory(p.category);
          setTags(p.tags);
          setColors(p.color || []);
          setQuantity(p.quantity);
          setImages(p.images?.map((img) => ({ url: img.url })) || []);
        } catch (err) {
          toast.error("Failed to fetch product");
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [getProductId, token]);

  // Handle file uploads
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !price || !brand || !category || !tags || !colors.length || !quantity) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("brand", brand);
      formData.append("category", category);
      formData.append("tags", tags);
      formData.append("quantity", quantity);
      formData.append("slug", title.toLowerCase().replace(/\s+/g, "-"));

      colors.forEach((c) => formData.append("color[]", c));
      images.forEach((img) => {
        if (img.file) formData.append("images", img.file);
      });

      if (getProductId) {
        await axios.put(`http://localhost:5000/api/product/${getProductId}`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/product", formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        toast.success("Product added successfully!");
        // Reset form
        setTitle(""); setDescription(""); setPrice(""); setBrand("");
        setCategory(""); setTags(""); setColors([]); setQuantity(""); setImages([]);
      }

      navigate("/admin/list-product");
    } catch (err) {
      console.log(err.response?.data || err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-md rounded-lg">
      <ToastContainer position="top-right" autoClose={2500} />
      <h3 className="text-2xl font-semibold mb-6">{getProductId ? "Edit" : "Add"} Product</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Product Title"
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product Description"
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select value={brand} onChange={(e) => setBrand(e.target.value)} className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select Brand</option>
          {brandsList.map((b) => <option key={b._id} value={b.title}>{b.title}</option>)}
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select Category</option>
          {categoriesList.map((c) => <option key={c._id} value={c.title}>{c.title}</option>)}
        </select>

        <select value={tags} onChange={(e) => setTags(e.target.value)} className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select Tag</option>
          <option value="featured">Featured</option>
          <option value="popular">Popular</option>
          <option value="special">Special</option>
        </select>

        <div className="flex flex-wrap gap-2">
          {colorsList.map((c) => (
            <button
              type="button"
              key={c._id}
              onClick={() => {
                if (colors.includes(c._id)) setColors(colors.filter((id) => id !== c._id));
                else setColors([...colors, c._id]);
              }}
              style={{ backgroundColor: c.title }}
              className={`w-6 h-6 rounded-full border-2 border-gray-300 ${colors.includes(c._id) ? "ring-2 ring-blue-500" : ""}`}
            ></button>
          ))}
        </div>

        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input type="file" multiple onChange={handleFileChange} className="py-2" />
        <div className="flex flex-wrap gap-2">
          {images.map((img, i) => (
            <div key={i} className="relative">
              <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">×</button>
              <img src={img.url || img.file} alt="" className="w-24 h-24 object-cover rounded-md" />
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} className="py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
          {loading ? "Processing..." : getProductId ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;