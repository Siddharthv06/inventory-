"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  GlassPhysicsConfig,
  DEFAULT_GLASS_CONFIG,
  generateDisplacementMapDataUrl,
} from "@/lib/liquid-glass/physics";
import { PREBAKED_DISPLACEMENT_MAP_DATA_URL } from "@/lib/liquid-glass/prebaked-map";

interface LiquidGlassContextType {
  config: GlassPhysicsConfig;
  updateConfig: (patch: Partial<GlassPhysicsConfig>) => void;
  resetConfig: () => void;
  displacementDataUrl: string;
  maxDisplacement: number;
  filterId: string;
  isSupported: boolean;
  showLens: boolean;
  setShowLens: (show: boolean) => void;
  enable3DTilt: boolean;
  setEnable3DTilt: (enable: boolean) => void;
  waveTimestamp: number;
  triggerWave: () => void;
}

const LiquidGlassContext = createContext<LiquidGlassContextType | null>(null);

export function LiquidGlassProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<GlassPhysicsConfig>(DEFAULT_GLASS_CONFIG);
  const [displacementDataUrl, setDisplacementDataUrl] = useState<string>(
    PREBAKED_DISPLACEMENT_MAP_DATA_URL
  );
  const [maxDisplacement, setMaxDisplacement] = useState<number>(14);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [showLens, setShowLens] = useState<boolean>(false);
  const [enable3DTilt, setEnable3DTilt] = useState<boolean>(true);
  const [waveTimestamp, setWaveTimestamp] = useState<number>(0);

  const filterId = "innovexa-liquid-glass-filter";

  useEffect(() => {
    // Check if browser is Chromium / supports SVG backdrop-filter
    const isChromium =
      typeof window !== "undefined" &&
      !!(window as unknown as { chrome?: unknown }).chrome;
    setIsSupported(isChromium);

    // Generate displacement map on client mount or config change
    try {
      const { dataUrl, maxDisplacement: disp } = generateDisplacementMapDataUrl(
        128,
        config,
        "rect"
      );
      setDisplacementDataUrl(dataUrl);
      setMaxDisplacement(disp);
    } catch {
      // Safe fallback
    }
  }, [config]);

  const updateConfig = useCallback((patch: Partial<GlassPhysicsConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_GLASS_CONFIG);
  }, []);

  const triggerWave = useCallback(() => {
    setWaveTimestamp(Date.now());
  }, []);

  const value = useMemo(
    () => ({
      config,
      updateConfig,
      resetConfig,
      displacementDataUrl,
      maxDisplacement,
      filterId,
      isSupported,
      showLens,
      setShowLens,
      enable3DTilt,
      setEnable3DTilt,
      waveTimestamp,
      triggerWave,
    }),
    [
      config,
      updateConfig,
      resetConfig,
      displacementDataUrl,
      maxDisplacement,
      filterId,
      isSupported,
      showLens,
      enable3DTilt,
      waveTimestamp,
      triggerWave,
    ]
  );

  return (
    <LiquidGlassContext.Provider value={value}>
      {/* SVG Displacement Filter Element according to Snell's Law */}
      {displacementDataUrl && (
        <svg
          aria-hidden="true"
          className="pointer-events-none fixed -top-full -left-full w-0 h-0 overflow-hidden"
          style={{ position: "absolute", width: 0, height: 0 }}
        >
          <defs>
            <filter
              id={filterId}
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              filterUnits="objectBoundingBox"
              primitiveUnits="userSpaceOnUse"
            >
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
          </defs>
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
      maxDisplacement: 14,
      filterId: "innovexa-liquid-glass-filter",
      isSupported: false,
      showLens: false,
      setShowLens: () => {},
      enable3DTilt: true,
      setEnable3DTilt: () => {},
      waveTimestamp: 0,
      triggerWave: () => {},
    };
  }
  return context;
}

interface LiquidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  intensity?: "subtle" | "medium" | "vivid";
  elevated?: boolean;
  interactive?: boolean;
  glassConfig?: Record<string, unknown>;
}

/**
 * Liquid Glass Card Component
 * Combines:
 * 1. Apple WWDC 2025 Snell's Law SVG displacement refraction
 * 2. Real-time 3D spring-damper cursor tilt
 * 3. Dynamic Blinn-Phong specular light caustic tracking
 * 4. Prismatic chromatic dispersion rim
 * 5. Interactive fluid liquid click ripples
 */
