import { useEffect, useState } from 'react'

/**
 * Tracks which single line is inside a narrow band at the middle of the
 * viewport, so the actor can react to every individual line rather than
 * whole sections.
 */
export function useFocusedBeat(ids: string[], initial: string) {
  const [focusedId, setFocusedId] = useState(initial)

  useEffect(() => {
    const nodes = ids
      .map((id) => document.querySelector<HTMLElement>(`[data-beat="${id}"]`))
      .filter((node): node is HTMLElement => Boolean(node))

    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const inBand = entries.filter((entry) => entry.isIntersecting)
        if (inBand.length === 0) return

        inBand.sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const id = inBand[0].target.getAttribute('data-beat')
        if (id) setFocusedId(id)
      },
      // Only the middle slice of the viewport counts as "being read".
      { rootMargin: '-44% 0px -44% 0px', threshold: [0, 0.2, 0.5, 1] }
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [ids])

  return focusedId
}
