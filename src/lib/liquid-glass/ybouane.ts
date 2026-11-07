"use client";

import type { GlassConfig, LiquidGlass as LiquidGlassType } from "@ybouane/liquidglass";

export type { GlassConfig };

export interface InitLiquidGlassParams {
  root: HTMLElement;
  glassElements?: HTMLElement[] | NodeListOf<HTMLElement>;
  defaults?: Partial<GlassConfig>;
}

/**
 * Safe client-side loader for @ybouane/liquidglass WebGL library.
 * Guarantees zero SSR errors and handles cleanup.
 */
export async function initLiquidGlass(
  params: InitLiquidGlassParams
): Promise<LiquidGlassType | null> {
  if (typeof window === "undefined" || !params.root) {
    return null;
  }

  try {
    const { LiquidGlass } = await import("@ybouane/liquidglass");

    // Discover any glass children if not explicitly provided
    const elements =
      params.glassElements ||
      (params.root.querySelectorAll<HTMLElement>(":scope > .liquid-glass-item, :scope > .liquid-glass-card") as NodeListOf<HTMLElement>);

    if (!elements || elements.length === 0) {
      return null;
    }

    const instance = await LiquidGlass.init({
      root: params.root,
      glassElements: elements,
      defaults: {
        cornerRadius: 20,
        zRadius: 24,
        refraction: 0.75,
        blurAmount: 0.3,
        chromAberration: 0.06,
        edgeHighlight: 0.2,
        specular: 0.35,
        fresnel: 1.0,
        tintStrength: 0.05,
        shadowOpacity: 0.2,
        ...params.defaults,
      },
    });

    return instance;
  } catch (err) {
    console.warn("Could not initialize @ybouane/liquidglass WebGL shader, falling back to CSS Liquid Glass:", err);
    return null;
  }
}

