import { defaultState } from "./defaults";
import type { WorkbookState } from "./types";
import { loadState, saveState } from "./workbook-state";

let clientState: WorkbookState = defaultState;
let initialized = false;
const listeners = new Set<() => void>();

function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  const saved = loadState();
  if (saved) clientState = saved;
}

export function subscribeWorkbook(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getWorkbookSnapshot(): WorkbookState {
  ensureInit();
  return clientState;
}

export function getWorkbookServerSnapshot(): WorkbookState {
  return defaultState;
}

export function setWorkbookState(
  updater: WorkbookState | ((current: WorkbookState) => WorkbookState),
) {
  ensureInit();
  clientState =
    typeof updater === "function" ? updater(clientState) : updater;
  saveState(clientState);
  listeners.forEach((listener) => listener());
}
