import type {
  InitiativeId,
  Region,
  RegionAccent,
  TabId,
  WorkbookState,
} from "./types";

export const STORAGE_KEY = "alp_workbook_state_v4";

/** Facilitator cohort defaults — pre-filled; participants may edit for their team. */
export const SLA_COHORT_BASELINE = {
  p1BaselineHours: 24,
  p2BaselineDays: 4,
} as const;

export const TABS: { id: TabId; label: string; short: string }[] = [
  { id: "briefing", label: "Strategic Purpose", short: "Purpose" },
  { id: "scope", label: "Initiative Scope", short: "Scope" },
  { id: "diagnostic", label: "Cultural Diagnostic", short: "Diagnostic" },
  { id: "governance", label: "SLA & Governance", short: "SLA" },
  { id: "playbook", label: "Regional Playbook", short: "Playbook" },
  { id: "pilot", label: "Pilot & KPI Calculator", short: "Pilot" },
  { id: "compiled", label: "Executive Summary", short: "Summary" },
];

export const INITIATIVES: {
  id: InitiativeId;
  label: string;
  description: string;
}[] = [
  {
    id: "audit",
    label: "Regulatory / compliance audit",
    description:
      "Cross-site evidence packs, QA readiness, and inspector-facing files.",
  },
  {
    id: "transfer",
    label: "Cross-site transfer",
    description:
      "Process, knowledge, or operations handover between sites.",
  },
  {
    id: "process",
    label: "Global process alignment",
    description:
      "SOPs, tooling, or operating-model rollout across regions.",
  },
  {
    id: "client-vendor",
    label: "Client & vendor integration",
    description:
      "Joint support workflows and supply-chain coordination.",
  },
  {
    id: "other",
    label: "Other operational focus",
    description: "Describe the initiative in your own words.",
  },
];

export const ACCENT_STYLES: Record<
  RegionAccent,
  { wrap: string; tag: string; card: string }
> = {
  red: {
    wrap: "bg-red-50/50 border-red-200",
    tag: "text-red-700",
    card: "border-red-100",
  },
  amber: {
    wrap: "bg-amber-50/50 border-amber-200",
    tag: "text-amber-800",
    card: "border-amber-100",
  },
  emerald: {
    wrap: "bg-emerald-50/50 border-emerald-200",
    tag: "text-emerald-800",
    card: "border-emerald-100",
  },
  blue: {
    wrap: "bg-blue-50/50 border-blue-200",
    tag: "text-blue-800",
    card: "border-blue-100",
  },
  purple: {
    wrap: "bg-purple-50/50 border-purple-200",
    tag: "text-purple-800",
    card: "border-purple-100",
  },
  slate: {
    wrap: "bg-slate-50 border-slate-200",
    tag: "text-slate-700",
    card: "border-slate-100",
  },
};

export const DEFAULT_REGIONS: Region[] = [
  {
    id: "us",
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    tagline: "Low context · Egalitarian · Action-oriented",
    communication:
      "Direct, enthusiastic, low context. Feedback is often wrapped in a positive–critique–positive sandwich.",
    meetingNorms:
      "Fast-paced and action-oriented. High expectation of individual initiative regardless of rank.",
    tip: "Flag risks and delays early in explicit language. Close every call with named next-step owners.",
    accent: "blue",
  },
  {
    id: "cn",
    code: "CN",
    name: "China",
    flag: "🇨🇳",
    tagline: "High context · Consensus-oriented · Implicit hierarchy",
    communication:
      "Relational and harmony-focused. Direct negative feedback is often avoided in public settings to preserve face.",
    meetingNorms:
      "Informal pre-alignment builds the real consensus. Silence in large forums often reflects respect for hierarchy rather than agreement.",
    tip: "Follow live calls with written bullet summaries and named owners so mutual understanding is explicit.",
    accent: "red",
  },
  {
    id: "sg",
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    tagline: "High efficiency · Multicultural · Process-disciplined",
    communication:
      "Professional, precise, and multilingual. Harmony and face matter in mixed rooms; decisions still expect a clear process owner.",
    meetingNorms:
      "Agendas and pre-reads are expected. Silence may mean the decision path is unclear, not that people agree.",
    tip: "Confirm owners and next steps in writing after the call. Do not treat a quiet room as sign-off.",
    accent: "purple",
  },
  {
    id: "ie",
    code: "IE",
    name: "Ireland",
    flag: "🇮🇪",
    tagline: "English-speaking EU · Informal · Candid",
    communication:
      "Conversational and relationship-aware, with relatively direct pushback once trust is there. Humor can mask a real objection.",
    meetingNorms:
      "Works well with short alignment calls plus a written recap. Last-minute agenda changes land poorly before a locked review.",
    tip: "Ask what is actually blocking the date. Informal agreement still needs a named owner and a deadline.",
    accent: "emerald",
  },
  {
    id: "de",
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    tagline: "Low context · Structured planning · Direct feedback",
    communication:
      "Explicit, objective, detail-oriented. Constructive criticism is treated as professional duty, not personal hostility.",
    meetingNorms:
      "Agendas distributed 48+ hours ahead. High need for complete data before committing to deadlines.",
    tip: "Avoid ad-hoc schedule changes. Send the analytical pack before the meeting, not during it.",
    accent: "amber",
  },
];

