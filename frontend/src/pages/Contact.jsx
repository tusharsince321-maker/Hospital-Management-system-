import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane } from "react-icons/fa";

import Button from "../components/Button";
import Container from "../components/Container";
import Input from "../components/Input";
import { api } from "../state/api";

const Contact = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/api/v1/message/send", form);
      toast.success("Message sent");
      setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Get in Touch
              </h1>
              <div className="mt-4 h-1.5 w-20 rounded-full bg-brand-600" />
              <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-md">
                Have questions or need assistance? Our team is here to help you 
                24/7. Reach out to us through any of these channels.
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  title: "Visit Us",
                  desc: "Near Old Bus Stand, Bansh Ghat, Rewa (MP) 486001, Rewa, India",
                  icon: <FaMapMarkerAlt />,
                  color: "bg-blue-500"
                },
                {
                  title: "Call Us",
                  desc: "076624 06000, +91 9589899826",
                  icon: <FaPhoneAlt />,
                  color: "bg-green-500"
                },
                {
                  title: "Email Us",
                  desc: "vhrcrewa@gmail.com",
                  icon: <FaEnvelope />,
                  color: "bg-brand-600"
                },
                {
                  title: "Working Hours",
                  desc: "Emergency: 24/7 | OPD: 9:00 AM - 8:00 PM",
                  icon: <FaClock />,
                  color: "bg-purple-500"
                }
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-6 group">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.color} text-white shadow-lg transition-transform group-hover:scale-110`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 sm:p-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <FaPaperPlane className="text-brand-600" />
              Send a Message
            </h2>
            <form className="grid gap-6 md:grid-cols-2" onSubmit={onSubmit}>
              <Input label="First Name" value={form.firstName} onChange={set("firstName")} required placeholder="John" />
              <Input label="Last Name" value={form.lastName} onChange={set("lastName")} required placeholder="Doe" />
              <Input label="Email Address" type="email" value={form.email} onChange={set("email")} required placeholder="john@example.com" />
              <Input label="Phone Number" value={form.phone} onChange={set("phone")} required placeholder="+91 12345 67890" />
              <div className="md:col-span-2">
                <label className="block">
                  <div className="mb-2 text-sm font-bold text-slate-700">How can we help?</div>
                  <textarea
                    value={form.message}
                    onChange={set("message")}
                    required
                    rows={5}
                    placeholder="Describe your query or message here..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                  />
                </label>
              </div>
              <div className="md:col-span-2 pt-4">
                <Button disabled={submitting} className="w-full py-4 text-base rounded-2xl shadow-xl shadow-brand-100">
                  {submitting ? "Sending Message..." : "Send Message"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Contact;


