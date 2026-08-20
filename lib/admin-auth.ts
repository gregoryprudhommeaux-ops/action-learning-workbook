export type AdminRole = "developer" | "facilitator" | "pending" | "rejected";

export type FacilitatorStatus = "pending" | "approved" | "rejected";

/** Comma-separated env list → trimmed lowercased emails. */
export function parseDeveloperEmails(
  raw: string | undefined | null = process.env.DEVELOPER_EMAILS,
): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
}

export function isDeveloper(
  email: string | null | undefined,
  rawEnv: string | undefined | null = process.env.DEVELOPER_EMAILS,
): boolean {
  if (!email?.trim()) return false;
  const allowed = parseDeveloperEmails(rawEnv);
  if (allowed.length === 0) return false;
  return allowed.includes(email.trim().toLowerCase());
}

export function canReadPacks(role: AdminRole): boolean {
  return role === "developer" || role === "facilitator";
}

export function resolveAdminRole(opts: {
  email: string | null | undefined;
  facilitatorStatus: FacilitatorStatus | null;
  developerEmailsEnv?: string | null;
}): AdminRole {
  if (isDeveloper(opts.email, opts.developerEmailsEnv)) {
    return "developer";
  }
  if (opts.facilitatorStatus === "approved") return "facilitator";
  if (opts.facilitatorStatus === "rejected") return "rejected";
  return "pending";
}
