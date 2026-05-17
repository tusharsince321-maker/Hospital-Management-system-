import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHistory, FaUserMd, FaCalendarAlt, FaStethoscope, FaInfoCircle, FaChevronRight } from "react-icons/fa";

import Container from "../components/Container";
import { api } from "../state/api";

const statusStyles = (status) => {
  if (status === "Accepted") return "bg-green-100 text-green-700 border-green-200";
  if (status === "Rejected") return "bg-red-100 text-red-700 border-red-200";
  return "bg-yellow-100 text-yellow-700 border-yellow-200";
};

const suggestedDate = (appointment) => appointment.doctorSuggestedDate || appointment.doctor_response_date || "";
const suggestedTime = (appointment) => appointment.doctorSuggestedTime || appointment.doctor_response_time || "";
const suggestedMessage = (appointment) => appointment.doctorMessage || appointment.doctor_message || "";

const MyAppointments = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/api/v1/appointment/patient/my");
        setAppointments(data.appointments || []);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl flex items-center gap-3">
                <FaHistory className="text-brand-600" />
                Appointment History
              </h1>
              <p className="mt-2 text-slate-600">Track your appointment requests and status updates.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-slate-500 shadow-sm border border-slate-100">
               <FaInfoCircle className="text-brand-500" />
               Total: {appointments.length}
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] shadow-sm border border-slate-100">
                <div className="h-12 w-12 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-bold">Loading your history...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[40px] shadow-sm border border-slate-100 px-6">
                <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-3xl bg-slate-50 text-slate-300 text-4xl mb-6">
                  <FaHistory />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No Appointments Found</h3>
                <p className="mt-2 text-slate-500 max-w-sm mx-auto leading-relaxed">
                  You haven't booked any appointments yet. Click the button below to schedule your first visit.
                </p>
                <Link to="/appointment" className="mt-8 inline-block bg-brand-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-brand-100 hover:bg-brand-700 transition-all">
                  Book Now
                </Link>
              </div>
            ) : (
              appointments.map((a) => (
                <div
                  key={a._id}
                  className="group bg-white rounded-[32px] p-6 shadow-sm border border-white hover:border-brand-100 hover:shadow-xl hover:shadow-slate-200 transition-all cursor-default"
                >
                  <div className="grid gap-6 md:grid-cols-4 items-center">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-slate-50 text-brand-600 text-xl shadow-inner group-hover:bg-brand-50 transition-colors">
                        <FaUserMd />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Doctor</div>
                        <div className="text-base font-black text-slate-900">
                          Dr. {a.doctor?.firstName} {a.doctor?.lastName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-slate-50 text-blue-500 text-lg group-hover:bg-blue-50 transition-colors">
                        <FaStethoscope />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Department</div>
                        <div className="text-base font-bold text-slate-700">{a.department}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-slate-50 text-purple-500 text-lg group-hover:bg-purple-50 transition-colors">
                        <FaCalendarAlt />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</div>
                        <div className="text-base font-bold text-slate-700">
                           {new Date(a.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 md:col-span-1">
                      {a.status === "Accepted" && suggestedDate(a) ? (
                        <div className="rounded-3xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-slate-700">
                          <div className="font-semibold text-green-700">Doctor scheduled</div>
                          <div>Date: {new Date(suggestedDate(a)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                          <div>Time: {suggestedTime(a)}</div>
                        </div>
                      ) : null}
                      {suggestedMessage(a) ? (
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                          <div className="font-semibold text-slate-800">Doctor note</div>
                          <div>{suggestedMessage(a)}</div>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-black uppercase tracking-wider ${statusStyles(a.status)}`}
                      >
                        <div className={`h-1.5 w-1.5 rounded-full ${a.status === 'Accepted' ? 'bg-green-500' : a.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                        {a.status}
                      </span>
                      <FaChevronRight className="text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default MyAppointments;

