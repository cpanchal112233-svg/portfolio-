import { AnimatePresence, motion } from 'framer-motion'
import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import {
  certifications,
  educationHistory,
  linkedinTopSkills,
  profile,
  projects,
  quickStats,
  sceneRoadSigns,
  scenes,
  skillGroups,
  workHistory,
  type Scene,
  type SceneId,
} from './data/siteContent'
import { BinaryRain } from './components/BinaryRain'
import { ErrorBoundary } from './components/ErrorBoundary'
import './styles.css'

const PortfolioThreeHero = lazy(async () => {
  const mod = await import('./components/PortfolioThreeHero')
  return { default: mod.PortfolioThreeHero }
})

type Theme = {
  sky: string
  glow: string
  accent: string
  horizon: string
  road: string
}

const sceneThemes: Record<SceneId, Theme> = {
  about: { sky: '#0c1118', glow: '#5b8ab8', accent: '#9ec5e8', horizon: '#152028', road: '#0a0e14' },
  projects: { sky: '#0c1016', glow: '#6b7ed4', accent: '#b4c2f0', horizon: '#181c2a', road: '#0a0d14' },
  skills: { sky: '#0a1214', glow: '#4a9e9e', accent: '#8fd4d4', horizon: '#122226', road: '#080e10' },
  experience: { sky: '#101010', glow: '#c49a6c', accent: '#e8c9a8', horizon: '#2a2218', road: '#120f0c' },
  contact: { sky: '#0a1012', glow: '#5a9d7a', accent: '#a8d4bf', horizon: '#122218', road: '#080d0c' },
}

function clampSceneIndex(index: number) {
  return Math.max(0, Math.min(scenes.length - 1, index))
}

