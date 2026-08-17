import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { listSubmissions } from "@/lib/submissions";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const submissions = await listSubmissions();
  return NextResponse.json({ submissions });
}
