import { Outlet } from "react-router-dom";
import { SideBar } from "../components/Sidebar";

export function MobileLayout() {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
      <nav className="border-t border-gray-200">
        <SideBar />
      </nav>
    </div>
  );
}