function renderSceneBody(scene: Scene, projectIndex: number, setProjectIndex: (n: number) => void) {
  const project = projects[projectIndex]

  switch (scene.id) {
    case 'about':
      return (
        <div className="panel-section-stack">
          <div className="hero-copy">
            <p className="eyebrow">Professional snapshot</p>
            <h2>{profile.name}</h2>
            <p className="hero-lede">{profile.headline}</p>
            <p className="hero-text">{profile.intro}</p>
            <p className="hero-text hero-text--emphasis">{profile.valueLine}</p>
          </div>
          <div className="stats-grid">
            {quickStats.map((stat) => (
              <div className="stat-card" key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
          <div className="cert-grid">
            {certifications.map((c) => (
              <div className="cert-pill" key={c.name}>
                <span className="cert-pill__name">{c.name}</span>
                {c.issuer ? <span className="cert-pill__issuer">{c.issuer}</span> : null}
              </div>
            ))}
          </div>
          <p className="linkedin-snapshot">
            <strong>LinkedIn top skills:</strong> {linkedinTopSkills.join(' · ')}
          </p>
          <ul className="bullet-list">
            {scene.facts?.map((fact) => <li key={fact}>{fact}</li>)}
          </ul>
        </div>
      )
    case 'projects':
      return (
        <div className="panel-section-stack">
          <div className="project-rail">
            {projects.map((item, index) => (
              <button
                className={`project-chip${index === projectIndex ? ' active' : ''}`}
                key={item.title}
                onClick={() => setProjectIndex(index)}
                type="button"
              >
                {item.title}
              </button>
            ))}
          </div>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="feature-card"
            initial={{ opacity: 0, y: 16 }}
            key={project.title}
            transition={{ duration: 0.35 }}
          >
            <div className="feature-card-glow" style={{ background: project.accent }} />
            <p className="eyebrow">
              Project focus
              {project.status === 'in-progress' ? ' · In progress' : null}
            </p>
            <h2>{project.title}</h2>
            <p className="hero-text">{project.summary}</p>
            <div className="pill-row">
              {project.stack.map((item) => (
                <span className="stack-pill" key={item}>
                  {item}
                </span>
              ))}
            </div>
            {project.href ? (
              <p className="hero-text" style={{ marginTop: '0.75rem' }}>
                <a href={project.href} rel="noreferrer" target="_blank">
                  View on GitHub / live →
                </a>
              </p>
            ) : null}
          </motion.div>
        </div>
      )
    case 'skills':
      return (
        <div className="panel-section-stack">
          {skillGroups.map((group) => (
            <div className="skill-card" key={group.label}>
              <p className="eyebrow">{group.label}</p>
              <div className="pill-row">
                {group.items.map((item) => (
                  <span className="stack-pill" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    case 'experience':
      return (
        <div className="panel-section-stack">
          {workHistory.map((role) => (
            <div className="timeline-card" key={`${role.company}-${role.title}-${role.start}`}>
              <p className="eyebrow">{role.current ? 'Current role' : 'Previous role'}</p>
              <h2>{role.title}</h2>
              <p className="hero-text">
                {role.company} · {role.location}
              </p>
              <p className="timeline-dates">
                {role.start} — {role.end}
              </p>
              <ul className="bullet-list compact">
                {role.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
          {educationHistory.map((ed) => (
            <div className="timeline-card" key={ed.school}>
              <p className="eyebrow">Education</p>
              <h2>{ed.school}</h2>
              <p className="hero-text">{ed.credential}</p>
              <p className="timeline-dates">{ed.dates}</p>
              {ed.note ? <p className="hero-text timeline-note">{ed.note}</p> : null}
            </div>
          ))}
        </div>
      )
    case 'contact':
      return (
        <div className="panel-section-stack">
          <div className="contact-grid">
            <a className="contact-card" href={`mailto:${profile.email}`}>
              <span>Email</span>
              <strong>{profile.email}</strong>
            </a>
            <a className="contact-card" href={profile.github} rel="noreferrer" target="_blank">
              <span>GitHub</span>
              <strong>@cpanchal112233-svg</strong>
            </a>
            <a className="contact-card" href={profile.linkedin} rel="noreferrer" target="_blank">
              <span>LinkedIn</span>
              <strong>Open profile</strong>
            </a>
            <a className="contact-card" href={`tel:${profile.phone.replace(/\s+/g, '')}`}>
              <span>Phone</span>
              <strong>{profile.phoneDisplay}</strong>
            </a>
            <a className="contact-card" href={profile.githubTaruRepo} rel="noreferrer" target="_blank">
              <span>TARU (current build)</span>
              <strong>Flutter + Firebase</strong>
            </a>
            <a className="contact-card" href={profile.companyWebsite} rel="noreferrer" target="_blank">
              <span>Company website</span>
              <strong>uncodeworld.com</strong>
            </a>
            {profile.portfolioUrl.startsWith('http') ? (
              <a className="contact-card" href={profile.portfolioUrl} rel="noreferrer" target="_blank">
                <span>Live portfolio</span>
                <strong>Vercel</strong>
              </a>
            ) : null}
            <a className="contact-card" href={profile.adobePortfolioUrl} rel="noreferrer" target="_blank">
              <span>Visual portfolio</span>
              <strong>Adobe</strong>
            </a>
          </div>
          <div className="timeline-card final-note">
            <p className="eyebrow">Availability</p>
            <h2>Open to the right team</h2>
            <p className="hero-text">
              Looking for software engineering roles and builder partnerships in the UK where I can contribute to real
              systems, ship constantly, and keep raising the bar on quality. Happy to share code, diagrams, or
              references once we are in conversation.
            </p>
          </div>
        </div>
      )
    default: {
      const _exhaustive: never = scene.id
      throw new Error(`Unhandled scene: ${_exhaustive}`)
    }
  }
}

function App() {
  const [entered, setEntered] = useState(false)
  const [sceneIndex, setSceneIndex] = useState(0)
  const [projectIndex, setProjectIndex] = useState(0)
  const [recruiterMode, setRecruiterMode] = useState(false)
  const [carStopped, setCarStopped] = useState(false)
  const programmaticScrollRef = useRef(false)
  const sceneIndexRef = useRef(sceneIndex)

  const activeScene = scenes[sceneIndex]
  const theme = sceneThemes[activeScene.id]

  const scrollToSceneIndex = useCallback((next: number, behavior: ScrollBehavior = 'smooth') => {
    const i = clampSceneIndex(next)
    const id = scenes[i]?.id
    if (!id) return
    const el = document.getElementById(id)
    programmaticScrollRef.current = true
    if (sceneIndexRef.current !== i) {
      sceneIndexRef.current = i
      setCarStopped(false)
    }
    setSceneIndex(i)
    el?.scrollIntoView({ behavior, block: 'start' })
    window.setTimeout(() => {
      programmaticScrollRef.current = false
    }, 900)
  }, [])

  useEffect(() => {
    if (!entered) return

    const sectionEls = scenes
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n))

    if (sectionEls.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (programmaticScrollRef.current) return
        const visible = entries
          .filter((e) => e.isIntersecting && e.intersectionRatio >= 0.2)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const best = visible[0]
        if (!best?.target?.id) return
        const id = best.target.id as SceneId
        const idx = scenes.findIndex((s) => s.id === id)
        if (idx >= 0 && sceneIndexRef.current !== idx) {
          sceneIndexRef.current = idx
          setCarStopped(false)
          setSceneIndex(idx)
        }
      },
      { root: null, threshold: [0.15, 0.25, 0.35, 0.5, 0.65] }
    )

    sectionEls.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [entered])

  useEffect(() => {
    if (!entered) return
    const raw = window.location.hash.replace(/^#/, '') as SceneId
    const match = scenes.find((s) => s.id === raw)
    if (!match) return
    const i = scenes.indexOf(match)
    requestAnimationFrame(() => {
      scrollToSceneIndex(i, 'auto')
    })
  }, [entered, scrollToSceneIndex])

  useEffect(() => {
    if (!entered) return
    const id = scenes[sceneIndex]?.id
    if (!id) return
    const nextHash = `#${id}`
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', nextHash)
    }
  }, [entered, sceneIndex])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!entered) return
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault()
        scrollToSceneIndex(sceneIndex + 1)
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault()
        scrollToSceneIndex(sceneIndex - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [entered, sceneIndex, scrollToSceneIndex])

  useEffect(() => {
    if (activeScene.id !== 'projects' || carStopped) {
      return
    }

    const interval = window.setInterval(() => {
      setProjectIndex((current) => (current + 1) % projects.length)
    }, 3500)

    return () => window.clearInterval(interval)
  }, [activeScene.id, carStopped])

  const roadsideSigns = useMemo(() => sceneRoadSigns[activeScene.id], [activeScene.id])

  return (
    <div
      className={`app-shell${entered ? ' entered' : ''}${recruiterMode ? ' recruiter-mode' : ''}${carStopped ? ' car-stopped-global' : ''}`}
      style={
        {
          '--scene-sky': theme.sky,
          '--scene-glow': theme.glow,
          '--scene-accent': theme.accent,
          '--scene-horizon': theme.horizon,
          '--scene-road': theme.road,
        } as CSSProperties
      }
    >
      <div className="cinematic-backdrop">
        <BinaryRain />
        <div className="ambient-orb orb-left" />
        <div className="ambient-orb orb-right" />
        <div className="stars" />
        <div className="cityline cityline-back" />
        <div className="cityline cityline-front" />
        <div className="road-glow" />
        <div className="road-lanes" />
      </div>

      <AnimatePresence>
        {!entered && (
          <motion.section
            animate={{ opacity: 1 }}
            className="intro-overlay"
            exit={{ opacity: 0 }}
            initial={{ opacity: 1 }}
            transition={{ duration: 0.45 }}
          >
            <div className="intro-copy">
              <p className="eyebrow">Portfolio tour</p>
              <h1>
                <span>Chintan Panchal</span> — software engineer
              </h1>
              <p>
                Scroll through five short chapters — profile, projects, skills, experience, contact. Each section starts
                as a quick glance; use <strong>Pause &amp; expand</strong> when you want the full detail. Built to
                respect your time and still show depth.
              </p>
              <div className="intro-actions">
                <button className="primary-button" onClick={() => setEntered(true)} type="button">
                  Begin the tour
                </button>
                <button
                  className="secondary-button"
                  onClick={() => {
                    setRecruiterMode(true)
                    setEntered(true)
                  }}
                  type="button"
                >
                  Compact scan first
                </button>
              </div>
            </div>
            <div className="intro-vehicle">
              <div className="intro-cockpit glass-panel">
                <ErrorBoundary fallback={<div className="three-hero three-hero--fallback" />}>
                  <Suspense fallback={<div className="three-hero three-hero--fallback" />}>
                    <PortfolioThreeHero />
                  </Suspense>
                </ErrorBoundary>
                <div className="intro-cockpit-overlay">
                  <img alt="Chintan Panchal" className="intro-avatar" src="/avatar-realistic.png" />
                  <div className="intro-wheel" />
                  <div className="intro-dashboard-line" />
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="experience-grid">
        <header className="top-bar glass-panel">
          <div>
            <p className="eyebrow">Interactive CV</p>
            <p className="top-bar__title">{profile.name}</p>
            <p className="top-bar__tagline">{profile.headline}</p>
            <p className="top-bar__hint">
              Scroll sections · Pause to expand · Tags in the preview · Arrow keys to jump
            </p>
          </div>
          <div className="top-actions">
            <div className="status-chip glass-panel-soft">{activeScene.destination}</div>
            <button className="ghost-button" onClick={() => setRecruiterMode((current) => !current)} type="button">
              {recruiterMode ? 'Standard view' : 'Recruiter scan'}
            </button>
          </div>
        </header>

        <aside className="driver-stage">
          <motion.div
            animate={{ x: 0, opacity: 1 }}
            className="avatar-wrap"
            initial={{ x: -24, opacity: 0 }}
            transition={{ duration: 0.55, delay: entered ? 0.15 : 0.4 }}
          >
            <div className={`dialogue-bubble glass-panel${carStopped ? ' dialogue-bubble--stopped' : ''}`}>
              <p className="eyebrow">
                {carStopped ? 'Expanded — full detail' : `Preview · ${activeScene.destination}`}
              </p>
              <p>{carStopped ? activeScene.pulledOverDetail : activeScene.dialogue}</p>
            </div>

            <motion.div
              animate={
                carStopped
                  ? { x: 0, y: 0, rotate: 0 }
                  : { x: [0, 3, 0], y: [0, -2, 0], rotate: [0, -0.2, 0.2, 0] }
              }
              className={`cockpit-shell glass-panel${carStopped ? ' car-stopped' : ''}`}
              key={activeScene.id}
              transition={{ duration: carStopped ? 0.45 : 1.2, ease: 'easeInOut' }}
            >
              <div className="windshield-shell">
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  className="windshield-view"
                  initial={{ opacity: 0.7, scale: 1.02 }}
                  key={activeScene.id}
                  transition={{ duration: 0.55 }}
                >
                  <div className="sky-gradient" />
                  <div className="windshield-nature" aria-hidden />
                  <div className="horizon-glow" />
                  <BinaryRain className="windshield-binary" dense />
                  <div className="world-buildings world-back" />
                  <div className="world-buildings world-front" />
                  <div className="road-perspective" />
                  <div className="lane-streaks" />
                  {roadsideSigns.map((sign, index) => {
                    const signClass = `sign-${(index % 5) + 1}`
                    return (
                      <motion.div
                        animate={
                          carStopped
                            ? { x: '38%', opacity: 1 }
                            : { x: ['110%', '-35%'], opacity: [0, 1, 1, 0] }
                        }
                        className={`roadside-sign ${signClass}`}
                        key={`${activeScene.id}-${sign.label}-${sign.tag}`}
                        transition={
                          carStopped
                            ? { duration: 0.5, ease: 'easeOut' }
                            : {
                                duration: 5 + index * 0.65,
                                ease: 'linear',
                                repeat: Infinity,
                                delay: index * 0.75,
                              }
                        }
                      >
                        <span className="roadside-sign__tag">{sign.tag}</span>
                        <span className="roadside-sign__label">{sign.label}</span>
                        {sign.sub ? <span className="roadside-sign__sub">{sign.sub}</span> : null}
                      </motion.div>
                    )
                  })}
                  <motion.div
                    animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -6] }}
                    className="destination-board"
                    key={`${activeScene.id}-destination`}
                    transition={{ duration: 1.8, ease: 'easeOut' }}
                  >
                    <span>{activeScene.routeLabel}</span>
                    <strong>{activeScene.destination}</strong>
                  </motion.div>
                </motion.div>
                <div className="windshield-frame" />
                <div className="rearview-mirror" />
              </div>

              <div className="cabin-interior">
                <div className="seat-shadow" />
                <div className="avatar-glow" />
                <img alt="Chintan Panchal" className="avatar-driver" src="/avatar-realistic.png" />
                <div className="seatbelt" />
                <motion.div
                  animate={{ rotate: [0, sceneIndex % 2 === 0 ? -4 : 4, 0] }}
                  className="steering-wheel"
                  transition={{ duration: 1, ease: 'easeInOut' }}
                >
                  <span className="wheel-core" />
                </motion.div>
                <div className="pull-over-tray">
                  <button
                    className={carStopped ? 'secondary-button' : 'primary-button'}
                    onClick={() => setCarStopped((v) => !v)}
                    type="button"
                  >
                    {carStopped ? 'Continue tour' : 'Pause &amp; expand section'}
                  </button>
                </div>
                <div className="dashboard-panel">
                  <div>
                    <span className="dashboard-label">View</span>
                    <strong>{recruiterMode ? 'Scan-friendly' : 'Narrative'}</strong>
                  </div>
                  <div>
                    <span className="dashboard-label">Depth</span>
                    <strong>{carStopped ? 'Full detail' : activeScene.speed}</strong>
                  </div>
                  <div>
                    <span className="dashboard-label">Preview</span>
                    <strong>{carStopped ? 'Static tags' : activeScene.roadsideHint}</strong>
                  </div>
                </div>
                <div className="gps-strip">
                  {scenes.map((scene, index) => (
                    <button
                      aria-label={`Jump to ${scene.title}`}
                      className={`gps-node${scene.id === activeScene.id ? ' active' : ''}`}
                      key={scene.id}
                      onClick={() => scrollToSceneIndex(index)}
                      type="button"
                    >
                      <span />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </aside>

        <main className="content-stage">
          <nav aria-label="Portfolio route stops" className="chapter-nav glass-panel">
            {scenes.map((scene, index) => (
              <button
                className={`chapter-pill${scene.id === activeScene.id ? ' active' : ''}`}
                key={scene.id}
                onClick={() => scrollToSceneIndex(index)}
                type="button"
              >
                {scene.title}
              </button>
            ))}
          </nav>

          <div className="content-stage__sections">
            {scenes.map((scene) => (
              <section
                key={scene.id}
                id={scene.id}
                className="route-section content-panel glass-panel"
                aria-labelledby={`heading-${scene.id}`}
              >
                <p className="eyebrow">{scene.routeLabel}</p>
                <h2 id={`heading-${scene.id}`}>{scene.title}</h2>
                <p className="panel-subtitle">{scene.subtitle}</p>
                <div className="highlight-box">
                  <span className="highlight-dot" />
                  <p>{scene.highlight}</p>
                </div>
                {scene.id === activeScene.id ? (
                  carStopped ? (
                    renderSceneBody(scene, projectIndex, setProjectIndex)
                  ) : (
                    <div className="cruising-gate">
                      <p>
                        You are seeing the <strong>preview</strong> for this chapter — enough to orient you in under a
                        minute. When you want CV-level depth (bullet roles, full skills, certifications, project
                        stacks), pause here. The preview panel updates with short tags as you scroll.
                      </p>
                      <button className="primary-button" onClick={() => setCarStopped(true)} type="button">
                        Pause &amp; show full detail
                      </button>
                    </div>
                  )
                ) : (
                  <p className="route-idle-hint">
                    Scroll this section into view and use <strong>Pause &amp; expand</strong> in the panel to read
                    everything for this chapter.
                  </p>
                )}
              </section>
            ))}
          </div>

          <div className="route-controls glass-panel route-controls--sticky">
            <button
              className="secondary-button"
              disabled={sceneIndex === 0}
              onClick={() => scrollToSceneIndex(sceneIndex - 1)}
              type="button"
            >
              Previous section
            </button>
            <div className="route-progress">
              <span>{String(sceneIndex + 1).padStart(2, '0')}</span>
              <div className="route-line">
                <div className="route-line-fill" style={{ width: `${((sceneIndex + 1) / scenes.length) * 100}%` }} />
              </div>
              <span>{String(scenes.length).padStart(2, '0')}</span>
            </div>
            <button
              className="primary-button"
              disabled={sceneIndex === scenes.length - 1}
              onClick={() => scrollToSceneIndex(sceneIndex + 1)}
              type="button"
            >
              Next section
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
