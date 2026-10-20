# Pocket Thon — Hackathon Platform

Next.js 14 (TypeScript, Tailwind, Framer Motion) · FastAPI · Supabase (Postgres + Auth + RLS)

```
pocket-thon/
├── frontend/            Next.js app (landing, auth, registration, dashboards, /admin)
├── backend/             FastAPI API (JWT verification, role checks, business rules, CSV export, email)
└── supabase/migrations/ 0001_schema.sql, 0002_rls.sql
```

## How security works

- Supabase Auth issues the session. The browser sends the access token to FastAPI.
- FastAPI **verifies the token** (JWKS for asymmetric signing keys, or `SUPABASE_JWT_SECRET` for legacy HS256) and then reads the user's **role from the `profiles` table** — never from the request.
- Every `/api/admin/*` route sits behind `require_admin`. The `/admin` pages also gate server-side, but the API is the real enforcement.
- RLS is enabled on every table. Triggers stop participants changing `role`, `status`, `admin_notes`, `email` or `registration_number`, even when talking to Supabase directly with the anon key.
- The service-role key lives only in the backend environment.

## 1. Supabase setup

1. Create a project at supabase.com.
2. SQL Editor → run `supabase/migrations/0001_schema.sql`, then `0002_rls.sql`.
3. Authentication → Providers: keep **Email** enabled and turn on **Confirm email**.
4. Authentication → URL Configuration: set Site URL to your frontend URL and add `https://<your-domain>/auth/callback` (and `http://localhost:3000/auth/callback` for dev) to Redirect URLs.
5. Project Settings → API: copy the Project URL, publishable key, and backend-only secret key. If your project still uses the legacy JWT secret, also copy it (Settings → JWT); projects on asymmetric signing keys need no JWT secret.
6. **Create the first admin** (only possible from the SQL editor): sign up through the site, then run
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```

## 2. Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CORS_ORIGINS
uvicorn app.main:app --reload   # http://localhost:8000/docs
pytest                          # 32 tests, no Supabase needed (uses an in-memory fake)
```

Optional emails: set `RESEND_API_KEY`, `EMAIL_FROM` (a verified sender) and `ADMIN_NOTIFY_EMAIL`.

## 3. Frontend

```bash
cd frontend
cp .env.example .env.local      # configure Supabase, API_BASE_URL, and Prisma URLs
npm install
npm run db:generate
npm run dev                     # http://localhost:3000
```

### Prisma foundation (Next.js)

The Next.js app has a Prisma schema matching the public tables in the Supabase migration. Set `DATABASE_URL` to the transaction-pooler URL and `DIRECT_URL` to the session-pooler URL in `frontend/.env.local`, replacing the password placeholder with the rotated database password (URL-encode special characters). `DIRECT_URL` is used for Prisma CLI operations; the Prisma client uses the pooled `DATABASE_URL`.

Run `cd frontend && npm run db:generate` to generate the Prisma client. The current API routes still run through FastAPI and have not been migrated to Prisma. The SQL migration remains authoritative for triggers and constraints; introspect and review the live schema with `npx prisma db pull` before attempting Prisma migrations.

## 4. First run checklist

1. Log in as your admin → **/admin → Event & Content**: set event name, event date (drives the countdown), deadline, description, themes, schedule, prizes, sponsors, FAQ, contact and social links. Nothing on the landing page is hard-coded; empty sections show "coming soon".
2. Sign up as a participant (use a second email) → verify email → **Register** → note the registration ID.
3. As admin: **Registrations** → open the participant → **Approve**. The participant dashboard shows the new status.

## 5. Deployment

**Backend (Render / Railway / Fly.io / any Docker host)**
- Deploy `backend/` with its `Dockerfile` (listens on `$PORT`).
- Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, (`SUPABASE_JWT_SECRET` if legacy), `CORS_ORIGINS=https://your-frontend-domain`.
- Health check: `GET /health`.

**Frontend (Vercel)**
- Import the repo, set **Root Directory** to `frontend`.
- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain`.
- Update Supabase redirect URLs to the production domain.

## Notes & known limits

- `/terms` and `/privacy` contain template text — replace with your organisers' real policies.
- The public status page needs registration ID **and** email, and reveals only the status.
- "Verified participants" counts auth users with a confirmed email (queried through the Supabase admin API).
- Emails are best-effort: a failed send is logged and never blocks registration or approval.
- Rate limiting is not included; put the API behind your host's rate limiter or add `slowapi` before a public launch.
