import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Boxes,
  UserCheck,
  Wrench,
  CalendarClock,
  ArrowLeftRight,
  Undo2,
  AlertTriangle,
  Clock,
  Sun,
  Moon,
  PackagePlus,
  CalendarPlus,
  ClipboardList,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getAssets } from "../../api/assets";

// ── Theme tokens ─────────────────────────────────────────────────────────
// Deliberately not Tailwind's dark: variant — a self-contained CSS-variable
// theme so this works regardless of the project's tailwind.config darkMode
// setting, and so light mode isn't just "dark mode colors inverted."
const THEME = {
  light: {
    bg: "#F3F5F8",
    surface: "#EEF2F6",
    surfaceMuted: "#E4EAF2",
    border: "#DCE1E8",
    text: "#1A2230",
    subtext: "#5C6675",
    accent: "#2A4C73",
    accentSoft: "#E7EDF4",
    warn: "#B4650F",
    warnSoft: "#FBEEDD",
    danger: "#BB2C2C",
    dangerSoft: "#FBE9E9",
    success: "#1E7A44",
    successSoft: "#E7F4EC",
  },
  dark: {
    bg: "#11151A",
    surface: "#181D24",
    surfaceMuted: "#1E242C",
    border: "#2B333D",
    text: "#E7EBEF",
    subtext: "#8E99A6",
    accent: "#7FA8D6",
    accentSoft: "#1D2C3B",
    warn: "#E7A24C",
    warnSoft: "#332510",
    danger: "#E6716B",
    dangerSoft: "#33191A",
    success: "#5FC98A",
    successSoft: "#122A1C",
  },
};

const OVERDUE_ITEMS = [
  { id: 1, type: "Return", detail: "AF-0114 — MacBook Pro · Priya Sharma", meta: "3 days overdue" },
  { id: 2, type: "Booking", detail: "Conference Room B2 — not released", meta: "1 day overdue" },
  { id: 3, type: "Maintenance", detail: "AF-0305 — Innova approval pending", meta: "2 days overdue" },
];

const UPCOMING_ITEMS = [
  { id: 1, type: "Return", detail: "AF-0102 — Dell Latitude · Neha Kulkarni", meta: "due in 2 days" },
  { id: 2, type: "Booking", detail: "Room A1 — Design Sync", meta: "today, 3:00 PM" },
  { id: 3, type: "Maintenance", detail: "AF-0201 — Projector service", meta: "due in 5 days" },
];

const QUICK_ACTIONS = [
  { label: "Register Asset", sub: "Add a new asset to the registry", icon: PackagePlus, path: "/assets" },
  { label: "Book Resource", sub: "Reserve a room, vehicle or equipment", icon: CalendarPlus, path: "/resource-booking" },
  { label: "Raise Request", sub: "Flag an asset that needs repair", icon: ClipboardList, path: "/maintenance" },
];

