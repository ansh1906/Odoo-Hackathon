import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  MapPinned,
  Car,
  Boxes,
  AlertTriangle,
  CalendarCheck2,
  Plus,
  X,
  Loader2,
  Check,
} from "lucide-react";
import { getBookings, createBooking, cancelBooking } from "../../api/bookings";

const HOURS = ["9:00", "10:00", "11:00", "12:00", "1:00"];
const HOUR_HEIGHT = 92; // px per hour
const START_HOUR_24 = 9; // timeline starts at 9:00 AM
const SLOT_STEP = 0.5; // 30-minute granularity

const RESOURCE_ICONS = { Room: MapPinned, Vehicle: Car, Equipment: Boxes };

const RESOURCES = [
  { id: "room-b2", name: "Conference Room B2", type: "Room" },
  { id: "room-a1", name: "Conference Room A1", type: "Room" },
  { id: "vehicle-innova", name: "Toyota Innova (Fleet Vehicle)", type: "Vehicle" },
  { id: "projector-cart", name: "Projector Cart", type: "Equipment" },
];

const LEGEND = [
  { label: "Booked", swatch: "bg-indigo-400" },
  { label: "Conflict", swatch: "bg-rose-400" },
  { label: "Available", swatch: "bg-slate-600" },
];

const TIME_OPTIONS = Array.from(
  { length: (HOURS.length - 1) / SLOT_STEP + 1 },
  (_, i) => i * SLOT_STEP
);

// Seed data so the screen is fully demoable before booking endpoints are live.
const SEED_KEY = `room-b2|2026-07-07`;
const SEED_BOOKINGS = {
  [SEED_KEY]: [{ id: 1, label: "Procurement Team", startHour: 0, durationHours: 1 }],
};

