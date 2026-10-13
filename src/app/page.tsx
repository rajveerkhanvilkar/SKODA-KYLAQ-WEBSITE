"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/navigation/Navbar";
import { LogoLoader } from "@/components/loading/LogoLoader";
import { CinematicReveal } from "@/components/hero/CinematicReveal";
import { DesignSection } from "@/components/sections/DesignSection";
import { PartsSection } from "@/components/sections/PartsSection";
import { ExteriorSection } from "@/components/sections/ExteriorSection";
import { InteriorSection } from "@/components/sections/InteriorSection";
import { ColorConfigurator } from "@/components/sections/ColorConfigurator";
import { FeatureExplorer } from "@/components/sections/FeatureExplorer";
import { GallerySection } from "@/components/sections/GallerySection";
import { AudioAmbienceEngine } from "@/components/ui/AudioToggle";
import { SmoothScrollProvider } from "@/components/ui/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";

// Dynamically split below-the-fold distant sections to lighten initial bundle
const SpecificationsSection = dynamic(
  () => import("@/components/sections/SpecificationsSection").then((m) => m.SpecificationsSection),
  { ssr: true }
);
const TestDriveSection = dynamic(
  () => import("@/components/sections/TestDriveSection").then((m) => m.TestDriveSection),
  { ssr: true }
);
const FinaleSection = dynamic(
  () => import("@/components/sections/FinaleSection").then((m) => m.FinaleSection),
  { ssr: true }
);
const Footer = dynamic(
  () => import("@/components/footer/Footer").then((m) => m.Footer),
  { ssr: true }
);

export default function HomePage() {
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const unlockedRef = useRef(false);

  const unlockScroll = useCallback(() => {
    if (unlockedRef.current) return;
    unlockedRef.current = true;

    if (typeof window !== "undefined") {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // 1. Temporarily hold scroll until initial hero frame 0 is rendered (<500ms target)
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }

    const preventScroll = (e: Event) => {
      if (!unlockedRef.current) {
        e.preventDefault();
      }
    };

    const preventKeys = (e: KeyboardEvent) => {
      if (!unlockedRef.current && ["Space", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(e.code)) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventKeys);

    // Exactly 2 seconds branded welcome screen (displays Škoda logo & typography)
    const splashTimer = setTimeout(() => {
      unlockScroll();
    }, 2000);

    return () => {
      clearTimeout(splashTimer);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeys);
      if (typeof window !== "undefined") {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      }
    };
  }, [unlockScroll]);

  const handleToggleSound = () => {
    setIsMuted((prev) => !prev);
  };

  const handleOpenTestDrive = () => {
    const el = document.getElementById("test-drive");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <SmoothScrollProvider>
      <main className="min-h-screen bg-black text-[#F3F0E8] relative selection:bg-[#00A878] selection:text-black">
        {/* Custom Škoda Chrome Emblem Cursor (Desktop Only) */}
        <CustomCursor />

        {/* Phase 2: Brand Logo Welcome Screen (Fades smoothly as soon as hero frame 0 is ready) */}
        <LogoLoader isReady={isLoaded} />

        {/* Audio Ambience Engine */}
        <AudioAmbienceEngine isMuted={isMuted} />

        {/* Floating Navigation Header with Frosted Glass CTA */}
        <Navbar
          isMuted={isMuted}
          onToggleSound={handleToggleSound}
          onOpenTestDrive={handleOpenTestDrive}
        />

        {/* Section 1: Hero Dual Scroll Video Reveal (frames_intro & frames) */}
        <CinematicReveal />

        {/* Section 2: Exterior Form & Design Reveal */}
        <DesignSection />

        {/* Section 2.5: Precision Parts & Component Engineering Scroll Video */}
        <PartsSection />

        <ExteriorSection />

        {/* Section 3: Interior Sanctuary & Comfort */}
        <InteriorSection />

        {/* Section 4: Colourway Scroll-Animated Video Showcase */}
        <ColorConfigurator />

        {/* Section 5: Interactive Category Feature Explorer */}
        <FeatureExplorer />

        {/* Section 6: Automotive Gallery */}
        <GallerySection />

        {/* Section 7: Verified Technical Telemetry */}
        <SpecificationsSection />

        {/* Section 8: Book a Test Drive Lead Form */}
        <TestDriveSection />

        {/* Section 9: Finale & Campaign Call to Action */}
        <FinaleSection onOpenTestDrive={handleOpenTestDrive} />

        {/* Footer */}
        <Footer />
      </main>
    </SmoothScrollProvider>
  );
}
