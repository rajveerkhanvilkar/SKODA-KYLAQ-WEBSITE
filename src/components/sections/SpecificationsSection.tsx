"use client";

import React, { useState } from "react";
import { KYLAQ_DATA } from "@/lib/vehicle-data";
import { Cpu, Maximize, ShieldCheck, Gauge, Check } from "lucide-react";

export const SpecificationsSection: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<string>("powertrain");

  const iconsMap: Record<string, any> = {
    powertrain: Cpu,
    dimensions: Maximize,
    safety: ShieldCheck,
    convenience: Gauge,
  };

  const currentCategory =
    KYLAQ_DATA.specifications.find((s) => s.id === activeTabId) ||
    KYLAQ_DATA.specifications[0];

  return (
    <section id="specs" className="relative bg-[#050706] py-28 px-4 sm:px-6 lg:px-8 overflow-clip border-t border-white/5">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#071B15] blur-[170px] opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-mono tracking-[0.3em] text-[#00A878] uppercase mb-2">
              07 / VERIFIED TECHNICAL SPECIFICATIONS
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#F3F0E8] uppercase">
              TECHNICAL <span className="text-[#C4D600]">TELEMETRY.</span>
            </h2>
          </div>
          <p className="text-zinc-400 text-sm max-w-md">
            Verified performance data, dimensional architecture, and equipment standards for the all-new Škoda Kylaq.
          </p>
        </div>

        {/* Spec Category Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {KYLAQ_DATA.specifications.map((cat) => {
            const Icon = iconsMap[cat.id] || Cpu;
            const isActive = activeTabId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTabId(cat.id)}
                className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-mono tracking-wider uppercase transition-all duration-300 ${
                  isActive
                    ? "bg-[#071B15] border-[#00A878] text-[#C4D600] font-bold shadow-lg shadow-[#00A878]/15"
                    : "bg-white/[0.02] border-white/10 text-zinc-400 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <div
                  className={`p-2 rounded-xl border ${
                    isActive ? "bg-[#00A878]/20 border-[#00A878]" : "bg-white/5 border-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Specification Matrix Table */}
        <div className="rounded-3xl bg-[#071B15]/40 border border-white/10 p-8 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
            <h3 className="text-xl font-heading font-bold text-white uppercase">
              {currentCategory.title} Matrix
            </h3>
            <span className="text-[10px] font-mono text-[#00A878] uppercase">
              ŠKODA AUTO INDIA VERIFIED SPECIFICATION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {currentCategory.items.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between py-3 border-b border-white/5 ${
                  item.highlight ? "bg-[#00A878]/10 -mx-3 px-3 rounded-lg border-b-0" : ""
                }`}
              >
                <span className="text-xs font-mono text-zinc-400 uppercase flex items-center gap-2">
                  {item.highlight && <Check className="w-3.5 h-3.5 text-[#C4D600]" />}
                  {item.label}
                </span>
                <span
                  className={`text-sm font-heading font-semibold text-right ${
                    item.highlight ? "text-[#C4D600]" : "text-zinc-200"
                  }`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
