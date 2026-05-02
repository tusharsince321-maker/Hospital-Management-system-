import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserCircle, FaCalendarPlus } from "react-icons/fa";

import Container from "./Container";
import Button from "./Button";
import { api } from "../state/api";
import { useAuth } from "../state/AuthContext";

const navLinkClass = ({ isActive }) =>
  `relative px-1 py-2 text-sm font-semibold transition-all duration-300 hover:text-brand-600 ${
    isActive ? "text-brand-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-brand-600" : "text-slate-600"
  }`;

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, role, refresh } = useAuth();

  const onLogout = async () => {
    try {
      await api.get("/api/v1/user/logout");
      toast.success("Logged out");
      await refresh();
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white shadow-lg shadow-brand-200 transition-transform group-hover:scale-105">
               <span className="text-xl font-black">V</span>
            </div>
            <div className="hidden leading-tight sm:block">
              <div className="text-lg font-bold tracking-tight text-slate-900">People</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Hospital</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About Us
            </NavLink>
            <NavLink to="/department" className={navLinkClass}>
              Department
            </NavLink>
            <NavLink to="/doctors" className={navLinkClass}>
              Our Doctors
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
            {isAuthenticated && (role === "Admin" || role === "Doctor") && (
              <NavLink to="/admin" className={navLinkClass}>
                Dashboard
              </NavLink>
            )}
            {isAuthenticated && (
              <NavLink to="/appointment" className={navLinkClass}>
                <span className="inline-flex items-center gap-1">
                  <FaCalendarPlus className="text-sm" />
                  Book Appointment
                </span>
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="hidden flex-col items-end sm:flex">
                  <span className="text-xs font-medium text-slate-500">Welcome back,</span>
                  <span className="text-sm font-bold text-slate-900">{user?.firstName}</span>
                </div>
                <div className="h-10 w-10 rounded-full border-2 border-brand-100 p-0.5">
                   <FaUserCircle className="h-full w-full text-slate-300" />
                </div>
                <button 
                  onClick={onLogout}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-bold text-slate-700 hover:text-brand-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/register">
                  <Button className="rounded-lg px-5 py-2.5 text-xs shadow-md shadow-brand-100">
                    Create Account
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;


