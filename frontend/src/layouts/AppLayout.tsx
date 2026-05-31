import { Outlet } from "react-router-dom";
import { SideBar } from "../components/Sidebar";

export function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <SideBar />

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 md:ml-16 md:mr-16 md:mt-10">
        <Outlet />
      </main>
    </div>
  );
}
