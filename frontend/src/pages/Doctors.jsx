import React from "react";
import { FaLinkedin, FaTwitter, FaEnvelope, FaCalendarCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import Container from "../components/Container";

const doctors = [
  { 
    name: "Dr. Arvind Singh", 
    role: "Chief Surgeon", 
    dept: "Surgery",
    exp: "15+ Years",
    image: "/doctor_portrait_1_1776878663410.png"
  },
  { 
    name: "Dr. Priya Sharma", 
    role: "Senior Cardiologist", 
    dept: "Cardiology",
    exp: "12+ Years",
    image: "/doctor_portrait_2_1776878736074.png"
  },
  { 
    name: "Dr. Rajesh Verma", 
    role: "Pediatrician", 
    dept: "Pediatrics",
    exp: "10+ Years",
    image: "/doctor_portrait_1_1776878663410.png"
  },
  { 
    name: "Dr. Meera Iyer", 
    role: "Neurologist", 
    dept: "Neurology",
    exp: "8+ Years",
    image: "/doctor_portrait_2_1776878736074.png"
  },
];

const Doctors = () => {
  return (
    <div className="bg-white py-20 min-h-screen">
      <Container>
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">
            Meet Our Specialists
          </h1>
          <div className="mt-4 h-1.5 w-24 rounded-full bg-brand-600 mx-auto" />
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Our team consists of world-renowned medical professionals dedicated to 
            providing the highest standard of care and expertise.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doc) => (
            <div 
              key={doc.name} 
              className="group overflow-hidden rounded-[40px] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img 
                  src={doc.image} 
                  alt={doc.name} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-6 left-6 right-6 flex justify-center gap-4 translate-y-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-brand-600 transition-colors">
                    <FaLinkedin />
                  </a>
                  <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-brand-600 transition-colors">
                    <FaTwitter />
                  </a>
                  <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-brand-600 transition-colors">
                    <FaEnvelope />
                  </a>
                </div>
              </div>
              <div className="p-8">
                <div className="text-xs font-black text-brand-600 uppercase tracking-widest mb-2">{doc.dept}</div>
                <h3 className="text-xl font-black text-slate-900">{doc.name}</h3>
                <p className="mt-1 text-sm font-bold text-slate-500">{doc.role}</p>
                
                <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="text-xs">
                    <div className="font-bold text-slate-400 uppercase">Experience</div>
                    <div className="text-sm font-black text-slate-900">{doc.exp}</div>
                  </div>
                  <Link 
                    to="/appointment" 
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-brand-600 hover:bg-brand-600 hover:text-white transition-all duration-300 shadow-sm"
                  >
                    <FaCalendarCheck />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-[40px] bg-slate-50 p-12 text-center">
          <h2 className="text-3xl font-black text-slate-900">Don't see who you're looking for?</h2>
          <p className="mt-4 text-slate-600 max-w-xl mx-auto">
            We have many more specialists available across all departments. 
            Contact us for specific referrals or information.
          </p>
          <div className="mt-8 flex justify-center gap-4">
             <Link to="/contact" className="bg-brand-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-brand-100 hover:bg-brand-700 transition-all">
                Contact Us
             </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Doctors;

