import { NextResponse } from "next/server";
import { requirePackAccess } from "@/lib/admin-session";
import { getSubmission } from "@/lib/submissions";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const access = await requirePackAccess();
  if (!access.ok) {
    return NextResponse.json(
      { error: access.error },
      { status: access.status },
    );
  }
  const { id } = await context.params;
  const submission = await getSubmission(id);
  if (!submission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ submission });
}
