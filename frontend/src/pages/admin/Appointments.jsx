import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import Layout from "../../components/admin/Layout";
import Button from "../../components/admin/Button";
import Select from "../../components/admin/Select";
import { api } from "../../state/api";
import { useAuth } from "../../state/AuthContext";

const statusPill = (status) => {
  if (status === "Accepted") return "bg-green-50 text-green-700 ring-green-200";
  if (status === "Rejected") return "bg-red-50 text-red-700 ring-red-200";
  return "bg-yellow-50 text-yellow-700 ring-yellow-200";
};

const suggestedDate = (appointment) => appointment.doctorSuggestedDate || appointment.doctor_response_date || "";
const suggestedTime = (appointment) => appointment.doctorSuggestedTime || appointment.doctor_response_time || "";
const suggestedMessage = (appointment) => appointment.doctorMessage || appointment.doctor_message || "";

const Appointments = () => {
  const { role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [scheduleInputs, setScheduleInputs] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const { data } =
        role === "Admin"
          ? await api.get("/api/v1/appointment/getall")
          : await api.get("/api/v1/appointment/doctor/my");
      setAppointments(data.appointments || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const updateStatus = async (id, status, payload = {}) => {
    setUpdatingId(id);
    try {
      await api.put(`/api/v1/appointment/update/${id}`, { status, ...payload });
      toast.success("Updated");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update");
    } finally {
      setUpdatingId(null);
    }
  };

  const setScheduleField = (id, field) => (e) => {
    setScheduleInputs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: e.target.value,
      },
    }));
  };

  const acceptAppointment = async (id) => {
    const { doctorSuggestedDate, doctorSuggestedTime } = scheduleInputs[id] || {};
    if (!doctorSuggestedDate || !doctorSuggestedTime) {
      toast.error("Please select a scheduled date and time before accepting.");
      return;
    }
    await updateStatus(id, "Accepted", { doctorSuggestedDate, doctorSuggestedTime });
  };

  const rejectAppointment = async (id) => {
    await updateStatus(id, "Rejected");
  };

  const deleteAppointment = async (id) => {
    if (!confirm("Delete this appointment?")) return;
    try {
      await api.delete(`/api/v1/appointment/delete/${id}`);
      toast.success("Deleted");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete");
    }
  };

  const rows = useMemo(() => appointments, [appointments]);

  return (
    <Layout>
      <div>
        <div className="text-2xl font-extrabold text-slate-900">Appointments</div>
        <div className="mt-1 text-sm text-slate-600">
          {role === "Admin" ? "Accept/Reject and manage all appointments." : "Your assigned appointments."}
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border bg-white shadow-sm">
          <div className="grid grid-cols-12 gap-2 border-b bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
            <div className="col-span-3">Patient</div>
            <div className="col-span-3">Doctor</div>
            <div className="col-span-2">Department</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2 text-right">Status</div>
          </div>
          {loading ? (
            <div className="p-6 text-sm text-slate-600">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="p-6 text-sm text-slate-600">No appointments.</div>
          ) : (
            rows.map((a) => (
              <div key={a._id} className="border-b px-4 py-4 last:border-b-0">
                <div className="grid grid-cols-12 items-center gap-2 text-sm text-slate-700">
                  <div className="col-span-3 font-semibold">
                    {a.patientId?.firstName ? (
                      <>
                        {a.patientId.firstName} {a.patientId.lastName}
                      </>
                    ) : (
                      <>
                        {a.firstName} {a.lastName}
                      </>
                    )}
                  </div>
                  <div className="col-span-3">
                    Dr. {a.doctor?.firstName} {a.doctor?.lastName}
                  </div>
                  <div className="col-span-2">{a.department}</div>
                  <div className="col-span-2">{a.appointment_date}</div>
                  <div className="col-span-2 text-right">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ring-1 ${statusPill(
                        a.status
                      )}`}
                    >
                      {a.status}
                    </span>
                  </div>
                </div>
                {a.status === "Accepted" && suggestedDate(a) ? (
                  <div className="mt-3 rounded-3xl border border-green-100 bg-green-50 p-4 text-sm text-slate-700">
                    <div className="font-semibold text-green-700">Scheduled for Patient</div>
                    <div>Doctor date: {suggestedDate(a)}</div>
                    <div>Doctor time: {suggestedTime(a)}</div>
                    {suggestedMessage(a) ? <div>Note: {suggestedMessage(a)}</div> : null}
                  </div>
                ) : null}

                {role === "Doctor" && a.status === "Pending" ? (
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-600">Scheduled Date</label>
                      <input
                        type="date"
                        value={scheduleInputs[a._id]?.doctorSuggestedDate || suggestedDate(a)}
                        onChange={setScheduleField(a._id, "doctorSuggestedDate")}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600">Scheduled Time</label>
                      <input
                        type="time"
                        value={scheduleInputs[a._id]?.doctorSuggestedTime || suggestedTime(a)}
                        onChange={setScheduleField(a._id, "doctorSuggestedTime")}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-600"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button
                        disabled={updatingId === a._id}
                        onClick={() => acceptAppointment(a._id)}
                        className="w-full"
                      >
                        Accept
                      </Button>
                      <Button
                        disabled={updatingId === a._id}
                        variant="danger"
                        onClick={() => rejectAppointment(a._id)}
                        className="w-full"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ) : null}

                {role === "Admin" ? (
                  <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                    <div className="w-44">
                      <Select
                        value={a.status}
                        onChange={(e) => updateStatus(a._id, e.target.value)}
                        disabled={updatingId === a._id}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </Select>
                    </div>
                    <Button variant="danger" onClick={() => deleteAppointment(a._id)}>
                      Delete
                    </Button>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;

