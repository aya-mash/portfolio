# Ayabulela Mahlathini – Portfolio (Work in Progress)

Modern, futuristic portfolio built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Framer Motion.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript (strict)
- Tailwind CSS (dark / neon / glass aesthetic)
- Framer Motion (micro-interactions & scroll choreography)

## Scripts
- `yarn dev` / `npm run dev` / `pnpm dev` – Start dev server (does not auto-open browser)
- `yarn dev:open` – Start dev server and auto-open default browser (Node helper script in `scripts/dev-open.mjs`)
- `yarn build` – Production build
- `yarn start` – Start production server
- `yarn lint` – Lint
- `yarn test` – Run Jest tests

## Install & Run
```bash
yarn install
yarn dev:open
```
Visit http://localhost:3000

## Structure (initial)
```
src/
  app/
    layout.tsx
    page.tsx
  components/
  lib/
  types/
public/
resume.json (to be added)
```

## Design Goals
- High signal, low noise – fast scanning of achievements & impact
- Futuristic feel: neon gradients, procedural grid, soft glass layers
- Motion used as “information hierarchy” not decoration
- Accessible and keyboard friendly

## Coming Soon
- Data-driven sections (Experience, Skills Matrix, Projects Gallery, Timeline)
- API endpoint exposing resume JSON
- Dynamic Open Graph image generation

## Deployment
### Vercel (Recommended)
1. Push repo to GitHub.
2. Import in Vercel, framework auto-detected (Next.js).
3. Set build command: `next build` (default) and output `.next`.
4. Add `NODE_OPTIONS=--enable-source-maps` for better error stack traces (optional).

### Docker (Optional Future)
Sample production Dockerfile (multi-stage) to add later:
```
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* .npmrc* ./
RUN npm install --frozen-lockfile || yarn install --frozen-lockfile || pnpm install --frozen-lockfile

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node","node_modules/next/dist/bin/next","start"]
```

### Static Export Note
Some pages rely on server functions (resume API). Keep SSR; static export not targeted.

## Customization
- Edit `resume.json` and restart dev if structure changes.
- Tailwind theme tokens live in `tailwind.config.cjs` (neon palette, surfaces).
- Global glass styles in `src/app/globals.css`.
- Add new sections by creating a component and mounting it in `src/app/page.tsx`.
- API route at `src/app/api/resume/route.ts` (cache headers configured) – adjust TTL as desired.
- Profile image: place `profile.jpg` (optimized ~1200px wide) in `public/`. Component: `ProfileImage` used inside `Hero`.

## Performance Ideas (Planned)
- Framer Motion `LazyMotion` with domAnimation strategy.
- Use `next/font` for Inter + JetBrains Mono with CSS fallback.
- Pre-compute derived resume data at build time (Edge-friendly) via `generateStaticParams` if needed.

## Accessibility
- Color contrast tokens defined for both light and dark themes using CSS custom properties; primary text meets WCAG AA (≥4.5:1) on both backgrounds.
- Focus states use accent border (`--color-accent-border`) with visible ring.
- Motion kept subtle; prefers-reduced-motion respected for new theme transitions.

## Security / Privacy
- No tracking by default. Add first-party analytics (Plausible) later.
- Email link is a `mailto:`; consider contact form + serverless function to protect address.

## License
Personal portfolio – source may be referenced but not relicensed without permission.

## Next Steps (Roadmap)
1. Automated Open Graph image generation (edge function using @vercel/og).
2. OG card summarizing achievements badges.
3. Blog / writing section (MDX with contentlayer).
4. Dark / Synthwave / Mono theme triplet (current implementation: Light & Dark with smooth variable transitions).
5. Interactive 3D accent (R3F minimal wireframe orb) toggled for reduced motion users.
6. Analytics (Plausible) + simple events for link clicks.
7. Print-friendly PDF export page styled from same resume data.
8. RSS feed for future articles / changelog.
9. Add unit tests for data loader and transformation logic.
10. Lighthouse CI config in GitHub Actions.
