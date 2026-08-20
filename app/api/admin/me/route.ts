import { NextResponse } from "next/server";
import { loadAdminSession } from "@/lib/admin-session";

export async function GET() {
  const session = await loadAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    role: session.role,
    email: session.email,
    name: session.name,
  });
}
