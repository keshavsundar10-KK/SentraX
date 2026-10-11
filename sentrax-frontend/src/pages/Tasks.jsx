
import {
  Activity,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Search,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const tasks = [
  {
    id: "TASK-001",
    task: "Summarize quarterly report",
    agent: "Document Agent",
    status: "COMPLETED",
    actions: 8,
    risk: "LOW",
    time: "2 min ago",
  },
  {
    id: "TASK-002",
    task: "Extract information from webpage",
    agent: "Browser Agent",
    status: "BLOCKED",
    actions: 5,
    risk: "HIGH",
    time: "8 min ago",
  },
  {
    id: "TASK-003",
    task: "Analyze customer feedback",
    agent: "Analysis Agent",
    status: "RUNNING",
    actions: 12,
    risk: "LOW",
    time: "12 min ago",
  },
  {
    id: "TASK-004",
    task: "Generate project documentation",
    agent: "Writing Agent",
    status: "COMPLETED",
    actions: 15,
    risk: "LOW",
    time: "18 min ago",
  },
  {
    id: "TASK-005",
    task: "Read external API response",
    agent: "API Agent",
    status: "BLOCKED",
    actions: 7,
    risk: "HIGH",
    time: "25 min ago",
  },
];

function StatusBadge({ status }) {
  const styles = {
    COMPLETED: "bg-emerald-50 text-emerald-700",
    BLOCKED: "bg-red-50 text-red-700",
    RUNNING: "bg-cyan-50 text-cyan-700",
  };

  return (
    <span
      className={`rounded-md px-2.5 py-1 text-[10px] font-semibold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

function RiskBadge({ risk }) {
  return (
    <span
      className={`rounded-md border px-2.5 py-1 text-[10px] font-semibold ${
        risk === "HIGH"
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      {risk}
    </span>
  );
}

export default function Tasks() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-gray-900">
      <Sidebar />

      <div className="ml-64">
        <Navbar />

        <main className="min-h-screen bg-[#f5f7fb] p-8">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-600">
              Agent Operations
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Tasks
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Monitor autonomous AI tasks and their security decisions.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <Activity className="text-cyan-600" size={23} />
              <p className="mt-4 text-sm text-gray-500">Active Tasks</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">12</h2>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <CheckCircle2 className="text-emerald-600" size={23} />
              <p className="mt-4 text-sm text-gray-500">Completed</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">91</h2>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <ShieldAlert className="text-red-600" size={23} />
              <p className="mt-4 text-sm text-gray-500">Blocked</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">25</h2>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-100 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">Recent Tasks</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Autonomous agent activity monitored by SentraX
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <Search size={15} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-40 bg-transparent text-xs text-gray-800 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-500">
                    <th className="px-6 py-4 font-medium">TASK</th>
                    <th className="px-6 py-4 font-medium">AGENT</th>
                    <th className="px-6 py-4 font-medium">STATUS</th>
                    <th className="px-6 py-4 font-medium">ACTIONS</th>
                    <th className="px-6 py-4 font-medium">RISK</th>
                    <th className="px-6 py-4 font-medium">TIME</th>
                  </tr>
                </thead>

                <tbody>
                  {tasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-b border-gray-100 transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-gray-900">
                          {task.task}
                        </p>
                        <p className="mt-1 text-[10px] text-gray-400">
                          {task.id}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-xs text-gray-600">
                        {task.agent}
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge status={task.status} />
                      </td>

                      <td className="px-6 py-5 text-xs text-gray-600">
                        {task.actions}
                      </td>

                      <td className="px-6 py-5">
                        <RiskBadge risk={task.risk} />
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock size={14} />
                          {task.time}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
