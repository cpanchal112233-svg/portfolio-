export type SectionId = 'about' | 'projects' | 'skills' | 'experience' | 'resume' | 'contact'

/** Drives which pose the 3D actor holds while a line is in focus. */
export type Emphasis = 'welcome' | 'point' | 'present' | 'reflect' | 'invite'

export type BeatKind =
  | 'headline'
  | 'statement'
  | 'metric'
  | 'project'
  | 'skillgroup'
  | 'role'
  | 'bullet'
  | 'education'
  | 'resume'
  | 'channel'

export type Beat = {
  id: string
  section: SectionId
  kind: BeatKind
  label?: string
  text: string
  detail?: string
  chips?: string[]
  href?: string
  external?: boolean
  status?: string
  /** What the avatar says while this exact line is in focus. */
  narration: string
  emphasis: Emphasis
}

export type SectionMeta = {
  id: SectionId
  nav: string
  index: string
  title: string
  subtitle: string
  cue: string
}

export const profile = {
  name: 'Chintan Panchal',
  headline: 'Software Engineer · AI Product Builder',
  location: 'London / Barking, United Kingdom',
  email: 'chintanpanchal63@gmail.com',
  phone: '+44 7880 039122',
  phoneDisplay: '07880 039122',
  github: 'https://github.com/cpanchal112233-svg',
  linkedin: 'https://www.linkedin.com/in/uncodeworld-chintan',
  companyWebsite: 'https://www.uncodeworld.com',
  portfolioUrl: 'https://portfolio-pied-nu-0jzr70914a.vercel.app',
  githubTaruRepo: 'https://github.com/cpanchal112233-svg/TARU-',
  githubPortfolioRepo: 'https://github.com/cpanchal112233-svg/portfolio-',
  resumeHref: '/Chintan-Panchal-CV.pdf',
}

export const sections: SectionMeta[] = [
  {
    id: 'about',
    nav: 'Identity',
    index: '01',
    title: 'Identity',
    subtitle: 'Who is standing in front of you.',
    cue: 'Identity lock',
  },
  {
    id: 'projects',
    nav: 'Work',
    index: '02',
    title: 'Selected work',
    subtitle: 'Systems I designed, built, and shipped.',
    cue: 'Mission archive',
  },
  {
    id: 'skills',
    nav: 'Skills',
    index: '03',
    title: 'Capability grid',
    subtitle: 'The toolkit I run in production.',
    cue: 'Capability grid',
  },
  {
    id: 'experience',
    nav: 'Timeline',
    index: '04',
    title: 'Timeline',
    subtitle: 'Roles, delivery, and study.',
    cue: 'Career signal',
  },
  {
    id: 'resume',
    nav: 'Resume',
    index: '05',
    title: 'Resume',
    subtitle: 'The document, assembled live.',
    cue: 'Dossier build',
  },
  {
    id: 'contact',
    nav: 'Contact',
    index: '06',
    title: 'Open channel',
    subtitle: 'Reach me directly.',
    cue: 'Comm link',
  },
]

