import { useState } from "react";
import { NavLink } from "react-router-dom";

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
      className={`h-screen bg-blue-300 dark:bg-zinc-900 text:black dark:text-white transition-all duration-300 
        ${open ? "w-[20%]" : "w-[6%]"}`}
    >
      {/* Header */}
      <div className="p-2 flex justify-center">
        <button
          onClick={() => setOpen(!open)}
          className="w-full max-w-full border border-gray-500 rounded px-2 py-2 text-sm hover:bg-blue-500 dark:hover:bg-zinc-800 transition-all"
        >
          {open ? "Hide" : "Sidebar"}
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
                `text-left text-xl px-6 py-3 transition-all hover:bg-blue-400 dark:hover:bg-gray-400 ${
                  isActive ? "bg-gray-400 dark:bg-zinc-500 font-semibold" : ""
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