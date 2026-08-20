import { NextResponse } from "next/server";
import { requireDeveloper } from "@/lib/admin-session";
import { setFacilitatorStatus } from "@/lib/facilitators";

type Body = { status?: string };

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const access = await requireDeveloper();
  if (!access.ok) {
    return NextResponse.json(
      { error: access.error },
      { status: access.status },
    );
  }

  const { id } = await context.params;
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.status !== "approved" && body.status !== "rejected") {
    return NextResponse.json(
      { error: "status must be approved or rejected" },
      { status: 400 },
    );
  }

  const facilitator = await setFacilitatorStatus({
    id,
    status: body.status,
    reviewedByEmail: access.session.email,
  });
  if (!facilitator) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ facilitator });
}
