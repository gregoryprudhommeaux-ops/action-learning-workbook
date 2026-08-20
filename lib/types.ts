export type TabId =
  | "briefing"
  | "scope"
  | "diagnostic"
  | "governance"
  | "playbook"
  | "pilot"
  | "compiled";

export type InitiativeId =
  | "audit"
  | "transfer"
  | "process"
  | "client-vendor"
  | "other";

export type RegionAccent =
  | "red"
  | "amber"
  | "emerald"
  | "blue"
  | "purple"
  | "slate";

export interface Region {
  id: string;
  code: string;
  name: string;
  flag: string;
  tagline: string;
  communication: string;
  meetingNorms: string;
  tip: string;
  accent: RegionAccent;
}

export interface Diagnostics {
  a1: boolean;
  a2: boolean;
  a3: boolean;
  b1: boolean;
  b2: boolean;
  b3: boolean;
  c1: boolean;
  c2: boolean;
  c3: boolean;
  d1: boolean;
  d2: boolean;
  d3: boolean;
}

export type DiagnosticKey = keyof Diagnostics;

export interface WorkbookState {
  authorFullName: string;
  authorEmail: string;
  authorPosition: string;
  companyName: string;
  /** Set when the participant continues past Strategic Purpose. */
  briefingComplete: boolean;
  initiativeId: InitiativeId;
  customInitiative: string;
  projectName: string;
  activeRegionIds: string[];
  regions: Region[];
  impactNarrative: string;
  diagnostics: Diagnostics;
  examples: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  sla: {
    p1Channel: string;
    p1Hours: number;
    p2Channel: string;
    p2Days: number;
    p3Channel: string;
  };
  dri: {
    task: string;
    owner: string;
  };
  pilot: {
    change1: string;
    change2: string;
    change3: string;
    kpiName1: string;
    kpiBase1: string;
    kpiTarg1: string;
    kpiName2: string;
    kpiBase2: string;
    kpiTarg2: string;
    kpiName3: string;
    kpiBase3: string;
    kpiTarg3: string;
  };
  calc: {
    teamSize: number;
    hoursPerWk: number;
    pctGain: number;
  };
}
