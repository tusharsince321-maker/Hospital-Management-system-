import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "./Button";
import { api } from "../../state/api";
import { useAuth } from "../../state/AuthContext";

const Topbar = () => {
  const navigate = useNavigate();
  const { user, role, refresh } = useAuth();

  const logout = async () => {
    try {
      await api.get("/api/v1/user/logout");
      await refresh();
      toast.success("Logged out");
      navigate("/admin/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-sm font-semibold text-slate-700">
          {role === "Doctor" ? "Doctor" : "Admin"}:{" "}
          <span className="text-slate-900">
            {user?.firstName} {user?.lastName}
          </span>
        </div>
        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Topbar;

