import { Bell, Search, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "SX";

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Security Operations
        </p>

        <h2 className="mt-1 text-lg font-semibold text-gray-900">
          AI Task Integrity Monitor
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 md:flex">
          <Search size={16} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            className="w-40 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>

        <button className="relative text-gray-500 hover:text-gray-900">
          <Bell size={20} />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {user ? (
          <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-lg p-1 hover:bg-gray-50 transition"
              title="View Profile"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-50 text-sm font-semibold text-cyan-600">
                {initials}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-gray-900 leading-tight">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 leading-tight truncate max-w-[140px]">
                  {user.email}
                </p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 pl-2">
            <Link
              to="/login"
              className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}