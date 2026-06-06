import { Home, ChartPie, FileText, User, Plus, Moon, Sun } from "lucide-react";
import type React from "react";
import { Link, useLocation } from "react-router-dom";

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

const SideBarLink = ({ label, icon, path }: SideBarLinkProps) => {
  const { pathname } = useLocation();
  const isActive = pathname === path;

  return (
    <Link
      to={path}
      className={`flex flex-col items-center justify-center gap-1 text-[11px]
        transition-colors md:flex-col md:w-full md:gap-2 md:py-3 md:rounded-lg
        ${
          isActive
            ? "text-spendly-400 md:bg-white/10"
            : "text-spendly-300 hover:text-white md:hover:bg-white/5"
        }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

interface CreateItemProps {
  onClick: () => void;
}

const CreateItem = ({ onClick }: CreateItemProps) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center w-12 h-12 rounded-full
      bg-spendly-500 dark:bg-spendly-600
      text-white shadow-md
      hover:bg-spendly-600 dark:hover:bg-spendly-500
      hover:scale-105 active:scale-95 transition-all duration-150"
  >
    <Plus size={24} />
  </button>
);

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeToggle = ({ isDark, onToggle }: ThemeToggleProps) => (
  <button
    onClick={onToggle}
    aria-label="Toggle theme"
    className="flex flex-col items-center justify-center gap-1 text-[11px]
      text-spendly-300 hover:text-white transition-colors
      md:w-full md:py-3 md:rounded-lg md:hover:bg-white/5"
  >
    {isDark ? <Sun size={24} /> : <Moon size={24} />}
    <span className="hidden md:block">{isDark ? "Light" : "Dark"}</span>
  </button>
);

interface SideBarProps {
  onCreateClick: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

export const SideBar = ({
  onCreateClick,
  isDark,
  onThemeToggle,
}: SideBarProps) => (
  <aside
    className="
      fixed bottom-0 left-0 z-50
      flex w-full h-16 justify-around items-center
      border-t border-spendly-800 bg-spendly-900
      dark:border-dark-border dark:bg-dark-surface
      md:static md:w-24 md:h-screen
      md:flex-col md:justify-start md:items-center md:gap-2
      md:border-r md:border-t-0 md:py-6
      transition-colors duration-200
    "
  >
    {SideBarItems.map((item) =>
      item.path === null ? (
        <CreateItem key="create" onClick={onCreateClick} />
      ) : (
        <SideBarLink
          key={item.path}
          label={item.label}
          icon={item.icon}
          path={item.path}
        />
      ),
    )}

    <div className="md:mt-auto">
      <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
    </div>
  </aside>
);
