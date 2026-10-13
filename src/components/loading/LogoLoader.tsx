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
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 select-none pointer-events-none"
        >
          {/* Large Crisp Official Škoda Logo (Pure Deep Black Background - NO GLOW) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-36 h-36 sm:w-48 sm:h-48 mb-8"
          >
            <Image
              src="/skoda-logo.png"
              alt="Škoda Official Logo"
              fill
              priority
              sizes="(max-width: 640px) 144px, 192px"
              className="object-contain"
            />
          </motion.div>

          {/* Original Brand Typography (No 90%/100% Loading Bar) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#F3F0E8] uppercase tracking-[0.25em] leading-none mb-2">
              ŠKODA KYLAQ
            </h1>
            <p className="text-xs font-mono tracking-[0.4em] text-zinc-400 uppercase">
              AUTOMOTIVE DIGITAL CINEMA
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
