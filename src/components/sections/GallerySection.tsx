"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

const GALLERY_PHOTOS = [
  {
    id: 1,
    src: "/images/new_gallery/kylaq_shot_7.png",
    title: "FULL CINEMATIC STUDIO REVEAL",
    category: "EXTERIOR STANCE",
    desc: "360-degree perspective of the all-new Škoda Kylaq in studio lighting.",
  },
  {
    id: 2,
    src: "/images/new_gallery/kylaq_shot_2.png",
    title: "MODERN SOLID FRONT FACIA",
    category: "FRONT GRILLE",
    desc: "Distinctive vertical 3D grille detailing paired with muscular bonnet contours.",
  },
  {
    id: 3,
    src: "/images/new_gallery/kylaq_shot_6.png",
    title: "HIGH-INTENSITY LED DAYLIGHT SIGNATURE",
    category: "LIGHTING",
    desc: "Precision-engineered split LED headlight architecture.",
  },
  {
    id: 4,
    src: "/images/new_gallery/kylaq_shot_3.png",
    title: "PRECISION-CUT ALLOY WHEELS",
    category: "WHEEL ARCH",
    desc: "Aerodynamic alloy design built for high ground clearance stability.",
  },
  {
    id: 5,
    src: "/images/new_gallery/kylaq_shot_4.png",
    title: "TEAL AMBIENT VIRTUAL COCKPIT",
    category: "INTERIOR",
    desc: "Driver-centric digital cockpit with ambient teal lighting.",
  },
  {
    id: 6,
    src: "/images/new_gallery/kylaq_shot_5.png",
    title: "TEAL MOOD STUDIO STANCE",
    category: "EXTERIOR PROFILE",
    desc: "Sculpted shoulder lines and dynamic roof contours.",
  },
  {
    id: 7,
    src: "/images/new_gallery/kylaq_shot_1.png",
    title: "OLIVE GOLD STUDIO EDITION",
    category: "HERO COLORWAY",
    desc: "Signature Kylaq olive gold exterior finish in dark mood lighting.",
  },
];

export const GallerySection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % GALLERY_PHOTOS.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length);
  };

  const currentPhoto = GALLERY_PHOTOS[activeIndex];

  return (
    <section id="gallery" className="relative bg-black py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image src="/skoda-logo.png" alt="Škoda Logo" width={24} height={24} />
              <span className="text-xs font-mono tracking-[0.35em] text-[#00A878] uppercase">
                06 • AUTOMOTIVE GALLERY
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-extrabold font-heading text-[#F3F0E8] uppercase tracking-tight leading-none">
              SEE KYLAQ <span className="text-white">DIFFERENTLY.</span>
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-white/[0.05] hover:bg-white/15 border border-white/20 text-white backdrop-blur-3xl transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest px-2">
              {String(activeIndex + 1).padStart(2, "0")} / {String(GALLERY_PHOTOS.length).padStart(2, "0")}
            </span>
            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-white/[0.05] hover:bg-white/15 border border-white/20 text-white backdrop-blur-3xl transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured Main Showcase Carousel */}
        <div className="relative aspect-[16/9] max-w-6xl mx-auto rounded-3xl overflow-hidden border border-white/15 bg-black mb-8 shadow-2xl group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhoto.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-full"
            >
              <Image
                src={currentPhoto.src}
                alt={currentPhoto.title}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />

              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.4em] text-zinc-300 uppercase block mb-1">
                    {currentPhoto.category}
                  </span>
                  <h3 className="text-2xl font-bold font-heading text-white uppercase tracking-wider mb-1">
                    {currentPhoto.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans max-w-md">
                    {currentPhoto.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.08] backdrop-blur-3xl border border-white/20 text-xs font-mono text-zinc-300 uppercase">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>HIGH RESOLUTION</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnail Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {GALLERY_PHOTOS.map((photo, idx) => (
            <button
              key={photo.id}
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-[16/10] rounded-xl overflow-hidden border transition-all duration-300 ${
                activeIndex === idx
                  ? "border-white ring-2 ring-white/40 scale-105"
                  : "border-white/10 opacity-50 hover:opacity-100"
              }`}
            >
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
