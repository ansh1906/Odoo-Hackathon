import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getMaintenanceRequests,
  approveMaintenance,
  rejectMaintenance,
  resolveMaintenance,
} from "../../api/Maintenance";
import StatusBadge from "../../components/StatusBadge";
import PriorityBadge from "../../components/Prioritybadge";
import RaiseRequestModal from "../../components/Raiserequestmodal";

// Fallback data so the screen is fully demoable before the backend endpoint
// is live. Swap-free: once the API responds, this is never used.
const MOCK_REQUESTS = [
  {
    id: 1,
    asset_tag: "AF-0114",
    asset_name: 'MacBook Pro 14"',
    issue_description: "Battery drains fully within an hour of unplugging.",
    priority: "High",
    status: "Pending",
    raised_by: "Priya Sharma",
    created_at: "2026-07-10T09:15:00Z",
  },
  {
    id: 2,
    asset_tag: "AF-0201",
    asset_name: "Conference Room Projector",
    issue_description: "Image has a faint green tint on all inputs.",
    priority: "Medium",
    status: "Approved",
    raised_by: "Raj Mehta",
    created_at: "2026-07-09T14:30:00Z",
  },
  {
    id: 3,
    asset_tag: "AF-0305",
    asset_name: "Toyota Innova (Fleet Vehicle)",
    issue_description: "Unusual noise from front-left wheel while braking.",
    priority: "High",
    status: "In Progress",
    raised_by: "Ankit Rao",
    created_at: "2026-07-08T08:00:00Z",
  },
  {
    id: 4,
    asset_tag: "AF-0102",
    asset_name: "Dell Latitude 5420",
    issue_description: "Keyboard 'E' key sticking intermittently.",
    priority: "Low",
    status: "Resolved",
    raised_by: "Neha Kulkarni",
    created_at: "2026-07-05T11:20:00Z",
  },
];

const FILTERS = ["All", "Pending", "Approved", "In Progress", "Resolved", "Rejected"];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Maintenance() {
  const { user } = useAuth();
  const canApprove = user?.role === "AssetManager" || user?.role === "Admin";

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [actionErrorId, setActionErrorId] = useState(null);

  useEffect(() => {
    getMaintenanceRequests()
      .then((res) => setRequests(res.data))
      .catch(() => setRequests(MOCK_REQUESTS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => (filter === "All" ? requests : requests.filter((r) => r.status === filter)),
    [requests, filter]
  );

  const counts = useMemo(() => {
    const base = { Pending: 0, "In Progress": 0, Resolved: 0 };
    requests.forEach((r) => {
      if (base[r.status] !== undefined) base[r.status] += 1;
    });
    return base;
  }, [requests]);

  const patchLocal = (id, patch) =>
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const handleApprove = async (id) => {
    setActionErrorId(null);
    try {
      await approveMaintenance(id);
    } catch {
      // demo fallback — still reflect the action locally
    }
    patchLocal(id, { status: "Approved" });
  };

  const handleReject = async (id) => {
    setActionErrorId(null);
    try {
      await rejectMaintenance(id);
    } catch {
      // demo fallback
    }
    patchLocal(id, { status: "Rejected" });
  };

  const handleResolve = async (id) => {
    setActionErrorId(null);
    try {
      await resolveMaintenance(id, { technician_notes: "Marked resolved from dashboard." });
    } catch {
      // demo fallback
    }
    patchLocal(id, { status: "Resolved" });
  };

  return (
    <div className="h-full w-full min-h-full flex-1 overflow-auto bg-gray-50 dark:bg-gray-950 px-8 py-10 text-slate-900 dark:text-slate-100 sm:px-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Maintenance
          </h1>
          <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
            Repairs route through approval before work begins.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-base font-semibold text-white hover:bg-indigo-500"
        >
          Raise request
        </button>
      </div>

      {/* KPI strip */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">Pending approval</p>
          <p className="mt-2 text-3xl font-semibold text-amber-500 dark:text-amber-300">{counts.Pending}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">In progress</p>
          <p className="mt-2 text-3xl font-semibold text-cyan-500 dark:text-cyan-300">{counts["In Progress"]}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">Resolved</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-500 dark:text-emerald-300">{counts.Resolved}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3.5 py-1.5 text-base font-medium transition ${
              filter === f
                ? "border-indigo-500 bg-indigo-500/15 text-indigo-300"
                : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Request list */}
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-gray-900">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading requests…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-base font-medium text-slate-700 dark:text-slate-300">No requests here.</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Nothing matches this filter — try another status or raise a new request.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-base">
            <thead className="bg-slate-100 text-sm uppercase tracking-wide text-slate-500 dark:bg-white/[0.03] dark:text-slate-400">
              <tr>
                <th className="px-5 py-4 font-medium">Asset</th>
                <th className="px-5 py-4 font-medium">Issue</th>
                <th className="px-5 py-4 font-medium">Priority</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Raised</th>
                {canApprove && <th className="px-5 py-4 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03]">
                  <td className="px-5 py-4">
                    <p className="font-medium text:black dark:text-slate-100">{r.asset_name}</p>
                    <p className="text-xs text-slate-500">{r.asset_tag}</p>
                  </td>
                  <td className="max-w-md px-5 py-4 text-slate-700 dark:text-slate-300">{r.issue_description}</td>
                  <td className="px-5 py-4">
                    <PriorityBadge priority={r.priority} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-5 py-4 text-slate-400">{formatDate(r.created_at)}</td>
                  {canApprove && (
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {r.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(r.id)}
                              title="Approve"
                              className="rounded-lg px-3 py-1.5 text-sm text-emerald-400 hover:bg-emerald-500/10"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(r.id)}
                              title="Reject"
                              className="rounded-lg px-3 py-1.5 text-sm text-rose-400 hover:bg-rose-500/10"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {(r.status === "Approved" || r.status === "In Progress") && (
                          <button
                            onClick={() => handleResolve(r.id)}
                            title="Mark resolved"
                            className="rounded-lg px-3 py-1.5 text-sm text-cyan-400 hover:bg-cyan-500/10"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <RaiseRequestModal
          onClose={() => setShowModal(false)}
          onCreated={(newRequest) => {
            setRequests((prev) => [
              {
                ...newRequest,
                asset_name: newRequest.asset_name ?? "New asset",
                raised_by: user?.name ?? "You",
              },
              ...prev,
            ]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}