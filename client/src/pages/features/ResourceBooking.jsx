import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  MapPinned,
  AlertTriangle,
  CalendarCheck2,
  Plus,
} from "lucide-react";

const HOURS = ["9:00", "10:00", "11:00", "12:00", "1:00"];
const HOUR_HEIGHT = 92; // px per hour

const BOOKED_SLOT = {
  label: "Procurement Team",
  time: "9:00 – 10:00 AM",
  startHour: 0,
  durationHours: 1,
};

const CONFLICT_SLOT = {
  label: "Requested 9:30 – 10:30 AM",
  note: "Conflict — this slot is unavailable",
  startHour: 0.5,
  durationHours: 1,
};

const LEGEND = [
  { label: "Booked", swatch: "bg-indigo-400" },
  { label: "Conflict", swatch: "bg-rose-400" },
  { label: "Available", swatch: "bg-slate-600" },
];

export default function ResourceBooking() {
  const [resource] = useState("Conference Room B2");

  const timelineHeight = (HOURS.length - 1) * HOUR_HEIGHT;

  return (
    <div className="flex-1 bg-slate-950 px-6 py-8 text-slate-100 sm:px-10 lg:px-12 lg:py-10">
      {/* Header */}
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <span>Resources</span>
        <ChevronRight size={13} strokeWidth={2} />
        <span className="text-slate-300">Booking</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Resource booking
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Check availability and reserve shared resources for your team.
        </p>
      </div>

      <div className="max-w-3xl">
        {/* Resource selector */}
        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Resource
          </label>
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-slate-100 outline-none transition hover:border-white/20 hover:bg-white/[0.05] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25"
          >
            <span className="flex items-center gap-2.5">
              <MapPinned
                size={16}
                strokeWidth={1.75}
                className="text-slate-500"
              />
              {resource}
            </span>
            <ChevronDown size={16} strokeWidth={2} className="text-slate-500" />
          </button>
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
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
              >
                <ChevronLeft size={15} strokeWidth={2} />
              </button>
              <div className="flex items-center gap-2 px-1 text-sm font-medium text-slate-100">
                <CalendarCheck2
                  size={15}
                  strokeWidth={1.75}
                  className="text-indigo-400"
                />
                Tue, 7 Jul
              </div>
              <button
                type="button"
                aria-label="Next day"
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
              >
                <ChevronRight size={15} strokeWidth={2} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              {LEGEND.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-1.5 text-xs text-slate-500"
                >
                  <span className={`h-2 w-2 rounded-full ${item.swatch}`} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline body */}
          <div className="relative px-6 py-8 sm:px-8">
            <div
              className="relative ml-14 sm:ml-16"
              style={{ height: timelineHeight + 8 }}
            >
              {/* Hour + half-hour grid lines */}
              {HOURS.map((hour, i) => (
                <div key={hour}>
                  <div
                    className="absolute left-0 right-0 flex items-center"
                    style={{ top: i * HOUR_HEIGHT }}
                  >
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

              {/* Conflict slot (behind, dashed) */}
              <div
                className="absolute left-0 right-0 z-10 flex flex-col justify-end rounded-lg border-2 border-dashed border-rose-400/60 bg-rose-500/[0.06] px-4 pb-3 transition-colors"
                style={{
                  top: CONFLICT_SLOT.startHour * HOUR_HEIGHT,
                  height: CONFLICT_SLOT.durationHours * HOUR_HEIGHT,
                }}
              >
                <div className="flex items-start gap-2 rounded-md bg-slate-950/90 px-2.5 py-2 shadow-sm">
                  <AlertTriangle
                    size={14}
                    strokeWidth={2}
                    className="mt-0.5 shrink-0 text-rose-400"
                  />
                  <p className="text-xs leading-snug text-rose-300">
                    <span className="font-medium text-rose-200">
                      {CONFLICT_SLOT.label}
                    </span>
                    <br className="sm:hidden" />
                    <span className="text-rose-400/90 sm:before:content-['_·_']">
                      {CONFLICT_SLOT.note}
                    </span>
                  </p>
                </div>
              </div>

              {/* Booked slot (solid, on top) */}
              <div
                className="absolute left-0 right-0 z-20 flex items-center gap-3 rounded-lg border border-indigo-400/40 bg-indigo-500/25 px-4 py-3 shadow-[0_8px_24px_-8px_rgba(99,102,241,0.45)] backdrop-blur-sm"
                style={{
                  top: BOOKED_SLOT.startHour * HOUR_HEIGHT,
                  height: BOOKED_SLOT.durationHours * HOUR_HEIGHT,
                }}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-400/20 text-xs font-semibold text-indigo-100 ring-1 ring-inset ring-indigo-300/30">
                  PT
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-indigo-100">
                    {BOOKED_SLOT.label}
                  </p>
                  <p className="text-xs text-indigo-300/80">
                    {BOOKED_SLOT.time}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Book a slot */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset] transition hover:-translate-y-px hover:bg-indigo-400 hover:shadow-lg hover:shadow-indigo-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:translate-y-0"
          >
            <Plus size={16} strokeWidth={2} />
            Book a slot
          </button>
          <p className="text-xs text-slate-500">
            Select an available window on the timeline above to reserve it.
          </p>
        </div>
      </div>
    </div>
  );
}
