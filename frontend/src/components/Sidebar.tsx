import { Home, ChartPie, FileText, User, Plus } from "lucide-react";
import type React from "react";
import { Link } from "react-router-dom";

const SideBarItems = [
  { label: "Home", icon: <Home size={24} />, path: "/home" },
  { label: "Charts", icon: <ChartPie size={24} />, path: "/charts" },
  { label: "", icon: <Plus size={24} />, path: "/create" },
  { label: "Reports", icon: <FileText size={24} />, path: "/reports" },
  { label: "Profile", icon: <User size={24} />, path: "/profile" },
];

interface SideBarLinkProps {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const SideBarLink = ({ label, icon, path }: SideBarLinkProps) => {
  return (
    <Link to={path} className="flex flex-col items-center justify-center">
      {icon} <span>{label}</span>
    </Link>
  );
};

const CreateItem = () => {
  return (
    <Link
      to="/create"
      className="flex items-center justify-center w-12 h-12 rounded-full bg-black text-white shadow-md hover:scale-105 active:scale-95 transition-transform duration-150"
    >
      <Plus size={24} />
    </Link>
  );
};

export const SideBar = () => {
  return (
    <div className="flex w-full h-20 gap-12 justify-center items-center">
      {SideBarItems.map((item) =>
        item.path === "/create" ? (
          <CreateItem key={item.path} />
        ) : (
          <SideBarLink
            key={item.path}
            label={item.label}
            icon={item.icon}
            path={item.path}
          />
        ),
      )}
    </div>
  );
};
