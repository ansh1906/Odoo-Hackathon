import { useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Laptop,
  Projector,
  Armchair,
} from "lucide-react";

const FILTERS = ["Category", "Status", "Department"];

const ASSETS = [
  {
    id: "af-0012",
    tag: "AF-0012",
    name: "Dell Laptop",
    icon: Laptop,
    category: "Electronics",
    status: "Allocated",
    location: "Bengaluru",
  },
  {
    id: "af-0062",
    tag: "AF-0062",
    name: "Projector",
    icon: Projector,
    category: "Electronics",
    status: "Maintenance",
    location: "HQ Floor 2",
  },
  {
    id: "af-0201",
    tag: "AF-0201",
    name: "Office Chair",
    icon: Armchair,
    category: "Furniture",
    status: "Available",
    location: "Warehouse",
  },
];

const STATUS_STYLES = {
  Allocated: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
  Maintenance: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  Available: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
};

const STATUS_DOT = {
  Allocated: "bg-indigo-400",
  Maintenance: "bg-amber-400",
  Available: "bg-emerald-400",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {status}
    </span>
  );
}

function FilterButton({ label }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-slate-100"
    >
      {label}
      <ChevronDown size={14} strokeWidth={2} className="text-slate-500" />
    </button>
  );
}

export default function Assets() {
  const [search, setSearch] = useState("");

  return (
    <div className="app-page h-full min-h-full w-full bg-white text-slate-100 dark:bg-gray-900 flex flex-col px-8 py-6">
      {/* Header */}
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <span>Assets</span>
        <ChevronRight size={13} strokeWidth={2} />
        <span className="text-slate-300">Directory</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Asset registrations &amp; directory
        </h1>
        <p className="mt-2 text-base text-slate-400">
          Search, filter, and manage every registered asset in your
          organization.
        </p>
      </div>

      {/* Search + Register */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={17}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by tag, serial, or QR code…"
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3.5 text-base text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/25"
          />
        </div>

        <button
          type="button"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-500 px-5 py-3 text-base font-semibold text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset] transition hover:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <Plus size={16} strokeWidth={2} />
          Register Asset
        </button>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        {FILTERS.map((filter) => (
          <FilterButton key={filter} label={filter} />
        ))}
      </div>

      {/* Table card */}
      <div className="flex-1 overflow-auto rounded-xl border border-white/10 bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-base">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-sm uppercase tracking-wide text-slate-400">
                <th className="px-6 py-3.5 font-medium">Tag</th>
                <th className="px-6 py-3.5 font-medium">Name</th>
                <th className="px-6 py-3.5 font-medium">Category</th>
                <th className="px-6 py-3.5 font-medium">Status</th>
                <th className="px-6 py-3.5 font-medium">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ASSETS.map((asset) => (
                <tr key={asset.id} className="transition hover:bg-white/[0.03]">
                  <td className="px-6 py-5 font-mono text-xs text-slate-400">
                    {asset.tag}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2.5 font-medium text-slate-100">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400">
                        <asset.icon size={15} strokeWidth={1.75} />
                      </span>
                      {asset.name}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-300">
                    {asset.category}
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={asset.status} />
                  </td>
                  <td className="px-6 py-5 text-slate-400">
                    {asset.location}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
