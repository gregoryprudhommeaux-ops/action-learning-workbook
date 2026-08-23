import { NextResponse } from "next/server";
import { identityComplete } from "@/lib/completeness";
import { notifyFacilitatorsOfSubmission } from "@/lib/facilitator-notify";
import { insertSubmission } from "@/lib/submissions";
import type { WorkbookState } from "@/lib/types";

function adminDashboardUrl(request: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv) return `${fromEnv.replace(/\/$/, "")}/admin`;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}/admin`;
  return "/admin";
}

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
    void notifyFacilitatorsOfSubmission(record, adminDashboardUrl(request)).catch(
      (error) => {
        console.error("Facilitator notify error:", error);
      },
    );
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
