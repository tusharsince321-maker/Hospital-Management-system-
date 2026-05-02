import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Layout from "../../components/admin/Layout";
import Button from "../../components/admin/Button";
import { api } from "../../state/api";

const Doctors = () => {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/v1/user/doctors");
      setDoctors(data.doctors || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete this doctor?")) return;
    try {
      await api.delete(`/api/v1/user/doctor/${id}`);
      toast.success("Doctor deleted");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <Layout>
      <div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-2xl font-extrabold text-slate-900">Doctors</div>
            <div className="mt-1 text-sm text-slate-600">Add, update, and delete doctors.</div>
          </div>
          <Link to="/admin/doctors/add">
            <Button>Add Doctor</Button>
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border bg-white shadow-sm">
          <div className="grid grid-cols-12 gap-2 border-b bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
            <div className="col-span-4">Doctor</div>
            <div className="col-span-3">Department</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          {loading ? (
            <div className="p-6 text-sm text-slate-600">Loading...</div>
          ) : doctors.length === 0 ? (
            <div className="p-6 text-sm text-slate-600">No doctors.</div>
          ) : (
            doctors.map((d) => (
              <div
                key={d._id}
                className="grid grid-cols-12 items-center gap-2 border-b px-4 py-4 text-sm text-slate-700 last:border-b-0"
              >
                <div className="col-span-4 flex items-center gap-3 font-semibold">
                  <img
                    src={d.docAvatar?.url || "https://placehold.co/64x64?text=DR"}
                    alt="Doctor"
                    className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <div>
                      Dr. {d.firstName} {d.lastName}
                    </div>
                    <div className="text-xs font-medium text-slate-500">{d.phone}</div>
                  </div>
                </div>
                <div className="col-span-3">{d.doctorDepartment || "-"}</div>
                <div className="col-span-3">{d.email}</div>
                <div className="col-span-2 flex justify-end gap-2">
                  <Link to={`/admin/doctors/${d._id}/edit`}>
                    <Button variant="secondary">Edit</Button>
                  </Link>
                  <Button variant="danger" onClick={() => remove(d._id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Doctors;

