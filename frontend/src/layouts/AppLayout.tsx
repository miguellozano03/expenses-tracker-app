import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SideBar } from "../components/Sidebar";
import { CreateModal } from "../components/CreateModal";

export function AppLayout() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <SideBar onCreateClick={() => setModalOpen(true)} />

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 md:ml-16 md:mr-16 md:mt-10">
        <Outlet />
      </main>

      <CreateModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
