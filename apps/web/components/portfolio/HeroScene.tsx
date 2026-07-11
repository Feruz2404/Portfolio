"use client";

import { Float, OrbitControls, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

function CoreObject() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.35, 2]} />
        <meshStandardMaterial color="#d9faff" emissive="#0a7288" emissiveIntensity={0.7} roughness={0.18} metalness={0.55} wireframe />
      </mesh>
      <mesh scale={0.82}>
        <icosahedronGeometry args={[1.35, 2]} />
        <meshPhysicalMaterial color="#5ce1e6" emissive="#123d48" emissiveIntensity={0.6} roughness={0.22} metalness={0.75} transparent opacity={0.72} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0.3, 0]}>
        <torusGeometry args={[1.58, 0.012, 16, 128]} />
        <meshBasicMaterial color="#ff4d9d" transparent opacity={0.85} />
      </mesh>
      <mesh rotation={[0.3, Math.PI / 3, 0]}>
        <torusGeometry args={[1.82, 0.008, 16, 128]} />
        <meshBasicMaterial color="#84f7ff" transparent opacity={0.62} />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (reducedMotion) {
    return <div className="h-full w-full rounded-full border border-cyan-200/20 bg-cyan-200/5 shadow-[0_0_120px_rgba(92,225,230,0.2)]" aria-hidden="true" />;
  }

  return (
    <div className="h-full w-full" role="img" aria-label="Interactive glowing 3D portfolio orb">
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 5.2], fov: 34 }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} />
          <pointLight position={[3, 2, 4]} intensity={9} color="#a7fbff" />
          <pointLight position={[-3, -2, 1]} intensity={8} color="#ff4d9d" />
          <Sparkles count={90} scale={[7, 7, 7]} size={2.1} speed={0.28} color="#b8faff" />
          <Float speed={1.2} rotationIntensity={0.28} floatIntensity={0.7}>
            <CoreObject />
          </Float>
          <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.35} rotateSpeed={0.45} />
        </Suspense>
      </Canvas>
    </div>
  );
}
