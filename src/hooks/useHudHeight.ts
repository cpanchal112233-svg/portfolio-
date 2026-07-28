import { useEffect, useRef } from 'react'

/**
 * The HUD wraps to two or three rows on narrow screens and grows with the user's
 * font size, so its height cannot be hardcoded: every sticky offset measured from
 * it would tuck underneath the bar. Publishing the measured height as `--hud-h`
 * keeps the chapter headers, the stage, and the scroll margins honest.
 */
export function useHudHeight<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const publish = () => {
      const { height } = node.getBoundingClientRect()
      document.documentElement.style.setProperty('--hud-h', `${Math.round(height)}px`)
    }

    publish()

    const observer = new ResizeObserver(publish)
    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return ref
}
