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
}

/**
 * Liquid Glass Container Component
 * Combines physical refraction with specular rim highlights, inner bevel caustics,
 * and high-contrast dark/light mode readability.
 */
export function LiquidGlassCard({
  children,
  className = "",
  intensity = "medium",
  elevated = true,
  style,
  ...props
}: LiquidGlassCardProps) {
  const { filterId, isSupported } = useLiquidGlass();

  const intensityStyles = {
    subtle: "bg-white/60 dark:bg-slate-900/60 backdrop-blur-md",
    medium: "bg-white/75 dark:bg-[#0F172A]/75 backdrop-blur-xl",
    vivid: "bg-white/90 dark:bg-[#0B1120]/85 backdrop-blur-2xl",
  }[intensity];

  return (
    <div
      className={`relative rounded-2xl transition-all duration-300 ${intensityStyles} ${
        elevated ? "shadow-lg shadow-slate-900/5 dark:shadow-black/30" : ""
      } border border-white/60 dark:border-white/10 ${className}`}
      style={{
        // Real optical SVG displacement in Chromium, smooth fallback elsewhere
        backdropFilter: isSupported
          ? `url(#${filterId}) blur(16px) saturate(180%) contrast(102%)`
          : "blur(16px) saturate(180%) contrast(102%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        // Apple Liquid Glass Specular Rim Highlight (1px light reflection top-left)
        boxShadow:
          "inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.05), 0 8px 24px -4px rgba(15, 23, 42, 0.06)",
        ...style,
      }}
      {...props}
    >
      {/* Specular Rim Light Overlay (Physical edge refraction reflection) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-70 dark:opacity-30 mix-blend-overlay"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.05) 35%, rgba(0,0,0,0.03) 100%)",
        }}
      />
      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
