"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Back-to-top control. Appears after the visitor has scrolled past the hero,
 * and scrolls smoothly unless reduced motion is requested.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 560;
      setVisible((current) => (current === next ? current : next));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "fixed right-4 bottom-24 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full",
        "border border-border bg-background/90 text-foreground shadow-[0_12px_30px_-12px_rgba(8,8,8,0.45)]",
        "backdrop-blur-md transition-[opacity,transform,border-color,color] duration-300",
        "hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
        "sm:right-6",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 13V3M3.5 7.5L8 3l4.5 4.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
