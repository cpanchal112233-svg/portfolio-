import { useEffect, useState } from 'react'

/** Reading line sits above the caption, in the reading column on the left. */
function readingLine() {
  const viewport = window.innerHeight
  const dock = document.querySelector('.caption-dock')

  if (dock) {
    const rect = dock.getBoundingClientRect()
    const top = Math.max(viewport * 0.28, 120)
    const bottom = Math.max(rect.top - viewport * 0.1, top + 80)
    return top + (bottom - top) * 0.48
  }

  return viewport * 0.44
}

function documentTop(node: HTMLElement) {
  let top = 0
  let current: HTMLElement | null = node
  while (current) {
    top += current.offsetTop
    current = current.offsetParent as HTMLElement | null
  }
  return top
}

export function useFocusedBeat(ids: string[], initial: string) {
  const [focusedId, setFocusedId] = useState(initial)

  useEffect(() => {
    const nodes = ids
      .map((id) => document.querySelector<HTMLElement>(`[data-beat="${id}"]`))
      .filter((node): node is HTMLElement => Boolean(node))

    if (nodes.length === 0) return

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
