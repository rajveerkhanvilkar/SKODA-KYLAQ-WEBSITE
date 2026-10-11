"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, drawBlendedFramesToCanvas } from "@/lib/animations";

const TOTAL_PARTS_FRAMES = 240;

export const PartsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const frameIndexRef = useRef<number>(0);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cached viewport dimensions for 60FPS canvas draw without layout thrashing
  const dimensionsRef = useRef<{ width: number; height: number; dpr: number }>({
    width: 1920,
    height: 1080,
    dpr: 1,
  });

  // Preload all 240 frames of new parts video.mp4
  useEffect(() => {
    let isMounted = true;
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = new Array(TOTAL_PARTS_FRAMES);

    const checkComplete = () => {
      if (loadedCount >= TOTAL_PARTS_FRAMES && isMounted) {
        framesRef.current = imgs;
        setIsLoaded(true);
      }
    };

    for (let i = 0; i < TOTAL_PARTS_FRAMES; i++) {
      const img = new window.Image();
      img.src = `/frames_parts/frame_${String(i).padStart(3, "0")}.webp`;
      img.onload = () => {
        imgs[i] = img;
        loadedCount++;
        checkComplete();
      };
      img.onerror = () => {
        loadedCount++;
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

      if (canvasRef.current) {
        canvasRef.current.width = Math.floor(w * dpr);
        canvasRef.current.height = Math.floor(h * dpr);
      }

      drawFrame(frameIndexRef.current);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Continuous Sub-Frame Blended Canvas renderer (Zero Visible Cuts, 60FPS)
  const drawFrame = (floatIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const { width, height, dpr } = dimensionsRef.current;
    const clamped = Math.max(0, Math.min(TOTAL_PARTS_FRAMES - 1, floatIndex));
    const idxA = Math.floor(clamped);
    const idxB = Math.min(TOTAL_PARTS_FRAMES - 1, idxA + 1);
    const blend = clamped - idxA;

    ctx.save();
    ctx.scale(dpr, dpr);
    if (framesRef.current[idxA]) {
      drawBlendedFramesToCanvas(
        ctx,
        framesRef.current[idxA],
        framesRef.current[idxB],
        blend,
        width,
        height,
        "cover"
      );
    }
    ctx.restore();
  };

  // Draw initial frame when loaded
  useEffect(() => {
    if (isLoaded) {
      drawFrame(0);
      ScrollTrigger.refresh();
    }
  }, [isLoaded]);

  // GSAP ScrollTrigger: Slow, smooth, lag-free scrub through parts video details
  useEffect(() => {
    if (!isLoaded || !containerRef.current || !stickyRef.current) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    // Generous pin distance for slow, soft, buttery-smooth inspection of vehicle parts
    const pinDistance = isMobile ? 3800 : 5600;
    const PLAY_ZONE = 0.85; // Complete 100% of parts video by 85% mark, hold remainder

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${pinDistance}`,
        pin: stickyRef.current,
        pinSpacing: true,
        anticipatePin: 0,
        refreshPriority: 2, // Pinned between Hero (3) and Colorways (1)
        scrub: 0.8, // Luxurious, buttery-smooth momentum scrub
        onUpdate: (self) => {
          const progress = Math.min(1, Math.max(0, self.progress));

          // Continuous sub-frame mapping through all 240 frames
          const videoProgress = Math.min(1, progress / PLAY_ZONE);
          const floatFrame = Math.min(
            TOTAL_PARTS_FRAMES - 1,
            Math.max(0, videoProgress * (TOTAL_PARTS_FRAMES - 1))
          );

          frameIndexRef.current = floatFrame;
          drawFrame(floatFrame);
        },
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [isLoaded]);

  return (
    <section
      id="parts"
      ref={containerRef}
      className="relative bg-black text-white w-full overflow-hidden"
    >
      {/* Viewport Stage Pinned 100% Locked in Viewport by GSAP ScrollTrigger */}
      <div
        ref={stickyRef}
        className="relative w-full h-screen overflow-hidden flex flex-col justify-between bg-black p-0 m-0"
      >
        {/* Sleek Floating Top-Left Badge & Title - Away from car center */}
        <div className="absolute top-24 left-6 sm:top-28 sm:left-10 lg:left-16 z-30 pointer-events-none flex flex-col items-start max-w-lg">
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/70 border border-white/20 backdrop-blur-md text-[10px] font-mono tracking-[0.3em] text-[#00A878] uppercase mb-2 shadow-xl">
            <Image src="/skoda-logo.png" alt="Škoda Logo" width={18} height={18} />
            <span>02.5 • CRAFTED PARTS &amp; ENGINEERING</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-heading text-[#F3F0E8] uppercase tracking-tight leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            ENGINEERED WITH <span className="text-[#C4D600]">PRECISION.</span>
          </h2>
        </div>

        {/* Fullscreen Screen-Fitted Canvas Stage (Zero Lag 60FPS) */}
        <div className="relative z-10 w-full h-full flex items-center justify-center bg-black overflow-hidden p-0 m-0">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover pointer-events-none will-change-transform"
          />

          {/* Soft Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none z-20" />

          {/* Top Transition Gradient Bridge */}
          <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black to-transparent pointer-events-none z-20" />

          {/* Bottom Transition Gradient Bridge into Exterior Section */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
        </div>
      </div>
    </section>
  );
};
