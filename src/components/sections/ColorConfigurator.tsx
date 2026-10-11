"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap, ScrollTrigger, drawImageToCanvas } from "@/lib/animations";
import { createProgressiveSequence, ProgressiveSequenceController } from "@/lib/frameLoader";

const TOTAL_COLOR_FRAMES = 240;

interface ColorStageInfo {
  id: string;
  name: string;
  subtext: string;
  hex: string;
  film: "YELLOW & GREY FILM" | "SILVER & TORNADO RED FILM";
}

const COLOR_STAGES: ColorStageInfo[] = [
  {
    id: "yellow",
    name: "YELLOW / CHARTREUSE",
    subtext: "HERO LAUNCH COLOURWAY",
    hex: "#C4D600",
    film: "YELLOW & GREY FILM",
  },
  {
    id: "grey",
    name: "CARBON STEEL GREY",
    subtext: "METALLIC STEALTH EDITION",
    hex: "#606467",
    film: "YELLOW & GREY FILM",
  },
  {
    id: "silver",
    name: "BRILLIANT SILVER",
    subtext: "LIQUID REFLECTION SHADE",
    hex: "#D0D5DD",
    film: "SILVER & TORNADO RED FILM",
  },
  {
    id: "red",
    name: "TORNADO RED",
    subtext: "SPORT CRIMSON FINISH",
    hex: "#C8102E",
    film: "SILVER & TORNADO RED FILM",
  },
];

