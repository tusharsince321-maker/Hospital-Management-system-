import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Layout from "../../components/admin/Layout";
import { api } from "../../state/api";

const Messages = () => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/api/v1/message/getall");
        setMessages(data.messages || []);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Layout>
      <div>
        <div className="text-2xl font-extrabold text-slate-900">Messages</div>
        <div className="mt-1 text-sm text-slate-600">Patient contact form messages.</div>

        <div className="mt-6 overflow-hidden rounded-3xl border bg-white shadow-sm">
          <div className="grid grid-cols-12 gap-2 border-b bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Phone</div>
            <div className="col-span-4">Message</div>
          </div>
          {loading ? (
            <div className="p-6 text-sm text-slate-600">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="p-6 text-sm text-slate-600">No messages.</div>
          ) : (
            messages.map((m) => (
              <div
                key={m._id}
                className="grid grid-cols-12 gap-2 border-b px-4 py-4 text-sm text-slate-700 last:border-b-0"
              >
                <div className="col-span-3 font-semibold">
                  {m.firstName} {m.lastName}
                </div>
                <div className="col-span-3">{m.email}</div>
                <div className="col-span-2">{m.phone}</div>
                <div className="col-span-4">{m.message}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;

