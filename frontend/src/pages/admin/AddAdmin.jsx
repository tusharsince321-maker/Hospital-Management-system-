import React, { useState } from "react";
import { toast } from "react-toastify";

import Layout from "../../components/admin/Layout";
import Button from "../../components/admin/Button";
import Input from "../../components/admin/Input";
import Select from "../../components/admin/Select";
import { api } from "../../state/api";

const AddAdmin = () => {
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
  });

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/api/v1/user/admin/addnew", form);
      toast.success("Admin added");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        nic: "",
        dob: "",
        gender: "Male",
        password: "",
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add admin");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl">
        <div className="text-2xl font-extrabold text-slate-900">Add Admin</div>
        <div className="mt-1 text-sm text-slate-600">Create a new admin account.</div>

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
          <Input
            label="Password (min 8 chars)"
            type="password"
            value={form.password}
            onChange={set("password")}
            required
          />
          <div className="md:col-span-2">
            <Button disabled={submitting} className="w-full">
              {submitting ? "Creating..." : "Create Admin"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddAdmin;
