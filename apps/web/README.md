# QuickTechPro Web (Public Site)

Public marketing website for QuickTechPro (computer repair, onsite IT, and web development in Bangalore), built with Next.js App Router.

## Tech
- Next.js 14 (App Router)
- React 18
- No Tailwind (by request). Minimal custom CSS in `app/globals.css`.

## Scripts
- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm start` — start production server

## Pages Implemented (Phase 1/2)
- `/` — Homepage
- `/services` — Services overview
- `/pricing` — Transparent pricing
- `/about` — Company story & stats
- `/contact` — Contact info + form (static)
- `/booking` — Booking form (static)
- `/faq` — Frequently asked questions
- `/testimonials` — Reviews
- `/blog` and `/blog/[slug]` — Blog placeholder
- `/knowledge-base` — Knowledge base placeholder
- `/service-areas` — Bangalore areas
- `/legal/terms`, `/legal/privacy`, `/legal/refund` — Legal
- `/thank-you/*` — Confirmation pages
- Custom `not-found` (404)

## Notes
- No backend wired yet. Forms post to thank‑you pages (static) as placeholders.
- Payments (Razorpay), email, analytics, sitemap, and schema markup planned for later phases per architecture docs.

## Run Locally
1. `cd apps/web`
2. `npm install`
3. `npm run dev`

Node 18+ required.

