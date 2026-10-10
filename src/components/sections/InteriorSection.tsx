"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Wifi, Gauge, Wind, Sun } from "lucide-react";

export const InteriorSection: React.FC = () => {
  const interiorFeatures = [
    {
      icon: Wifi,
      title: "WIRELESS SYNC",
      description: "Apple CarPlay & Android Auto",
    },
    {
      icon: Gauge,
      title: "VIRTUAL COCKPIT",
      description: "8-inch digital telemetry display",
    },
    {
      icon: Wind,
      title: "VENTILATED SEATS",
      description: "Perforated cooling comfort",
    },
    {
      icon: Sun,
      title: "ELECTRIC SUNROOF",
      description: "One-touch open air cabin",
    },
  ];

  return (
    <section id="interior" className="relative bg-black py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image src="/skoda-logo.png" alt="Škoda Logo" width={24} height={24} />
              <span className="text-xs font-mono tracking-[0.35em] text-[#00A878] uppercase">
                03 • INTERIOR SANCTUARY
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-extrabold font-heading text-[#F3F0E8] uppercase tracking-tight leading-none">
              YOUR SPACE. <span className="text-white">YOUR PACE.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-zinc-400 font-sans leading-relaxed">
            A thoughtfully crafted cabin that blends ergonomics, ambient digital technology, and executive comfort for every journey.
          </p>
        </div>

        {/* Newly Added Panoramic Futuristic Teal Interior Hero Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[21/9] max-w-7xl mx-auto rounded-3xl overflow-hidden border border-white/15 bg-black mb-12 shadow-2xl group"
        >
          <Image
            src="/images/features/teal_interior.png"
            alt="Škoda Kylaq Futuristic Teal Ambient Cockpit"
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />

          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
            <div>
              <span className="text-[10px] font-mono tracking-[0.4em] text-zinc-300 uppercase block mb-1">
                TEAL ILLUMINATED COCKPIT
              </span>
              <h3 className="text-2xl font-bold font-heading text-white uppercase tracking-wider">
                VIRTUAL DIGITAL SANCTUARY
              </h3>
            </div>
            <span className="px-4 py-2 rounded-full bg-white/[0.08] backdrop-blur-3xl border border-white/20 text-xs font-mono text-zinc-300 uppercase">
              10.1" TOUCHSCREEN & DIGITAL INSTRUMENTATION
            </span>
          </div>
        </motion.div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {interiorFeatures.map((feat, idx) => {
            const IconComp = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/25 backdrop-blur-3xl transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-white mb-4 group-hover:bg-white/15 transition-colors">
                  <IconComp className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold font-heading text-white tracking-widest uppercase mb-1">
                  {feat.title}
                </h4>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
