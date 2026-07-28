import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  certifications,
  educationHistory,
  linkedinTopSkills,
  profile,
  projects,
  quickStats,
  sections,
  skillGroups,
  workHistory,
  type SectionId,
} from './data/siteContent'

const SECTION_ORDER: SectionId[] = ['about', 'projects', 'skills', 'experience', 'contact']

function App() {
  const [active, setActive] = useState<SectionId>('about')
  const [scrollPct, setScrollPct] = useState(0)
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.35 })

  const avatarY = useTransform(smoothProgress, [0, 0.2, 0.4, 0.65, 0.85, 1], [0, 28, 62, 38, 72, 18])
  const avatarX = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [0, -14, 10, -18, 4])
  const avatarRotate = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [0, -4.5, 3.5, -3, 1.5])
  const avatarScale = useTransform(smoothProgress, [0, 0.35, 0.7, 1], [1, 1.06, 0.97, 1.03])
  const ringSpin = useTransform(smoothProgress, [0, 1], [0, 220])
  const ringSpinReverse = useTransform(ringSpin, (v) => -v * 0.7)
  const beamOpacity = useTransform(smoothProgress, [0, 0.08, 0.9, 1], [0.35, 0.9, 0.85, 0.4])
  const hudWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%'])

  const activeSection = sections.find((s) => s.id === active) ?? sections[0]
  const activeIndex = SECTION_ORDER.indexOf(active)

  useMotionValueEvent(smoothProgress, 'change', (v) => {
    setScrollPct(Math.round(v * 100))
  })

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n))

    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const best = visible[0]
        if (!best?.target?.id) return
        setActive(best.target.id as SectionId)
      },
      { root: null, threshold: [0.2, 0.4, 0.55, 0.7], rootMargin: '-14% 0px -38% 0px' }
    )

    nodes.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const lean = useMemo(() => {
    const leans: Record<SectionId, number> = {
      about: -2,
      projects: -8,
      skills: -5,
      experience: -7,
      contact: -3,
    }
    return leans[active]
  }, [active])

  return (
    <div className="site" data-active={active}>
      <div className="site-atmosphere" aria-hidden>
        <div className="grid-plane" />
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="scanlines" />
      </div>

      <div className="scroll-hud" aria-hidden>
        <div className="scroll-hud-track">
          <motion.div className="scroll-hud-fill" style={{ width: hudWidth }} />
        </div>
        <span className="scroll-hud-label">NAV {String(scrollPct).padStart(2, '0')}%</span>
      </div>

      <header className="topnav">
        <a className="brand" href="#about">
          <span className="brand-mark">CP</span>
          <span className="brand-name">{profile.name}</span>
          <span className="brand-epoch">22C</span>
        </a>
        <nav className="topnav-links" aria-label="Primary">
          {sections.map((s) => (
            <button
              key={s.id}
              className={active === s.id ? 'nav-link active' : 'nav-link'}
              onClick={() => scrollTo(s.id)}
              type="button"
            >
              {s.nav}
            </button>
          ))}
        </nav>
        <a className="topnav-cta" href={`mailto:${profile.email}`}>
          Open channel
        </a>
      </header>

      <div className="layout">
        <main className="content">
          <section
            className={active === 'about' ? 'hero section-active' : 'hero'}
            id="about"
            aria-labelledby="about-heading"
          >
            <p className="eyebrow">Signal · London · Year 22XX</p>
            <h1 id="about-heading">
              <span className="hero-name">{profile.name}</span>
              <span className="hero-role">{profile.headline}</span>
            </h1>
            <p className="lede">{profile.intro}</p>
            <p className="lede-emphasis">{profile.valueLine}</p>
            <div className="hero-actions">
              <a className="btn primary" href={profile.github} rel="noreferrer" target="_blank">
                View GitHub
              </a>
              <a className="btn ghost" href={profile.githubTaruRepo} rel="noreferrer" target="_blank">
                See TARU
              </a>
            </div>
            <div className="stat-row">
              {quickStats.map((stat) => (
                <div className="stat" key={stat.label}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>
            <div className="cert-row">
              {certifications.map((c) => (
                <span className="chip" key={c.name}>
                  {c.name}
                </span>
              ))}
            </div>
            <p className="meta-line">
              <strong>LinkedIn top skills:</strong> {linkedinTopSkills.join(' · ')}
            </p>
          </section>

          <section
            className={active === 'projects' ? 'block section-active' : 'block'}
            id="projects"
            aria-labelledby="projects-heading"
          >
            <p className="eyebrow">Selected work</p>
            <h2 id="projects-heading">{sections[1].title}</h2>
            <p className="section-sub">{sections[1].subtitle}</p>
            <div className="project-list">
              {projects.map((project, index) => (
                <motion.article
                  className={index === 0 ? 'project project-featured' : 'project'}
                  key={project.title}
                  initial={{ opacity: 0, y: 22, filter: 'blur(4px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                >
                  <div className="project-head">
                    <h3>{project.title}</h3>
                    {project.status === 'in-progress' ? <span className="status">In progress</span> : null}
                  </div>
                  <p>{project.summary}</p>
                  <div className="chip-row">
                    {project.stack.map((item) => (
                      <span className="chip" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                  {project.href ? (
                    <a className="text-link" href={project.href} rel="noreferrer" target="_blank">
                      Open project →
                    </a>
                  ) : null}
                </motion.article>
              ))}
            </div>
          </section>

          <section
            className={active === 'skills' ? 'block section-active' : 'block'}
            id="skills"
            aria-labelledby="skills-heading"
          >
            <p className="eyebrow">Toolkit</p>
            <h2 id="skills-heading">{sections[2].title}</h2>
            <p className="section-sub">{sections[2].subtitle}</p>
            <div className="skill-grid">
              {skillGroups.map((group) => (
                <div className="skill-group" key={group.label}>
                  <h3>{group.label}</h3>
                  <div className="chip-row">
                    {group.items.map((item) => (
                      <span className="chip" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            className={active === 'experience' ? 'block section-active' : 'block'}
            id="experience"
            aria-labelledby="experience-heading"
          >
            <p className="eyebrow">Timeline</p>
            <h2 id="experience-heading">{sections[3].title}</h2>
            <p className="section-sub">{sections[3].subtitle}</p>
            <div className="timeline">
              {workHistory.map((role) => (
                <article className="timeline-item" key={`${role.company}-${role.title}`}>
                  <p className="eyebrow">{role.current ? 'Current' : 'Previous'}</p>
                  <h3>
                    {role.title} · {role.company}
                  </h3>
                  <p className="dates">
                    {role.start} — {role.end} · {role.location}
                  </p>
                  <ul>
                    {role.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </article>
              ))}
              {educationHistory.map((ed) => (
                <article className="timeline-item" key={ed.school}>
                  <p className="eyebrow">Education</p>
                  <h3>{ed.credential}</h3>
                  <p className="dates">
                    {ed.school} · {ed.dates}
                  </p>
                  {ed.note ? <p>{ed.note}</p> : null}
                </article>
              ))}
            </div>
          </section>

          <section
            className={active === 'contact' ? 'block contact-block section-active' : 'block contact-block'}
            id="contact"
            aria-labelledby="contact-heading"
          >
            <p className="eyebrow">Next step</p>
            <h2 id="contact-heading">{sections[4].title}</h2>
            <p className="section-sub">{sections[4].subtitle}</p>
            <div className="contact-links">
              <a href={`mailto:${profile.email}`}>
                <span>Email</span>
                <strong>{profile.email}</strong>
              </a>
              <a href={profile.github} rel="noreferrer" target="_blank">
                <span>GitHub</span>
                <strong>@cpanchal112233-svg</strong>
              </a>
              <a href={profile.linkedin} rel="noreferrer" target="_blank">
                <span>LinkedIn</span>
                <strong>uncodeworld-chintan</strong>
              </a>
              <a href={`tel:${profile.phone.replace(/\s+/g, '')}`}>
                <span>Phone</span>
                <strong>{profile.phoneDisplay}</strong>
              </a>
              <a href={profile.githubTaruRepo} rel="noreferrer" target="_blank">
                <span>TARU</span>
                <strong>AI health companion</strong>
              </a>
              <a href={profile.companyWebsite} rel="noreferrer" target="_blank">
                <span>Company</span>
                <strong>uncodeworld.com</strong>
              </a>
            </div>
          </section>
        </main>

        <aside className="avatar-rail" aria-label="22nd-century AI guide">
          <motion.div
            className="avatar-stage"
            style={{
              y: avatarY,
              x: avatarX,
              rotate: avatarRotate,
              scale: avatarScale,
            }}
          >
            <motion.div
              className="guide-beam"
              style={{ opacity: beamOpacity }}
              animate={{ rotate: lean }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              aria-hidden
            >
              <span className="guide-beam-core" />
              <span className="guide-beam-tip" />
            </motion.div>

            <div className="avatar-pod">
              <motion.div
                className="avatar-ring"
                style={{ rotate: ringSpin }}
                aria-hidden
              />
              <motion.div
                className="avatar-ring avatar-ring-delayed"
                style={{ rotate: ringSpinReverse }}
                aria-hidden
              />
              <motion.div
                className="avatar-frame"
                animate={{
                  boxShadow: [
                    '0 0 0 1px rgba(61, 224, 208, 0.25), 0 24px 60px rgba(0,0,0,0.45)',
                    '0 0 28px 2px rgba(61, 224, 208, 0.35), 0 24px 60px rgba(0,0,0,0.45)',
                    '0 0 0 1px rgba(61, 224, 208, 0.25), 0 24px 60px rgba(0,0,0,0.45)',
                  ],
                }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.img
                  alt="AI avatar of Chintan Panchal"
                  className="avatar-full"
                  src="/avatar-realistic.jpg"
                  animate={{ y: [0, -8, 0], rotate: [0, 0.8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="avatar-hologlow" aria-hidden />
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                className="avatar-caption"
                key={activeSection.id}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ duration: 0.32 }}
              >
                <div className="caption-top">
                  <span className="caption-pulse" aria-hidden />
                  <p className="eyebrow">{activeSection.guideCue}</p>
                </div>
                <p className="caption-line">{activeSection.avatarLine}</p>
                <p className="caption-hint">{activeSection.focusHint}</p>
              </motion.div>
            </AnimatePresence>

            <div className="avatar-progress" role="tablist" aria-label="Section progress">
              {sections.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  className={s.id === active ? 'dot active' : i < activeIndex ? 'dot done' : 'dot'}
                  onClick={() => scrollTo(s.id)}
                  aria-label={`Go to ${s.nav}`}
                  aria-current={s.id === active ? 'true' : undefined}
                />
              ))}
            </div>
          </motion.div>
        </aside>
      </div>

      <footer className="site-footer">
        <p>
          {profile.name} · {profile.location} · 22nd-century guide mode
        </p>
        <p>
          <a href={profile.portfolioUrl}>{profile.portfolioUrl.replace('https://', '')}</a>
        </p>
      </footer>
    </div>
  )
}

export default App