export const ColorConfigurator: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const canvas1Ref = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);

  const [activeColorIndex, setActiveColorIndex] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const frameIndex1Ref = useRef<number>(0);
  const frameIndex2Ref = useRef<number>(0);
  const seq1Ref = useRef<ProgressiveSequenceController | null>(null);
  const seq2Ref = useRef<ProgressiveSequenceController | null>(null);

  // Cached viewport dimensions for lag-free 60FPS canvas draw without layout thrashing
  const dimensionsRef = useRef<{ width: number; height: number; dpr: number }>({
    width: 1920,
    height: 1080,
    dpr: 1,
  });

  // Progressive Priority Loading: Starts when user approaches Colourways section (within 1400px)
  useEffect(() => {
    let isMounted = true;
    let sequenceStarted = false;

    const startLoading = () => {
      if (sequenceStarted || !isMounted) return;
      sequenceStarted = true;

      const seq1 = createProgressiveSequence({
        folder: "/frames_color_yellow_grey",
        totalFrames: TOTAL_COLOR_FRAMES,
        priorityCount: 24,
        onReady: () => {
          if (isMounted) {
            setIsLoaded(true);
          }
        },
      });

      const seq2 = createProgressiveSequence({
        folder: "/frames_color_silver_red",
        totalFrames: TOTAL_COLOR_FRAMES,
        priorityCount: 16,
      });

      seq1Ref.current = seq1;
      seq2Ref.current = seq2;
    };

    // Proximity trigger
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          startLoading();
          observer.disconnect();
        }
      },
      { rootMargin: "1400px 0px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    } else {
      startLoading();
    }

    return () => {
      isMounted = false;
      observer.disconnect();
      if (seq1Ref.current) seq1Ref.current.cancel();
      if (seq2Ref.current) seq2Ref.current.cancel();
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

  const activeColorIndexRef = useRef<number>(0);
  const lastDrawn1Ref = useRef<number>(-1);
  const lastDrawn2Ref = useRef<number>(-1);

  // Direct high-performance Canvas renderers (Single Crisp Frame, Zero Ghosting)
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

  // Draw initial frames when loaded
  useEffect(() => {
    if (isLoaded) {
      drawVideo1(0);
      drawVideo2(0);
      if (canvas1Ref.current) canvas1Ref.current.style.opacity = "1";
      if (canvas2Ref.current) canvas2Ref.current.style.opacity = "0";
      ScrollTrigger.refresh();
    }
  }, [isLoaded]);

  // GSAP ScrollTrigger Pinned Stage: Ultra-responsive, buttery-soft scrub for Colorways
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
        refreshPriority: 1, // Computed after upstream pinned sections
        scrub: 0.6, // Calibrated 0.6s scrub for velvety-soft cinematic interpolation
        onUpdate: (self) => {
          const progress = Math.min(1, Math.max(0, self.progress));
          const c1 = canvas1Ref.current;
          const c2 = canvas2Ref.current;

          const activeProgress = Math.min(1, progress / 0.88);

          // Active Color Index: Yellow (0) -> Grey (1) -> Silver (2) -> Red (3)
          let colorIdx = 0;
          if (activeProgress >= 0.72) colorIdx = 3;
          else if (activeProgress >= 0.48) colorIdx = 2;
          else if (activeProgress >= 0.24) colorIdx = 1;
          else colorIdx = 0;

          if (activeColorIndexRef.current !== colorIdx) {
            activeColorIndexRef.current = colorIdx;
            setActiveColorIndex(colorIdx);
          }

          // ZONE 1: 1st Video (Yellow & Grey Car Pass) - Progress 0.00 -> 0.44
          if (activeProgress <= 0.44) {
            if (c1 && c1.style.opacity !== "1") c1.style.opacity = "1";
            if (c2 && c2.style.opacity !== "0") c2.style.opacity = "0";

            const p1 = activeProgress / 0.44;
            const f1 = Math.min(
              TOTAL_COLOR_FRAMES - 1,
              Math.max(0, Math.round(p1 * (TOTAL_COLOR_FRAMES - 1)))
            );
            if (f1 !== lastDrawn1Ref.current) {
              lastDrawn1Ref.current = f1;
              drawVideo1(f1);
            }
          }
          // ZONE 2: Seamless Crossfade between 1st Video and 2nd Video - Progress 0.44 -> 0.50
          else if (activeProgress <= 0.50) {
            const crossRatio = (activeProgress - 0.44) / 0.06;
            if (c1) c1.style.opacity = `${1 - crossRatio}`;
            if (c2) c2.style.opacity = `${crossRatio}`;

            if (lastDrawn1Ref.current !== TOTAL_COLOR_FRAMES - 1) {
              lastDrawn1Ref.current = TOTAL_COLOR_FRAMES - 1;
              drawVideo1(TOTAL_COLOR_FRAMES - 1);
            }
            if (lastDrawn2Ref.current !== 0) {
              lastDrawn2Ref.current = 0;
              drawVideo2(0);
            }
          }
          // ZONE 3: 2nd Video (Silver & Tornado Red Car Pass) - Progress 0.50 -> 1.00
          else {
            if (c1 && c1.style.opacity !== "0") c1.style.opacity = "0";
            if (c2 && c2.style.opacity !== "1") c2.style.opacity = "1";

            const p2 = (activeProgress - 0.50) / 0.50;
            const f2 = Math.min(
              TOTAL_COLOR_FRAMES - 1,
              Math.max(0, Math.round(p2 * (TOTAL_COLOR_FRAMES - 1)))
            );
            if (f2 !== lastDrawn2Ref.current) {
              lastDrawn2Ref.current = f2;
              drawVideo2(f2);
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

  const activeColor = COLOR_STAGES[activeColorIndex];

  return (
    <section
      id="configurator"
      ref={containerRef}
      className="relative bg-black w-full overflow-hidden z-10"
    >
      {/* Fullscreen Viewport Stage Pinned Steadily by GSAP ScrollTrigger */}
      <div
        ref={stickyRef}
        className="relative w-full h-screen overflow-hidden flex flex-col justify-between bg-black p-0 m-0"
      >
        {/* Overhead Dynamic Title with Active Colourway Accent */}
        <div className="absolute top-12 sm:top-16 left-0 right-0 z-30 flex flex-col items-center text-center pointer-events-none px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeColor.id}
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center"
            >
              <div
                className="px-3.5 py-1 rounded-full text-[10px] font-mono tracking-[0.25em] uppercase mb-1.5 border backdrop-blur-md"
                style={{
                  color: activeColor.hex,
                  borderColor: `${activeColor.hex}50`,
                  backgroundColor: "rgba(0,0,0,0.7)",
                }}
              >
                04 • {activeColor.subtext}
              </div>

              <h3
                className="text-2xl sm:text-3xl md:text-5xl font-extrabold font-heading tracking-tight uppercase drop-shadow-[0_2px_15px_rgba(0,0,0,0.95)]"
                style={{ color: "#F3F0E8" }}
              >
                <span style={{ color: activeColor.hex }}>
                  {activeColor.name.split("/")[0]}
                </span>
                {activeColor.name.includes("/") && (
                  <span className="text-white">
                    {" "}
                    / {activeColor.name.split("/")[1]}
                  </span>
                )}
              </h3>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Fullscreen Video Canvas Stage */}
        <div className="relative z-10 w-full h-full flex items-center justify-center bg-black overflow-hidden p-0 m-0">
          {/* Canvas 1: Yellow & Grey Car Pass */}
          <canvas
            ref={canvas1Ref}
            className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
            style={{ opacity: 1 }}
          />

          {/* Canvas 2: Silver & Tornado Red Car Pass */}
          <canvas
            ref={canvas2Ref}
            className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
            style={{ opacity: 0 }}
          />

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none z-20" />
        </div>
      </div>
    </section>
  );
};
