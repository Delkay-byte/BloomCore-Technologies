"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function ViewTracker({
  event,
  params = {},
}: {
  event: string;
  params?: Record<string, string>;
}) {
  useEffect(() => {
    trackEvent(event, params);
    // The event fires once per mount. Params are static for the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  return null;
}
