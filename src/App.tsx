import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
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

function App() {
  const [active, setActive] = useState<SectionId>('about')
  const mainRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: mainRef, offset: ['start start', 'end end'] })
  const avatarY = useTransform(scrollYProgress, [0, 1], [0, 36])

  const activeSection = sections.find((s) => s.id === active) ?? sections[0]

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
      { root: null, threshold: [0.25, 0.45, 0.6], rootMargin: '-12% 0px -35% 0px' }
    )

    nodes.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="site">
      <div className="site-atmosphere" aria-hidden />

      <header className="topnav">
        <a className="brand" href="#about">
          <span className="brand-mark">CP</span>
          <span className="brand-name">{profile.name}</span>
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
          Email me
        </a>
      </header>

      <div className="layout">
        <main className="content" ref={mainRef}>
          <section className="hero" id="about" aria-labelledby="about-heading">
            <p className="eyebrow">Software engineer · London</p>
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

          <section className="block" id="projects" aria-labelledby="projects-heading">
            <p className="eyebrow">Selected work</p>
            <h2 id="projects-heading">{sections[1].title}</h2>
            <p className="section-sub">{sections[1].subtitle}</p>
            <div className="project-list">
              {projects.map((project, index) => (
                <motion.article
                  className="project"
                  key={project.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
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

          <section className="block" id="skills" aria-labelledby="skills-heading">
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

          <section className="block" id="experience" aria-labelledby="experience-heading">
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

          <section className="block contact-block" id="contact" aria-labelledby="contact-heading">
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

        <aside className="avatar-rail" aria-label="AI avatar companion">
          <motion.div className="avatar-stage" style={{ y: avatarY }}>
            <div className="avatar-frame">
              <img
                alt="AI avatar of Chintan Panchal"
                className="avatar-full"
                src="/avatar-realistic.jpg"
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                className="avatar-caption"
                key={activeSection.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
              >
                <p className="eyebrow">{activeSection.nav}</p>
                <p>{activeSection.avatarLine}</p>
              </motion.div>
            </AnimatePresence>
            <div className="avatar-progress" aria-hidden>
              {sections.map((s) => (
                <span className={s.id === active ? 'dot active' : 'dot'} key={s.id} />
              ))}
            </div>
          </motion.div>
        </aside>
      </div>

      <footer className="site-footer">
        <p>
          {profile.name} · {profile.location}
        </p>
        <p>
          <a href={profile.portfolioUrl}>{profile.portfolioUrl.replace('https://', '')}</a>
        </p>
      </footer>
    </div>
  )
}

export default App
