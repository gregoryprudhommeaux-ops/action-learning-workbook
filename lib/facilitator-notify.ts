import type { SubmissionRecord } from "@/lib/submission-snapshot";

function parseNotifyEmails(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
}

function parseSender():
  | {
      name: string;
      email: string;
    }
  | null {
  const from = process.env.EMAIL_FROM?.trim();
  if (from) {
    const bracketed = from.match(/^(.+?)\s*<([^>]+)>$/);
    if (bracketed) {
      return { name: bracketed[1].trim(), email: bracketed[2].trim() };
    }
    return { name: "ALP Workbook", email: from };
  }

  const email = process.env.BREVO_SENDER_EMAIL?.trim();
  if (!email) return null;
  return {
    name: process.env.BREVO_SENDER_NAME?.trim() ?? "ALP Workbook",
    email,
  };
}

export function facilitatorNotifyEmails(): string[] {
  return parseNotifyEmails(process.env.FACILITATOR_NOTIFY_EMAILS);
}

export async function notifyFacilitatorsOfSubmission(
  record: SubmissionRecord,
  adminUrl: string,
): Promise<void> {
  const to = facilitatorNotifyEmails();
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const sender = parseSender();
  if (to.length === 0 || !apiKey || !sender) return;

  const subject = `New pack submitted — ${record.authorFullName || record.authorEmail}`;
  const textContent = [
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

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender,
      to: to.map((email) => ({ email })),
      subject,
      textContent,
      tags: ["alp-workbook", "pack-submitted"],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Facilitator notify email failed:", res.status, body);
  }
}
