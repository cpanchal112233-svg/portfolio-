import { useEffect, useMemo, useState } from 'react'

/** Types the narration out so the actor reads each line rather than flashing it. */
export function Narrator({ text, speed = 16 }: { text: string; speed?: number }) {
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  const [shown, setShown] = useState(reducedMotion ? text : '')

  useEffect(() => {
    if (reducedMotion) {
      setShown(text)
      return
    }

    setShown('')
    let index = 0
    const timer = window.setInterval(() => {
      index += 1
      setShown(text.slice(0, index))
      if (index >= text.length) window.clearInterval(timer)
    }, speed)

    return () => window.clearInterval(timer)
  }, [text, speed, reducedMotion])

  return (
    <p className="narration">
      {shown}
      {shown.length < text.length ? <span className="caret" aria-hidden /> : null}
    </p>
  )
}
