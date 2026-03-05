import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  AiOutlineDashboard,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineBgColors,
  AiOutlineLogout,
} from "react-icons/ai";
import { RiCouponLine } from "react-icons/ri";
import { ImBlog } from "react-icons/im";
import { FaClipboardList, FaBloggerB } from "react-icons/fa";
import { SiBrandfolder } from "react-icons/si";
import { BiCategoryAlt } from "react-icons/bi";
import { ChevronDown, Menu, X, Bell, Settings, LogOut } from "lucide-react";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const navigate = useNavigate();

  const menuItems = [
    { key: "", icon: AiOutlineDashboard, label: "Dashboard" },
    { key: "customers", icon: AiOutlineUser, label: "Customers" },
    {
      key: "Catalog",
      icon: AiOutlineShoppingCart,
      label: "Catalog",
      children: [
        { key: "product", icon: AiOutlineShoppingCart, label: "Add Product" },
        { key: "list-product", icon: AiOutlineShoppingCart, label: "Product List" },
        { key: "brand", icon: SiBrandfolder, label: "Brand" },
        { key: "list-brand", icon: SiBrandfolder, label: "Brand List" },
        { key: "category", icon: BiCategoryAlt, label: "Category" },
        { key: "list-category", icon: BiCategoryAlt, label: "Category List" },
        { key: "color", icon: AiOutlineBgColors, label: "Color" },
        { key: "list-color", icon: AiOutlineBgColors, label: "Color List" },
      ],
    },
    { key: "orders", icon: FaClipboardList, label: "Orders" },
    {
      key: "marketing",
      icon: RiCouponLine,
      label: "Marketing",
      children: [
        { key: "coupon", icon: ImBlog, label: "Add Coupon" },
        { key: "coupon-list", icon: RiCouponLine, label: "Coupon List" },
      ],
    },
    {
      key: "blogs",
      icon: FaBloggerB,
      label: "Blogs",
      children: [
        { key: "blog", icon: ImBlog, label: "Add Blog" },
        { key: "blog-list", icon: FaBloggerB, label: "Blog List" },
        { key: "blog-category", icon: ImBlog, label: "Add Blog Category" },
        { key: "blog-category-list", icon: FaBloggerB, label: "Blog Category List" },
      ],
    },
    { key: "enquiries", icon: FaClipboardList, label: "Enquiries" },
    { key: "signout", icon: AiOutlineLogout, label: "Sign Out" },
  ];

  const handleMenuClick = (key) => {
    if (key === "signout") {
      localStorage.clear();
      window.location.reload();
    } else {
      setActiveItem(key);
      navigate(key);
    }
  };

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const MenuItem = ({ item, level = 0 }) => {
    const Icon = item.icon;
    const isOpen = openMenus[item.key];
    const isActive = activeItem === item.key;

    return (
      <div key={item.key}>
        <button
          onClick={() => {
            if (item.children) {
              toggleMenu(item.key);
            } else {
              handleMenuClick(item.key);
            }
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            level === 0 ? "mb-1" : "mb-0"
          } ${
            isActive && level === 0
              ? "bg-red-50 text-red-600 font-medium shadow-sm"
              : level === 0
              ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
          style={{ paddingLeft: `${level * 16 + 16}px` }}
        >
          <Icon className={`flex-shrink-0 transition-colors duration-200 ${level === 0 ? "text-lg" : "text-base"}`} />
          {!collapsed && (
            <>
              <span className={`text-sm flex-1 text-left ${level === 0 ? "font-medium" : "font-normal"}`}>
                {item.label}
              </span>
              {item.children && !collapsed && (
                <ChevronDown
                  size={16}
                  className={`flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </>
          )}
        </button>

        {item.children && isOpen && !collapsed && (
          <div className="bg-gray-50/50">
            {item.children.map((child) => (
              <MenuItem key={child.key} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col overflow-hidden ${
          collapsed ? "w-20" : "w-64"
        }`}
        style={{
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Logo Section */}
        <div className="px-6 py-6 border-b border-gray-100">
          {collapsed ? (
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">T</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-gray-900 font-bold text-base tracking-tight">TradeHub</h2>
                <p className="text-xs text-red-500 font-semibold uppercase tracking-wider">Wholesale</p>
              </div>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {menuItems.map((item) => (
            <MenuItem key={item.key} item={item} />
          ))}
        </div>


      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-[70px] bg-white border-b border-gray-200 px-8 flex items-center justify-between flex-shrink-0" style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)" }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-600 hover:text-gray-900"
          >
            {collapsed ? (
              <Menu size={24} />
            ) : (
              <X size={24} />
            )}
          </button>

          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-600 hover:text-gray-900 group">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Settings */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-600 hover:text-gray-900">
              <Settings size={20} />
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200"></div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenUserMenu(!openUserMenu)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
     
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">Dashboard</p>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${openUserMenu ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {openUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden" style={{ boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)" }}>
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Account</p>
                  </div>
                  <Link
                    to="/"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 flex items-center gap-2"
                  >
                    <span className="text-base">👤</span> View Profile
                  </Link>
                  <Link
                    to="/"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 flex items-center gap-2"
                  >
                    <span className="text-base">⚙️</span> Settings
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className="transition-opacity duration-300">
            <ToastContainer
              position="top-right"
              autoClose={250}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              theme="light"
            />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;