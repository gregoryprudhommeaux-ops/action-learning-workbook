import { NextResponse } from "next/server";
import { requirePackAccess } from "@/lib/admin-session";
import { listSubmissions } from "@/lib/submissions";

export async function GET() {
  const access = await requirePackAccess();
  if (!access.ok) {
    return NextResponse.json(
      { error: access.error },
      { status: access.status },
    );
  }
  const submissions = await listSubmissions();
  return NextResponse.json({ submissions });
}
