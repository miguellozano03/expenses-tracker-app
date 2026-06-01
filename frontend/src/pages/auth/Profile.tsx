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
    <div className="flex flex-col px-4 pt-6 pb-4 gap-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-2 py-4">
        <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-semibold">
          {user.nickname.charAt(0).toUpperCase()}
        </div>
        <p className="text-lg font-semibold">{user.nickname}</p>
        <span className="text-xs bg-green-100 text-green-700 px-3 py-0.5 rounded-full">
          Active
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-2xl">
          <Mail size={18} className="text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Email</p>
            <p className="text-sm font-medium">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-2xl">
          <UserIcon size={18} className="text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Nickname</p>
            <p className="text-sm font-medium">{user.nickname}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-2xl">
          <Clock size={18} className="text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Last login</p>
            <p className="text-sm font-medium">
              {user.last_login ? formatDate(user.last_login) : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 active:scale-95 transition-all mt-auto"
      >
        <LogOut size={16} />
        Log out
      </button>
    </div>
  );
}
