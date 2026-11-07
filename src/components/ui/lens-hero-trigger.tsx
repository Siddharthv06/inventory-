"use client";

import { useLiquidGlass } from "./liquid-glass";
import { Sparkles } from "lucide-react";

export function LensHeroTrigger() {
  const { showLens, setShowLens } = useLiquidGlass();

  return (
    <button
      onClick={() => setShowLens(!showLens)}
      className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${
        showLens
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400/40"
          : "liquid-glass text-blue-700 dark:text-blue-300 border border-blue-400/50 hover:bg-white/90 dark:hover:bg-slate-800/90 shadow-sm"
      }`}
      title="Toggle interactive draggable liquid glass lens"
    >
      <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" />
      <span>{showLens ? "Active: Draggable Glass Lens" : "🔮 Test Liquid Glass Lens (Draggable)"}</span>
    </button>
  );
}

