"use client";

import React, { useState, useEffect } from "react";
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
import { SpecificationsSection } from "@/components/sections/SpecificationsSection";
import { TestDriveSection } from "@/components/sections/TestDriveSection";
import { FinaleSection } from "@/components/sections/FinaleSection";
import { Footer } from "@/components/footer/Footer";
import { AudioAmbienceEngine } from "@/components/ui/AudioToggle";
import { SmoothScrollProvider } from "@/components/ui/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";

export default function HomePage() {
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Immediately lock scroll at top of page during 2-second splash screen
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }

    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    const preventKeys = (e: KeyboardEvent) => {
      if (
        [
          "Space",
          "ArrowUp",
          "ArrowDown",
          "PageUp",
          "PageDown",
          "Home",
          "End",
        ].includes(e.code)
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventKeys);

    // Stop Lenis if initialized
    const checkLenis = setInterval(() => {
      if ((window as any).lenis) {
        (window as any).lenis.stop();
        (window as any).lenis.scrollTo(0, { immediate: true });
      }
    }, 50);

    // 2. Exactly 2 seconds timer before unlocking scroll and revealing site
    const timer = setTimeout(() => {
      clearInterval(checkLenis);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeys);

      if (typeof window !== "undefined") {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        if ((window as any).lenis) {
          (window as any).lenis.start();
        }
      }

      setIsLoaded(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(checkLenis);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeys);

      if (typeof window !== "undefined") {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        if ((window as any).lenis) {
          (window as any).lenis.start();
        }
      }
    };
  }, []);

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
        {/* Custom Škoda Chrome Emblem Cursor */}
        <CustomCursor />

        {/* Phase 2: Brand Logo Welcome Screen (2 Seconds, No Loading Bar) */}
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

        {/* Section 4: Colourway Scroll-Animated Video Showcase (color_yellow_grey.mp4 & color_silver_red.mp4) */}
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
