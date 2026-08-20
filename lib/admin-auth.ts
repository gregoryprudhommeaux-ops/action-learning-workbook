export type AdminRole = "superAdmin" | "facilitator" | "pending" | "rejected";

export type FacilitatorStatus = "pending" | "approved" | "rejected";

/**
 * Super Admin emails (Gregory Prudhommeaux and any delegates).
 * Prefer SUPER_ADMIN_EMAILS; DEVELOPER_EMAILS still accepted.
 */
export function superAdminEmailsEnv(
  raw?: string | null,
): string | undefined | null {
  if (raw !== undefined) return raw;
  return process.env.SUPER_ADMIN_EMAILS || process.env.DEVELOPER_EMAILS;
}

/** Comma-separated env list → trimmed lowercased emails. */
export function parseSuperAdminEmails(
  raw: string | undefined | null = superAdminEmailsEnv(),
): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
}

/** @deprecated Use parseSuperAdminEmails */
export const parseDeveloperEmails = parseSuperAdminEmails;

export function isSuperAdmin(
  email: string | null | undefined,
  rawEnv: string | undefined | null = superAdminEmailsEnv(),
): boolean {
  if (!email?.trim()) return false;
  const allowed = parseSuperAdminEmails(rawEnv);
  if (allowed.length === 0) return false;
  return allowed.includes(email.trim().toLowerCase());
}

/** @deprecated Use isSuperAdmin */
export const isDeveloper = isSuperAdmin;

export function canReadPacks(role: AdminRole): boolean {
  return role === "superAdmin" || role === "facilitator";
}

export function resolveAdminRole(opts: {
  email: string | null | undefined;
  facilitatorStatus: FacilitatorStatus | null;
  developerEmailsEnv?: string | null;
  superAdminEmailsEnv?: string | null;
}): AdminRole {
  const env = opts.superAdminEmailsEnv ?? opts.developerEmailsEnv;
  if (isSuperAdmin(opts.email, env)) {
    return "superAdmin";
  }
  if (opts.facilitatorStatus === "approved") return "facilitator";
  if (opts.facilitatorStatus === "rejected") return "rejected";
  return "pending";
}
