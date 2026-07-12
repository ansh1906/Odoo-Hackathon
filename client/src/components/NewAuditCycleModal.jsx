import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { createAuditCycle } from "../api/audits";

const MOCK_DEPARTMENTS = ["Engineering", "Operations", "Facilities", "IT Support"];
const MOCK_AUDITORS = ["A. Rao", "S. Iqbal", "R. Mehta", "N. Kulkarni"];

export default function NewAuditCycleModal({ onClose, onCreated }) {
  const [scope, setScope] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [auditors, setAuditors] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toggleAuditor = (name) =>
    setAuditors((prev) => (prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!scope) return setError("Select a department scope.");
    if (!startDate || !endDate) return setError("Set a start and end date.");
    if (new Date(endDate) < new Date(startDate)) return setError("End date must be after start date.");
    if (auditors.length === 0) return setError("Assign at least one auditor.");

    setSubmitting(true);
    const payload = { scope_department: scope, start_date: startDate, end_date: endDate, auditor_ids: auditors };

    try {
      const { data } = await createAuditCycle(payload);
      onCreated(data);
    } catch {
      onCreated({
        id: `local-${Date.now()}`,
        title: `Audit — ${scope}`,
        dateRange: `${startDate} – ${endDate}`,
        auditors: auditors.join(", "),
        status: "Open",
        checklist: [],
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">New audit cycle</h3>
          <button onClick={onClose} aria-label="Close" className="text-slate-500 hover:text-slate-300">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Department scope</label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25"
            >
              <option value="">Select department…</option>
              {MOCK_DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Start date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">End date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Assign auditors</label>
            <div className="flex flex-wrap gap-2">
              {MOCK_AUDITORS.map((name) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => toggleAuditor(name)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    auditors.includes(name)
                      ? "border-indigo-500 bg-indigo-500/15 text-indigo-300"
                      : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-white/15 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/[0.03]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-500 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Creating…
                </>
              ) : (
                "Create cycle"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}