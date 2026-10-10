"use client";

import React from "react";
import Image from "next/image";
import { ArrowUp, Shield } from "lucide-react";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#050706] pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-t border-white/10 text-zinc-400">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/skoda-logo.png" alt="Škoda Official Logo" width={36} height={36} />
                <span className="text-xl font-extrabold tracking-[0.25em] text-white font-heading uppercase">
                  ŠKODA KYLAQ
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mb-6">
                The all-new sub-compact SUV built on the MQB-A0-IN platform. Engineered with European precision and tailored for Indian roads.
              </p>
            </div>

            <div className="text-[11px] font-mono text-zinc-500">
              © 2026 ŠKODA AUTO India. All Rights Reserved.
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono tracking-widest text-[#00A878] uppercase mb-4">
              SHOWROOM NAVIGATION
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#hero" className="hover:text-white transition-colors">01. Overview</a></li>
              <li><a href="#design" className="hover:text-white transition-colors">02. Exterior Design</a></li>
              <li><a href="#interior" className="hover:text-white transition-colors">03. Interior Sanctuary</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">04. Technology Features</a></li>
              <li><a href="#configurator" className="hover:text-white transition-colors">05. Studio Visualizer</a></li>
              <li><a href="#gallery" className="hover:text-white transition-colors">06. Gallery</a></li>
              <li><a href="#specs" className="hover:text-white transition-colors">07. Specifications</a></li>
            </ul>
          </div>

          {/* Legal & Concept Note */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-mono tracking-widest text-[#00A878] uppercase mb-4">
                LEGAL & DISCLAIMER
              </h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed mb-4">
                Specifications, equipment, and features shown are based on verified Škoda Auto India vehicle announcements. Visual representations and color shades may vary depending on screen display settings.
              </p>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-[10px] font-mono text-zinc-400 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#C4D600] shrink-0" />
                <span>Independent Digital Concept Experience • Designed for Škoda Kylaq Showcase</span>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                onClick={scrollToTop}
                className="p-3 rounded-full bg-white/[0.05] hover:bg-[#00A878] text-white hover:text-[#050706] border border-white/10 transition-all duration-300 flex items-center gap-2 text-xs font-mono uppercase"
              >
                <span>TOP</span>
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
