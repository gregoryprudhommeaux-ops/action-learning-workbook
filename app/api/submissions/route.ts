import { NextResponse } from "next/server";
import { identityComplete } from "@/lib/completeness";
import { insertSubmission } from "@/lib/submissions";
import type { WorkbookState } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const state = (await request.json()) as WorkbookState;
    if (!identityComplete(state)) {
      return NextResponse.json(
        {
          error:
            "Name, email, company, and position are required to submit a pack.",
        },
        { status: 400 },
      );
    }
    const record = await insertSubmission(state);
    return NextResponse.json({
      id: record.id,
      createdAt: record.createdAt,
      packStatus: record.packStatus,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not submit the pack." },
      { status: 500 },
    );
  }
}
