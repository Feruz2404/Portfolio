"use client";

import { Component, type ReactNode } from "react";

/**
 * Real error boundary around the WebGL canvas. Any renderer or asset-loading
 * failure swaps cleanly to the static poster instead of surfacing a broken
 * canvas or an unhandled error.
 */
export class SceneErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onError?: (error: Error) => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[Hero3D] scene failed, falling back to poster:", error);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
