"use client";

import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import type { WorkbookState } from "@/lib/types";
import { companyAsName } from "@/lib/workbook-state";

const navy = "#0f172a";
const brand = "#1e40af";
const slate = "#334155";
const muted = "#64748b";
const lineColor = "#e2e8f0";
const wash = "#f8fafc";

function txt(value: string | number | undefined) {
  if (value === undefined || value === null) return "—";
  const text = String(value).trim();
  return text.length > 0 ? text : "—";
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 78,
    paddingBottom: 48,
    paddingHorizontal: 42,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: slate,
  },
  headerBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: navy,
    paddingHorizontal: 42,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    backgroundColor: brand,
    color: "#ffffff",
    fontSize: 8,
    letterSpacing: 1.2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontFamily: "Helvetica-Bold",
  },
  headerTitle: {
    color: "#f1f5f9",
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },
  headerMeta: {
    color: "#94a3b8",
    fontSize: 8,
    textAlign: "right",
  },
  kicker: {
    color: brand,
    fontSize: 8,
    letterSpacing: 1.4,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  h1: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: navy,
    marginBottom: 10,
    lineHeight: 1.25,
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  metaCard: {
    flex: 1,
    backgroundColor: wash,
    borderWidth: 1,
    borderColor: lineColor,
    borderRadius: 4,
    padding: 8,
  },
  metaLabel: {
    fontSize: 7,
    color: muted,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 3,
    fontFamily: "Helvetica-Bold",
  },
  metaValue: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: navy,
    lineHeight: 1.3,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: muted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: lineColor,
    paddingBottom: 4,
    marginTop: 12,
    marginBottom: 8,
  },
  narrative: {
    backgroundColor: "#eff6ff",
    borderLeftWidth: 3,
    borderLeftColor: brand,
    padding: 10,
    fontSize: 9,
    lineHeight: 1.45,
    fontFamily: "Helvetica-Oblique",
    color: slate,
  },
  grid2: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: lineColor,
    backgroundColor: wash,
    borderRadius: 4,
    padding: 8,
  },
  cardTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: navy,
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 8,
    lineHeight: 1.4,
    color: slate,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: lineColor,
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: lineColor,
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  th: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    color: navy,
  },
  td: {
    fontSize: 8,
    color: slate,
    lineHeight: 1.3,
  },
  colPri: { width: "22%" },
  colCh: { width: "28%" },
  colSla: { width: "18%" },
  colExp: { width: "32%" },
  colKpi: { width: "40%" },
  colBase: { width: "30%" },
  colTarg: { width: "30%" },
  dri: {
    backgroundColor: navy,
    color: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 4,
  },
  driOwner: {
    color: "#7dd3fc",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  analysis: {
    fontSize: 8,
    lineHeight: 1.4,
    color: slate,
    marginBottom: 4,
  },
  footer: {
    position: "absolute",
    bottom: 22,
    left: 42,
    right: 42,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: muted,
    borderTopWidth: 1,
    borderTopColor: lineColor,
    paddingTop: 6,
  },
  signRow: {
    flexDirection: "row",
    marginTop: 18,
    gap: 16,
  },
  signBox: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#94a3b8",
    paddingTop: 6,
    alignItems: "center",
  },
  signName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: navy,
  },
  signHint: {
    fontSize: 7,
    color: muted,
    marginTop: 2,
  },
});

