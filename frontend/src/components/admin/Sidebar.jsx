import React from "react";
import { NavLink } from "react-router-dom";
import { FaBrain, FaCalendarCheck, FaEnvelopeOpenText, FaPlus, FaUserMd } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

import { useAuth } from "../../state/AuthContext";

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
    isActive ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-100"
  }`;

const Sidebar = () => {
  const { role } = useAuth();

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-white md:block">
      <div className="p-5">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white font-bold">
            H
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-slate-900">Hospital</div>
            <div className="text-xs text-slate-500">
              {role === "Doctor" ? "Doctor Panel" : "Admin Dashboard"}
            </div>
          </div>
        </div>

        <nav className="mt-6 space-y-1">
          <NavLink to="/admin" className={linkClass} end>
            <MdDashboard /> Dashboard
          </NavLink>
          <NavLink to="/admin/appointments" className={linkClass}>
            <FaCalendarCheck /> Appointments
          </NavLink>
          <NavLink to="/admin/analytics" className={linkClass}>
            <FaBrain /> ML Analytics
          </NavLink>

          {role === "Admin" ? (
            <>
              <NavLink to="/admin/doctors" className={linkClass}>
                <FaUserMd /> Doctors
              </NavLink>
              <NavLink to="/admin/doctors/add" className={linkClass}>
                <FaPlus /> Add Doctor
              </NavLink>
              <NavLink to="/admin/admins/add" className={linkClass}>
                <FaPlus /> Add Admin
              </NavLink>
              <NavLink to="/admin/messages" className={linkClass}>
                <FaEnvelopeOpenText /> Messages
              </NavLink>
            </>
          ) : null}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

