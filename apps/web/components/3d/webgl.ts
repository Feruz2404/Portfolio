/** Capability detection for the 3D hero. All checks are client-only. */

export function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

export type SceneDecision = { render: boolean; quality: "low" | "high"; reason?: string };

/**
 * Decide whether to render the live scene or fall back to the static poster,
 * and at what quality. Errs toward the poster on constrained devices so the
 * hero is always smooth and never blocks the page.
 */
export function decideScene(): SceneDecision {
  if (typeof window === "undefined") return { render: false, quality: "low", reason: "ssr" };

  const mm = window.matchMedia;
  const reduceMotion = mm("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return { render: false, quality: "low", reason: "reduced-motion" };

  if (!hasWebGL()) return { render: false, quality: "low", reason: "no-webgl" };

  const nav = navigator as NavigatorWithHints;
  if (nav.connection?.saveData) return { render: false, quality: "low", reason: "save-data" };
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2)
    return { render: false, quality: "low", reason: "low-memory" };
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2)
    return { render: false, quality: "low", reason: "low-cores" };

  const coarse = mm("(pointer: coarse)").matches;
  return { render: true, quality: coarse ? "low" : "high" };
}
