"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap, ScrollTrigger, drawImageToCanvas } from "@/lib/animations";

import { createProgressiveSequence, ProgressiveSequenceController } from "@/lib/frameLoader";

const TOTAL_FRAMES_PER_VIDEO = 240;

export const CinematicReveal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const canvas1Ref = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);

  const frameIndex1Ref = useRef<number>(0);
  const frameIndex2Ref = useRef<number>(0);

  const seq1Ref = useRef<ProgressiveSequenceController | null>(null);
  const seq2Ref = useRef<ProgressiveSequenceController | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cached viewport dimensions for 60FPS canvas draw without layout thrashing
  const dimensionsRef = useRef<{ width: number; height: number; dpr: number }>({
    width: 1920,
    height: 1080,
    dpr: 1,
  });

  // Progressive Priority Loading for Video 1 (frames_intro) and Video 2 (frames)
  useEffect(() => {
    let isMounted = true;

    const seq1 = createProgressiveSequence({
      folder: "/frames_intro",
      totalFrames: TOTAL_FRAMES_PER_VIDEO,
      priorityCount: 24,
      onReady: () => {
        if (isMounted) {
          setIsLoaded(true);
        }
      },
    });

    const seq2 = createProgressiveSequence({
      folder: "/frames",
      totalFrames: TOTAL_FRAMES_PER_VIDEO,
      priorityCount: 16,
    });

    seq1Ref.current = seq1;
    seq2Ref.current = seq2;

    return () => {
      isMounted = false;
      seq1.cancel();
      seq2.cancel();
    };
  }, []);

  // Update canvas size on resize only - Fullscreen responsive viewport
  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 2, 2.0);
      const cw = Math.round(w * dpr) || 1920;
      const ch = Math.round(h * dpr) || 1080;
      dimensionsRef.current = { width: cw, height: ch, dpr };

      if (canvas1Ref.current) {
        canvas1Ref.current.width = cw;
        canvas1Ref.current.height = ch;
      }
      if (canvas2Ref.current) {
        canvas2Ref.current.width = cw;
        canvas2Ref.current.height = ch;
      }

      drawVideo1(frameIndex1Ref.current);
      drawVideo2(frameIndex2Ref.current);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const lastDrawn1Ref = useRef<number>(-1);
  const lastDrawn2Ref = useRef<number>(-1);

  // High-performance direct Canvas renderer for Video 1 (Single Crisp Frame, Zero Ghosting)
  const drawVideo1 = (index: number) => {
    const canvas = canvas1Ref.current;
    if (!canvas || !seq1Ref.current) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const img = seq1Ref.current.getFrame(index);
    if (img) {
      drawImageToCanvas(ctx, img, canvas.width, canvas.height, "cover");
    }
  };

  // High-performance direct Canvas renderer for Video 2 (Single Crisp Frame, Zero Ghosting)
  const drawVideo2 = (index: number) => {
    const canvas = canvas2Ref.current;
    if (!canvas || !seq2Ref.current) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const img = seq2Ref.current.getFrame(index);
    if (img) {
      drawImageToCanvas(ctx, img, canvas.width, canvas.height, "cover");
    }
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

  // Combined Scroll Video: Ultra-responsive, buttery-soft scrub for Video 1 & Video 2
  useEffect(() => {
    if (!isLoaded || !containerRef.current || !stickyRef.current) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const pinDistance = isMobile ? 2600 : 3800;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${pinDistance}`,
        pin: stickyRef.current,
        pinSpacing: true,
        anticipatePin: 0,
        refreshPriority: 3, // Highest priority: Hero pinned first
        scrub: 0.6, // Calibrated 0.6s scrub for velvety-soft cinematic interpolation
        onUpdate: (self) => {
          const progress = Math.min(1, Math.max(0, self.progress));
          const c1 = canvas1Ref.current;
          const c2 = canvas2Ref.current;

          // ZONE 1: 1st Video (1st car video starting.mp4) - Progress 0.00 -> 0.42
          if (progress < 0.42) {
            if (c1 && c1.style.opacity !== "1") c1.style.opacity = "1";
            if (c2 && c2.style.opacity !== "0") c2.style.opacity = "0";

            const p1 = progress / 0.42;
            const f1 = Math.min(
              TOTAL_FRAMES_PER_VIDEO - 1,
              Math.max(0, Math.round(p1 * (TOTAL_FRAMES_PER_VIDEO - 1)))
            );
            if (f1 !== lastDrawn1Ref.current) {
              lastDrawn1Ref.current = f1;
              drawVideo1(f1);
            }
          }
          // ZONE 2: Seamless Crossfade between 1st Video and 2nd Video - Progress 0.42 -> 0.46
          else if (progress < 0.46) {
            const crossRatio = (progress - 0.42) / 0.04;
            if (c1) c1.style.opacity = `${1 - crossRatio}`;
            if (c2) c2.style.opacity = `${crossRatio}`;

            if (lastDrawn1Ref.current !== TOTAL_FRAMES_PER_VIDEO - 1) {
              lastDrawn1Ref.current = TOTAL_FRAMES_PER_VIDEO - 1;
              drawVideo1(TOTAL_FRAMES_PER_VIDEO - 1);
            }
            if (lastDrawn2Ref.current !== 0) {
              lastDrawn2Ref.current = 0;
              drawVideo2(0);
            }
          }
          // ZONE 3: 2nd Video (2nd entry video combine with 1st start.mp4) - Progress 0.46 -> 0.84
          else if (progress <= 0.84) {
            if (c1 && c1.style.opacity !== "0") c1.style.opacity = "0";
            if (c2 && c2.style.opacity !== "1") c2.style.opacity = "1";

            const p2 = (progress - 0.46) / (0.84 - 0.46);
            const f2 = Math.min(
              TOTAL_FRAMES_PER_VIDEO - 1,
              Math.max(0, Math.round(p2 * (TOTAL_FRAMES_PER_VIDEO - 1)))
            );
            if (f2 !== lastDrawn2Ref.current) {
              lastDrawn2Ref.current = f2;
              drawVideo2(f2);
            }
          }
          // ZONE 4: Hold Last Frame (frame 239) & Smooth Line Transition - Progress 0.84 -> 1.00
          else {
            if (c1 && c1.style.opacity !== "0") c1.style.opacity = "0";
            if (c2 && c2.style.opacity !== "1") c2.style.opacity = "1";

            if (lastDrawn2Ref.current !== TOTAL_FRAMES_PER_VIDEO - 1) {
              lastDrawn2Ref.current = TOTAL_FRAMES_PER_VIDEO - 1;
              drawVideo2(TOTAL_FRAMES_PER_VIDEO - 1);
            }
          }
        },
      });

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
            className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
            style={{ opacity: 1 }}
          />

          {/* 2nd Video Canvas: 2nd entry video combine with 1st start.mp4 */}
          <canvas
            ref={canvas2Ref}
            className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
            style={{ opacity: 0 }}
          />

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none z-20" />

          {/* Seamless Bottom Gradient Mask for natural line transition into Section 02 */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
        </div>
      </div>
    </section>
  );
};
