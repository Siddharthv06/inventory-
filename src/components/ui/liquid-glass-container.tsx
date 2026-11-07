"use client";

import React, { useEffect, useRef } from "react";
import { initLiquidGlass, GlassConfig } from "@/lib/liquid-glass/ybouane";

interface LiquidGlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  config?: Partial<GlassConfig>;
}

/**
 * LiquidGlassContainer orchestrates @ybouane/liquidglass WebGL shader rendering
 * across its direct glass card children.
 */
export function LiquidGlassContainer({
  children,
  className = "",
  config,
  ...props
}: LiquidGlassContainerProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let instance: { destroy: () => void } | null = null;
    let isCancelled = false;

    // Short debounce ensures Next.js SSR hydration and layout settles before capturing canvases
    const timer = setTimeout(async () => {
      if (!rootRef.current || isCancelled) return;

      instance = await initLiquidGlass({
        root: rootRef.current,
        defaults: {
          cornerRadius: 20,
          zRadius: 24,
          refraction: 0.72,
          blurAmount: 0.35,
          chromAberration: 0.08,
          edgeHighlight: 0.22,
          specular: 0.38,
          fresnel: 1.0,
          tintStrength: 0.08,
          shadowOpacity: 0.25,
          ...config,
        },
      });
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      try {
        instance?.destroy();
      } catch {
        // Safe cleanup
      }
    };
  }, [config]);

  return (
    <div ref={rootRef} className={`relative ${className}`} {...props}>
      {children}
    </div>
  );
}
