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
 */

export interface GlassPhysicsConfig {
  refractiveIndex: number; // typically 1.45 - 1.55 for glass
  bezelWidth: number; // width of curved border in pixels
  glassThickness: number; // physical thickness in pixels
  surfaceType: "squircle" | "circle" | "lip";
  specularIntensity: number; // 0.0 to 1.0
}

export const DEFAULT_GLASS_CONFIG: GlassPhysicsConfig = {
  refractiveIndex: 1.52, // Crown glass
  bezelWidth: 16,
  glassThickness: 12,
  surfaceType: "squircle",
  specularIntensity: 0.65,
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
  const n2 = refractiveIndex;
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
  config: GlassPhysicsConfig
): number {
  if (xNorm >= 1.0) return 0; // Flat interior: orthogonal ray passes straight through

  const theta1 = getSurfaceNormalAngle(xNorm, config.surfaceType);
  const theta2 = calculateRefractionAngle(theta1, config.refractiveIndex);

  if (theta2 === null) {
    return 0; // Reflected ray
  }

  const height = getSurfaceHeight(xNorm, config.surfaceType) * config.glassThickness;
  const bendAngle = theta1 - theta2;

  // Lateral shift = height * tan(bendAngle)
  return height * Math.tan(bendAngle);
}

/**
 * Generates an SVG Displacement Map as a base64 Data URL.
 * R channel = X offset, G channel = Y offset (128 = 0 offset, range 0..255)
 */
export function generateDisplacementMapDataUrl(
  size = 128,
  config: GlassPhysicsConfig = DEFAULT_GLASS_CONFIG
): { dataUrl: string; maxDisplacement: number } {
  if (typeof document === "undefined") {
    // SSR fallback: pre-baked neutral map
    return {
      dataUrl:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
      maxDisplacement: 8,
    };
  }

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return { dataUrl: "", maxDisplacement: 8 };
  }

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  const center = size / 2;
  const radius = size / 2;
  const bezelPx = Math.min(radius, (config.bezelWidth / 100) * radius * 2);

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

  // Rasterize 2D radial displacement vector field
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      const dx = x - center;
      const dy = y - center;
      const distFromCenter = Math.sqrt(dx * dx + dy * dy);
      const distFromEdge = radius - distFromCenter;

      if (distFromEdge <= 0 || distFromEdge > bezelPx) {
        // Outside circle or in flat interior: neutral (no displacement)
        data[idx] = 128; // Red (X)
        data[idx + 1] = 128; // Green (Y)
        data[idx + 2] = 128; // Blue
        data[idx + 3] = 255; // Alpha
        continue;
      }

      // Normalized distance in bezel [0 = edge, 1 = inner border]
      const bezelNorm = Math.min(1, Math.max(0, distFromEdge / bezelPx));
      const sampleIdx = Math.round(bezelNorm * (samples - 1));
      const dispMag = table[sampleIdx] / maxDisp;

      // Displacement points toward center (inward refraction)
      const angle = Math.atan2(dy, dx);
      const unitX = -Math.cos(angle);
      const unitY = -Math.sin(angle);

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
    maxDisplacement: Math.max(4, Math.min(32, maxDisp * 2)),
  };
}
