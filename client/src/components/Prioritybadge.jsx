const PRIORITY_STYLES = {
  Low: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  Medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  High: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export default function PriorityBadge({ priority }) {
  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.Low;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {priority}
    </span>
  );
}