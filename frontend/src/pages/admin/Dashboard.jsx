import React, { useEffect, useMemo, useState } from "react";
import {
  FaBolt,
  FaCalendarDay,
  FaChartLine,
  FaClipboardList,
  FaStethoscope,
  FaUserMd,
} from "react-icons/fa";
import { toast } from "react-toastify";

import Layout from "../../components/admin/Layout";
import { api } from "../../state/api";
import { useAuth } from "../../state/AuthContext";

const Card = ({ title, value, subtitle, icon: Icon, tone = "blue" }) => {
  const tones = {
    blue: "bg-brand-50 text-brand-700 ring-brand-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    rose: "bg-rose-50 text-rose-700 ring-rose-100",
  };

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-600">{title}</div>
        {Icon ? (
          <div className={`grid h-10 w-10 place-items-center rounded-2xl ring-1 ${tones[tone]}`}>
            <Icon />
          </div>
        ) : null}
      </div>
      <div className="mt-2 text-3xl font-extrabold text-slate-900">{value}</div>
      {subtitle ? <div className="mt-2 text-sm text-slate-600">{subtitle}</div> : null}
    </div>
  );
};

const getAppointmentDate = (appointment) => {
  if (!appointment.appointment_date) return null;
  const date = new Date(`${appointment.appointment_date}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatShortDate = (date) =>
  date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const percentage = (value, total) => (total ? Math.round((value / total) * 100) : 0);

const buildTopList = (items, getKey) => {
  const counts = items.reduce((acc, item) => {
    const key = getKey(item) || "Unassigned";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};

const ProgressRow = ({ label, value, max, accent = "bg-brand-600" }) => {
  const width = max ? Math.max(8, Math.round((value / max) * 100)) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="truncate font-semibold text-slate-700">{label}</span>
        <span className="shrink-0 text-slate-500">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${accent}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
};

const Insight = ({ title, value, subtitle, icon: Icon }) => (
  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
      {Icon ? <Icon className="text-brand-600" /> : null}
      {title}
    </div>
    <div className="mt-2 text-2xl font-extrabold text-slate-900">{value}</div>
    <div className="mt-1 text-sm text-slate-600">{subtitle}</div>
  </div>
);

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
    const visited = appointments.filter((a) => a.hasVisited).length;
    return { total, pending, accepted, rejected, visited };
  }, [appointments]);

  const analytics = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const datedAppointments = appointments
      .map((appointment) => ({ ...appointment, dateValue: getAppointmentDate(appointment) }))
      .filter((appointment) => appointment.dateValue);

    const nextSevenDays = Array.from({ length: 7 }, (_, index) => {
      const date = addDays(today, index);
      const count = datedAppointments.filter((appointment) => sameDay(appointment.dateValue, date)).length;
      return { label: index === 0 ? "Today" : formatShortDate(date), count };
    });

    const upcoming = datedAppointments.filter((appointment) => appointment.dateValue >= today);
    const overduePending = datedAppointments.filter(
      (appointment) => appointment.status === "Pending" && appointment.dateValue < today
    ).length;

    const departmentLoad = buildTopList(appointments, (appointment) => appointment.department);
    const doctorLoad = buildTopList(
      appointments,
      (appointment) =>
        appointment.doctor?.firstName
          ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName || ""}`.trim()
          : appointment.doctorId?.firstName
            ? `Dr. ${appointment.doctorId.firstName} ${appointment.doctorId.lastName || ""}`.trim()
            : "Unassigned"
    );

    const maxDepartmentLoad = Math.max(...departmentLoad.map((item) => item.count), 0);
    const maxDoctorLoad = Math.max(...doctorLoad.map((item) => item.count), 0);
    const maxForecastLoad = Math.max(...nextSevenDays.map((item) => item.count), 1);
    const busiestDepartment = departmentLoad[0];
    const busiestDay = [...nextSevenDays].sort((a, b) => b.count - a.count)[0];
    const acceptanceRate = percentage(stats.accepted, stats.total);
    const pendingRate = percentage(stats.pending, stats.total);

    const alerts = [];
    if (stats.pending > 0) alerts.push(`${stats.pending} appointments need review.`);
    if (overduePending > 0) alerts.push(`${overduePending} pending appointments are past their requested date.`);
    if (busiestDepartment) alerts.push(`${busiestDepartment.name} has the highest demand right now.`);
    if (busiestDay?.count > 0) alerts.push(`${busiestDay.label} is forecast as the busiest upcoming slot.`);
    if (!alerts.length) alerts.push("No immediate appointment pressure detected.");

    return {
      acceptanceRate,
      alerts,
      busiestDay,
      busiestDepartment,
      departmentLoad,
      doctorLoad,
      maxDepartmentLoad,
      maxDoctorLoad,
      maxForecastLoad,
      nextSevenDays,
      overduePending,
      pendingRate,
      upcoming: upcoming.length,
    };
  }, [appointments, stats.accepted, stats.pending, stats.total]);

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
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {role === "Admin" ? (
                <Card title="Total Doctors" value={doctors.length} icon={FaUserMd} />
              ) : null}
              <Card title="Total Appointments" value={stats.total} icon={FaClipboardList} tone="green" />
              <Card
                title="Pending Review"
                value={stats.pending}
                subtitle={`${analytics.pendingRate}% of total appointments`}
                icon={FaBolt}
                tone="amber"
              />
              <Card
                title="Accepted"
                value={stats.accepted}
                subtitle={`Rejected: ${stats.rejected} | Visited: ${stats.visited}`}
                icon={FaCalendarDay}
                tone="green"
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              <div className="rounded-3xl border bg-white p-6 shadow-sm xl:col-span-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-extrabold text-slate-900">Smart Analytics</div>
                    <div className="mt-1 text-sm text-slate-600">
                      Lightweight ML-style signals from live appointment data.
                    </div>
                  </div>
                  <div className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 ring-1 ring-brand-100">
                    Demand Forecast
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <Insight
                    title="Acceptance Rate"
                    value={`${analytics.acceptanceRate}%`}
                    subtitle="Confirmed against total requests"
                    icon={FaChartLine}
                  />
                  <Insight
                    title="Upcoming Load"
                    value={analytics.upcoming}
                    subtitle="Scheduled from today onward"
                    icon={FaCalendarDay}
                  />
                  <Insight
                    title="Busy Department"
                    value={analytics.busiestDepartment?.name || "None"}
                    subtitle={
                      analytics.busiestDepartment
                        ? `${analytics.busiestDepartment.count} appointment requests`
                        : "No department data yet"
                    }
                    icon={FaStethoscope}
                  />
                </div>

                <div className="mt-6">
                  <div className="mb-3 text-sm font-bold text-slate-700">Next 7 Days Forecast</div>
                  <div className="grid grid-cols-7 gap-2">
                    {analytics.nextSevenDays.map((day) => (
                      <div key={day.label} className="flex min-h-36 flex-col justify-end rounded-2xl bg-slate-50 p-3">
                        <div
                          className="rounded-t-xl bg-brand-600"
                          style={{
                            height: `${day.count ? Math.max(18, (day.count / analytics.maxForecastLoad) * 84) : 6}px`,
                          }}
                          title={`${day.count} appointments`}
                        />
                        <div className="mt-2 text-center text-xs font-bold text-slate-700">{day.label}</div>
                        <div className="text-center text-xs text-slate-500">{day.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <div className="text-lg font-extrabold text-slate-900">Action Alerts</div>
                <div className="mt-1 text-sm text-slate-600">Quick decisions for admin and doctor teams.</div>
                <div className="mt-5 space-y-3">
                  {analytics.alerts.map((alert) => (
                    <div key={alert} className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-slate-700">
                      {alert}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <div className="text-lg font-extrabold text-slate-900">Department Demand</div>
                <div className="mt-1 text-sm text-slate-600">Top departments by appointment volume.</div>
                <div className="mt-5 space-y-4">
                  {analytics.departmentLoad.length ? (
                    analytics.departmentLoad.map((item) => (
                      <ProgressRow
                        key={item.name}
                        label={item.name}
                        value={item.count}
                        max={analytics.maxDepartmentLoad}
                        accent="bg-emerald-600"
                      />
                    ))
                  ) : (
                    <div className="text-sm text-slate-600">No department data yet.</div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <div className="text-lg font-extrabold text-slate-900">
                  {role === "Admin" ? "Doctor Workload" : "Your Appointment Mix"}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  {role === "Admin" ? "Doctors ranked by assigned appointments." : "Your recent department demand."}
                </div>
                <div className="mt-5 space-y-4">
                  {(role === "Admin" ? analytics.doctorLoad : analytics.departmentLoad).length ? (
                    (role === "Admin" ? analytics.doctorLoad : analytics.departmentLoad).map((item) => (
                      <ProgressRow
                        key={item.name}
                        label={item.name}
                        value={item.count}
                        max={role === "Admin" ? analytics.maxDoctorLoad : analytics.maxDepartmentLoad}
                        accent="bg-brand-600"
                      />
                    ))
                  ) : (
                    <div className="text-sm text-slate-600">No workload data yet.</div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;

