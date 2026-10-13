"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only activate custom cursor on desktop devices with fine pointer (mouse/trackpad)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let isVisible = false;
    let isRunning = false;
    let rafId: number | null = null;

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(updatePosition);
      }
    };

    const updatePosition = () => {
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      currentX += dx * 0.35;
      currentY += dy * 0.35;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX - 24}px, ${currentY - 24}px, 0)`;
      }

      // If settled close enough, pause RAF loop to conserve CPU/battery
      if (Math.abs(dx) < 0.15 && Math.abs(dy) < 0.15) {
        isRunning = false;
        rafId = null;
      } else {
        rafId = requestAnimationFrame(updatePosition);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        if (cursorRef.current) cursorRef.current.style.opacity = "1";
      }

      startLoop();
    };

    const onMouseLeave = () => {
      isVisible = false;
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
    };

    const onMouseEnter = () => {
      isVisible = true;
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
      startLoop();
    };

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList?.contains("interactive")
      ) {
        if (iconRef.current) {
          iconRef.current.style.transform = "scale(1.25) rotate(6deg)";
        }
      }
    };

    const handleHoverEnd = () => {
      if (iconRef.current) {
        iconRef.current.style.transform = "scale(1) rotate(0deg)";
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseover", handleHoverStart, { passive: true });
    document.addEventListener("mouseout", handleHoverEnd, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseover", handleHoverStart);
      document.removeEventListener("mouseout", handleHoverEnd);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[99999] pointer-events-none opacity-0 transition-opacity duration-200"
      style={{ willChange: "transform" }}
    >
      <div
        ref={iconRef}
        className="relative w-12 h-12 transition-transform duration-200 ease-out pointer-events-none"
      >
        <Image
          src="/skoda-cursor.png"
          alt="Škoda Chrome Emblem Main Cursor"
          width={48}
          height={48}
          priority
          className="object-contain w-full h-full pointer-events-none"
        />
      </div>
    </div>
  );
};
