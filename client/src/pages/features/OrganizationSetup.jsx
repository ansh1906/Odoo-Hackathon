import { useState } from "react";
import { Plus, ChevronRight } from "lucide-react";

const TABS = ["Departments", "Categories", "Employee"];

const DEPARTMENTS = [
  {
    id: "eng",
    department: "Engineering",
    head: "Aditi Rao",
    parentDept: "—",
    status: "Active",
  },
  {
    id: "fac",
    department: "Facilities",
    head: "Rohan Mehta",
    parentDept: "—",
    status: "Active",
  },
  {
    id: "fo-east",
    department: "Field Ops (East)",
    head: "Sana Iqbal",
    parentDept: "Field Ops",
    status: "Inactive",
  },
];

function StatusBadge({ status }) {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
        isActive
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          : "border-slate-500/30 bg-slate-500/10 text-slate-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-emerald-400" : "bg-slate-500"
        }`}
      />
      {status}
    </span>
  );
}

export default function OrganizationSetup() {
  const [activeTab, setActiveTab] = useState("Departments");

  return (
    <div className="flex-1 bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <span>Admin</span>
        <ChevronRight size={13} strokeWidth={2} />
        <span className="text-slate-300">Organization setup</span>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Organization setup
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage departments, categories, and employees for your
            organization.
          </p>
        </div>
      </div>

      {/* Tabs + Add */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-indigo-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset] transition hover:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <Plus size={16} strokeWidth={2} />
          Add {activeTab === "Departments" ? "Department" : activeTab.slice(0, -1) || activeTab}
        </button>
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
        {activeTab === "Departments" ? (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3.5 font-medium">Department</th>
                <th className="px-6 py-3.5 font-medium">Head</th>
                <th className="px-6 py-3.5 font-medium">Parent Dept</th>
                <th className="px-6 py-3.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {DEPARTMENTS.map((row) => (
                <tr key={row.id} className="transition hover:bg-white/[0.03]">
                  <td className="px-6 py-4 font-medium text-slate-100">
                    {row.department}
                  </td>
                  <td className="px-6 py-4 text-slate-300">{row.head}</td>
                  <td className="px-6 py-4 text-slate-400">
                    {row.parentDept}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <p className="text-sm font-medium text-slate-300">
              No {activeTab.toLowerCase()} configured yet
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Use the “Add” button above to create your first entry.
            </p>
          </div>
        )}
      </div>

      {/* Helper note */}
      <div className="mt-6 border-t border-white/10 pt-5">
        <p className="text-xs text-slate-500">
          Editing a department here also drives the picklist in Screen 4 &amp; 5.
        </p>
      </div>
    </div>
  );
}
