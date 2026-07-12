const STATUS_STYLES = {
  Pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Approved: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  Rejected: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  "In Progress": "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  Resolved: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  // reused later for Audit / Bookings
  Verified: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Missing: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  Damaged: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Upcoming: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  Ongoing: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  Completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Cancelled: "bg-slate-500/15 text-slate-400 border-slate-500/30",
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || "bg-slate-500/15 text-slate-300 border-slate-500/30";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {status}
    </span>
  );
}