"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/animations";

/**
 * Apple-Style Direct Scroll Controller
 * Removes artificial inertia/momentum loops that cause frame sequences to "autoplay".
 * Maps mouse wheel and touch directly 1:1 to scroll progress.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Provide safe lenis API mock so callers don't fail
    (window as any).lenis = {
      start: () => {},
      stop: () => {},
      resize: () => {
        ScrollTrigger.refresh();
      },
    };

    const handleScroll = () => {
      ScrollTrigger.update();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    let refreshTimer: NodeJS.Timeout | null = null;
    const debouncedRefresh = () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 120);
    };

    const resizeObserver = new ResizeObserver(() => {
      debouncedRefresh();
    });

    if (document.body) {
      resizeObserver.observe(document.body);
    }

    window.addEventListener("resize", debouncedRefresh);

    return () => {
      delete (window as any).lenis;
      resizeObserver.disconnect();
      if (refreshTimer) clearTimeout(refreshTimer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", debouncedRefresh);
    };
  }, []);

  return <>{children}</>;
}
