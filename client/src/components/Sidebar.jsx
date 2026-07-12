import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Organization Setup", path: "/organization-setup" },
    { label: "Assets", path: "/assets" },
    { label: "Allocation & Transfer", path: "/allocation-transfer" },
    { label: "Resource Booking", path: "/resource-booking" },
    { label: "Maintenance", path: "/maintenance" },
    { label: "Audit", path: "/audit" },
    { label: "Reports", path: "/reports" },
    { label: "Notifications", path: "/notifications" },
  ];

  return (
    <div
      className={`my-3 ml-3 h-[calc(100%-1.5rem)] shrink-0 overflow-hidden rounded-2xl border border-blue-300/70 bg-blue-400 text-black shadow-xl shadow-blue-950/20 transition-all duration-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:shadow-black/30
        ${open ? "w-80" : "w-12"}`}
    >
      {/* Header */}
      <div className="flex justify-center p-2">
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          className={`flex w-full items-center rounded-xl border border-gray-500 py-2 transition-all hover:bg-blue-600 dark:hover:bg-zinc-800 ${
            open ? "justify-center px-2 text-sm" : "justify-center px-0"
          }`}
        >
          {open ? "Hide" : <Menu size={22} strokeWidth={2.25} />}
        </button>
      </div>

      {/* Menu */}
      {open && (
        <div className="mt-6 flex flex-col">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `mx-2 rounded-xl px-4 py-3 text-left text-xl transition-all hover:bg-blue-500 dark:hover:bg-gray-400 ${
                  isActive ? "bg-gray-400 font-semibold dark:bg-zinc-500" : ""
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
