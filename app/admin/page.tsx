import { canReadPacks, superAdminEmailsEnv } from "@/lib/admin-auth";
import { loadAdminSession } from "@/lib/admin-session";
import { AdminShell } from "@/components/admin/shell";
import { AdminWaiting } from "@/components/admin/waiting";
import { listFacilitators } from "@/lib/facilitators";
import { listSubmissions } from "@/lib/submissions";

export default async function AdminPage() {
  const session = await loadAdminSession();
  if (!session) {
    return null;
  }

  if (!canReadPacks(session.role)) {
    return (
      <AdminWaiting
        name={session.name}
        email={session.email}
        role={session.role === "rejected" ? "rejected" : "pending"}
      />
    );
  }

  const role = session.role;
  if (role !== "superAdmin" && role !== "facilitator") {
    return (
      <AdminWaiting
        name={session.name}
        email={session.email}
        role="pending"
      />
    );
  }

  const superAdminEmailsConfigured = Boolean(superAdminEmailsEnv()?.trim());
  const [submissions, facilitators] = await Promise.all([
    listSubmissions(),
    role === "superAdmin" ? listFacilitators() : Promise.resolve([]),
  ]);

  return (
    <AdminShell
      name={session.name}
      email={session.email}
      role={role}
      submissions={submissions}
      facilitators={facilitators}
      superAdminEmailsConfigured={superAdminEmailsConfigured}
    />
  );
}
