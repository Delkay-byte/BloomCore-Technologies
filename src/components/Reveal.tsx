"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/**
 * Restrained entrance animation for content that scrolls into view.
 *
 * Content is visible in the markup and stays visible if JavaScript, the
 * IntersectionObserver or the Web Animations API is unavailable. The animation
 * plays from a hidden keyframe only at the moment the element enters the
 * viewport, so nothing on the page can get stuck at opacity zero.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          if (typeof element.animate !== "function") return;
          element.animate(
            [
              { opacity: 0, transform: `translateY(${y}px)` },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: 520,
              delay: delay * 1000,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "backwards",
            },
          );
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
