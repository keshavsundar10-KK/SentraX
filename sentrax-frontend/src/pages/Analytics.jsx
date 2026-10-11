
import {
  Activity,
  ShieldAlert,
  Zap,
  CheckCircle2,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const data = [
  { day: "Mon", allowed: 82, blocked: 8 },
  { day: "Tue", allowed: 95, blocked: 12 },
  { day: "Wed", allowed: 88, blocked: 6 },
  { day: "Thu", allowed: 110, blocked: 15 },
  { day: "Fri", allowed: 125, blocked: 9 },
  { day: "Sat", allowed: 105, blocked: 7 },
  { day: "Sun", allowed: 130, blocked: 11 },
];

export default function Analytics() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-gray-900">
      <Sidebar />

      <div className="ml-64">
        <Navbar />

        <main className="min-h-screen bg-[#f5f7fb] p-8">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-600">
              Performance Intelligence
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Analytics
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Security and performance metrics for autonomous AI agents.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <Activity className="text-cyan-600" size={22} />
              <p className="mt-4 text-sm text-gray-500">Total Actions</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">642</h2>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <CheckCircle2 className="text-emerald-600" size={22} />
              <p className="mt-4 text-sm text-gray-500">Allowed</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">605</h2>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <ShieldAlert className="text-red-600" size={22} />
              <p className="mt-4 text-sm text-gray-500">Blocked</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">37</h2>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <Zap className="text-amber-600" size={22} />
              <p className="mt-4 text-sm text-gray-500">Avg. Latency</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">142ms</h2>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="font-semibold text-gray-900">
                Agent Security Activity
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Allowed versus blocked actions over the last 7 days
              </p>
            </div>

            <div className="flex h-72 items-end justify-between gap-4 border-b border-gray-100 px-2 sm:px-4">
              {data.map((item) => (
                <div
                  key={item.day}
                  className="flex h-full min-w-0 flex-1 items-end justify-center gap-1"
                >
                  <div
                    className="w-3 rounded-t-md bg-cyan-500 transition-opacity hover:opacity-75 sm:w-5"
                    style={{
                      height: `${(item.allowed / 130) * 220}px`,
                    }}
                    title={`Allowed: ${item.allowed}`}
                  />

                  <div
                    className="w-3 rounded-t-md bg-red-400 transition-opacity hover:opacity-75 sm:w-5"
                    style={{
                      height: `${(item.blocked / 15) * 90}px`,
                    }}
                    title={`Blocked: ${item.blocked}`}
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between px-2 sm:px-4">
              {data.map((item) => (
                <span
                  key={item.day}
                  className="text-xs text-gray-500"
                >
                  {item.day}
                </span>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs">
              <span className="flex items-center gap-2 text-gray-600">
                <span className="h-3 w-3 rounded-sm bg-cyan-500" />
                Allowed
              </span>

              <span className="flex items-center gap-2 text-gray-600">
                <span className="h-3 w-3 rounded-sm bg-red-400" />
                Blocked
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
