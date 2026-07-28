export type SectionId = 'about' | 'projects' | 'skills' | 'experience' | 'contact'

export type Project = {
  title: string
  summary: string
  stack: string[]
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

export type SectionMeta = {
  id: SectionId
  nav: string
  title: string
  subtitle: string
  avatarLine: string
  guideCue: string
  focusHint: string
}

export const profile = {
  name: 'Chintan Panchal',
  headline: 'Software Engineer · AI Product Builder',
  role: 'Software Engineer',
  focus: 'Full-stack · Mobile · AI-powered products',
  location: 'London / Barking, United Kingdom',
  address: '508 Ripple Road, Barking, IG11 9RY',
  intro:
    'I build reliable full-stack and mobile products end to end — from auth and data models through polished UI and cloud deploy. Currently shipping TARU, an AI-powered health companion on Flutter and Firebase.',
  valueLine:
    'Clear communication, maintainable systems, and constant shipping — the overlap between engineering rigor and practical delivery.',
  email: 'chintanpanchal63@gmail.com',
  phone: '+44 7880 039122',
  phoneDisplay: '07880 039122',
  github: 'https://github.com/cpanchal112233-svg',
  linkedin: 'https://www.linkedin.com/in/uncodeworld-chintan',
  companyWebsite: 'https://www.uncodeworld.com',
  adobePortfolioUrl: 'https://chintanpanchal63.myportfolio.com',
  portfolioUrl: 'https://portfolio-pied-nu-0jzr70914a.vercel.app',
  githubPortfolioRepo: 'https://github.com/cpanchal112233-svg/portfolio-',
  githubTaruRepo: 'https://github.com/cpanchal112233-svg/TARU-',
}

export const sections: SectionMeta[] = [
  {
    id: 'about',
    nav: 'About',
    title: 'About',
    subtitle: 'Who I am and how I work.',
    avatarLine: 'Start here. I am your guide through this timeline — engineer, builder, AI product partner.',
    guideCue: 'Identity lock',
    focusHint: 'Read the intro, then follow me down.',
  },
  {
    id: 'projects',
    nav: 'Projects',
    title: 'Selected work',
    subtitle: 'Products I have designed, built, and shipped.',
    avatarLine: 'Pause on TARU first — that is the flagship AI system. Then scan ServeNow and RetailOS.',
    guideCue: 'Mission archive',
    focusHint: 'Look left — open TARU when you are ready.',
  },
  {
    id: 'skills',
    nav: 'Skills',
    title: 'Skills',
    subtitle: 'The toolkit I use in production.',
    avatarLine: 'These are my live tools: Flutter, Firebase, React, Next.js, Laravel, AWS.',
    guideCue: 'Capability grid',
    focusHint: 'Scan Mobile & AI, then Cloud & delivery.',
  },
  {
    id: 'experience',
    nav: 'Experience',
    title: 'Experience',
    subtitle: 'Roles, delivery, and education.',
    avatarLine: 'Track the timeline: ERP intern → ops → design systems → MSc Computer Science.',
    guideCue: 'Career signal',
    focusHint: 'Follow the teal rail down the years.',
  },
  {
    id: 'contact',
    nav: 'Contact',
    title: 'Contact',
    subtitle: 'Let’s talk about roles, builds, or partnerships.',
    avatarLine: 'Transmission open. Email or LinkedIn — I answer builders and recruiters alike.',
    guideCue: 'Comm link',
    focusHint: 'Choose a channel and send the ping.',
  },
]

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
      'Design and deliver web-ready graphics and layouts with consistent branding, working closely with marketing and development.',
      'Optimise assets for performance and responsiveness across devices.',
      'Led design for a major client website; engagement rose roughly 25% with a measurable lift in lead generation.',
    ],
  },
  {
    company: 'The Study Room Tuition Centre',
    title: 'Assistant Manager',
    location: 'Greater London, United Kingdom',
    start: 'January 2023',
    end: 'November 2023',
    bullets: [
      'Ran day-to-day operations: schedules, parent and student communications, records, and enrolment.',
      'Supported hiring, training, and mentoring; assisted with budgeting.',
    ],
  },
  {
    company: 'The Study Room Tuition Centre',
    title: 'Web Developer Intern',
    location: 'London, United Kingdom',
    start: 'June 2022',
    end: 'January 2023',
    bullets: [
      'End-to-end contribution to an ERP-style system on Laravel, including data integration and UX decisions.',
      'Stack: PHP (Laravel), MySQL, Apache — testing, debugging, and hardening before release.',
    ],
  },
]

export const educationHistory: Education[] = [
  {
    school: 'University of East London',
    credential: 'MSc Computer Science (with industrial placement)',
    dates: 'May 2021 — May 2023',
    note: 'AI, cloud, big data, and advanced software engineering.',
  },
  {
    school: 'Silver Oak College of Engineering & Technology, Ahmedabad',
    credential: 'Bachelor of Engineering, Computer Engineering',
    dates: 'August 2016 — August 2020',
  },
]

export const projects: Project[] = [
  {
    title: 'TARU',
    summary:
      'AI-powered personal health companion for iOS and Android. Helps people understand their health, organise medical information, build healthy habits, and partner better with clinicians. Auth, Firestore profiles, and app shell shipped; next — report uploads, LLM assistant, routines, and insights.',
    stack: ['Flutter', 'Dart', 'Firebase Auth', 'Cloud Firestore', 'Firebase Storage'],
    href: 'https://github.com/cpanchal112233-svg/TARU-',
    status: 'in-progress',
  },
  {
    title: 'ServeNow',
    summary:
      'Field-service platform: booking, dispatch, invoicing, technician workflows, and completion reporting.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Auth.js', 'Prisma', 'PostgreSQL'],
    status: 'shipped',
  },
  {
    title: 'uncodeworld',
    summary: 'Premium services marketing site with strong motion craft and performance-conscious delivery.',
    stack: ['React', 'Vite', 'Tailwind', 'Framer Motion'],
    href: 'https://www.uncodeworld.com',
    status: 'shipped',
  },
  {
    title: 'RetailOS',
    summary: 'E-commerce and loyalty: storefront through checkout, orders, campaigns, and rewards.',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Auth.js'],
    status: 'shipped',
  },
]

export const skillGroups: SkillGroup[] = [
  {
    label: 'Front end',
    items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'Vite'],
  },
  {
    label: 'Mobile & AI',
    items: ['Flutter', 'Dart', 'Firebase', 'Cloud Firestore', 'LLM product design'],
  },
  {
    label: 'Back end & data',
    items: ['Node.js', 'PHP', 'Laravel', 'REST APIs', 'MySQL', 'Prisma', 'PostgreSQL'],
  },
  {
    label: 'Cloud & delivery',
    items: ['AWS', 'Azure', 'Vercel', 'CI/CD', 'Git / GitHub', 'Testing'],
  },
]

export const quickStats = [
  { label: 'Cloud', value: 'AWS CP' },
  { label: 'Degree', value: 'MSc CS' },
  { label: 'Focus', value: 'AI products' },
]
