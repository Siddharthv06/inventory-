/**
 * Liquid Glass Physics & Ray-Tracing Refraction Engine
 * Based on Apple WWDC 2025 Liquid Glass and Snell-Descartes Law of Refraction:
 *   n1 * sin(θ1) = n2 * sin(θ2)
 *
 * Implements:
 * 1. Snell's Law angle calculation & Total Internal Reflection (TIR)
 * 2. Convex Squircle Surface Function: y = h * (1 - (1 - x/w)^4)^(1/4)
 * 3. Surface normal derivatives and ray refraction vectors
 * 4. Procedural 32-bit RGBA SVG Displacement Map (<feDisplacementMap>) generator
 * 5. Blinn-Phong Specular Lighting and Chromatic Dispersion vectors
 */

import { PREBAKED_DISPLACEMENT_MAP_DATA_URL } from "./prebaked-map";

export interface GlassPhysicsConfig {
  refractiveIndex: number; // typically 1.33 (water) - 1.52 (glass) - 2.42 (diamond)
  bezelWidth: number; // width of curved border in pixels
  glassThickness: number; // physical thickness in pixels
  surfaceType: "squircle" | "circle" | "lip";
  specularIntensity: number; // 0.0 to 1.0
  chromaticAberration: number; // 0.0 to 0.2
}

export const DEFAULT_GLASS_CONFIG: GlassPhysicsConfig = {
  refractiveIndex: 1.52, // Crown glass
  bezelWidth: 18,
  glassThickness: 14,
  surfaceType: "squircle",
  specularIntensity: 0.75,
  chromaticAberration: 0.06,
};

/**
 * Surface height functions f(x) where x in [0, 1] (0 = edge, 1 = interior flat start)
 */
export function getSurfaceHeight(x: number, type: "squircle" | "circle" | "lip"): number {
  const clampedX = Math.max(0, Math.min(1, x));

  switch (type) {
    case "squircle":
      // Apple's preferred profile: smooth 4th-power transition prevents harsh interior rings
      // y = (1 - (1 - x)^4)^(1/4)
      return Math.pow(1 - Math.pow(1 - clampedX, 4), 0.25);

    case "circle":
      // Standard circular lens arc: y = sqrt(1 - (1 - x)^2)
      return Math.sqrt(Math.max(0, 1 - Math.pow(1 - clampedX, 2)));

    case "lip": {
      // Raised rim with concave center dip
      const convex = Math.pow(1 - Math.pow(1 - clampedX, 4), 0.25);
      const concave = 1 - Math.sqrt(Math.max(0, 1 - Math.pow(clampedX, 2)));
      // Smoothstep blend
      const t = clampedX * clampedX * (3 - 2 * clampedX);
      return convex * (1 - t) + concave * t;
    }
  }
}

/**
 * Calculate the angle of incidence from the surface normal derivative
 */
export function getSurfaceNormalAngle(
  x: number,
  type: "squircle" | "circle" | "lip"
): number {
  const delta = 0.002;
  const x1 = Math.max(0, x - delta);
  const x2 = Math.min(1, x + delta);
  const y1 = getSurfaceHeight(x1, type);
  const y2 = getSurfaceHeight(x2, type);

  const derivative = (y2 - y1) / (x2 - x1);
  // Normal is perpendicular to tangent: angle relative to vertical incident ray
  return Math.atan(-derivative);
}

/**
 * Snell's law: n1 * sin(θ1) = n2 * sin(θ2)
 * Incoming medium is air (n1 = 1.0), exiting medium is glass (n2 = refractiveIndex)
 * Returns refraction angle θ2, or null if total internal reflection occurs
 */
export function calculateRefractionAngle(
  theta1: number,
  refractiveIndex: number
): number | null {
  const n1 = 1.0; // Air
  const n2 = Math.max(1.001, refractiveIndex);
  const sinTheta2 = (n1 / n2) * Math.sin(theta1);

  if (Math.abs(sinTheta2) > 1.0) {
    // Total internal reflection
    return null;
  }

  return Math.asin(sinTheta2);
}

/**
 * Calculate lateral ray displacement Δx for a point at normalized distance x from edge
 */
export function calculateDisplacement(
  xNorm: number,
  config: GlassPhysicsConfig,
  wavelengthOffset = 0
): number {
  if (xNorm >= 1.0) return 0; // Flat interior: orthogonal ray passes straight through

  const effIndex = config.refractiveIndex + wavelengthOffset;
  const theta1 = getSurfaceNormalAngle(xNorm, config.surfaceType);
  const theta2 = calculateRefractionAngle(theta1, effIndex);

  if (theta2 === null) {
    return 0; // Reflected ray
  }

  const height = getSurfaceHeight(xNorm, config.surfaceType) * config.glassThickness;
  const bendAngle = theta1 - theta2;

  // Lateral shift = height * tan(bendAngle)
  return height * Math.tan(bendAngle);
}

