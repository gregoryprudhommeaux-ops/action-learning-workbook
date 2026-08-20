# Action Learning Workbook

Interactive 7-step workbench for a cross-border Action Learning Project: scope, cultural diagnostic, SLA / DRI governance, regional playbook, pilot KPIs, and a printable executive summary.

Progress is stored in the browser (`localStorage`). Export JSON for backup or to restore on another machine. Access is gated by **Google sign-in** via Clerk.

## Local development

```bash
npm install
npx vercel env pull .env.local --yes
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to Google login.

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
