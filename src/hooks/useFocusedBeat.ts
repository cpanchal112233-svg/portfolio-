import { useEffect, useState } from 'react'

/**
 * Returns the y position that counts as "being read". On the stacked layout the
 * actor sits above the text, so the reading line moves below the stage.
 */
function readingLine() {
  const viewport = window.innerHeight
  const stage = document.querySelector('.stage')

  if (stage) {
    const rect = stage.getBoundingClientRect()
    const stacked = rect.width > window.innerWidth * 0.8
    if (stacked) {
      // Keep the line inside the text column below the actor, and never let a
      // tall stage push it off the bottom of the screen. Sitting slightly above
      // the middle of the column matches where people actually read.
      const columnTop = Math.min(rect.bottom, viewport * 0.72)
      return columnTop + (viewport - columnTop) * 0.42
    }
  }

  return viewport / 2
}

/**
 * Layout position in document space. Uses offsetTop rather than a client rect
 * because the stream carries a scroll-velocity transform, and a transformed rect
 * would shift each line by a different amount and mis-report the focused line.
 */
function documentTop(node: HTMLElement) {
  let top = 0
  let current: HTMLElement | null = node
  while (current) {
    top += current.offsetTop
    current = current.offsetParent as HTMLElement | null
  }
  return top
}

/**
 * Tracks the single line closest to the reading line so the actor can react to
 * every individual line rather than whole sections.
 *
 * Distance is measured instead of intersection ratio: ratio is relative to each
 * element's own height, which would let a short neighbour outrank the tall line
 * the reader is actually on.
 */
export function useFocusedBeat(ids: string[], initial: string) {
  const [focusedId, setFocusedId] = useState(initial)

  useEffect(() => {
    const nodes = ids
      .map((id) => document.querySelector<HTMLElement>(`[data-beat="${id}"]`))
      .filter((node): node is HTMLElement => Boolean(node))

    if (nodes.length === 0) return

    // Only on-screen lines get measured, keeping the scroll handler cheap.
    const onScreen = new Set<HTMLElement>()
    let frame = 0

    const pick = () => {
      frame = 0
      const line = window.scrollY + readingLine()

      let bestId: string | null = null
      let bestScore = Number.POSITIVE_INFINITY

      onScreen.forEach((node) => {
        const top = documentTop(node)
        const bottom = top + node.offsetHeight
        const centre = top + node.offsetHeight / 2
        const spansLine = top <= line && bottom >= line
        // A line crossing the reading line always wins over one merely near it.
        const score = spansLine
          ? Math.abs(centre - line) * 0.001
          : Math.abs(centre - line)

        if (score < bestScore) {
          bestScore = score
          bestId = node.dataset.beat ?? null
        }
      })

      const next = bestId
      if (next !== null) {
        setFocusedId((current) => (current === next ? current : next))
      }
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(pick)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const node = entry.target as HTMLElement
          if (entry.isIntersecting) onScreen.add(node)
          else onScreen.delete(node)
        })
        schedule()
      },
      { threshold: 0 }
    )

    nodes.forEach((node) => observer.observe(node))
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [ids])

  return focusedId
}
