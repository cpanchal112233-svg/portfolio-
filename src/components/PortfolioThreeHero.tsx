import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useEffect, useState, useRef } from 'react'
import type { Group, Mesh } from 'three'

function CoreMesh() {
  const groupRef = useRef<Group>(null)
  const torusRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25
    }
    if (torusRef.current) {
      torusRef.current.rotation.x += delta * 0.4
      torusRef.current.rotation.z -= delta * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.35}>
        <mesh ref={torusRef} position={[0, 0.35, 0]}>
          <torusKnotGeometry args={[0.58, 0.2, 120, 16]} />
          <meshStandardMaterial color="#89b4dc" metalness={0.45} roughness={0.25} />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.35}>
        <mesh position={[-1.2, -0.05, 0.2]}>
          <octahedronGeometry args={[0.28, 0]} />
          <meshStandardMaterial color="#8bd2bf" metalness={0.25} roughness={0.35} />
        </mesh>
      </Float>

      <Float speed={2.1} rotationIntensity={0.22} floatIntensity={0.42}>
        <mesh position={[1.15, -0.25, -0.15]}>
          <icosahedronGeometry args={[0.24, 0]} />
          <meshStandardMaterial color="#e9bf9d" metalness={0.22} roughness={0.35} />
        </mesh>
      </Float>

      <mesh position={[0, -0.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.05, 1.22, 48]} />
        <meshStandardMaterial color="#5f86aa" emissive="#3f6382" emissiveIntensity={0.35} />
      </mesh>
    </group>
  )
}

function canUseWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

export function PortfolioThreeHero() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !canUseWebGL()) {
      return
    }
    const timer = window.setTimeout(() => setEnabled(true), 500)
    return () => window.clearTimeout(timer)
  }, [])

  if (!enabled) {
    return <div className="three-hero three-hero--fallback" aria-hidden />
  }

  return (
    <div className="three-hero" aria-hidden>
      <Canvas
        camera={{ position: [0, 0.4, 3.1], fov: 44 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance', failIfMajorPerformanceCaveat: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0b1219')
        }}
      >
        <color attach="background" args={['#0b1219']} />
        <fog attach="fog" args={['#0b1219', 3.5, 7]} />
        <ambientLight intensity={0.8} />
        <directionalLight intensity={1.2} position={[2.6, 3.1, 1.8]} />
        <pointLight intensity={0.6} position={[-2, 1, 2]} color="#8fd4d4" />
        <CoreMesh />
      </Canvas>
      <div className="three-hero__hud">
        <span>3D Portfolio</span>
        <span>React Three Fiber · TypeScript</span>
      </div>
    </div>
  )
}
