"use client";

import React, { useState } from "react";
import { useLiquidGlass } from "./liquid-glass";
import {
  Sliders,
  Sparkles,
  Waves,
  Eye,
  Compass,
  RotateCcw,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export function LiquidGlassControls() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    config,
    updateConfig,
    resetConfig,
    showLens,
    setShowLens,
    enable3DTilt,
    setEnable3DTilt,
    triggerWave,
    isSupported,
  } = useLiquidGlass();

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      {/* Expanded Control Panel */}
      {isOpen && (
        <div
          style={{
            backdropFilter: "blur(24px) saturate(200%) contrast(105%)",
            WebkitBackdropFilter: "blur(24px) saturate(200%) contrast(105%)",
            boxShadow:
              "inset 0 1.5px 1px rgba(255,255,255,0.85), inset 0 -1px 1px rgba(0,0,0,0.05), 0 20px 45px -10px rgba(0,0,0,0.3)",
          }}
          className="mb-3 w-80 rounded-3xl border border-white/70 bg-white/55 p-4 text-slate-800 shadow-2xl transition-all duration-300 dark:border-white/15 dark:bg-[#0F172A]/70 dark:text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/40 pb-2.5 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600/20 text-blue-600 dark:bg-blue-400/20 dark:text-blue-400">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <h4 className="text-xs font-semibold tracking-wide uppercase">
                Liquid Glass Lab
              </h4>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={resetConfig}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/40 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                title="Reset to defaults"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/40 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                title="Collapse"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Engine Status */}
          <div className="mt-2.5 flex items-center justify-between rounded-xl bg-blue-50/60 px-2.5 py-1.5 text-[11px] text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
            <span>Snell&apos;s Law Engine</span>
            <span className="font-mono font-semibold">
              {isSupported ? "Chrome SVG Refraction: ON" : "CSS Backdrop Active"}
            </span>
          </div>

          <div className="mt-3 space-y-3 text-xs">
            {/* Refractive Index (n) */}
            <div>
              <div className="flex items-center justify-between font-medium">
                <span>Refractive Index (n₂)</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {config.refractiveIndex.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.42"
                step="0.02"
                value={config.refractiveIndex}
                onChange={(e) => updateConfig({ refractiveIndex: parseFloat(e.target.value) })}
                className="mt-1.5 w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1.0 Air</span>
                <span>1.33 Water</span>
                <span>1.52 Glass</span>
                <span>2.42 Diamond</span>
              </div>
            </div>

            {/* Surface Function Profile */}
            <div>
              <div className="font-medium">Surface Curvature Profile</div>
              <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-xl bg-white/40 p-1 dark:bg-black/30">
                {(["squircle", "circle", "lip"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => updateConfig({ surfaceType: type })}
                    className={`rounded-lg py-1 text-[11px] font-medium capitalize transition-all ${
                      config.surfaceType === type
                        ? "bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-300"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Bezel Width */}
            <div>
              <div className="flex items-center justify-between font-medium">
                <span>Bezel Width</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {config.bezelWidth}px
                </span>
              </div>
              <input
                type="range"
                min="8"
                max="32"
                step="1"
                value={config.bezelWidth}
                onChange={(e) => updateConfig({ bezelWidth: parseInt(e.target.value, 10) })}
                className="mt-1.5 w-full accent-blue-600"
              />
            </div>

            {/* Glass Thickness */}
            <div>
              <div className="flex items-center justify-between font-medium">
                <span>Glass Thickness</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {config.glassThickness}px
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="28"
                step="1"
                value={config.glassThickness}
                onChange={(e) => updateConfig({ glassThickness: parseInt(e.target.value, 10) })}
                className="mt-1.5 w-full accent-blue-600"
              />
            </div>

            {/* Action Toggles */}
            <div className="space-y-1.5 pt-2 border-t border-white/40 dark:border-white/10">
              <button
                onClick={triggerWave}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-blue-700 active:scale-98 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <Waves className="h-3.5 w-3.5" />
                <span>Pulse Fluid Wave</span>
              </button>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setShowLens(!showLens)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-1.5 text-[11px] font-medium transition-all ${
                    showLens
                      ? "border-blue-500 bg-blue-500/15 text-blue-700 dark:text-blue-300"
                      : "border-slate-300 bg-white/40 text-slate-700 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  }`}
                >
                  <Eye className="h-3 w-3" />
                  <span>{showLens ? "Hide Lens" : "Show Lens"}</span>
                </button>

                <button
                  onClick={() => setEnable3DTilt(!enable3DTilt)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-1.5 text-[11px] font-medium transition-all ${
                    enable3DTilt
                      ? "border-blue-500 bg-blue-500/15 text-blue-700 dark:text-blue-300"
                      : "border-slate-300 bg-white/40 text-slate-700 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  }`}
                >
                  <Compass className="h-3 w-3" />
                  <span>3D Tilt: {enable3DTilt ? "ON" : "OFF"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            backdropFilter: "blur(20px) saturate(200%) contrast(105%)",
            WebkitBackdropFilter: "blur(20px) saturate(200%) contrast(105%)",
            boxShadow:
              "inset 0 1.5px 1px rgba(255,255,255,0.85), inset 0 -1px 1px rgba(0,0,0,0.05), 0 12px 30px -8px rgba(37,99,235,0.25)",
          }}
          className="group flex items-center gap-2 rounded-full border border-white/80 bg-white/60 px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/80 dark:border-white/20 dark:bg-[#0F172A]/70 dark:text-white"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition-transform duration-300 group-hover:rotate-45">
            <Sliders className="h-3 w-3" />
          </div>
          <span>Liquid Glass Lab</span>
          <ChevronUp className="h-3.5 w-3.5 text-slate-400 group-hover:translate-y--0.5" />
        </button>
      )}
    </div>
  );
}
