# R. Ramesh Arts Studio — E-commerce Website

A full-featured, multilingual e-commerce platform for **R. Ramesh Arts Studio**, a family-rooted business (Est. 2002) handcrafting Ganpati idols in Solapur, Maharashtra. Customers can browse idols and accessories, pay online or via COD/UPI, and pre-book for the season — while the owner manages the entire business from a custom admin dashboard, no code required.

🔗 **Live site:** [rramesharts.com](https://rramesharts.com)

##  Features

### Storefront
- Product catalog by category (Dashboard, Shadu Mati, Fiber, POP idols) with multi-photo galleries
- Accessories shop with "Add to cart" and "Order on WhatsApp"
- Heritage, "Visit Our Studio", testimonials, and content pages (About, Contact, etc.)
- Fully responsive, mobile-first design with a floating WhatsApp button

### Cart, checkout & payments
- Shopping cart with coupon support
- Razorpay online payments + COD/UPI
- Smart shipping logic (free within Solapur; tiered rates outside)
- Season pre-booking with token advance and per-product capacity limits

### Admin dashboard
- Product & accessory CRUD with multiple images
- Order management: payment/progress status, owner notes, full event timeline
- Live dashboard with filters, counts, revenue summary, search, and "needs attention" flags
- Bulk actions, one-tap status updates, and a daily `/today` make-and-deliver view
- Sequential invoice numbers (`RA-YYYY-NNNN`) and branded PDF receipts (with Marathi/Hindi support)
- One-tap WhatsApp/email customer notifications
- Contact-message inbox, team/testimonials/coupons/gallery management, season open/close control

### Platform
- **Trilingual** — English / Hindi / Marathi (cookie-based locale)
- Customer login & order tracking (Supabase auth)
- SEO: sitemap, robots, and structured data (LocalBusiness + Product JSON-LD)
- Transactional emails to the owner for orders and enquiries

---

##  Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14.2 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Database & Auth | Supabase (Postgres) |
| Payments | Razorpay |
| Email | Resend |
| PDF receipts | pdf-lib |
| Hosting | Netlify (CI/CD from GitHub) |

---

##  Getting Started

### Prerequisites
- Node.js 18.17+ and npm
- Accounts for Supabase, Razorpay, and Resend

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/pradnyajadhav15/Ganapati-project.git
cd Ganapati-project

# 2. Install dependencies
npm install

# 3. Create your environment file
#    (copy the variables below into a new .env.local file)

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

---

##  Environment Variables

Create a `.env.local` file in the project root with the following:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Resend (email)
RESEND_API_KEY=your-resend-api-key
OWNER_EMAIL=owner@example.com
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side admin access (keep secret) |
| `RAZORPAY_KEY_ID` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret (keep secret) |
| `RESEND_API_KEY` | Resend API key for sending emails |
| `OWNER_EMAIL` | Address that receives order/contact notifications |

>  Use **test** keys locally and **live** keys only in production. Never commit `.env.local` to Git.

---

##  Project Structure (high level)

```
app/            # Next.js App Router pages & routes
  admin/        # Owner dashboard (orders, products, today, messages, etc.)
  collections/  # Category & accessories listing pages
  product/      # Product detail pages
  checkout/     # Checkout flow & server actions
  account/      # Customer login & order tracking
  (content)     # about, contact, privacy, terms, refund-policy, shipping-policy ...
components/     # Reusable UI (cards, cart, buttons, grids)
lib/            # supabase, email, receipt, i18n, products helpers
public/         # Images, fonts, icons
```

---

##  Deployment

The site is deployed on **Netlify** with continuous deployment from the `main` branch:

1. Push to `main` on GitHub → Netlify automatically builds and publishes.
2. Environment variables are configured in **Netlify → Site configuration → Environment variables**.
3. Custom domain (`rramesharts.com`) is managed via Netlify DNS with automatic HTTPS.

---

##  Author

Built by **Pradnya Jadhav** as a freelance web development project.

---

##  License

This project was built for R. Ramesh Arts Studio. All rights reserved.
