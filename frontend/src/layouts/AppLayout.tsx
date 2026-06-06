import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SideBar } from "@/components/Sidebar";
import { CreateModal } from "@/components/CreateModal";
import { useTheme } from "@/hooks/useTheme";

export function AppLayout() {
  const [modalOpen, setModalOpen] = useState(false);
  const { isDark, toggle } = useTheme();

  return (
    <div className="flex min-h-screen bg-spendly-50 dark:bg-dark-bg transition-colors duration-200">
      <SideBar
        onCreateClick={() => setModalOpen(true)}
        isDark={isDark}
        onThemeToggle={toggle}
      />

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 md:ml-16 md:mr-16 md:mt-10">
        <Outlet />
      </main>

      <CreateModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
