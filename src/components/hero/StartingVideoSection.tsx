"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Play, Pause, Sparkles, ChevronDown } from "lucide-react";

interface StartingVideoSectionProps {
  onStartExploration: () => void;
}

export const StartingVideoSection: React.FC<StartingVideoSectionProps> = ({
  onStartExploration,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="relative bg-[#050706] pt-24 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <Image src="/skoda-logo.png" alt="Škoda Logo" width={22} height={22} />
              <span className="text-xs font-mono tracking-[0.35em] text-[#00A878] uppercase">
                01 • STARTING FILM EXPERIENCE
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#F3F0E8] uppercase tracking-tight leading-none">
              WORLD PREMIERE <span className="text-[#C4D600]">CINEMATIC REVEAL</span>
            </h2>
          </div>

          <button
            onClick={onStartExploration}
            className="self-start sm:self-auto px-6 py-3 rounded-full bg-gradient-to-r from-white/20 via-white/10 to-[#00A878]/30 hover:from-[#00A878]/40 hover:to-[#C4D600]/40 backdrop-blur-xl border border-white/30 text-white font-bold text-xs tracking-widest uppercase shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_8px_20px_rgba(0,168,120,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 group"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C4D600] group-hover:rotate-12 transition-transform" />
            <span>START INTERACTIVE SCROLL</span>
            <ChevronDown className="w-4 h-4 text-zinc-300" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video max-w-6xl h-[65vh] max-h-[600px] mx-auto rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-black/80 group">
          <video
            ref={videoRef}
            src="/videos/intro.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            className="w-full h-full object-contain bg-black"
          />

          {/* Video Overlay Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050706]/80 via-transparent to-[#050706]/30 pointer-events-none" />

          {/* Play/Pause Glass Control */}
          <button
            onClick={togglePlay}
            className="absolute bottom-6 left-6 z-20 p-3.5 rounded-full bg-black/60 hover:bg-[#00A878]/40 border border-white/20 text-white backdrop-blur-md transition-all duration-300"
            title={isPlaying ? "Pause Video" : "Play Video"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-[#C4D600]" />}
          </button>

          {/* Minimal Watermark Pill */}
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-xs font-mono text-zinc-300 uppercase">
            <span className="w-2 h-2 rounded-full bg-[#00A878] animate-pulse" />
            <span>INTRODUCTORY FILM</span>
          </div>
        </div>
      </div>
    </section>
  );
};
