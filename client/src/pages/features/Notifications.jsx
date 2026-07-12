import { useState } from "react";
import { ChevronRight, Bell } from "lucide-react";

const FILTERS = ["All", "Alerts", "Approvals", "Bookings"];

const NOTIFICATIONS = [
  {
    id: "1",
    message: "Laptop AF-0014 assigned to Priya Shah",
    time: "2m ago",
    category: "Alerts",
    tone: "indigo",
  },
  {
    id: "2",
    message: "Maintenance request AF-0055 approved",
    time: "18m ago",
    category: "Approvals",
    tone: "emerald",
  },
  {
    id: "3",
    message: "Booking confirmed — Room B2, 2:00 – 3:00 PM",
    time: "1h ago",
    category: "Bookings",
    tone: "indigo",
  },
  {
    id: "4",
    message: "Transfer approved — AF-0033 to Facilities dept",
    time: "3h ago",
    category: "Approvals",
    tone: "emerald",
  },
  {
    id: "5",
    message: "Overdue return — AF-0021 was due 3 days ago",
    time: "1d ago",
    category: "Alerts",
    tone: "amber",
  },
  {
    id: "6",
    message: "Audit discrepancy flagged — AF-0088 damaged",
    time: "2d ago",
    category: "Alerts",
    tone: "rose",
  },
];

const TONE_DOT = {
  indigo: "bg-indigo-400",
  emerald: "bg-emerald-400",
  amber: "bg-amber-400",
  rose: "bg-rose-400",
};

export default function Notifications() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? NOTIFICATIONS
      : NOTIFICATIONS.filter((n) => n.category === activeFilter);

  return (
    <div className="app-page flex-1 bg-white px-8 py-10 text-slate-100 dark:bg-gray-900 sm:px-12 lg:px-14 lg:py-12">
      {/* Header */}
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <span>Notifications</span>
        <ChevronRight size={13} strokeWidth={2} />
        <span className="text-slate-300">All activity</span>
      </div>

      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Activity logs &amp; notifications
        </h1>
        <p className="mt-2 text-base text-slate-400">
          Stay on top of assignments, approvals, bookings, and system alerts.
        </p>
      </div>

      <div className="max-w-5xl">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-lg border px-5 py-2.5 text-base font-medium transition ${
                activeFilter === filter
                  ? "border-indigo-400/40 bg-indigo-500 text-white shadow-sm"
                  : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
          {filtered.length > 0 ? (
            <ul className="divide-y divide-white/5">
              {filtered.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 px-7 py-5 transition hover:bg-white/[0.03]"
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${TONE_DOT[item.tone]}`}
                  />
                  <p className="min-w-0 flex-1 truncate text-base text-slate-200">
                    {item.message}
                  </p>
                  <span className="shrink-0 text-sm text-slate-500">
                    {item.time}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <Bell size={22} strokeWidth={1.5} className="mb-3 text-slate-600" />
              <p className="text-sm font-medium text-slate-300">
                No {activeFilter.toLowerCase()} to show
              </p>
              <p className="mt-1 text-xs text-slate-500">
                You're all caught up in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
