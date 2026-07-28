# Chintan Panchal — portfolio

Interactive CV / portfolio tour for job applications and builder partnerships (UK).

## Single source of truth

Edit **`src/data/siteContent.ts`** for profile, links, projects, skills, and experience.

Keep these in sync when you change facts:

| File | Purpose |
|------|---------|
| `src/data/siteContent.ts` | Live site content |
| `../Chintan-Panchal-Resume/Chintan-Panchal-Resume.md` | CV (edit first) |
| `../Chintan-Panchal-Resume/Chintan-Panchal-Resume.html` | Print / PDF CV |

After a Vercel deploy, set `profile.portfolioUrl` and replace `PORTFOLIO_LIVE_URL` in the resume files.

## Stack

- React · Vite · TypeScript
- Framer Motion · Three.js / React Three Fiber

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy on Vercel

1. Repo: [cpanchal112233-svg/portfolio-](https://github.com/cpanchal112233-svg/portfolio-)
2. Import in [Vercel](https://vercel.com) — framework **Vite**, build `npm run build`, output `dist`
3. Paste the production URL into `profile.portfolioUrl` and the resume

## Key links

- GitHub: https://github.com/cpanchal112233-svg
- TARU: https://github.com/cpanchal112233-svg/TARU-
- LinkedIn: https://www.linkedin.com/in/uncodeworld-chintan

## Licence

Personal portfolio — your content.
