import React from "react";
import { Link } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaArrowRight, FaClock } from "react-icons/fa";
import Container from "./Container";

const Footer = () => {
  return (
    <footer className="mt-16 border-t bg-slate-50 pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and Contact Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
                 <img src="/logo.png" alt="People" className="h-10 w-10 object-contain" onError={(e) => e.target.style.display='none'} />
                 <span className="text-2xl font-bold text-brand-600">People</span>
              </div>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-slate-500">
              Near Old Bus Stand, Bansh Ghat, Rewa (MP) 486001, Rewa, India, Madhya Pradesh
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <FaPhoneAlt className="text-brand-500" />
                <span>076624 06000</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <FaPhoneAlt className="text-brand-500" />
                <span>+91 9589899826</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <FaEnvelope className="text-brand-500" />
                <a href="mailto:vhrcrewa@gmail.com" className="hover:text-brand-600">vhrcrewa@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Main Menu */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-slate-900">Main Menu</h3>
            <ul className="space-y-4">
              {[
                { name: "Homepage", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Department", path: "/department" },
                { name: "Our Doctor", path: "/doctors" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-brand-600"
                  >
                    <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-slate-900">About Us</h3>
            <ul className="space-y-4">
              {[
                "Our Mission & Values",
                "Policies & Procedures",
                "Consultation & Advanced Care",
                "Preparing for Admission",
                "Quality Care & Patient Safety",
                "Diversity is Our Specialty",
              ].map((item) => (
                <li key={item}>
                  <button className="group flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-brand-600">
                    <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1" />
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Hospital Hours */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-slate-900">Hospital Hours</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <FaClock className="text-brand-500" />
                  <span>Monday - Friday</span>
                </div>
                <span className="font-semibold text-slate-900">08:00 - 20:00</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <FaClock className="text-brand-500" />
                  <span>Saturday</span>
                </div>
                <span className="font-semibold text-slate-900">09:00 - 18:00</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <FaClock className="text-brand-500" />
                  <span>Sunday</span>
                </div>
                <span className="font-semibold text-slate-900">09:00 - 18:00</span>
              </div>

              <div className="mt-6 rounded-xl bg-white p-4 text-center shadow-sm border border-slate-100">
                <div className="text-sm font-bold text-brand-600">Emergency : 24 hours</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-200 pt-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} People Hospital Management System. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;


