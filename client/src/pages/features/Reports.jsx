import {
  ChevronRight,
  BarChart3,
  TrendingUp,
  DoorOpen,
  Truck,
  Projector,
  Camera,
  Armchair,
  Wrench,
  Clock,
  Download,
} from "lucide-react";

const UTILIZATION = [
  { label: "Eng", value: 42 },
  { label: "Facilities", value: 68 },
  { label: "Field Ops", value: 92 },
  { label: "Sales", value: 57 },
  { label: "HR", value: 34 },
  { label: "IT", value: 74 },
];

const MAINTENANCE_TREND = [12, 22, 17, 30, 26, 40, 52];

const MOST_USED = [
  { icon: DoorOpen, label: "Room B2", detail: "34 bookings this month" },
  { icon: Truck, label: "Van AF-343", detail: "21 trips this month" },
  { icon: Projector, label: "Projector AF-335", detail: "18 uses this month" },
];

const IDLE_ASSETS = [
  { icon: Camera, label: "Camera AF-0301", detail: "Unused for 60+ days" },
  { icon: Armchair, label: "Chair AF-0410", detail: "Unused for 45 days" },
];

const MAINTENANCE_DUE = [
  {
    icon: Wrench,
    label: "Forklift AF-0087",
    detail: "Service due in 5 days",
    tone: "amber",
  },
  {
    icon: Clock,
    label: "Laptop AF-0020",
    detail: "4 years old — nearing retirement",
    tone: "slate",
  },
];

function UtilizationChart() {
  const max = Math.max(...UTILIZATION.map((d) => d.value));
  const chartHeight = 140;

  return (
    <svg
      viewBox="0 0 280 160"
      className="h-40 w-full overflow-visible"
      preserveAspectRatio="none"
    >
      <line
        x1="0"
        y1={chartHeight}
        x2="280"
        y2={chartHeight}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />
      {UTILIZATION.map((d, i) => {
        const barWidth = 26;
        const gap = (280 - UTILIZATION.length * barWidth) / (UTILIZATION.length + 1);
        const x = gap + i * (barWidth + gap);
        const height = (d.value / max) * (chartHeight - 10);
        const y = chartHeight - height;
        return (
          <rect
            key={d.label}
            x={x}
            y={y}
            width={barWidth}
            height={height}
            rx="5"
            className="fill-indigo-400/70 transition-opacity hover:fill-indigo-300"
          />
        );
      })}
    </svg>
  );
}

function MaintenanceChart() {
  const max = Math.max(...MAINTENANCE_TREND);
  const chartHeight = 140;
  const chartWidth = 280;
  const step = chartWidth / (MAINTENANCE_TREND.length - 1);

  const points = MAINTENANCE_TREND.map((v, i) => {
    const x = i * step;
    const y = chartHeight - (v / max) * (chartHeight - 10);
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `0,${chartHeight} ${points} ${chartWidth},${chartHeight}`;

  return (
    <svg
      viewBox={`0 0 ${chartWidth} 160`}
      className="h-40 w-full overflow-visible"
      preserveAspectRatio="none"
    >
      <line
        x1="0"
        y1={chartHeight}
        x2={chartWidth}
        y2={chartHeight}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />
      <polygon points={areaPoints} className="fill-rose-500/10" />
      <polyline
        points={points}
        fill="none"
        className="stroke-rose-400"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {MAINTENANCE_TREND.map((v, i) => {
        const x = i * step;
        const y = chartHeight - (v / max) * (chartHeight - 10);
        return <circle key={i} cx={x} cy={y} r="3" className="fill-rose-300" />;
      })}
    </svg>
  );
}

function ListSection({ title, items }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-slate-100">{title}</h3>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5"
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                item.tone === "amber"
                  ? "bg-amber-500/10 text-amber-400"
                  : "bg-white/5 text-slate-400"
              }`}
            >
              <item.icon size={15} strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-100">
                {item.label}
              </p>
              <p className="truncate text-xs text-slate-500">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Reports() {
  return (
    <div className="app-page flex-1 bg-white px-6 py-8 text-slate-100 dark:bg-gray-900 sm:px-10 lg:px-12 lg:py-10">
      {/* Header */}
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <span>Reports</span>
        <ChevronRight size={13} strokeWidth={2} />
        <span className="text-slate-300">Analytics</span>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Reports &amp; analytics
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Utilization, maintenance frequency, and asset usage insights.
          </p>
        </div>
      </div>

      <div className="max-w-5xl space-y-8">
        {/* Charts */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-100">
              <BarChart3 size={16} strokeWidth={1.75} className="text-indigo-400" />
              Utilization by department
            </div>
            <UtilizationChart />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-100">
              <TrendingUp size={16} strokeWidth={1.75} className="text-rose-400" />
              Maintenance frequency
            </div>
            <MaintenanceChart />
          </div>
        </div>

        {/* Most used / Idle */}
        <div className="grid gap-8 sm:grid-cols-2">
          <ListSection title="Most used assets" items={MOST_USED} />
          <ListSection title="Idle assets" items={IDLE_ASSETS} />
        </div>

        <div className="border-t border-white/10" />

        {/* Maintenance / retirement */}
        <ListSection
          title="Assets due for maintenance / nearing retirement"
          items={MAINTENANCE_DUE}
        />

        {/* Export */}
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset] transition hover:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <Download size={16} strokeWidth={2} />
          Export report
        </button>
      </div>
    </div>
  );
}
