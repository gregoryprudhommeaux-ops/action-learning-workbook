import { NextResponse } from "next/server";
import { requireDeveloper } from "@/lib/admin-session";
import { listFacilitators } from "@/lib/facilitators";

export async function GET() {
  const access = await requireDeveloper();
  if (!access.ok) {
    return NextResponse.json(
      { error: access.error },
      { status: access.status },
    );
  }
  const facilitators = await listFacilitators();
  return NextResponse.json({ facilitators });
}
