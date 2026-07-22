"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type SceneMode = "loading" | "ready" | "fallback" | "lost";

const NODE_COUNT = 72;
const STAR_COUNT = 420;
const MAX_DPR = 1.35;

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createNodePositions() {
  const random = seededRandom(20260706);
  const positions = new Float32Array(NODE_COUNT * 3);

  for (let index = 0; index < NODE_COUNT; index += 1) {
    const ring = index % 3;
    const radius = 1.65 + ring * 0.82 + random() * 0.42;
    const angle = (index / NODE_COUNT) * Math.PI * 2 * (1.85 + ring * 0.18);
    const layer = (random() - 0.5) * 1.85;

    positions[index * 3] = Math.cos(angle) * radius + (random() - 0.5) * 0.56;
    positions[index * 3 + 1] = Math.sin(angle * 0.72) * 1.55 + layer * 0.36;
    positions[index * 3 + 2] = Math.sin(angle) * radius * 0.52 + layer;
  }

  return positions;
}

function createStarPositions() {
  const random = seededRandom(11041991);
  const positions = new Float32Array(STAR_COUNT * 3);

  for (let index = 0; index < STAR_COUNT; index += 1) {
    const radius = 4 + random() * 7;
    const angle = random() * Math.PI * 2;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = (random() - 0.5) * 6.5;
    positions[index * 3 + 2] = Math.sin(angle) * radius - 2.5 - random() * 4;
  }

  return positions;
}

function createLinePositions(nodePositions: Float32Array) {
  const pairs: number[] = [];

  for (let index = 0; index < NODE_COUNT; index += 1) {
    const next = (index + 1) % NODE_COUNT;
    const skip = (index + 7) % NODE_COUNT;

    pairs.push(
      nodePositions[index * 3],
      nodePositions[index * 3 + 1],
      nodePositions[index * 3 + 2],
      nodePositions[next * 3],
      nodePositions[next * 3 + 1],
      nodePositions[next * 3 + 2],
    );

    if (index % 4 === 0) {
      pairs.push(
        nodePositions[index * 3],
        nodePositions[index * 3 + 1],
        nodePositions[index * 3 + 2],
        nodePositions[skip * 3],
        nodePositions[skip * 3 + 1],
        nodePositions[skip * 3 + 2],
      );
    }
  }

  for (let ring = 0; ring < 3; ring += 1) {
    const radius = 2.4 + ring * 0.72;
    const y = (ring - 1) * 0.55;
    const segments = 96;

    for (let step = 0; step < segments; step += 1) {
      const a = (step / segments) * Math.PI * 2;
      const b = ((step + 1) / segments) * Math.PI * 2;
      pairs.push(
        Math.cos(a) * radius,
        Math.sin(a * 0.6) * 0.28 + y,
        Math.sin(a) * radius * 0.36,
        Math.cos(b) * radius,
        Math.sin(b * 0.6) * 0.28 + y,
        Math.sin(b) * radius * 0.36,
      );
    }
  }

  return new Float32Array(pairs);
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((item) => {
    if ("geometry" in item && item.geometry instanceof THREE.BufferGeometry) {
      item.geometry.dispose();
    }

    if ("material" in item) {
      const material = item.material;
      if (Array.isArray(material)) {
        material.forEach((entry) => entry.dispose());
      } else if (material instanceof THREE.Material) {
        material.dispose();
      }
    }
  });
}

function shouldUseFallback() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const lowCoreCount = (navigator.hardwareConcurrency || 4) < 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const lowMemory = typeof memory === "number" && memory <= 4;

  return reducedMotion || coarsePointer || lowCoreCount || lowMemory;
}

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<SceneMode>("loading");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    if (shouldUseFallback()) {
      setMode("fallback");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.className = "h-full w-full";
    mount.appendChild(canvas);

    let renderer: THREE.WebGLRenderer;
    let frameId = 0;
    let isContextLost = false;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        failIfMajorPerformanceCaveat: true,
        powerPreference: "high-performance",
      });
    } catch {
      canvas.remove();
      setMode("fallback");
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
    camera.position.set(0, 0, 7.4);

    const group = new THREE.Group();
    group.rotation.set(-0.12, 0.24, 0.05);
    scene.add(group);

    const nodePositions = createNodePositions();
    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));

    const nodeMaterial = new THREE.PointsMaterial({
      color: "#d7fff6",
      size: 0.045,
      transparent: true,
      opacity: 0.86,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const nodes = new THREE.Points(nodeGeometry, nodeMaterial);
    group.add(nodes);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(createLinePositions(nodePositions), 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: "#7be3d5",
      transparent: true,
      opacity: 0.26,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(lines);

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(createStarPositions(), 3));

    const starMaterial = new THREE.PointsMaterial({
      color: "#8c9fff",
      size: 0.012,
      transparent: true,
      opacity: 0.46,
      sizeAttenuation: true,
      depthWrite: false,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const keyLight = new THREE.PointLight("#b8fff3", 2.2, 14);
    keyLight.position.set(3.2, 3.4, 4.4);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight("#9b8cff", 0.85, 12);
    fillLight.position.set(-4.4, -1.6, 2.2);
    scene.add(fillLight);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.96;
    renderer.setClearColor(0x000000, 0);

    const size = new THREE.Vector2();
    const setSize = () => {
      const { width, height } = mount.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.floor(width));
      const nextHeight = Math.max(1, Math.floor(height));

      renderer.getSize(size);
      if (size.x === nextWidth && size.y === nextHeight) return;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
      renderer.setSize(nextWidth, nextHeight, false);
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
    };

    const timer = new THREE.Timer();
    timer.connect(document);

    const onContextLost = (event: Event) => {
      event.preventDefault();
      isContextLost = true;
      cancelAnimationFrame(frameId);
      setMode("lost");
    };

    const onContextRestored = () => {
      isContextLost = false;
      timer.reset();
      setMode("ready");
      frameId = requestAnimationFrame(animate);
    };

    canvas.addEventListener("webglcontextlost", onContextLost, false);
    canvas.addEventListener("webglcontextrestored", onContextRestored, false);

    const pointer = new THREE.Vector2(0, 0);
    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    mount.addEventListener("pointermove", onPointerMove, { passive: true });

    const resizeObserver = new ResizeObserver(setSize);
    resizeObserver.observe(mount);
    setSize();

    function animate(timestamp: number) {
      if (isContextLost) return;

      timer.update(timestamp);
      const elapsed = timer.getElapsed();
      const delta = Math.min(timer.getDelta(), 0.04);

      group.rotation.y += delta * 0.075;
      group.rotation.x += (pointer.y * 0.12 - group.rotation.x) * 0.025;
      group.rotation.z += (pointer.x * 0.08 - group.rotation.z) * 0.025;
      nodes.rotation.y = elapsed * 0.024;
      lines.rotation.y = elapsed * -0.016;
      stars.rotation.y = elapsed * 0.006;
      keyLight.intensity = 1.9 + Math.sin(elapsed * 0.9) * 0.24;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }

    setMode("ready");
    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      mount.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      timer.dispose();
      disposeObject(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, []);

  return (
    <div ref={mountRef} className="relative h-full w-full overflow-hidden" aria-hidden="true">
      {mode !== "ready" ? (
        <div className="absolute inset-0 hero-scene-fallback">
          <div className="hero-fallback-orbit hero-fallback-orbit-a" />
          <div className="hero-fallback-orbit hero-fallback-orbit-b" />
          <div className="hero-fallback-core" />
        </div>
      ) : null}
      {mode === "lost" ? <span className="sr-only">WebGL fallback active</span> : null}
    </div>
  );
}
