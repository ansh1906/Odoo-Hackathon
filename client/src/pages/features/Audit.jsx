import { useState } from "react";
import {
  ChevronRight,
  ClipboardCheck,
  Users,
  CalendarRange,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileWarning,
} from "lucide-react";

const CHECKLIST = [
  {
    id: "af-003",
    tag: "AF-003",
    name: "Dell Laptop",
    location: "Desk E12",
    status: "Verified",
  },
  {
    id: "af-9921",
    tag: "AF-9921",
    name: "Office Chair",
    location: "Desk E14",
    status: "Missing",
  },
  {
    id: "af-9838",
    tag: "AF-9838",
    name: "Monitor",
    location: "Desk E15",
    status: "Damaged",
  },
];

const STATUS_CONFIG = {
  Verified: {
    icon: CheckCircle2,
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  },
  Missing: {
    icon: XCircle,
    className: "border-rose-500/30 bg-rose-500/10 text-rose-400",
  },
  Damaged: {
    icon: AlertTriangle,
    className: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  },
};

function StatusBadge({ status }) {
  const { icon: Icon, className } = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${className}`}
    >
      <Icon size={12} strokeWidth={2.25} />
      {status}
    </span>
  );
}

export default function Audit() {
  const [checklist] = useState(CHECKLIST);

  const flaggedCount = checklist.filter(
    (item) => item.status !== "Verified"
  ).length;

  return (
    <div className="flex-1 bg-slate-950 px-6 py-8 text-slate-100 sm:px-10 lg:px-12 lg:py-10">
      {/* Header */}
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <span>Audit</span>
        <ChevronRight size={13} strokeWidth={2} />
        <span className="text-slate-300">Asset audit cycle</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Asset audit
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Run audit cycles, verify checklist items, and auto-generate
          discrepancy reports.
        </p>
      </div>

      <div className="max-w-4xl">
        {/* Audit cycle banner */}
        <div className="mb-6 flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-300">
            <ClipboardCheck size={18} strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-100">
              Q3 Audit — Engineering Dept
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <CalendarRange size={13} strokeWidth={1.75} />
                1 – 15 Jul
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users size={13} strokeWidth={1.75} />
                Auditors: A. Rao, S. Iqbal
              </span>
            </div>
          </div>
        </div>

        {/* Checklist table */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-3.5 font-medium">Asset</th>
                  <th className="px-6 py-3.5 font-medium">
                    Expected location
                  </th>
                  <th className="px-6 py-3.5 font-medium">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {checklist.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-white/[0.03]"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-100">
                        {item.name}
                      </div>
                      <div className="font-mono text-xs text-slate-500">
                        {item.tag}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {item.location}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Discrepancy banner */}
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-5 py-4">
          <FileWarning
            size={18}
            strokeWidth={1.75}
            className="shrink-0 text-amber-400"
          />
          <p className="text-sm text-amber-200">
            <span className="font-semibold">{flaggedCount} assets flagged</span>{" "}
            <span className="text-amber-300/80">
              — discrepancy report generated automatically.
            </span>
          </p>
        </div>

        {/* Close audit cycle */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition hover:border-emerald-400/60 hover:bg-emerald-500/15 hover:text-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <CheckCircle2 size={16} strokeWidth={2} />
            Close audit cycle
          </button>
          <p className="text-xs text-slate-500">
            Closing locks the checklist and finalizes the discrepancy report.
          </p>
        </div>
      </div>
    </div>
  );
}
