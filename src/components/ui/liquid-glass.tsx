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
  const [maxDisplacement, setMaxDisplacement] = useState<number>(8);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const filterId = "liquid-glass-refraction-filter";

  useEffect(() => {
    const isChromium =
      typeof window !== "undefined" &&
      !!(window as unknown as { chrome?: unknown }).chrome;
    setIsSupported(isChromium);

    try {
      const { dataUrl, maxDisplacement: disp } = generateDisplacementMapDataUrl(128, config);
      setDisplacementDataUrl(dataUrl);
      setMaxDisplacement(disp);
    } catch {
      // Graceful fallback
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
    [config, displacementDataUrl, maxDisplacement, filterId, isSupported]
  );

  return (
    <LiquidGlassContext.Provider value={value}>
      {/* SVG Displacement Map Filter Definition */}
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
              result="displacement_map"
              preserveAspectRatio="none"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="displacement_map"
              scale={maxDisplacement}
              xChannelSelector="R"
              yChannelSelector="G"
            />
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
      maxDisplacement: 8,
      filterId: "liquid-glass-refraction-filter",
      isSupported: true,
    };
  }
  return context;
}

interface LiquidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  intensity?: "subtle" | "medium" | "vivid";
  elevated?: boolean;
}

/**
 * Liquid Glass Container Component
 * Recreates the Apple WWDC 2025 Liquid Glass material:
 * 1. Deep frosted optical refraction: backdrop-filter blur(24px) saturate(200%)
 * 2. Translucent refractive substrate: rgba(255,255,255, 0.45) light / rgba(15,23,42, 0.60) dark
 * 3. 1px Top Specular Fresnel rim light: inset 0 1.5px 1px rgba(255,255,255,0.9)
 * 4. Ambient caustic light dispersion & outer depth shadow
 */
export function LiquidGlassCard({
  children,
  className = "",
  intensity = "medium",
  elevated = true,
  style,
  ...props
}: LiquidGlassCardProps) {
  const intensityBg = {
    subtle: "bg-white/40 dark:bg-[#0F172A]/40",
    medium: "bg-white/55 dark:bg-[#0F172A]/60",
    vivid: "bg-white/70 dark:bg-[#0B1120]/75",
  }[intensity];

  return (
    <div
      className={`relative rounded-2xl transition-all duration-300 ${intensityBg} border border-white/60 dark:border-white/10 ${
        elevated ? "hover:-translate-y-0.5 hover:shadow-2xl" : ""
      } ${className}`}
      style={{
        backdropFilter: "blur(24px) saturate(200%) contrast(104%)",
        WebkitBackdropFilter: "blur(24px) saturate(200%) contrast(104%)",
        boxShadow:
          "inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1.5px 1px 0 rgba(0, 0, 0, 0.04), 0 20px 45px -12px rgba(15, 23, 42, 0.08)",
        ...style,
      }}
      {...props}
    >
      {/* 45-degree Specular Sheen (Curved glass light catch) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-60 dark:opacity-20"
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.05) 40%, rgba(0, 0, 0, 0) 100%)",
        }}
      />
      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
