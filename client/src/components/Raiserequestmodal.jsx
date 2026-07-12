import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { raiseMaintenanceRequest } from "../api/Maintenance";

// TODO: replace with a real fetch from api/assets.js once that endpoint is live.
// Kept local so this modal works standalone before the Assets module ships.
const MOCK_ASSETS = [
  { id: 1, tag: "AF-0102", name: "Dell Latitude 5420" },
  { id: 2, tag: "AF-0114", name: "MacBook Pro 14\"" },
  { id: 3, tag: "AF-0201", name: "Conference Room Projector" },
  { id: 4, tag: "AF-0305", name: "Toyota Innova (Fleet Vehicle)" },
];

export default function RaiseRequestModal({ onClose, onCreated }) {
  const [assetId, setAssetId] = useState("");
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!assetId) return setError("Select an asset.");
    if (!issue.trim()) return setError("Describe the issue.");

    setSubmitting(true);
    const payload = { asset_id: assetId, issue_description: issue, priority };

    try {
      const { data } = await raiseMaintenanceRequest(payload);
      onCreated(data);
    } catch (err) {
      // Backend not live yet or request failed — fall back to an optimistic
      // local entry so the UI flow stays testable end-to-end.
      const asset = MOCK_ASSETS.find((a) => String(a.id) === String(assetId));
      onCreated({
        id: `local-${Date.now()}`,
        asset_tag: asset?.tag ?? "—",
        asset_name: asset?.name ?? "Unknown asset",
        issue_description: issue,
        priority,
        status: "Pending",
        created_at: new Date().toISOString(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Raise maintenance request</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-500 hover:text-slate-300"
          >
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
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Asset</label>
            <select
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25"
            >
              <option value="">Select an asset…</option>
              {MOCK_ASSETS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.tag} — {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Describe the issue
            </label>
            <textarea
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              rows={3}
              placeholder="e.g. Laptop screen flickers and won't hold charge"
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Priority</label>
            <div className="flex gap-2">
              {["Low", "Medium", "High"].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 rounded-lg border py-2 text-sm font-medium transition ${
                    priority === p
                      ? "border-indigo-500 bg-indigo-500/15 text-indigo-300"
                      : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Photo (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:text-slate-200 hover:file:bg-white/15"
            />
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
                  <Loader2 size={16} className="animate-spin" /> Submitting…
                </>
              ) : (
                "Submit request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}