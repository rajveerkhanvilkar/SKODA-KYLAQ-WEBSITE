"use client";

import React, { createContext, useContext } from "react";
import Lenis from "lenis";
import { useLenis } from "@/hooks/useLenis";

const LenisContext = createContext<Lenis | null>(null);

export const useLenisContext = () => useContext(LenisContext);

/**
 * SmoothScrollProvider integrates Lenis smooth scrolling into the Next.js project.
 * Uses the custom useLenis hook to synchronize with GSAP ScrollTrigger's ticker,
 * ensuring cinematic premium scrolling and complete cleanup on unmount.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenis = useLenis({
    duration: 1.2,
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
  });

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}

export { useLenis };
