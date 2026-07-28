import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import type { Emphasis } from '../data/narrative'
import { ErrorBoundary } from './ErrorBoundary'

const ActorScene = lazy(() =>
  import('../three/ActorScene').then((module) => ({ default: module.ActorScene }))
)

/** Mirrors the pose map so the fallback never pulls three.js into the main bundle. */
const FALLBACK_POSES: Record<Emphasis, string> = {
  welcome: '/actor/about.webp',
  point: '/actor/projects.webp',
  present: '/actor/skills.webp',
  reflect: '/actor/experience.webp',
  invite: '/actor/contact.webp',
}

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
    )
  } catch {
    return false
  }
}

function StaticActor({ emphasis }: { emphasis: Emphasis }) {
  return (
    <div className="actor-static">
      <img alt="3D avatar of Chintan Panchal" src={FALLBACK_POSES[emphasis]} />
    </div>
  )
}

type ActorStageProps = {
  progressRef: { current: number }
  emphasis: Emphasis
  beatKey: string
  beatIndex: number
}

export function ActorStage({ progressRef, emphasis, beatKey, beatIndex }: ActorStageProps) {
  const [enabled, setEnabled] = useState(false)

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  useEffect(() => {
    if (reducedMotion) return
    if (!hasWebGL()) return
    // Mount the scene after first paint so the portfolio content is never blocked.
    const id = window.requestAnimationFrame(() => setEnabled(true))
    return () => window.cancelAnimationFrame(id)
  }, [reducedMotion])

  if (!enabled) {
    return (
      <div className="actor-canvas">
        <StaticActor emphasis={emphasis} />
      </div>
    )
  }

  return (
    <div className="actor-canvas">
      <ErrorBoundary fallback={<StaticActor emphasis={emphasis} />} onError={() => setEnabled(false)}>
        <Suspense fallback={<StaticActor emphasis={emphasis} />}>
          <ActorScene
            progressRef={progressRef}
            emphasis={emphasis}
            beatKey={beatKey}
            beatIndex={beatIndex}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
