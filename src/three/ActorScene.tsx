import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { Emphasis } from '../data/narrative'
import {
  actorFragmentShader,
  actorVertexShader,
  floorFragmentShader,
  floorVertexShader,
  glowFragmentShader,
} from './actorShaders'

export const POSE_SOURCES: Record<Emphasis, string> = {
  welcome: '/actor/about.webp',
  point: '/actor/projects.webp',
  present: '/actor/skills.webp',
  reflect: '/actor/experience.webp',
  invite: '/actor/contact.webp',
}

const EMPHASIS_ORDER: Emphasis[] = ['welcome', 'point', 'present', 'reflect', 'invite']

/**
 * Camera + body language target for each narration mood. Distances keep the
 * whole figure, head to shoes, inside the frame.
 */
const STAGING: Record<Emphasis, { lean: number; orbit: number; height: number; distance: number }> = {
  welcome: { lean: 0.0, orbit: 0.0, height: 0.62, distance: 6.0 },
  point: { lean: -0.14, orbit: -0.24, height: 0.5, distance: 5.7 },
  present: { lean: 0.05, orbit: 0.15, height: 0.68, distance: 5.85 },
  reflect: { lean: -0.05, orbit: 0.28, height: 0.9, distance: 6.2 },
  invite: { lean: 0.02, orbit: -0.1, height: 0.45, distance: 5.6 },
}

const ACCENT = new THREE.Color('#3de0d0')
const PLANE_HEIGHT = 3.35
const PLANE_WIDTH = PLANE_HEIGHT * (760 / 1140)

type StageInput = {
  progressRef: { current: number }
  emphasis: Emphasis
  beatKey: string
  /** Position of the focused line, used to vary the stance line by line. */
  beatIndex: number
}

/** Small deterministic offset so no two lines produce an identical stance. */
function stanceOffset(index: number) {
  return {
    lean: (((index * 37) % 9) - 4) * 0.012,
    turn: (((index * 53) % 7) - 3) * 0.035,
  }
}

function Actor({ progressRef, emphasis, beatKey, beatIndex }: StageInput) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const groupRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.ShaderMaterial>(null)

  const [textures, setTextures] = useState<Record<Emphasis, THREE.Texture> | null>(null)

  // Animation bookkeeping kept out of React state to avoid re-renders per frame.
  const mix = useRef(0)
  const pulse = useRef(0)
  const currentPose = useRef<Emphasis>(emphasis)
  const pendingPose = useRef<Emphasis | null>(null)

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    let cancelled = false

    const entries = EMPHASIS_ORDER.map(
      (key) =>
        new Promise<[Emphasis, THREE.Texture]>((resolve, reject) => {
          loader.load(
            POSE_SOURCES[key],
            (texture) => {
              texture.colorSpace = THREE.SRGBColorSpace
              texture.minFilter = THREE.LinearFilter
              texture.magFilter = THREE.LinearFilter
              texture.generateMipmaps = false
              resolve([key, texture])
            },
            undefined,
            reject
          )
        })
    )

    Promise.all(entries)
      .then((loaded) => {
        if (cancelled) return
        setTextures(Object.fromEntries(loaded) as Record<Emphasis, THREE.Texture>)
      })
      .catch(() => {
        /* Stage stays empty; the DOM fallback layer keeps the avatar visible. */
      })

    return () => {
      cancelled = true
    }
  }, [])

  const uniforms = useMemo(
    () => ({
      uTexA: { value: null as THREE.Texture | null },
      uTexB: { value: null as THREE.Texture | null },
      uMix: { value: 0 },
      uTime: { value: 0 },
      uBreath: { value: 1 },
      uLean: { value: 0 },
      uPulse: { value: 0 },
      uAccent: { value: ACCENT },
      uTexel: { value: new THREE.Vector2(1 / 760, 1 / 1140) },
    }),
    []
  )

  const glowUniforms = useMemo(
    () => ({
      uAccent: { value: ACCENT },
      uPulse: { value: 0 },
      uTime: { value: 0 },
    }),
    []
  )

  // Seed the first pose once textures arrive.
  useEffect(() => {
    if (!textures) return
    uniforms.uTexA.value = textures[currentPose.current]
    uniforms.uTexB.value = textures[currentPose.current]
  }, [textures, uniforms])

  // Every focused line triggers a reaction; a new mood also swaps the pose.
  useEffect(() => {
    pulse.current = 1
    if (!textures) {
      currentPose.current = emphasis
      return
    }
    if (emphasis !== currentPose.current) {
      pendingPose.current = emphasis
      uniforms.uTexB.value = textures[emphasis]
      mix.current = 0
    }
  }, [beatKey, emphasis, textures, uniforms])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    uniforms.uTime.value = t
    glowUniforms.uTime.value = t

    // Advance or settle the pose dissolve.
    if (pendingPose.current) {
      mix.current = Math.min(1, mix.current + delta * 1.9)
      uniforms.uMix.value = mix.current
      if (mix.current >= 1) {
        currentPose.current = pendingPose.current
        pendingPose.current = null
        uniforms.uTexA.value = uniforms.uTexB.value
        mix.current = 0
        uniforms.uMix.value = 0
      }
    }

    // Decay the reaction jolt.
    pulse.current = Math.max(0, pulse.current - delta * 2.6)
    const easedPulse = pulse.current * pulse.current
    uniforms.uPulse.value = easedPulse
    glowUniforms.uPulse.value = easedPulse

    const staging = STAGING[pendingPose.current ?? currentPose.current]
    const stance = stanceOffset(beatIndex)
    const leanTarget = staging.lean + stance.lean
    uniforms.uLean.value += (leanTarget - uniforms.uLean.value) * Math.min(1, delta * 3.2)

    if (groupRef.current) {
      const progress = progressRef.current
      // Slow turn through the scroll so the actor is seen from changing angles.
      const targetRotation =
        staging.orbit * 0.55 + stance.turn + Math.sin(progress * Math.PI * 2) * 0.12
      groupRef.current.rotation.y += (targetRotation - groupRef.current.rotation.y) * Math.min(1, delta * 2.4)
      groupRef.current.position.y = Math.sin(t * 0.6) * 0.035
    }

    if (glowRef.current) {
      glowRef.current.uniforms.uPulse.value = easedPulse
      glowRef.current.uniforms.uTime.value = t
    }
  })

  return (
    <group ref={groupRef}>
      {/* Energy pool behind the actor. */}
      <mesh position={[0, 0.1, -0.6]}>
        <planeGeometry args={[PLANE_WIDTH * 2.1, PLANE_HEIGHT * 1.15]} />
        <shaderMaterial
          ref={glowRef}
          uniforms={glowUniforms}
          vertexShader={floorVertexShader}
          fragmentShader={glowFragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {textures ? (
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[PLANE_WIDTH, PLANE_HEIGHT, 48, 72]} />
          <shaderMaterial
            ref={materialRef}
            uniforms={uniforms}
            vertexShader={actorVertexShader}
            fragmentShader={actorFragmentShader}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ) : null}
    </group>
  )
}

