import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaEnvelope, FaLock, FaUserCircle } from "react-icons/fa";

import Container from "../components/Container";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import { api } from "../state/api";
import { useAuth } from "../state/AuthContext";

const Login = ({ defaultRole = "Patient" }) => {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [role, setRole] = useState(defaultRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/api/v1/user/login", { email, password, role });
      await refresh();
      toast.success("Logged in");
      if (role === "Admin" || role === "Doctor") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Container>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors mb-8">
            <FaArrowLeft className="text-xs" />
            Back to Home
          </Link>
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-xl shadow-brand-200">
               <FaUserCircle className="text-3xl" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-slate-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Please enter your details to sign in to your account.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-2xl shadow-slate-200 sm:rounded-[32px] sm:px-10 border border-slate-100">
            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <Select label="Login as" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="Patient">Patient</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Admin">Admin</option>
                </Select>
              </div>
              <div className="relative">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
                <FaEnvelope className="absolute left-3 top-[38px] text-slate-400 text-sm" />
              </div>

              <div className="relative">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                />
                <FaLock className="absolute left-3 top-[38px] text-slate-400 text-sm" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-bold text-brand-600 hover:text-brand-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <Button disabled={submitting} className="w-full py-4 text-base rounded-2xl shadow-lg shadow-brand-100">
                  {submitting ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-slate-500 font-medium uppercase tracking-widest text-[10px]">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                   Google
                </button>
                <button className="flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                   Apple
                </button>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-brand-600 hover:text-brand-500 transition-colors">
              Create an account for free
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Login;


