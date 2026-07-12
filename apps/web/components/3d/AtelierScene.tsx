"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { silenceThreeClockDeprecation } from "./silenceThreeClockWarning";

// Runs when this (lazy) scene chunk loads, before fiber creates its Clock.
silenceThreeClockDeprecation();

const ACCENT = "#2FE3C2";
const EMERALD = "#34D399";
const VIOLET = "#8B7BF0";
const BONE = "#F2EFE6";

type Quality = "low" | "high";

/** Modular "screen" panels — the workspace, arranged in a loose depth cluster. */
const PANELS: { pos: [number, number, number]; size: [number, number, number]; rot: number; primary?: boolean }[] = [
  { pos: [-1.15, 0.35, 0], size: [1.7, 1.15, 0.08], rot: 0.05, primary: true },
  { pos: [0.95, 0.95, -0.6], size: [1.25, 0.85, 0.08], rot: -0.08 },
  { pos: [1.35, -0.35, -0.2], size: [1.4, 0.95, 0.08], rot: 0.04 },
  { pos: [-0.35, -1.1, -0.5], size: [1.15, 0.75, 0.08], rot: -0.05 },
];

/** Data nodes + the connections (index pairs) between them — architecture paths. */
const NODES: [number, number, number][] = [
  [-1.15, 0.35, 0.1],
  [0.95, 0.95, -0.5],
  [1.35, -0.35, -0.1],
  [-0.35, -1.1, -0.4],
  [0.1, 0.15, 0.3],
];
const LINKS: [number, number][] = [
  [0, 4],
  [4, 1],
  [4, 2],
  [0, 3],
  [3, 2],
];

function Panel({ pos, size, rot, primary }: (typeof PANELS)[number]) {
  return (
    <group position={pos} rotation={[0, rot, 0]}>
      <RoundedBox args={size} radius={0.06} smoothness={3} castShadow={false}>
        <meshStandardMaterial
          color={BONE}
          transparent
          opacity={0.06}
          roughness={0.5}
          metalness={0.1}
        />
      </RoundedBox>
      {/* hairline frame */}
      <RoundedBox args={[size[0] + 0.005, size[1] + 0.005, size[2]]} radius={0.06} smoothness={3}>
        <meshBasicMaterial color={BONE} transparent opacity={0.14} wireframe />
      </RoundedBox>
      {primary ? (
        <group position={[-size[0] / 2 + 0.34, size[1] / 2 - 0.22, size[2] / 2 + 0.01]}>
          {/* stylised FZ accent mark */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.5, 0.06, 0.01]} />
            <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.6} toneMapped={false} />
          </mesh>
          <mesh position={[-0.12, -0.14, 0]}>
            <boxGeometry args={[0.28, 0.05, 0.01]} />
            <meshStandardMaterial color={EMERALD} emissive={EMERALD} emissiveIntensity={0.4} toneMapped={false} />
          </mesh>
          <mesh position={[-0.02, -0.28, 0]}>
            <boxGeometry args={[0.5, 0.05, 0.01]} />
            <meshBasicMaterial color={BONE} transparent opacity={0.22} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}

function Node({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos}>
      <mesh>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={1.1} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function Connections() {
  const positions = useMemo(() => {
    const points: number[] = [];
    for (const [a, b] of LINKS) {
      points.push(...NODES[a], ...NODES[b]);
    }
    return new Float32Array(points);
  }, []);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={ACCENT} transparent opacity={0.4} />
    </lineSegments>
  );
}

function Rig({ quality }: { quality: Quality }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    // gentle pointer parallax + slow autonomous drift
    const targetY = pointer.x * 0.35 + Math.sin(state.clock.elapsedTime * 0.15) * 0.06;
    const targetX = -pointer.y * 0.22;
    g.rotation.y += (targetY - g.rotation.y) * Math.min(1, delta * 2.5);
    g.rotation.x += (targetX - g.rotation.x) * Math.min(1, delta * 2.5);
    g.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
  });

  const nodeCount = quality === "high" ? NODES.length : 3;

  return (
    <group ref={group}>
      {PANELS.map((p, i) => (
        <Panel key={i} {...p} />
      ))}
      <Connections />
      {NODES.slice(0, nodeCount).map((pos, i) => (
        <Node key={i} pos={pos} />
      ))}
    </group>
  );
}

export default function AtelierScene({ quality = "high", active = true }: { quality?: Quality; active?: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 5.6], fov: 42 }}
      dpr={quality === "high" ? [1, 2] : [1, 1.25]}
      gl={{ antialias: quality === "high", alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <AdaptiveDpr pixelated />
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color={BONE} />
      <pointLight position={[-4, -2, 2]} intensity={12} color={VIOLET} distance={12} decay={2} />
      <pointLight position={[3, 1, 3]} intensity={10} color={ACCENT} distance={12} decay={2} />
      <Rig quality={quality} />
    </Canvas>
  );
}
