import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { AuthUser } from "@/components/auth-user";
import { AdminDashboard } from "@/components/admin/dashboard";
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-700 bg-navy-900 text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="rounded bg-brand-blue px-2.5 py-1 text-xs font-bold tracking-wider uppercase">
              ALP
            </span>
            <div>
              <h1 className="text-sm font-semibold sm:text-base">
                Facilitator dashboard
              </h1>
              <p className="hidden text-xs text-slate-400 sm:block">
                {name} · {email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-slate-300 transition hover:text-white"
            >
              Workbook
            </Link>
            <AuthUser />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="mb-6 max-w-2xl text-sm text-slate-600">
          Who is ready for the live session. Export PDF only lives here — the
          public workbook submits packs, it does not print them.
        </p>
        <AdminDashboard initialSubmissions={submissions} />
      </main>
    </div>
  );
}
