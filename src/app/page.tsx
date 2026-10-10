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
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      if (current >= 100) {
        setLoadProgress(100);
        setIsLoaded(true);
        clearInterval(interval);
      } else {
        setLoadProgress(current);
      }
    }, 100);

    return () => clearInterval(interval);
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

        {/* Phase 2: Brand Logo Loading Screen */}
        <LogoLoader progress={loadProgress} isReady={isLoaded} />

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
