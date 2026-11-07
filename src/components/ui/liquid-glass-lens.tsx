"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLiquidGlass } from "./liquid-glass";
import { X, Move, ZoomIn, ZoomOut, Sparkles } from "lucide-react";

export function LiquidGlassLens() {
  const { showLens, setShowLens, config, updateConfig } = useLiquidGlass();
  const [position, setPosition] = useState({ x: 280, y: 160 });
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1.3);
  const dragStartRef = useRef({ startX: 0, startY: 0, origX: 0, origY: 0 });
  const lensRef = useRef<HTMLDivElement>(null);

  // Position lens in view on initial display
  useEffect(() => {
    if (typeof window !== "undefined") {
      const initialX = Math.max(40, Math.min(window.innerWidth - 380, window.innerWidth / 2 - 170));
      const initialY = Math.max(100, Math.min(window.innerHeight - 300, 180));
      setPosition({ x: initialX, y: initialY });
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag from handle or card header
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: position.x,
      origY: position.y,
    };
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    setPosition({
      x: Math.max(10, Math.min(window.innerWidth - 350, dragStartRef.current.origX + dx)),
      y: Math.max(10, Math.min(window.innerHeight - 250, dragStartRef.current.origY + dy)),
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe catch
      }
    }
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.max(1.0, Math.min(2.2, +(prev + delta).toFixed(2))));
  };

  if (!showLens) return null;

  return (
    <div
      ref={lensRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: isDragging ? "scale(1.03)" : "scale(1)",
        cursor: isDragging ? "grabbing" : "grab",
        backdropFilter: "blur(4px) saturate(220%) contrast(110%)",
        WebkitBackdropFilter: "blur(4px) saturate(220%) contrast(110%)",
        boxShadow:
          "inset 0 2px 2px rgba(255,255,255,0.9), inset 0 -2px 3px rgba(0,0,0,0.1), 0 25px 60px -15px rgba(0,0,0,0.35)",
      }}
      className="fixed z-50 w-84 select-none rounded-3xl border-2 border-white/80 bg-white/20 p-4 text-slate-800 shadow-2xl transition-transform duration-150 touch-none dark:border-white/25 dark:bg-[#0F172A]/30 dark:text-slate-100"
    >
      {/* Specular Glint Top Rim */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.15) 30%, transparent 60%)",
        }}
      />

      {/* Chromatic Prism Border Ring */}
      <div
        className="pointer-events-none absolute -inset-0.5 rounded-3xl opacity-60"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, rgba(255,0,128,0.3), rgba(0,255,200,0.3), rgba(0,100,255,0.3), rgba(255,0,128,0.3))",
          maskImage: "radial-gradient(circle at center, transparent 72%, black 100%)",
          WebkitMaskImage: "radial-gradient(circle at center, transparent 72%, black 100%)",
        }}
      />

      {/* Lens Header / Drag Handle */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/40 pb-2.5 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600/20 text-blue-600 dark:bg-blue-400/20 dark:text-blue-400">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
              Liquid Glass Lens
              <span className="rounded bg-blue-500/20 px-1 py-0.2 text-[10px] font-mono text-blue-600 dark:text-blue-300">
                {zoom}x
              </span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              Drag over page to refract
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1" onPointerDown={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleZoom(-0.15)}
            className="rounded-lg p-1 text-slate-500 hover:bg-white/40 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
            title="Decrease zoom"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleZoom(0.15)}
            className="rounded-lg p-1 text-slate-500 hover:bg-white/40 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
            title="Increase zoom"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setShowLens(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-red-500/20 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
            title="Close lens"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Optical Refraction Viewing Zone */}
      <div className="relative z-10 mt-3 flex flex-col items-center justify-center py-4 text-center">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300">
          <span>n₁ (air) = 1.00</span>
          <span>→</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">
            n₂ = {config.refractiveIndex.toFixed(2)}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          Profile: {config.surfaceType} • Bezel: {config.bezelWidth}px
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-300">
          <Move className="h-3 w-3 animate-pulse" />
          <span>Move cursor or drag to bend rays</span>
        </div>
      </div>

      {/* Physics Profile Quick Switcher */}
      <div
        className="relative z-10 mt-2 flex items-center justify-between gap-1 rounded-xl bg-white/40 p-1 text-xs dark:bg-black/30"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => updateConfig({ refractiveIndex: 1.33 })}
          className={`flex-1 rounded-lg py-1 text-[11px] font-medium transition-all ${
            config.refractiveIndex === 1.33
              ? "bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-300"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
          }`}
        >
          Water 1.33
        </button>
        <button
          onClick={() => updateConfig({ refractiveIndex: 1.52 })}
          className={`flex-1 rounded-lg py-1 text-[11px] font-medium transition-all ${
            config.refractiveIndex === 1.52
              ? "bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-300"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
          }`}
        >
          Glass 1.52
        </button>
        <button
          onClick={() => updateConfig({ refractiveIndex: 2.42 })}
          className={`flex-1 rounded-lg py-1 text-[11px] font-medium transition-all ${
            config.refractiveIndex === 2.42
              ? "bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-300"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
          }`}
        >
          Diamond 2.42
        </button>
      </div>
    </div>
  );
}
