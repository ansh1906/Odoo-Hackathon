import { useMemo, useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  ClipboardCheck,
  Users,
  CalendarRange,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileWarning,
  Plus,
  Check,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { updateAuditItem, closeAuditCycle } from "../../api/audits";
import NewAuditCycleModal from "../../components/NewAuditCycleModal";

// TODO: replace with a real fetch from api/audits.js once that endpoint is
// live. Kept local so the page is fully demoable standalone.
const INITIAL_CYCLES = [
  {
    id: 1,
    title: "Q3 Audit — Engineering Dept",
    dateRange: "1 – 15 Jul",
    auditors: "A. Rao, S. Iqbal",
    status: "Open",
    checklist: [
      { id: "af-003", tag: "AF-003", name: "Dell Laptop", location: "Desk E12", status: "Verified" },
      { id: "af-9921", tag: "AF-9921", name: "Office Chair", location: "Desk E14", status: null },
      { id: "af-9838", tag: "AF-9838", name: "Monitor", location: "Desk E15", status: null },
    ],
  },
  {
    id: 2,
    title: "Q2 Audit — Facilities",
    dateRange: "1 – 10 Jun",
    auditors: "A. Rao",
    status: "Closed",
    checklist: [
      { id: "af-0201", tag: "AF-0201", name: "Conference Room Projector", location: "Room B2", status: "Verified" },
      { id: "af-0305", tag: "AF-0305", name: "Toyota Innova", location: "Parking Lot 2", status: "Damaged" },
    ],
  },
];

const STATUS_CONFIG = {
  Verified: { icon: CheckCircle2, className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
  Missing: { icon: XCircle, className: "border-rose-500/30 bg-rose-500/10 text-rose-400" },
  Damaged: { icon: AlertTriangle, className: "border-amber-500/30 bg-amber-500/10 text-amber-400" },
};

const MARK_OPTIONS = [
  { value: "Verified", icon: CheckCircle2, color: "text-emerald-400 hover:bg-emerald-500/10" },
  { value: "Missing", icon: XCircle, color: "text-rose-400 hover:bg-rose-500/10" },
  { value: "Damaged", icon: AlertTriangle, color: "text-amber-400 hover:bg-amber-500/10" },
];

function StatusBadge({ status }) {
  if (!status) {
    return <span className="text-xs text-slate-500">Not checked</span>;
  }
  const { icon: Icon, className } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${className}`}>
      <Icon size={12} strokeWidth={2.25} />
      {status}
    </span>
  );
}

export default function Audit() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  const [cycles, setCycles] = useState(INITIAL_CYCLES);
  const [selectedId, setSelectedId] = useState(INITIAL_CYCLES[0].id);
  const [cycleMenuOpen, setCycleMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const cycle = useMemo(() => cycles.find((c) => c.id === selectedId), [cycles, selectedId]);
  const isOpen = cycle.status === "Open";

  const flaggedCount = cycle.checklist.filter((i) => i.status === "Missing" || i.status === "Damaged").length;
  const uncheckedCount = cycle.checklist.filter((i) => !i.status).length;

  const totalOpen = cycles.filter((c) => c.status === "Open").length;
  const totalClosed = cycles.filter((c) => c.status === "Closed").length;
  const totalDiscrepancies = cycles.reduce(
    (sum, c) => sum + c.checklist.filter((i) => i.status === "Missing" || i.status === "Damaged").length,
    0
  );

  const handleMark = async (itemId, status) => {
    try {
      await updateAuditItem(cycle.id, itemId, { result: status });
    } catch {
      // demo fallback — reflect locally regardless
    }
    setCycles((prev) =>
      prev.map((c) =>
        c.id !== cycle.id
          ? c
          : { ...c, checklist: c.checklist.map((i) => (i.id === itemId ? { ...i, status } : i)) }
      )
    );
  };

  const handleClose = async () => {
    try {
      await closeAuditCycle(cycle.id);
    } catch {
      // demo fallback
    }
    setCycles((prev) => prev.map((c) => (c.id === cycle.id ? { ...c, status: "Closed" } : c)));
  };

  return (
    <div className="app-page min-h-full bg-white px-6 py-8 text-slate-100 dark:bg-gray-900 sm:px-10 lg:px-12 lg:py-10">
      {/* Header */}
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <span>Audit</span>
        <ChevronRight size={13} strokeWidth={2} />
        <span className="text-slate-300">Asset audit cycle</span>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Asset audit</h1>
          <p className="mt-1 text-sm text-slate-400">
            Run audit cycles, verify checklist items, and auto-generate discrepancy reports.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            <Plus size={16} />
            New audit cycle
          </button>
        )}
      </div>

      {/* Full-width responsive layout: main cycle view + KPI/cycle-switcher sidebar */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main column */}
        <div className="min-w-0 max-w-4xl">
          {/* Cycle selector (functional dropdown, replaces the static banner) */}
          <div className="relative mb-6">
            <button
              type="button"
              onClick={() => setCycleMenuOpen((o) => !o)}
              className="flex w-full items-start gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-5 text-left transition hover:border-white/20"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-300">
                <ClipboardCheck size={18} strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-100">{cycle.title}</p>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                      isOpen
                        ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
                        : "border-slate-500/30 bg-slate-500/10 text-slate-400"
                    }`}
                  >
                    {cycle.status}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarRange size={13} strokeWidth={1.75} />
                    {cycle.dateRange}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={13} strokeWidth={1.75} />
                    Auditors: {cycle.auditors}
                  </span>
                </div>
              </div>
              <ChevronDown
                size={16}
                strokeWidth={2}
                className={`mt-1 shrink-0 text-slate-500 transition-transform ${cycleMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {cycleMenuOpen && (
              <div className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-lg border border-white/10 bg-slate-900 shadow-xl">
                {cycles.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(c.id);
                      setCycleMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-2.5 px-4 py-2.5 text-left text-sm transition hover:bg-white/5 ${
                      c.id === selectedId ? "text-indigo-300" : "text-slate-200"
                    }`}
                  >
                    <span>
                      {c.title}{" "}
                      <span className="text-xs text-slate-500">({c.status})</span>
                    </span>
                    {c.id === selectedId && <Check size={15} className="text-indigo-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Checklist table */}
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-3.5 font-medium">Asset</th>
                    <th className="px-6 py-3.5 font-medium">Expected location</th>
                    <th className="px-6 py-3.5 font-medium">Verification</th>
                    {isOpen && <th className="px-6 py-3.5 font-medium text-right">Mark</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {cycle.checklist.map((item) => (
                    <tr key={item.id} className="transition hover:bg-white/[0.03]">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-100">{item.name}</div>
                        <div className="font-mono text-xs text-slate-500">{item.tag}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{item.location}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      {isOpen && (
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-1">
                            {MARK_OPTIONS.map(({ value, icon: Icon, color }) => (
                              <button
                                key={value}
                                title={value}
                                onClick={() => handleMark(item.id, value)}
                                className={`rounded-lg p-1.5 transition ${color} ${
                                  item.status === value ? "bg-white/10" : ""
                                }`}
                              >
                                <Icon size={17} />
                              </button>
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Discrepancy banner */}
          {flaggedCount > 0 && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-5 py-4">
              <FileWarning size={18} strokeWidth={1.75} className="shrink-0 text-amber-400" />
              <p className="text-sm text-amber-200">
                <span className="font-semibold">{flaggedCount} asset{flaggedCount === 1 ? "" : "s"} flagged</span>{" "}
                <span className="text-amber-300/80">— discrepancy report generated automatically.</span>
              </p>
            </div>
          )}

          {/* Close audit cycle */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {isOpen ? (
              <>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={uncheckedCount > 0}
                  title={uncheckedCount > 0 ? `${uncheckedCount} asset(s) still unchecked` : undefined}
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition hover:border-emerald-400/60 hover:bg-emerald-500/15 hover:text-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <CheckCircle2 size={16} strokeWidth={2} />
                  Close audit cycle
                </button>
                <p className="text-xs text-slate-500">
                  {uncheckedCount > 0
                    ? `Mark all ${cycle.checklist.length} assets before closing.`
                    : "Closing locks the checklist and finalizes the discrepancy report."}
                </p>
              </>
            ) : (
              <p className="text-xs text-slate-500">
                This cycle is closed — the checklist is locked and read-only.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar: KPIs + cycle list */}
        <div className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Open cycles</p>
              <p className="mt-1 text-2xl font-semibold text-indigo-300">{totalOpen}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Closed cycles</p>
              <p className="mt-1 text-2xl font-semibold text-slate-300">{totalClosed}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Discrepancies</p>
              <p className="mt-1 text-2xl font-semibold text-amber-300">{totalDiscrepancies}</p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="border-b border-white/10 px-4 py-3">
              <p className="text-sm font-medium text-slate-200">All cycles</p>
            </div>
            <div className="divide-y divide-white/5">
              {cycles.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition hover:bg-white/[0.03] ${
                    c.id === selectedId ? "bg-indigo-500/10" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-100">{c.title}</p>
                    <p className="text-xs text-slate-500">{c.dateRange}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                      c.status === "Open"
                        ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
                        : "border-slate-500/30 bg-slate-500/10 text-slate-400"
                    }`}
                  >
                    {c.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <NewAuditCycleModal
          onClose={() => setShowModal(false)}
          onCreated={(newCycle) => {
            setCycles((prev) => [newCycle, ...prev]);
            setSelectedId(newCycle.id);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
