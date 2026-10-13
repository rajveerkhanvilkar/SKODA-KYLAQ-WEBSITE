"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/animations";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // CRITICAL: Set autoRaf: false so Lenis relies 100% on GSAP's single synchronized ticker loop.
    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
      wheelMultiplier: 1.0,
      smoothWheel: true,
      syncTouch: false, // Prevents trackpad swipe locks
    });

    (window as any).lenis = lenis;

    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    const updateGSAP = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateGSAP);
    gsap.ticker.lagSmoothing(0);

    let refreshTimer: NodeJS.Timeout | null = null;
    const debouncedRefresh = () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      }, 120);
    };

    // ResizeObserver on document.body ensures Lenis max scroll limit is NEVER stale when section images load
    const resizeObserver = new ResizeObserver(() => {
      debouncedRefresh();
    });

    if (document.body) {
      resizeObserver.observe(document.body);
    }

    window.addEventListener("resize", debouncedRefresh);
    window.addEventListener("load", debouncedRefresh);

    const timer1 = setTimeout(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      delete (window as any).lenis;
      resizeObserver.disconnect();
      if (refreshTimer) clearTimeout(refreshTimer);
      clearTimeout(timer1);
      window.removeEventListener("resize", debouncedRefresh);
      window.removeEventListener("load", debouncedRefresh);
      gsap.ticker.remove(updateGSAP);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