export const DIAGNOSTIC_AXES = [
  {
    key: "a" as const,
    title: "Diagnostic A: The Clock & Boundaries (Urgency & Time)",
    emoji: "⏱️",
    tag: "Monochronic vs Polychronic",
    items: [
      {
        id: "a1" as const,
        label:
          '"ASAP" or "Urgent" is defined differently across sites (one region expects 48h notice; another expects after-hours responsiveness; another enforces offline boundaries).',
      },
      {
        id: "a2" as const,
        label:
          "Virtual meetings consistently force one region to join during late-night or early-morning off-hours.",
      },
      {
        id: "a3" as const,
        label:
          'Friction balancing urgent task execution ("Doing") and respecting personal energy boundaries ("Being").',
      },
    ],
    examplePlaceholder:
      "e.g., One site requested a 3-week planning lock while HQ needed 24-hour turnarounds...",
  },
  {
    key: "b" as const,
    title: "Diagnostic B: Voice & Trust (Feedback & Psychological Safety)",
    emoji: "🎙️",
    tag: "High Context & Face",
    items: [
      {
        id: "b1" as const,
        label:
          "During joint calls, one region dominates speaking time while another stays quiet or highly indirect.",
      },
      {
        id: "b2" as const,
        label:
          "The team dives into task metrics and skips time to build personal, relationship-based trust.",
      },
      {
        id: "b3" as const,
        label:
          'Colleagues hesitate to escalate risks or push back on unrealistic timelines for fear of causing loss of "face."',
      },
    ],
    examplePlaceholder:
      "e.g., Silence on the cross-site QA call was read as consent, but unresolved issues remained...",
  },
  {
    key: "c" as const,
    title: "Diagnostic C: Message & Clarity (Communication Style)",
    emoji: "💬",
    tag: "Direct vs Implicit",
    items: [
      {
        id: "c1" as const,
        label:
          "Feedback feels too blunt from one region, or too implicit and vague from another.",
      },
      {
        id: "c2" as const,
        label:
          "Critical decisions are made verbally in meetings and never land in a central written channel.",
      },
      {
        id: "c3" as const,
        label:
          'The team treats a nod or "Yes, I understand" as "Yes, I will execute the action item."',
      },
    ],
    examplePlaceholder:
      "e.g., Review comments were taken personally because of harsh low-context phrasing...",
  },
  {
    key: "d" as const,
    title: "Diagnostic D: Power & Structure (Accountability & Governance)",
    emoji: "🏛️",
    tag: "Power Distance & DRI",
    items: [
      {
        id: "d1" as const,
        label:
          'Deliverables stall because no single Directly Responsible Individual (DRI) is named across sites.',
      },
      {
        id: "d2" as const,
        label:
          "Overseas sites act independently without alignment, or HQ micromanages small operational tasks.",
      },
      {
        id: "d3" as const,
        label:
          "Time is lost waiting for multi-layer sign-offs instead of pre-agreed decision boundaries.",
      },
    ],
    examplePlaceholder:
      "e.g., Sign-off was delayed 10 days because three managers claimed partial ownership without a DRI...",
  },
];

