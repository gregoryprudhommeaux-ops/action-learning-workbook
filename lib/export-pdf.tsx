"use client";

import { pdf } from "@react-pdf/renderer";
import { WorkbookPdfDocument } from "@/components/pdf/workbook-document";
import type { WorkbookState } from "@/lib/types";
import { fileSlug } from "@/lib/workbook-state";

export async function downloadWorkbookPdf(input: {
  state: WorkbookState;
  initiative: string;
  regionsLabel: string;
  frictionText: string;
  analysis: string;
  roi: { monthly: number; pilot: number };
  packStatus: string;
}) {
  const date = new Date().toISOString().split("T")[0];
  const blob = await pdf(
    <WorkbookPdfDocument
      state={input.state}
      initiative={input.initiative}
      regionsLabel={input.regionsLabel}
      frictionText={input.frictionText}
      analysis={input.analysis}
      roi={input.roi}
      packStatus={input.packStatus}
      date={date}
    />,
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `ALP_${fileSlug(input.state.projectName)}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
