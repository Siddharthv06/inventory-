"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  GlassPhysicsConfig,
  DEFAULT_GLASS_CONFIG,
  generateDisplacementMapDataUrl,
} from "@/lib/liquid-glass/physics";

interface LiquidGlassContextType {
  config: GlassPhysicsConfig;
  updateConfig: (patch: Partial<GlassPhysicsConfig>) => void;
  resetConfig: () => void;
  displacementDataUrl: string;
  maxDisplacement: number;
  filterId: string;
  isSupported: boolean;
}

const LiquidGlassContext = createContext<LiquidGlassContextType | null>(null);

export function LiquidGlassProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<GlassPhysicsConfig>(DEFAULT_GLASS_CONFIG);
  const [displacementDataUrl, setDisplacementDataUrl] = useState<string>("");
  const [maxDisplacement, setMaxDisplacement] = useState<number>(10);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const filterId = "innovexa-liquid-glass-filter";

  useEffect(() => {
    // Check if browser is Chromium / supports SVG backdrop-filter
    const isChromium =
      typeof window !== "undefined" &&
      !!(window as unknown as { chrome?: unknown }).chrome;
    setIsSupported(isChromium);

    // Generate displacement map on client mount or config change
    try {
      const { dataUrl, maxDisplacement: disp } = generateDisplacementMapDataUrl(128, config);
      setDisplacementDataUrl(dataUrl);
      setMaxDisplacement(disp);
    } catch {
      // Fallback
    }
  }, [config]);

  const updateConfig = (patch: Partial<GlassPhysicsConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_GLASS_CONFIG);
  };

  const value = useMemo(
    () => ({
      config,
      updateConfig,
      resetConfig,
      displacementDataUrl,
      maxDisplacement,
      filterId,
      isSupported,
    }),
    [config, displacementDataUrl, maxDisplacement, isSupported]
  );

  return (
    <LiquidGlassContext.Provider value={value}>
      {/* SVG Displacement Filter Element */}
      {displacementDataUrl && (
        <svg
          aria-hidden="true"
          className="pointer-events-none fixed -top-full -left-full w-0 h-0 overflow-hidden"
          style={{ position: "absolute", width: 0, height: 0 }}
        >
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feImage
              href={displacementDataUrl}
              x="0"
              y="0"
              width="100%"
              height="100%"
              result="disp_map"
              preserveAspectRatio="none"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="disp_map"
              scale={maxDisplacement}
              xChannelSelector="R"
              yChannelSelector="G"
              result="refracted"
            />
            <feBlend in="SourceGraphic" in2="refracted" mode="normal" />
          </filter>
        </svg>
      )}
      {children}
    </LiquidGlassContext.Provider>
  );
}

export function useLiquidGlass() {
  const context = useContext(LiquidGlassContext);
  if (!context) {
    return {
      config: DEFAULT_GLASS_CONFIG,
      updateConfig: () => {},
      resetConfig: () => {},
      displacementDataUrl: "",
      maxDisplacement: 10,
      filterId: "innovexa-liquid-glass-filter",
      isSupported: false,
    };
  }
  return context;
}

interface LiquidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  intensity?: "subtle" | "medium" | "vivid";
  elevated?: boolean;
  glassConfig?: Record<string, unknown>;
}

/**
 * Liquid Glass Card Component
 * Uses @ybouane/liquidglass WebGL shader configuration combined with
 * specular rim reflections and frosted glass substrate.
 */
export function LiquidGlassCard({
  children,
  className = "",
  intensity = "medium",
  elevated = true,
  glassConfig,
  style,
  ...props
}: LiquidGlassCardProps) {
  const intensityStyles = {
    subtle: "bg-white/45 dark:bg-[#0F172A]/45",
    medium: "bg-white/55 dark:bg-[#0F172A]/60",
    vivid: "bg-white/70 dark:bg-[#0B1120]/75",
  }[intensity];

  const configJson = JSON.stringify({
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
    ...glassConfig,
  });

  return (
    <div
      data-config={configJson}
      className={`liquid-glass-item liquid-glass-card relative rounded-2xl transition-all duration-300 ${intensityStyles} ${
        elevated ? "shadow-lg shadow-slate-900/5 dark:shadow-black/30 hover:-translate-y-0.5 hover:shadow-2xl" : ""
      } border border-white/70 dark:border-white/12 ${className}`}
      style={{
        backdropFilter: "blur(24px) saturate(200%) contrast(104%)",
        WebkitBackdropFilter: "blur(24px) saturate(200%) contrast(104%)",
        boxShadow:
          "inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.85), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.04), 0 20px 45px -12px rgba(15, 23, 42, 0.08)",
        ...style,
      }}
      {...props}
    >
      {/* Specular Rim Light Overlay (Physical edge refraction reflection) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-70 dark:opacity-30 mix-blend-overlay"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.05) 35%, rgba(0,0,0,0.03) 100%)",
        }}
      />
      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

