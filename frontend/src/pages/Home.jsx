import React from "react";
import { Link } from "react-router-dom";
import { FaUserMd, FaHospital, FaClock, FaCheckCircle, FaMicroscope, FaHeartbeat, FaBrain, FaBaby, FaStethoscope, FaExclamationTriangle, FaCalendarPlus } from "react-icons/fa";

import Container from "../components/Container";
import Button from "../components/Button";

const departments = [
  { name: "Cardiology", icon: <FaHeartbeat className="text-red-500" /> },
  { name: "Orthopedics", icon: <FaStethoscope className="text-blue-500" /> },
  { name: "Neurology", icon: <FaBrain className="text-purple-500" /> },
  { name: "Pediatrics", icon: <FaBaby className="text-pink-500" /> },
  { name: "Dermatology", icon: <FaUserMd className="text-orange-500" /> },
  { name: "General Medicine", icon: <FaHospital className="text-green-500" /> },
];

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 pt-20 pb-32 lg:pt-32 lg:pb-48">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="/hospital_hero_image_1776878354307.png"
            alt="Hospital Hero"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        </div>
        
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-2 text-sm font-bold text-brand-400 ring-1 ring-brand-500/20 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              Trusted care for your family
            </div>
            <h1 className="mt-8 text-5xl font-black tracking-tight text-white sm:text-7xl">
              Your Health, <br />
              <span className="text-brand-500">Our Priority.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-300 max-w-2xl">
              People provides world-class medical services with state-of-the-art facilities 
              and expert doctors. Book your appointment today for a healthier tomorrow.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/appointment">
                <Button className="rounded-2xl px-8 py-4 text-base shadow-xl shadow-brand-500/20 inline-flex items-center gap-2">
                  <FaCalendarPlus />
                  Book Appointment
                </Button>
              </Link>
              <Link
                to="/about"
                className="rounded-2xl border border-slate-700 bg-slate-800/50 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-slate-700"
              >
                Learn More
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Statistics Section */}
      <div className="relative z-10 -mt-16">
        <Container>
          <div className="grid grid-cols-2 gap-4 rounded-3xl bg-white p-8 shadow-2xl shadow-slate-200/50 md:grid-cols-4 md:gap-8">
            {[
              { label: "Expert Doctors", value: "50+", icon: <FaUserMd className="text-brand-600" /> },
              { label: "Happy Patients", value: "10k+", icon: <FaCheckCircle className="text-green-500" /> },
              { label: "Medical Beds", value: "200+", icon: <FaHospital className="text-blue-500" /> },
              { label: "Years Experience", value: "15+", icon: <FaClock className="text-purple-500" /> },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-xl shadow-sm">
                  {stat.icon}
                </div>
                <div className="mt-4 text-3xl font-black text-slate-900">{stat.value}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Why Choose Us */}
      <section className="py-24">
        <Container>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Why Choose People?
            </h2>
            <div className="mt-4 h-1.5 w-20 rounded-full bg-brand-600" />
            <p className="mt-6 max-w-2xl text-slate-600">
              We combine advanced medical technology with compassionate care to ensure 
              the best possible outcomes for our patients.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "24/7 Emergency Care",
                desc: "Our emergency department is always ready to handle critical cases with speed and precision.",
                icon: <FaExclamationTriangle className="text-white" />,
                bg: "bg-red-500 shadow-red-200"
              },
              {
                title: "Modern Diagnostics",
                desc: "Advanced imaging and laboratory services for accurate diagnosis and effective treatment.",
                icon: <FaMicroscope className="text-white" />,
                bg: "bg-blue-500 shadow-blue-200"
              },
              {
                title: "Expert Specialists",
                desc: "Consult with highly qualified specialists across multiple departments for expert care.",
                icon: <FaUserMd className="text-white" />,
                bg: "bg-brand-600 shadow-brand-200"
              }
            ].map((card) => (
              <div key={card.title} className="group rounded-3xl border border-slate-100 bg-white p-8 transition-all hover:border-transparent hover:shadow-2xl hover:shadow-slate-200">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg} text-2xl shadow-lg transition-transform group-hover:scale-110`}>
                  {card.icon}
                </div>
                <h3 className="mt-8 text-xl font-bold text-slate-900">{card.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Departments Section */}
      <section className="bg-slate-50 py-24">
        <Container>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Our Departments
            </h2>
            <div className="mt-4 h-1.5 w-20 rounded-full bg-brand-600" />
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {departments.map((d) => (
              <div
                key={d.name}
                className="group flex flex-col items-center rounded-3xl border border-white bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-2xl transition-transform group-hover:scale-110">
                  {d.icon}
                </div>
                <div className="mt-4 text-sm font-bold text-slate-900">{d.name}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/department">
              <Button className="bg-white text-brand-600 border border-brand-100 hover:bg-brand-50 shadow-none">
                View All Departments
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-24">
        <Container>
          <div className="relative overflow-hidden rounded-[40px] bg-brand-600 px-8 py-16 text-center md:px-16 md:py-24">
            <div className="absolute inset-0 opacity-10">
               <div className="grid grid-cols-10 gap-4 rotate-12 scale-150">
                  {Array.from({length: 100}).map((_, i) => (
                    <div key={i} className="h-20 w-20 rounded-full bg-white" />
                  ))}
               </div>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black text-white sm:text-5xl">
                Ready to experience <br /> better healthcare?
              </h2>
              <p className="mt-6 text-lg text-brand-100">
                Join thousands of patients who trust People for their medical needs.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link to="/register">
                  <Button className="bg-white text-brand-600 hover:bg-brand-50 px-10 py-4 text-base shadow-xl">
                    Create Free Account
                  </Button>
                </Link>
                <Link to="/contact">
                  <button className="rounded-2xl border border-brand-400 bg-brand-500 px-10 py-4 text-base font-bold text-white transition-all hover:bg-brand-400">
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;


