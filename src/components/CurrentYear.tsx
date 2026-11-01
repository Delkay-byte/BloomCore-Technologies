"use client";

import { useEffect, useRef } from "react";

/**
 * Copyright year, resolved in the browser so the value is always current
 * without blocking static prerendering. The attribute update is a DOM write,
 * not a state change, so it cannot cause a cascading render.
 */
export function CurrentYear({ fallback }: { fallback: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (node) node.textContent = String(new Date().getFullYear());
  }, []);

  return (
    <span ref={ref} suppressHydrationWarning>
      {fallback}
    </span>
  );
}