function offsetToLabel(offset) {
  const totalMinutes = offset * 60;
  const hour24 = START_HOUR_24 + Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12}:${minutes === 0 ? "00" : minutes} ${period}`;
}

function overlaps(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

function dateKeyFor(date) {
  return date.toISOString().slice(0, 10);
}

function formatDateLabel(date) {
  return date.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
}

let localIdCounter = 1000;

export default function ResourceBooking() {
  const [resourceId, setResourceId] = useState(RESOURCES[0].id);
  const [resourceMenuOpen, setResourceMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date("2026-07-07T00:00:00"));
  const [bookingsMap, setBookingsMap] = useState(SEED_BOOKINGS);
  const [loadingKey, setLoadingKey] = useState(null);

  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");
  const [formLabel, setFormLabel] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const resource = RESOURCES.find((r) => r.id === resourceId);
  const ResourceIcon = RESOURCE_ICONS[resource.type];
  const dateKey = dateKeyFor(selectedDate);
  const key = `${resourceId}|${dateKey}`;

  const bookings = bookingsMap[key] || [];
  const timelineHeight = (HOURS.length - 1) * HOUR_HEIGHT;

  // Fetch bookings for the active resource + date whenever either changes.
  // Falls back silently to whatever's already in bookingsMap (seed/local/empty).
  useEffect(() => {
    let cancelled = false;
    setLoadingKey(key);

    getBookings({ asset_id: resourceId, date: dateKey })
      .then((res) => {
        if (cancelled) return;
        setBookingsMap((prev) => ({ ...prev, [key]: res.data }));
      })
      .catch(() => {
        // no live endpoint yet — keep existing/local data for this key
      })
      .finally(() => {
        if (!cancelled) setLoadingKey(null);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceId, dateKey]);

  const preview = useMemo(() => {
    if (formStart === "" || formEnd === "") return null;
    const start = Number(formStart);
    const end = Number(formEnd);
    if (end <= start) return null;

    const conflicting = bookings.some((b) =>
      overlaps(start, end, b.startHour, b.startHour + b.durationHours)
    );

    return { start, end, duration: end - start, conflicting };
  }, [formStart, formEnd, bookings]);

  const endOptions = useMemo(() => {
    if (formStart === "") return [];
    return TIME_OPTIONS.filter((t) => t > Number(formStart));
  }, [formStart]);

  const changeDay = (delta) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + delta);
    setSelectedDate(next);
    setFormStart("");
    setFormEnd("");
    setFormError("");
  };

  const setBookingsForKey = (updater) => {
    setBookingsMap((prev) => ({ ...prev, [key]: updater(prev[key] || []) }));
  };

  const handleReserve = async () => {
    if (!preview || preview.conflicting) return;
    setFormError("");
    setSubmitting(true);

    const label = formLabel.trim() || "Reserved slot";
    const payload = {
      asset_id: resourceId,
      start_time: `${dateKey}T${offsetToLabel(preview.start)}`,
      end_time: `${dateKey}T${offsetToLabel(preview.end)}`,
      label,
    };

    try {
      const { data } = await createBooking(payload);
      setBookingsForKey((prev) => [
        ...prev,
        {
          id: data.id ?? localIdCounter++,
          label,
          startHour: preview.start,
          durationHours: preview.duration,
        },
      ]);
    } catch {
      setBookingsForKey((prev) => [
        ...prev,
        { id: localIdCounter++, label, startHour: preview.start, durationHours: preview.duration },
      ]);
    } finally {
      setSubmitting(false);
      setFormStart("");
      setFormEnd("");
      setFormLabel("");
    }
  };

  const handleDelete = async (id) => {
    try {
      await cancelBooking(id);
    } catch {
      // demo fallback — still remove locally
    }
    setBookingsForKey((prev) => prev.filter((b) => b.id !== id));
  };

  const sortedBookings = [...bookings].sort((a, b) => a.startHour - b.startHour);

  return (
    <div className="app-page min-h-full bg-white px-6 py-8 text-slate-100 dark:bg-gray-900 sm:px-8 lg:px-10">
      {/* Header */}
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <span>Resources</span>
        <ChevronRight size={13} strokeWidth={2} />
        <span className="text-slate-300">Booking</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Resource booking
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Check availability and reserve shared resources for your team.
        </p>
      </div>

      {/* Full-width responsive layout: timeline + summary sidebar */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main column */}
        <div className="min-w-0">
          {/* Resource selector (functional dropdown) */}
          <div className="relative mb-5">
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Resource
            </label>
            <button
              type="button"
              onClick={() => setResourceMenuOpen((o) => !o)}
              className="flex w-full items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-slate-100 outline-none transition hover:border-white/20 hover:bg-white/[0.05] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25"
            >
              <span className="flex items-center gap-2.5">
                <ResourceIcon size={16} strokeWidth={1.75} className="text-slate-500" />
                {resource.name}
              </span>
              <ChevronDown
                size={16}
                strokeWidth={2}
                className={`text-slate-500 transition-transform ${resourceMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {resourceMenuOpen && (
              <div className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-lg border border-white/10 bg-slate-900 shadow-xl">
                {RESOURCES.map((r) => {
                  const Icon = RESOURCE_ICONS[r.type];
                  const active = r.id === resourceId;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setResourceId(r.id);
                        setResourceMenuOpen(false);
                        setFormStart("");
                        setFormEnd("");
                      }}
                      className={`flex w-full items-center justify-between gap-2.5 px-4 py-2.5 text-left text-sm transition hover:bg-white/5 ${
                        active ? "text-indigo-300" : "text-slate-200"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon size={15} strokeWidth={1.75} className="text-slate-500" />
                        {r.name}
                      </span>
                      {active && <Check size={15} className="text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Timeline card */}
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[80px]" />

            {/* Card header: date nav + legend */}
            <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-4 sm:px-8">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Previous day"
                  onClick={() => changeDay(-1)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
                >
                  <ChevronLeft size={15} strokeWidth={2} />
                </button>
                <div className="flex items-center gap-2 px-1 text-sm font-medium text-slate-100">
                  <CalendarCheck2 size={15} strokeWidth={1.75} className="text-indigo-400" />
                  {formatDateLabel(selectedDate)}
                </div>
                <button
                  type="button"
                  aria-label="Next day"
                  onClick={() => changeDay(1)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
                >
                  <ChevronRight size={15} strokeWidth={2} />
                </button>
              </div>

              <div className="flex items-center gap-4">
                {LEGEND.map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className={`h-2 w-2 rounded-full ${item.swatch}`} />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline body */}
            <div className="relative px-6 py-8 sm:px-8">
              {loadingKey === key && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/40 backdrop-blur-[1px]">
                  <Loader2 size={20} className="animate-spin text-indigo-400" />
                </div>
              )}
              <div className="relative ml-14 sm:ml-16" style={{ height: timelineHeight + 8 }}>
                {HOURS.map((hour, i) => (
                  <div key={hour}>
                    <div className="absolute left-0 right-0 flex items-center" style={{ top: i * HOUR_HEIGHT }}>
                      <span className="absolute -left-14 w-11 -translate-y-1/2 text-right text-xs font-medium text-slate-500 sm:-left-16 sm:w-12">
                        {hour}
                      </span>
                      <div className="h-px w-full bg-white/10" />
                    </div>
                    {i < HOURS.length - 1 && (
                      <div
                        className="absolute left-0 right-0 h-px w-full bg-white/[0.04]"
                        style={{ top: i * HOUR_HEIGHT + HOUR_HEIGHT / 2 }}
                      />
                    )}
                  </div>
                ))}

                {preview && (
                  <div
                    className={`absolute left-0 right-0 z-10 flex flex-col justify-end rounded-lg border-2 border-dashed px-4 pb-3 transition-colors ${
                      preview.conflicting
                        ? "border-rose-400/60 bg-rose-500/[0.06]"
                        : "border-emerald-400/60 bg-emerald-500/[0.06]"
                    }`}
                    style={{ top: preview.start * HOUR_HEIGHT, height: preview.duration * HOUR_HEIGHT }}
                  >
                    <div className="flex items-start gap-2 rounded-md bg-slate-950/90 px-2.5 py-2 shadow-sm">
                      {preview.conflicting ? (
                        <>
                          <AlertTriangle size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-rose-400" />
                          <p className="text-xs leading-snug text-rose-300">
                            <span className="font-medium text-rose-200">
                              Requested {offsetToLabel(preview.start)} – {offsetToLabel(preview.end)}
                            </span>
                            <br className="sm:hidden" />
                            <span className="text-rose-400/90 sm:before:content-['_·_']">
                              Conflict — this slot is unavailable
                            </span>
                          </p>
                        </>
                      ) : (
                        <p className="text-xs leading-snug text-emerald-300">
                          <span className="font-medium text-emerald-200">
                            {offsetToLabel(preview.start)} – {offsetToLabel(preview.end)}
                          </span>{" "}
                          available
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="group absolute left-0 right-0 z-20 flex items-center gap-3 rounded-lg border border-indigo-400/40 bg-indigo-500/25 px-4 py-3 shadow-[0_8px_24px_-8px_rgba(99,102,241,0.45)] backdrop-blur-sm"
                    style={{ top: b.startHour * HOUR_HEIGHT, height: b.durationHours * HOUR_HEIGHT }}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-400/20 text-xs font-semibold text-indigo-100 ring-1 ring-inset ring-indigo-300/30">
                      {b.label.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-indigo-100">{b.label}</p>
                      <p className="text-xs text-indigo-300/80">
                        {offsetToLabel(b.startHour)} – {offsetToLabel(b.startHour + b.durationHours)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(b.id)}
                      aria-label={`Cancel ${b.label} booking`}
                      className="shrink-0 rounded-md p-1 text-indigo-300/60 opacity-0 transition hover:bg-white/10 hover:text-rose-300 group-hover:opacity-100"
                    >
                      <X size={15} strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Book a slot form */}
          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <p className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-200">
              <Plus size={15} className="text-indigo-400" />
              Book a slot
            </p>

            {formError && (
              <div className="mb-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                {formError}
              </div>
            )}

            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Start</label>
                <select
                  value={formStart}
                  onChange={(e) => {
                    setFormStart(e.target.value);
                    setFormEnd("");
                  }}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25"
                >
                  <option value="">Select…</option>
                  {TIME_OPTIONS.slice(0, -1).map((t) => (
                    <option key={t} value={t}>
                      {offsetToLabel(t)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">End</label>
                <select
                  value={formEnd}
                  onChange={(e) => setFormEnd(e.target.value)}
                  disabled={formStart === ""}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 disabled:opacity-50"
                >
                  <option value="">Select…</option>
                  {endOptions.map((t) => (
                    <option key={t} value={t}>
                      {offsetToLabel(t)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="min-w-[180px] flex-1">
                <label className="mb-1.5 block text-xs font-medium text-slate-400">
                  Purpose (optional)
                </label>
                <input
                  type="text"
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                  placeholder="e.g. Design Sync"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25"
                />
              </div>

              <button
                type="button"
                onClick={handleReserve}
                disabled={!preview || preview.conflicting || submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset] transition hover:-translate-y-px hover:bg-indigo-400 hover:shadow-lg hover:shadow-indigo-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Reserving…
                  </>
                ) : (
                  <>
                    <Plus size={16} strokeWidth={2} />
                    Reserve slot
                  </>
                )}
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Pick a start and end time — the timeline previews the slot live and blocks it if it overlaps an existing booking.
            </p>
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Bookings today</p>
            <p className="mt-1 text-2xl font-semibold text-indigo-300">{bookings.length}</p>
            <p className="mt-0.5 text-xs text-slate-500">for {resource.name}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="border-b border-white/10 px-4 py-3">
              <p className="text-sm font-medium text-slate-200">
                {formatDateLabel(selectedDate)} schedule
              </p>
            </div>
            {sortedBookings.length === 0 ? (
              <p className="p-5 text-center text-xs text-slate-500">
                Nothing booked yet — this resource is free all day.
              </p>
            ) : (
              <div className="divide-y divide-white/5">
                {sortedBookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between gap-2 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-100">{b.label}</p>
                      <p className="text-xs text-slate-500">
                        {offsetToLabel(b.startHour)} – {offsetToLabel(b.startHour + b.durationHours)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(b.id)}
                      aria-label={`Cancel ${b.label}`}
                      className="shrink-0 rounded-md p-1.5 text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-300"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
