import { useState } from "react";
import {
  ChevronRight,
  AlertTriangle,
  ChevronDown,
  Send,
  Clock,
} from "lucide-react";

const ALLOCATION_HISTORY = [
  {
    id: "hist-1",
    date: "Mar 12",
    detail: "Allocated to Priya Shah — Engineering",
  },
  {
    id: "hist-2",
    date: "Jan 04",
    detail: "Returned by Arjun Nair — condition: good",
  },
];

export default function AllocationTransfer() {
  const [toEmployee, setToEmployee] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // UI-only placeholder for a submit action.
    console.log({ toEmployee, reason });
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <span>Assets</span>
        <ChevronRight size={13} strokeWidth={2} />
        <span className="text-slate-300">Allocation &amp; Transfer</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Allocation &amp; Transfer
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Reassign a registered asset to a different employee or department.
        </p>
      </div>

      <div className="max-w-2xl">
        {/* Asset */}
        <div className="mb-5">
          <label
            htmlFor="asset"
            className="mb-1.5 block text-sm font-medium text-slate-300"
          >
            Asset
          </label>
          <input
            id="asset"
            type="text"
            readOnly
            value="AF-0114 — Dell Laptop"
            className="w-full cursor-not-allowed rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-200 outline-none"
          />
        </div>

        {/* Warning banner */}
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3.5">
          <AlertTriangle
            size={17}
            strokeWidth={2}
            className="mt-0.5 shrink-0 text-rose-400"
          />
          <div className="text-sm">
            <p className="font-medium text-rose-300">
              Already allocated to Priya Shah (Engineering)
            </p>
            <p className="mt-0.5 text-rose-400/80">
              Direct re-allocation is blocked — submit a transfer request
              below.
            </p>
          </div>
        </div>

        {/* Transfer request form */}
        <form onSubmit={handleSubmit}>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Transfer Request
          </h2>

          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="from-employee"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                From
              </label>
              <input
                id="from-employee"
                type="text"
                readOnly
                value="Priya Shah"
                className="w-full cursor-not-allowed rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-200 outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="to-employee"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                To
              </label>
              <div className="relative">
                <select
                  id="to-employee"
                  value={toEmployee}
                  onChange={(e) => setToEmployee(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-indigo-500 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/25"
                >
                  <option value="" disabled className="bg-slate-900">
                    Select employee…
                  </option>
                  <option value="rohan-mehta" className="bg-slate-900">
                    Rohan Mehta
                  </option>
                  <option value="sana-iqbal" className="bg-slate-900">
                    Sana Iqbal
                  </option>
                  <option value="arjun-nair" className="bg-slate-900">
                    Arjun Nair
                  </option>
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
            <label
              htmlFor="reason"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
              Reason
            </label>
            <textarea
              id="reason"
              rows={5}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe why this asset needs to be transferred…"
              className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/25"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset] transition hover:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <Send size={15} strokeWidth={2} />
            Submit Request
          </button>
        </form>

        {/* Allocation history */}
        <div className="mt-10 border-t border-white/10 pt-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Allocation history
          </h2>

          <ul className="space-y-3">
            {ALLOCATION_HISTORY.map((item) => (
              <li key={item.id} className="flex items-start gap-3 text-sm">
                <Clock
                  size={15}
                  strokeWidth={1.75}
                  className="mt-0.5 shrink-0 text-slate-600"
                />
                <p className="text-slate-400">
                  <span className="font-medium text-slate-300">
                    {item.date}
                  </span>{" "}
                  — {item.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
