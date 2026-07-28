export type SceneId = 'about' | 'projects' | 'skills' | 'experience' | 'contact'

export type Scene = {
  id: SceneId
  routeLabel: string
  destination: string
  title: string
  subtitle: string
  dialogue: string
  pulledOverDetail: string
  highlight: string
  speed: string
  roadsideHint: string
  facts?: string[]
}

/** Short tags in the windshield — scannable for recruiters, not gimmicky */
export type RoadsideSign = {
  tag: string
  label: string
  sub?: string
}

export type Project = {
  title: string
  summary: string
  stack: string[]
  accent: string
  href?: string
  status?: 'shipped' | 'in-progress'
}

export type SkillGroup = {
  label: string
  items: string[]
}

export type WorkRole = {
  company: string
  title: string
  location: string
  start: string
  end: string
  current?: boolean
  bullets: string[]
}

export type Education = {
  school: string
  credential: string
  dates: string
  note?: string
}

export type Certification = {
  name: string
  issuer?: string
}

export const profile = {
  name: 'Chintan Panchal',
  headline: 'Software Engineer · MSc Computer Science · AWS Certified Cloud Practitioner',
  role: 'Software Engineer',
  focus: 'Full-stack · Mobile · AI product shipping',
  location: 'Barking, England, United Kingdom',
  address: '508 Ripple Road, Barking, IG11 9RY',
  intro:
    'Postgraduate computer scientist who ships full-stack and mobile products end to end — from auth and data models through polished UI and cloud deploy. ERP heritage (Laravel/MySQL), modern React/Next stacks, and currently building TARU, an AI-powered health companion on Flutter + Firebase.',
  valueLine:
    'I sit comfortably between rigorous engineering and practical delivery — the kind of hire who reads the ticket, improves the system, and leaves the team with something maintainable.',
  email: 'chintanpanchal63@gmail.com',
  /** E.164-style for tel: links (same number as 07880 039122) */
  phone: '+44 7880 039122',
  /** UK national format — matches LinkedIn display */
  phoneDisplay: '07880 039122',
  github: 'https://github.com/cpanchal112233-svg',
  linkedin: 'https://www.linkedin.com/in/uncodeworld-chintan',
  /** Company site */
  companyWebsite: 'https://www.uncodeworld.com',
  /** Adobe / visual portfolio */
  adobePortfolioUrl: 'https://chintanpanchal63.myportfolio.com',
  /**
   * Live Vercel URL — keep in sync with Chintan-Panchal-Resume.md / .html
   */
  portfolioUrl: 'https://portfolio-pied-nu-0jzr70914a.vercel.app',
  githubPortfolioRepo: 'https://github.com/cpanchal112233-svg/portfolio-',
  githubTaruRepo: 'https://github.com/cpanchal112233-svg/TARU-',
}