const EMPTY_DIAGNOSTICS: WorkbookState["diagnostics"] = {
  a1: false,
  a2: false,
  a3: false,
  b1: false,
  b2: false,
  b3: false,
  c1: false,
  c2: false,
  c3: false,
  d1: false,
  d2: false,
  d3: false,
};

export const defaultState: WorkbookState = {
  authorFullName: "",
  authorEmail: "",
  authorPosition: "",
  companyName: "",
  initiativeId: "audit",
  customInitiative: "",
  projectName: "",
  activeRegionIds: [],
  regions: DEFAULT_REGIONS,
  impactNarrative: "",
  diagnostics: EMPTY_DIAGNOSTICS,
  examples: { a: "", b: "", c: "", d: "" },
  sla: {
    p1Channel: "",
    p1BaselineHours: SLA_COHORT_BASELINE.p1BaselineHours,
    p1Hours: 0,
    p2Channel: "",
    p2BaselineDays: SLA_COHORT_BASELINE.p2BaselineDays,
    p2Days: 0,
    p3Channel: "",
  },
  dri: { task: "", owner: "" },
  pilot: {
    change1: "",
    change2: "",
    change3: "",
    kpiName1: "",
    kpiBase1: "",
    kpiTarg1: "",
    kpiName2: "",
    kpiBase2: "",
    kpiTarg2: "",
    kpiName3: "",
    kpiBase3: "",
    kpiTarg3: "",
  },
  calc: {
    teamSize: 0,
    hoursPerWk: 0,
    pctGain: 0,
  },
};

export const exampleState: WorkbookState = {
  authorFullName: "",
  authorEmail: "",
  authorPosition: "",
  companyName: "",
  initiativeId: "audit",
  customInitiative: "",
  projectName: "Cross-site process transfer & audit alignment",
  activeRegionIds: ["us", "cn", "sg", "ie", "de"],
  regions: DEFAULT_REGIONS,
  impactNarrative:
    "Validation reviews between the US and German sites currently take 6 days because of time-zone lag and implicit feedback styles. Cutting that to 48 hours protects the submission window.",
  diagnostics: {
    a1: true,
    a2: false,
    a3: true,
    b1: true,
    b2: false,
    b3: true,
    c1: true,
    c2: false,
    c3: true,
    d1: true,
    d2: false,
    d3: true,
  },
  examples: {
    a: "The German site requested a 3-week planning lock while the US site needed 24-hour turnarounds.",
    b: "Silence on the cross-site QA call was read as consent, but unresolved issues remained.",
    c: "Review comments were taken personally because of harsh low-context phrasing.",
    d: "Sign-off was delayed 10 days because three managers claimed partial ownership without a DRI.",
  },
  sla: {
    p1Channel: "Voice call + emergency email",
    p1BaselineHours: SLA_COHORT_BASELINE.p1BaselineHours,
    p1Hours: 4,
    p2Channel: "Shared board tag or [ACTION REQUIRED] email",
    p2BaselineDays: SLA_COHORT_BASELINE.p2BaselineDays,
    p2Days: 2,
    p3Channel: "Asynchronous video update / digest",
  },
  dri: {
    task: "Cross-site SOP validation",
    owner: "DRI: Alex Chen (US QA Lead)",
  },
  pilot: {
    change1:
      "Mandatory [ACTION REQUIRED] subject tags on P2 emails with explicit SLA dates",
    change2:
      "Rotate meeting facilitators across US, China, Singapore, Ireland, and Germany bi-weekly, with pre-shared agendas",
    change3:
      "Name a single DRI for every cross-site transfer deliverable",
    kpiName1: "SOP review response time",
    kpiBase1: "Average 4 days",
    kpiTarg1: "≤ 2 business days",
    kpiName2: "Off-hours call frequency",
    kpiBase2: "3x per week",
    kpiTarg2: "≤ 1x per month",
    kpiName3: "Cross-site trust rating",
    kpiBase3: "3.2 / 5.0",
    kpiTarg3: "≥ 4.2 / 5.0",
  },
  calc: {
    teamSize: 12,
    hoursPerWk: 8,
    pctGain: 25,
  },
};

export function emptyRegion(): Region {
  return {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `region-${Date.now()}`,
    code: "NEW",
    name: "New region",
    flag: "🌍",
    tagline: "Describe the cultural profile",
    communication: "",
    meetingNorms: "",
    tip: "",
    accent: "slate",
  };
}