// Clipped top-right corner — the "ticket stub" shape used for actionable
// elements throughout this page, standing in for the rounded-pill button
// used elsewhere in the app.
const TICKET_CLIP = { clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)" };

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("light");
  const [assets, setAssets] = useState([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  const [assetsError, setAssetsError] = useState("");
  const t = THEME[mode];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const cssVars = useMemo(
    () =>
      Object.fromEntries(Object.entries(t).map(([k, v]) => [`--${k}`, v])),
    [t]
  );

  useEffect(() => {
    let isMounted = true;

    const loadAssets = async () => {
      try {
        const { data } = await getAssets();
        if (isMounted) {
          setAssets(Array.isArray(data) ? data : data.results ?? []);
        }
      } catch (error) {
        if (isMounted) {
          setAssetsError(error.response?.data?.detail ?? "Unable to load asset counts.");
        }
      } finally {
        if (isMounted) setIsLoadingAssets(false);
      }
    };

    loadAssets();
    return () => {
      isMounted = false;
    };
  }, []);

  const kpiData = useMemo(() => {
    const countByStatus = (status) => assets.filter((asset) => asset.status === status).length;

    return [
      { key: "total", label: "Total Assets", value: assets.length, icon: Boxes, tone: "accent" },
      { key: "available", label: "Assets Available", value: countByStatus("Available"), icon: UserCheck, tone: "success" },
      { key: "allocated", label: "Assets Allocated", value: countByStatus("Allocated"), icon: ArrowLeftRight, tone: "accent" },
      { key: "maintenance", label: "Under Maintenance", value: countByStatus("Under Maintenance"), icon: Wrench, tone: "warn" },
      { key: "reserved", label: "Assets Reserved", value: countByStatus("Reserved"), icon: CalendarClock, tone: "accent" },
      {
        key: "retired",
        label: "Retired / Disposed",
        value: countByStatus("Retired") + countByStatus("Disposed"),
        icon: Undo2,
        tone: "warn",
      },
    ];
  }, [assets]);

  return (
    <div
      style={cssVars}
      className="min-h-full bg-white dark:bg-gray-900 px-6 py-8 text-black dark:text-white] transition-colors duration-300 sm:px-8 lg:px-10"
    >
      {/* faint graph-paper texture — nods to blueprint/inventory-sheet aesthetic, kept subtle */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(var(--text) 1px, transparent 1px), linear-gradient(90deg, var(--text) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xl font-medium uppercase tracking-[0.14em] text:black dark:text-white">
              {greeting} there!
            </p>
            {/* <h1 className="mt-1 text-2xl font-semibold tracking-tight text:black dark:text-white">
              {user?.name ?? "there"}
              <span className="ml-2 align-middle text-sm font-normal text:black dark:text-white">
                {user?.role ? `· ${user.role}` : ""}
              </span>
            </h1> */}
          </div>

          {/* Theme toggle — a segmented control, not a rounded switch */}
          {/* <div
            className="flex overflow-hidden border border-[var(--border)] text-xs font-medium"
            style={{ borderRadius: 2 }}
          >
            <button
              onClick={() => setMode("light")}
              className="flex items-center gap-1.5 px-3 py-2 transition"
              style={{
                backgroundColor: mode === "light" ? "var(--accentSoft)" : "var(--surface)",
                color: mode === "light" ? "var(--accent)" : "var(--subtext)",
              }}
            >
              <Sun size={13} strokeWidth={2} />
              Light
            </button>
            <button
              onClick={() => setMode("dark")}
              className="flex items-center gap-1.5 border-l border-[var(--border)] px-3 py-2 transition"
              style={{
                backgroundColor: mode === "dark" ? "var(--accentSoft)" : "var(--surface)",
                color: mode === "dark" ? "var(--accent)" : "var(--subtext)",
              }}
            >
              <Moon size={13} strokeWidth={2} />
              Dark
            </button>
          </div> */}
        </div>

        {/* KPI tags */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {kpiData.map(({ key, label, value, icon: Icon, tone }) => (
            <div
              key={key}
              className="relative border bg-[var(--surface)] p-4 pt-5"
              style={{ borderColor: "var(--border)", borderRadius: 3 }}
            >
              {/* punch hole — the one deliberately rounded shape, reads as a tag grommet */}
              <span
                className="absolute left-3 top-3 h-2 w-2 rounded-full border"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
              />
              <div className="flex items-start justify-between">
                <span
                  className="flex h-6 w-6 items-center justify-center"
                  style={{
                    marginLeft: "auto",
                    color: `var(--${tone})`,
                    backgroundColor: `var(--${tone}Soft)`,
                    borderRadius: 2,
                  }}
                >
                  <Icon size={13} strokeWidth={2} />
                </span>
              </div>
              <p className="mt-3 font-mono text-2xl font-semibold tabular-nums text-[var(--text)]">
                {isLoadingAssets ? "—" : value}
              </p>
              <p className="mt-1 text-[11px] leading-tight text-[var(--subtext)]">{label}</p>
            </div>
          ))}
        </div>

        {assetsError && (
          <p className="-mt-5 mb-6 text-sm" style={{ color: "var(--danger)" }}>
            {assetsError}
          </p>
        )}

        {/* Overdue / Upcoming split */}
        <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Overdue — visually distinct, danger-toned, listed first */}
          <div
            className="border bg-[var(--surface)]"
            style={{ borderColor: "var(--danger)", borderWidth: 1, borderRadius: 3 }}
          >
            <div
              className="flex items-center gap-2 border-b px-4 py-3"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--dangerSoft)" }}
            >
              <AlertTriangle size={14} strokeWidth={2} style={{ color: "var(--danger)" }} />
              <p className="text-sm font-semibold" style={{ color: "var(--danger)" }}>
                Overdue — needs attention
              </p>
            </div>
            <ul>
              {OVERDUE_ITEMS.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 border-b px-4 py-3 last:border-b-0"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="min-w-0">
                    <p
                      className="text-[10px] font-semibold uppercase tracking-wide"
                      style={{ color: "var(--subtext)" }}
                    >
                      {item.type}
                    </p>
                    <p className="truncate text-sm text-[var(--text)]">{item.detail}</p>
                  </div>
                  <span
                    className="shrink-0 whitespace-nowrap px-2 py-1 font-mono text-[11px] font-medium"
                    style={{ backgroundColor: "var(--dangerSoft)", color: "var(--danger)", borderRadius: 2 }}
                  >
                    {item.meta}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Upcoming — neutral/accent-toned, kept separate per spec */}
          <div className="border bg-[var(--surface)]" style={{ borderColor: "var(--border)", borderRadius: 3 }}>
            <div
              className="flex items-center gap-2 border-b px-4 py-3"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surfaceMuted)" }}
            >
              <Clock size={14} strokeWidth={2} style={{ color: "var(--accent)" }} />
              <p className="text-sm font-semibold text-[var(--text)]">Upcoming</p>
            </div>
            <ul>
              {UPCOMING_ITEMS.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 border-b px-4 py-3 last:border-b-0"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="min-w-0">
                    <p
                      className="text-[10px] font-semibold uppercase tracking-wide"
                      style={{ color: "var(--subtext)" }}
                    >
                      {item.type}
                    </p>
                    <p className="truncate text-sm text-[var(--text)]">{item.detail}</p>
                  </div>
                  <span
                    className="shrink-0 whitespace-nowrap px-2 py-1 font-mono text-[11px] font-medium"
                    style={{ backgroundColor: "var(--accentSoft)", color: "var(--accent)", borderRadius: 2 }}
                  >
                    {item.meta}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick actions — ticket-stub buttons, not rounded pills */}
        <div>
          <p
            className="mb-3 text-[20px] font-semibold uppercase tracking-[0.12em] text:black dark:text-white"
          >
            Quick actions
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {QUICK_ACTIONS.map(({ label, sub, icon: Icon, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                style={{ ...TICKET_CLIP, borderColor: "var(--border)" }}
                className="group flex items-center gap-3 border bg-[var(--surface)] px-4 py-4 text-left transition hover:bg-[var(--accentSoft)]"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center border"
                  style={{ borderColor: "var(--accent)", color: "var(--accent)", borderRadius: 2 }}
                >
                  <Icon size={16} strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--text)]">{label}</p>
                  <p className="truncate text-xs text-[var(--subtext)]">{sub}</p>
                </div>
                <ArrowUpRight
                  size={15}
                  className="shrink-0 text-[var(--subtext)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
