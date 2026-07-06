'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AdaptiveDpr, Float } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function Particles() {
  const mesh = useRef<THREE.Points>(null)
  const count = 900

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 6
      const angle = Math.random() * Math.PI * 2
      const depth = (Math.random() - 0.5) * 8

      arr[i * 3] = Math.cos(angle) * radius
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6
      arr[i * 3 + 2] = Math.sin(angle) * radius + depth
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.rotation.y = state.clock.elapsedTime * 0.025
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.04
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#8aa7ff" transparent opacity={0.62} sizeAttenuation />
    </points>
  )
}

type ShapeType = 'ico' | 'torus' | 'sphere'

function FloatingShape({
  position,
  color,
  shape
}: {
  position: [number, number, number]
  color: string
  shape: ShapeType
}) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((_state, delta) => {
    if (!mesh.current) return
    mesh.current.rotation.y += delta * 0.22
    mesh.current.rotation.x += delta * 0.08
  })

  return (
    <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.7}>
      <mesh ref={mesh} position={position}>
        {shape === 'ico' && <icosahedronGeometry args={[0.8, 0]} />}
        {shape === 'torus' && <torusGeometry args={[0.6, 0.2, 16, 96]} />}
        {shape === 'sphere' && <sphereGeometry args={[0.6, 28, 28]} />}
        <meshStandardMaterial
          color={color}
          wireframe
          opacity={0.56}
          transparent
          roughness={0.4}
          metalness={0.35}
        />
      </mesh>
    </Float>
  )
}

function Scene() {
  const { mouse } = useThree()
  const group = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!group.current) return
    group.current.rotation.y += (mouse.x * 0.26 - group.current.rotation.y) * 0.04
    group.current.rotation.x += (-mouse.y * 0.16 - group.current.rotation.x) * 0.04
  })

  return (
    <group ref={group}>
      <ambientLight intensity={0.28} />
      <pointLight position={[5, 5, 5]} color="#7c8cff" intensity={1.6} />
      <pointLight position={[-5, -5, -5]} color="#18d5d0" intensity={0.75} />
      <FloatingShape position={[2.2, 0.1, 0]} color="#7c8cff" shape="ico" />
      <FloatingShape position={[-2.1, 1, -1.1]} color="#a78bfa" shape="torus" />
      <FloatingShape position={[0.1, -1.45, 1]} color="#18d5d0" shape="sphere" />
      <Particles />
    </group>
  )
}

export default function HeroScene() {
  const [fallback, setFallback] = useState(true)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const lowCoreCount = (navigator.hardwareConcurrency || 4) < 4
    setFallback(reducedMotion || coarsePointer || lowCoreCount)
  }, [])

  if (fallback) {
    return (
      <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.28),rgba(6,182,212,0.12)_38%,transparent_68%)] blur-3xl" />
    )
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 58 }}
      dpr={[1, 1.25]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      performance={{ min: 0.6 }}
    >
      <AdaptiveDpr pixelated />
      <Scene />
    </Canvas>
  )
}
