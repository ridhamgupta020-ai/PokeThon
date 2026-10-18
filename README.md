# PokeThon — 24-Hour Offline Innovation Sprint

Official platform for **PokeThon**, a 24-hour offline innovation sprint organized by **Fusion Tech Club** at **PW Institute of Innovation, Noida**.

---

## ⚡ Phase 1: Project Setup and Design System

Phase 1 establishes a scalable, full-stack foundation separating the frontend application, reusable UI components, routing, layouts, design system tokens, API services, and modular backend Express routes, controllers, middleware, and database utilities.

### 🎨 Design System Specifications

| Token | Hex Value | Application |
|---|---|---|
| **Primary Background** | `#06152B` | Main viewport canvas |
| **Secondary Background** | `#0B2342` | Surfaces, card backgrounds, elevated containers |
| **Electric Blue** | `#168BFF` | Neon accent, active states, borders, glow highlights |
| **Pikachu Yellow** | `#FFD83D` | Primary action buttons, marquee accents, spark badges |
| **Main Text** | `#F5F7FC` | High-contrast display headlines and body copy |
| **Secondary Text** | `#B9C7D9` | Subtitles, labels, muted metadata, descriptions |

---

## 🗂️ Architecture & Project Structure

```
├── .env.example                     # Unified environment template
├── frontend.env.example             # Safe client-side environment template
├── backend.env.example              # Server environment template
├── index.html                       # HTML5 entry with Outfit & Plus Jakarta Sans
├── metadata.json                    # AI Studio app metadata
├── package.json                     # Dependencies & scripts
├── server.ts                        # Full-stack server (Express + Vite middleware)
├── server/                          # Independent Backend Architecture
│   ├── config.ts                    # Server configuration & environment variables
│   ├── app.ts                       # Express app initialization
│   ├── db/
│   │   └── supabase.ts              # Supabase PostgreSQL client & SQL schema blueprint
│   ├── middleware/
│   │   ├── auth.middleware.ts       # Organizer key authentication guard
│   │   └── error.middleware.ts      # Global Express error handler
│   ├── controllers/
│   │   ├── registration.controller.ts # Registration handling & validation
│   │   ├── contact.controller.ts    # Inquiry submission handler
│   │   └── admin.controller.ts      # Metrics & team review controller
│   └── routes/
│       ├── index.ts                 # Aggregated API router (/api/...)
│       ├── registration.routes.ts   # /api/registrations
│       ├── contact.routes.ts        # /api/contact
│       └── admin.routes.ts          # /api/admin
├── public/                          # Public Static Assets
│   └── assets/
│       ├── logo/                    # pokethon-logo.svg, fusion-tech-club.svg
│       ├── events/                  # Event photography & track graphics
│       ├── partners/                # Academic & technology logos
│       ├── mascot/                  # Cyber Rai-Volt mascot imagery
│       └── backgrounds/             # Stadium & hex grid backgrounds
└── src/                             # Independent Frontend Architecture
    ├── assets/                      # Generated visual assets & hero artwork
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.tsx           # 3-Zone Top Bar with responsive drawer
    │   │   └── Footer.tsx           # Quiet footer with event details & navigation mirror
    │   └── ui/
    │       ├── PrimaryButton.tsx    # Pikachu yellow CTA with loading & icon support
    │       ├── SecondaryButton.tsx  # Electric blue surface & outline button
    │       ├── PageContainer.tsx    # Spacious standardized layout wrapper
    │       ├── LoadingIndicator.tsx # Glowing electric spinner
    │       ├── FormField.tsx        # TextInput, TextArea, SelectField, CheckboxField
    │       ├── ErrorState.tsx       # Reusable error card with retry handler
    │       └── EmptyState.tsx       # Clean empty state placeholder
    ├── context/
    │   └── ToastContext.tsx         # Global toast provider & useToast hook
    ├── layouts/
    │   └── RootLayout.tsx           # Shell layout with Navbar, Footer, and ToastProvider
    ├── pages/
    │   ├── HomePage.tsx             # Main stage hero, metrics, & design system preview
    │   ├── AboutPage.tsx            # Event story, Fusion Tech Club & PW IOI
    │   ├── RegisterPage.tsx         # Team application portal with client validation
    │   ├── EventsPage.tsx           # 5 Innovation tracks & 24H itinerary
    │   ├── SponsorsPage.tsx         # Partnership tiers (Title, Platinum, Gold)
    │   ├── CommunityPartnersPage.tsx# Student tech community network
    │   ├── PartnersPage.tsx         # Academic & technology alliances
    │   ├── ContactPage.tsx          # Direct inquiry form & venue transit guide
    │   ├── AdminPage.tsx            # Organizer console & registration table
    │   ├── PrivacyPage.tsx          # Privacy policy
    │   ├── TermsPage.tsx            # Code of Conduct & Sprint rules
    │   └── NotFoundPage.tsx         # 404 handler
    ├── services/
    │   └── api.ts                   # Typed REST API service layer
    ├── types/
    │   └── index.ts                 # Core TypeScript definitions
    ├── App.tsx                      # React Router DOM configuration
    ├── index.css                    # Tailwind CSS v4 & custom design system tokens
    └── main.tsx                     # React 19 root bootstrap
```

---

## 🚀 Setup & Execution Instructions

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Environment Configuration
Copy environment templates:
```bash
cp frontend.env.example .env.local
cp backend.env.example .env
```
Configure your Supabase credentials in `.env` when connecting to a remote Supabase project.

### 3. Running Development Server
Start the development server (runs Express API and Vite on port 3000):
```bash
npm run dev
```

### 4. Compiling & Building for Production
```bash
npm run build
npm start
```

---

## 🌐 Routes Overview

| Route | Purpose | Status |
|---|---|---|
| `/` | Main Stage, Event Overview, Design System Actions | Active |
| `/about` | Mission, Fusion Tech Club, PW IOI Campus | Active |
| `/register` | Team Registration Form & Validation | Active |
| `/events` | 5 Tracks & 24-Hour Schedule Breakdown | Active |
| `/sponsors` | Tiers, Partner Perks, Brochure Request | Active |
| `/community-partners` | Student Communities & Perks | Active |
| `/partners` | Institutional & Technology Alliances | Active |
| `/contact` | Inquiry Dispatcher & Noida Transit Guide | Active |
| `/admin` | Organizer Console (Passkey: `pokethon2026`) | Active |
| `/privacy` | Data Handling & Privacy Policy | Active |
| `/terms` | Code of Conduct & Hackathon Rules | Active |
| `/*` | 404 Route Not Found | Active |

---

## 🗄️ Database & Supabase PostgreSQL Roadmap

The backend includes a SQL schema blueprint in `/server/db/supabase.ts` for subsequent phases:
- `registrations` table (team details, lead contacts, tracks, submission statuses)
- `inquiries` table (contact requests, category routing)
- Row Level Security (RLS) policies allowing public inserts and organizer-only read/update access.
- In-memory development store is active out-of-the-box for rapid prototyping until live Supabase credentials are configured.