export function LiquidGlassCard({
  children,
  className = "",
  intensity = "medium",
  elevated = true,
  interactive = true,
  glassConfig,
  style,
  onMouseMove,
  onMouseLeave,
  onClick,
  ...props
}: LiquidGlassCardProps) {
  const { filterId, isSupported, enable3DTilt, waveTimestamp } = useLiquidGlass();
  const cardRef = useRef<HTMLDivElement>(null);
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const [isWaving, setIsWaving] = useState(false);

  // Listen for global fluid wave pulses
  useEffect(() => {
    if (waveTimestamp === 0) return;
    setIsWaving(true);
    const t = setTimeout(() => setIsWaving(false), 1200);
    return () => clearTimeout(t);
  }, [waveTimestamp]);

  const intensityStyles = {
    subtle: "bg-white/20 dark:bg-[#0F172A]/25",
    medium: "bg-white/28 dark:bg-[#0F172A]/35",
    vivid: "bg-white/45 dark:bg-[#0B1120]/50",
  }[intensity];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalised position from center (-1 to 1)
    const nx = (x / rect.width) * 2 - 1;
    const ny = (y / rect.height) * 2 - 1;

    // Angle of light from cursor
    const angleRad = Math.atan2(ny, nx);
    const angleDeg = (angleRad * 180) / Math.PI;

    el.style.setProperty("--mouse-x", `${x}px`);
    el.style.setProperty("--mouse-y", `${y}px`);
    el.style.setProperty("--tilt-x", `${nx}`);
    el.style.setProperty("--tilt-y", `${ny}`);
    el.style.setProperty("--light-angle", `${angleDeg}deg`);

    if (interactive && enable3DTilt) {
      // 3D Gyro Perspective Rotation
      const maxRot = 6.5; // degrees
      const rotX = -ny * maxRot;
      const rotY = nx * maxRot;
      el.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(4px) scale3d(1.01, 1.01, 1.01)`;
    }

    onMouseMove?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (el) {
      el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)";
    }
    onMouseLeave?.(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setRipple({ x, y, id: Date.now() });
    }
    onClick?.(e);
  };

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
    button: true,
    ...glassConfig,
  });

  return (
    <div
      ref={cardRef}
      data-config={configJson}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`liquid-glass-item liquid-glass-card relative rounded-2xl ${intensityStyles} ${
        elevated
          ? "shadow-lg shadow-slate-900/5 dark:shadow-black/30 hover:shadow-2xl hover:shadow-blue-500/10"
          : ""
      } border border-white/70 dark:border-white/12 transition-[transform,box-shadow,border-color] duration-200 ease-out ${
        isWaving ? "animate-pulse ring-2 ring-blue-400/40" : ""
      } ${className}`}
      style={{
        backdropFilter: isSupported
          ? `url(#${filterId}) blur(8px) saturate(220%) contrast(108%)`
          : "blur(8px) saturate(220%) contrast(108%)",
        WebkitBackdropFilter: isSupported
          ? `url(#${filterId}) blur(8px) saturate(220%) contrast(108%)`
          : "blur(8px) saturate(220%) contrast(108%)",
        boxShadow:
          "inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.05), 0 20px 45px -12px rgba(15, 23, 42, 0.10)",
        transformStyle: "preserve-3d",
        ...style,
      }}
      {...props}
    >
      {/* Specular Rim Light Overlay (Physical edge refraction reflection) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-75 dark:opacity-35 mix-blend-overlay"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.08) 35%, rgba(0,0,0,0.03) 100%)",
        }}
      />

      {/* Prismatic Chromatic Dispersion Edge Sheen */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-40 dark:opacity-20 transition-opacity duration-300"
        style={{
          background:
            "conic-gradient(from var(--light-angle, 45deg) at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,100,100,0.12), rgba(100,255,150,0.12), rgba(100,150,255,0.15), rgba(255,100,100,0.12))",
          maskImage: "radial-gradient(circle at center, transparent 70%, black 100%)",
          WebkitMaskImage: "radial-gradient(circle at center, transparent 70%, black 100%)",
        }}
      />

      {/* Interactive Fluid Ripple on Click */}
      {ripple && (
        <span
          key={ripple.id}
          className="pointer-events-none absolute rounded-full border border-blue-400/40 bg-white/20 dark:bg-white/10 animate-ping"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
            width: 50,
            height: 50,
            animationDuration: "0.85s",
          }}
          onAnimationEnd={() => setRipple(null)}
        />
      )}

      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
