"use client";

import { useEffect } from "react";

/**
 * Native, resilient smooth scrolling without external library desync.
 * Uses native CSS scroll-behavior: smooth for 100% reliable full-page scrolling.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return <>{children}</>;
}
