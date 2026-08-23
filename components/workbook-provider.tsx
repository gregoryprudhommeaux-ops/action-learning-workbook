"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { emptyRegion, exampleState } from "@/lib/defaults";
import type { DiagnosticKey, Region, TabId, WorkbookState } from "@/lib/types";
import { useLocale } from "@/components/locale-provider";
import {
  auditReady,
  identityComplete,
  missingAuditItems,
  pdfExportReady,
  stepStatus,
  type MissingItemId,
  type StepStatus,
} from "@/lib/completeness";
import {
  getWorkbookServerSnapshot,
  getWorkbookSnapshot,
  persistWorkbook,
  setWorkbookState,
  subscribeWorkbook,
} from "@/lib/workbook-store";
import {
  diagnosticCounts,
  fileSlug,
  frictionPercent,
  mergeState,
  roiHours,
} from "@/lib/workbook-state";
import {
  tActiveRegionsLabel,
  tFrictionAnalysis,
  tFrictionBadge,
  tInitiativeLabel,
  tMissingLabel,
  tPackStatus,
} from "@/lib/i18n";

type ToastPayload = { message: string; icon: string };

type WorkbookContextValue = {
  state: WorkbookState;
  tab: TabId;
  setTab: (tab: TabId) => void;
  toast: ToastPayload | null;
  showToast: (message: string, icon?: string) => void;
  update: (patch: Partial<WorkbookState>) => void;
  patch: <K extends keyof WorkbookState>(
    key: K,
    value: Partial<WorkbookState[K]> | WorkbookState[K],
  ) => void;
  toggleDiagnostic: (key: DiagnosticKey) => void;
  toggleRegion: (id: string) => void;
  upsertRegion: (region: Region) => void;
  addRegion: () => string;
  removeRegion: (id: string) => void;
  saveManual: () => void;
  lastSavedAt: number | null;
  loadExample: () => void;
  submitPack: () => Promise<void>;
  exportPdf: () => Promise<void>;
  exportJson: () => void;
  importJson: (file: File) => Promise<void>;
  friction: {
    percent: number;
    counts: [number, number, number, number];
    badge: { text: string; className: string };
    analysis: string;
  };
  roi: { monthly: number; pilot: number };
  initiative: string;
  regionsLabel: string;
  packStatus: string;
  readyForAudit: boolean;
  pdfReady: boolean;
  missingAudit: { tab: TabId; id: MissingItemId; label: string }[];
  stepStatusFor: (tab: TabId) => StepStatus;
};

const WorkbookContext = createContext<WorkbookContextValue | null>(null);

