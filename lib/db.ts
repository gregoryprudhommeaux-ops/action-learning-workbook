import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let sql: NeonQueryFunction<false, false> | null = null;

export function getSql() {
  if (!sql) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL is not set");
    }
    sql = neon(url);
  }
  return sql;
}

export async function ensureSubmissionsTable() {
  const db = getSql();
  await db`
    CREATE TABLE IF NOT EXISTS submissions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at timestamptz NOT NULL DEFAULT now(),
      author_full_name text NOT NULL,
      author_email text NOT NULL,
      author_position text NOT NULL,
      company_name text NOT NULL,
      project_name text NOT NULL,
      initiative_id text NOT NULL,
      initiative_label text NOT NULL,
      regions_label text NOT NULL,
      friction_percent integer NOT NULL,
      friction_text text NOT NULL,
      pack_status text NOT NULL,
      audit_ready boolean NOT NULL,
      identity_complete boolean NOT NULL,
      payload jsonb NOT NULL
    )
  `;
  await db`CREATE INDEX IF NOT EXISTS submissions_created_at_idx ON submissions (created_at DESC)`;
}
