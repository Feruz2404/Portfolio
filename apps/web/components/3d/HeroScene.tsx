'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

function Particles() {
  const mesh = useRef<THREE.Points>(null)
  const count = 2000

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 20
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return arr
  }, [])

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.03
      mesh.current.rotation.x = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <points ref={mesh}>
      {/* FIX: single bufferGeometry with ref – removes broken nested geometry */}
      <bufferGeometry
        ref={(geom) => {
          if (geom) geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        }}
      />
      <pointsMaterial size={0.02} color="#6366f1" transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

type ShapeType = 'ico' | 'torus' | 'sphere'

function FloatingShape({ position, color, shape }: { position: [number,number,number]; color: string; shape: ShapeType }) {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (mesh.current) mesh.current.rotation.y = state.clock.elapsedTime * 0.3
  })

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={mesh} position={position}>
        {shape === 'ico'   && <icosahedronGeometry args={[0.8, 0]} />}
        {shape === 'torus' && <torusGeometry      args={[0.6, 0.2, 16, 100]} />}
        {shape === 'sphere'&& <sphereGeometry     args={[0.6, 32, 32]} />}
        <meshStandardMaterial color={color} wireframe opacity={0.7} transparent />
      </mesh>
    </Float>
  )
}

function Scene() {
  const { mouse } = useThree()
  const group = useRef<THREE.Group>(null)

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += (mouse.x * 0.3 - group.current.rotation.y) * 0.05
      group.current.rotation.x += (-mouse.y * 0.2 - group.current.rotation.x) * 0.05
    }
  })

  return (
    <group ref={group}>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]}   color="#6366f1" intensity={2} />
      <pointLight position={[-5, -5, -5]} color="#8b5cf6" intensity={1} />
      <FloatingShape position={[2, 0, 0]}    color="#6366f1" shape="ico"    />
      <FloatingShape position={[-2, 1, -1]}  color="#8b5cf6" shape="torus"  />
      <FloatingShape position={[0, -1.5, 1]} color="#06b6d4" shape="sphere" />
      <Particles />
      <Stars radius={50} depth={50} count={3000} factor={2} fade speed={0.5} />
    </group>
  )
}

export default function HeroScene() {
  const isLowEnd = typeof navigator !== 'undefined' && (navigator.hardwareConcurrency || 4) < 4
  if (isLowEnd) return (
    <div className="w-full h-full bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-cyan-900/20 rounded-full blur-3xl animate-pulse" />
  )

  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={[1, 1.5]} gl={{ antialias: false }}>
      <Scene />
    </Canvas>
  )
}
