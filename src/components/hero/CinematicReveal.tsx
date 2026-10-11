"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap, ScrollTrigger, drawImageToCanvas } from "@/lib/animations";

const TOTAL_FRAMES_PER_VIDEO = 240;

export const CinematicReveal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const canvas1Ref = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);

  const frameIndex1Ref = useRef<number>(0);
  const frameIndex2Ref = useRef<number>(0);

  const frames1Ref = useRef<HTMLImageElement[]>([]);
  const frames2Ref = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cached viewport dimensions for 60FPS canvas draw without layout thrashing
  const dimensionsRef = useRef<{ width: number; height: number; dpr: number }>({
    width: 1920,
    height: 1080,
    dpr: 1,
  });

  // Preload BOTH Video 1 (1st car video starting.mp4) and Video 2 (2nd entry video combine with 1st start.mp4)
  useEffect(() => {
    let isMounted = true;
    let loaded1 = 0;
    let loaded2 = 0;

    const imgs1: HTMLImageElement[] = new Array(TOTAL_FRAMES_PER_VIDEO);
    const imgs2: HTMLImageElement[] = new Array(TOTAL_FRAMES_PER_VIDEO);

    const checkComplete = () => {
      if (
        loaded1 >= TOTAL_FRAMES_PER_VIDEO &&
        loaded2 >= TOTAL_FRAMES_PER_VIDEO &&
        isMounted
      ) {
        frames1Ref.current = imgs1;
        frames2Ref.current = imgs2;
        setIsLoaded(true);
      }
    };

    for (let i = 0; i < TOTAL_FRAMES_PER_VIDEO; i++) {
      // Video 1: frames_intro (1st car video starting.mp4)
      const img1 = new window.Image();
      img1.src = `/frames_intro/frame_${String(i).padStart(3, "0")}.webp`;
      img1.onload = () => {
        imgs1[i] = img1;
        loaded1++;
        checkComplete();
      };
      img1.onerror = () => {
        loaded1++;
        checkComplete();
      };

      // Video 2: frames (2nd entry video combine with 1st start.mp4)
      const img2 = new window.Image();
      img2.src = `/frames/frame_${String(i).padStart(3, "0")}.webp`;
      img2.onload = () => {
        imgs2[i] = img2;
        loaded2++;
        checkComplete();
      };
      img2.onerror = () => {
        loaded2++;
        checkComplete();
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Update canvas size on resize only
  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 2, 2.0);
      dimensionsRef.current = { width: w, height: h, dpr };

      if (canvas1Ref.current) {
        canvas1Ref.current.width = Math.floor(w * dpr);
        canvas1Ref.current.height = Math.floor(h * dpr);
      }
      if (canvas2Ref.current) {
        canvas2Ref.current.width = Math.floor(w * dpr);
        canvas2Ref.current.height = Math.floor(h * dpr);
      }

      drawVideo1(frameIndex1Ref.current);
      drawVideo2(frameIndex2Ref.current);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // High-performance Canvas renderer for Video 1 (Single Crisp Frame, Zero Ghosting)
  const drawVideo1 = (index: number) => {
    const canvas = canvas1Ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const { width, height, dpr } = dimensionsRef.current;
    const clampedIndex = Math.min(TOTAL_FRAMES_PER_VIDEO - 1, Math.max(0, Math.round(index)));

    ctx.save();
    ctx.scale(dpr, dpr);
    if (frames1Ref.current[clampedIndex]) {
      drawImageToCanvas(ctx, frames1Ref.current[clampedIndex], width, height, "cover");
    }
    ctx.restore();
  };

  // High-performance Canvas renderer for Video 2 (Single Crisp Frame, Zero Ghosting)
  const drawVideo2 = (index: number) => {
    const canvas = canvas2Ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const { width, height, dpr } = dimensionsRef.current;
    const clampedIndex = Math.min(TOTAL_FRAMES_PER_VIDEO - 1, Math.max(0, Math.round(index)));

    ctx.save();
    ctx.scale(dpr, dpr);
    if (frames2Ref.current[clampedIndex]) {
      drawImageToCanvas(ctx, frames2Ref.current[clampedIndex], width, height, "cover");
    }
    ctx.restore();
  };

  // Draw initial frame when loaded
  useEffect(() => {
    if (isLoaded) {
      drawVideo1(0);
      drawVideo2(0);
      if (canvas1Ref.current) canvas1Ref.current.style.opacity = "1";
      if (canvas2Ref.current) canvas2Ref.current.style.opacity = "0";
      ScrollTrigger.refresh();
    }
  }, [isLoaded]);

  // Combined Scroll Video: 1st Video (1st car video starting.mp4)
  // then combined with 2nd Video (2nd entry video combine with 1st start.mp4)
  useEffect(() => {
    if (!isLoaded || !containerRef.current || !stickyRef.current) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const pinDistance = isMobile ? 3200 : 4600;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${pinDistance}`,
        pin: stickyRef.current,
        pinSpacing: true,
        anticipatePin: 0,
        refreshPriority: 3, // Highest priority: Hero pinned first
        scrub: 0.35, // Ultra-smooth, responsive, zero-lag scrub
        onUpdate: (self) => {
          const progress = Math.min(1, Math.max(0, self.progress));
          const c1 = canvas1Ref.current;
          const c2 = canvas2Ref.current;

          // ZONE 1: 1st Video (1st car video starting.mp4) - Progress 0.00 -> 0.42
          if (progress < 0.42) {
            if (c1) c1.style.opacity = "1";
            if (c2) c2.style.opacity = "0";

            const p1 = progress / 0.42;
            const f1 = Math.min(
              TOTAL_FRAMES_PER_VIDEO - 1,
              Math.max(0, Math.round(p1 * (TOTAL_FRAMES_PER_VIDEO - 1)))
            );
            if (f1 !== frameIndex1Ref.current) {
              frameIndex1Ref.current = f1;
              drawVideo1(f1);
            }
          }
          // ZONE 2: Seamless Crossfade between 1st Video and 2nd Video - Progress 0.42 -> 0.46
          else if (progress < 0.46) {
            const crossRatio = (progress - 0.42) / 0.04;
            if (c1) c1.style.opacity = `${1 - crossRatio}`;
            if (c2) c2.style.opacity = `${crossRatio}`;

            // Ensure 1st Video is on last frame and 2nd Video is on first frame
            if (frameIndex1Ref.current !== TOTAL_FRAMES_PER_VIDEO - 1) {
              frameIndex1Ref.current = TOTAL_FRAMES_PER_VIDEO - 1;
              drawVideo1(TOTAL_FRAMES_PER_VIDEO - 1);
            }
            if (frameIndex2Ref.current !== 0) {
              frameIndex2Ref.current = 0;
              drawVideo2(0);
            }
          }
          // ZONE 3: 2nd Video (2nd entry video combine with 1st start.mp4) - Progress 0.46 -> 0.84
          else if (progress <= 0.84) {
            if (c1) c1.style.opacity = "0";
            if (c2) c2.style.opacity = "1";

            const p2 = (progress - 0.46) / (0.84 - 0.46);
            const f2 = Math.min(
              TOTAL_FRAMES_PER_VIDEO - 1,
              Math.max(0, Math.round(p2 * (TOTAL_FRAMES_PER_VIDEO - 1)))
            );
            if (f2 !== frameIndex2Ref.current) {
              frameIndex2Ref.current = f2;
              drawVideo2(f2);
            }
          }
          // ZONE 4: Hold Last Frame (frame 239) & Smooth Line Transition - Progress 0.84 -> 1.00
          else {
            if (c1) c1.style.opacity = "0";
            if (c2) c2.style.opacity = "1";

            if (frameIndex2Ref.current !== TOTAL_FRAMES_PER_VIDEO - 1) {
              frameIndex2Ref.current = TOTAL_FRAMES_PER_VIDEO - 1;
              drawVideo2(TOTAL_FRAMES_PER_VIDEO - 1);
            }
          }
        },
      });

      // Synchronize all triggers across the page
      ScrollTrigger.refresh();
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [isLoaded]);

  return (
    <section id="hero" ref={containerRef} className="relative bg-black text-white w-full">
      {/* Viewport Stage Pinned 100% Locked in Viewport by GSAP ScrollTrigger */}
      <div
        ref={stickyRef}
        className="relative w-full h-screen overflow-hidden flex flex-col justify-center items-center bg-black p-0 m-0"
      >
        {/* Fullscreen Video Canvas Stage */}
        <div className="relative z-10 w-full h-full flex items-center justify-center bg-black overflow-hidden p-0 m-0">
          {/* 1st Video Canvas: 1st car video starting.mp4 */}
          <canvas
            ref={canvas1Ref}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none will-change-transform"
            style={{ opacity: 1 }}
          />

          {/* 2nd Video Canvas: 2nd entry video combine with 1st start.mp4 */}
          <canvas
            ref={canvas2Ref}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none will-change-transform"
            style={{ opacity: 0 }}
          />

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none z-20" />

          {/* Seamless Bottom Gradient Mask for natural line transition into Section 02 */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
        </div>
      </div>
    </section>
  );
};
