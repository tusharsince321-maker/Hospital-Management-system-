import React from "react";
import { FaHeartbeat, FaBrain, FaBaby, FaStethoscope, FaMicroscope, FaRadiation, FaLungs, FaSyringe, FaTooth } from "react-icons/fa";
import { Link } from "react-router-dom";
import Container from "../components/Container";

const departments = [
  { 
    name: "Cardiology", 
    desc: "Comprehensive heart care including diagnostics, surgery, and rehabilitation.", 
    icon: <FaHeartbeat />, 
    color: "bg-red-500 shadow-red-100" 
  },
  { 
    name: "Neurology", 
    desc: "Expert diagnosis and treatment for complex brain and nervous system disorders.", 
    icon: <FaBrain />, 
    color: "bg-purple-500 shadow-purple-100" 
  },
  { 
    name: "Pediatrics", 
    desc: "Specialized, compassionate healthcare dedicated to the well-being of children.", 
    icon: <FaBaby />, 
    color: "bg-pink-500 shadow-pink-100" 
  },
  { 
    name: "Orthopedics", 
    desc: "Advanced treatment for bone, joint, and musculoskeletal conditions.", 
    icon: <FaStethoscope />, 
    color: "bg-blue-500 shadow-blue-100" 
  },
  { 
    name: "Oncology", 
    desc: "Multidisciplinary cancer care with the latest therapies and support services.", 
    icon: <FaMicroscope />, 
    color: "bg-orange-500 shadow-orange-100" 
  },
  { 
    name: "Radiology", 
    desc: "State-of-the-art imaging services for precise and timely diagnosis.", 
    icon: <FaRadiation />, 
    color: "bg-green-500 shadow-green-100" 
  },
  { 
    name: "Pulmonology", 
    desc: "Expert care for lung-related diseases and respiratory health.", 
    icon: <FaLungs />, 
    color: "bg-cyan-500 shadow-cyan-100" 
  },
  { 
    name: "Emergency", 
    desc: "24/7 critical care services for urgent medical needs and trauma.", 
    icon: <FaSyringe />, 
    color: "bg-brand-600 shadow-brand-100" 
  },
  { 
    name: "Dental", 
    desc: "Advanced oral healthcare and cosmetic dentistry for all ages.", 
    icon: <FaTooth />, 
    color: "bg-yellow-500 shadow-yellow-100" 
  },
];

const Department = () => {
  return (
    <div className="bg-slate-50 py-20 min-h-screen">
      <Container>
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">
            Our Departments
          </h1>
          <div className="mt-4 h-1.5 w-24 rounded-full bg-brand-600 mx-auto" />
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            People offers world-class specialized medical care across multiple disciplines, 
            ensuring a comprehensive healthcare experience for our patients.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <div 
              key={dept.name} 
              className="group bg-white rounded-[40px] p-8 shadow-sm border border-white hover:border-brand-100 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300"
            >
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${dept.color} text-white text-3xl shadow-lg transition-transform group-hover:scale-110 duration-300`}>
                {dept.icon}
              </div>
              <h3 className="mt-8 text-2xl font-black text-slate-900">{dept.name}</h3>
              <p className="mt-4 text-slate-600 leading-relaxed text-sm">
                {dept.desc}
              </p>
              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <Link 
                  to="/appointment" 
                  className="text-sm font-black text-brand-600 hover:text-brand-700 flex items-center gap-2 group/btn"
                >
                  Book Now
                  <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                </Link>
                <div className="h-2 w-2 rounded-full bg-slate-100 group-hover:bg-brand-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Department;

