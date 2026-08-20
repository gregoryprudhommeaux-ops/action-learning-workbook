"use client";

import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { WorkbookState } from "@/lib/types";
import type { Locale } from "@/lib/i18n/types";
import { translate } from "@/lib/i18n/translate";
import { tCompanyAsName, tRegionField, tRegionName, tRegionTagline } from "@/lib/i18n/labels";
import { PDF_FONT } from "@/lib/pdf-fonts";

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
    fontFamily: PDF_FONT,
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
    fontFamily: PDF_FONT,
    fontWeight: 700,
  },
  headerTitle: {
    color: "#f1f5f9",
    fontSize: 11,
    fontFamily: PDF_FONT,
    fontWeight: 700,
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
    fontFamily: PDF_FONT,
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  h1: {
    fontSize: 16,
    fontFamily: PDF_FONT,
    fontWeight: 700,
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
    fontFamily: PDF_FONT,
    fontWeight: 700,
  },
  metaValue: {
    fontSize: 8,
    fontFamily: PDF_FONT,
    fontWeight: 700,
    color: navy,
    lineHeight: 1.3,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: PDF_FONT,
    fontWeight: 700,
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
    fontFamily: PDF_FONT,
    fontStyle: "italic",
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
    fontFamily: PDF_FONT,
    fontWeight: 700,
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
    fontFamily: PDF_FONT,
    fontWeight: 700,
    fontSize: 7,
    color: navy,
  },
  td: {
    fontSize: 8,
    color: slate,
    lineHeight: 1.3,
  },
  tdBold: {
    fontSize: 8,
    color: slate,
    lineHeight: 1.3,
    fontFamily: PDF_FONT,
    fontWeight: 700,
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
    fontFamily: PDF_FONT,
    fontWeight: 700,
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
    fontFamily: PDF_FONT,
    fontWeight: 700,
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
  locale: Locale;
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
  locale,
}: PdfProps) {
  const t = (key: string, vars?: Record<string, string | number>) =>
    translate(locale, key, vars);
  const company = tCompanyAsName(locale, state.companyName);
  const activeRegions = state.regions.filter((region) =>
    state.activeRegionIds.includes(region.id),
  );

  return (
    <Document
      title={`${state.projectName} — ${t("app.titleShort")}`}
      author={state.authorFullName || state.companyName || t("app.title")}
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerBar} fixed>
          <View>
            <Text style={styles.badge}>ALP</Text>
            <Text style={[styles.headerTitle, { marginTop: 6 }]}>
              {t("app.title")}
            </Text>
          </View>
          <View>
            <Text style={styles.headerMeta}>{company}</Text>
            <Text style={styles.headerMeta}>{packStatus}</Text>
            <Text style={styles.headerMeta}>{date}</Text>
          </View>
        </View>

        <Text style={styles.kicker}>{t("pdf.kicker")}</Text>
        <Text style={styles.h1}>{txt(state.projectName)}</Text>

        <View style={[styles.metaRow, { marginBottom: 10 }]}>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>{t("pdf.prepared")}</Text>
            <Text style={styles.metaValue}>{txt(state.authorFullName)}</Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>{t("pdf.position")}</Text>
            <Text style={styles.metaValue}>{txt(state.authorPosition)}</Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>{t("pdf.company")}</Text>
            <Text style={styles.metaValue}>{company}</Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>{t("pdf.email")}</Text>
            <Text style={styles.metaValue}>{txt(state.authorEmail)}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>{t("pdf.initiative")}</Text>
            <Text style={styles.metaValue}>{txt(initiative)}</Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>{t("pdf.regions")}</Text>
            <Text style={styles.metaValue}>{txt(regionsLabel)}</Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>{t("pdf.score")}</Text>
            <Text style={styles.metaValue}>{txt(frictionText)}</Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>{t("pdf.p1")}</Text>
            <Text style={styles.metaValue}>
              {t("pdf.hours", { n: state.sla.p1Hours })}
            </Text>
          </View>
        </View>

        <SectionTitle>{t("pdf.s1")}</SectionTitle>
        <Text style={styles.narrative}>“{txt(state.impactNarrative)}”</Text>
        <Text style={[styles.analysis, { marginTop: 8 }]}>{txt(analysis)}</Text>

        <SectionTitle>{t("pdf.s2")}</SectionTitle>
        <View style={styles.grid2}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t("pdf.a")}</Text>
            <Text style={styles.cardBody}>{txt(state.examples.a)}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t("pdf.b")}</Text>
            <Text style={styles.cardBody}>{txt(state.examples.b)}</Text>
          </View>
        </View>
        <View style={styles.grid2}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t("pdf.c")}</Text>
            <Text style={styles.cardBody}>{txt(state.examples.c)}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t("pdf.d")}</Text>
            <Text style={styles.cardBody}>{txt(state.examples.d)}</Text>
          </View>
        </View>

        <SectionTitle>{t("pdf.s3")}</SectionTitle>
        <View style={styles.tableHeader}>
          <Text style={[styles.th, styles.colPri]}>{t("pdf.priority")}</Text>
          <Text style={[styles.th, styles.colCh]}>{t("pdf.channel")}</Text>
          <Text style={[styles.th, styles.colSla]}>{t("pdf.sla")}</Text>
          <Text style={[styles.th, styles.colExp]}>{t("pdf.expect")}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tdBold, styles.colPri]}>{t("pdf.p1row")}</Text>
          <Text style={[styles.td, styles.colCh]}>{txt(state.sla.p1Channel)}</Text>
          <Text style={[styles.td, styles.colSla]}>
            {t("pdf.hours", { n: state.sla.p1Hours })}
          </Text>
          <Text style={[styles.td, styles.colExp]}>{t("pdf.p1exp")}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tdBold, styles.colPri]}>{t("pdf.p2row")}</Text>
          <Text style={[styles.td, styles.colCh]}>{txt(state.sla.p2Channel)}</Text>
          <Text style={[styles.td, styles.colSla]}>
            {t("pdf.days", { n: state.sla.p2Days })}
          </Text>
          <Text style={[styles.td, styles.colExp]}>{t("pdf.p2exp")}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tdBold, styles.colPri]}>{t("pdf.p3row")}</Text>
          <Text style={[styles.td, styles.colCh]}>{txt(state.sla.p3Channel)}</Text>
          <Text style={[styles.td, styles.colSla]}>{t("pdf.p3sla")}</Text>
          <Text style={[styles.td, styles.colExp]}>{t("pdf.p3exp")}</Text>
        </View>

        <SectionTitle>{t("pdf.s4")}</SectionTitle>
        <View style={styles.dri}>
          <Text>{t("pdf.deliverable", { task: txt(state.dri.task) })}</Text>
          <Text style={styles.driOwner}>{txt(state.dri.owner)}</Text>
        </View>

        <SectionTitle>{t("pdf.s5")}</SectionTitle>
        <View style={styles.grid2}>
          {[state.pilot.change1, state.pilot.change2, state.pilot.change3].map(
            (change, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardTitle}>
                  {t("pdf.routine", { n: index + 1 })}
                </Text>
                <Text style={styles.cardBody}>{txt(change)}</Text>
              </View>
            ),
          )}
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.th, styles.colKpi]}>{t("pdf.kpi")}</Text>
          <Text style={[styles.th, styles.colBase]}>{t("pdf.base")}</Text>
          <Text style={[styles.th, styles.colTarg]}>{t("pdf.targ")}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.td, styles.colKpi]}>
            {txt((state.pilot.kpiName1 ?? "").trim() || t("pilot.k1"))}
          </Text>
          <Text style={[styles.td, styles.colBase]}>{txt(state.pilot.kpiBase1)}</Text>
          <Text style={[styles.td, styles.colTarg]}>{txt(state.pilot.kpiTarg1)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.td, styles.colKpi]}>
            {txt((state.pilot.kpiName2 ?? "").trim() || t("pilot.k2"))}
          </Text>
          <Text style={[styles.td, styles.colBase]}>{txt(state.pilot.kpiBase2)}</Text>
          <Text style={[styles.td, styles.colTarg]}>{txt(state.pilot.kpiTarg2)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.td, styles.colKpi]}>
            {txt((state.pilot.kpiName3 ?? "").trim() || t("pilot.k3"))}
          </Text>
          <Text style={[styles.td, styles.colBase]}>{txt(state.pilot.kpiBase3)}</Text>
          <Text style={[styles.td, styles.colTarg]}>{txt(state.pilot.kpiTarg3)}</Text>
        </View>

        <View style={[styles.grid2, { marginTop: 10 }]}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t("pdf.month")}</Text>
            <Text style={styles.metaValue}>
              {t("pilot.hrs", { n: roi.monthly })}
            </Text>
            <Text style={styles.cardBody}>
              {t("pdf.proj", {
                size: state.calc.teamSize,
                hours: state.calc.hoursPerWk,
                pct: state.calc.pctGain,
              })}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t("pdf.six")}</Text>
            <Text style={styles.metaValue}>
              {t("pilot.hrs", { n: roi.pilot })}
            </Text>
            <Text style={styles.cardBody}>{t("pdf.recalc")}</Text>
          </View>
        </View>

        <SectionTitle>{t("pdf.s6")}</SectionTitle>
        {activeRegions.map((region) => (
          <View key={region.id} style={[styles.card, { marginBottom: 8 }]} wrap={false}>
            <Text style={styles.cardTitle}>
              {txt(region.code)} · {txt(tRegionName(locale, region))}
            </Text>
            <Text style={[styles.cardBody, { marginBottom: 4, color: muted }]}>
              {txt(tRegionTagline(locale, region))}
            </Text>
            <Text style={styles.cardBody}>
              {t("pdf.comm", {
                text: txt(tRegionField(locale, region, "communication")),
              })}
            </Text>
            <Text style={styles.cardBody}>
              {t("pdf.meet", {
                text: txt(tRegionField(locale, region, "meetingNorms")),
              })}
            </Text>
            <Text style={styles.cardBody}>
              {t("pdf.tip", { text: txt(tRegionField(locale, region, "tip")) })}
            </Text>
            {(region.categories ?? [])
              .filter(
                (category) =>
                  category.title.trim() || category.detail.trim(),
              )
              .map((category) => (
                <Text key={category.id} style={styles.cardBody}>
                  {t("pdf.category", {
                    title: txt(
                      category.title.trim() || t("play.categoryName"),
                    ),
                    text: txt(category.detail),
                  })}
                </Text>
              ))}
          </View>
        ))}

        <SectionTitle>{t("pdf.s7")}</SectionTitle>
        <View style={styles.signRow}>
          <View style={styles.signBox}>
            <Text style={styles.signName}>{txt(state.authorFullName)}</Text>
            <Text style={styles.signHint}>
              {txt(state.authorPosition)}
              {state.companyName ? ` · ${state.companyName}` : ""}
            </Text>
          </View>
          <View style={styles.signBox}>
            <Text style={styles.signName}>{t("pdf.counterpart")}</Text>
            <Text style={styles.signHint}>{t("pdf.confirmed")}</Text>
          </View>
          <View style={styles.signBox}>
            <Text style={styles.signName}>{t("pdf.coach")}</Text>
            <Text style={styles.signHint}>{t("pdf.pending")}</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>{t("pdf.footer", { company })}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              t("pdf.page", { n: pageNumber, total: totalPages })
            }
          />
        </View>
      </Page>
    </Document>
  );
}
