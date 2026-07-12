"use client";

import Spline from "@splinetool/react-spline";
import { useEffect, useRef } from "react";
import type { Application } from "@splinetool/runtime";

/**
 * Live hero scene backed by an authorized Spline production export.
 *
 * Drop-in behind Hero3D's poster-first / capability / error-boundary logic.
 * The scene URL is configurable (NEXT_PUBLIC_SPLINE_SCENE_URL); the default is
 * the current production export. To self-host, download the .splinecode into
 * apps/web/public/ and point the env var at "/scene.splinecode".
 */
const SCENE_URL =
  process.env.NEXT_PUBLIC_SPLINE_SCENE_URL ||
  "https://prod.spline.design/z68Bn74KBqXzL6iZ/scene.splinecode";

export default function SplineScene({
  active = true,
  onReady,
}: {
  active?: boolean;
  onReady?: () => void;
}) {
  const appRef = useRef<Application | null>(null);

  // Pause the render loop when the hero is offscreen or the tab is hidden.
  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    if (active) app.play?.();
    else app.stop?.();
  }, [active]);

  // Free GPU resources on unmount.
  useEffect(() => {
    return () => {
      appRef.current?.dispose?.();
      appRef.current = null;
    };
  }, []);

  return (
    <Spline
      scene={SCENE_URL}
      onLoad={(app: Application) => {
        appRef.current = app;
        if (!active) app.stop?.();
        onReady?.();
      }}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
