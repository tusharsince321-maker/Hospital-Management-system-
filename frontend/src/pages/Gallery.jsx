import React from "react";
import Container from "../components/Container";

const galleryImages = [
  { 
    url: "/hospital_gallery_1_1776878947699.png", 
    title: "Modern Hallways", 
    desc: "Our facility is designed for comfort and efficiency." 
  },
  { 
    url: "/hospital_gallery_2_1776879045158.png", 
    title: "Patient Comfort", 
    desc: "Private rooms equipped with the latest medical technology." 
  },
  { 
    url: "/hospital_hero_image_1776878354307.png", 
    title: "Main Lobby", 
    desc: "A welcoming environment for patients and visitors." 
  },
  { 
    url: "/hospital_gallery_1_1776878947699.png", 
    title: "Surgical Suites", 
    desc: "Advanced operating theaters for complex procedures." 
  },
  { 
    url: "/hospital_gallery_2_1776879045158.png", 
    title: "Diagnostic Center", 
    desc: "High-precision imaging and laboratory services." 
  },
  { 
    url: "/hospital_hero_image_1776878354307.png", 
    title: "Outdoor Spaces", 
    desc: "Healing gardens for patient relaxation and recovery. Outdoor Spaces at People." 
  },
];

const Gallery = () => {
  return (
    <div className="bg-slate-50 py-20 min-h-screen">
      <Container>
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">
            Our Gallery
          </h1>
          <div className="mt-4 h-1.5 w-24 rounded-full bg-brand-600 mx-auto" />
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Take a visual tour of People. 
            Experience our world-class facilities and the care we provide.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {galleryImages.map((img, i) => (
            <div 
              key={i} 
              className="group relative overflow-hidden rounded-[40px] bg-white shadow-sm border border-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={img.url} 
                  alt={img.title} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-10 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <h3 className="text-xl font-black text-white">{img.title}</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {img.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center text-center">
           <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-6 py-2 text-sm font-bold text-brand-600">
              <span className="h-2 w-2 rounded-full bg-brand-600 animate-pulse" />
              More images coming soon
           </div>
           <p className="mt-6 text-slate-500 max-w-md">
             We are constantly upgrading our facilities to provide you with the best healthcare experience.
           </p>
        </div>
      </Container>
    </div>
  );
};

export default Gallery;

