import React from "react";

const variants = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
  secondary:
    "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  outline:
    "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  className = "",
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl font-semibold
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      )}
      {!loading && icon}
      {children}
    </button>
  );
};

export default Button;