export const certifications: Certification[] = [
  { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services' },
  { name: 'Google Ads (AdWords) Essential Training' },
  { name: 'SEO Foundations' },
  { name: 'Content Marketing Foundations' },
]

export const linkedinTopSkills = ['Dashboard building', 'Branding', 'Product development']

export const workHistory: WorkRole[] = [
  {
    company: 'UK Digi Tech Ltd',
    title: 'Graphic Designer',
    location: 'London area, United Kingdom',
    start: 'June 2025',
    end: 'Present',
    current: true,
    bullets: [
      'Design and deliver web-ready graphics and layouts with consistent branding, working closely with marketing and development so visuals match what ships in production.',
      'Optimise assets for performance and responsiveness across devices — the same attention to detail I bring to front-end implementation.',
      'Led design for a major client website; engagement rose roughly 25% with a measurable lift in lead generation.',
      'Adobe Creative Suite (Photoshop, Illustrator, InDesign) for high-impact campaigns and iterative refreshes.',
    ],
  },
  {
    company: 'The Study Room Tuition Centre',
    title: 'Assistant Manager',
    location: 'Greater London, United Kingdom',
    start: 'January 2023',
    end: 'November 2023',
    bullets: [
      'Ran day-to-day operations: schedules, parent and student comms, records, and enrolment — strong practice in clarity under pressure.',
      'Supported hiring, training, and mentoring; assisted with budgeting and spend tracking.',
      'Helped shape new programmes and strategies to improve learning outcomes — stakeholder alignment and follow-through.',
    ],
  },
  {
    company: 'The Study Room Tuition Centre',
    title: 'Web Developer Intern',
    location: 'London, United Kingdom',
    start: 'June 2022',
    end: 'January 2023',
    bullets: [
      'Owned end-to-end contribution to an ERP-style system on Laravel, including data integration and UX decisions.',
      'Stack: PHP (Laravel), MySQL, Apache — testing, debugging, and hardening before release.',
      'Ran structured data gathering (qualitative and quantitative) and merged datasets with integrity and clear access patterns.',
    ],
  },
]

export const educationHistory: Education[] = [
  {
    school: 'University of East London',
    credential: 'MSc Computer Science (with industrial placement)',
    dates: 'May 2021 — May 2023',
    note: 'Industrial placement year; foundations across AI, cloud, big data, and software engineering.',
  },
  {
    school: 'Silver Oak College of Engineering & Technology, Ahmedabad',
    credential: 'Bachelor of Engineering, Computer Engineering',
    dates: 'August 2016 — August 2020',
  },
]

export const sceneRoadSigns: Record<SceneId, RoadsideSign[]> = {
  about: [
    { tag: 'MSc', label: 'Computer Science', sub: 'UEL' },
    { tag: 'AWS', label: 'Cloud Practitioner', sub: 'Certified' },
    { tag: 'ERP', label: 'Laravel · MySQL', sub: 'Shipped' },
    { tag: 'UK', label: 'London & Essex', sub: 'Hybrid OK' },
    { tag: 'Stack', label: 'React · TypeScript', sub: 'Next.js' },
  ],
  projects: [
    { tag: 'AI', label: 'TARU', sub: 'Health app' },
    { tag: 'SaaS', label: 'ServeNow', sub: 'Field service' },
    { tag: 'UI', label: 'uncodeworld', sub: 'Motion & 3D' },
    { tag: 'Mobile', label: 'Flutter', sub: 'Firebase' },
    { tag: 'TS', label: 'Type safety', sub: 'End to end' },
  ],
  skills: [
    { tag: 'FE', label: 'React · Next.js', sub: 'Tailwind' },
    { tag: 'Mobile', label: 'Flutter · Dart', sub: 'Firebase' },
    { tag: 'BE', label: 'Node · REST', sub: 'Laravel' },
    { tag: 'Data', label: 'MySQL · PostgreSQL', sub: 'Prisma' },
    { tag: 'Cloud', label: 'AWS · Azure', sub: 'CI/CD' },
  ],
  experience: [
    { tag: 'Now', label: 'UK Digi Tech', sub: 'Design × web' },
    { tag: '2023', label: 'Study Room', sub: 'Operations' },
    { tag: '2022', label: 'Study Room', sub: 'Laravel ERP' },
    { tag: 'MSc', label: 'UEL', sub: 'Placement' },
    { tag: 'BE', label: 'Silver Oak', sub: 'India' },
  ],
  contact: [
    { tag: 'Mail', label: 'Email', sub: 'Primary' },
    { tag: 'GH', label: 'GitHub', sub: 'Repos' },
    { tag: 'In', label: 'LinkedIn', sub: 'Profile' },
    { tag: 'Co', label: 'uncodeworld.com', sub: 'Company' },
    { tag: 'Tel', label: 'Phone', sub: 'UK' },
  ],
}

export const scenes: Scene[] = [
  {
    id: 'about',
    routeLabel: '01 / Overview',
    destination: 'Who I am',
    title: 'Profile',
    subtitle: 'What you get in one glance before we go deeper.',
    dialogue:
      "Thanks for stopping by. I'm Chintan — engineer first, shipping web and mobile products, with TARU (AI health companion) as my current flagship build.",
    pulledOverDetail:
      'Below is the fuller picture: how I describe my work, proof points from LinkedIn, certifications, and the themes I care about in a team — ownership, clarity, and shipping without drama.',
    highlight:
      'MSc Computer Science, AWS Cloud Practitioner, ERP delivery (Laravel/MySQL), React/Next full-stack, and Flutter + Firebase for TARU.',
    speed: 'Skimming',
    roadsideHint: 'Tags in the glass mirror your scan: credentials, stack, location.',
    facts: [
      profile.valueLine,
      'Comfortable owning features from schema and API boundaries through to UI states and handover docs.',
      'Open to software engineering roles where reliability and communication matter as much as syntax.',
    ],
  },
  {
    id: 'projects',
    routeLabel: '02 / Selected work',
    destination: 'Builds',
    title: 'Projects',
    subtitle: 'Representative products — each solves a real workflow or go-to-market problem.',
    dialogue:
      'Start with TARU — my AI health companion in active development — then ServeNow, uncodeworld, and RetailOS. Pull over for stacks and links.',
    pulledOverDetail:
      'TARU is Flutter + Firebase with an AI roadmap; ServeNow is operations-heavy SaaS; uncodeworld is brand-led motion; RetailOS is commerce and loyalty. Happy to walk architecture and trade-offs on a call.',
    highlight: 'End-to-end thinking: auth, data models, mobile shells, UI performance, and what it takes to maintain after launch.',
    speed: 'Deep dive',
    roadsideHint: 'Project names pass the windshield as you scroll.',
  },
  {
    id: 'skills',
    routeLabel: '03 / Toolkit',
    destination: 'Skills',
    title: 'How I build',
    subtitle: 'Grouped the way hiring managers usually search — front end, back end, cloud, and craft.',
    dialogue:
      'No buzzword soup — Laravel and MySQL in production, React/Next for web, Flutter + Firebase for mobile, plus cloud tooling.',
    pulledOverDetail:
      'If you need someone who can read a Laravel codebase, design a sane API contract, ship a Flutter shell, and still care about Tailwind spacing and loading states — that overlap is intentional.',
    highlight:
      'Strong on TypeScript/React, Flutter/Firebase, PHP/Laravel heritage, SQL, AWS awareness, and design-to-dev handoff.',
    speed: 'Reference',
    roadsideHint: 'Skill clusters echo the CV keywords recruiters filter on.',
  },
  {
    id: 'experience',
    routeLabel: '04 / Timeline',
    destination: 'Experience',
    title: 'Work & education',
    subtitle: 'Recent roles and degrees — aligned with my LinkedIn, edited for clarity.',
    dialogue:
      'From ERP development as an intern through operations leadership to my current design-and-web role: it is one thread of delivery, communication, and technical depth.',
    pulledOverDetail:
      'The Study Room work is where I proved I could ship a serious internal system. UK Digi Tech shows I can pair with marketing and dev and move metrics. Degrees anchor the theory.',
    highlight:
      'Real ERP delivery (Laravel, MySQL, testing), measurable web outcome (+25% engagement on a flagship client site), MSc with placement, AWS certified.',
    speed: 'Chronology',
    roadsideHint: 'Milestones line up with the timeline cards.',
  },
  {
    id: 'contact',
    routeLabel: '05 / Next step',
    destination: 'Contact',
    title: "Let's talk",
    subtitle: 'Email, GitHub, LinkedIn, phone, company site, and live portfolio.',
    dialogue:
      'If this resonates, the next step is simple: email me or book through LinkedIn. Code lives on GitHub — happy to walk through TARU or any other build.',
    pulledOverDetail:
      'I am interested in software engineering roles and builder partnerships in the UK where the work is substantive and the team values clear communication. GitHub is the source of truth for what I ship.',
    highlight: 'Available for interviews and technical conversations — references and code walkthroughs on request.',
    speed: 'Contact',
    roadsideHint: 'All contact channels are one click away.',
  },
]

export const projects: Project[] = [
  {
    title: 'TARU',
    summary:
      'AI-powered personal health companion (iOS/Android). Mission: help people understand their health, organise medical information, build healthy habits, and partner better with clinicians. Shipped auth, Firestore profiles, and the main app shell; next up — report uploads, LLM assistant, routines, and progress insights.',
    stack: ['Flutter', 'Dart', 'Firebase Auth', 'Cloud Firestore', 'Firebase Storage'],
    accent: '#2f8f7b',
    href: 'https://github.com/cpanchal112233-svg/TARU-',
    status: 'in-progress',
  },
  {
    title: 'ServeNow',
    summary:
      'Field-service platform: booking, dispatch, invoicing, technician workflows, and completion reporting — the kind of system where messy real-world edge cases matter.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Auth.js', 'Prisma', 'PostgreSQL'],
    accent: '#4f8fc9',
    status: 'shipped',
  },
  {
    title: 'uncodeworld',
    summary:
      'Premium services site with cinematic UI, pricing flows, and performance-conscious motion — brand and engineering working together.',
    stack: ['React', 'Vite', 'Tailwind', 'Three.js / R3F', 'Framer Motion', 'GSAP'],
    accent: '#8b7ab8',
    href: 'https://www.uncodeworld.com',
    status: 'shipped',
  },
  {
    title: 'RetailOS',
    summary:
      'E-commerce and loyalty: storefront through checkout, orders, campaigns, and rewards — data model and UX in sync.',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Auth.js'],
    accent: '#3d9a9a',
    status: 'shipped',
  },
]

export const skillGroups: SkillGroup[] = [
  {
    label: 'Front end',
    items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'Vite', 'Responsive UI'],
  },
  {
    label: 'Mobile & AI product',
    items: ['Flutter', 'Dart', 'Firebase Auth', 'Cloud Firestore', 'Firebase Storage', 'LLM product design'],
  },
  {
    label: 'Back end & data',
    items: ['Node.js', 'PHP', 'Laravel', 'REST APIs', 'MySQL', 'Prisma', 'PostgreSQL', 'Apache'],
  },
  {
    label: 'Cloud, quality & design',
    items: ['AWS', 'Azure', 'Vercel', 'CI/CD', 'Git / GitHub', 'Testing & debugging', 'Adobe Photoshop', 'Illustrator', 'InDesign'],
  },
]

export const quickStats = [
  { label: 'Cloud', value: 'AWS CP' },
  { label: 'Postgrad', value: 'MSc CS' },
  { label: 'Undergrad', value: 'BEng' },
]
