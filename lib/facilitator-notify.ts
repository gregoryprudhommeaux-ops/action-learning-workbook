import type { SubmissionRecord } from "@/lib/submission-snapshot";

function parseNotifyEmails(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
}

export function facilitatorNotifyEmails(): string[] {
  return parseNotifyEmails(process.env.FACILITATOR_NOTIFY_EMAILS);
}

export async function notifyFacilitatorsOfSubmission(
  record: SubmissionRecord,
  adminUrl: string,
): Promise<void> {
  const to = facilitatorNotifyEmails();
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (to.length === 0 || !apiKey) return;

  const from =
    process.env.EMAIL_FROM?.trim() ??
    "ALP Workbook <onboarding@resend.dev>";

  const subject = `New pack submitted — ${record.authorFullName || record.authorEmail}`;
  const text = [
    "A participant just submitted an Action Learning pack.",
    "",
    `Name: ${record.authorFullName || "—"}`,
    `Email: ${record.authorEmail}`,
    `Company: ${record.companyName || "—"}`,
    `Position: ${record.authorPosition || "—"}`,
    `Project: ${record.projectName || "—"}`,
    `Status: ${record.packStatus}`,
    `Friction: ${record.frictionPercent}/100`,
    "",
    `Open the facilitator dashboard: ${adminUrl}`,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Facilitator notify email failed:", res.status, body);
  }
}
