import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Laptop,
  Projector,
  Armchair,
  Package,
  X,
} from "lucide-react";
import { createAsset, getAssets } from "../../api/assets";

const FILTERS = ["Category", "Status", "Department"];

const EMPTY_ASSET_FORM = {
  name: "",
  serial_number: "",
  acquisition_date: new Date().toISOString().slice(0, 10),
  acquisition_cost: "",
  condition: "New",
  status: "Available",
  location: "",
  is_bookable: false,
};

const STATUS_STYLES = {
  Allocated: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
  "Under Maintenance": "border-amber-500/30 bg-amber-500/10 text-amber-400",
  Available: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  Reserved: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  Lost: "border-rose-500/30 bg-rose-500/10 text-rose-400",
  Retired: "border-slate-500/30 bg-slate-500/10 text-slate-400",
  Disposed: "border-slate-500/30 bg-slate-500/10 text-slate-400",
};

const STATUS_DOT = {
  Allocated: "bg-indigo-400",
  "Under Maintenance": "bg-amber-400",
  Available: "bg-emerald-400",
  Reserved: "bg-cyan-400",
  Lost: "bg-rose-400",
  Retired: "bg-slate-400",
  Disposed: "bg-slate-400",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
        STATUS_STYLES[status] ?? "border-slate-500/30 bg-slate-500/10 text-slate-400"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status] ?? "bg-slate-400"}`} />
      {status}
    </span>
  );
}

function FilterButton({ label }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-slate-100"
    >
      {label}
      <ChevronDown size={14} strokeWidth={2} className="text-slate-500" />
    </button>
  );
}

export default function Assets() {
  const [search, setSearch] = useState("");
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [assetForm, setAssetForm] = useState(EMPTY_ASSET_FORM);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          if (error.response?.status === 403) {
            setLoadError("Your account needs the asset_manager role to view assets.");
          } else if (!error.response) {
            setLoadError("Cannot reach the backend. Start Django at http://127.0.0.1:8000.");
          } else {
            setLoadError(error.response.data?.detail ?? "Unable to load assets. Please try again.");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAssets();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredAssets = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return assets;

    return assets.filter((asset) =>
      [asset.asset_tag, asset.name, asset.serial_number, asset.qr_code]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [assets, search]);

  const getAssetIcon = (asset) => {
    const name = `${asset.name} ${asset.category_name ?? asset.category}`.toLowerCase();
    if (name.includes("laptop") || name.includes("computer")) return Laptop;
    if (name.includes("projector")) return Projector;
    if (name.includes("chair")) return Armchair;
    return Package;
  };

  const updateAssetForm = (event) => {
    const { name, value, type, checked } = event.target;
    setAssetForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateAsset = async (event) => {
    event.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      const { data } = await createAsset({
        ...assetForm,
      });
      setAssets((current) => [data, ...current]);
      setAssetForm(EMPTY_ASSET_FORM);
      setShowRegisterForm(false);
    } catch (error) {
      const errors = error.response?.data;
      setFormError(
        typeof errors === "string"
          ? errors
          : errors && typeof errors === "object"
          ? Object.entries(errors)
              .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(" ") : messages}`)
              .join(" ")
          : "Unable to register the asset."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-page h-full min-h-full w-full bg-white text-slate-100 dark:bg-gray-900 flex flex-col px-8 py-6">
      {/* Header */}
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <span>Assets</span>
        <ChevronRight size={13} strokeWidth={2} />
        <span className="text-slate-300">Directory</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Asset registrations &amp; directory
        </h1>
        <p className="mt-2 text-base text-slate-400">
          Search, filter, and manage every registered asset in your
          organization.
        </p>
      </div>

      {/* Search + Register */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={17}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by tag, serial, or QR code…"
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3.5 text-base text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/25"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            setFormError("");
            setShowRegisterForm(true);
          }}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-500 px-5 py-3 text-base font-semibold text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset] transition hover:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <Plus size={16} strokeWidth={2} />
          Register Asset
        </button>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        {FILTERS.map((filter) => (
          <FilterButton key={filter} label={filter} />
        ))}
      </div>

      {/* Table card */}
      <div className="flex-1 overflow-auto rounded-xl border border-white/10 bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-base">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-sm uppercase tracking-wide text-slate-400">
                <th className="px-6 py-3.5 font-medium">Tag</th>
                <th className="px-6 py-3.5 font-medium">Name</th>
                <th className="px-6 py-3.5 font-medium">Category</th>
                <th className="px-6 py-3.5 font-medium">Status</th>
                <th className="px-6 py-3.5 font-medium">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-400">
                    Loading assets…
                  </td>
                </tr>
              )}
              {!isLoading && loadError && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-rose-400">
                    {loadError}
                  </td>
                </tr>
              )}
              {!isLoading && !loadError && filteredAssets.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-400">
                    No assets found.
                  </td>
                </tr>
              )}
              {!isLoading && !loadError && filteredAssets.map((asset) => {
                const AssetIcon = getAssetIcon(asset);
                return (
                <tr key={asset.id} className="transition hover:bg-white/[0.03]">
                  <td className="px-6 py-5 font-mono text-xs text-slate-400">
                    {asset.asset_tag}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2.5 font-medium text-slate-100">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400">
                        <AssetIcon size={15} strokeWidth={1.75} />
                      </span>
                      {asset.name}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-300">
                    {asset.category_name ?? asset.category ?? "—"}
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={asset.status} />
                  </td>
                  <td className="px-6 py-5 text-slate-400">
                    {asset.location}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showRegisterForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleCreateAsset}
            className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Register asset</h2>
                <p className="mt-1 text-sm text-slate-500">Asset tag and QR code are generated automatically.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowRegisterForm(false)}
                aria-label="Close registration form"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">Asset name
                <input required name="name" value={assetForm.name} onChange={updateAssetForm} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/[0.03]" />
              </label>
              <label className="block text-sm font-medium">Serial number
                <input required name="serial_number" value={assetForm.serial_number} onChange={updateAssetForm} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/[0.03]" />
              </label>
              <label className="block text-sm font-medium">Acquisition date
                <input required type="date" name="acquisition_date" value={assetForm.acquisition_date} onChange={updateAssetForm} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/[0.03]" />
              </label>
              <label className="block text-sm font-medium">Acquisition cost
                <input required min="0" step="0.01" type="number" name="acquisition_cost" value={assetForm.acquisition_cost} onChange={updateAssetForm} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/[0.03]" />
              </label>
              <label className="block text-sm font-medium">Location
                <input required name="location" value={assetForm.location} onChange={updateAssetForm} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/[0.03]" />
              </label>
              <label className="block text-sm font-medium">Condition
                <select name="condition" value={assetForm.condition} onChange={updateAssetForm} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/[0.03]">
                  {['New', 'Good', 'Fair', 'Damaged'].map((condition) => <option key={condition}>{condition}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium">Status
                <select name="status" value={assetForm.status} onChange={updateAssetForm} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/[0.03]">
                  {Object.keys(STATUS_STYLES).map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
            </div>

            <label className="mt-4 flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" name="is_bookable" checked={assetForm.is_bookable} onChange={updateAssetForm} />
              This asset can be booked
            </label>
            {formError && <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowRegisterForm(false)} className="rounded-lg px-4 py-2.5 font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
              <button disabled={isSubmitting} className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60">
                {isSubmitting ? "Registering…" : "Register asset"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