/**
 * 2D Signed Distance Function for a rounded squircle rectangle
 */
function sdRoundedRect(
  px: number,
  py: number,
  halfW: number,
  halfH: number,
  radius: number
): number {
  const dx = Math.abs(px) - halfW + radius;
  const dy = Math.abs(py) - halfH + radius;
  const ax = Math.max(dx, 0);
  const ay = Math.max(dy, 0);
  const outsideDist = Math.sqrt(ax * ax + ay * ay);
  const insideDist = Math.min(Math.max(dx, dy), 0);
  return outsideDist + insideDist - radius;
}

/**
 * Generates an SVG Displacement Map as a base64 Data URL.
 * R channel = X offset, G channel = Y offset (128 = 0 offset, range 0..255)
 * Uses exact 2D Rounded Box Signed Distance Field for rectangular cards.
 */
export function generateDisplacementMapDataUrl(
  size = 128,
  config: GlassPhysicsConfig = DEFAULT_GLASS_CONFIG,
  shape: "rect" | "circle" = "rect"
): { dataUrl: string; maxDisplacement: number } {
  if (typeof document === "undefined") {
    // SSR fallback: pre-baked physics displacement map
    return {
      dataUrl: PREBAKED_DISPLACEMENT_MAP_DATA_URL,
      maxDisplacement: 14,
    };
  }

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return { dataUrl: "", maxDisplacement: 12 };
  }

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  const center = size / 2;
  const radius = size * 0.46;
  const bezelPx = Math.max(4, Math.min(size * 0.35, config.bezelWidth));

  // Precompute 1D displacement table
  const samples = 128;
  const table = new Float32Array(samples);
  let maxDisp = 0;

  for (let i = 0; i < samples; i++) {
    const xNorm = i / (samples - 1);
    const disp = calculateDisplacement(xNorm, config);
    table[i] = disp;
    if (Math.abs(disp) > maxDisp) maxDisp = Math.abs(disp);
  }

  if (maxDisp === 0) maxDisp = 1;

  const halfW = size * 0.46;
  const halfH = size * 0.46;
  const cornerRadius = size * 0.16;
  const eps = 0.5;

  // Rasterize 2D displacement vector field
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const px = x - center;
      const py = y - center;

      let distFromEdge: number;
      let unitX = 0;
      let unitY = 0;

      if (shape === "circle") {
        const distFromCenter = Math.hypot(px, py);
        distFromEdge = radius - distFromCenter;
        if (distFromCenter > 0.001) {
          unitX = -px / distFromCenter;
          unitY = -py / distFromCenter;
        }
      } else {
        // Rounded squircle box SDF
        const d = sdRoundedRect(px, py, halfW, halfH, cornerRadius);
        distFromEdge = -d; // Positive inside the card

        // Calculate gradient for surface normal
        const dX =
          sdRoundedRect(px + eps, py, halfW, halfH, cornerRadius) -
          sdRoundedRect(px - eps, py, halfW, halfH, cornerRadius);
        const dY =
          sdRoundedRect(px, py + eps, halfW, halfH, cornerRadius) -
          sdRoundedRect(px, py - eps, halfW, halfH, cornerRadius);
        const gradLen = Math.hypot(dX, dY);

        if (gradLen > 0.001) {
          // Normal points outward, inward refraction is opposite
          unitX = -dX / gradLen;
          unitY = -dY / gradLen;
        }
      }

      if (distFromEdge <= 0 || distFromEdge > bezelPx) {
        // Outside or in flat interior: neutral (no displacement)
        data[idx] = 128; // Red (X)
        data[idx + 1] = 128; // Green (Y)
        data[idx + 2] = 128; // Blue
        data[idx + 3] = 255; // Alpha
        continue;
      }

      // Normalized distance in bezel [0 = edge, 1 = inner flat border]
      const bezelNorm = Math.min(1, Math.max(0, distFromEdge / bezelPx));
      const sampleIdx = Math.round(bezelNorm * (samples - 1));
      const dispMag = table[sampleIdx] / maxDisp;

      const r = Math.round(128 + unitX * dispMag * 127);
      const g = Math.round(128 + unitY * dispMag * 127);

      data[idx] = Math.max(0, Math.min(255, r));
      data[idx + 1] = Math.max(0, Math.min(255, g));
      data[idx + 2] = 128;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return {
    dataUrl: canvas.toDataURL("image/png"),
    maxDisplacement: Math.max(6, Math.min(36, maxDisp * 2.2)),
  };
}
