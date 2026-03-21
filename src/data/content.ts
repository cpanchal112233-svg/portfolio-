export const site = {
  name: 'Chintan Panchal',
  role: 'Software Developer',
  focus: 'Full-stack · Front-end',
  location: 'London, UK',
  intent:
    'Seeking software development roles in the United Kingdom — open to hybrid, remote, or on-site.',
  email: 'chintanpanchal63@gmail.com',
  phone: '+44 7880 039122',
  phoneHref: 'tel:+447880039122',
  linkedin: 'https://www.linkedin.com/in/chintan-panchal-85a98b148',
  /** Add your public GitHub profile or repo when ready */
  github: null as string | null,
  profile: [
    'MSc Computer Science graduate (University of East London) with practical experience building and maintaining modern web applications for UK and commercial contexts.',
    'I deliver accessible, well-structured front ends and secure, maintainable backends using React, Next.js, TypeScript, and PostgreSQL, with authentication, REST-style APIs, and cloud-hosted deployments (AWS, Azure, Vercel).',
    'Comfortable working in Agile teams — from discovery and implementation through testing, documentation, and handover to stakeholders.',
  ],
} as const

export const skills: { category: string; items: string[] }[] = [
  {
    category: 'Front end',
    items: [
      'React',
      'Next.js (App Router)',
      'TypeScript',
      'JavaScript',
      'HTML/CSS',
      'Tailwind CSS',
      'Vite',
    ],
  },
  {
    category: 'Back end & APIs',
    items: [
      'REST APIs',
      'Node.js',
      'Prisma',
      'Ruby on Rails',
      'Flask',
      'Django',
      'Laravel',
      'PHP',
    ],
  },
  {
    category: 'Data',
    items: ['PostgreSQL', 'SQL', 'NoSQL', 'ETL/ELT', 'data pipelines'],
  },
  {
    category: 'Cloud & DevOps',
    items: [
      'AWS (Lambda, EC2, S3, Fargate)',
      'Azure',
      'Kubernetes',
      'CI/CD',
      'SQS',
      'SNS',
      'EventBridge',
    ],
  },
  {
    category: 'Security & quality',
    items: [
      'Auth.js / NextAuth',
      'bcrypt',
      'Zod',
      'secure handling of user data',
      'Git',
    ],
  },
  {
    category: 'Other',
    items: ['SEO fundamentals', 'Agile delivery', 'system evaluation', 'performance tuning'],
  },
]

export type Project = {
  title: string
  description: string
  stack: string[]
  href?: string
}

export const projects: Project[] = [
  {
    title: 'ServeNow',
    description:
      'Full-stack field-service style platform: public booking, customer tracking and invoicing, admin dispatch, technician workflows, and completion reporting; deployment-oriented setup (Neon, Vercel, edge-aware middleware).',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Auth.js', 'Prisma', 'PostgreSQL'],
  },
  {
    title: 'uncodeworld (TSCM Digital)',
    description:
      'Premium services marketing site with cinematic UI: case studies, pricing tools, SEO- and performance-conscious build.',
    stack: ['React', 'Vite', 'Tailwind', 'Three.js / R3F', 'Framer Motion', 'GSAP'],
  },
  {
    title: 'RetailOS',
    description:
      'E-commerce and loyalty experience: storefront, basket, checkout, orders, accounts, rewards, and admin for products, stock, and campaigns.',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Auth.js'],
  },
  {
    title: 'StudioFlow',
    description:
      'Agency client portal with dashboards, timelines, comments, files, notifications, and billing views.',
    stack: ['Next.js', 'NestJS', 'Supabase'],
  },
  {
    title: 'SmartClinic',
    description:
      'Healthcare-style web application: booking, patient portal, admin/clinician dashboards, and queue management.',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'NextAuth'],
  },
  {
    title: 'Earlier work',
    description:
      'COLUMBUS (ML-assisted web app); Laravel school ERP; OpenCart e-commerce (dissertation); CodeIgniter hotel booking; additional ERP modules.',
    stack: ['Python ML stack', 'Laravel', 'OpenCart', 'CodeIgniter'],
  },
]

export const experience = {
  company: 'The Study Room',
  role: 'Web Developer Intern',
  period: 'June 2022 – January 2023',
  place: 'UK',
  bullets: [
    'Led development of an ERP system for day-to-day operations: student, course, staff, finance, inventory, reporting, LMS integration, security, and mobile-friendly access.',
    'Delivered full-stack work: responsive front ends (HTML, CSS, JavaScript) and backends with Ruby on Rails, Flask, and Django.',
    'Carried out testing, debugging, and optimisation; provided training and ongoing support to improve adoption and reliability.',
  ],
}

export const education = [
  {
    degree: 'MSc Computer Science (with industrial placement)',
    school: 'University of East London',
    period: 'May 2021 – May 2023',
    detail: 'Modules: Artificial Intelligence, Cloud Computing, Big Data, Advanced Software Engineering',
  },
  {
    degree: 'Bachelor of Computer Engineering',
    school: 'Silver Oak College of Engineering and Technology (GTU), India',
    period: 'August 2016 – August 2020',
    detail:
      'Modules: data structures, DBMS, OOP (C++), networks, operating systems, Python, MySQL/Oracle, Linux',
  },
]

export const certifications = [
  'AWS Academy Graduate',
  'AWS Cloud Practitioner',
  'Google Digital Unlocked — Fundamentals of Digital Marketing',
  'Agile Development',
  'DCB Bank Hackathon',
  'LinkedIn skill assessments and further coursework (including AI-related topics)',
]

export const interests =
  'Hackathons, cricket (former team captain), continuous learning in web and cloud technologies.'
