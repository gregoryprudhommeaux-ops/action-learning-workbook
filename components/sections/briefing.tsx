"use client";

import { useWorkbook } from "@/components/workbook-provider";
import { companyInCopy } from "@/lib/workbook-state";

export function BriefingSection() {
  const { state, setTab } = useWorkbook();

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-r from-navy-900 via-navy-800 to-brand-blue p-6 text-white shadow-md">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-sky-300">
            Executive briefing & strategic context
          </span>
          <h2 className="mt-1 mb-3 text-2xl font-bold sm:text-3xl">
            Accelerating cross-border operational excellence
          </h2>
          <p className="text-sm leading-relaxed text-slate-200 sm:text-base">
            Daily operational velocity depends on execution across{" "}
            {companyInCopy(state.companyName)} — headquarters and
            international sites with different clocks, voice norms, and
            decision habits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center space-x-2 border-b border-slate-100 pb-3 text-lg font-bold text-slate-900">
              <span>The why behind the Action Learning Project</span>
            </h3>
            <div className="space-y-4 text-sm leading-relaxed text-slate-600">
              <p>
                Whether you are preparing an audit, transferring a process, or
                aligning a global operating model, you are working across hubs
                with distinct communication habits.
              </p>
              <p>
                At this scale, coordination delays, misaligned priorities, and
                different readings of “urgency” or “ownership” become
                performance bottlenecks. These friction points rarely come from
                technical skill gaps — they come from unexamined assumptions
                about communication, hierarchy, and feedback.
              </p>
              <div className="my-4 rounded-r-md border-l-4 border-brand-blue bg-blue-50 p-4">
                <p className="text-xs font-medium text-navy-900 sm:text-sm">
                  This Action Learning Project is the shift from theory to
                  action. Teams do not write essays. They solve live friction
                  on a real initiative.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 border-b border-slate-100 pb-3 text-lg font-bold text-slate-900">
              Pre-work deliverables roadmap
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  step: "Step 1",
                  title: "Select initiative",
                  body: "Name the live cross-border project and the sites involved.",
                  foot: "Required before the live call",
                },
                {
                  step: "Step 2",
                  title: "Cultural diagnostic",
                  body: "Map symptoms across Time, Voice, Clarity, and Power.",
                  foot: "Generates the friction radar",
                },
                {
                  step: "Step 3",
                  title: "Working agreement",
                  body: "Draft SLA response targets and a single-owner DRI rule.",
                  foot: "Draft numbers required",
                },
              ].map((card) => (
                <div
                  key={card.step}
                  className="flex flex-col justify-between rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                      {card.step}
                    </span>
                    <h4 className="mt-1 text-sm font-semibold text-slate-800">
                      {card.title}
                    </h4>
                    <p className="mt-2 text-xs text-slate-500">{card.body}</p>
                  </div>
                  <span className="mt-4 text-xs font-medium text-slate-400">
                    {card.foot}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 border-b border-slate-100 pb-3 text-base font-bold text-slate-900">
              2-hour facilitated workspace
            </h3>
            <p className="mb-4 text-xs text-slate-500">
              This is not a lecture. It is an integration lab with peers.
            </p>
            <ul className="space-y-3 text-xs text-slate-600">
              <li>
                <strong className="text-slate-800">1. Assumption auditing:</strong>{" "}
                Present diagnostic drafts; partner teams challenge SLAs for
                cross-site feasibility.
              </li>
              <li>
                <strong className="text-slate-800">2. Arrival guide:</strong>{" "}
                Standardize country-specific advice for regional assignees.
              </li>
              <li>
                <strong className="text-slate-800">3. 4–6 week pilot:</strong>{" "}
                Name quantitative KPIs (email volume, approval speed, meeting
                runtime).
              </li>
              <li>
                <strong className="text-slate-800">4. Shared playbook:</strong>{" "}
                Submissions feed a living collaboration playbook for the
                organization.
              </li>
            </ul>
            <div className="mt-6 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setTab("scope")}
                className="block w-full rounded-lg bg-navy-900 py-2.5 text-center text-xs font-medium text-white transition hover:bg-slate-800"
              >
                Start Step 1: Define scope →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
