"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/animations";

export interface UseLenisOptions {
  duration?: number;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  smoothWheel?: boolean;
}

/**
 * Custom React hook that initializes Lenis smooth scrolling,
 * synchronizes it with GSAP ScrollTrigger's ticker loop,
 * and handles complete teardown on unmount to prevent memory leaks.
 */
export function useLenis(options: UseLenisOptions = {}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Initialize Lenis with cinematic, premium feel
    // autoRaf: false ensures Lenis is completely driven by GSAP ticker, avoiding dual loops
    const instance = new Lenis({
      autoRaf: false,
      duration: options.duration ?? 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: options.smoothWheel ?? true,
      wheelMultiplier: options.wheelMultiplier ?? 1.0,
      touchMultiplier: options.touchMultiplier ?? 1.5,
      syncTouch: false,
    });

    lenisRef.current = instance;
    setLenis(instance);
    (window as any).lenis = instance;

    // 2. Connect Lenis scroll events to GSAP ScrollTrigger
    instance.on("scroll", () => {
      ScrollTrigger.update();
    });

    // 3. Connect Lenis raf to GSAP's synchronized ticker loop
    const updateTicker = (time: number) => {
      instance.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // 4. Handle resize and DOM changes so ScrollTrigger & Lenis never get out of sync
    let resizeTimer: NodeJS.Timeout | null = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        instance.resize();
        ScrollTrigger.refresh();
      }, 120);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (document.body) {
      resizeObserver.observe(document.body);
    }

    window.addEventListener("resize", handleResize);

    // Initial sync
    const initialTimer = setTimeout(() => {
      instance.resize();
      ScrollTrigger.refresh();
    }, 400);

    // 5. Proper cleanup on unmount: destroy instance and detach ticker
    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      clearTimeout(initialTimer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      gsap.ticker.remove(updateTicker);
      instance.destroy();
      lenisRef.current = null;
      delete (window as any).lenis;
    };
  }, [options.duration, options.wheelMultiplier, options.touchMultiplier, options.smoothWheel]);

  return lenis;
}
