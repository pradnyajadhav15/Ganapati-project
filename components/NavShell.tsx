"use client";

import { useEffect, useState } from "react";

/**
 * Sticky header shell that condenses and gains elevation once the page
 * is scrolled, and paints a thin gold reading-progress rule underneath.
 */
export default function NavShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      data-scrolled={scrolled ? "true" : "false"}
      className={
        "sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-500 " +
        (scrolled
          ? "glass border-line shadow-lux"
          : "border-transparent bg-cream/80 backdrop-blur-md")
      }
    >
      {children}
      <div className="absolute inset-x-0 bottom-0 h-[2px] overflow-hidden">
        <div
          className="h-full origin-left bg-gold-sheen transition-transform duration-150 ease-out"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </nav>
  );
}
