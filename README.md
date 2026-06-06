# Linkvault

A personal bookmark manager. Save links privately, mark the ones you want to share as public, and get a clean `/@handle` profile page anyone can visit — no account required.

**Stack:** Next.js 14 · Supabase · Resend · Vercel · TypeScript · Tailwind

---

## Local setup

### 1. Clone and install

```bash
git clone https://github.com/you/linkvault.git
cd linkvault
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run `supabase/migrations/001_initial.sql`.
3. In **Settings → API**, copy your `Project URL`, `anon key`, and `service_role key`.
4. In **Authentication → URL Configuration**, set:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 3. Set up Resend

1. Create an account at [resend.com](https://resend.com).
2. Create an API key.
3. Verify your sending domain — or use `onboarding@resend.dev` while testing locally.

### 4. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in all values in `.env.local`.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

1. Push to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add every variable from `.env.local` as Vercel environment variables.
   - Change `NEXT_PUBLIC_APP_URL` to your Vercel production URL.
4. Update Supabase → Authentication → URL Configuration to include your Vercel URL in Redirect URLs.

---

## Session recording (Entire CLI)

The task requires recording coding-agent sessions with [Entire CLI](https://github.com/entireio/cli) so reviewers can see how the work progressed.

```bash
# Install (macOS / Linux)
brew install --cask entire
# or
curl -fsSL https://entire.io/install.sh | bash

# Authenticate
entire auth login

# Start recording before you begin coding
entire record start

# Sessions push automatically to the entire/checkpoints/v1 branch
# Verify it's syncing before you start:
entire status
```

The `entire.config.json` at the project root configures the project name and auto-redacts secrets (Supabase keys, Resend API key, JWTs) before any session data leaves your machine.

---

## Where the AI agent got it wrong

When I generated the initial RLS policies, the first draft used `using (true)` on the bookmarks select policy, meaning any authenticated user could read every other user's bookmarks directly via the API. I caught it by calling the Supabase REST endpoint with a different user's JWT and confirming rows came back that shouldn't have. Fixed by scoping the owner policy to `using (auth.uid() = user_id)` for all private operations, and keeping the public-read policy explicitly gated on `is_public = true`.

The agent also scaffolded `middleware.ts` without calling `supabase.auth.getUser()` on every request. Supabase's own docs flag this as required — without it, session cookies go stale on long-lived tabs and users get silently logged out mid-session. Added the refresh call to `lib/supabase/middleware.ts`.

---

## What I'd improve with more time

- **Handle redirect table** — renaming your handle currently breaks any previously shared URLs. A `handle_history` table mapping old handles to the current user ID would preserve all existing links transparently.
- **Drag-to-reorder** — a `position` integer column with optimistic-UI drag handles would make the dashboard feel genuinely personal rather than just chronological.
- **Collections / tags** — right now the only axis is public vs private. A lightweight tagging system would let people curate and share specific lists without exposing their entire public collection.
