# Action Learning Workbook

Interactive 7-step workbench for a cross-border Action Learning Project: scope, cultural diagnostic, SLA / DRI governance, regional playbook, pilot KPIs, and a printable executive summary.

Progress is stored in the browser (`localStorage`). Export JSON for backup or to restore on another machine. **Participant workbook** (`/`) is public (no login). **Facilitator admin** (`/admin`) is gated by **Google sign-in** via Clerk.

## Mainland China (simple + free)

Phase 1 is on `main`: the participant workbook (`/`) does not load Clerk or Google Fonts.

### Custom subdomain (do this next)

Use a subdomain of `nextstep-services.com` pointed at the existing Vercel project. Free with Cloudflare DNS you already use.

Suggested host: **`alp.nextstep-services.com`**

**1. Vercel** → project `action-learning-workbook` → **Settings → Domains** → Add  
`alp.nextstep-services.com`

**2. Cloudflare** (zone `nextstep-services.com`) → **DNS** → Add record:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | `alp` | `cname.vercel-dns.com` | **DNS only** (grey cloud) |

Use the exact target Vercel shows if it differs. Keep the orange Cloudflare proxy **off** for this record.

**3. Clerk** (facilitator login only) → add the new origin:
- Allowed origins / redirect URLs: `https://alp.nextstep-services.com`
- Include `/sign-in`, `/sign-up`, `/sso-callback`, `/admin` as needed in Clerk redirects

**4. Share with CN participants**  
`https://alp.nextstep-services.com/`  
(not the `*.vercel.app` URL)

**5. Smoke test**  
From mainland China: page loads, Network has no `clerk.*` / `fonts.googleapis` on `/`.  
Facilitator (outside China): `https://alp.nextstep-services.com/admin` still works with Google.

No ICP, no second host, no paid China CDN. Access can still be slow on some ISPs; this is the max with the current free stack.

## Local development

```bash
npm install
npx vercel env pull .env.local --yes
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The workbook is public; open `/admin` (or `/sign-in`) for facilitator Google login.

## Production build

```bash
npm run build
npm start
```

## Deploy on Vercel

The project is linked as `nextstep-services/action-learning-workbook`. Clerk keys come from the Vercel Marketplace integration.

```bash
npx vercel --prod --yes
```

Required env vars (auto-provisioned by Clerk on Vercel):

- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- `DATABASE_URL` (Neon)
- `SUPER_ADMIN_EMAILS` — your Google email (Super Admin). Only this account can approve or reject facilitators. `DEVELOPER_EMAILS` still works as a legacy alias.

### Roles

| Role | Who | Access |
|---|---|---|
| **Super Admin** | Email listed in `SUPER_ADMIN_EMAILS` (you) | Full `/admin`, approve/reject facilitators |
| **Facilitator** | Google sign-up at `/sign-up`, then **approved by Super Admin** | Inbox / packs only after approval |
| **Pending** | Signed up, waiting | Waiting screen only |

Flow: facilitator opens `/sign-up` → Google → pending → you sign in at `/admin` → **Facilitators to approve** → Approve.

## What teams fill in

1. Strategic purpose
2. Initiative, company, regions, impact narrative
3. Cultural diagnostic (radar)
4. SLA targets and a single DRI
5. Editable regional playbook cards
6. 4–6 week pilot + hours-saved calculator
7. Compiled summary (print / PDF / JSON)
