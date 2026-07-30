import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import type { Emphasis } from '../data/narrative'
import { ErrorBoundary } from './ErrorBoundary'

const ActorScene = lazy(() =>
  import('../three/ActorScene').then((module) => ({ default: module.ActorScene }))
)

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

function StaticActor({ emphasis, variant }: { emphasis: Emphasis; variant: 'background' | 'panel' }) {
  return (
    <div className={variant === 'background' ? 'actor-static actor-static-bg' : 'actor-static'}>
      <img alt="Chintan Panchal presenting" src={FALLBACK_POSES[emphasis]} />
    </div>
  )
}

type ActorStageProps = {
  progressRef: { current: number }
  emphasis: Emphasis
  beatKey: string
  beatIndex: number
  variant?: 'background' | 'panel'
}

export function ActorStage({
  progressRef,
  emphasis,
  beatKey,
  beatIndex,
  variant = 'panel',
}: ActorStageProps) {
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
    const id = window.requestAnimationFrame(() => setEnabled(true))
    return () => window.cancelAnimationFrame(id)
  }, [reducedMotion])

  const canvasClass =
    variant === 'background' ? 'actor-canvas actor-canvas-bg' : 'actor-canvas'

  if (!enabled) {
    return (
      <div className={canvasClass}>
        <StaticActor emphasis={emphasis} variant={variant} />
      </div>
    )
  }

  return (
    <div className={canvasClass}>
      <ErrorBoundary
        fallback={<StaticActor emphasis={emphasis} variant={variant} />}
        onError={() => setEnabled(false)}
      >
        <Suspense fallback={<StaticActor emphasis={emphasis} variant={variant} />}>
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
