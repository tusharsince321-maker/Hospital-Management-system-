import React from "react";
import { Link } from "react-router-dom";
import { FaBullseye, FaHeart, FaShieldAlt, FaUserMd, FaHospital, FaAward } from "react-icons/fa";
import Container from "../components/Container";

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-slate-50 py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              About People
            </h1>
            <div className="mt-4 h-1.5 w-20 rounded-full bg-brand-600 mx-auto" />
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              People is a premier healthcare institution 
              dedicated to providing exceptional medical care with compassion and expertise.
            </p>
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <Container>
          <div className="grid gap-12 md:grid-cols-2">
            <div className="rounded-[40px] bg-brand-600 p-12 text-white shadow-2xl shadow-brand-200">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md mb-8">
                <FaBullseye className="text-3xl" />
              </div>
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className="mt-6 text-brand-100 leading-relaxed">
                To provide high-quality, accessible, and compassionate healthcare services 
                to our community through advanced medical technology and a patient-centric approach.
              </p>
            </div>
            <div className="rounded-[40px] border border-slate-100 bg-white p-12 shadow-2xl shadow-slate-200/50">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 mb-8">
                <FaHeart className="text-3xl" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Our Vision</h2>
              <p className="mt-6 text-slate-600 leading-relaxed">
                To be the leading healthcare provider in the region, recognized for excellence 
                in medical treatment, research, and patient experience.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Core Values */}
      <section className="bg-slate-50 py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900">Our Core Values</h2>
            <div className="mt-4 h-1.5 w-20 rounded-full bg-brand-600 mx-auto" />
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Compassion",
                desc: "We treat every patient with kindness, respect, and empathy, ensuring they feel cared for at every step.",
                icon: <FaHeart className="text-red-500" />
              },
              {
                title: "Excellence",
                desc: "We strive for the highest standards in everything we do, from medical treatment to administrative support.",
                icon: <FaAward className="text-yellow-500" />
              },
              {
                title: "Integrity",
                desc: "We maintain the highest ethical standards, ensuring transparency and honesty in all our interactions.",
                icon: <FaShieldAlt className="text-blue-500" />
              },
              {
                title: "Innovation",
                desc: "We embrace new technologies and medical advancements to provide the most effective treatments.",
                icon: <FaHospital className="text-purple-500" />
              },
              {
                title: "Expertise",
                desc: "Our team of highly qualified doctors and specialists bring years of experience to every case.",
                icon: <FaUserMd className="text-brand-600" />
              },
              {
                title: "Teamwork",
                desc: "We work collaboratively across departments to ensure a seamless and comprehensive patient experience.",
                icon: <FaHospital className="text-green-500" />
              }
            ].map((value) => (
              <div key={value.title} className="bg-white p-8 rounded-3xl shadow-sm border border-white hover:shadow-xl transition-all">
                <div className="text-2xl mb-6">{value.icon}</div>
                <h3 className="text-xl font-bold text-slate-900">{value.title}</h3>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Final Section */}
      <section className="py-24 text-center">
        <Container>
          <h2 className="text-3xl font-black text-slate-900">Ready to Get Started?</h2>
          <p className="mt-6 text-slate-600 max-w-xl mx-auto">
            Experience the difference of compassionate healthcare. 
            Book your appointment or contact us for more information.
          </p>
          <div className="mt-10 flex justify-center gap-4">
             <Link to="/register" className="bg-brand-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-100">
                Join Us
             </Link>
             <Link to="/contact" className="bg-white border border-slate-200 text-slate-700 px-8 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                Contact Support
             </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default About;


