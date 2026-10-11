"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap, ScrollTrigger, drawImageToCanvas } from "@/lib/animations";

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
  const frames1Ref = useRef<HTMLImageElement[]>([]);
  const frames2Ref = useRef<HTMLImageElement[]>([]);

  // Cached viewport dimensions for lag-free 60FPS canvas draw without layout thrashing
  const dimensionsRef = useRef<{ width: number; height: number; dpr: number }>({
    width: 1920,
    height: 1080,
    dpr: 1,
  });

  // Preload all 240 frames of Video 1 (NEW yellow and grey car color video) and 240 frames of Video 2 (NEW silver and tornado red video)
  useEffect(() => {
    let isMounted = true;
    let loaded1 = 0;
    let loaded2 = 0;

    const imgs1: HTMLImageElement[] = new Array(TOTAL_COLOR_FRAMES);
    const imgs2: HTMLImageElement[] = new Array(TOTAL_COLOR_FRAMES);

    const checkComplete = () => {
      if (
        loaded1 >= TOTAL_COLOR_FRAMES &&
        loaded2 >= TOTAL_COLOR_FRAMES &&
        isMounted
      ) {
        frames1Ref.current = imgs1;
        frames2Ref.current = imgs2;
        setIsLoaded(true);
      }
    };

    for (let i = 0; i < TOTAL_COLOR_FRAMES; i++) {
      // 1st Video: Yellow & Grey Car Pass
      const img1 = new window.Image();
      img1.src = `/frames_color_yellow_grey/frame_${String(i).padStart(3, "0")}.webp`;
      img1.onload = () => {
        imgs1[i] = img1;
        loaded1++;
        checkComplete();
      };
      img1.onerror = () => {
        loaded1++;
        checkComplete();
      };

      // 2nd Video: Silver & Tornado Red Car Pass
      const img2 = new window.Image();
      img2.src = `/frames_color_silver_red/frame_${String(i).padStart(3, "0")}.webp`;
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

  // Direct high-performance Canvas renderers (Single Crisp Frame, Zero Ghosting)
  const drawVideo1 = (index: number) => {
    const canvas = canvas1Ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const { width, height, dpr } = dimensionsRef.current;
    const clampedIndex = Math.min(TOTAL_COLOR_FRAMES - 1, Math.max(0, Math.round(index)));

    ctx.save();
    ctx.scale(dpr, dpr);
    if (frames1Ref.current[clampedIndex]) {
      drawImageToCanvas(ctx, frames1Ref.current[clampedIndex], width, height, "cover");
    }
    ctx.restore();
  };

  const drawVideo2 = (index: number) => {
    const canvas = canvas2Ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const { width, height, dpr } = dimensionsRef.current;
    const clampedIndex = Math.min(TOTAL_COLOR_FRAMES - 1, Math.max(0, Math.round(index)));

    ctx.save();
    ctx.scale(dpr, dpr);
    if (frames2Ref.current[clampedIndex]) {
      drawImageToCanvas(ctx, frames2Ref.current[clampedIndex], width, height, "cover");
    }
    ctx.restore();
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

  // GSAP ScrollTrigger Pinned Stage: Buttery-smooth, slow, lag-free scrub identical to Hero
  useEffect(() => {
    if (!isLoaded || !containerRef.current || !stickyRef.current) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const pinDistance = isMobile ? 3000 : 4200;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${pinDistance}`,
        pin: stickyRef.current,
        pinSpacing: true,
        anticipatePin: 0,
        refreshPriority: 1, // Computed after upstream pinned sections
        scrub: 0.35, // Ultra-smooth, responsive, zero-lag scrub
        onUpdate: (self) => {
          const progress = Math.min(1, Math.max(0, self.progress));
          const c1 = canvas1Ref.current;
          const c2 = canvas2Ref.current;

          // 0.00 to 0.88: Active video playback range; 0.88 to 1.00: Hold & smooth flow exit
          const activeProgress = Math.min(1, progress / 0.88);

          // Active Color Index: Yellow (0) -> Grey (1) -> Silver (2) -> Red (3)
          let colorIdx = 0;
          if (activeProgress >= 0.72) colorIdx = 3;
          else if (activeProgress >= 0.48) colorIdx = 2;
          else if (activeProgress >= 0.24) colorIdx = 1;
          else colorIdx = 0;

          setActiveColorIndex(colorIdx);

          // ZONE 1: 1st Video (Yellow & Grey Car Pass) - Progress 0.00 -> 0.44
          if (activeProgress <= 0.44) {
            if (c1) c1.style.opacity = "1";
            if (c2) c2.style.opacity = "0";

            const p1 = activeProgress / 0.44;
            const f1 = Math.min(
              TOTAL_COLOR_FRAMES - 1,
              Math.max(0, Math.round(p1 * (TOTAL_COLOR_FRAMES - 1)))
            );
            if (f1 !== frameIndex1Ref.current) {
              frameIndex1Ref.current = f1;
              drawVideo1(f1);
            }
          }
          // ZONE 2: Seamless Crossfade between 1st Video and 2nd Video - Progress 0.44 -> 0.50
          else if (activeProgress <= 0.50) {
            const crossRatio = (activeProgress - 0.44) / 0.06;
            if (c1) c1.style.opacity = `${1 - crossRatio}`;
            if (c2) c2.style.opacity = `${crossRatio}`;

            if (frameIndex1Ref.current !== TOTAL_COLOR_FRAMES - 1) {
              frameIndex1Ref.current = TOTAL_COLOR_FRAMES - 1;
              drawVideo1(TOTAL_COLOR_FRAMES - 1);
            }
            if (frameIndex2Ref.current !== 0) {
              frameIndex2Ref.current = 0;
              drawVideo2(0);
            }
          }
          // ZONE 3: 2nd Video (Silver & Tornado Red Car Pass) - Progress 0.50 -> 1.00
          else {
            if (c1) c1.style.opacity = "0";
            if (c2) c2.style.opacity = "1";

            const p2 = (activeProgress - 0.50) / 0.50;
            const f2 = Math.min(
              TOTAL_COLOR_FRAMES - 1,
              Math.max(0, Math.round(p2 * (TOTAL_COLOR_FRAMES - 1)))
            );
            if (f2 !== frameIndex2Ref.current) {
              frameIndex2Ref.current = f2;
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

        {/* Fullscreen Screen-Fitted Dual Canvas Stage (60FPS Zero Lag) */}
        <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden p-0 m-0">
          {/* Canvas 1: Yellow & Grey Car Pass */}
          <canvas
            ref={canvas1Ref}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none will-change-transform"
            style={{ opacity: 1 }}
          />

          {/* Canvas 2: Silver & Tornado Red Car Pass */}
          <canvas
            ref={canvas2Ref}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none will-change-transform"
            style={{ opacity: 0 }}
          />

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none z-20" />

          {/* Seamless Bottom Gradient Mask for natural transition into next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
        </div>
      </div>
    </section>
  );
};
