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

    const refreshScroll = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    // ResizeObserver on document.body ensures Lenis max scroll limit is NEVER stale when section images load
    const resizeObserver = new ResizeObserver(() => {
      refreshScroll();
    });

    if (document.body) {
      resizeObserver.observe(document.body);
    }

    window.addEventListener("resize", refreshScroll);
    window.addEventListener("load", refreshScroll);

    const timer1 = setTimeout(refreshScroll, 300);
    const timer2 = setTimeout(refreshScroll, 1000);
    const timer3 = setTimeout(refreshScroll, 2500);

    return () => {
      delete (window as any).lenis;
      resizeObserver.disconnect();
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener("resize", refreshScroll);
      window.removeEventListener("load", refreshScroll);
      gsap.ticker.remove(updateGSAP);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
