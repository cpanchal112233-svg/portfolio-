# Chintan Panchal — portfolio site

Single-page portfolio for job applications (UK). Content lives in `src/data/content.ts` so you can update copy, links, and skills in one place.

## Develop

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Deploy (e.g. Vercel)

1. Push this folder to a GitHub repository.
2. Import the repo in [Vercel](https://vercel.com) — framework preset **Vite**, build command `npm run build`, output directory `dist`.
3. Add a custom domain when ready.

## Customise

- **GitHub button:** set `github` in `src/data/content.ts` to your profile URL (e.g. `https://github.com/yourname`).
- **Project links:** add `href: 'https://…'` on entries in the `projects` array to show a “View” link.
- **PDF CV:** upload to `public/` and link from the contact section if you want a download button (say if you want that added).

## Licence

Personal portfolio — your content.
