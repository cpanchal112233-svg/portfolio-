import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { useMemo, useRef } from 'react'
import { ActorStage } from './components/ActorStage'
import { BeatBlock } from './components/BeatBlock'
import { Narrator } from './components/Narrator'
import {
  beats,
  beatsBySection,
  profile,
  sections,
  type SectionId,
} from './data/narrative'
import { useFocusedBeat } from './hooks/useFocusedBeat'

const EMPHASIS_LABEL = {
  welcome: 'Opening',
  point: 'Pointing',
  present: 'Presenting',
  reflect: 'Explaining',
  invite: 'Closing',
} as const

function App() {
  const beatIds = useMemo(() => beats.map((beat) => beat.id), [])
  const focusedId = useFocusedBeat(beatIds, beats[0].id)

  const focusedIndex = Math.max(
    0,
    beats.findIndex((beat) => beat.id === focusedId)
  )
  const focused = beats[focusedIndex]
  const activeSection: SectionId = focused.section

  const progressRef = useRef(0)

  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.3,
  })

  useMotionValueEvent(smoothProgress, 'change', (value) => {
    progressRef.current = value
  })

  const jumpTo = (id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="deck" data-section={activeSection}>
      {/* Full-viewport presenter, standing behind the reading column. */}
      <div className="deck-actor-bg" aria-hidden>
        <ActorStage
          progressRef={progressRef}
          emphasis={focused.emphasis}
          beatKey={focused.id}
          beatIndex={focusedIndex}
          variant="background"
        />
      </div>
      <div className="deck-actor-scrim" aria-hidden />

      <header className="nav">
        <div className="nav-row">
          <a className="nav-brand" href="#about">
            {profile.name}
          </a>
          <nav className="nav-links" aria-label="Sections">
            {sections.map((section) => (
              <button
                className={activeSection === section.id ? 'nav-link active' : 'nav-link'}
                key={section.id}
                onClick={() => jumpTo(section.id)}
                type="button"
              >
                {section.nav}
              </button>
            ))}
          </nav>
        </div>
        <motion.div className="nav-progress" style={{ scaleX: smoothProgress }} />
      </header>

      <div className="deck-body">
        <main className="stream">
          {beatsBySection.map(({ section, items }) => (
            <section className="chapter" id={section.id} key={section.id}>
              <div className="chapter-head">
                <span className="chapter-index">{section.index}</span>
                <h2 className="chapter-title">{section.title}</h2>
                <p className="chapter-sub">{section.subtitle}</p>
              </div>

              <div className="chapter-beats">
                {items.map((beat) => (
                  <BeatBlock
                    beat={beat}
                    isFocused={beat.id === focusedId}
                    key={beat.id}
                  />
                ))}
              </div>
            </section>
          ))}

          <footer className="deck-footer">
            <p>
              {profile.name} · {profile.location}
            </p>
            <p className="deck-footer-links">
              <a href={profile.resumeHref} rel="noreferrer" target="_blank">
                Resume
              </a>
              <a href={profile.github} rel="noreferrer" target="_blank">
                GitHub
              </a>
              <a href={profile.linkedin} rel="noreferrer" target="_blank">
                LinkedIn
              </a>
            </p>
          </footer>
        </main>
      </div>

      <div className="caption-dock">
        <div className="caption" role="status" aria-live="polite">
          <p className="caption-label">
            {focused.label ?? EMPHASIS_LABEL[focused.emphasis]}
          </p>
          <Narrator text={focused.narration} />
        </div>
      </div>
    </div>
  )
}

export default App
