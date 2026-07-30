import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { Emphasis } from '../data/narrative'
import { ACT_DURATION, actIdForLine, easePerformance } from './actorPerformance'
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

/** Presenter staging — actor sits on the right, facing the slide deck on the left. */
const STAGING: Record<Emphasis, { lean: number; orbit: number; height: number; distance: number }> = {
  welcome: { lean: -0.06, orbit: -0.32, height: 0.48, distance: 7.2 },
  point: { lean: -0.18, orbit: -0.42, height: 0.44, distance: 6.9 },
  present: { lean: -0.08, orbit: -0.36, height: 0.52, distance: 7.0 },
  reflect: { lean: -0.04, orbit: -0.28, height: 0.58, distance: 7.3 },
  invite: { lean: -0.1, orbit: -0.34, height: 0.46, distance: 6.85 },
}

const ACCENT = new THREE.Color('#2563eb')
const ACCENT2 = new THREE.Color('#6366f1')
const ACTOR_X = 2.15
const PLANE_HEIGHT = 3.35
const PLANE_WIDTH = PLANE_HEIGHT * (760 / 1140)

type StageInput = {
  progressRef: { current: number }
  emphasis: Emphasis
  beatKey: string
  beatIndex: number
}

function stanceOffset(index: number) {
  return {
    lean: (((index * 37) % 9) - 4) * 0.01,
    turn: (((index * 53) % 7) - 3) * 0.028,
  }
}

