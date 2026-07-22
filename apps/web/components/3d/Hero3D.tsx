"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import HeroPoster from "./HeroPoster";
import { SceneErrorBoundary } from "./SceneErrorBoundary";
import { decideScene, type SceneDecision } from "./webgl";

// Live scene = authorized Spline production export. Client-only + lazy so it is
// kept out of SSR and the initial bundle and can never block the hero copy/LCP.
// To go back to the code-built R3F scene, swap this import for "./AtelierScene".
const SplineScene = dynamic(() => import("./SplineScene"), { ssr: false });

export default function Hero3D() {
  const t = useTranslations("a11y");
  const alt = t("heroSceneAlt");
  const containerRef = useRef<HTMLDivElement>(null);
  const [decision, setDecision] = useState<SceneDecision | null>(null);
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);

  // Decide on the client only (needs matchMedia / WebGL / device hints).
  useEffect(() => {
    setDecision(decideScene());
  }, []);

  // Pause rendering when the scene is offscreen or the document is hidden.
  useEffect(() => {
    if (!decision?.render) return;
    const el = containerRef.current;
    let inView = true;
    const update = () => setActive(inView && document.visibilityState === "visible");
    const io =
      el && "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([entry]) => {
              inView = entry.isIntersecting;
              update();
            },
            { threshold: 0.05 },
          )
        : null;
    if (io && el) io.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      io?.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [decision?.render]);

  // The heavy Spline scene runs only on capable, fine-pointer devices ("high").
  // Coarse pointers, reduced-motion, no-WebGL and low-end all get the poster.
  const useLive = Boolean(decision?.render && decision.quality === "high");

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {/* Poster: SSR + constrained devices, and under the live scene until it loads. */}
      {(!useLive || !ready) && <HeroPoster alt={alt} />}

      {useLive ? (
        <div
          aria-hidden
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          <SceneErrorBoundary fallback={<HeroPoster alt={alt} />}>
            <SplineScene active={active} onReady={() => setReady(true)} />
          </SceneErrorBoundary>
        </div>
      ) : null}

      <span className="sr-only">{alt}</span>
    </div>
  );
}
