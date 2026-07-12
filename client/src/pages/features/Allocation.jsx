import { useMemo, useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Send,
  Clock,
  Undo2,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { allocateAsset, returnAsset, requestTransfer } from "../../api/allocations";
import StatusBadge from "../../components/StatusBadge";

// TODO: replace with real data from api/assets.js and api/users.js once
// those endpoints are live. Kept local so this page works standalone.
const INITIAL_ASSETS = [
  {
    id: 1,
    tag: "AF-0114",
    name: "Dell Laptop",
    status: "Allocated",
    holder: "Priya Shah",
    department: "Engineering",
    expectedReturn: "2026-08-01",
  },
  {
    id: 2,
    tag: "AF-0130",
    name: "Herman Miller Aeron Chair",
    status: "Available",
    holder: null,
    department: null,
    expectedReturn: null,
  },
  {
    id: 3,
    tag: "AF-0201",
    name: "Conference Room Projector",
    status: "Allocated",
    holder: "Raj Mehta",
    department: "Operations",
    expectedReturn: "2026-07-20",
  },
  {
    id: 4,
    tag: "AF-0305",
    name: "Toyota Innova (Fleet Vehicle)",
    status: "Available",
    holder: null,
    department: null,
    expectedReturn: null,
  },
];

const EMPLOYEES = ["Rohan Mehta", "Sana Iqbal", "Arjun Nair", "Neha Kulkarni"];

const INITIAL_HISTORY = {
  1: [
    { id: "h1", date: "Mar 12", detail: "Allocated to Priya Shah — Engineering" },
    { id: "h2", date: "Jan 04", detail: "Returned by Arjun Nair — condition: good" },
  ],
  3: [{ id: "h3", date: "Feb 20", detail: "Allocated to Raj Mehta — Operations" }],
};

function today() {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

export default function AllocationTransfer() {
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [historyMap, setHistoryMap] = useState(INITIAL_HISTORY);
  const [selectedId, setSelectedId] = useState(INITIAL_ASSETS[0].id);

  const [toEmployee, setToEmployee] = useState("");
  const [reason, setReason] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [returnNotes, setReturnNotes] = useState("");
  const [showReturnForm, setShowReturnForm] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const asset = useMemo(() => assets.find((a) => a.id === selectedId), [assets, selectedId]);
  const history = historyMap[selectedId] || [];

  const resetFeedback = () => {
    setError("");
    setSuccessMsg("");
  };

  const addHistory = (assetId, detail) => {
    setHistoryMap((prev) => ({
      ...prev,
      [assetId]: [{ id: `h-${Date.now()}`, date: today(), detail }, ...(prev[assetId] || [])],
    }));
  };

  const patchAsset = (assetId, patch) => {
    setAssets((prev) => prev.map((a) => (a.id === assetId ? { ...a, ...patch } : a)));
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    resetFeedback();
    if (!toEmployee) return setError("Select an employee to allocate this asset to.");

    setSubmitting(true);
    try {
      await allocateAsset(asset.id, { employee_id: toEmployee, expected_return_date: expectedReturn || null });
    } catch {
      // demo fallback — reflect the allocation locally regardless
    }
    patchAsset(asset.id, {
      status: "Allocated",
      holder: toEmployee,
      expectedReturn: expectedReturn || null,
    });
    addHistory(asset.id, `Allocated to ${toEmployee}${expectedReturn ? ` — return by ${expectedReturn}` : ""}`);
    setSuccessMsg(`Asset allocated to ${toEmployee}.`);
    setToEmployee("");
    setExpectedReturn("");
    setSubmitting(false);
  };

  const handleTransferRequest = async (e) => {
    e.preventDefault();
    resetFeedback();
    if (!toEmployee) return setError("Select an employee to transfer to.");
    if (!reason.trim()) return setError("Describe why this asset needs to be transferred.");

    setSubmitting(true);
    try {
      await requestTransfer({ asset_id: asset.id, to_employee_id: toEmployee, reason });
    } catch {
      // demo fallback
    }
    addHistory(asset.id, `Transfer requested — ${asset.holder} → ${toEmployee} (pending approval)`);
    setSuccessMsg("Transfer request submitted for approval.");
    setToEmployee("");
    setReason("");
    setSubmitting(false);
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    resetFeedback();

    setSubmitting(true);
    try {
      await returnAsset(asset.id, { condition_notes: returnNotes });
    } catch {
      // demo fallback
    }
    const previousHolder = asset.holder;
    patchAsset(asset.id, { status: "Available", holder: null, department: null, expectedReturn: null });
    addHistory(
      asset.id,
      `Returned by ${previousHolder}${returnNotes ? ` — condition: ${returnNotes}` : ""}`
    );
    setSuccessMsg("Asset marked as returned — status set to Available.");
    setReturnNotes("");
    setShowReturnForm(false);
    setSubmitting(false);
  };

  return (
    <div className="app-page min-h-full bg-white px-8 py-10 text-slate-100 dark:bg-gray-900 sm:px-10 lg:px-12">
      {/* Header */}
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <span>Assets</span>
        <ChevronRight size={13} strokeWidth={2} />
        <span className="text-slate-300">Allocation &amp; Transfer</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Allocation &amp; Transfer
        </h1>
        <p className="mt-2 text-base text-slate-400">
          Allocate available assets, or request a transfer when one's already held.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Main column */}
        <div className="min-w-0 max-w-3xl">
          {/* Asset selector */}
          <div className="mb-5">
            <label htmlFor="asset" className="mb-2 block text-base font-medium text-slate-300">
              Asset
            </label>
            <div className="relative">
              <select
                id="asset"
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(Number(e.target.value));
                  setToEmployee("");
                  setReason("");
                  setExpectedReturn("");
                  setShowReturnForm(false);
                  resetFeedback();
                }}
                className="w-full appearance-none rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-base text-slate-100 outline-none transition focus:border-indigo-500 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/25"
              >
                {assets.map((a) => (
                  <option key={a.id} value={a.id} className="bg-slate-900">
                    {a.tag} — {a.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                strokeWidth={2}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>
          </div>

          {/* Feedback banners */}
          {successMsg && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5 text-sm text-emerald-300">
              <CheckCircle2 size={17} strokeWidth={2} className="mt-0.5 shrink-0" />
              {successMsg}
            </div>
          )}
          {error && (
            <div className="mb-5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          )}

          {asset.status === "Available" ? (
            // ── Direct allocation form ──
            <form onSubmit={handleAllocate}>
              <h2 className="mb-4 text-base font-semibold uppercase tracking-wide text-slate-400">
                Allocate asset
              </h2>

              <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-base font-medium text-slate-300">
                    Allocate to
                  </label>
                  <div className="relative">
                    <select
                      value={toEmployee}
                      onChange={(e) => setToEmployee(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-base text-slate-100 outline-none transition focus:border-indigo-500 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/25"
                    >
                      <option value="" disabled className="bg-slate-900">
                        Select employee…
                      </option>
                      {EMPLOYEES.map((name) => (
                        <option key={name} value={name} className="bg-slate-900">
                          {name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      strokeWidth={2}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-base font-medium text-slate-300">
                    Expected return date (optional)
                  </label>
                  <input
                    type="date"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-base text-slate-100 outline-none transition focus:border-indigo-500 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/25"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset] transition hover:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Allocating…
                  </>
                ) : (
                  <>
                    <Send size={15} strokeWidth={2} />
                    Allocate asset
                  </>
                )}
              </button>
            </form>
          ) : (
            // ── Already allocated: blocked + transfer request + return ──
            <>
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3.5">
                <AlertTriangle size={17} strokeWidth={2} className="mt-0.5 shrink-0 text-rose-400" />
                <div className="text-sm">
                  <p className="font-medium text-rose-300">
                    Already allocated to {asset.holder} ({asset.department})
                  </p>
                  <p className="mt-0.5 text-rose-400/80">
                    Direct re-allocation is blocked — submit a transfer request below.
                  </p>
                </div>
              </div>

              <form onSubmit={handleTransferRequest}>
              <h2 className="mb-4 text-base font-semibold uppercase tracking-wide text-slate-400">
                  Transfer request
                </h2>

                <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-base font-medium text-slate-300">From</label>
                    <input
                      type="text"
                      readOnly
                      value={asset.holder}
                      className="w-full cursor-not-allowed rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-base text-slate-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-base font-medium text-slate-300">To</label>
                    <div className="relative">
                      <select
                        value={toEmployee}
                        onChange={(e) => setToEmployee(e.target.value)}
                        className="w-full appearance-none rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-base text-slate-100 outline-none transition focus:border-indigo-500 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/25"
                      >
                        <option value="" disabled className="bg-slate-900">
                          Select employee…
                        </option>
                        {EMPLOYEES.filter((n) => n !== asset.holder).map((name) => (
                          <option key={name} value={name} className="bg-slate-900">
                            {name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={15}
                        strokeWidth={2}
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2 block text-base font-medium text-slate-300">Reason</label>
                  <textarea
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Describe why this asset needs to be transferred…"
                  className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/25"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset] transition hover:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Submitting…
                      </>
                    ) : (
                      <>
                        <Send size={15} strokeWidth={2} />
                        Submit request
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowReturnForm((s) => !s)}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-300"
                  >
                    <Undo2 size={15} strokeWidth={2} />
                    Mark as returned instead
                  </button>
                </div>
              </form>

              {showReturnForm && (
                <form
                  onSubmit={handleReturn}
                  className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-5"
                >
                  <h3 className="mb-3 text-sm font-semibold text-slate-200">Return this asset</h3>
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">
                    Condition check-in notes
                  </label>
                  <textarea
                    rows={2}
                    value={returnNotes}
                    onChange={(e) => setReturnNotes(e.target.value)}
                    placeholder="e.g. good condition, minor scratch on lid"
                    className="mb-3 w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/25"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Processing…
                      </>
                    ) : (
                      "Confirm return"
                    )}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {/* Sidebar: current status + history */}
        <div className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Current status</p>
            <div className="mt-2">
              <StatusBadge status={asset.status} />
            </div>
            <p className="mt-3 text-base font-medium text-slate-100">{asset.tag}</p>
            <p className="text-sm text-slate-500">{asset.name}</p>
            {asset.status === "Allocated" && (
              <div className="mt-3 space-y-1 border-t border-white/10 pt-3 text-xs text-slate-400">
                <p>
                  Holder: <span className="text-slate-200">{asset.holder}</span>
                </p>
                <p>
                  Department: <span className="text-slate-200">{asset.department}</span>
                </p>
                {asset.expectedReturn && (
                  <p>
                    Expected return: <span className="text-slate-200">{asset.expectedReturn}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="text-base font-medium text-slate-200">Allocation history</p>
            </div>
            {history.length === 0 ? (
              <p className="p-5 text-center text-xs text-slate-500">
                No history yet for this asset.
              </p>
            ) : (
              <ul className="divide-y divide-white/5">
                {history.map((item) => (
                  <li key={item.id} className="flex items-start gap-3 px-5 py-4">
                    <Clock size={14} strokeWidth={1.75} className="mt-0.5 shrink-0 text-slate-600" />
                    <p className="text-sm text-slate-400">
                      <span className="font-medium text-slate-300">{item.date}</span> — {item.detail}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
