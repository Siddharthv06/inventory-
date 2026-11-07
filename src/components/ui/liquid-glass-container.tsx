"use client";

import React, { useEffect, useRef } from "react";
import { initLiquidGlass, GlassConfig } from "@/lib/liquid-glass/ybouane";

interface LiquidGlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  config?: Partial<GlassConfig>;
  hasAmbientMesh?: boolean;
}

/**
 * LiquidGlassContainer orchestrates @ybouane/liquidglass WebGL shader rendering
 * across its direct glass card children. It embeds an optical backdrop canvas so
 * the shader always has rich colors to refract through the glass.
 */
export function LiquidGlassContainer({
  children,
  className = "",
  config,
  hasAmbientMesh = true,
  ...props
}: LiquidGlassContainerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!hasAmbientMesh) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = (canvas.width = canvas.offsetWidth || 800);
    const h = (canvas.height = canvas.offsetHeight || 600);

    // Draw chromatic mesh gradient for WebGL shader refraction sampling
    const g1 = ctx.createRadialGradient(w * 0.2, h * 0.3, 10, w * 0.2, h * 0.3, w * 0.6);
    g1.addColorStop(0, "rgba(59, 130, 246, 0.45)");
    g1.addColorStop(0.5, "rgba(14, 165, 233, 0.25)");
    g1.addColorStop(1, "rgba(59, 130, 246, 0)");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, w, h);

    const g2 = ctx.createRadialGradient(w * 0.8, h * 0.6, 10, w * 0.8, h * 0.6, w * 0.6);
    g2.addColorStop(0, "rgba(139, 92, 246, 0.40)");
    g2.addColorStop(0.5, "rgba(168, 85, 247, 0.20)");
    g2.addColorStop(1, "rgba(139, 92, 246, 0)");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, w, h);

    const g3 = ctx.createRadialGradient(w * 0.5, h * 0.9, 10, w * 0.5, h * 0.9, w * 0.5);
    g3.addColorStop(0, "rgba(6, 182, 212, 0.35)");
    g3.addColorStop(1, "rgba(6, 182, 212, 0)");
    ctx.fillStyle = g3;
    ctx.fillRect(0, 0, w, h);
  }, [hasAmbientMesh]);

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
      {hasAmbientMesh && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 -z-10 w-[calc(100%+2rem)] h-[calc(100%+2rem)] rounded-2xl opacity-60 dark:opacity-40"
        />
      )}
      {children}
    </div>
  );
}

