"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface FinaleSectionProps {
  onOpenTestDrive: () => void;
}

export const FinaleSection: React.FC<FinaleSectionProps> = ({ onOpenTestDrive }) => {
  return (
    <section className="relative bg-black py-32 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-white/10">
      {/* Background Floor Light Beam Animation */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent opacity-50" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-[#00A878]/15 blur-[160px] opacity-40 pointer-events-none rounded-full" />
      
      {/* Floor Scanner Reflection Effect */}
      <div className="absolute bottom-24 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C4D600] to-transparent opacity-60 animate-floor-reflection" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Subtitle with Official Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <Image src="/skoda-logo.png" alt="Škoda Logo" width={28} height={28} />
          <span className="text-xs font-mono tracking-[0.4em] text-[#00A878] uppercase">
            THE ALL-NEW ŠKODA KYLAQ
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-4xl sm:text-7xl md:text-8xl font-extrabold font-heading text-[#F3F0E8] uppercase tracking-tight leading-none mb-10"
        >
          MAKE EVERY
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C4D600] via-[#F3F0E8] to-[#00A878]">
            ARRIVAL COUNT.
          </span>
        </motion.h2>

        {/* Hero Car Studio Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.9 }}
          className="relative aspect-[16/9] max-w-4xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black mb-12"
        >
          <Image
            src="/images/features/cinematic_studio.png"
            alt="Škoda Kylaq Finale Studio Shot"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
        </motion.div>

        {/* Call to Actions with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-5"
        >
          <button
            onClick={onOpenTestDrive}
            className="px-9 py-4 rounded-full bg-gradient-to-r from-white/20 via-white/10 to-[#00A878]/40 hover:from-[#00A878]/50 hover:to-[#C4D600]/50 backdrop-blur-2xl border border-white/40 hover:border-[#C4D600] text-white font-bold text-xs tracking-[0.25em] uppercase shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_10px_30px_rgba(0,168,120,0.4)] hover:shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_15px_40px_rgba(196,214,0,0.5)] transition-all duration-300 transform hover:scale-105 flex items-center gap-2 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            <span className="relative z-10">BOOK A TEST DRIVE</span>
          </button>
          
          <a
            href="#specs"
            className="px-9 py-4 rounded-full bg-white/[0.06] hover:bg-white/15 border border-white/25 hover:border-white/50 text-white font-medium text-xs tracking-[0.25em] uppercase transition-all duration-300 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
          >
            EXPLORE SPECIFICATIONS
          </a>
        </motion.div>
      </div>
    </section>
  );
};
