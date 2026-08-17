import { ensureSubmissionsTable, getSql } from "@/lib/db";
import type { WorkbookState } from "@/lib/types";
import {
  snapshotFromState,
  type SubmissionRecord,
} from "@/lib/submission-snapshot";

type SubmissionRow = {
  id: string;
  created_at: Date | string;
  author_full_name: string;
  author_email: string;
  author_position: string;
  company_name: string;
  project_name: string;
  initiative_id: string;
  initiative_label: string;
  regions_label: string;
  friction_percent: number;
  friction_text: string;
  pack_status: string;
  audit_ready: boolean;
  identity_complete: boolean;
  payload: WorkbookState;
};

function mapRow(row: SubmissionRow): SubmissionRecord {
  return {
    id: row.id,
    createdAt: new Date(row.created_at).toISOString(),
    authorFullName: row.author_full_name,
    authorEmail: row.author_email,
    authorPosition: row.author_position,
    companyName: row.company_name,
    projectName: row.project_name,
    initiativeId: row.initiative_id,
    initiativeLabel: row.initiative_label,
    regionsLabel: row.regions_label,
    frictionPercent: Number(row.friction_percent),
    frictionText: row.friction_text,
    packStatus: row.pack_status,
    auditReady: Boolean(row.audit_ready),
    identityComplete: Boolean(row.identity_complete),
    payload:
      typeof row.payload === "string"
        ? (JSON.parse(row.payload) as WorkbookState)
        : row.payload,
  };
}

export async function insertSubmission(
  state: WorkbookState,
): Promise<SubmissionRecord> {
  await ensureSubmissionsTable();
  const snap = snapshotFromState(state);
  const db = getSql();
  const rows = await db`
    INSERT INTO submissions (
      author_full_name,
      author_email,
      author_position,
      company_name,
      project_name,
      initiative_id,
      initiative_label,
      regions_label,
      friction_percent,
      friction_text,
      pack_status,
      audit_ready,
      identity_complete,
      payload
    ) VALUES (
      ${snap.authorFullName},
      ${snap.authorEmail},
      ${snap.authorPosition},
      ${snap.companyName},
      ${snap.projectName},
      ${snap.initiativeId},
      ${snap.initiativeLabel},
      ${snap.regionsLabel},
      ${snap.frictionPercent},
      ${snap.frictionText},
      ${snap.packStatus},
      ${snap.auditReady},
      ${snap.identityComplete},
      ${snap.payload}
    )
    RETURNING *
  `;
  return mapRow(rows[0] as SubmissionRow);
}

export async function listSubmissions(): Promise<SubmissionRecord[]> {
  await ensureSubmissionsTable();
  const db = getSql();
  const rows = await db`
    SELECT * FROM submissions ORDER BY created_at DESC
  `;
  return (rows as SubmissionRow[]).map(mapRow);
}

export async function getSubmission(
  id: string,
): Promise<SubmissionRecord | null> {
  await ensureSubmissionsTable();
  const db = getSql();
  const rows = await db`
    SELECT * FROM submissions WHERE id = ${id} LIMIT 1
  `;
  const row = rows[0] as SubmissionRow | undefined;
  return row ? mapRow(row) : null;
}
