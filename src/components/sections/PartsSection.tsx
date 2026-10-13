"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, drawImageToCanvas, createRafRenderQueue } from "@/lib/animations";

import { createProgressiveSequence, ProgressiveSequenceController } from "@/lib/frameLoader";

const TOTAL_PARTS_FRAMES = 240;

export const PartsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const frameIndexRef = useRef<number>(0);
  const seqRef = useRef<ProgressiveSequenceController | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cached viewport dimensions for 60FPS canvas draw without layout thrashing
  const dimensionsRef = useRef<{ width: number; height: number; dpr: number }>({
    width: 1920,
    height: 1080,
    dpr: 1,
  });

  // Direct high-performance Canvas renderer
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !seqRef.current) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const img = seqRef.current.getFrame(index);
    if (img) {
      drawImageToCanvas(ctx, img, canvas.width, canvas.height, "contain");
    }
  };

  const rafQueueRef = useRef<ReturnType<typeof createRafRenderQueue<number>> | null>(null);
  if (!rafQueueRef.current) {
    rafQueueRef.current = createRafRenderQueue<number>((idx) => drawFrame(idx));
  }

  // Progressive Priority Loading: Starts when user approaches the section (within 400px)
  useEffect(() => {
    let isMounted = true;
    let sequenceStarted = false;

    const startLoading = () => {
      if (sequenceStarted || !isMounted) return;
      sequenceStarted = true;

      const seq = createProgressiveSequence({
        folder: "/frames_parts",
        totalFrames: TOTAL_PARTS_FRAMES,
        priorityCount: 20,
        onReady: () => {
          if (isMounted) {
            setIsLoaded(true);
          }
        },
      });

      seqRef.current = seq;
    };

    // Proximity trigger: load only when user scrolls near PartsSection
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          startLoading();
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    } else {
      startLoading();
    }

    return () => {
      isMounted = false;
      observer.disconnect();
      if (seqRef.current) {
        seqRef.current.cancel();
      }
      rafQueueRef.current?.cancel();
    };
  }, []);

  // Update canvas size on resize — canvas backing = CSS pixels (no DPR multiply)
  // This gives native 1:1 pixel mapping for 1920×1080 frames on 1080p monitors.
  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      dimensionsRef.current = { width: w, height: h, dpr: window.devicePixelRatio || 1 };

      if (canvasRef.current) {
        canvasRef.current.width = w;
        canvasRef.current.height = h;
      }

      drawFrame(frameIndexRef.current);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Draw initial frame when loaded
  useEffect(() => {
    if (isLoaded) {
      drawFrame(0);
      ScrollTrigger.refresh();
    }
  }, [isLoaded]);

  const lastDrawnFrameRef = useRef<number>(-1);

  // GSAP ScrollTrigger: Responsive, buttery-smooth scrub for Parts Video
  useEffect(() => {
    if (!isLoaded || !containerRef.current || !stickyRef.current) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const pinDistance = isMobile ? 1600 : 2200;
    const PLAY_ZONE = 0.88;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${pinDistance}`,
        pin: stickyRef.current,
        pinSpacing: true,
        anticipatePin: 0,
        refreshPriority: 2, // Pinned between Hero (3) and Colorways (1)
        scrub: 0.6, // Calibrated 0.6s scrub for velvety-soft cinematic interpolation
        onUpdate: (self) => {
          const progress = Math.min(1, Math.max(0, self.progress));
          const videoProgress = Math.min(1, progress / PLAY_ZONE);
          const f = Math.min(
            TOTAL_PARTS_FRAMES - 1,
            Math.max(0, Math.round(videoProgress * (TOTAL_PARTS_FRAMES - 1)))
          );

          if (f !== lastDrawnFrameRef.current) {
            lastDrawnFrameRef.current = f;
            rafQueueRef.current?.request(f);
            seqRef.current?.prefetchWindow(f, 20);
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
    <section
      id="parts"
      ref={containerRef}
      className="relative bg-black text-white w-full overflow-hidden"
    >
      {/* Viewport Stage Pinned 100% Locked in Viewport by GSAP ScrollTrigger */}
      <div
        ref={stickyRef}
        className="relative w-full h-screen overflow-hidden flex flex-col justify-center items-center bg-black p-0 m-0"
      >
        {/* Sleek Floating Top-Left Badge & Title - Away from car center */}
        <div className="absolute top-20 left-6 sm:top-24 sm:left-10 lg:left-16 z-30 pointer-events-none flex flex-col items-start max-w-lg">
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/70 border border-white/20 backdrop-blur-md text-[10px] font-mono tracking-[0.3em] text-[#00A878] uppercase mb-2 shadow-xl">
            <Image src="/skoda-logo.png" alt="Škoda Logo" width={18} height={18} />
            <span>02.5 • CRAFTED PARTS &amp; ENGINEERING</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-heading text-[#F3F0E8] uppercase tracking-tight leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            ENGINEERED WITH <span className="text-[#C4D600]">PRECISION.</span>
          </h2>
        </div>

        {/* Fullscreen Video Canvas Stage */}
        <div className="relative z-10 w-full h-full flex items-center justify-center bg-black overflow-hidden p-0 m-0">
          {/* Native High-Res Poster: Zero black flash on approach */}
          <img
            src="/posters/parts_poster.webp"
            alt="Škoda Kylaq Engineering"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0"
            loading="lazy"
          />

          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none will-change-transform z-10"
          />

          {/* Soft Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none z-20" />
        </div>
      </div>
    </section>
  );
};
