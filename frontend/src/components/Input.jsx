import React from "react";

const Input = ({ label, error, ...props }) => {
  return (
    <label className="block">
      {label ? <div className="mb-1 text-sm font-medium text-slate-700">{label}</div> : null}
      <input
        {...props}
        className={`w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-brand-600 ${
          error ? "border-red-500" : "border-slate-200"
        } ${props.className || ""}`}
      />
      {error ? <div className="mt-1 text-xs text-red-600">{error}</div> : null}
    </label>
  );
};

export default Input;