function HoloPlatform({ progressRef }: { progressRef: { current: number } }) {
  const inner = useRef<THREE.Mesh>(null)
  const outer = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    const spin = 0.35 + progressRef.current * 1.6
    if (inner.current) inner.current.rotation.z += delta * spin
    if (outer.current) {
      outer.current.rotation.z -= delta * spin * 0.6
      outer.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.02)
    }
  })

  return (
    <group position={[0, -1.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={inner}>
        <torusGeometry args={[0.95, 0.012, 8, 96]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.85} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={outer}>
        <torusGeometry args={[1.32, 0.006, 8, 128]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <circleGeometry args={[1.05, 64]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.07} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

function GridFloor({ progressRef }: { progressRef: { current: number } }) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAccent: { value: ACCENT },
      uProgress: { value: 0 },
    }),
    []
  )

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uProgress.value = progressRef.current
  })

  return (
    <mesh position={[0, -1.75, -2]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[26, 26]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={floorVertexShader}
        fragmentShader={floorFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function DataMotes() {
  const points = useRef<THREE.Points>(null)
  const count = 260

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      const radius = 0.9 + Math.random() * 2.6
      const angle = Math.random() * Math.PI * 2
      array[i * 3] = Math.cos(angle) * radius
      array[i * 3 + 1] = -1.7 + Math.random() * 4.6
      array[i * 3 + 2] = Math.sin(angle) * radius * 0.7
    }
    return array
  }, [count])

  useFrame((state, delta) => {
    const geometry = points.current?.geometry
    if (!geometry) return
    const attribute = geometry.getAttribute('position') as THREE.BufferAttribute
    const array = attribute.array as Float32Array
    for (let i = 0; i < count; i += 1) {
      const y = i * 3 + 1
      array[y] += delta * (0.16 + (i % 7) * 0.02)
      if (array[y] > 3.0) array[y] = -1.75
    }
    attribute.needsUpdate = true
    if (points.current) points.current.rotation.y = state.clock.elapsedTime * 0.045
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={ACCENT}
        size={0.028}
        sizeAttenuation
        transparent
        opacity={0.72}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function CameraRig({ progressRef, emphasis }: { progressRef: { current: number }; emphasis: Emphasis }) {
  const { camera } = useThree()
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), [])

  useFrame((state, delta) => {
    const staging = STAGING[emphasis]
    const progress = progressRef.current

    // Orbit and dolly through the whole scroll, biased by the current mood.
    const orbit = staging.orbit + Math.sin(progress * Math.PI * 2) * 0.22
    const distance = staging.distance - progress * 0.35
    const height = staging.height + Math.sin(progress * Math.PI) * 0.22

    const desiredX = Math.sin(orbit) * distance
    const desiredZ = Math.cos(orbit) * distance
    const lerp = Math.min(1, delta * 1.9)

    camera.position.x += (desiredX - camera.position.x) * lerp
    camera.position.y += (height - camera.position.y) * lerp
    camera.position.z += (desiredZ - camera.position.z) * lerp

    // Aim at the actor's centre so the whole figure stays framed while the
    // raised camera keeps the grid floor and platform in shot.
    target.y += (0.02 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03 - target.y) * lerp
    camera.lookAt(target)
  })

  return null
}

export function ActorScene({ progressRef, emphasis, beatKey, beatIndex }: StageInput) {
  return (
    <Canvas
      camera={{ position: [0, 0.62, 6.0], fov: 34, near: 0.1, far: 60 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.8} />
      <CameraRig progressRef={progressRef} emphasis={emphasis} />
      <GridFloor progressRef={progressRef} />
      <HoloPlatform progressRef={progressRef} />
      <DataMotes />
      <Actor
        progressRef={progressRef}
        emphasis={emphasis}
        beatKey={beatKey}
        beatIndex={beatIndex}
      />
    </Canvas>
  )
}
