import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import Layout from "../../components/admin/Layout";
import { api } from "../../state/api";
import { useAuth } from "../../state/AuthContext";

const Card = ({ title, value, subtitle }) => {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="text-sm font-semibold text-slate-600">{title}</div>
      <div className="mt-2 text-3xl font-extrabold text-slate-900">{value}</div>
      {subtitle ? <div className="mt-2 text-sm text-slate-600">{subtitle}</div> : null}
    </div>
  );
};

const Dashboard = () => {
  const { role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (role === "Admin") {
          const [docsRes, appsRes] = await Promise.all([
            api.get("/api/v1/user/doctors"),
            api.get("/api/v1/appointment/getall"),
          ]);
          setDoctors(docsRes.data.doctors || []);
          setAppointments(appsRes.data.appointments || []);
        } else {
          const appsRes = await api.get("/api/v1/appointment/doctor/my");
          setAppointments(appsRes.data.appointments || []);
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [role]);

  const stats = useMemo(() => {
    const total = appointments.length;
    const pending = appointments.filter((a) => a.status === "Pending").length;
    const accepted = appointments.filter((a) => a.status === "Accepted").length;
    const rejected = appointments.filter((a) => a.status === "Rejected").length;
    return { total, pending, accepted, rejected };
  }, [appointments]);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <div className="text-2xl font-extrabold text-slate-900">Dashboard</div>
          <div className="mt-1 text-sm text-slate-600">
            {role === "Admin"
              ? "Manage doctors, appointments and messages."
              : "View your assigned appointments."}
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-slate-600">Loading...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-4">
            {role === "Admin" ? <Card title="Total Doctors" value={doctors.length} /> : null}
            <Card title="Total Appointments" value={stats.total} />
            <Card title="Pending" value={stats.pending} />
            <Card title="Accepted" value={stats.accepted} subtitle={`Rejected: ${stats.rejected}`} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;

