import { frictionBand } from "@/lib/submission-snapshot";
import type { SubmissionRecord } from "@/lib/submission-snapshot";

export type CohortStats = {
  total: number;
  ready: number;
  incomplete: number;
  avgFriction: number;
  bands: { low: number; moderate: number; high: number };
  initiatives: { label: string; count: number }[];
  companies: number;
};

export function isPackReady(row: SubmissionRecord) {
  return row.auditReady && row.identityComplete;
}

export function cohortStats(rows: SubmissionRecord[]): CohortStats {
  const total = rows.length;
  const ready = rows.filter(isPackReady).length;
  const bands = { low: 0, moderate: 0, high: 0 };
  const initiativeMap = new Map<string, number>();
  const companies = new Set<string>();

  for (const row of rows) {
    bands[frictionBand(row.frictionPercent)] += 1;
    initiativeMap.set(
      row.initiativeLabel,
      (initiativeMap.get(row.initiativeLabel) ?? 0) + 1,
    );
    if (row.companyName) companies.add(row.companyName);
  }

  return {
    total,
    ready,
    incomplete: total - ready,
    avgFriction:
      total === 0
        ? 0
        : Math.round(
            rows.reduce((sum, row) => sum + row.frictionPercent, 0) / total,
          ),
    bands,
    initiatives: [...initiativeMap.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count),
    companies: companies.size,
  };
}
