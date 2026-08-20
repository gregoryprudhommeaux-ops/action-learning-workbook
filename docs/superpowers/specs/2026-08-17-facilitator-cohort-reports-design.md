# Facilitator dossiers & cohort reports

Date: 2026-08-17  
Status: draft for review  
Product: Action Learning Workbook (`/Users/gregoryprudhommeaux/Projects/action-learning-workbook`)

## Problem

The facilitator console lists submitted packs and can export one PDF from a thin side panel. It cannot:

1. Read one participant as a full laid-out dossier (radar, SLA, playbook, pilot) and export that as an individual PDF.
2. Group packs into a named cohort after the fact and produce a cumulative report (on screen + PDF).

Gregory is the developer, not the facilitator. Facilitators self-register; he approves them.

## Goals

- Facilitator (approved) reviews packs **one by one** on a dedicated page with the same graphs as the workbook, and exports an **individual PDF**.
- Facilitator creates **named tags** (cohorts), assigns **exactly one** tag per pack (or none), and opens a **cohort report** that aggregates the tagged packs, with a **cohort PDF**.
- Developer, identified by `DEVELOPER_EMAILS`, is the only person who can approve or reject facilitator accounts.

## Non-goals

- Participant-facing cohort code or join flow.
- Multiple tags on one pack.
- Per-facilitator private cohort silos.
- Changing the public workbook steps, localStorage, or submit payload shape (except `cohort_id` stays null at insert).
- Letting pending or rejected accounts read packs.

## Roles

| Role | How it is recognized | What they can do |
|---|---|---|
| Developer | Clerk session email matches `DEVELOPER_EMAILS` (comma-separated, trim, case-insensitive) | Full admin: approve/reject facilitators, all packs, all cohorts, all PDFs |
| Facilitator | Row in `facilitators` with `status = approved` | Inbox, tags, dossiers, cohort reports, PDFs. Cannot approve accounts |
| Pending | Signed into `/admin`, row `status = pending` | Only a waiting screen. No pack APIs |
| Rejected | `status = rejected` | Same waiting/denied screen. Developer can later set `approved` |
| Participant | Not on `/admin` | Fill workbook, submit pack. No tags |

A developer email does not need an approved `facilitators` row. If that email also has a row, ignore the row for authorization.

Missing `DEVELOPER_EMAILS`: admin pages that need a developer (approval queue mutations) fail with a visible config error. Pack listing still requires an approved facilitator or a developer email. If the env is empty and nobody is approved, only the waiting screen exists — no open inbox.

## Auth flow

1. `/admin` and `/api/admin/*` stay Clerk-gated (existing `proxy.ts`). Unauthenticated → `/sign-in?redirect_url=…`.
2. After Google sign-in, upsert `facilitators` on `clerk_user_id` (email from Clerk). First visit → `pending`.
3. If developer email → render full admin (plus approval queue).
4. If `approved` → render facilitator admin (no approval queue).
5. Else → waiting screen: pending copy or rejected copy. No data.

Workbook submit `POST /api/submissions` stays public (identity fields required). It does not assign a cohort.

## Data model

Keep existing Neon `submissions` table. Add:

### `facilitators`

- `id` uuid PK
- `clerk_user_id` text unique not null
- `email` text not null
- `status` text not null: `pending` \| `approved` \| `rejected`
- `created_at` timestamptz
- `reviewed_at` timestamptz null
- `reviewed_by_email` text null

### `cohorts`

- `id` uuid PK
- `name` text not null
- `created_by_clerk_user_id` text not null
- `created_at` timestamptz

Name: trim, reject empty, unique among existing rows (case-insensitive). Rename allowed if the new name stays unique. Delete allowed: set `submissions.cohort_id` to null for those packs, then delete the cohort row. No soft delete.

### `submissions`

- Add `cohort_id` uuid null references `cohorts(id)`
- At most one cohort per pack (column, not a join table)
- Insert path leaves `cohort_id` null (inbox: **Unassigned**)

All approved facilitators and the developer share the same cohort list and the same pack pool.

## Information architecture

Three screens (plus waiting):

### Inbox — `/admin`

- Stats for the **current filter** (not always the global pool): pack count, ready, incomplete, avg friction.
- Filter chips: All | Unassigned | one chip per cohort tag.
- Create tag: inline name + save.
- Table of packs in the filter: submitted at, person, company, friction, status, **tag control** (select: Unassigned or a cohort). Changing the select writes `cohort_id`.
- Row click (not the select) → `/admin/packs/[id]`.
- When a cohort chip is active: button **Open cohort report** → `/admin/cohorts/[id]`.
- Developer only: **Accounts to review** list (pending first, then rejected). Approve / Reject.

### Dossier — `/admin/packs/[id]`

Full-page read-only layout of `payload`, same visual language as the workbook (navy / brand-blue, existing Chart.js radar + SLA bars):

1. Identity (name, email, position, company) + project / initiative / regions / status / submitted at
2. Impact narrative
3. Cultural diagnostic radar + friction badge + analysis text
4. SLA table + DRI
5. Active playbook cards
6. Pilot changes, KPIs, ROI hours

