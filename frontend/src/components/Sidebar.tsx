import { Home, ChartPie, FileText, User, Plus } from "lucide-react";
import type React from "react";
import { Link } from "react-router-dom";

const SideBarItems = [
  { label: "Home", icon: <Home size={24} />, path: "/home" },
  { label: "Charts", icon: <ChartPie size={24} />, path: "/charts" },
  { label: "", icon: <Plus size={24} />, path: null },
  { label: "Expenses", icon: <FileText size={24} />, path: "/expenses" },
  { label: "Profile", icon: <User size={24} />, path: "/profile" },
];

interface SideBarLinkProps {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const SideBarLink = ({ label, icon, path }: SideBarLinkProps) => (
  <Link
    to={path}
    className="flex flex-col items-center justify-center gap-1 text-[11px] text-gray-600
      hover:text-black transition-colors md:flex-col md:w-full md:gap-2 md:py-3"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

interface CreateItemProps {
  onClick: () => void;
}

const CreateItem = ({ onClick }: CreateItemProps) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center w-12 h-12 rounded-full bg-black
      text-white shadow-md hover:scale-105 active:scale-95 transition-transform duration-150"
  >
    <Plus size={24} />
  </button>
);

interface SideBarProps {
  onCreateClick: () => void;
}

export const SideBar = ({ onCreateClick }: SideBarProps) => (
  <aside
    className="fixed bottom-0 left-0 z-50 flex w-full h-16 justify-around items-center
      border-t bg-white md:static md:w-24 md:h-screen md:flex-col md:justify-start
      md:items-center md:gap-4 md:border-r md:border-t-0 md:py-6"
  >
    {SideBarItems.map((item) =>
      item.path === null ? (
        <CreateItem key="create" onClick={onCreateClick} />
      ) : (
        <SideBarLink key={item.path} label={item.label} icon={item.icon} path={item.path} />
      ),
    )}
  </aside>
);