import { currentUser } from "@clerk/nextjs/server";
import { AdminShell } from "@/components/admin/shell";
import { listSubmissions } from "@/lib/submissions";

export default async function AdminPage() {
  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    "—";
  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.fullName ||
    "Facilitator";
  const submissions = await listSubmissions();

  return <AdminShell name={name} email={email} submissions={submissions} />;
}
