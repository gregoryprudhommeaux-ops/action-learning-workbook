import { getSql } from "@/lib/db";
import type { FacilitatorStatus } from "@/lib/admin-auth";

export type FacilitatorRecord = {
  id: string;
  clerkUserId: string;
  email: string;
  status: FacilitatorStatus;
  createdAt: string;
  reviewedAt: string | null;
  reviewedByEmail: string | null;
};

type FacilitatorRow = {
  id: string;
  clerk_user_id: string;
  email: string;
  status: FacilitatorStatus;
  created_at: Date | string;
  reviewed_at: Date | string | null;
  reviewed_by_email: string | null;
};

function mapRow(row: FacilitatorRow): FacilitatorRecord {
  return {
    id: row.id,
    clerkUserId: row.clerk_user_id,
    email: row.email,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    reviewedAt: row.reviewed_at
      ? new Date(row.reviewed_at).toISOString()
      : null,
    reviewedByEmail: row.reviewed_by_email,
  };
}

export async function ensureFacilitatorsTable() {
  const db = getSql();
  await db`
    CREATE TABLE IF NOT EXISTS facilitators (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      clerk_user_id text NOT NULL UNIQUE,
      email text NOT NULL,
      status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
      created_at timestamptz NOT NULL DEFAULT now(),
      reviewed_at timestamptz,
      reviewed_by_email text
    )
  `;
  await db`CREATE INDEX IF NOT EXISTS facilitators_status_idx ON facilitators (status)`;
}

/** First visit creates a pending row; later visits refresh email and keep status. */
export async function upsertFacilitator(opts: {
  clerkUserId: string;
  email: string;
}): Promise<FacilitatorRecord> {
  await ensureFacilitatorsTable();
  const db = getSql();
  const email = opts.email.trim().toLowerCase();
  const rows = await db`
    INSERT INTO facilitators (clerk_user_id, email, status)
    VALUES (${opts.clerkUserId}, ${email}, 'pending')
    ON CONFLICT (clerk_user_id) DO UPDATE SET
      email = EXCLUDED.email
    RETURNING *
  `;
  return mapRow(rows[0] as FacilitatorRow);
}

export async function listFacilitators(): Promise<FacilitatorRecord[]> {
  await ensureFacilitatorsTable();
  const db = getSql();
  const rows = await db`
    SELECT * FROM facilitators
    ORDER BY
      CASE status
        WHEN 'pending' THEN 0
        WHEN 'rejected' THEN 1
        ELSE 2
      END,
      created_at DESC
  `;
  return (rows as FacilitatorRow[]).map(mapRow);
}

export async function setFacilitatorStatus(opts: {
  id: string;
  status: "approved" | "rejected";
  reviewedByEmail: string;
}): Promise<FacilitatorRecord | null> {
  await ensureFacilitatorsTable();
  const db = getSql();
  const rows = await db`
    UPDATE facilitators
    SET
      status = ${opts.status},
      reviewed_at = now(),
      reviewed_by_email = ${opts.reviewedByEmail.trim().toLowerCase()}
    WHERE id = ${opts.id}
    RETURNING *
  `;
  const row = rows[0] as FacilitatorRow | undefined;
  return row ? mapRow(row) : null;
}