export const beats: Beat[] = [
  // —— 01 Identity ——
  {
    id: 'about-name',
    section: 'about',
    kind: 'headline',
    label: 'Operator',
    text: 'Chintan Panchal',
    detail: 'Software Engineer · AI Product Builder',
    narration: 'Hey — I am Chintan. I will walk you through every line of this portfolio myself.',
    emphasis: 'welcome',
  },
  {
    id: 'about-intro',
    section: 'about',
    kind: 'statement',
    label: 'Mission',
    text: 'I build reliable full-stack and mobile products end to end — from auth and data models through polished UI and cloud deploy.',
    narration: 'End to end means exactly that: I own the data model, the interface, and the deploy.',
    emphasis: 'present',
  },
  {
    id: 'about-taru-line',
    section: 'about',
    kind: 'statement',
    label: 'Recent work',
    text: 'Shipped TARU, an AI-powered health companion on Flutter and Firebase — authentication, cloud profiles, and a cross-platform mobile experience.',
    narration: 'Recent work includes TARU — a health companion I built end to end on Flutter and Firebase.',
    emphasis: 'point',
  },
  {
    id: 'about-value',
    section: 'about',
    kind: 'statement',
    label: 'How I work',
    text: 'Clear communication, maintainable systems, and constant shipping — engineering rigour meeting practical delivery.',
    narration: 'This is the line I care about most: rigour that still ships on time.',
    emphasis: 'reflect',
  },
  {
    id: 'about-degree',
    section: 'about',
    kind: 'metric',
    label: 'Education',
    text: 'MSc Computer Science',
    detail: 'University of East London — AI, cloud, and big data',
    narration: 'MSc Computer Science, with the AI and cloud modules that feed straight into my work.',
    emphasis: 'present',
  },
  {
    id: 'about-aws',
    section: 'about',
    kind: 'metric',
    label: 'Cloud',
    text: 'AWS Certified Cloud Practitioner',
    detail: 'Amazon Web Services',
    narration: 'Certified on AWS, so cloud cost and architecture are not guesswork for me.',
    emphasis: 'present',
  },
  {
    id: 'about-focus',
    section: 'about',
    kind: 'metric',
    label: 'Focus',
    text: 'AI-powered products',
    detail: 'Mobile-first, LLM-assisted, cloud-backed',
    narration: 'My focus is AI products that real people can actually use every day.',
    emphasis: 'point',
  },
  {
    id: 'about-marketing-certs',
    section: 'about',
    kind: 'statement',
    label: 'Also certified',
    text: 'Google Ads Essential Training · SEO Foundations · Content Marketing Foundations',
    narration: 'I also learned the growth side, so I can build a product and explain why it matters.',
    emphasis: 'present',
  },
  {
    id: 'about-linkedin-skills',
    section: 'about',
    kind: 'statement',
    label: 'Top endorsed',
    text: 'Dashboard building · Branding · Product development',
    narration: 'These are the three things people endorse me for most on LinkedIn.',
    emphasis: 'welcome',
  },

  // —— 02 Work ——
  {
    id: 'work-taru',
    section: 'projects',
    kind: 'project',
    label: 'Mobile',
    text: 'TARU — AI personal health companion',
    detail:
      'Cross-platform iOS and Android app for organising health information, building habits, and supporting clearer conversations with clinicians. Firebase authentication, Cloud Firestore profiles, secure storage, and a production-ready mobile UI.',
    chips: ['Flutter', 'Dart', 'Firebase Auth', 'Cloud Firestore', 'Firebase Storage'],
    href: 'https://github.com/cpanchal112233-svg/TARU-',
    external: true,
    status: 'Shipped',
    narration: 'TARU — a mobile health product I designed and built on Flutter and Firebase.',
    emphasis: 'present',
  },
  {
    id: 'work-taru-why',
    section: 'projects',
    kind: 'statement',
    label: 'Why TARU',
    text: 'Health data is scattered and intimidating; TARU turns it into something a person can actually read and act on.',
    narration: 'The reason I built it: medical information is scattered, and that scares people off their own health.',
    emphasis: 'reflect',
  },
  {
    id: 'work-servenow',
    section: 'projects',
    kind: 'project',
    label: 'Platform',
    text: 'ServeNow — field-service operations',
    detail:
      'Booking, dispatch, invoicing, technician workflows, and completion reporting in one operational platform.',
    chips: ['Next.js', 'TypeScript', 'Tailwind', 'Auth.js', 'Prisma', 'PostgreSQL'],
    status: 'Shipped',
    narration: 'ServeNow is the operations build — dispatch, invoicing, and technician workflow in one place.',
    emphasis: 'present',
  },
  {
    id: 'work-uncodeworld',
    section: 'projects',
    kind: 'project',
    label: 'Studio',
    text: 'uncodeworld — premium services site',
    detail: 'Marketing site with strong motion craft and performance-conscious delivery.',
    chips: ['React', 'Vite', 'Tailwind', 'Framer Motion'],
    href: 'https://www.uncodeworld.com',
    external: true,
    status: 'Shipped',
    narration: 'uncodeworld is where I push motion and polish — the craft side of my work.',
    emphasis: 'present',
  },
  {
    id: 'work-retailos',
    section: 'projects',
    kind: 'project',
    label: 'Commerce',
    text: 'RetailOS — commerce and loyalty',
    detail: 'Storefront through checkout, orders, campaigns, and rewards.',
    chips: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Auth.js'],
    status: 'Shipped',
    narration: 'RetailOS covers commerce end to end — checkout, orders, campaigns, and rewards.',
    emphasis: 'point',
  },

  // —— 03 Skills ——
  {
    id: 'skill-frontend',
    section: 'skills',
    kind: 'skillgroup',
    label: 'Front end',
    text: 'Interfaces I ship',
    chips: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'Vite'],
    narration: 'Front end is my home ground — React, Next.js, and TypeScript every single day.',
    emphasis: 'present',
  },
  {
    id: 'skill-mobile-ai',
    section: 'skills',
    kind: 'skillgroup',
    label: 'Mobile & AI',
    text: 'Mobile and AI products',
    chips: ['Flutter', 'Dart', 'Firebase', 'Cloud Firestore', 'LLM product design'],
    narration: 'Mobile and AI — Flutter, Firebase, and LLM-assisted product design in production.',
    emphasis: 'point',
  },
  {
    id: 'skill-backend',
    section: 'skills',
    kind: 'skillgroup',
    label: 'Back end & data',
    text: 'Services and schemas',
    chips: ['Node.js', 'PHP', 'Laravel', 'REST APIs', 'MySQL', 'Prisma', 'PostgreSQL'],
    narration: 'Back end and data — I have shipped real Laravel and SQL systems, not just tutorials.',
    emphasis: 'present',
  },
  {
    id: 'skill-cloud',
    section: 'skills',
    kind: 'skillgroup',
    label: 'Cloud & delivery',
    text: 'Getting it live and keeping it live',
    chips: ['AWS', 'Azure', 'Vercel', 'CI/CD', 'Git / GitHub', 'Testing'],
    narration: 'And delivery: AWS, Vercel, and CI/CD, because unshipped work does not count.',
    emphasis: 'invite',
  },

  // —— 04 Timeline ——
  {
    id: 'role-ukdigitech',
    section: 'experience',
    kind: 'role',
    label: 'Current',
    text: 'Graphic Designer — UK Digi Tech Ltd',
    detail: 'June 2025 — Present · London area, United Kingdom',
    narration: 'My current role at UK Digi Tech, where design and front-end delivery meet.',
    emphasis: 'present',
  },
  {
    id: 'role-ukdigitech-b1',
    section: 'experience',
    kind: 'bullet',
    label: 'UK Digi Tech',
    text: 'Design and deliver web-ready graphics and layouts with consistent branding, working closely with marketing and development.',
    narration: 'I work between marketing and engineering, so the brand survives the handoff.',
    emphasis: 'reflect',
  },
  {
    id: 'role-ukdigitech-b2',
    section: 'experience',
    kind: 'bullet',
    label: 'UK Digi Tech',
    text: 'Optimise assets for performance and responsiveness across devices.',
    narration: 'Performance is part of design for me — heavy assets are a bug.',
    emphasis: 'reflect',
  },
  {
    id: 'role-ukdigitech-b3',
    section: 'experience',
    kind: 'bullet',
    label: 'Result',
    text: 'Led design for a major client website; engagement rose roughly 25% with a measurable lift in lead generation.',
    narration: 'This is the measurable one — about twenty-five percent more engagement after my redesign.',
    emphasis: 'point',
  },
  {
    id: 'role-studyroom-mgr',
    section: 'experience',
    kind: 'role',
    label: 'Previous',
    text: 'Assistant Manager — The Study Room Tuition Centre',
    detail: 'January 2023 — November 2023 · Greater London, United Kingdom',
    narration: 'Before engineering full time, I ran operations for a busy tuition centre.',
    emphasis: 'present',
  },
  {
    id: 'role-studyroom-mgr-b1',
    section: 'experience',
    kind: 'bullet',
    label: 'Operations',
    text: 'Ran day-to-day operations: schedules, parent and student communications, records, and enrolment.',
    narration: 'Scheduling and difficult conversations taught me more about requirements than any spec.',
    emphasis: 'reflect',
  },
  {
    id: 'role-studyroom-mgr-b2',
    section: 'experience',
    kind: 'bullet',
    label: 'People',
    text: 'Supported hiring, training, and mentoring; assisted with budgeting.',
    narration: 'Hiring and mentoring — this is where I learned to explain things simply.',
    emphasis: 'reflect',
  },
  {
    id: 'role-studyroom-dev',
    section: 'experience',
    kind: 'role',
    label: 'Previous',
    text: 'Web Developer Intern — The Study Room Tuition Centre',
    detail: 'June 2022 — January 2023 · London, United Kingdom',
    narration: 'My first engineering role, and the one that proved I could ship production software.',
    emphasis: 'point',
  },
  {
    id: 'role-studyroom-dev-b1',
    section: 'experience',
    kind: 'bullet',
    label: 'ERP build',
    text: 'End-to-end contribution to an ERP-style system on Laravel, including data integration and UX decisions.',
    narration: 'A real ERP system — data integration and interface decisions, start to finish.',
    emphasis: 'present',
  },
  {
    id: 'role-studyroom-dev-b2',
    section: 'experience',
    kind: 'bullet',
    label: 'Stack',
    text: 'PHP (Laravel), MySQL, Apache — with testing, debugging, and hardening before release.',
    narration: 'Laravel, MySQL, and Apache, hardened properly before anyone touched it.',
    emphasis: 'reflect',
  },
  {
    id: 'edu-msc',
    section: 'experience',
    kind: 'education',
    label: 'Education',
    text: 'MSc Computer Science (with industrial placement)',
    detail: 'University of East London · May 2021 — May 2023 · AI, cloud, big data, advanced software engineering',
    narration: 'The MSc gave me the theory behind the AI work I do now.',
    emphasis: 'present',
  },
  {
    id: 'edu-be',
    section: 'experience',
    kind: 'education',
    label: 'Education',
    text: 'Bachelor of Engineering, Computer Engineering',
    detail: 'Silver Oak College of Engineering & Technology, Ahmedabad · August 2016 — August 2020',
    narration: 'And this is where it started, back in Ahmedabad.',
    emphasis: 'reflect',
  },

  // —— 05 Resume ——
  {
    id: 'resume-headline',
    section: 'resume',
    kind: 'resume',
    label: 'Dossier',
    text: 'Chintan Panchal — Software Engineer',
    detail: 'MSc Computer Science · AWS Certified Cloud Practitioner · London, UK',
    narration: 'Watch the resume assemble itself as you scroll — same facts, live document.',
    emphasis: 'present',
  },
  {
    id: 'resume-profile',
    section: 'resume',
    kind: 'resume',
    label: 'Profile',
    text: 'Full-stack and mobile engineer with ERP delivery experience and shipped AI-powered health and web products.',
    narration: 'This is the summary a recruiter reads first — specific, honest, and grounded in shipped work.',
    emphasis: 'reflect',
  },
  {
    id: 'resume-core',
    section: 'resume',
    kind: 'resume',
    label: 'Core stack',
    text: 'React · Next.js · TypeScript · Flutter · Firebase · Laravel · MySQL · PostgreSQL · AWS',
    narration: 'The stack line — everything here I have used on something real.',
    emphasis: 'present',
  },
  {
    id: 'resume-contactblock',
    section: 'resume',
    kind: 'resume',
    label: 'Contact block',
    text: 'chintanpanchal63@gmail.com · 07880 039122 · Barking, IG11 9RY · github.com/cpanchal112233-svg',
    narration: 'Everything a hiring manager needs to reach me, in one line.',
    emphasis: 'invite',
  },
  {
    id: 'resume-open',
    section: 'resume',
    kind: 'channel',
    label: 'Full document',
    text: 'Open the full resume',
    detail: 'Formatted HTML version, kept in sync with this site',
    href: '/Chintan-Panchal-Resume.html',
    external: true,
    narration: 'Open the full document here whenever you are ready.',
    emphasis: 'invite',
  },

  // —— 06 Contact ——
  {
    id: 'contact-email',
    section: 'contact',
    kind: 'channel',
    label: 'Email',
    text: 'chintanpanchal63@gmail.com',
    detail: 'Fastest way to reach me',
    href: 'mailto:chintanpanchal63@gmail.com',
    narration: 'Email is the fastest route — I read every one.',
    emphasis: 'invite',
  },
  {
    id: 'contact-github',
    section: 'contact',
    kind: 'channel',
    label: 'GitHub',
    text: '@cpanchal112233-svg',
    detail: 'TARU, this portfolio, and more',
    href: 'https://github.com/cpanchal112233-svg',
    external: true,
    narration: 'My GitHub — the code behind everything I just showed you.',
    emphasis: 'point',
  },
  {
    id: 'contact-linkedin',
    section: 'contact',
    kind: 'channel',
    label: 'LinkedIn',
    text: 'uncodeworld-chintan',
    detail: 'Roles, referrals, and recruiters',
    href: 'https://www.linkedin.com/in/uncodeworld-chintan',
    external: true,
    narration: 'LinkedIn if you are hiring or want to introduce me to someone.',
    emphasis: 'invite',
  },
  {
    id: 'contact-phone',
    section: 'contact',
    kind: 'channel',
    label: 'Phone',
    text: '07880 039122',
    detail: 'UK, London time',
    href: 'tel:+447880039122',
    narration: 'Or call directly — I am on London time.',
    emphasis: 'invite',
  },
  {
    id: 'contact-company',
    section: 'contact',
    kind: 'channel',
    label: 'Studio',
    text: 'uncodeworld.com',
    detail: 'My design and build studio',
    href: 'https://www.uncodeworld.com',
    external: true,
    narration: 'And this is my studio, uncodeworld.',
    emphasis: 'present',
  },
  {
    id: 'contact-close',
    section: 'contact',
    kind: 'statement',
    label: 'Sign off',
    text: 'Thanks for scrolling all the way to the end — let’s build something.',
    narration: 'That is the whole tour. Thank you for reading every line of it.',
    emphasis: 'welcome',
  },
]

export const beatsBySection = sections.map((section) => ({
  section,
  items: beats.filter((beat) => beat.section === section.id),
}))

export const totalBeats = beats.length
