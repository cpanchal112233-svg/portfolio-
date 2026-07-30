import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { Emphasis } from '../data/narrative'
import { ACT_DURATION, actIdForLine, easePerformance } from './actorPerformance'
import {
  actorFragmentShader,
  actorVertexShader,
  planeVertexShader,
  shadowFragmentShader,
} from './actorShaders'

export const POSE_SOURCES: Record<Emphasis, string> = {
  welcome: '/actor/about.webp',
  point: '/actor/projects.webp',
  present: '/actor/skills.webp',
  reflect: '/actor/experience.webp',
  invite: '/actor/contact.webp',
}

const EMPHASIS_ORDER: Emphasis[] = ['welcome', 'point', 'present', 'reflect', 'invite']

/** Presenter staging — the figure stands right of the reading column. */
const STAGING: Record<Emphasis, { lean: number; orbit: number; height: number; distance: number }> = {
  welcome: { lean: -0.06, orbit: -0.32, height: 0.48, distance: 7.2 },
  point: { lean: -0.18, orbit: -0.42, height: 0.44, distance: 6.9 },
  present: { lean: -0.08, orbit: -0.36, height: 0.52, distance: 7.0 },
  reflect: { lean: -0.04, orbit: -0.28, height: 0.58, distance: 7.3 },
  invite: { lean: -0.1, orbit: -0.34, height: 0.46, distance: 6.85 },
}

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
    // Restarting a cross-dissolve that is already heading to this pose leaves
    // both poses half-drawn, which reads as a ghost beside the figure.
    if (emphasis !== currentPose.current && emphasis !== pendingPose.current) {
      pendingPose.current = emphasis
      uniforms.uTexB.value = textures[emphasis]
      mix.current = 0
    }
  }, [beatKey, emphasis, beatIndex, textures, uniforms])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    uniforms.uTime.value = t

    if (pendingPose.current) {
      mix.current = Math.min(1, mix.current + delta * 2.6)
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

    pulse.current = Math.max(0, pulse.current - delta * 2.2)
    const easedPulse = pulse.current * pulse.current
    uniforms.uPulse.value = easedPulse

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
  })

  if (!textures) return null

  return (
    <group ref={groupRef} position={[ACTOR_X, 0, 0]}>
      <mesh>
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
    </group>
  )
}

function ContactShadow() {
  const uniforms = useMemo(() => ({ uOpacity: { value: 0.14 } }), [])

  return (
    <mesh position={[ACTOR_X, -1.66, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1.8, 0.9]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={planeVertexShader}
        fragmentShader={shadowFragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

function CameraRig({
  progressRef,
  emphasis,
}: {
  progressRef: { current: number }
  emphasis: Emphasis
}) {
  const { camera, size } = useThree()
  const target = useMemo(() => new THREE.Vector3(ACTOR_X, 0.15, 0), [])

  useFrame((state, delta) => {
    const staging = STAGING[emphasis]
    const progress = progressRef.current

    // The staging distances assume a landscape canvas. A portrait canvas crops
    // far tighter at the same distance, so back off until the whole figure fits.
    const aspect = size.width / Math.max(size.height, 1)
    const fit = THREE.MathUtils.clamp((1.45 - aspect) / 0.95, 0, 1)

    const orbit = staging.orbit + Math.sin(progress * Math.PI * 2) * 0.15
    // Portrait phones open with a hero peek band — pull in a little and aim
    // higher so the upper body fills that clear top region.
    const distance =
      (staging.distance - progress * 0.18) * (1 + fit * 0.55)
    const height =
      staging.height + Math.sin(progress * Math.PI) * 0.15 + fit * 0.55

    // Wide layouts keep the reading column on the left, so truck the whole rig
    // left to park the presenter in the clear space beside it. Narrow layouts
    // run the column full width, so centre him instead.
    const frameShift = -1.5 * (1 - fit)

    const desiredX = ACTOR_X + frameShift + Math.sin(orbit) * distance
    const desiredZ = Math.cos(orbit) * distance
    const lerp = Math.min(1, delta * 1.7)

    camera.position.x += (desiredX - camera.position.x) * lerp
    camera.position.y += (height - camera.position.y) * lerp
    camera.position.z += (desiredZ - camera.position.z) * lerp

    const lookY = 0.15 + fit * 0.55 + Math.sin(state.clock.elapsedTime * 0.45) * 0.025
    target.x += (ACTOR_X + frameShift - target.x) * lerp
    target.y += (lookY - target.y) * lerp
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
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 5, 4]} intensity={0.7} color="#ffffff" />
      <CameraRig progressRef={progressRef} emphasis={emphasis} />
      <ContactShadow />
      <Actor
        progressRef={progressRef}
        emphasis={emphasis}
        beatKey={beatKey}
        beatIndex={beatIndex}
      />
    </Canvas>
  )
}