type PdfProps = {
  state: WorkbookState;
  initiative: string;
  regionsLabel: string;
  frictionText: string;
  analysis: string;
  roi: { monthly: number; pilot: number };
  packStatus: string;
  date: string;
};

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function WorkbookPdfDocument({
  state,
  initiative,
  regionsLabel,
  frictionText,
  analysis,
  roi,
  packStatus,
  date,
}: PdfProps) {
  const activeRegions = state.regions.filter((region) =>
    state.activeRegionIds.includes(region.id),
  );

  return (
    <Document
      title={`${state.projectName} — ALP Workbook`}
      author={state.authorFullName || state.companyName || "Action Learning Workbook"}
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerBar} fixed>
          <View>
            <Text style={styles.badge}>ALP</Text>
            <Text style={[styles.headerTitle, { marginTop: 6 }]}>
              Action Learning Workbook
            </Text>
          </View>
          <View>
            <Text style={styles.headerMeta}>
              {companyAsName(state.companyName)}
            </Text>
            <Text style={styles.headerMeta}>{packStatus}</Text>
            <Text style={styles.headerMeta}>{date}</Text>
          </View>
        </View>

        <Text style={styles.kicker}>
          Compiled executive workbook · confidential working draft
        </Text>
        <Text style={styles.h1}>{txt(state.projectName)}</Text>

        <View style={[styles.metaRow, { marginBottom: 10 }]}>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>Prepared by</Text>
            <Text style={styles.metaValue}>{txt(state.authorFullName)}</Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>Position</Text>
            <Text style={styles.metaValue}>{txt(state.authorPosition)}</Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>Company</Text>
            <Text style={styles.metaValue}>
              {companyAsName(state.companyName)}
            </Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>Email</Text>
            <Text style={styles.metaValue}>{txt(state.authorEmail)}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>Initiative</Text>
            <Text style={styles.metaValue}>{txt(initiative)}</Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>Active regions</Text>
            <Text style={styles.metaValue}>{txt(regionsLabel)}</Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>Diagnostic score</Text>
            <Text style={styles.metaValue}>{txt(frictionText)}</Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>P1 target SLA</Text>
            <Text style={styles.metaValue}>{state.sla.p1Hours} hours</Text>
          </View>
        </View>

        <SectionTitle>1. Operational impact narrative</SectionTitle>
        <Text style={styles.narrative}>
          “{txt(state.impactNarrative)}”
        </Text>
        <Text style={[styles.analysis, { marginTop: 8 }]}>
          {txt(analysis)}
        </Text>

        <SectionTitle>2. Diagnostic friction and examples</SectionTitle>
        <View style={styles.grid2}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>A. Urgency and time</Text>
            <Text style={styles.cardBody}>{txt(state.examples.a)}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>B. Voice and trust</Text>
            <Text style={styles.cardBody}>{txt(state.examples.b)}</Text>
          </View>
        </View>
        <View style={styles.grid2}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>C. Message and clarity</Text>
            <Text style={styles.cardBody}>{txt(state.examples.c)}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>D. Power and structure</Text>
            <Text style={styles.cardBody}>{txt(state.examples.d)}</Text>
          </View>
        </View>

        <SectionTitle>3. Working agreement and SLA protocol</SectionTitle>
        <View style={styles.tableHeader}>
          <Text style={[styles.th, styles.colPri]}>Priority</Text>
          <Text style={[styles.th, styles.colCh]}>Primary channel</Text>
          <Text style={[styles.th, styles.colSla]}>Target SLA</Text>
          <Text style={[styles.th, styles.colExp]}>Expectation</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.td, styles.colPri, { fontFamily: "Helvetica-Bold" }]}>
            P1 Critical
          </Text>
          <Text style={[styles.td, styles.colCh]}>{txt(state.sla.p1Channel)}</Text>
          <Text style={[styles.td, styles.colSla]}>{state.sla.p1Hours} hours</Text>
          <Text style={[styles.td, styles.colExp]}>
            Immediate verbal confirmation + incident owner in 2 hrs
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.td, styles.colPri, { fontFamily: "Helvetica-Bold" }]}>
            P2 Standard
          </Text>
          <Text style={[styles.td, styles.colCh]}>{txt(state.sla.p2Channel)}</Text>
          <Text style={[styles.td, styles.colSla]}>
            {state.sla.p2Days} business days
          </Text>
          <Text style={[styles.td, styles.colExp]}>
            Written feedback or extension before the deadline
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.td, styles.colPri, { fontFamily: "Helvetica-Bold" }]}>
            P3 Info-only
          </Text>
          <Text style={[styles.td, styles.colCh]}>{txt(state.sla.p3Channel)}</Text>
          <Text style={[styles.td, styles.colSla]}>No live response</Text>
          <Text style={[styles.td, styles.colExp]}>
            Reviewed asynchronously; questions in scheduled syncs
          </Text>
        </View>

        <SectionTitle>4. Directly Responsible Individual</SectionTitle>
        <View style={styles.dri}>
          <Text>Deliverable: {txt(state.dri.task)}</Text>
          <Text style={styles.driOwner}>{txt(state.dri.owner)}</Text>
        </View>

        <SectionTitle>5. 4–6 week pilot plan and KPIs</SectionTitle>
        <View style={styles.grid2}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Routine 1</Text>
            <Text style={styles.cardBody}>{txt(state.pilot.change1)}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Routine 2</Text>
            <Text style={styles.cardBody}>{txt(state.pilot.change2)}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Routine 3</Text>
            <Text style={styles.cardBody}>{txt(state.pilot.change3)}</Text>
          </View>
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.th, styles.colKpi]}>KPI</Text>
          <Text style={[styles.th, styles.colBase]}>Baseline</Text>
          <Text style={[styles.th, styles.colTarg]}>Target</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.td, styles.colKpi]}>SOP review response time</Text>
          <Text style={[styles.td, styles.colBase]}>{txt(state.pilot.kpiBase1)}</Text>
          <Text style={[styles.td, styles.colTarg]}>{txt(state.pilot.kpiTarg1)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.td, styles.colKpi]}>Off-hours call frequency</Text>
          <Text style={[styles.td, styles.colBase]}>{txt(state.pilot.kpiBase2)}</Text>
          <Text style={[styles.td, styles.colTarg]}>{txt(state.pilot.kpiTarg2)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.td, styles.colKpi]}>Cross-site trust rating</Text>
          <Text style={[styles.td, styles.colBase]}>{txt(state.pilot.kpiBase3)}</Text>
          <Text style={[styles.td, styles.colTarg]}>{txt(state.pilot.kpiTarg3)}</Text>
        </View>

        <View style={[styles.grid2, { marginTop: 10 }]}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Hours saved / month</Text>
            <Text style={styles.metaValue}>{roi.monthly} hrs</Text>
            <Text style={styles.cardBody}>
              Team of {state.calc.teamSize} · {state.calc.hoursPerWk} alignment
              hours / person / week · {state.calc.pctGain}% friction reduction
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Saved in 6-week pilot</Text>
            <Text style={styles.metaValue}>{roi.pilot} hrs</Text>
            <Text style={styles.cardBody}>
              Projection only. Recalculate after the live audit if SLA targets
              change.
            </Text>
          </View>
        </View>

        <SectionTitle>6. Regional playbook (active sites)</SectionTitle>
        {activeRegions.map((region) => (
          <View key={region.id} style={[styles.card, { marginBottom: 8 }]} wrap={false}>
            <Text style={styles.cardTitle}>
              {txt(region.code)} · {txt(region.name)}
            </Text>
            <Text style={[styles.cardBody, { marginBottom: 4, color: muted }]}>
              {txt(region.tagline)}
            </Text>
            <Text style={styles.cardBody}>
              Communication: {txt(region.communication)}
            </Text>
            <Text style={styles.cardBody}>
              Meetings: {txt(region.meetingNorms)}
            </Text>
            <Text style={styles.cardBody}>Tip: {txt(region.tip)}</Text>
          </View>
        ))}

        <SectionTitle>7. Sign-off</SectionTitle>
        <View style={styles.signRow}>
          <View style={styles.signBox}>
            <Text style={styles.signName}>{txt(state.authorFullName)}</Text>
            <Text style={styles.signHint}>
              {txt(state.authorPosition)}
              {state.companyName ? ` · ${state.companyName}` : ""}
            </Text>
          </View>
          <View style={styles.signBox}>
            <Text style={styles.signName}>Cross-regional counterpart</Text>
            <Text style={styles.signHint}>Confirmed pre-work</Text>
          </View>
          <View style={styles.signBox}>
            <Text style={styles.signName}>Facilitator / coach</Text>
            <Text style={styles.signHint}>Pending live audit</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>
            Action Learning Workbook · {companyAsName(state.companyName)}
          </Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
