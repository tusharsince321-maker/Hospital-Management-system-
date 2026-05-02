import React from "react";

const Button = ({ children, className = "", variant = "primary", ...props }) => {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-60";
  const styles =
    variant === "secondary"
      ? "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
      : variant === "danger"
        ? "bg-red-600 text-white hover:bg-red-700"
        : "bg-brand-600 text-white hover:bg-brand-700";

  return (
    <button {...props} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
};

export default Button;

