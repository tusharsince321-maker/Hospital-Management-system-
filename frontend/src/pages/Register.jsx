import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaUserPlus, FaUser, FaEnvelope, FaPhone, FaIdCard, FaCalendarAlt, FaVenusMars, FaLock } from "react-icons/fa";

import Button from "../components/Button";
import Container from "../components/Container";
import Input from "../components/Input";
import Select from "../components/Select";
import { api } from "../state/api";
import { useAuth } from "../state/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nic: "",
    dob: "",
    gender: "Male",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/api/v1/user/patient/register", form);
      await refresh();
      toast.success("Account created");
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Container>
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors mb-8">
            <FaArrowLeft className="text-xs" />
            Back to Home
          </Link>
          
          <div className="bg-white shadow-2xl shadow-slate-200 rounded-[40px] overflow-hidden border border-slate-100">
            <div className="bg-brand-600 px-8 py-10 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md mb-6">
                <FaUserPlus className="text-3xl" />
              </div>
              <h2 className="text-3xl font-black text-white">Create Account</h2>
              <p className="mt-2 text-brand-100">Join People for premium healthcare services.</p>
            </div>

            <div className="px-8 py-10 sm:px-12">
              <form className="grid gap-6 md:grid-cols-2" onSubmit={onSubmit}>
                <div className="relative">
                  <Input label="First Name" value={form.firstName} onChange={set("firstName")} minLength={2} required className="pl-10" />
                  <FaUser className="absolute left-3 top-[38px] text-slate-400 text-sm" />
                </div>
                <div className="relative">
                  <Input label="Last Name" value={form.lastName} onChange={set("lastName")} minLength={2} required className="pl-10" />
                  <FaUser className="absolute left-3 top-[38px] text-slate-400 text-sm" />
                </div>
                <div className="relative">
                  <Input label="Email Address" type="email" value={form.email} onChange={set("email")} required className="pl-10" />
                  <FaEnvelope className="absolute left-3 top-[38px] text-slate-400 text-sm" />
                </div>
                <div className="relative">
                  <Input label="Phone Number" value={form.phone} onChange={set("phone")} minLength={11} maxLength={11} required className="pl-10" />
                  <FaPhone className="absolute left-3 top-10 text-slate-400" />
                </div>
                <div className="relative">
                  <Input label="NIC" value={form.nic} onChange={set("nic")} minLength={13} maxLength={13} required className="pl-10" />
                  <FaIdCard className="absolute left-3 top-10 text-slate-400" />
                </div>
                <div className="relative">
                  <Input label="Date of Birth" type="date" value={form.dob} onChange={set("dob")} required className="pl-10" />
                  <FaCalendarAlt className="absolute left-3 top-[38px] text-slate-400 text-sm" />
                </div>
                <div className="relative">
                  <Select label="Gender" value={form.gender} onChange={set("gender")} className="pl-10">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </Select>
                  <FaVenusMars className="absolute left-3 top-[38px] text-slate-400 text-sm" />
                </div>
                <div className="relative">
                  <Input label="Password" type="password" value={form.password} onChange={set("password")} minLength={8} required className="pl-10" />
                  <FaLock className="absolute left-3 top-[38px] text-slate-400 text-sm" />
                </div>
                
                <div className="md:col-span-2 pt-4">
                  <Button disabled={submitting} className="w-full py-4 text-base rounded-2xl shadow-lg shadow-brand-100">
                    {submitting ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </form>

              <div className="mt-8 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link className="font-bold text-brand-600 hover:text-brand-500 transition-colors" to="/login">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Register;

