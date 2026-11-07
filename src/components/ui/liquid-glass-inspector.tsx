"use client";

import { useState } from "react";
import { useLiquidGlass } from "./liquid-glass";
import {
  Sparkles,
  Sliders,
  RotateCcw,
  X,
  Info,
  ChevronDown,
  Check,
  Eye,
} from "lucide-react";
import { getSurfaceHeight, getSurfaceNormalAngle, calculateRefractionAngle } from "@/lib/liquid-glass/physics";

export function LiquidGlassInspectorModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { config, updateConfig, resetConfig, isSupported, maxDisplacement } = useLiquidGlass();

  // Calculate live optical parameters at edge sample point (x = 0.3)
  const sampleX = 0.3;
  const sampleHeight = getSurfaceHeight(sampleX, config.surfaceType) * config.glassThickness;
  const normalAngleRad = getSurfaceNormalAngle(sampleX, config.surfaceType);
  const normalAngleDeg = Math.round((normalAngleRad * 180) / Math.PI);
  const refrAngleRad = calculateRefractionAngle(normalAngleRad, config.refractiveIndex);
  const refrAngleDeg = refrAngleRad !== null ? Math.round((refrAngleRad * 180) / Math.PI) : "TIR";
  const criticalAngleDeg = Math.round((Math.asin(1 / config.refractiveIndex) * 180) / Math.PI);

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold text-slate-800 dark:text-slate-100 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700 shadow-xl shadow-blue-500/10 hover:scale-105 active:scale-95 transition-all group"
        title="Open Liquid Glass Physics Inspector"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        <Sparkles className="w-3.5 h-3.5 text-blue-500 group-hover:rotate-12 transition-transform" />
        <span className="tracking-tight">Liquid Glass Engine</span>
      </button>

      {/* Inspector Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-lg rounded-3xl bg-white/95 dark:bg-[#0D1527]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-slate-100 relative max-h-[90vh] overflow-y-auto"
            style={{
              boxShadow:
                "inset 0 1.5px 1px 0 rgba(255,255,255,0.7), 0 20px 40px -15px rgba(0,0,0,0.3)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Liquid Glass Physics Inspector</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Apple WWDC 2025 Refraction & Snell-Descartes Model
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={resetConfig}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1"
                  title="Reset to physical defaults"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Live Physics Metrics Box */}
            <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800/80 shadow-xs">
                <div className="text-[10px] text-slate-400 uppercase font-medium">Refraction θ₂</div>
                <div className="font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                  {refrAngleDeg}°
                </div>
                <div className="text-[9px] text-slate-400">from θ₁ = {normalAngleDeg}°</div>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800/80 shadow-xs">
                <div className="text-[10px] text-slate-400 uppercase font-medium">Critical θc</div>
                <div className="font-mono font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  {criticalAngleDeg}°
                </div>
                <div className="text-[9px] text-slate-400">TIR threshold</div>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800/80 shadow-xs">
                <div className="text-[10px] text-slate-400 uppercase font-medium">Max Shift</div>
                <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  ±{Math.round(maxDisplacement)}px
                </div>
                <div className="text-[9px] text-slate-400">SVG displacement</div>
              </div>
            </div>

            {/* Controls Form */}
            <div className="mt-5 space-y-4 text-xs">
              {/* Surface Profile Selection */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Glass Surface Profile
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["squircle", "circle", "lip"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => updateConfig({ surfaceType: type })}
                      className={`py-2 px-3 rounded-xl border text-center font-medium capitalize transition-all ${
                        config.surfaceType === type
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20"
                          : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {type === "squircle" ? "Squircle (Apple)" : type}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {config.surfaceType === "squircle"
                    ? "Apple's 4th-order convex squircle curve: smooth flat-to-curve transition eliminates optical boundary rings."
                    : config.surfaceType === "circle"
                    ? "Spherical arc: sharp derivative at bezel interior."
                    : "Lip: raised outer edge with concave center depression."}
                </p>
              </div>

              {/* Refractive Index (n) */}
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate-700 dark:text-slate-300">
                    Refractive Index (n₂):{" "}
                    <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">
                      {config.refractiveIndex.toFixed(2)}
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {config.refractiveIndex < 1.35
                      ? "Water (1.33)"
                      : config.refractiveIndex < 1.6
                      ? "Crown Glass (1.52)"
                      : "Flint Glass (1.65+)"}
                  </span>
                </div>
                <input
                  type="range"
                  min="1.05"
                  max="1.95"
                  step="0.01"
                  value={config.refractiveIndex}
                  onChange={(e) => updateConfig({ refractiveIndex: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Glass Bezel Width */}
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate-700 dark:text-slate-300">
                    Bezel Curvature Width:{" "}
                    <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">
                      {config.bezelWidth}px
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-400">Border radius lens zone</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="32"
                  step="1"
                  value={config.bezelWidth}
                  onChange={(e) => updateConfig({ bezelWidth: parseInt(e.target.value, 10) })}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Glass Thickness */}
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate-700 dark:text-slate-300">
                    Physical Slab Thickness:{" "}
                    <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">
                      {config.glassThickness}px
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-400">Increases lateral ray bend</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="28"
                  step="1"
                  value={config.glassThickness}
                  onChange={(e) => updateConfig({ glassThickness: parseInt(e.target.value, 10) })}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Specular Highlight Rim */}
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate-700 dark:text-slate-300">
                    Specular Rim Light Intensity:{" "}
                    <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">
                      {Math.round(config.specularIntensity * 100)}%
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-400">Fresnel reflection</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={config.specularIntensity}
                  onChange={(e) => updateConfig({ specularIntensity: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Browser Support Pill */}
            <div className="mt-5 p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/40 flex items-start gap-2.5 text-[11px] text-slate-600 dark:text-slate-300">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  {isSupported ? "Chromium SVG Backdrop Filter Active" : "CSS Liquid Glass Active"}
                </div>
                <div className="mt-0.5 text-slate-500 dark:text-slate-400">
                  {isSupported
                    ? "Full real-time Snell's law SVG displacement map refraction active on dashboard cards and topbar."
                    : "Rendering multi-layered specular highlight and caustic refraction fallback for seamless 60fps performance."}
                </div>
              </div>
            </div>

            {/* Done button */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="py-2 px-5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
