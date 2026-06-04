import { LogOut, Mail, User as UserIcon, Clock } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export function Profile() {
  const navigate = useNavigate();
  const {user, logout } = useAuthStore();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col px-4 pt-6 pb-4 gap-6 transition-colors duration-200">
      <h1 className="text-2xl font-semibold text-spendly-900 dark:text-dark-text">Profile</h1>

      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-2 py-4">
        <div className="w-16 h-16 rounded-full bg-spendly-800 dark:bg-spendly-600 text-white flex items-center justify-center text-2xl font-semibold">
          {user.nickname.charAt(0).toUpperCase()}
        </div>
        <p className="text-lg font-semibold text-spendly-900 dark:text-dark-text">{user.nickname}</p>
        <span className="text-xs bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-3 py-0.5 rounded-full">
          Active
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 p-4 border border-spendly-100 dark:border-dark-border rounded-2xl bg-white dark:bg-dark-card transition-colors duration-200">
          <Mail size={18} className="text-spendly-600 dark:text-dark-muted" />
          <div>
            <p className="text-xs text-spendly-700 dark:text-dark-muted">Email</p>
            <p className="text-sm font-medium text-spendly-900 dark:text-dark-text">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 border border-spendly-100 dark:border-dark-border rounded-2xl bg-white dark:bg-dark-card transition-colors duration-200">
          <UserIcon size={18} className="text-spendly-600 dark:text-dark-muted" />
          <div>
            <p className="text-xs text-spendly-700 dark:text-dark-muted">Nickname</p>
            <p className="text-sm font-medium text-spendly-900 dark:text-dark-text">{user.nickname}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 border border-spendly-100 dark:border-dark-border rounded-2xl bg-white dark:bg-dark-card transition-colors duration-200">
          <Clock size={18} className="text-spendly-600 dark:text-dark-muted" />
          <div>
            <p className="text-xs text-spendly-700 dark:text-dark-muted">Last login</p>
            <p className="text-sm font-medium text-spendly-900 dark:text-dark-text">
              {user.last_login ? formatDate(user.last_login) : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-red-200 dark:border-red-500/30 text-red-500 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10 active:scale-95 transition-all mt-auto"
      >
        <LogOut size={16} />
        Log out
      </button>
    </div>
  );
}
