import { useEffect, useState } from "react";
import { Plus, ChevronRight, Pencil } from "lucide-react";
import { getDepartments, createDepartment, updateDepartment , getEmployees} from "../../api/orgStructure";

const TABS = ["Departments", "Categories", "Employee"];

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
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    department_head: "",
    parent_department: "",
  });

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  };
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await getEmployees();
    setEmployees(res.data);
  };
  const handleAdd = async () => {
    setEditingDepartment(null);
    setFormData({ name: "", department_head: "", parent_department: "" });
    setIsModalOpen(true);
  };

  const handleEdit = async (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name || "",
      department_head: department.department_head || "",
      parent_department: department.parent_department || "",
    });
    setIsModalOpen(true);
  };

  return (
    <div className="h-full min-h-full w-full bg-slate-950 text-slate-100 flex flex-col px-8 py-6">
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
          onClick={handleAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset] transition hover:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <Plus size={16} strokeWidth={2} />
          Add {activeTab === "Departments" ? "Department" : activeTab.slice(0, -1) || activeTab}
        </button>
      </div>

      {/* Table card */}
      <div className="flex-1 overflow-auto rounded-xl border border-white/10 bg-white/[0.03]">
        {activeTab === "Departments" ? (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3.5 font-medium">Department</th>
                <th className="px-6 py-3.5 font-medium">Head</th>
                <th className="px-6 py-3.5 font-medium">Parent Dept</th>
                <th className="px-6 py-3.5 font-medium">Status</th>
                <th className="px-6 py-3.5 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {departments.map((row) => (
                <tr key={row.id || row.uuid} className="transition hover:bg-white/[0.03]">
                  <td className="px-6 py-4 font-medium text-slate-100">
                    {row.department || row.name}
                  </td>
                  <td className="px-6 py-4 text-slate-300">{row.head || row.department_head || "-"}</td>
                  <td className="px-6 py-4 text-slate-400">
                    {
                      departments.find(
                        (dept) => dept.id === row.parent_department
                      )?.name || "-"
                    }
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={row.status || "Active"} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleEdit(row)}
                      className="rounded-md p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                      title="Edit department"
                    >
                      <Pencil size={16} />
                    </button>
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
      <div className="mt-6 border-t border-white/10 pt-5 shrink-0">
        <p className="text-xs text-slate-500">
          Editing a department here also drives the picklist in Screen 4 &amp; 5.
        </p>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-slate-900 p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold text-white">
              {editingDepartment ? "Edit Department" : "Add Department"}
            </h2>

            <input
              className="mb-3 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white"
              placeholder="Department name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <select
  className="mb-3 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white"
  value={formData.department_head}
  onChange={(e) =>
    setFormData({
      ...formData,
      department_head: e.target.value,
    })
  }
>
  <option value="">Select Department Head</option>

  {employees.map((emp) => (
    <option key={emp.id} value={emp.id}>
      {emp.first_name} {emp.last_name}
    </option>
  ))}
  </select>

  <select
    className="mb-3 w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white"
    value={formData.parent_department}
    onChange={(e) =>
      setFormData({
        ...formData,
        parent_department: e.target.value,
      })
    }
  >
    <option value="">No Parent Department</option>

    {departments
      .filter((d) => d.id !== editingDepartment?.id)
      .map((dept) => (
        <option key={dept.id} value={dept.id}>
          {dept.name}
        </option>
      ))}
  </select>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded bg-slate-700 px-4 py-2 text-white"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    if (editingDepartment) {
                      await updateDepartment(editingDepartment.id, {
                        name: formData.name,
                        department_head: formData.department_head || null,
                        parent_department: formData.parent_department || null,
                      });
                    } else {
                      await createDepartment({
                        name: formData.name,
                        department_head: formData.department_head || null,
                        parent_department: formData.parent_department || null,
                      });
                    }
                    fetchDepartments();
                    setIsModalOpen(false);
                  } catch (error) {
                    console.error(error.response?.data || error);
                  }
                }}
                className="rounded bg-indigo-600 px-4 py-2 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
