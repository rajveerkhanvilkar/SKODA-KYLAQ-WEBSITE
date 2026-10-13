"use client";

import React from "react";
import Image from "next/image";

export const DesignSection: React.FC = () => {
  const highlights = [
    {
      title: "DISTINCTIVE GRILLE",
      subtitle: "Vertical 3D ribbed front fascia",
      image: "/images/features/front_fascia.webp",
    },
    {
      title: "LED LIGHT SIGNATURE",
      subtitle: "Sharp split LED daylight technology",
      image: "/images/features/headlight_detail.webp",
    },
    {
      title: "ALLOY WHEELS",
      subtitle: "Precision-cut aerodynamic alloys",
      image: "/images/features/wheel_detail.webp",
    },
    {
      title: "SCULPTED SILHOUETTE",
      subtitle: "Dynamic shoulder lines & high stance",
      image: "/images/features/teal_studio.webp",
    },
  ];

  return (
    <section id="design" className="relative bg-black pt-20 pb-28 px-4 sm:px-6 lg:px-8 border-t border-white/5 overflow-hidden">
      {/* Soft Ambient Studio Light for smooth visual continuity */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00A878]/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image src="/skoda-logo.png" alt="Škoda Logo" width={24} height={24} />
              <span className="text-xs font-mono tracking-[0.35em] text-[#00A878] uppercase">
                02 • MODERN SOLID DESIGN ARCHITECTURE
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-extrabold font-heading text-[#F3F0E8] uppercase tracking-tight leading-none">
              DESIGNED TO <span className="text-white">COMMAND ATTENTION.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-zinc-400 font-sans leading-relaxed">
            A bold stance, striking lines, and a distinctive Modern Solid design language that makes the Škoda Kylaq impossible to ignore.
          </p>
        </div>

        {/* Hero Cinematic Studio Image */}
        <div className="relative aspect-[21/9] max-w-7xl mx-auto rounded-3xl overflow-hidden border border-white/15 bg-black mb-12 shadow-2xl group">
          <Image
            src="/images/features/cinematic_studio.webp"
            alt="Škoda Kylaq Exterior Studio Reveal"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />
          
          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
            <div>
              <span className="text-[10px] font-mono tracking-[0.4em] text-zinc-300 uppercase block mb-1">
                CAMPAIGN HERO SHOT
              </span>
              <h3 className="text-2xl font-bold font-heading text-white uppercase tracking-wider">
                MODERN SOLID EXTERIOR
              </h3>
            </div>
            <span className="px-4 py-2 rounded-full bg-white/[0.08] backdrop-blur-3xl border border-white/20 text-xs font-mono text-zinc-300 uppercase">
              OLIVE GOLD EDITION
            </span>
          </div>
        </div>

        {/* 4 Detail Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/15 bg-black group shadow-xl transition-all duration-300 hover:border-white/30"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />
              <div className="absolute bottom-5 left-5 right-5">
                <h4 className="text-sm font-bold font-heading text-white tracking-wider uppercase mb-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-zinc-400 font-sans leading-tight">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
