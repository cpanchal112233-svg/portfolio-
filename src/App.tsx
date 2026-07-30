import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import { ActorStage } from './components/ActorStage'
import { BeatBlock } from './components/BeatBlock'
import { Narrator } from './components/Narrator'
import {
  beats,
  beatsBySection,
  profile,
  sections,
  totalBeats,
  type SectionId,
} from './data/narrative'
import { useFocusedBeat } from './hooks/useFocusedBeat'
import { useHudHeight } from './hooks/useHudHeight'

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
  const hudRef = useHudHeight<HTMLElement>()
  const [progressPct, setProgressPct] = useState(0)

  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.3,
  })

  useMotionValueEvent(smoothProgress, 'change', (value) => {
    progressRef.current = value
    setProgressPct(Math.round(value * 100))
  })

  const velocity = useVelocity(scrollYProgress)
  const skew = useSpring(useTransform(velocity, [-2.5, 0, 2.5], [1.6, 0, -1.6]), {
    stiffness: 220,
    damping: 34,
  })
  const tiltX = useSpring(useTransform(velocity, [-2.5, 0, 2.5], [1.2, 0, -1.2]), {
    stiffness: 200,
    damping: 32,
  })
  const hudWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%'])

  const jumpTo = (id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="deck" data-section={activeSection}>
      <div className="deck-atmosphere" aria-hidden>
        <div className="aurora aurora-a" />
        <div className="aurora aurora-b" />
        <div className="aurora aurora-c" />
        <div className="vignette" />
      </div>

      {/* Full-viewport presenter — sits behind the slide deck. */}
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

      <div className="deck-light-rays" aria-hidden />

      <div className="frame-brackets" aria-hidden>
        <span className="bracket tl" />
        <span className="bracket tr" />
        <span className="bracket bl" />
        <span className="bracket br" />
      </div>

      <AnimatePresence>
        <motion.div
          className="warp-flash"
          key={activeSection}
          initial={{ opacity: 0.45 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          aria-hidden
        />
      </AnimatePresence>

      <header className="hud" ref={hudRef}>
        <div className="hud-row">
          <a className="hud-brand" href="#about">
            <span className="hud-mark">CP</span>
            <span className="hud-name">{profile.name}</span>
          </a>

          <nav className="hud-nav" aria-label="Chapters">
            {sections.map((section) => (
              <button
                className={activeSection === section.id ? 'hud-chip active' : 'hud-chip'}
                key={section.id}
                onClick={() => jumpTo(section.id)}
                type="button"
              >
                <span className="hud-chip-index">{section.index}</span>
                {section.nav}
              </button>
            ))}
          </nav>

          <div className="hud-readout" aria-live="polite">
            <span className="hud-line-counter">
              SLIDE {String(focusedIndex + 1).padStart(2, '0')}/{totalBeats}
            </span>
            <span className="hud-pct">{String(progressPct).padStart(3, '0')}%</span>
          </div>
        </div>
        <div className="hud-track">
          <motion.div className="hud-fill" style={{ width: hudWidth }} />
          {sections.map((section, i) => (
            <span
              className="hud-notch"
              key={section.id}
              style={{ left: `${(i / (sections.length - 1)) * 100}%` }}
            />
          ))}
        </div>
      </header>

      <div className="deck-body">
        <motion.main
          className="stream"
          style={{ skewY: skew, rotateX: tiltX, transformPerspective: 1200 }}
        >
          {beatsBySection.map(({ section, items }) => (
            <section className="chapter" id={section.id} key={section.id}>
              <div className="chapter-head">
                <span className="chapter-index" aria-hidden>
                  {section.index}
                </span>
                <div>
                  <h2 className="chapter-title">{section.title}</h2>
                  <p className="chapter-sub">{section.subtitle}</p>
                </div>
                <span className="chapter-cue">{section.cue}</span>
              </div>

              <div className={section.id === 'resume' ? 'chapter-beats dossier' : 'chapter-beats'}>
                {section.id === 'resume' ? <div className="dossier-scan" aria-hidden /> : null}
                {items.map((beat) => (
                  <BeatBlock
                    beat={beat}
                    index={beats.indexOf(beat)}
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
        </motion.main>
      </div>

      <div className="presenter-dock" aria-label="Presenter narration">
        <div className="presenter-hud" aria-hidden>
          <span className="presenter-hud-item">PRESENTER · LIVE</span>
          <span className="presenter-hud-item">{EMPHASIS_LABEL[focused.emphasis]}</span>
        </div>

        <div className="speech" role="status" aria-live="polite">
          <div className="speech-top">
            <span className="speech-pulse" aria-hidden />
            <span className="speech-label">{focused.label ?? 'Presenting'}</span>
            <span className="speech-count">
              {String(focusedIndex + 1).padStart(2, '0')}/{totalBeats}
            </span>
          </div>
          <Narrator text={focused.narration} />
          <div className="speech-bars" aria-hidden>
            {Array.from({ length: 14 }).map((_, i) => (
              <span className="bar" key={i} style={{ animationDelay: `${i * 0.06}s` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
