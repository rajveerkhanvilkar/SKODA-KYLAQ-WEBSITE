"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/animations";

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

  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  const [activeColorIndex, setActiveColorIndex] = useState<number>(0);
  const [video1Opacity, setVideo1Opacity] = useState<number>(1);
  const [video2Opacity, setVideo2Opacity] = useState<number>(0);

  const targetTime1 = useRef<number>(0);
  const targetTime2 = useRef<number>(0);

  // Hardware-accelerated RAF lerp loop for ultra-smooth 60FPS video scrubbing
  useEffect(() => {
    let animId: number;

    const smoothScrub = () => {
      const v1 = video1Ref.current;
      if (v1 && v1.duration && !v1.seeking) {
        const diff1 = targetTime1.current - v1.currentTime;
        if (Math.abs(diff1) > 0.02) {
          v1.currentTime += diff1 * 0.35;
        }
      }

      const v2 = video2Ref.current;
      if (v2 && v2.duration && !v2.seeking) {
        const diff2 = targetTime2.current - v2.currentTime;
        if (Math.abs(diff2) > 0.02) {
          v2.currentTime += diff2 * 0.35;
        }
      }

      animId = requestAnimationFrame(smoothScrub);
    };

    animId = requestAnimationFrame(smoothScrub);
    return () => cancelAnimationFrame(animId);
  }, []);

  // GSAP ScrollTrigger Pinned Stage for 1st Video (Yellow & Grey) and 2nd Video (Silver & Tornado Red)
  // refreshPriority: 1 ensures it calculates position AFTER Hero (refreshPriority: 2), so it never overlaps Design!
  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const pinDistance = isMobile ? 2600 : 3800;

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${pinDistance}`,
        pin: stickyRef.current,
        pinSpacing: true,
        anticipatePin: 0,
        refreshPriority: 1, // Computed strictly after upstream pinned sections
        scrub: 0.2, // Snappy, responsive scrub
        onUpdate: (self) => {
          const progress = Math.min(1, Math.max(0, self.progress));

          // 0.00 to 0.88: Active video playback range; 0.88 to 1.00: Hold & smooth flow exit
          const activeProgress = Math.min(1, progress / 0.88);

          // Active Color Index: Yellow (0) -> Grey (1) -> Silver (2) -> Red (3)
          let colorIdx = 0;
          if (activeProgress >= 0.72) colorIdx = 3;
          else if (activeProgress >= 0.48) colorIdx = 2;
          else if (activeProgress >= 0.24) colorIdx = 1;
          else colorIdx = 0;

          setActiveColorIndex(colorIdx);

          const v1 = video1Ref.current;
          const v2 = video2Ref.current;

          // 1st Video: Yellow & Grey Car Pass (Progress 0.00 -> 0.46)
          if (activeProgress <= 0.46) {
            setVideo1Opacity(1);
            setVideo2Opacity(0);
            if (v1 && v1.duration) {
              targetTime1.current = (activeProgress / 0.46) * v1.duration;
            }
          }
          // Seamless Crossfade between Video 1 and Video 2 (Progress 0.46 -> 0.52)
          else if (activeProgress <= 0.52) {
            const crossRatio = (activeProgress - 0.46) / 0.06;
            setVideo1Opacity(1 - crossRatio);
            setVideo2Opacity(crossRatio);

            if (v1 && v1.duration) targetTime1.current = v1.duration;
            if (v2 && v2.duration) targetTime2.current = 0;
          }
          // 2nd Video: Silver & Tornado Red Car Pass (Progress 0.52 -> 1.00)
          else {
            setVideo1Opacity(0);
            setVideo2Opacity(1);
            if (v2 && v2.duration) {
              const p2 = (activeProgress - 0.52) / (1 - 0.52);
              targetTime2.current = p2 * v2.duration;
            }
          }
        },
      });
    }, containerRef);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

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

        {/* Fullscreen Screen-Fitted Video Viewport Stage */}
        <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden p-0 m-0">
          {/* Video 1: Yellow & Grey Car Pass (yellow and grey car color video_gwr_video_mvp.mp4) */}
          <video
            ref={video1Ref}
            src="/videos/color_yellow_grey.mp4"
            preload="auto"
            muted
            playsInline
            style={{ opacity: video1Opacity }}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 z-10"
          />

          {/* Video 2: Silver & Tornado Red Car Pass (silver and tornado red_gwr_video_mvp.mp4) */}
          <video
            ref={video2Ref}
            src="/videos/color_silver_red.mp4"
            preload="auto"
            muted
            playsInline
            style={{ opacity: video2Opacity }}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 z-10"
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
