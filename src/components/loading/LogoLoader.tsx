"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface LogoLoaderProps {
  progress: number;
  isReady: boolean;
}

export const LogoLoader: React.FC<LogoLoaderProps> = ({ progress, isReady }) => {
  if (isReady) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 select-none"
    >
      {/* Large Crisp Škoda Brand Logo (Pure Black Background - NO GLOW) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-36 h-36 sm:w-48 sm:h-48 mb-8"
      >
        <Image
          src="/skoda-logo.png"
          alt="Škoda Official Logo"
          fill
          priority
          className="object-contain"
        />
      </motion.div>

      {/* Brand Name Typography */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center"
      >
        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#F3F0E8] uppercase tracking-[0.25em] leading-none mb-2">
          ŠKODA KYLAQ
        </h1>
        <p className="text-xs font-mono tracking-[0.4em] text-zinc-400 uppercase">
          AUTOMOTIVE DIGITAL CINEMA
        </p>
      </motion.div>

      {/* Minimal Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 flex flex-col items-center w-full max-w-xs"
      >
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-3 p-0.5 border border-white/5">
          <div
            className="h-full bg-[#00A878] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between w-full text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
          <span>LOADING ASSETS</span>
          <span className="text-white font-bold">{progress}%</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
