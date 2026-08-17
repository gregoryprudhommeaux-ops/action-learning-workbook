"use client";

import { INITIATIVES } from "@/lib/defaults";
import { useWorkbook } from "@/components/workbook-provider";

export function ScopeSection() {
  const {
    state,
    update,
    toggleRegion,
    setTab,
    showToast,
  } = useWorkbook();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-blue">
          Pre-work Step 1
        </span>
        <h2 className="text-xl font-bold text-slate-900">
          Select the live initiative and target regions
        </h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Pick the operational initiative your team will optimize. It should
          require close collaboration between headquarters and other sites.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            A. Primary operational category
          </label>
          <div className="space-y-3">
            {INITIATIVES.map((item) => {
              const selected = state.initiativeId === item.id;
              return (
                <label
                  key={item.id}
                  className={`flex cursor-pointer items-start rounded-lg border p-3.5 transition hover:bg-slate-50 ${
                    selected
                      ? "border-brand-blue bg-blue-50"
                      : "border-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="initiative"
                    className="mt-0.5 text-brand-blue focus:ring-brand-blue"
                    checked={selected}
                    onChange={() => update({ initiativeId: item.id })}
                  />
                  <div className="ml-3 w-full">
                    <span className="block text-sm font-semibold text-slate-800">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {item.description}
                    </span>
                    {item.id === "other" && selected ? (
                      <input
                        type="text"
                        value={state.customInitiative}
                        onChange={(event) =>
                          update({ customInitiative: event.target.value })
                        }
                        placeholder="Describe the operational context..."
                        className="mt-1.5 w-full rounded border border-slate-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-blue"
                      />
                    ) : null}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Prepared by — required to submit
            </span>
            <p className="mt-1 text-xs text-slate-500">
              Full name, email, company, and position are required to submit.
              The facilitator prints them on the PDF.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Full name
                </label>
                <input
                  type="text"
                  autoComplete="name"
                  value={state.authorFullName}
                  onChange={(event) =>
                    update({ authorFullName: event.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  placeholder="Alex Chen"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Email
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  value={state.authorEmail}
                  onChange={(event) =>
                    update({ authorEmail: event.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  placeholder="alex.chen@company.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Company
                </label>
                <input
                  type="text"
                  autoComplete="organization"
                  value={state.companyName}
                  onChange={(event) =>
                    update({ companyName: event.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  placeholder="The company"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Position
                </label>
                <input
                  type="text"
                  autoComplete="organization-title"
                  value={state.authorPosition}
                  onChange={(event) =>
                    update({ authorPosition: event.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  placeholder="QA Lead, Site Head, …"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
              B. Project name
            </label>
            <input
              type="text"
              value={state.projectName}
              onChange={(event) => update({ projectName: event.target.value })}
              className="w-full rounded-lg border border-slate-300 p-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-blue"
              placeholder="Specific operational project name"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
              C. Participating regions
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {state.regions.map((region) => {
                const active = state.activeRegionIds.includes(region.id);
                return (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() => {
                      if (active && state.activeRegionIds.length <= 1) {
                        showToast("Keep at least one region selected.", "⚠️");
                        return;
                      }
                      toggleRegion(region.id);
                    }}
                    className={`flex items-center justify-between rounded-lg p-3 text-xs font-semibold ${
                      active
                        ? "border-2 border-brand-blue bg-blue-50 text-brand-blue"
                        : "border border-slate-200 text-slate-600"
                    }`}
                  >
                    <span>
                      {region.flag} {region.name}
                    </span>
                    {active ? <span>✓</span> : null}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Add or rewrite regions in Step 5 — Regional Playbook.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
              D. Operational impact narrative
            </label>
            <textarea
              rows={4}
              value={state.impactNarrative}
              onChange={(event) =>
                update({ impactNarrative: event.target.value })
              }
              className="w-full rounded-lg border border-slate-300 p-3 text-xs focus:outline-none focus:ring-1 focus:ring-brand-blue sm:text-sm"
              placeholder="3–5 sentences on current delays, rework, or friction, and the business impact of resolving them..."
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => setTab("diagnostic")}
          className="rounded-lg bg-brand-blue px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
        >
          Proceed to Step 2: Cultural diagnostic →
        </button>
      </div>
    </div>
  );
}
