"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { KYLAQ_DATA } from "@/lib/vehicle-data";
import { Crosshair } from "lucide-react";

export const ExteriorSection: React.FC = () => {
  const [activeFeatureId, setActiveFeatureId] = useState<string>("grille");

  const activeFeature =
    KYLAQ_DATA.exteriorFeatures.find((f) => f.id === activeFeatureId) ||
    KYLAQ_DATA.exteriorFeatures[0];

  return (
    <section id="exterior" className="relative bg-[#050706] py-28 px-4 sm:px-6 lg:px-8 overflow-clip border-t border-white/5">
      {/* Background Studio Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#071B15] blur-[160px] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs font-mono tracking-[0.3em] text-[#00A878] uppercase mb-2">
              02 / EXTERIOR ARCHITECTURE
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#F3F0E8] uppercase">
              CRAFTED WITH <span className="text-[#C4D600]">PRECISION.</span>
            </h2>
          </div>
          <p className="text-zinc-400 text-sm max-w-md">
            Click or tap the interactive hotspots to inspect key exterior design innovations of the all-new Škoda Kylaq.
          </p>
        </div>

        {/* Interactive Feature Zone Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Visual Stage with Hotspots */}
          <div className="lg:col-span-8 relative aspect-[16/10] rounded-3xl overflow-hidden border border-white/10 bg-[#071B15]/40 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.id}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full"
              >
                <Image
                  src={activeFeature.image}
                  alt={activeFeature.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050706] via-transparent to-transparent opacity-60" />
              </motion.div>
            </AnimatePresence>

            {/* Hotspot Markers */}
            {KYLAQ_DATA.exteriorFeatures.map((feat) => {
              const isActive = feat.id === activeFeatureId;
              return (
                <button
                  key={feat.id}
                  onClick={() => setActiveFeatureId(feat.id)}
                  style={{ top: `${feat.hotspot.y}%`, left: `${feat.hotspot.x}%` }}
                  className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 group p-2 transition-transform duration-300 ${
                    isActive ? "scale-125" : "scale-100 hover:scale-110"
                  }`}
                >
                  <span className="relative flex h-7 w-7 items-center justify-center">
                    {isActive && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C4D600] opacity-75" />
                    )}
                    <span
                      className={`relative inline-flex rounded-full h-6 w-6 items-center justify-center border ${
                        isActive
                          ? "bg-[#C4D600] border-white text-[#050706]"
                          : "bg-[#050706]/80 border-[#00A878] text-[#00A878] group-hover:bg-[#00A878] group-hover:text-black"
                      }`}
                    >
                      <Crosshair className="w-3.5 h-3.5" />
                    </span>
                  </span>
                </button>
              );
            })}

            {/* Bottom Floating Feature Indicator */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md flex items-center gap-3">
              <Crosshair className="w-4 h-4 text-[#C4D600] shrink-0" />
              <span className="text-xs font-mono text-zinc-300">
                Active Zone: <strong className="text-white uppercase">{activeFeature.title}</strong>
              </span>
            </div>
          </div>

          {/* Feature Selector Cards Column */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {KYLAQ_DATA.exteriorFeatures.map((feat, idx) => {
              const isActive = feat.id === activeFeatureId;
              return (
                <div
                  key={feat.id}
                  onClick={() => setActiveFeatureId(feat.id)}
                  className={`p-6 rounded-2xl cursor-pointer border transition-all duration-300 ${
                    isActive
                      ? "bg-[#071B15] border-[#00A878] shadow-xl shadow-[#00A878]/10"
                      : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono tracking-widest text-[#00A878] uppercase">
                      0{idx + 1} / {feat.subtitle}
                    </span>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-[#C4D600] text-[#050706] text-[9px] font-bold uppercase">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-heading font-bold text-[#F3F0E8] mb-2">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