Prev / next within the **same inbox filter** (query `?cohort=` or `unassigned` / `all`, default `all`).  
**Export individual PDF**: reuse `downloadWorkbookPdf` / `WorkbookPdfDocument`. Filename `ALP_<project-slug>_<person-slug>.pdf`. Locale selector unchanged.

Unknown id → 404 page inside admin shell, not a crash.

### Cohort report — `/admin/cohorts/[id]`

Header: tag name, member count, rename, delete (confirm).  
Aggregates **only packs with this `cohort_id`**:

| Block | Rule |
|---|---|
| Headcount | total, ready, incomplete, distinct companies |
| Friction | mean of `frictionPercent` (round integer); band counts low / moderate / high |
| Radar | mean of each of the four `diagnosticCounts` axes (display one decimal) |
| SLA | mean `p1Hours`, mean `p2Days`; P1/P2/P3 **channel mode** (most frequent non-empty string; ties → alphabetical) |
| ROI | **sum** of monthly hours and of pilot hours |
| Initiatives | frequency list (existing `cohortStats` idea, scoped to the tag) |
| Regions | frequency of active region names |
| Members | table linking to each dossier |

Free-text narratives, playbook tips, and DRI owners are **not** concatenated into the report body. Member table is the drill-down.

Empty cohort (tag exists, zero packs): zeros, empty radar, empty member table, PDF still exportable (cover + “no packs”).

**Export cohort PDF**: new `@react-pdf/renderer` document mirroring the on-screen blocks (no live canvas in PDF; numeric tables + friction band bar as colored views). Filename `ALP_cohort_<name-slug>.pdf`. Same locale selector pattern as individual export.

Unknown id → 404 in admin shell.

## API (all under `/api/admin`, Clerk + role checks)

| Method | Path | Who | Effect |
|---|---|---|---|
| GET | `/api/admin/me` | signed-in | `{ role: "developer" \| "facilitator" \| "pending" \| "rejected" }` |
| GET | `/api/admin/submissions` | developer or approved | list packs including `cohortId` |
| PATCH | `/api/admin/submissions/[id]` | developer or approved | `{ cohortId: string \| null }` only |
| GET | `/api/admin/cohorts` | developer or approved | list tags |
| POST | `/api/admin/cohorts` | developer or approved | `{ name }` |
| PATCH | `/api/admin/cohorts/[id]` | developer or approved | `{ name }` |
| DELETE | `/api/admin/cohorts/[id]` | developer or approved | unassign packs, delete tag |
| GET | `/api/admin/cohorts/[id]/report` | developer or approved | packs + precomputed aggregates |
| GET | `/api/admin/facilitators` | developer | pending/rejected/approved list |
| PATCH | `/api/admin/facilitators/[id]` | developer | `{ status: "approved" \| "rejected" }` |

Pending/rejected hitting pack or cohort APIs → 403.

Existing `GET /api/admin/submissions` today returns packs after any signed-in user. That must tighten to developer or approved facilitator.

## Errors

- Pending/rejected: dedicated screen, never a pack 404.
- Duplicate cohort name: 409, inline error on the create/rename field.
- PDF generation failure: keep the page; show toast/error; do not download an empty file.
- Missing `DATABASE_URL`: admin data fetches fail with a config message; public workbook still runs (submit will 500 until DB exists — already true).
- Missing `DEVELOPER_EMAILS`: approval actions 503 with config message; developer queue hidden.

## i18n

New copy in existing locales only (`en`, `zh` — there is no `fr` or `es` locale). Keys under `admin.*` (waiting, tags, unassigned, dossier, cohort report, approve/reject). No WuXi. No internal persona names.

## Tests (node:test, same style as `lib/cohort-stats.test.ts`)

1. A pack cannot store two `cohort_id` values (assignment replaces).
2. Deleting a cohort nulls `cohort_id` on its packs.
3. `isDeveloper(email)` matches the env list, case-insensitive, ignores extra spaces.
4. `canReadPacks(role)` is false for pending and rejected.
5. Cohort aggregates: given three fixtures, mean friction, summed ROI, radar means, band counts match expected numbers.
6. Channel mode: tie broken alphabetically.

UI Playwright is out of scope for this spec.

## Implementation notes

- Stack stays Next.js App Router, Clerk Google SSO, Neon, Chart.js, `@react-pdf/renderer`, Tailwind.
- Reuse `FrictionRadar`, `SlaBarChart`, `cohortStats` (extend or add `cohortReport(rows)` rather than rewrite).
- `ensure*Table` stays in `lib/db.ts` (current pattern) unless a small migration helper is cleaner; do not introduce Prisma.
- `DEVELOPER_EMAILS` in `.env.example` and Vercel env; never commit real emails in the repo.

## Success

A facilitator Gregory has approved can tag submitted packs, open each as a graph dossier with PDF, and open a named cohort whose report and PDF reflect only those members.
