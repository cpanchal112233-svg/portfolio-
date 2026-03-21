import { site, skills, projects, experience, education, certifications, interests } from './data/content'

const nav = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
] as const

function App() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top">
            <span className="brand-mark" aria-hidden="true" />
            <span className="brand-text">{site.name}</span>
          </a>
          <nav className="site-nav" aria-label="Primary">
            <ul>
              {nav.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id="main">
        <section id="top" className="hero">
          <div className="hero-grid" />
          <p className="hero-eyebrow">{site.location}</p>
          <h1 className="hero-title">
            {site.name}
            <span className="hero-sub">{site.role}</span>
            <span className="hero-focus">{site.focus}</span>
          </h1>
          <p className="hero-intent">{site.intent}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={`mailto:${site.email}`}>
              Email me
            </a>
            <a className="btn btn-ghost" href={site.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            {site.github ? (
              <a className="btn btn-ghost" href={site.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            ) : null}
          </div>
        </section>

        <section id="about" className="section" aria-labelledby="about-heading">
          <div className="section-head">
            <h2 id="about-heading">About</h2>
            <p className="section-lead">Professional profile</p>
          </div>
          <div className="prose">
            {site.profile.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        <section id="skills" className="section section-muted" aria-labelledby="skills-heading">
          <div className="section-head">
            <h2 id="skills-heading">Technical skills</h2>
            <p className="section-lead">Stack and tools</p>
          </div>
          <div className="skills">
            {skills.map((group) => (
              <div key={group.category} className="skill-card">
                <h3>{group.category}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="section" aria-labelledby="projects-heading">
          <div className="section-head">
            <h2 id="projects-heading">Selected projects</h2>
            <p className="section-lead">Portfolio work</p>
          </div>
          <div className="projects">
            {projects.map((project) => (
              <article key={project.title} className="project-card">
                <div className="project-top">
                  <h3>{project.title}</h3>
                  {project.href ? (
                    <a
                      className="project-link"
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  ) : null}
                </div>
                <p>{project.description}</p>
                <ul className="stack" aria-label="Technologies">
                  {project.stack.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="section section-muted" aria-labelledby="exp-heading">
          <div className="section-head">
            <h2 id="exp-heading">Employment</h2>
            <p className="section-lead">Recent experience</p>
          </div>
          <article className="entry">
            <div className="entry-head">
              <h3>{experience.role}</h3>
              <p className="entry-meta">
                {experience.company} · {experience.period} · {experience.place}
              </p>
            </div>
            <ul className="bullets">
              {experience.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </article>
        </section>

        <section id="education" className="section" aria-labelledby="edu-heading">
          <div className="section-head">
            <h2 id="edu-heading">Education &amp; certifications</h2>
            <p className="section-lead">Qualifications</p>
          </div>
          <div className="edu-grid">
            {education.map((edu) => (
              <article key={edu.degree} className="edu-card">
                <h3>{edu.degree}</h3>
                <p className="entry-meta">
                  {edu.school} · {edu.period}
                </p>
                <p className="edu-detail">{edu.detail}</p>
              </article>
            ))}
          </div>
          <ul className="cert-list">
            {certifications.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="interests">
            <strong>Interests:</strong> {interests}
          </p>
        </section>

        <section id="contact" className="section section-cta" aria-labelledby="contact-heading">
          <div className="cta-inner">
            <h2 id="contact-heading">Let&apos;s talk</h2>
            <p className="cta-copy">
              Open to roles in the UK. References available upon request — get in touch for a CV or
              to discuss a role.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <a className="btn btn-ghost" href={site.phoneHref}>
                {site.phone}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          © {new Date().getFullYear()} {site.name}. Built with React &amp; Vite.
        </p>
      </footer>
    </>
  )
}

export default App
