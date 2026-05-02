import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FaCalendarPlus, FaUserMd, FaHospital, FaClock, FaIdCard, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaVenusMars, FaCalendarAlt } from "react-icons/fa";

import Button from "../components/Button";
import Container from "../components/Container";
import Input from "../components/Input";
import Select from "../components/Select";
import { api } from "../state/api";
import { useAuth } from "../state/AuthContext";

const Appointment = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nic: "",
    dob: "",
    gender: "Male",
    appointment_date: "",
    department: "",
    doctorId: "",
    doctor_firstName: "",
    doctor_lastName: "",
    doctorDepartment: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setForm((p) => ({
        ...p,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        nic: user.nic || "",
        dob: user.dob ? new Date(user.dob).toISOString().slice(0, 10) : "",
        gender: user.gender || "Male",
      }));
    }
  }, [user]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/api/v1/user/doctors");
        setDoctors(data.doctors || []);
      } catch {
        setDoctors([]);
      }
    };
    load();
  }, []);

  const fallbackDepartments = [
    "General Medicine",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "ENT",
    "Surgery",
    "Radiology",
    "Oncology",
    "Dermatology",
    "Gastroenterology",
  ];

  const departments = useMemo(() => {
    const set = new Set([
      ...doctors.map((d) => d.doctorDepartment).filter(Boolean),
      ...fallbackDepartments,
    ]);
    return Array.from(set).sort();
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    if (!form.department) return [];
    return doctors.filter((d) => d.doctorDepartment === form.department);
  }, [doctors, form.department]);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const onDepartmentChange = (e) => {
    const value = e.target.value;
    setForm((p) => ({
      ...p,
      department: value,
      doctorId: "",
      doctor_firstName: "",
      doctor_lastName: "",
      doctorDepartment: value,
    }));
  };

  const onDoctorChange = (e) => {
    const id = e.target.value;
    const d = doctors.find((x) => x._id === id);
    setForm((p) => ({
      ...p,
      doctorId: id,
      doctor_firstName: d?.firstName || "",
      doctor_lastName: d?.lastName || "",
      doctorDepartment: d?.doctorDepartment || p.department,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/api/v1/appointment/post", form);
      toast.success("Appointment request sent");
      setForm((p) => ({
        ...p,
        appointment_date: "",
        department: "",
        doctorId: "",
        doctor_firstName: "",
        doctor_lastName: "",
        doctorDepartment: "",
        address: "",
      }));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-2xl shadow-slate-200 rounded-[40px] overflow-hidden border border-slate-100">
            <div className="bg-brand-600 px-8 py-12 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-brand-500 opacity-20 blur-3xl" />
               <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-brand-700 opacity-20 blur-3xl" />
               
               <div className="relative z-10">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md mb-6">
                  <FaCalendarPlus className="text-3xl" />
                </div>
                <h1 className="text-3xl font-black text-white sm:text-5xl">Book Appointment</h1>
                <p className="mt-4 text-brand-100 max-w-lg mx-auto">
                  Select your preferred department and doctor to schedule your visit. 
                  Our team will review and confirm your request shortly.
                </p>
               </div>
            </div>

            <div className="px-8 py-12 sm:px-16">
              <form className="grid gap-8 md:grid-cols-2" onSubmit={onSubmit}>
                {/* Personal Information */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold mb-4">
                    <div className="h-2 w-2 rounded-full bg-brand-600" />
                    Personal Information
                  </div>
                </div>
                <div className="relative">
                  <Input label="First Name" value={form.firstName} onChange={set("firstName")} required className="pl-10" />
                  <FaUser className="absolute left-3 top-[38px] text-slate-400 text-sm" />
                </div>
                <div className="relative">
                  <Input label="Last Name" value={form.lastName} onChange={set("lastName")} required className="pl-10" />
                  <FaUser className="absolute left-3 top-[38px] text-slate-400 text-sm" />
                </div>
                <div className="relative">
                  <Input label="Email Address" type="email" value={form.email} onChange={set("email")} required className="pl-10" />
                  <FaEnvelope className="absolute left-3 top-[38px] text-slate-400 text-sm" />
                </div>
                <div className="relative">
                  <Input label="Phone Number" value={form.phone} onChange={set("phone")} minLength={11} maxLength={11} required className="pl-10" />
                  <FaPhone className="absolute left-3 top-[38px] text-slate-400 text-sm" />
                </div>
                <div className="relative">
                  <Input label="NIC Number" value={form.nic} onChange={set("nic")} minLength={13} maxLength={13} required className="pl-10" />
                  <FaIdCard className="absolute left-3 top-[38px] text-slate-400 text-sm" />
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

                {/* Appointment Details */}
                <div className="md:col-span-2 mt-4">
                  <div className="flex items-center gap-2 text-slate-900 font-bold mb-4">
                    <div className="h-2 w-2 rounded-full bg-brand-600" />
                    Appointment Details
                  </div>
                </div>
                <div className="relative">
                  <Input label="Preferred Date" type="date" value={form.appointment_date} onChange={set("appointment_date")} required className="pl-10" />
                  <FaClock className="absolute left-3 top-[38px] text-slate-400 text-sm" />
                </div>
                <div className="relative">
                  <Select label="Select Department" value={form.department} onChange={onDepartmentChange} required className="pl-10">
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option value={d} key={d}>
                        {d}
                      </option>
                    ))}
                  </Select>
                  <FaHospital className="absolute left-3 top-[38px] text-slate-400 text-sm" />
                </div>
                <div className="relative">
                  <Select
                    label="Select Doctor"
                    value={form.doctorId}
                    onChange={onDoctorChange}
                    required
                    className="pl-10"
                    disabled={!form.department}
                  >
                    <option value="">
                      {form.department ? "Select Doctor" : "Choose a department first"}
                    </option>
                    {form.department && filteredDoctors.length > 0 ? (
                      filteredDoctors.map((d) => (
                        <option value={d._id} key={d._id}>
                          Dr. {d.firstName} {d.lastName}
                        </option>
                      ))
                    ) : form.department ? (
                      <option value="" disabled>
                        No doctors available for selected department
                      </option>
                    ) : null}
                  </Select>
                  <FaUserMd className="absolute left-3 top-[38px] text-slate-400 text-sm" />
                </div>
                <div className="relative">
                  <Input label="Full Address" value={form.address} onChange={set("address")} required className="pl-10" />
                  <FaMapMarkerAlt className="absolute left-3 top-[38px] text-slate-400 text-sm" />
                </div>

                <div className="md:col-span-2 pt-8">
                  <Button disabled={submitting} className="w-full py-5 text-base rounded-2xl shadow-xl shadow-brand-100">
                    <span className="inline-flex items-center justify-center gap-2">
                      <FaCalendarPlus />
                      {submitting ? "Submitting Request..." : "Send Appointment Request"}
                    </span>
                  </Button>
                  <p className="mt-4 text-center text-xs text-slate-400">
                    By submitting this form, you agree to our terms of service and patient privacy policy.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Appointment;

