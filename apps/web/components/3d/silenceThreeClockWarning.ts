/**
 * Upstream workaround — NOT a suppression of any first-party issue.
 *
 * @react-three/fiber 9.6.1 (the latest release) still instantiates
 * `THREE.Clock`, which three r183+ deprecated in favour of `THREE.Timer`.
 * There is no fiber release that uses Timer yet, and @react-three/drei 10.7.7
 * hard-depends on three 0.184, so the toolchain cannot be moved below the
 * deprecation without a much larger (unjustified) stack downgrade.
 *
 * This filters ONLY that one exact deprecation line so it doesn't pollute the
 * console for users who get the live 3D scene. Every other warning passes
 * through untouched. Remove this once fiber ships a Timer-based clock.
 */
let patched = false;

export function silenceThreeClockDeprecation() {
  if (patched || typeof window === "undefined") return;
  patched = true;
  const original = console.warn.bind(console);
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Clock: This module has been deprecated")) {
      return;
    }
    original(...args);
  };
}
