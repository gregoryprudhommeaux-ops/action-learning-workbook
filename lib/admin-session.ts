import { currentUser } from "@clerk/nextjs/server";
import {
  canReadPacks,
  isSuperAdmin,
  resolveAdminRole,
  superAdminEmailsEnv,
  type AdminRole,
} from "@/lib/admin-auth";
import { upsertFacilitator } from "@/lib/facilitators";

export type AdminSession = {
  userId: string;
  email: string;
  name: string;
  role: AdminRole;
};

export async function loadAdminSession(): Promise<AdminSession | null> {
  const user = await currentUser();
  if (!user) return null;

  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    "";
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.fullName ||
    "Facilitator";

  const isSuper = isSuperAdmin(email);

  const facilitator = email
    ? await upsertFacilitator({
        clerkUserId: user.id,
        email,
        initialStatus: isSuper ? "approved" : "pending",
      })
    : null;

  const role = resolveAdminRole({
    email,
    facilitatorStatus: facilitator?.status ?? null,
  });

  return {
    userId: user.id,
    email: email || "—",
    name,
    role,
  };
}

export async function requirePackAccess(): Promise<
  | { ok: true; session: AdminSession }
  | { ok: false; status: 401 | 403; error: string }
> {
  const session = await loadAdminSession();
  if (!session) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }
  if (!canReadPacks(session.role)) {
    return {
      ok: false,
      status: 403,
      error: "Facilitator account is not approved yet",
    };
  }
  return { ok: true, session };
}

export async function requireSuperAdmin(): Promise<
  | { ok: true; session: AdminSession }
  | { ok: false; status: 401 | 403 | 503; error: string }
> {
  const session = await loadAdminSession();
  if (!session) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }
  if (!superAdminEmailsEnv()?.trim()) {
    return {
      ok: false,
      status: 503,
      error: "SUPER_ADMIN_EMAILS is not configured",
    };
  }
  if (session.role !== "superAdmin") {
    return { ok: false, status: 403, error: "Super Admin only" };
  }
  return { ok: true, session };
}

/** @deprecated Use requireSuperAdmin */
export const requireDeveloper = requireSuperAdmin;
