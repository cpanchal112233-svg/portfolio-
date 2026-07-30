import { motion } from 'framer-motion'
import type { Beat } from '../data/narrative'

type BeatBlockProps = {
  beat: Beat
  isFocused: boolean
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="chip-row">
      {items.map((item) => (
        <span className="chip" key={item}>
          {item}
        </span>
      ))}
    </div>
  )
}

function BeatLink({ beat }: { beat: Beat }) {
  if (!beat.href) return null
  const external = beat.external ?? false
  return (
    <a
      className="beat-link"
      href={beat.href}
      rel={external ? 'noreferrer' : undefined}
      target={external ? '_blank' : undefined}
    >
      Open <span aria-hidden>→</span>
    </a>
  )
}

function BeatBody({ beat }: { beat: Beat }) {
  switch (beat.kind) {
    case 'headline':
      return (
        <>
          <h1 className="beat-headline">{beat.text}</h1>
          {beat.detail ? <p className="beat-subhead">{beat.detail}</p> : null}
        </>
      )
    case 'statement':
    case 'bullet':
      return (
        <>
          <p className="beat-text">{beat.text}</p>
          {beat.detail ? <p className="beat-detail">{beat.detail}</p> : null}
        </>
      )
    case 'metric':
      return (
        <>
          <p className="beat-metric">{beat.text}</p>
          {beat.detail ? <p className="beat-detail">{beat.detail}</p> : null}
        </>
      )
    case 'project':
      return (
        <>
          <div className="beat-head">
            <h3 className="beat-title">{beat.text}</h3>
            {beat.status ? <span className="beat-status">{beat.status}</span> : null}
          </div>
          {beat.detail ? <p className="beat-detail">{beat.detail}</p> : null}
          {beat.chips ? <Chips items={beat.chips} /> : null}
          <BeatLink beat={beat} />
        </>
      )
    case 'skillgroup':
      return (
        <>
          <h3 className="beat-title">{beat.text}</h3>
          {beat.chips ? <Chips items={beat.chips} /> : null}
        </>
      )
    case 'role':
    case 'education':
      return (
        <>
          <h3 className="beat-title">{beat.text}</h3>
          {beat.detail ? <p className="beat-dates">{beat.detail}</p> : null}
        </>
      )
    case 'resume':
      return (
        <>
          <p className="beat-resume-line">{beat.text}</p>
          {beat.detail ? <p className="beat-detail">{beat.detail}</p> : null}
        </>
      )
    case 'channel':
      return (
        <>
          <div className="beat-head">
            <h3 className="beat-title">{beat.text}</h3>
          </div>
          {beat.detail ? <p className="beat-detail">{beat.detail}</p> : null}
          <BeatLink beat={beat} />
        </>
      )
    default: {
      const exhaustive: never = beat.kind
      return exhaustive
    }
  }
}

export function BeatBlock({ beat, isFocused }: BeatBlockProps) {
  return (
    <motion.article
      className={`beat beat-${beat.kind}${isFocused ? ' is-focused' : ''}`}
      data-beat={beat.id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: [0.28, 0.11, 0.32, 1] }}
    >
      {beat.label ? <p className="beat-label">{beat.label}</p> : null}
      <BeatBody beat={beat} />
    </motion.article>
  )
}
