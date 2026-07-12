import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <Navbar />
      <div className="flex min-h-0 flex-1 bg-white dark:bg-gray-900">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