export function WorkbookProvider({ children }: { children: ReactNode }) {
  const { locale, t } = useLocale();
  const state = useSyncExternalStore(
    subscribeWorkbook,
    getWorkbookSnapshot,
    getWorkbookServerSnapshot,
  );
  const [tab, setTabState] = useState<TabId>("briefing");
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const toastTimer = useRef<number | null>(null);
  const saveUiTimer = useRef<number | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      setLastSavedAt(Date.now());
      return;
    }
    if (saveUiTimer.current) window.clearTimeout(saveUiTimer.current);
    saveUiTimer.current = window.setTimeout(() => {
      setLastSavedAt(Date.now());
    }, 400);
    return () => {
      if (saveUiTimer.current) window.clearTimeout(saveUiTimer.current);
    };
  }, [state]);

  const showToast = useCallback((message: string, icon = "✅") => {
    setToast({ message, icon });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3000);
  }, []);

  const setTab = useCallback((next: TabId) => {
    setTabState(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const update = useCallback((patch: Partial<WorkbookState>) => {
    setWorkbookState((current) => ({ ...current, ...patch }));
  }, []);

  const patch = useCallback(
    <K extends keyof WorkbookState>(
      key: K,
      value: Partial<WorkbookState[K]> | WorkbookState[K],
    ) => {
      setWorkbookState((current) => {
        const existing = current[key];
        if (
          existing &&
          typeof existing === "object" &&
          !Array.isArray(existing) &&
          value &&
          typeof value === "object" &&
          !Array.isArray(value)
        ) {
          return {
            ...current,
            [key]: { ...existing, ...value },
          };
        }
        return { ...current, [key]: value };
      });
    },
    [],
  );

  const toggleDiagnostic = useCallback((key: DiagnosticKey) => {
    setWorkbookState((current) => ({
      ...current,
      diagnostics: {
        ...current.diagnostics,
        [key]: !current.diagnostics[key],
      },
    }));
  }, []);

  const toggleRegion = useCallback((id: string) => {
    setWorkbookState((current) => {
      const isActive = current.activeRegionIds.includes(id);
      if (isActive && current.activeRegionIds.length <= 1) {
        return current;
      }
      return {
        ...current,
        activeRegionIds: isActive
          ? current.activeRegionIds.filter((regionId) => regionId !== id)
          : [...current.activeRegionIds, id],
      };
    });
  }, []);

  const upsertRegion = useCallback((region: Region) => {
    setWorkbookState((current) => ({
      ...current,
      regions: current.regions.map((item) =>
        item.id === region.id ? region : item,
      ),
    }));
  }, []);

  const addRegion = useCallback(() => {
    const region = emptyRegion();
    region.name = t("region.new.name");
    region.tagline = t("region.new.tagline");
    region.communication = t("play.commExample");
    region.meetingNorms = t("play.meetExample");
    region.tip = t("play.tipExample");
    setWorkbookState((current) => ({
      ...current,
      regions: [...current.regions, region],
      activeRegionIds: [...current.activeRegionIds, region.id],
    }));
    showToast(t("toast.regionAdd"), "🌍");
    return region.id;
  }, [showToast, t]);

  const removeRegion = useCallback((id: string) => {
    setWorkbookState((current) => {
      if (current.regions.length <= 1) return current;
      const regions = current.regions.filter((region) => region.id !== id);
      let activeRegionIds = current.activeRegionIds.filter(
        (regionId) => regionId !== id,
      );
      if (activeRegionIds.length === 0 && regions[0]) {
        activeRegionIds = [regions[0].id];
      }
      return { ...current, regions, activeRegionIds };
    });
  }, []);

  const saveManual = useCallback(() => {
    persistWorkbook();
    setLastSavedAt(Date.now());
    showToast(t("toast.saved"));
  }, [showToast, t]);

  const loadExample = useCallback(() => {
    setWorkbookState(
      JSON.parse(JSON.stringify(exampleState)) as WorkbookState,
    );
    showToast(t("toast.example"));
  }, [showToast, t]);

  const submitPack = useCallback(async () => {
    if (!identityComplete(state)) {
      showToast(t("toast.identity"), "⚠️");
      setTab("scope");
      return;
    }
    try {
      showToast(t("toast.submitting"), "📤");
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        showToast(body.error ?? t("toast.submitFail"), "⚠️");
        return;
      }
      showToast(t("toast.submitted"), "📤");
    } catch {
      showToast(t("toast.submitFail"), "⚠️");
    }
  }, [setTab, showToast, state, t]);

  const exportPdf = useCallback(async () => {
    if (!pdfExportReady(state)) {
      showToast(t("toast.identity"), "⚠️");
      setTab("scope");
      return;
    }
    try {
      showToast(t("toast.pdfPreparing"), "📄");
      const { downloadWorkbookPdf } = await import("@/lib/export-pdf");
      const counts = diagnosticCounts(state.diagnostics);
      await downloadWorkbookPdf({
        state,
        initiative: tInitiativeLabel(locale, state),
        regionsLabel: tActiveRegionsLabel(locale, state),
        frictionText: tFrictionBadge(locale, frictionPercent(state.diagnostics)),
        analysis: tFrictionAnalysis(locale, counts),
        roi: roiHours(state.calc),
        packStatus: tPackStatus(locale, state),
        locale,
      });
    } catch {
      showToast(t("toast.pdfFail"), "⚠️");
    }
  }, [locale, setTab, showToast, state, t]);

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ALP_${fileSlug(state.projectName)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    showToast("JSON backup exported.", "📤");
  }, [showToast, state]);

  const importJson = useCallback(
    async (file: File) => {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text) as Partial<WorkbookState>;
        setWorkbookState(mergeState(parsed));
        showToast("Workbook state imported.", "📥");
      } catch {
        showToast("Invalid JSON file.", "⚠️");
      }
    },
    [showToast],
  );

  const friction = useMemo(() => {
    const counts = diagnosticCounts(state.diagnostics);
    const percent = frictionPercent(state.diagnostics);
    return {
      percent,
      counts,
      badge: {
        text: tFrictionBadge(locale, percent),
        className:
          percent > 65
            ? "text-lg font-bold text-red-600"
            : percent > 30
              ? "text-lg font-bold text-brand-blue"
              : "text-lg font-bold text-emerald-600",
      },
      analysis: tFrictionAnalysis(locale, counts),
    };
  }, [locale, state.diagnostics]);

  const roi = useMemo(() => roiHours(state.calc), [state.calc]);
  const initiative = useMemo(
    () => tInitiativeLabel(locale, state),
    [locale, state],
  );
  const regionsLabel = useMemo(
    () => tActiveRegionsLabel(locale, state),
    [locale, state],
  );
  const readyForAudit = useMemo(() => auditReady(state), [state]);
  const pdfReady = useMemo(() => pdfExportReady(state), [state]);
  const packStatus = useMemo(() => tPackStatus(locale, state), [locale, state]);
  const missingAudit = useMemo(
    () =>
      missingAuditItems(state).map((item) => ({
        ...item,
        label: tMissingLabel(locale, item.id),
      })),
    [locale, state],
  );
  const stepStatusFor = useCallback(
    (tabId: TabId) => stepStatus(tabId, state),
    [state],
  );

  const value = useMemo<WorkbookContextValue>(
    () => ({
      state,
      tab,
      setTab,
      toast,
      showToast,
      update,
      patch,
      toggleDiagnostic,
      toggleRegion,
      upsertRegion,
      addRegion,
      removeRegion,
      saveManual,
      lastSavedAt,
      loadExample,
      submitPack,
      exportPdf,
      exportJson,
      importJson,
      friction,
      roi,
      initiative,
      regionsLabel,
      packStatus,
      readyForAudit,
      pdfReady,
      missingAudit,
      stepStatusFor,
    }),
    [
      addRegion,
      exportJson,
      exportPdf,
      submitPack,
      friction,
      importJson,
      initiative,
      missingAudit,
      packStatus,
      patch,
      pdfReady,
      readyForAudit,
      regionsLabel,
      removeRegion,
      roi,
      loadExample,
      lastSavedAt,
      saveManual,
      setTab,
      showToast,
      state,
      stepStatusFor,
      tab,
      toast,
      toggleDiagnostic,
      toggleRegion,
      update,
      upsertRegion,
    ],
  );

  return (
    <WorkbookContext.Provider value={value}>{children}</WorkbookContext.Provider>
  );
}

export function useWorkbook() {
  const context = useContext(WorkbookContext);
  if (!context) {
    throw new Error("useWorkbook must be used inside WorkbookProvider");
  }
  return context;
}
