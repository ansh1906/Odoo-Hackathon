import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    "Dashboard",
    "Organization Setup",
    "Assets",
    "Allocation & Transfer",
    "Resource Booking",
    "Maintenance",
    "Audit",
    "Reports",
    "Notifications",
  ];

  return (
    <div className={`h-screen bg-blue-300 dark:bg-zinc-900 text:black dark:text-white transition-all duration-300 
        ${
        open ? "w-[20%]" : "w-[6%]"
        }`}
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
            <button key={item} className="text-left text-xl px-6 py-3 hover:bg-blue-400 dark:hover:bg-gray-400">
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}