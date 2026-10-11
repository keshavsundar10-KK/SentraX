import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldCheck,
  ListChecks,
  ShieldAlert,
  BarChart3,
  Activity,
} from "lucide-react";

const links = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Live Demo", path: "/live-demo", icon: ShieldCheck },
  { name: "Tasks", path: "/tasks", icon: ListChecks },
  { name: "Security Events", path: "/security-events", icon: ShieldAlert },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
            <ShieldCheck size={23} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-wide text-gray-900">
              SENTRAX
            </h1>

            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
              AI Security
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-3 py-6">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-cyan-50 font-medium text-cyan-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <Icon size={19} />
              {link.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-emerald-50 px-4 py-3">
          <Activity size={18} className="text-emerald-600" />

          <div>
            <p className="text-xs font-medium text-emerald-600">
              System Protected
            </p>

            <p className="text-[10px] text-gray-500">
              All systems operational
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}