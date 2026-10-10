"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, Volume2, VolumeX } from "lucide-react";

interface NavbarProps {
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenTestDrive: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isMuted,
  onToggleSound,
  onOpenTestDrive,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "hero",
        "design",
        "parts",
        "exterior",
        "interior",
        "configurator",
        "features",
        "gallery",
        "specs",
      ];
      const threshold = window.innerHeight * 0.45;

      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= threshold && rect.bottom > threshold) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Also attach to Lenis scroll for 100% sync
    let attachedLenis: any = null;
    const interval = setInterval(() => {
      if ((window as any).lenis) {
        attachedLenis = (window as any).lenis;
        attachedLenis.on("scroll", handleScroll);
        clearInterval(interval);
      }
    }, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
      if (attachedLenis) {
        attachedLenis.off("scroll", handleScroll);
      }
    };
  }, []);

  const navLinks = [
    { label: "OVERVIEW", href: "#hero", id: "hero" },
    { label: "DESIGN", href: "#design", id: "design" },
    { label: "PARTS", href: "#parts", id: "parts" },
    { label: "EXTERIOR", href: "#exterior", id: "exterior" },
    { label: "INTERIOR", href: "#interior", id: "interior" },
    { label: "COLOURWAYS", href: "#configurator", id: "configurator" },
    { label: "FEATURES", href: "#features", id: "features" },
    { label: "GALLERY", href: "#gallery", id: "gallery" },
    { label: "SPECS", href: "#specs", id: "specs" },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace("#", "");
    setActiveSection(targetId);

    if (targetId === "hero") {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0 });
      }
      return;
    }

    const target = document.getElementById(targetId);
    if (target) {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(target);
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {/* Header Container (Spacious Glass Navbar) */}
      <header className="fixed top-0 left-0 right-0 z-50 py-5 bg-transparent pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between pointer-events-auto">
          
          {/* Official Škoda Brand Logo */}
          <a
            href="#hero"
            onClick={(e) => scrollToSection(e, "#hero")}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/skoda-logo.png"
                alt="Škoda Official Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-[0.2em] text-[#F3F0E8] font-heading uppercase leading-none group-hover:text-white transition-colors">
                ŠKODA
              </span>
              <span className="text-[10px] font-bold tracking-[0.35em] text-zinc-400 uppercase leading-tight">
                KYLAQ
              </span>
            </div>
          </a>

          {/* Spacious Glass Magnifying Lens Pill Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 shadow-2xl transition-all duration-300">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`relative px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors duration-300 rounded-full ${
                    isActive ? "text-white font-bold" : "text-zinc-300 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white/20 border border-white/60 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Audio Ambience Toggle */}
            <button
              onClick={onToggleSound}
              title={isMuted ? "Enable Studio Ambience" : "Mute Sound"}
              className="p-3 rounded-full bg-black/50 hover:bg-white/10 backdrop-blur-sm border border-white/20 text-zinc-200 hover:text-white transition-all duration-300 shadow-xl"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>

            {/* Premium Ice Glass Shimmer CTA Button (No Star Logos) */}
            <button
              onClick={onOpenTestDrive}
              className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-full relative overflow-hidden group bg-gradient-to-r from-cyan-500/20 via-white/25 to-emerald-500/20 hover:from-cyan-400/35 hover:via-white/40 hover:to-emerald-400/35 backdrop-blur-md border border-cyan-200/40 hover:border-white shadow-[0_0_25px_rgba(0,225,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.5)] text-white font-bold text-xs tracking-widest uppercase transition-all duration-500 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {/* Ice Light Sweeping Beam Effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
              
              <span className="relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                BOOK TEST DRIVE
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-200 group-hover:text-white group-hover:translate-x-0.5 transition-transform duration-300 relative z-10" />
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-black/95 flex flex-col justify-between p-6 pt-24 lg:hidden pointer-events-auto"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-4">
                <Image src="/skoda-logo.png" alt="Škoda Logo" width={32} height={32} />
                <span className="text-xs font-mono tracking-[0.3em] text-zinc-400 uppercase">
                  ŠKODA DIGITAL SHOWROOM
                </span>
              </div>

              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="flex items-center justify-between text-xl font-heading font-medium text-[#F3F0E8] hover:text-white py-3 border-b border-white/10"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-5 h-5 text-zinc-500" />
                </motion.a>
              ))}
            </div>

            <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTestDrive();
                }}
                className="w-full py-4 rounded-full bg-gradient-to-r from-cyan-500/20 via-white/25 to-emerald-500/20 border border-cyan-200/50 text-white font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 shadow-2xl"
              >
                <span>BOOK A TEST DRIVE</span>
                <ChevronRight className="w-4 h-4 text-cyan-200" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
