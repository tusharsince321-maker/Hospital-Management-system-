import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Layout from "../../components/admin/Layout";
import Button from "../../components/admin/Button";
import Input from "../../components/admin/Input";
import Select from "../../components/admin/Select";
import { api } from "../../state/api";

const departments = [
  "Cardiology",
  "Orthopedics",
  "Neurology",
  "Pediatrics",
  "Dermatology",
  "General Medicine",
  "ENT",
  "Surgery",
  "Radiology",
  "Oncology",
  "Gastroenterology",
];

const AddDoctor = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nic: "",
    dob: "",
    gender: "Male",
    password: "",
    doctorDepartment: "",
  });

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Doctor avatar is required");
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("docAvatar", file);

      await api.post("/api/v1/user/doctor/addnew", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Doctor added");
      navigate("/admin/doctors");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add doctor");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl">
        <div className="text-2xl font-extrabold text-slate-900">Add Doctor</div>
        <div className="mt-1 text-sm text-slate-600">Create a doctor account and upload avatar.</div>

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <Input label="First name" value={form.firstName} onChange={set("firstName")} required />
          <Input label="Last name" value={form.lastName} onChange={set("lastName")} required />
          <Input label="Email" type="email" value={form.email} onChange={set("email")} required />
          <Input label="Phone (11 digits)" value={form.phone} onChange={set("phone")} required />
          <Input label="NIC (13 digits)" value={form.nic} onChange={set("nic")} required />
          <Input label="Date of birth" type="date" value={form.dob} onChange={set("dob")} required />
          <Select label="Gender" value={form.gender} onChange={set("gender")}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </Select>
          <Select
            label="Department"
            value={form.doctorDepartment}
            onChange={set("doctorDepartment")}
            required
          >
            <option value="">Select department</option>
            {departments.map((d) => (
              <option value={d} key={d}>
                {d}
              </option>
            ))}
          </Select>
          <Input
            label="Password (min 8 chars)"
            type="password"
            value={form.password}
            onChange={set("password")}
            required
          />
          <label className="block md:col-span-2">
            <div className="mb-1 text-sm font-medium text-slate-700">Avatar</div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            />
          </label>
          <div className="md:col-span-2">
            <Button disabled={submitting} className="w-full">
              {submitting ? "Creating..." : "Create Doctor"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddDoctor;
