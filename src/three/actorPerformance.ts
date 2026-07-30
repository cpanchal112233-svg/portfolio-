import type { Emphasis } from '../data/narrative'

/** Presentation choreography IDs for the actor vertex shader. */
export type ActId = 0 | 1 | 2 | 3 | 4 | 5

const EMPHASIS_ACT: Record<Emphasis, ActId> = {
  welcome: 0,
  point: 1,
  present: 2,
  reflect: 3,
  invite: 4,
}

/** Each scroll line triggers a presentation beat; emphasis sets the gesture family. */
export function actIdForLine(emphasis: Emphasis, beatIndex: number): ActId {
  return ((EMPHASIS_ACT[emphasis] + (beatIndex % 3)) % 6) as ActId
}

/** Ease-out-back — reads like a presenter hitting a keyframe, not linear drift. */
export function easePerformance(t: number): number {
  const clamped = Math.min(1, Math.max(0, t))
  const c1 = 1.525
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(clamped - 1, 3) + c1 * Math.pow(clamped - 1, 2)
}

export const ACT_DURATION = 1.5
