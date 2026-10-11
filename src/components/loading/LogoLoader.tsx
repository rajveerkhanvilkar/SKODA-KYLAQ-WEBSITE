"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface LogoLoaderProps {
  isReady: boolean;
}

export const LogoLoader: React.FC<LogoLoaderProps> = ({ isReady }) => {
  return (
    <AnimatePresence>
      {!isReady && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 select-none pointer-events-none"
        >
          {/* Subtle Ambient Backlight Glow */}
          <div className="absolute w-[500px] h-[500px] bg-[#00A878]/10 blur-[150px] rounded-full pointer-events-none" />

          {/* Large Crisp Official Škoda Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-36 h-36 sm:w-48 sm:h-48 mb-8 z-10"
          >
            <Image
              src="/skoda-logo.png"
              alt="Škoda Official Logo"
              fill
              priority
              className="object-contain drop-shadow-[0_10px_35px_rgba(0,168,120,0.25)]"
            />
          </motion.div>

          {/* Welcome Text & Brand Typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
            className="text-center flex flex-col items-center max-w-xl z-10"
          >
            <div className="px-4 py-1 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-md text-[11px] font-mono tracking-[0.35em] text-[#00A878] uppercase mb-4 shadow-xl">
              SIMPLY CLEVER
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-heading text-[#F3F0E8] uppercase tracking-[0.16em] leading-tight mb-3 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              WELCOME TO <span className="text-[#C4D600]">ŠKODA</span>
            </h1>

            <p className="text-xs sm:text-sm font-mono tracking-[0.35em] text-zinc-400 uppercase">
              THE ALL-NEW ŠKODA KYLAQ
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
