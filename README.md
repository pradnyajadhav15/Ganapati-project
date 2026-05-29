# R. Ramesh Arts Studio

Eco-friendly Ganpati idol e-commerce site. Built with Next.js 14 (App Router),
TypeScript, and Tailwind CSS.

## Run it locally

You already have Node.js, so:

```bash
npm install
npm run dev
```

Open http://localhost:3000

> First run downloads the Google Fonts (Fraunces + Mukta) — needs internet once.

## What's built (Phase 1 + 2)

- Pastel design system (see `tailwind.config.ts` for the palette tokens)
- Shared Navbar (with Our Collections dropdown) + Footer + Announcement bar
- Home page: hero, featured murtis, founders/team section, why-choose-us
- Collections: overview + Dashboard / Shadu Mati / Fiber category pages
- Customized Work, Partnership, Initiative, Media Coverage pages
- Reusable components: ProductCard, SectionHeading, PageHero, CollectionView

## Where to plug in your content

| What | File |
|---|---|
| Products / prices / categories | `lib/products.ts` |
| Team names + bios | `app/page.tsx` (the `team` array) |
| YouTube video IDs | `app/media-coverage/page.tsx` (the `videos` array) |
| Colours | `tailwind.config.ts` |
| Logo (replace ૐ mark) | `components/Navbar.tsx` + put file in `public/` |

## Roadmap (next phases)

3. Database + admin (Supabase): add/remove products, upload photos
4. Auth: customer signup/login + admin login
5. Cart + checkout (real "Add to Cart" / "Buy Now" wiring)
6. Razorpay payments (test mode first)
7. Receipts/bills saved to database + full admin dashboard

## Deploy

Push to GitHub, import to vercel.com — it auto-deploys. Free.
