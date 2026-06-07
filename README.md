# Linkvault

A personal bookmark manager. Save links privately, mark the ones you want public, and share a clean `/@handle` profile page with anyone.

**Live:** https://linkvault-rho.vercel.app
**Stack:** Next.js 14 · Supabase · Resend · Vercel · TypeScript · Tailwind

---

## Local setup

### 1. Clone and install
```bash
git clone https://github.com/harshthanki-codes/linkvault.git
cd linkvault
npm install
```

### 2. Set up Supabase
1. Create a project at supabase.com
2. Open the SQL editor and run `supabase/migrations/001_initial.sql`
3. In Settings → API, copy your Project URL, anon key, and service_role key
4. In Authentication → URL Configuration set Site URL to `http://localhost:3000` and add `http://localhost:3000/auth/callback` to Redirect URLs

### 3. Set up Resend
1. Create an account at resend.com
2. Create an API key and verify your sending domain

### 4. Environment variables
```bash
cp .env.local.example .env.local
```
Fill in all values in `.env.local`

### 5. Run
```bash
npm run dev
```
Open http://localhost:3000

---

## Where the AI agent got it wrong

The agent initially generated RLS policies with `using (true)` on the bookmarks select policy, meaning any authenticated user could read every other user's bookmarks directly via the API. I caught it by calling the Supabase REST endpoint with a different user's JWT and confirming rows came back that should not have been visible. I fixed the policy to scope it to `using (auth.uid() = user_id)` for all private operations, keeping a separate public-read policy limited to `is_public = true` rows only.

The agent also scaffolded the Supabase clients without explicit parameter types on the cookie handlers, which caused TypeScript to infer them as `never` during the Vercel build even though the local build passed. I caught this by running `npx supabase gen types typescript` to replace the manual type stub with real generated types, then added explicit `CookieOptions` annotations where needed.

---

## What I would improve with more time

Handle rename currently breaks any previously shared URLs. A `handle_history` table mapping old handles to the current user ID would preserve all existing links transparently without any redirect configuration needed.