function Actor({ progressRef, emphasis, beatKey, beatIndex }: StageInput) {
  const groupRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.ShaderMaterial>(null)
  const [textures, setTextures] = useState<Record<Emphasis, THREE.Texture> | null>(null)

  const mix = useRef(0)
  const pulse = useRef(0)
  const actElapsed = useRef(ACT_DURATION)
  const actType = useRef(0)
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
      .catch(() => {})

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
      uActPhase: { value: 0 },
      uActType: { value: 0 },
      uAccent: { value: ACCENT },
      uAccent2: { value: ACCENT2 },
      uTexel: { value: new THREE.Vector2(1 / 760, 1 / 1140) },
    }),
    []
  )

  const glowUniforms = useMemo(
    () => ({
      uAccent: { value: ACCENT },
      uAccent2: { value: ACCENT2 },
      uPulse: { value: 0 },
      uActPhase: { value: 0 },
      uTime: { value: 0 },
    }),
    []
  )

  useEffect(() => {
    if (!textures) return
    uniforms.uTexA.value = textures[currentPose.current]
    uniforms.uTexB.value = textures[currentPose.current]
  }, [textures, uniforms])

  useEffect(() => {
    pulse.current = 1
    actElapsed.current = 0
    actType.current = actIdForLine(emphasis, beatIndex)

    if (!textures) {
      currentPose.current = emphasis
      return
    }
    if (emphasis !== currentPose.current) {
      pendingPose.current = emphasis
      uniforms.uTexB.value = textures[emphasis]
      mix.current = 0
    }
  }, [beatKey, emphasis, beatIndex, textures, uniforms])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    uniforms.uTime.value = t
    glowUniforms.uTime.value = t

    if (pendingPose.current) {
      mix.current = Math.min(1, mix.current + delta * 1.5)
      uniforms.uMix.value = mix.current
      if (mix.current >= 1) {
        currentPose.current = pendingPose.current
        pendingPose.current = null
        uniforms.uTexA.value = uniforms.uTexB.value
        mix.current = 0
        uniforms.uMix.value = 0
      }
    }

    actElapsed.current = Math.min(ACT_DURATION, actElapsed.current + delta)
    const actT = easePerformance(actElapsed.current / ACT_DURATION)
    uniforms.uActPhase.value = actT
    uniforms.uActType.value = actType.current
    glowUniforms.uActPhase.value = actT

    pulse.current = Math.max(0, pulse.current - delta * 2.2)
    const easedPulse = pulse.current * pulse.current
    uniforms.uPulse.value = easedPulse
    glowUniforms.uPulse.value = easedPulse

    const staging = STAGING[pendingPose.current ?? currentPose.current]
    const stance = stanceOffset(beatIndex)
    const leanTarget = staging.lean + stance.lean
    uniforms.uLean.value += (leanTarget - uniforms.uLean.value) * Math.min(1, delta * 3.0)

    if (groupRef.current) {
      const progress = progressRef.current
      const targetRotation =
        staging.orbit * 0.6 + stance.turn + Math.sin(progress * Math.PI * 2) * 0.08
      groupRef.current.rotation.y +=
        (targetRotation - groupRef.current.rotation.y) * Math.min(1, delta * 2.2)

      const idleY = Math.sin(t * 0.55) * 0.028
      const actBob = actT * 0.035 * (1 - actT)
      groupRef.current.position.y = idleY + actBob
      groupRef.current.position.z = actT * 0.05 * (1 - actT * 0.5)
    }

    if (glowRef.current) {
      glowRef.current.uniforms.uPulse.value = easedPulse
      glowRef.current.uniforms.uTime.value = t
      glowRef.current.uniforms.uActPhase.value = actT
    }
  })

  return (
    <group ref={groupRef} position={[ACTOR_X, 0, 0]}>
      <mesh position={[0, 0.1, -0.6]}>
        <planeGeometry args={[PLANE_WIDTH * 2.0, PLANE_HEIGHT * 1.1]} />
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
          <planeGeometry args={[PLANE_WIDTH, PLANE_HEIGHT, 64, 96]} />
          <shaderMaterial
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
    const spin = 0.3 + progressRef.current * 1.2
    if (inner.current) inner.current.rotation.z += delta * spin
    if (outer.current) {
      outer.current.rotation.z -= delta * spin * 0.5
      outer.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.1) * 0.02)
    }
  })

  return (
    <group position={[ACTOR_X, -1.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={inner}>
        <torusGeometry args={[0.95, 0.012, 8, 96]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.55} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={outer}>
        <torusGeometry args={[1.32, 0.006, 8, 128]} />
        <meshBasicMaterial color={ACCENT2} transparent opacity={0.35} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <circleGeometry args={[1.05, 64]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.05} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

function GridFloor({ progressRef }: { progressRef: { current: number } }) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAccent: { value: ACCENT },
      uAccent2: { value: ACCENT2 },
      uProgress: { value: 0 },
    }),
    []
  )

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uProgress.value = progressRef.current
  })

  return (
    <mesh position={[ACTOR_X, -1.75, -2]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20]} />
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
  const count = 180

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      const radius = 0.8 + Math.random() * 2.2
      const angle = Math.random() * Math.PI * 2
      array[i * 3] = ACTOR_X + Math.cos(angle) * radius
      array[i * 3 + 1] = -1.7 + Math.random() * 4.5
      array[i * 3 + 2] = Math.sin(angle) * radius * 0.6
    }
    return array
  }, [count])

  useFrame((_state, delta) => {
    const geometry = points.current?.geometry
    if (!geometry) return
    const attribute = geometry.getAttribute('position') as THREE.BufferAttribute
    const array = attribute.array as Float32Array
    for (let i = 0; i < count; i += 1) {
      const y = i * 3 + 1
      array[y] += delta * (0.14 + (i % 7) * 0.02)
      if (array[y] > 3.0) array[y] = -1.75
    }
    attribute.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={ACCENT2}
        size={0.028}
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function CameraRig({
  progressRef,
  emphasis,
  beatKey,
}: {
  progressRef: { current: number }
  emphasis: Emphasis
  beatKey: string
}) {
  const { camera, size } = useThree()
  const target = useMemo(() => new THREE.Vector3(ACTOR_X, 0.15, 0), [])
  const shake = useRef(0)
  const lastBeat = useRef(beatKey)

  useEffect(() => {
    if (beatKey !== lastBeat.current) {
      shake.current = 1
      lastBeat.current = beatKey
    }
  }, [beatKey])

  useFrame((state, delta) => {
    const staging = STAGING[emphasis]
    const progress = progressRef.current

    shake.current = Math.max(0, shake.current - delta * 2.6)

    // The staging distances assume a landscape canvas. A portrait canvas crops
    // far tighter at the same distance, so back off until the whole figure fits.
    const aspect = size.width / Math.max(size.height, 1)
    const fit = THREE.MathUtils.clamp((1.45 - aspect) / 0.95, 0, 1)

    const orbit = staging.orbit + Math.sin(progress * Math.PI * 2) * 0.15
    const distance = (staging.distance - progress * 0.18) * (1 + fit * 0.9)
    const height = staging.height + Math.sin(progress * Math.PI) * 0.15 + fit * 0.3

    const desiredX = ACTOR_X + Math.sin(orbit) * distance
    const desiredZ = Math.cos(orbit) * distance
    const lerp = Math.min(1, delta * 1.7)

    const shakeAmt = shake.current * shake.current * 0.03
    camera.position.x += (desiredX - camera.position.x) * lerp + Math.sin(state.clock.elapsedTime * 26) * shakeAmt
    camera.position.y += (height - camera.position.y) * lerp
    camera.position.z += (desiredZ - camera.position.z) * lerp

    target.y += (0.15 + Math.sin(state.clock.elapsedTime * 0.45) * 0.025 - target.y) * lerp
    camera.lookAt(target)
  })

  return null
}

export function ActorScene({ progressRef, emphasis, beatKey, beatIndex }: StageInput) {
  return (
    <Canvas
      camera={{ position: [ACTOR_X, 0.5, 7.2], fov: 32, near: 0.1, far: 60 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={1.15} />
      <directionalLight position={[3, 5, 4]} intensity={0.75} color="#ffffff" />
      <directionalLight position={[-3, 2, 2]} intensity={0.35} color="#e0e7ff" />
      <pointLight position={[ACTOR_X - 1, 2, 3]} intensity={0.4} color="#6366f1" />
      <CameraRig progressRef={progressRef} emphasis={emphasis} beatKey={beatKey} />
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
