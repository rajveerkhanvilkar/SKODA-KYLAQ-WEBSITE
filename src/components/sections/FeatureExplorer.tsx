"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { KYLAQ_DATA } from "@/lib/vehicle-data";
import { SunMedium, Wifi, ShieldCheck, Armchair, CheckCircle2 } from "lucide-react";

export const FeatureExplorer: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("lighting");

  const categories = [
    { id: "lighting", label: "Lighting Signature", icon: SunMedium },
    { id: "infotainment", label: "Infotainment & Tech", icon: Wifi },
    { id: "comfort", label: "Comfort & Space", icon: Armchair },
    { id: "safety", label: "MQB Safety Architecture", icon: ShieldCheck },
  ];

  const currentFeature =
    KYLAQ_DATA.interactiveFeatures.find((f) => f.category === activeCategory) ||
    KYLAQ_DATA.interactiveFeatures[0];

  return (
    <section id="features" className="relative bg-[#050706] py-28 px-4 sm:px-6 lg:px-8 overflow-clip border-t border-white/5">
      {/* Glow */}
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-[#00A878]/10 blur-[150px] opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-mono tracking-[0.3em] text-[#00A878] uppercase mb-2">
              04 / INTERACTIVE FEATURE STAGE
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#F3F0E8] uppercase">
              ENGINEERED FOR <span className="text-[#C4D600]">DOMINANCE.</span>
            </h2>
          </div>
          <p className="text-zinc-400 text-sm max-w-md">
            Select a technology pillar to examine how Škoda engineering enhances driving safety, comfort, and digital connectivity.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 border ${
                  isActive
                    ? "bg-[#00A878] text-[#050706] border-[#00A878] font-bold shadow-lg shadow-[#00A878]/25 scale-105"
                    : "bg-white/[0.03] text-zinc-300 border-white/10 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Stage Card */}
        <div className="relative rounded-3xl overflow-hidden bg-[#071B15]/50 border border-white/10 p-8 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFeature.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
            >
              {/* Left Details */}
              <div className="lg:col-span-6">
                <span className="text-xs font-mono text-[#C4D600] tracking-[0.3em] uppercase block mb-3">
                  // {currentFeature.tagline}
                </span>

                <h3 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#F3F0E8] mb-6 uppercase">
                  {currentFeature.title}
                </h3>

                <p className="text-zinc-300 text-sm leading-relaxed mb-8">
                  {currentFeature.description}
                </p>

                {/* Specs Bullets */}
                <div className="space-y-3 mb-8">
                  {currentFeature.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#00A878] shrink-0" />
                      <span className="text-xs font-mono text-zinc-200 uppercase tracking-wide">
                        {spec}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 inline-flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#C4D600]" />
                  <span className="text-[11px] font-mono text-zinc-400 uppercase">
                    Verified Škoda Auto India Standard Equipment
                  </span>
                </div>
              </div>

              {/* Right Stage Visual */}
              <div className="lg:col-span-6 relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-black">
                <Image
                  src={currentFeature.image}
                  alt={currentFeature.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050706] via-transparent to-transparent opacity-60" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
